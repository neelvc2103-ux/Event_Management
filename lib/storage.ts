import { EventFormData, EventPlan } from '@/types';
import { generateMockEventPlan } from './mockPlanGenerator';

const PLANS_STORAGE_KEY = 'eventcraft_plans_v1';
const ACTIVE_PLAN_KEY = 'eventcraft_active_plan_id';

export const SAMPLE_INPUTS: Record<string, EventFormData> = {
  gujarati_wedding: {
    eventType: 'wedding',
    eventName: 'Aarav & Diya’s Gujarati Wedding',
    eventDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    guestCount: 350,
    city: 'Bhuj',
    locality: 'Mirzapar Road',
    venueName: 'Regenta Resort Bhuj by Royal Orchid',
    totalBudget: 1500000, // ₹15 Lakhs
    venueType: 'banquet_hall',
    vibe: 'Traditional Gujarati elegance with vibrant Dandiya Sangeet, Jain catering counters, and royal mandap setup.',
    presetVibes: ['Traditional', 'Royal', 'Fun'],
    weddingSubEvents: ['engagement', 'mehendi', 'haldi', 'sangeet', 'wedding_ceremony', 'reception'],
    mustHaves: 'Strict pure-vegetarian & Jain food counters, authentic live Dhol-Tasha, and grand Toran mandap entry.',
    culturalPreferences: 'Gujarati traditions (Lagna Geet, Hastamelap, Kanya Daan), auspicious afternoon muhurat, and silver coin return gifts.',
    notes: 'Bride’s family arriving from Ahmedabad; need organized guest shuttle from Bhuj airport/station.',
  },
  kids_birthday: {
    eventType: 'birthday',
    eventName: 'Reyansh’s 5th Jungle Safari Birthday',
    eventDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    guestCount: 40,
    city: 'Pune',
    locality: 'Baner',
    venueName: 'Rohan Club & Society Ground Baner',
    totalBudget: 30000, // ₹30,000
    venueType: 'society_ground',
    vibe: 'Fun, colorful Jungle Safari with balloon animals, live games, and cartoon mascot.',
    presetVibes: ['Fun', 'Modern'],
    birthdayCategory: 'kids',
    mustHaves: '2-tier eggless jungle animal cake, interactive magic show, and animal-themed return hampers.',
    culturalPreferences: 'All vegetarian finger foods, zero nuts due to allergy precautions.',
    notes: 'Party from 5:00 PM to 8:00 PM in society clubhouse.',
  },
  ganesh_utsav: {
    eventType: 'community',
    eventName: 'Gokuldham Society Ganesh Utsav 2026',
    eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    guestCount: 500,
    city: 'Mumbai',
    locality: 'Goregaon East',
    venueName: 'Gokuldham Ground & Cultural Hall',
    totalBudget: 200000, // ₹2 Lakhs
    venueType: 'society_ground',
    vibe: 'Vibrant spiritual festivities, eco-friendly Clay Ganesha, daily cultural Aarti, and grand Mahaprasad.',
    presetVibes: ['Traditional', 'Eco-friendly'],
    communityType: 'ganesh_utsav',
    mustHaves: 'Eco-friendly Shadu Mati idol, BMC & Police sound permission clearance, fire extinguishers, and silent generator.',
    culturalPreferences: 'Daily morning/evening Dhol Aarti, satvik prasad, zero single-use plastic, and child drawing competition.',
    notes: 'Need strict adherence to 10:00 PM police sound curfew.',
  },
};

/**
 * Creates a complete initial EventPlan from a sample form input
 */
export function createSamplePlan(sampleKey: keyof typeof SAMPLE_INPUTS): EventPlan {
  const formData = SAMPLE_INPUTS[sampleKey];
  const generated = generateMockEventPlan(formData);
  const now = new Date().toISOString();

  return {
    id: `plan-${sampleKey}-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    formData,
    summary: generated.summary,
    budget: generated.budget,
    timeline: generated.timeline,
    vendors: generated.vendors,
    ideas: generated.ideas,
    venueDetails: generated.venueDetails,
    muhuratDetails: generated.muhuratDetails,
    civicCompliance: generated.civicCompliance,
    runOfShow: generated.runOfShow,
    guestStats: generated.guestStats,
  };
}

/**
 * Safely retrieve all saved plans from localStorage
 */
export function getAllPlans(): EventPlan[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse saved plans from localStorage:', e);
    return [];
  }
}

/**
 * Save or update a plan in localStorage
 */
export function savePlan(plan: EventPlan): void {
  if (typeof window === 'undefined') return;
  try {
    const plans = getAllPlans();
    const existingIndex = plans.findIndex((p) => p.id === plan.id);
    const updatedPlan = { ...plan, updatedAt: new Date().toISOString() };

    if (existingIndex >= 0) {
      plans[existingIndex] = updatedPlan;
    } else {
      plans.unshift(updatedPlan);
    }

    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    setActivePlanId(plan.id);
  } catch (e) {
    console.error('Failed to save plan to localStorage:', e);
  }
}

/**
 * Delete a plan by ID
 */
export function deletePlan(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const plans = getAllPlans().filter((p) => p.id !== id);
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    if (getActivePlanId() === id) {
      localStorage.removeItem(ACTIVE_PLAN_KEY);
    }
  } catch (e) {
    console.error('Failed to delete plan:', e);
  }
}

/**
 * Get the active plan ID
 */
export function getActivePlanId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PLAN_KEY);
}

/**
 * Set the active plan ID
 */
export function setActivePlanId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_PLAN_KEY, id);
}

/**
 * Load active plan or fallback to latest saved plan
 */
export function getActivePlan(): EventPlan | null {
  const plans = getAllPlans();
  if (plans.length === 0) return null;
  const activeId = getActivePlanId();
  if (activeId) {
    const found = plans.find((p) => p.id === activeId);
    if (found) return found;
  }
  return plans[0];
}
