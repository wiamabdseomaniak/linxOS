import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      return null;
    }
    throw new Error('Supabase environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

export function getSupabase(): SupabaseClient | null {
  return getClient();
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const c = getClient();
    if (!c) return undefined;
    return (c as any)[prop];
  },
});

export const SUPABASE_TABLES = {
  USERS: 'users',
  DELIVERIES: 'deliveries',
  DELIVERY_ITEMS: 'delivery_items',
  DELIVERY_PROOFS: 'delivery_proofs',
  NOTIFICATIONS: 'notifications',
  SESSIONS: 'sessions',
  DEVICES: 'devices',
  ACTIVITY_LOGS: 'activity_logs',
  PROBLEM_REPORTS: 'problem_reports',
} as const;