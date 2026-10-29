export type EventType = 'wedding' | 'birthday' | 'community' | 'other';

export type VenueType = 
  | 'indoor' 
  | 'outdoor' 
  | 'banquet_hall' 
  | 'home' 
  | 'society_ground';

export type WeddingSubEvent = 
  | 'engagement' 
  | 'mehendi' 
  | 'haldi' 
  | 'sangeet' 
  | 'wedding_ceremony' 
  | 'reception';

export type CommunityEventType = 
  | 'ganesh_utsav' 
  | 'navratri_garba' 
  | 'diwali_milan' 
  | 'society_annual_day' 
  | 'college_fest' 
  | 'other_community';

export type BirthdayCategory = 'kids' | 'adult';

export interface RealVenueDetails {
  id: string;
  name: string;
  type: string;
  locality: string;
  city: string;
  capacity: string;
  pricingTier: 'Budget' | 'Mid-Range' | 'Premium' | 'Luxury';
  address: string;
  rating: number;
  highlights: string[];
  mapsQuery: string;
  imageUrl?: string;
  distanceInfo?: string;
  parkingSpots?: number;
}

export interface EventFormData {
  eventType: EventType;
  eventName: string;
  eventDate: string; // YYYY-MM-DD
  guestCount: number;
  city: string;
  locality?: string;
  venueName?: string;
  totalBudget: number; // in INR
  venueType: VenueType;
  vibe: string;
  presetVibes: string[];
  weddingSubEvents?: string[];
  communityType?: string;
  birthdayCategory?: BirthdayCategory;
  mustHaves?: string;
  culturalPreferences?: string;
  notes?: string;
}

export interface BudgetCategory {
  id?: string;
  name: string;
  percentage: number;
  amount: number;
  notes: string;
}

export interface BudgetData {
  total: number;
  categories: BudgetCategory[];
  savingTips: string[];
}

export interface TimelineTask {
  id: string;
  phase: string;
  daysBeforeEvent: number;
  dueDate: string; // YYYY-MM-DD or ISO
  task: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

export interface VendorItem {
  id?: string;
  category: string;
  estimatedCost: number;
  actualCost?: number;
  bookBy: string; // YYYY-MM-DD or ISO
  checklist: string[];
  questionsToAsk: string[];
  isBooked?: boolean;
  notes?: string;
  // Real Indian Vendor Details
  vendorName?: string;
  vendorAddress?: string;
  vendorPhone?: string;
  rating?: number;
  reviewCount?: number;
  verifiedBadge?: string;
  specialty?: string;
  imageUrl?: string;
  paymentMilestones?: {
    advanceToken: number;
    midWay: number;
    finalSettlement: number;
    advancePaid?: boolean;
    midWayPaid?: boolean;
    finalPaid?: boolean;
  };
}

export interface IdeaTheme {
  name: string;
  description: string;
  imageUrl?: string;
  palette?: string[];
}

export interface RunOfShowItem {
  id: string;
  time: string;
  eventTitle: string;
  description: string;
  location: string;
  coordinator: string;
  phone?: string;
  completed?: boolean;
  urgentNote?: string;
}

export interface GuestStats {
  totalExpected: number;
  confirmed: number;
  pending: number;
  dietary: {
    jain: number;
    pureVeg: number;
    regular: number;
  };
  vipCount: number;
}

export interface IdeasData {
  themes: IdeaTheme[];
  decor: string[];
  menu: string[];
  entertainment: string[];
  giftsAndFavors: string[];
}

export interface MuhuratDetails {
  shubhMuhurat: string;
  nakshatra: string;
  ritualsOrder: string[];
  priestGuidelines: string;
}

export interface CivicComplianceDetails {
  soundCurfew: string;
  municipalOffice: string;
  flowerMarket: string;
  fireNocRequired: boolean;
}

export interface LLMPlanOutput {
  summary: string;
  budget: BudgetData;
  timeline: TimelineTask[];
  vendors: VendorItem[];
  ideas: IdeasData;
  venueDetails?: RealVenueDetails;
  muhuratDetails?: MuhuratDetails;
  civicCompliance?: CivicComplianceDetails;
  runOfShow?: RunOfShowItem[];
  guestStats?: GuestStats;
}

export interface EventPlan {
  id: string;
  createdAt: string;
  updatedAt: string;
  formData: EventFormData;
  summary: string;
  budget: BudgetData;
  timeline: TimelineTask[];
  vendors: VendorItem[];
  ideas: IdeasData;
  venueDetails?: RealVenueDetails;
  muhuratDetails?: MuhuratDetails;
  civicCompliance?: CivicComplianceDetails;
  runOfShow?: RunOfShowItem[];
  guestStats?: GuestStats;
}

export type IdeaSectionKey = 'themes' | 'decor' | 'menu' | 'entertainment' | 'giftsAndFavors';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  appliedChangesSummary?: string;
}
