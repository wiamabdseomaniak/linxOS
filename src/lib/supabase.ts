import { createClient, SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

function getEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getEnv();
  return Boolean(url && anonKey);
}

/**
 * Returns a singleton Supabase client for browser usage.
 * If env vars are not set, returns null so consumers can fall back
 * to empty/zero data instead of crashing the app.
 */
export function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  if (browserClient) return browserClient;

  const { url, anonKey } = getEnv();
  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        '[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. ' +
          'Falling back to empty data. Set them in .env.local to enable Supabase.',
      );
    }
    return null;
  }

  browserClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return browserClient;
}

/**
 * Proxy that lazy-resolves the Supabase client.
 * All Supabase calls in the codebase use this `supabase` export so that
 * missing env vars never throw at import time.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = getSupabase();
    if (!c) return undefined;
    const value = (c as unknown as Record<string | symbol, unknown>)[prop as string];
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(c) : value;
  },
});

export const SUPABASE_TABLES = {
  UTILISATEUR: 'utilisateur',
  CLIENT: 'client',
  LIVRAISON: 'livraison',
  TRACKING: 'tracking',
  NOTE: 'note',
  NOTIFICATION: 'notification',
  EMAIL_VERIFICATIONS: 'email_verifications',
  PROFILES: 'profiles',
} as const;