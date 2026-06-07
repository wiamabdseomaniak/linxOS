/**
 * Route API : POST /api/auth/request-otp
 * Envoie un code OTP à 6 chiffres par email via Supabase Auth.
 * Body : { email: string }
 * Réponse : { ok: true } | { error: string }
 */

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  email: z.string().trim().toLowerCase().email('Email invalide'),
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
    const message = parsed.error.issues[0]?.message ?? 'Email invalide';
    return Response.json({ error: message }, { status: 400 });
  }

  const { email } = parsed.data;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: 'Supabase non configuré.' }, { status: 500 });
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // shouldCreateUser: true → si l'utilisateur n'existe pas, Supabase le crée
  // automatiquement et lui envoie le code. Évite le "silent fail" qui faisait
  // croire que l'email avait été envoyé alors que rien ne partait.
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('rate limit')) {
      return Response.json(
        { error: 'Trop de tentatives. Patientez quelques minutes avant de réessayer.' },
        { status: 429 },
      );
    }
    return Response.json(
      { error: "Impossible d'envoyer le code. Réessayez dans quelques instants." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
