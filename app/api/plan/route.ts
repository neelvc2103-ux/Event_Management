import { NextRequest, NextResponse } from 'next/server';
import { eventFormSchema } from '@/lib/schemas';
import { generateFullEventPlan } from '@/lib/llmClient';
import { checkRateLimit, sanitizeInput } from '@/lib/rateLimit';
import { EventPlan } from '@/types';

// Max body size check (approx 500KB)
const MAX_BODY_BYTES = 500 * 1024;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const rateLimit = checkRateLimit(req, 15, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait before generating another plan.',
          resetInSec: rateLimit.resetInSec,
        },
        { status: 429 }
      );
    }

    // 2. Content Length Check
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Payload too large. Please shorten your descriptions.' },
        { status: 413 }
      );
    }

    const rawBody = await req.json();

    // 3. Sanitize text fields
    const sanitizedBody = {
      ...rawBody,
      eventName: sanitizeInput(rawBody.eventName, 100),
      city: sanitizeInput(rawBody.city, 100),
      vibe: sanitizeInput(rawBody.vibe || '', 500),
      mustHaves: sanitizeInput(rawBody.mustHaves || '', 500),
      culturalPreferences: sanitizeInput(rawBody.culturalPreferences || '', 500),
      notes: sanitizeInput(rawBody.notes || '', 1000),
    };

    // 4. Zod Schema Validation
    const validation = eventFormSchema.safeParse(sanitizedBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid form input',
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const formData = validation.data;

    // 5. LLM Call with 30-Second Timeout Guarantee
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('LLM generation timed out after 30 seconds')), 30000)
    );

    const planPromise = generateFullEventPlan(formData);
    const generatedPlan = await Promise.race([planPromise, timeoutPromise]);

    const now = new Date().toISOString();
    const finalPlan: EventPlan = {
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      formData,
      summary: generatedPlan.summary,
      budget: generatedPlan.budget,
      timeline: generatedPlan.timeline,
      vendors: generatedPlan.vendors,
      ideas: generatedPlan.ideas,
      venueDetails: generatedPlan.venueDetails,
      muhuratDetails: generatedPlan.muhuratDetails,
      civicCompliance: generatedPlan.civicCompliance,
    };

    return NextResponse.json(finalPlan, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/plan] Error generating plan:', error);
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred while planning your event.',
      },
      { status: 500 }
    );
  }
}
