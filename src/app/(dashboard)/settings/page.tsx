/**
 * Page Paramètres — configuration globale du compte.
 * Onglets : Profil, Mot de passe, Notifications, Apparence, Sécurité.
 * Gère le thème (light/dark/system), les préférences
 * de notifications et la déconnexion.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  Lock,
  Bell,
  Palette,
  Shield,
  Monitor,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Loader2,
  Camera,
  Check,
  LogOut,
  Smartphone,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/components/providers/theme-provider';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

// Données mockées pour l'aperçu des sessions actives (à remplacer par un appel API).
const sessions = [
  { device: 'Chrome on MacOS', location: 'Casablanca, Maroc', lastActive: 'il y a 2 minutes', current: true },
  { device: 'Safari on iPhone', location: 'Rabat, Maroc', lastActive: 'il y a 1 heure', current: false },
  { device: 'Firefox on Windows', location: 'Marrakech, Maroc', lastActive: 'il y a 3 jours', current: false },
];

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, signOut, keepThemeOnSignOut, setKeepThemeOnSignOut } = useTheme();
  const { user: fetchedUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('profile');

  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    whatsapp: true,
  });
  const [activeSessions, setActiveSessions] = useState(sessions);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
    general?: string;
  }>({});
  const [passwordValues, setPasswordValues] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'password', label: 'Mot de passe', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  // Valide le formulaire de changement de mot de passe (longueur + correspondance).
  const validatePasswordForm = () => {
    const errors: typeof passwordErrors = {};
    if (!passwordValues.current) {
      errors.current = 'Le mot de passe actuel est requis';
    }
    if (!passwordValues.new) {
      errors.new = 'Le nouveau mot de passe est requis';
    } else if (passwordValues.new.length < 6) {
      errors.new = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
    }
    if (!passwordValues.confirm) {
      errors.confirm = 'Veuillez confirmer votre nouveau mot de passe';
    } else if (passwordValues.new !== passwordValues.confirm) {
      errors.confirm = 'Les mots de passe ne correspondent pas';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumet le nouveau mot de passe à Supabase et affiche un message de succès temporaire.
  const handleUpdatePassword = async () => {
    if (!validatePasswordForm()) return;
    setIsSavingPassword(true);
    setPasswordErrors({});
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordValues.new,
      });
      if (error) {
        if (error.message.includes('Current password')) {
          setPasswordErrors({ current: error.message });
        } else {
          setPasswordErrors({ general: error.message });
        }
      } else {
        setPasswordValues({ current: '', new: '', confirm: '' });
        setPasswordUpdated(true);
        setTimeout(() => setPasswordUpdated(false), 3000);
      }
    } catch {
      setPasswordErrors({ general: 'Une erreur inattendue s\'est produite' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Révoque une session (UI uniquement — à brancher sur une API dédiée).
  const handleRevokeSession = (device: string) => {
    setActiveSessions(activeSessions.filter((s) => s.device !== device));
  };

  // Placeholder : ouvre la modale de gestion détaillée des appareils.
  const handleManageDevices = () => {
    alert('Gestion des appareils bientôt disponible !');
  };

  // Déconnecte l'utilisateur (via le ThemeProvider) puis redirige.
  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/40 bg-amber-100/60 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
         
          {'LINXOS'}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {'Paramètres'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {'Gérez votre compte, votre sécurité et vos préférences.'}
        </p>
      </motion.div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64"
        >
          <Card className="sticky top-20 overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
            <CardContent className="p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                <TabsList className="flex w-full flex-col gap-1 bg-transparent">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="justify-start gap-3 rounded-xl px-3 py-2.5 text-sm data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-500/15 dark:data-[state=active]:text-amber-300"
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex-1 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="profile">
              <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{'Profil'}</CardTitle>
                  <CardDescription>
                    {'Vos informations personnelles et votre photo de profil.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 ring-4 ring-amber-400/20">
                        <AvatarImage src={fetchedUser?.avatar ?? ''} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-2xl font-semibold text-white">
                          {(fetchedUser?.name ?? '').split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{fetchedUser?.name ?? ''}</h3>
                      <p className="text-sm text-muted-foreground">{fetchedUser?.email ?? ''}</p>
                      <Badge className="mt-2 bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                        {fetchedUser?.role === 'manager' ? 'Manager Logistique' : ''}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{'Mot de passe'}</CardTitle>
                  <CardDescription>
                    {'Modifiez votre mot de passe pour sécuriser votre compte.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{'Mot de passe actuel'}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        className={cn('rounded-xl pr-10', passwordErrors.current && 'border-rose-500')}
                        placeholder={'Entrez votre mot de passe actuel'}
                        value={passwordValues.current}
                        onChange={(e) => {
                          setPasswordValues({ ...passwordValues, current: e.target.value });
                          if (passwordErrors.current) setPasswordErrors({ ...passwordErrors, current: undefined });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordErrors.current && (
                      <p className="flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3 w-3" />
                        {passwordErrors.current}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{'Nouveau mot de passe'}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className={cn('rounded-xl', passwordErrors.new && 'border-rose-500')}
                      placeholder={'Au moins 6 caractères'}
                      value={passwordValues.new}
                      onChange={(e) => {
                        setPasswordValues({ ...passwordValues, new: e.target.value });
                        if (passwordErrors.new) setPasswordErrors({ ...passwordErrors, new: undefined });
                      }}
                    />
                    {passwordErrors.new && (
                      <p className="flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3 w-3" />
                        {passwordErrors.new}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{'Confirmer le mot de passe'}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className={cn('rounded-xl', passwordErrors.confirm && 'border-rose-500')}
                      placeholder={'Confirmez le nouveau mot de passe'}
                      value={passwordValues.confirm}
                      onChange={(e) => {
                        setPasswordValues({ ...passwordValues, confirm: e.target.value });
                        if (passwordErrors.confirm) setPasswordErrors({ ...passwordErrors, confirm: undefined });
                      }}
                    />
                    {passwordErrors.confirm && (
                      <p className="flex items-center gap-1 text-xs text-rose-500">
                        <AlertCircle className="h-3 w-3" />
                        {passwordErrors.confirm}
                      </p>
                    )}
                  </div>
                  {passwordErrors.general && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-950/30">
                      <AlertCircle className="h-4 w-4" />
                      {passwordErrors.general}
                    </div>
                  )}
                  <Button
                    onClick={handleUpdatePassword}
                    disabled={isSavingPassword}
                    className="rounded-full bg-amber-500 px-5 text-white hover:bg-amber-600"
                  >
                    {isSavingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {'Mise à jour...'}
                      </>
                    ) : passwordUpdated ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {'Mot de passe mis à jour'}
                      </>
                    ) : (
                      'Mettre à jour'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{'Notifications'}</CardTitle>
                  <CardDescription>
                    {'Choisissez comment vous souhaitez être notifié.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'email', label: 'Email', desc: 'Recevez les alertes par email.' },
                    { key: 'push', label: 'Notifications push', desc: 'Notifications en temps réel sur cet appareil.' },
                    { key: 'sms', label: 'SMS', desc: 'Recevez les alertes importantes par SMS.' },
                    { key: 'whatsapp', label: 'WhatsApp', desc: 'Recevez les alertes sur WhatsApp.' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-4 rounded-xl border border-border/40 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, [item.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{'Apparence'}</CardTitle>
                  <CardDescription>
                    {"Personnalisez l'apparence de l'application."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>{'Thème'}</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[
                        { value: 'light' as const, label: 'Clair', icon: Sun },
                        { value: 'dark' as const, label: 'Sombre', icon: Moon },
                        { value: 'system' as const, label: 'Système', icon: Monitor },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={cn(
                            'group flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                            theme === option.value
                              ? 'border-amber-500 bg-amber-500/10 shadow-soft'
                              : 'border-border/50 hover:border-amber-500/40'
                          )}
                        >
                          <option.icon className={cn('h-5 w-5', theme === option.value && 'text-amber-600')} />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                 
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{'Sécurité'}</CardTitle>
                  <CardDescription>
                    {'Gérez les appareils connectés et la sécurité de votre compte.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-3 rounded-xl border border-border/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{'Appareils actifs'}</p>
                        <p className="text-xs text-muted-foreground">
                          {'Liste des appareils actuellement connectés à votre compte.'}
                        </p>
                      </div>
                    </div>
                    
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {activeSessions.map((session) => (
                      <div
                        key={session.device}
                        className="flex flex-col gap-3 rounded-xl border border-border/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
                            {session.device.includes('Mac') || session.device.includes('iPhone') ? (
                              <Smartphone className="h-4 w-4" />
                            ) : (
                              <Monitor className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{session.device}</p>
                              {session.current && (
                                <Badge className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                  {'Actuelle'}
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {session.location}
                              </span>
                              <span className="flex items-center gap-1">
                                {session.lastActive}
                              </span>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-300"
                            onClick={() => handleRevokeSession(session.device)}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            {'Révoquer'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-300">
                        <LogOut className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{'Se déconnecter'}</p>
                        <p className="text-xs text-muted-foreground">
                          {'Déconnectez-vous de cette session sur cet appareil.'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="rounded-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {'Se déconnecter'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
