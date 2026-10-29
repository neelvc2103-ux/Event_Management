import { z } from 'zod';

export const eventFormSchema = z.object({
  eventType: z.enum(['wedding', 'birthday', 'community', 'other'], {
    required_error: 'Please select an event type',
  }),
  eventName: z.string().trim().min(2, 'Event name must be at least 2 characters').max(100, 'Event name cannot exceed 100 characters'),
  eventDate: z.string().refine((val) => {
    const timestamp = Date.parse(val);
    if (isNaN(timestamp)) return false;
    const target = new Date(val);
    const now = new Date();
    // Allow today or recent day buffer (within 48 hours for immediate events), and up to 10 years ahead
    const minDate = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const maxDate = new Date(now.getTime() + 10 * 365.25 * 24 * 60 * 60 * 1000);
    return target >= minDate && target <= maxDate;
  }, {
    message: 'Event date must be a valid upcoming date (within the next 10 years)',
  }),
  guestCount: z.coerce.number().int().min(1, 'Guest count must be at least 1').max(100000, 'Guest count cannot exceed 100,000'),
  city: z.string().trim().min(2, 'City is required').max(100, 'City name cannot exceed 100 characters'),
  locality: z.string().trim().max(100).optional().default(''),
  venueName: z.string().trim().max(120).optional().default(''),
  totalBudget: z.coerce
    .number()
    .min(1000, 'Budget must be at least ₹1,000')
    .max(1000000000, 'Budget cannot exceed ₹100 Crore')
    .refine((val) => Number.isFinite(val), { message: 'Budget must be a finite number' }),
  venueType: z.enum(['indoor', 'outdoor', 'banquet_hall', 'home', 'society_ground'], {
    required_error: 'Please choose a venue type',
  }),
  vibe: z.string().max(500, 'Vibe description cannot exceed 500 characters').default(''),
  presetVibes: z.array(z.string().max(50)).max(10).default([]),
  weddingSubEvents: z.array(z.enum(['engagement', 'mehendi', 'haldi', 'sangeet', 'wedding_ceremony', 'reception'])).optional(),
  communityType: z.string().max(80).optional(),
  birthdayCategory: z.enum(['kids', 'adult']).optional(),
  mustHaves: z.string().max(1000, 'Must-haves cannot exceed 1000 characters').optional().default(''),
  culturalPreferences: z.string().max(1000, 'Cultural preferences cannot exceed 1000 characters').optional().default(''),
  notes: z.string().max(1500, 'Notes cannot exceed 1500 characters').optional().default(''),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;

export const budgetCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  percentage: z.number().min(0).max(100),
  amount: z.number().min(0),
  notes: z.string().default(''),
});

export const budgetOutputSchema = z.object({
  total: z.number().min(0),
  categories: z.array(budgetCategorySchema).min(1),
  savingTips: z.array(z.string()).default([]),
});

export const timelineItemSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  phase: z.string().max(100),
  daysBeforeEvent: z.number(),
  dueDate: z.string(),
  task: z.string().max(500),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  completed: z.boolean().optional(),
});

export const vendorItemSchema = z.object({
  id: z.string().optional(),
  category: z.string().max(100),
  estimatedCost: z.number().min(0),
  actualCost: z.number().min(0).optional(),
  bookBy: z.string(),
  checklist: z.array(z.string()).default([]),
  questionsToAsk: z.array(z.string()).default([]),
  isBooked: z.boolean().optional(),
  notes: z.string().optional(),
  vendorName: z.string().max(120).optional(),
  vendorAddress: z.string().max(200).optional(),
  vendorPhone: z.string().max(30).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  verifiedBadge: z.string().max(80).optional(),
  specialty: z.string().max(150).optional(),
  imageUrl: z.string().optional(),
  paymentMilestones: z.object({
    advanceToken: z.number(),
    midWay: z.number(),
    finalSettlement: z.number(),
    advancePaid: z.boolean().optional(),
    midWayPaid: z.boolean().optional(),
    finalPaid: z.boolean().optional(),
  }).optional(),
}).passthrough();

