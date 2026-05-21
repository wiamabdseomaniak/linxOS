import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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