"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowRight, RotateCcw, X, Mail, ShieldCheck, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const OTP_EXPIRY_SECONDS = 300;
const RESEND_COOLDOWN_SECONDS = 60;

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(OTP_EXPIRY_SECONDS);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [remainingResends, setRemainingResends] = useState<number | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  useEffect(() => {
    if (otpExpiry > 0 && !isSuccess) {
      const timer = setTimeout(() => setOtpExpiry(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpExpiry, isSuccess]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (email && sessionStorage.getItem('otp_sent')) {
      // OTP was already sent via Supabase signInWithOtp
      setOtpExpiry(OTP_EXPIRY_SECONDS);
    }
  }, [email]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(c => c) && newCode.join('').length === 4) {
      verifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pastedData.length === 4) {
      const newCode = pastedData.split('').slice(0, 4);
      setCode(newCode);
      verifyCode(newCode.join(''));
    }
  };

  const verifyCode = async (fullCode: string) => {
    if (isLoading || isSuccess) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Verify OTP via our custom API
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Invalid OTP code');
        setRemainingAttempts(result.remainingAttempts ?? null);
        setCode(['', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        sessionStorage.setItem('2fa_completed', 'true');
        sessionStorage.removeItem('2fa_required');
        
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendLoading || resendCooldown > 0) return;
    
    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!result.success) {
        if (result.cooldownSeconds) {
          setResendCooldown(result.cooldownSeconds);
          setError(`Veuillez attendre ${result.cooldownSeconds} secondes.`);
        } else {
          setError(result.error || 'Failed to resend code');
        }
      } else {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        setOtpExpiry(OTP_EXPIRY_SECONDS);
        setRemainingAttempts(null);
        setCode(['', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 4 && !isLoading) {
      verifyCode(fullCode);
    }
  };

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen overflow-hidden">
        <div
          className="hidden lg:flex lg:w-1/2 relative items-center justify-center"
          style={{
            background: `linear-gradient(135deg, rgba(191, 214, 20, 0.95) 0%, rgba(107, 138, 30, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-linxos-green/90 via-linxos-green/70 to-slate-900/90" />
          <div className="relative z-10 text-center px-8">
            <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-400" />
            <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Vérifié!</h1>
            <p className="text-xl text-white/80">Connexion réussie</p>
            <div className="mt-8 w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
            <p className="mt-8 text-white/60 text-sm">Redirection vers le tableau de bord...</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Code vérifié</h2>
            <p className="text-slate-600 dark:text-slate-400">Vous allez être redirigé automatiquement</p>
            <div className="mt-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center"
        style={{
          background: `linear-gradient(135deg, rgba(191, 214, 20, 0.95) 0%, rgba(107, 138, 30, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-linxos-green/90 via-linxos-green/70 to-slate-900/90" />
        <div className="relative z-10 text-center px-8">
          <ShieldCheck className="w-20 h-20 mx-auto mb-6 text-yellow-400" />
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Vérification</h1>
          <p className="text-xl text-white/80">Authentification à deux facteurs</p>
          <div className="mt-8 w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
          <p className="mt-8 text-white/60 text-sm">Entrez le code envoyé à votre email</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          <Card className="border border-white/10 bg-white/95 backdrop-blur-sm shadow-2xl dark:bg-slate-950/95">
            <CardHeader className="space-y-1 pb-2 pt-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-slate-50">
                Vérification
              </CardTitle>
              <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                Entrez le code à 4 chiffres envoyé à
              </CardDescription>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{email}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-14 text-center text-xl font-bold border-2 transition-all duration-200 ${
                        error 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-yellow-500 focus:ring-yellow-500/20'
                      }`}
                      disabled={isLoading}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {error && (
                  <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {remainingAttempts !== null && remainingAttempts <= 2 && remainingAttempts > 0 && (
                  <p className="text-center text-xs text-orange-600 dark:text-orange-400">
                    {remainingAttempts} tentative{remainingAttempts > 1 ? 's' : ''} restante{remainingAttempts > 1 ? 's' : ''}
                  </p>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading || code.join('').length !== 4}
                    className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400 active:bg-yellow-600 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Vérification...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Vérifier
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                        OU
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResend}
                    disabled={resendLoading || resendCooldown > 0 || remainingResends === 0}
                    className="w-full transition-all duration-200 hover:bg-slate-50 hover:shadow-md dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        {resendCooldown > 0 
                          ? `Renvoyer (${resendCooldown}s)` 
                          : remainingResends !== null && remainingResends <= 1
                            ? `Dernière envoi`
                            : 'Renvoyer le code'}
                      </>
                    )}
                  </Button>

                  {remainingResends !== null && remainingResends <= 1 && (
                    <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                      {remainingResends} renvoi{remainingResends > 1 ? 's' : ''} restant{remainingResends > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>
                    {otpExpiry > 0 ? (
                      <>Code expire dans <span className={`font-medium ${otpExpiry <= 60 ? 'text-orange-500' : ''}`}>{formatTime(otpExpiry)}</span></>
                    ) : (
                      <span className="text-red-500 font-medium">Code expiré</span>
                    )}
                  </span>
                </div>
              </form>
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

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-yellow-500" />
        <p className="mt-4 text-slate-500">Chargement...</p>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyOTPForm />
    </Suspense>
  );
}