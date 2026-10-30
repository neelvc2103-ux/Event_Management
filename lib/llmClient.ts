import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventFormData, EventPlan, IdeaSectionKey, LLMPlanOutput } from '@/types';
import { llmPlanOutputSchema } from './schemas';
import {
  SYSTEM_PROMPT,
  CHAT_SYSTEM_PROMPT,
  buildEventPlanPrompt,
  buildRegeneratePrompt,
} from './prompts';
import { recomputeAmounts } from './budgetMath';
import { calculateTimelineDates } from './dateUtils';
import { generateMockEventPlan } from './mockPlanGenerator';

/**
 * Extracts raw JSON from an LLM response string even if it includes markdown fences or commentary.
 */
export function extractJsonFromText(rawText: string): string {
  let cleaned = rawText.trim();

  // Strip code block fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

/**
 * Low-level call to Anthropic Claude
 */
async function callAnthropic(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const anthropic = new Anthropic({ apiKey });
  const model = process.env.LLM_MODEL || 'claude-3-5-sonnet-20241022';

  const response = await anthropic.messages.create({
    model,
    max_tokens: 4000,
    temperature: 0.7,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const contentBlock = response.content[0];
  if (contentBlock.type !== 'text') {
    throw new Error('Unexpected non-text response from Anthropic Claude');
  }

  return contentBlock.text;
}

/**
 * Low-level call to Google Gemini
 */
async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4000,
    },
  });

  const result = await model.generateContent(userPrompt);
  const response = await result.response;
  return response.text();
}

/**
 * Executes a call to the active LLM provider (Anthropic by default, or Gemini)
 */
async function executeLlmCall(systemPrompt: string, userPrompt: string): Promise<string> {
  const provider = (process.env.LLM_PROVIDER || 'anthropic').toLowerCase();

  if (provider === 'gemini') {
    return callGemini(systemPrompt, userPrompt);
  } else {
    // Anthropic is default
    return callAnthropic(systemPrompt, userPrompt);
  }
}

/**
 * Generates the complete event plan, handling retries, schema validation,
 * budget rebalancing, and timeline date alignment.
 */
export async function generateFullEventPlan(formData: EventFormData): Promise<LLMPlanOutput> {
  const userPrompt = buildEventPlanPrompt(formData);

  let rawResponseText = '';
  let parsedJson: any = null;
  let validationError: string | null = null;

  // Attempt 1: Primary LLM call
  try {
    rawResponseText = await executeLlmCall(SYSTEM_PROMPT, userPrompt);
    const cleaned = extractJsonFromText(rawResponseText);
    parsedJson = JSON.parse(cleaned);

    const validated = llmPlanOutputSchema.safeParse(parsedJson);
    if (!validated.success) {
      validationError = validated.error.message;
      throw new Error(`Schema validation failed: ${validationError}`);
    }
    parsedJson = validated.data;
  } catch (err: any) {
    // If the error was missing API key, immediately use intelligent mock generator
    if (
      err.message?.includes('not configured') ||
      err.message?.includes('API_KEY') ||
      err.message?.includes('apiKey')
    ) {
      console.warn('[AYOJA] API key not found. Using intelligent Indian domain mock plan generator.');
      return generateMockEventPlan(formData);
    }

    // Attempt 2: Retry once with the error message appended
    console.warn(`[AYOJA] LLM attempt 1 failed (${err.message}). Retrying with error correction...`);
    try {
      const retryPrompt = `${userPrompt}\n\nIMPORTANT: Your previous output had an issue: ${err.message}. Please fix it and output ONLY strictly valid JSON matching the schema with no markdown.`;
      rawResponseText = await executeLlmCall(SYSTEM_PROMPT, retryPrompt);
      const cleaned = extractJsonFromText(rawResponseText);
      parsedJson = JSON.parse(cleaned);

      const validated = llmPlanOutputSchema.safeParse(parsedJson);
      if (!validated.success) {
        throw new Error(`Validation failed on retry: ${validated.error.message}`);
      }
      parsedJson = validated.data;
    } catch (retryErr: any) {
      console.error('[AYOJA] LLM generation failed after retry. Falling back to authentic domain template.', retryErr);
      return generateMockEventPlan(formData);
    }
  }

  // POST-PROCESSING RULES:
  // 1. Recompute budget amounts in code to guarantee sum(amounts) === totalBudget
  const guaranteedBudget = recomputeAmounts(parsedJson.budget.categories, formData.totalBudget);
  parsedJson.budget.categories = guaranteedBudget;
  parsedJson.budget.total = formData.totalBudget;

  // 2. Calculate timeline dates backward from eventDate, ensuring no past dates and compressing if tight
  const timelineResult = calculateTimelineDates(parsedJson.timeline, formData.eventDate);
  parsedJson.timeline = timelineResult.timeline;

  // If compression was applied, append notification to summary
  if (timelineResult.wasCompressed && timelineResult.compressionNotice) {
    parsedJson.summary = `${parsedJson.summary}\n\n[Timeline Notice: ${timelineResult.compressionNotice}]`;
  }

  // 3. Enrich with real city venues, vendors, and civic compliance
  const cityData = (await import('./realIndiaDatabase')).getRealCityData(formData.city);
  if (!parsedJson.venueDetails) {
    parsedJson.venueDetails = cityData.venues[0];
  }
  if (!parsedJson.civicCompliance) {
    parsedJson.civicCompliance = {
      soundCurfew: cityData.policeSoundCurfewRules,
      municipalOffice: cityData.municipalOfficeName,
      flowerMarket: cityData.flowerMarketName,
      fireNocRequired: formData.guestCount >= 200 || formData.venueType === 'society_ground',
    };
  }
  if (formData.eventType === 'wedding' && !parsedJson.muhuratDetails) {
    parsedJson.muhuratDetails = {
      shubhMuhurat: '11:42 AM - 01:15 PM (Auspicious Godhuli / Abhijit Muhurat)',
      nakshatra: 'Hasta Nakshatra (Favorable for everlasting prosperity & marital bliss)',
      ritualsOrder: [
        'Ganesh Puja & Mandap Ropan (Morning 08:30 AM)',
        'Baraat / Varghodo Arrival (10:30 AM)',
        'Jaimala & Kanya Daan (11:15 AM)',
        'Hastamelap & Pheras (11:45 AM - 12:45 PM)',
        'Ashirwad & Royal Wedding Feast (01:00 PM onwards)',
      ],
      priestGuidelines: 'Panditji will coordinate for dry samagri inspection 24 hours prior.',
    };
  }

  // Enrich vendors with real local details if missing
  parsedJson.vendors = parsedJson.vendors.map((vendor: any, idx: number) => {
    const matchedVendor = cityData.topVendors[idx % cityData.topVendors.length];
    return {
      ...vendor,
      vendorName: vendor.vendorName || matchedVendor?.name || `${formData.city} Verified Vendor`,
      vendorAddress: vendor.vendorAddress || matchedVendor?.address || `${formData.city}`,
      vendorPhone: vendor.vendorPhone || matchedVendor?.phone || '+91 98200 XXXXX',
      rating: vendor.rating || matchedVendor?.rating || 4.8,
      reviewCount: vendor.reviewCount || matchedVendor?.reviewCount || 150,
      verifiedBadge: vendor.verifiedBadge || matchedVendor?.verifiedBadge || 'Verified Local Vendor',
      specialty: vendor.specialty || matchedVendor?.specialty || vendor.category,
    };
  });

  return parsedJson;
}

