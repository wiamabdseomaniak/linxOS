"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

type Step = "email" | "code";

const RESEND_COOLDOWN = 30;

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Pré-remplit l'email si présent dans l'URL (?email=...).
  useEffect(() => {
    const prefill = searchParams.get("email");
    if (prefill) setEmail(prefill);
  }, [searchParams]);

  const [resendCooldown, setResendCooldown] = useState(0);
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (step === "code") {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  // Synchronise l'état de l'auth Supabase : redirige si déjà connecté.
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) {
        router.replace("/dashboard");
      }
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  // Étape 1 : déclenche l'envoi du code OTP.
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Veuillez entrer votre email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed.toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Impossible d'envoyer le code.");
        return;
      }
      setStep("code");
      setInfo("Un code à 6 chiffres a été envoyé à votre adresse.");
      setResendCooldown(RESEND_COOLDOWN);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setSending(false);
    }
  };

  // Étape 2 : vérifie le code saisi puis établit la session Supabase côté client.
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Veuillez entrer le code à 6 chiffres");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), token: fullCode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.session) {
        setError(data?.error ?? "Code invalide.");
        setCode(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        return;
      }

      // Établit la session dans le client Supabase (cookies + localStorage).
      const { error: setErr } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      if (setErr) {
        setError("Impossible d'établir la session. Réessayez.");
        return;
      }

      sessionStorage.setItem("2fa_completed", "true");
      router.replace("/dashboard");
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setVerifying(false);
    }
  };

  // Met à jour un digit et avance le focus ; gère le collage d'un code complet.
  const handleCodeChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, 6).split("");
      const next = ["", "", "", "", "", ""];
      digits.forEach((d, i) => {
        next[i] = d;
      });
      setCode(next);
      const lastFilled = Math.min(digits.length, 6) - 1;
      otpRefs.current[Math.min(lastFilled + 1, 5)]?.focus();
      return;
    }
    if (!/^\d?$/.test(cleaned)) return;
    const next = [...code];
    next[index] = cleaned;
    setCode(next);
    if (cleaned && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Backspace sur case vide → recule le focus.
  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setInfo("");
    setSending(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Impossible de renvoyer le code.");
        return;
      }
      setInfo("Un nouveau code a été envoyé.");
      setResendCooldown(RESEND_COOLDOWN);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Panneau gauche décoratif (caché en mobile) : dégradé + branding. */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center"
        style={{
          background: `linear-gradient(135deg, rgba(191, 214, 20, 0.95) 0%, rgba(107, 138, 30, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-linxos-green/90 via-linxos-green/70 to-slate-900/90" />
        <div className="relative z-10 text-center px-8">
          <img
            src="/L-removebg-preview.png"
            alt="LINXOS"
            className="mx-auto h-16 w-auto mb-4"
          />
          <p className="text-xl text-white/80">Logistique & Sponsoring</p>
          <div className="mt-8 w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
          <p className="mt-8 text-white/60 text-sm">Connexion sécurisée par code</p>
        </div>
      </div>

      {/* Panneau droit : carte de saisie OTP. */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>

          <Card className="border border-white/10 bg-white/95 backdrop-blur-sm shadow-2xl dark:bg-slate-950/95">
            <CardHeader className="space-y-1 pb-2 pt-8">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                <KeyRound className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-slate-50">
                Connexion par code
              </CardTitle>
              <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                {step === "email"
                  ? "Recevez un code à usage unique par email."
                  : `Entrez le code envoyé à ${email}`}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              {step === "email" ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="logistique.linxos@gmail.com"
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-yellow-500/50 dark:focus:ring-yellow-400/50"
                        autoComplete="email"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400 active:bg-yellow-600 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/25 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-500 disabled:opacity-50"
                  >
                    {sending ? (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-yellow-400 dark:border-slate-200 dark:border-t-yellow-400" />
                    ) : (
                      <KeyRound className="mr-2 h-4 w-4" />
                    )}
                    {sending ? "Envoi..." : "Envoyer le code"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
                          if (!pasted) return;
                          handleCodeChange(0, pasted);
                        }}
                        aria-label={`Chiffre ${index + 1} du code`}
                        className="h-14 w-11 rounded-lg border border-slate-300 text-center text-2xl font-bold focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="text-center text-xs text-red-500 dark:text-red-400">{error}</p>
                  )}
                  {info && !error && (
                    <p className="text-center text-xs text-emerald-600 dark:text-emerald-400">{info}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={verifying || code.join("").length !== 6}
                    className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400 active:bg-yellow-600 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/25 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-500 disabled:opacity-50"
                  >
                    {verifying ? (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-yellow-400 dark:border-slate-200 dark:border-t-yellow-400" />
                    ) : null}
                    {verifying ? "Vérification..." : "Vérifier le code"}
                  </Button>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setCode(["", "", "", "", "", ""]);
                        setError("");
                        setInfo("");
                      }}
                      className="text-slate-500 underline underline-offset-2 transition-colors hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400"
                    >
                      Changer d&apos;email
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || sending}
                      className="text-slate-500 underline underline-offset-2 transition-colors hover:text-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-yellow-400"
                    >
                      {resendCooldown > 0
                        ? `Renvoyer (${resendCooldown}s)`
                        : sending
                          ? "Envoi..."
                          : "Renvoyer le code"}
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-slate-400">
            © 2026 LINXOS. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
