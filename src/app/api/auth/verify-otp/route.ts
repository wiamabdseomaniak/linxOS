/**
 * Route API : POST /api/auth/verify-otp
 * Vérifie le code OTP reçu par email et retourne les tokens de session.
 * Body : { email: string, token: string }
 * Réponse : { ok: true, session: {...} } | { error: string }
 *
 * Le client doit ensuite appeler supabase.auth.setSession(...) pour
 * effectivement authentifier le navigateur (cookies + localStorage).
 */

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  email: z.string().trim().toLowerCase().email('Email invalide'),
  token: z.string().regex(/^\d{6}$/, 'Le code doit contenir 6 chiffres'),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Corps JSON invalide.' }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(payload);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Données invalides';
    return Response.json({ error: message }, { status: 400 });
  }

  const { email, token } = parsed.data;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: 'Supabase non configuré.' }, { status: 500 });
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error || !data.session) {
    return Response.json(
      { error: 'Code invalide ou expiré. Vérifiez le code reçu par email.' },
      { status: 400 },
    );
  }

  const s = data.session;
  return Response.json({
    ok: true,
    session: {
      access_token: s.access_token,
      refresh_token: s.refresh_token,
      expires_at: s.expires_at,
      expires_in: s.expires_in,
      token_type: s.token_type,
      user: s.user,
    },
  });
}