/**
 * Regenerates a specific section of Ideas
 */
export async function regenerateIdeaSection(
  plan: EventPlan,
  section: IdeaSectionKey,
  userFeedback?: string
): Promise<any> {
  const prompt = buildRegeneratePrompt(
    `${plan.formData.eventName} in ${plan.formData.city}`,
    section,
    plan.formData.eventType,
    userFeedback
  );

  try {
    const raw = await executeLlmCall(SYSTEM_PROMPT, prompt);
    const cleaned = extractJsonFromText(raw);
    const parsed = JSON.parse(cleaned);
    if (parsed[section]) {
      return parsed[section];
    }
    return parsed;
  } catch (err: any) {
    console.warn('[AYOJA] Regenerate LLM call failed or offline; synthesizing smart alternative.', err.message);
    // Intelligent fallback for section
    if (section === 'themes') {
      return [
        { name: 'Saffron & Jasmine Royale', description: 'Deep marigold hues paired with white mogra accents, brass chandeliers, and temple-inspired carved backdrops.' },
        { name: 'Modern Minimalist Ivory & Gold', description: 'Crisp ivory drapes with warm fairy canopy, geometric gold structures, and subtle baby breath florals.' },
        { name: 'Festive Carnivalesque', description: 'Multi-hued vibrant umbrellas, wooden carts with earthen matkas, and lively ambient string lighting.' },
      ];
    }
    if (section === 'decor') {
      return [
        'Illuminated entrance pathway lined with brass urli bowls filled with rose petals and floating candles',
        'Traditional floral mandap/stage framed with fresh genda phool and fragrant tuberoses',
        'Whimsical photobooth corner with neon quote sign and vintage brass swing',
        'Festive low-seating lounge with silk bolsters and vibrant block-printed cushions',
      ];
    }
    if (section === 'menu') {
      return [
        'Live street food counter: Pani Puri with 3 flavored waters, Dahi Papdi Chaat, and Matar Kulcha',
        'Grand regional banquet: Shahi Paneer, Dal Bukhara, Subz Biryani with Burani Raita, and assorted stuffed naans',
        'Dessert studio: Hot Malpua with thick Rabri, Gulab Jamun fondue, and Kulfi Falooda',
        'Beverage counter: Masala Chai, tender coconut water, and saffron badam milk',
      ];
    }
    if (section === 'entertainment') {
      return [
        'Live acoustic Sufi / Bollywood fusion band for the banquet dinner',
        'Interactive emcee hosting lively family trivia and couple games',
        'High-energy live Punjabi Dhol & Tasha troupe to inaugurate the festivities',
        'Personalized 360-degree video booth with festive props and instant QR download',
      ];
    }
    if (section === 'giftsAndFavors') {
      return [
        'Handcrafted Meenakari brass dry fruit jar sets with royal crest packaging',
        'Scented organic soy wax candles infused with Indian sandalwood and jasmine',
        'Eco-friendly seed-embedded bookmarks and artisanal roasted nuts pouch',
        'Hand-painted wooden coasters crafted by local regional artisans',
      ];
    }
    return [];
  }
}

