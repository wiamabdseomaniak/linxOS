"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        setIsValidSession(false)
      } else {
        setIsValidSession(true)
      }
    } catch (error) {
      setIsValidSession(false)
    }
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return "Le mot de passe est requis"
    }
    if (password.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères"
    }
    return ""
  }

  const validateForm = () => {
    let isValid = true

    const pwdError = validatePassword(newPassword)
    if (pwdError) {
      setPasswordError(pwdError)
      isValid = false
    }

    if (!confirmPassword) {
      setConfirmError("Veuillez confirmer votre mot de passe")
      isValid = false
    } else if (newPassword !== confirmPassword) {
      setConfirmError("Les mots de passe ne correspondent pas")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setConfirmError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setIsError(false)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setIsError(true)
        setErrorMessage(error.message)
      } else {
        setIsSuccess(true)
      }
    } catch (error: unknown) {
      setIsError(true)
      setErrorMessage("Une erreur inattendue s'est produite")
    } finally {
      setIsLoading(false)
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
          <p className="mt-8 text-white/60 text-sm">Réinitialisez votre mot de passe</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          <Card className="border border-white/10 bg-white/95 backdrop-blur-sm shadow-2xl dark:bg-slate-950/95">
            <CardHeader className="space-y-1 pb-2 pt-8">
              <CardTitle className="text-3xl font-bold text-center text-slate-900 dark:text-slate-50">
                {isSuccess ? "Mot de passe modifié" : "Nouveau mot de passe"}
              </CardTitle>
              <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                {isSuccess
                  ? "Votre mot de passe a été modifié avec succès."
                  : "Entrez votre nouveau mot de passe"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              {isValidSession === null ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-yellow-500" />
                </div>
              ) : isValidSession === false ? (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <XCircle className="h-16 w-16 text-red-500" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Le lien de réinitialisation a expiré ou est invalide.
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/login")}
                    className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400"
                  >
                    Retour à la connexion
                  </Button>
                </div>
              ) : isSuccess ? (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/login")}
                    className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400"
                  >
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : isError ? (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <XCircle className="h-16 w-16 text-red-500" />
                  </div>
                  <p className="text-red-500">{errorMessage}</p>
                  <Button
                    onClick={() => {
                      setIsError(false)
                      setErrorMessage("")
                    }}
                    className="w-full bg-yellow-500 text-slate-900 hover:bg-yellow-400"
                  >
                    Réessayer
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Nouveau mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value)
                          if (passwordError) setPasswordError("")
                        }}
                        placeholder="••••••••"
                        className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-yellow-500/50 ${
                          passwordError ? "border-red-500 focus:ring-red-500/50" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-red-500">{passwordError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (confirmError) setConfirmError("")
                        }}
                        placeholder="••••••••"
                        className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-yellow-500/50 ${
                          confirmError ? "border-red-500 focus:ring-red-500/50" : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {confirmError && (
                      <p className="text-xs text-red-500">{confirmError}</p>
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
                    {isLoading ? "Modification..." : "Modifier le mot de passe"}
                  </Button>
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
  )
}