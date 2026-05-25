import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
    }
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

export function getSupabase(): SupabaseClient {
  return getClient();
}

// Lazy proxy — only creates the client on first property access
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getClient() as any)[prop];
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