/**
 * Handles conversational queries or instructions in the Plan Assistant Chat
 */
export async function handleAssistantChat(
  plan: EventPlan,
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ reply: string; updatedPlan?: EventPlan }> {
  const planContext = `CURRENT ACTIVE EVENT PLAN:
Event: ${plan.formData.eventName} (${plan.formData.eventType})
Date: ${plan.formData.eventDate}
City: ${plan.formData.city}
Budget Total: ₹${plan.budget.total.toLocaleString('en-IN')}
Budget Categories:
${plan.budget.categories.map((c) => `- ${c.name}: ₹${c.amount.toLocaleString('en-IN')} (${c.percentage}%)`).join('\n')}
Timeline Milestones: ${plan.timeline.length} tasks scheduled
Vendors: ${plan.vendors.map((v) => v.category).join(', ')}`;

  const prompt = `${planContext}

CONVERSATION HISTORY:
${history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join('\n')}

USER QUESTION OR REQUEST:
"${userMessage}"

Respond thoughtfully with helpful, culturally savvy Indian event planning advice. If the user asked to change or update their plan (e.g. reduce budget, add vendor, change theme), provide your explanation and also include a JSON block in <PLAN_UPDATE>{"budget": ..., "timeline": ..., "vendors": ..., "ideas": ...}</PLAN_UPDATE> if applicable.`;

  try {
    const rawReply = await executeLlmCall(CHAT_SYSTEM_PROMPT, prompt);

    // Check if reply contains <PLAN_UPDATE>
    let updatedPlan: EventPlan | undefined = undefined;
    const match = rawReply.match(/<PLAN_UPDATE>([\s\S]*?)<\/PLAN_UPDATE>/);
    let cleanReply = rawReply;

    if (match) {
      try {
        const patch = JSON.parse(match[1].trim());
        updatedPlan = {
          ...plan,
          updatedAt: new Date().toISOString(),
          budget: patch.budget ? { ...plan.budget, ...patch.budget } : plan.budget,
          timeline: patch.timeline || plan.timeline,
          vendors: patch.vendors || plan.vendors,
          ideas: patch.ideas ? { ...plan.ideas, ...patch.ideas } : plan.ideas,
        };
        cleanReply = rawReply.replace(/<PLAN_UPDATE>[\s\S]*?<\/PLAN_UPDATE>/, '').trim();
      } catch (e) {
        console.warn('Failed to parse PLAN_UPDATE patch from chat:', e);
      }
    }

    return { reply: cleanReply, updatedPlan };
  } catch (err: any) {
    console.warn('[AYOJA] Chat Assistant offline or no API key, providing helpful local response.', err.message);
    
    // Provide a smart local response
    const lower = userMessage.toLowerCase();
    if (lower.includes('cheaper') || lower.includes('reduce') || lower.includes('discount') || lower.includes('save')) {
      return {
        reply: `Here are 3 high-impact ways to optimize expenses for your ${plan.formData.eventType} in ${plan.formData.city}:\n\n1. **Venue & Timing**: Shifting celebrations from a weekend evening to a Saturday morning or Sunday brunch slot can negotiate a 15–20% venue discount.\n2. **Floral Repurposing**: Reuse the morning Haldi/Puja marigold florals for evening entryway accents instead of purchasing separate sets.\n3. **Menu Rationalization**: Limit live dessert stations to 2 crowd-favorite items (e.g. hot Jalebi-Rabri and Gulab Jamun) rather than 6 elaborate items.\n\nYou can also use the interactive sliders in the **Budget tab** anytime to customize and lock category percentages!`,
      };
    }

    if (lower.includes('vendor') || lower.includes('book') || lower.includes('caterer') || lower.includes('pandit')) {
      return {
        reply: `For vendors in ${plan.formData.city}, ensure you sign a written milestone contract. Never pay more than 20% advance upon signing, 60% on event morning, and the remaining 20% post-event once all items are delivered.\n\nCheck the **Vendors tab** to track your actual spend vs estimated costs!`,
      };
    }

    return {
      reply: `I'm here to help fine-tune your ${plan.formData.eventType} in ${plan.formData.city}! You can ask me to suggest budget optimizations, recommend regional catering menus, give advice on municipal or society permissions, or suggest unique themes. Feel free to explore and edit your plan across all tabs!`,
    };
  }
}
