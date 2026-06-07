/**
 * Page /verify-otp — Connexion par code OTP à 6 chiffres.
 * Étape 1 : saisie de l'email → envoi du code via /api/auth/request-otp
 * Étape 2 : saisie du code à 6 chiffres → vérification via /api/auth/verify-otp
 * Sur succès : session Supabase créée côté client, redirection vers /dashboard.
 */

import { Suspense } from "react";
import VerifyOtpForm from "./verify-otp-form";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
