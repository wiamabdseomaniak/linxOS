"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = (requirePassword = true) => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Veuillez entrer une adresse email valide"
    }

    if (requirePassword && (!password || password.length < 6)) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm(true)) {
      setIsLoading(true)
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setErrors({ email: signInError.message })
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Login error:", error)
        setErrors({ email: 'Une erreur est survenue. Veuillez réessayer.' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoadingGoogle(true)
      
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      
      if (googleError) {
        console.error("Google login error:", googleError)
        setErrors({ email: "Failed to sign in with Google" })
      }
    } catch (error) {
      console.error("Google login error:", error)
    } finally {
      setIsLoadingGoogle(false)
    }
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
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">LINXOS</h1>
          <p className="text-xl text-white/80">Logistique & Sponsoring</p>
          <div className="mt-8 w-24 h-1 bg-yellow-400 mx-auto rounded-full" />
          <p className="mt-8 text-white/60 text-sm">Gérez votre logistique efficacement</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          <Card className="border border-white/10 bg-white/95 backdrop-blur-sm shadow-2xl dark:bg-slate-950/95">
            <CardHeader className="space-y-1 pb-2 pt-8">
              <CardTitle className="text-3xl font-bold text-center text-slate-900 dark:text-slate-50">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

<CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 ${
                      errors.email ? "border-red-500 focus:ring-red-500/50" : ""
                    }`}
                    placeholder="logistique.linxos@gmail.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-yellow-500/50 ${
                        errors.password ? "border-red-500 focus:ring-red-500/50" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400 active:bg-yellow-600 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-yellow-400" />
                  ) : (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-slate-500 hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400 underline underline-offset-2 transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoadingGoogle}
                className="w-full transition-all duration-200 hover:bg-slate-50 hover:shadow-md dark:hover:bg-slate-800"
              >
                {isLoadingGoogle ? (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {isLoadingGoogle ? "Connexion..." : "Google"}
              </Button>

              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="underline decoration-slate-400 underline-offset-2 transition-colors hover:text-blue-600 hover:decoration-blue-600"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline decoration-slate-400 underline-offset-2 transition-colors hover:text-blue-600 hover:decoration-blue-600"
                >
                  Privacy Policy
                </a>
              </p>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-slate-400">
            © 2026 LINXOS. Tous droits réservés.
          </p>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md border border-white/10 bg-white/95 backdrop-blur-sm shadow-2xl dark:bg-slate-950/95 mx-4">
            <CardHeader className="relative pb-2 pt-6">
              <button
                onClick={() => {
                  setShowForgotPassword(false)
                  setResetSent(false)
                  setResetEmail("")
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {resetSent ? "Email envoyé" : "Réinitialiser le mot de passe"}
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                {resetSent
                  ? "Un lien de réinitialisation a été envoyé à votre adresse email."
                  : "Entrez votre adresse email pour recevoir un lien de réinitialisation."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {!resetSent ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                        redirectTo: `${window.location.origin}/reset-password`,
                      })
                      if (resetError) {
                        console.error("Reset password error:", resetError.message)
                      } else {
                        setResetSent(true)
                      }
                    } catch (err) {
                      console.error("Reset password error:", err)
                      setResetSent(true)
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="resetEmail"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Email
                    </Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="managerlogistic@linxos.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400 active:bg-yellow-600 transition-all duration-200"
                  >
                    Envoyer le lien
                  </Button>
                </form>
              ) : (
                <Button
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetSent(false)
                    setResetEmail("")
                  }}
                  className="w-full bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
                >
                  Retour à la connexion
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}