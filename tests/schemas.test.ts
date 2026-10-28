import { describe, it, expect } from 'vitest';
import {
  eventFormSchema,
  chatRequestSchema,
  regenerateRequestSchema,
  eventPlanSchema,
} from '../lib/schemas';

describe('Zod Schemas & Parameter Validation', () => {
  const validEventFormData = {
    eventName: 'Meera & Rohan Grand Sangeet',
    eventType: 'wedding' as const,
    eventDate: '2027-02-20',
    city: 'Jaipur',
    locality: 'Amer Road',
    guestCount: 300,
    totalBudget: 2500000, // ₹25 Lakhs
    venueType: 'banquet_hall' as const,
    vibe: 'Royal Rajputana heritage with acoustic folk and marigold floral canopy',
    presetVibes: ['Royal & Heritage', 'Traditional'],
    weddingSubEvents: ['sangeet' as const, 'wedding_ceremony' as const],
    mustHaves: 'Live folk singers, Kachori chaat counter, Photo booth',
    culturalPreferences: 'Rajasthani Marwari traditional rituals',
    notes: 'Please plan for pure vegetarian dining',
  };

  const validFullPlan = {
    id: 'plan-full-1',
    createdAt: '2026-10-27T12:00:00Z',
    updatedAt: '2026-10-27T12:00:00Z',
    formData: validEventFormData,
    summary: 'A bespoke royal heritage wedding celebration in Jaipur with complete Marwari customs.',
    budget: {
      total: 2500000,
      categories: [
        { name: 'Catering', percentage: 40, amount: 1000000, notes: 'Royal Rajasthani buffet' },
        { name: 'Venue', percentage: 30, amount: 750000, notes: 'Heritage Haveli courtyard' },
        { name: 'Decor', percentage: 20, amount: 500000, notes: 'Marigold & diya installations' },
        { name: 'Music', percentage: 10, amount: 250000, notes: 'Manganiyar folk artists' },
      ],
      savingTips: ['Book off-season discount on hotel rooms', 'Combine mehendi and sangeet stages'],
    },
    timeline: [
      {
        id: 'task-1',
        phase: '3 Months Before',
        daysBeforeEvent: 90,
        dueDate: '2026-11-22',
        task: 'Book heritage haveli venue',
        priority: 'high' as const,
        completed: false,
      },
    ],
    vendors: [
      {
        id: 'v-1',
        category: 'Catering',
        estimatedCost: 1000000,
        actualCost: 980000,
        bookBy: '60 days before',
        isBooked: true,
        checklist: ['Tasting session', 'Confirm pure veg kitchen separation'],
        questionsToAsk: ['Do you provide live counter setup tables?'],
      },
    ],
    ideas: {
      themes: [{ name: 'Rajputana Regal', description: 'Royal palace style with brass lamps' }],
      decor: ['Marigold torans', 'Rajasthani puppets'],
      menu: ['Dal Baati Churma', 'Ker Sangri', 'Ghevar'],
      entertainment: ['Manganiyar singers', 'Ghoomar dancers'],
      giftsAndFavors: ['Bandhani dupattas', 'Handmade brass candleholders'],
    },
    venueDetails: {
      id: 'venue-1',
      name: 'Chomu Palace Heritage Hotel',
      type: 'Heritage Palace',
      locality: 'Amer Road',
      city: 'Jaipur',
      capacity: '400 guests',
      pricingTier: 'Premium' as const,
      address: 'Amer-Chomu Road, Jaipur, Rajasthan',
      rating: 4.8,
      highlights: ['Historic Darbar Hall', 'Central Marble Courtyard', 'Royal Suites'],
      mapsQuery: 'Chomu Palace Jaipur',
    },
    muhuratDetails: {
      shubhMuhurat: 'Godhuli Bela (5:45 PM – 7:15 PM)',
      nakshatra: 'Rohini',
      ritualsOrder: ['Ganesh Sthapana', 'Var Satkar', 'Kanyadaan', 'Pheras'],
      priestGuidelines: 'Arrange 2 kg ghee, pure cow milk, and fresh mango leaves for the havan.',
    },
    civicCompliance: {
      soundCurfew: '10:00 PM strict ban on outdoor loudspeakers per Rajasthan Police guidelines',
      municipalOffice: 'Jaipur Municipal Corporation Heritage Zone',
      flowerMarket: 'Phool Mandi, Chhoti Chaupar, Jaipur',
      fireNocRequired: true,
    },
  };

  describe('eventFormSchema', () => {
    it('validates a valid Indian event form dataset', () => {
      const result = eventFormSchema.safeParse(validEventFormData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.eventName).toBe('Meera & Rohan Grand Sangeet');
        expect(result.data.totalBudget).toBe(2500000);
      }
    });

    it('rejects an event date in the past', () => {
      const invalidData = {
        ...validEventFormData,
        eventDate: '2020-01-01',
      };
      const result = eventFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Event date must be a valid upcoming date');
      }
    });

    it('rejects an event date more than 10 years in the future', () => {
      const invalidData = {
        ...validEventFormData,
        eventDate: '2045-01-01',
      };
      const result = eventFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Event date must be a valid upcoming date');
      }
    });

    it('rejects negative or zero guest count', () => {
      const zeroGuests = { ...validEventFormData, guestCount: 0 };
      expect(eventFormSchema.safeParse(zeroGuests).success).toBe(false);

      const negativeGuests = { ...validEventFormData, guestCount: -50 };
      expect(eventFormSchema.safeParse(negativeGuests).success).toBe(false);
    });

    it('rejects unrealistically large guest count (> 100,000)', () => {
      const hugeGuests = { ...validEventFormData, guestCount: 150000 };
      const result = eventFormSchema.safeParse(hugeGuests);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Guest count cannot exceed 100,000');
      }
    });

    it('rejects budget below ₹1,000 or above ₹100 Crore', () => {
      const tooLow = { ...validEventFormData, totalBudget: 500 };
      expect(eventFormSchema.safeParse(tooLow).success).toBe(false);

      const tooHigh = { ...validEventFormData, totalBudget: 2000000000 }; // ₹200 Cr
      expect(eventFormSchema.safeParse(tooHigh).success).toBe(false);
    });

    it('enforces string length constraints against prompt payload flooding', () => {
      const oversizedName = {
        ...validEventFormData,
        eventName: 'A'.repeat(150),
      };
      expect(eventFormSchema.safeParse(oversizedName).success).toBe(false);

      const oversizedVibe = {
        ...validEventFormData,
        vibe: 'X'.repeat(600),
      };
      expect(eventFormSchema.safeParse(oversizedVibe).success).toBe(false);
    });
  });

  describe('chatRequestSchema', () => {
    it('validates a proper chat payload with conversation history', () => {
      const payload = {
        plan: validFullPlan,
        message: 'How can I save ₹2,00,000 on catering without lowering food quality?',
        conversationHistory: [
          { role: 'user' as const, content: 'Hello' },
          { role: 'assistant' as const, content: 'Namaste! How can I help?' },
        ],
      };

      const result = chatRequestSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects empty or whitespace-only messages', () => {
      const payload = {
        plan: validFullPlan,
        message: '   ',
      };

      const result = chatRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects messages longer than 1,000 characters', () => {
      const payload = {
        plan: validFullPlan,
        message: 'A'.repeat(1200),
      };

      const result = chatRequestSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('regenerateRequestSchema', () => {
    it('accepts all valid regenerate section names', () => {
      const validSections = [
        'themes',
        'decor',
        'menu',
        'entertainment',
        'giftsAndFavors',
      ] as const;

      validSections.forEach((section) => {
        const result = regenerateRequestSchema.safeParse({
          plan: validFullPlan,
          section,
          userFeedback: 'Please add a live shehnai artist',
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects unrecognized section identifiers', () => {
      const result = regenerateRequestSchema.safeParse({
        plan: validFullPlan,
        section: 'malicious_system_override' as any,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('eventPlanSchema', () => {
    it('validates a full Indian event plan with venue and compliance details', () => {
      const result = eventPlanSchema.safeParse(validFullPlan);
      expect(result.success).toBe(true);
    });
  });
});