export const themeItemSchema = z.object({
  name: z.string().max(100),
  description: z.string().max(600),
  imageUrl: z.string().optional(),
  palette: z.array(z.string()).optional(),
}).passthrough();

export const ideasOutputSchema = z.object({
  themes: z.array(themeItemSchema).default([]),
  decor: z.array(z.string().max(400)).default([]),
  menu: z.array(z.string().max(400)).default([]),
  entertainment: z.array(z.string().max(400)).default([]),
  giftsAndFavors: z.array(z.string().max(400)).default([]),
}).passthrough();

export const realVenueDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  locality: z.string(),
  city: z.string(),
  capacity: z.string(),
  pricingTier: z.enum(['Budget', 'Mid-Range', 'Premium', 'Luxury']),
  address: z.string(),
  rating: z.number(),
  highlights: z.array(z.string()),
  mapsQuery: z.string(),
  imageUrl: z.string().optional(),
  distanceInfo: z.string().optional(),
  parkingSpots: z.number().optional(),
}).passthrough();

export const runOfShowItemSchema = z.object({
  id: z.string(),
  time: z.string(),
  eventTitle: z.string(),
  description: z.string(),
  location: z.string(),
  coordinator: z.string(),
  phone: z.string().optional(),
  completed: z.boolean().optional(),
  urgentNote: z.string().optional(),
}).passthrough();

export const guestStatsSchema = z.object({
  totalExpected: z.number(),
  confirmed: z.number(),
  pending: z.number(),
  dietary: z.object({
    jain: z.number(),
    pureVeg: z.number(),
    regular: z.number(),
  }),
  vipCount: z.number(),
}).passthrough();

export const muhuratDetailsSchema = z.object({
  shubhMuhurat: z.string(),
  nakshatra: z.string(),
  ritualsOrder: z.array(z.string()),
  priestGuidelines: z.string(),
}).passthrough();

export const civicComplianceSchema = z.object({
  soundCurfew: z.string(),
  municipalOffice: z.string(),
  flowerMarket: z.string(),
  fireNocRequired: z.boolean(),
}).passthrough();

export const llmPlanOutputSchema = z.object({
  summary: z.string().min(10),
  budget: budgetOutputSchema,
  timeline: z.array(timelineItemSchema).min(1),
  vendors: z.array(vendorItemSchema).min(1),
  ideas: ideasOutputSchema,
  venueDetails: realVenueDetailsSchema.optional(),
  muhuratDetails: muhuratDetailsSchema.optional(),
  civicCompliance: civicComplianceSchema.optional(),
  runOfShow: z.array(runOfShowItemSchema).optional(),
  guestStats: guestStatsSchema.optional(),
}).passthrough();

export type LLMPlanOutput = z.infer<typeof llmPlanOutputSchema>;

export const eventPlanSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  formData: eventFormSchema,
  summary: z.string(),
  budget: budgetOutputSchema,
  timeline: z.array(timelineItemSchema),
  vendors: z.array(vendorItemSchema),
  ideas: ideasOutputSchema,
  venueDetails: realVenueDetailsSchema.optional(),
  muhuratDetails: muhuratDetailsSchema.optional(),
  civicCompliance: civicComplianceSchema.optional(),
  runOfShow: z.array(runOfShowItemSchema).optional(),
  guestStats: guestStatsSchema.optional(),
}).passthrough();

export const regenerateRequestSchema = z.object({
  plan: eventPlanSchema,
  section: z.enum(['themes', 'decor', 'menu', 'entertainment', 'giftsAndFavors']),
  userFeedback: z.string().max(500).optional(),
});

export const chatRequestSchema = z.object({
  plan: eventPlanSchema,
  message: z.string().trim().min(1, 'Message cannot be empty').max(1000, 'Message cannot exceed 1000 characters'),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(2000),
    })
  ).max(30).optional().default([]),
});

