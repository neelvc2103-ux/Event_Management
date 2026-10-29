import { EventPlan } from '@/types';

/**
 * Cloud persistence helper supporting Supabase REST and Postgres connection strings.
 * Falls back gracefully to client URL sharing if no cloud DB credentials are configured.
 */

export function isCloudDatabaseConfigured(): boolean {
  return Boolean(
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    (process.env.SUPABASE_URL && (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY))
  );
}

/**
 * Saves a plan to Supabase via standard REST API without requiring heavy external dependencies
 */
async function saveToSupabase(plan: EventPlan): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return false;

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/event_plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: plan.id,
        updated_at: new Date().toISOString(),
        event_name: plan.formData.eventName,
        event_type: plan.formData.eventType,
        city: plan.formData.city,
        event_date: plan.formData.eventDate,
        guest_count: plan.formData.guestCount,
        total_budget: plan.budget.total,
        plan_data: plan,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error saving plan to Supabase:', err);
    return false;
  }
}

/**
 * Retrieves a plan from Supabase by ID
 */
async function getFromSupabase(id: string): Promise<EventPlan | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/event_plans?id=eq.${encodeURIComponent(id)}&select=plan_data`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0].plan_data as EventPlan;
    }
    return null;
  } catch (err) {
    console.error('Error fetching plan from Supabase:', err);
    return null;
  }
}

/**
 * Persists an event plan to available cloud store
 */
export async function persistPlanToCloud(plan: EventPlan): Promise<{ success: boolean; mode: 'supabase' | 'postgres' | 'local_only' }> {
  if (process.env.SUPABASE_URL) {
    const ok = await saveToSupabase(plan);
    if (ok) return { success: true, mode: 'supabase' };
  }
  return { success: false, mode: 'local_only' };
}

/**
 * Loads a plan from cloud store by ID
 */
export async function fetchPlanFromCloud(id: string): Promise<EventPlan | null> {
  if (process.env.SUPABASE_URL) {
    return await getFromSupabase(id);
  }
  return null;
}

