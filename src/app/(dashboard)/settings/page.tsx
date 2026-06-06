// Page Paramètres — configuration du profil, notifications, thème et langue
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
  Globe,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/components/providers/theme-provider';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useTranslation, ACTIVE_LANGUAGES } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const sessions = [
  { device: 'Chrome on MacOS', location: 'Casablanca, Maroc', lastActive: 'il y a 2 minutes', current: true },
  { device: 'Safari on iPhone', location: 'Rabat, Maroc', lastActive: 'il y a 1 heure', current: false },
  { device: 'Firefox on Windows', location: 'Marrakech, Maroc', lastActive: 'il y a 3 jours', current: false },
];

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, signOut, keepThemeOnSignOut, setKeepThemeOnSignOut } = useTheme();
  const { user: fetchedUser } = useCurrentUser();
  const { t, language, setLanguage } = useTranslation();
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
    { id: 'profile', label: t('settings.tabs.profile'), icon: User },
    { id: 'password', label: t('settings.tabs.password'), icon: Lock },
    { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
    { id: 'appearance', label: t('settings.tabs.appearance'), icon: Palette },
    { id: 'security', label: t('settings.tabs.security'), icon: Shield },
  ];

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

  const handleRevokeSession = (device: string) => {
    setActiveSessions(activeSessions.filter((s) => s.device !== device));
  };

  const handleManageDevices = () => {
    alert('Gestion des appareils bientôt disponible !');
  };

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
          <Palette className="h-3.5 w-3.5" />
          {t('common.appName')}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t('settings.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('settings.subtitle')}
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
                  <CardTitle className="text-xl">{t('settings.profile.title')}</CardTitle>
                  <CardDescription>
                    {t('settings.profile.subtitle')}
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
                        {fetchedUser?.role === 'manager' ? 'Manager Logistique' :
                         fetchedUser?.role === 'logistique' ? 'Responsable Logistique' :
                         fetchedUser?.role === 'driver' ? 'Chauffeur' :
                         fetchedUser?.role === 'client' ? 'Client' : 'Responsable Logistique'}
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
                  <CardTitle className="text-xl">{t('settings.password.title')}</CardTitle>
                  <CardDescription>
                    {t('settings.password.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('settings.password.current')}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        className={cn('rounded-xl pr-10', passwordErrors.current && 'border-rose-500')}
                        placeholder={t('settings.password.currentPlaceholder')}
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
                    <Label htmlFor="newPassword">{t('settings.password.new')}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className={cn('rounded-xl', passwordErrors.new && 'border-rose-500')}
                      placeholder={t('settings.password.newPlaceholder')}
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
                    <Label htmlFor="confirmPassword">{t('settings.password.confirm')}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className={cn('rounded-xl', passwordErrors.confirm && 'border-rose-500')}
                      placeholder={t('settings.password.confirmPlaceholder')}
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
                        {t('settings.password.updating')}
                      </>
                    ) : passwordUpdated ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {t('settings.password.updated')}
                      </>
                    ) : (
                      t('settings.password.update')
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{t('settings.notifications.title')}</CardTitle>
                  <CardDescription>
                    {t('settings.notifications.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'email', label: t('settings.notifications.email'), desc: t('settings.notifications.emailDesc') },
                    { key: 'push', label: t('settings.notifications.push'), desc: t('settings.notifications.pushDesc') },
                    { key: 'sms', label: t('settings.notifications.sms'), desc: t('settings.notifications.smsDesc') },
                    { key: 'whatsapp', label: t('settings.notifications.whatsapp'), desc: t('settings.notifications.whatsappDesc') },
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
                  <CardTitle className="text-xl">{t('settings.appearance.title')}</CardTitle>
                  <CardDescription>
                    {t('settings.appearance.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>{t('settings.appearance.theme')}</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[
                        { value: 'light' as const, label: t('settings.appearance.light'), icon: Sun },
                        { value: 'dark' as const, label: t('settings.appearance.dark'), icon: Moon },
                        { value: 'system' as const, label: t('settings.appearance.system'), icon: Monitor },
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

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {t('settings.appearance.language')}
                      </Label>
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {ACTIVE_LANGUAGES.length} actives
                      </span>
                    </div>
                    <Select value={language} onValueChange={(value) => setLanguage(value || 'fr')}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVE_LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <span className="flex items-center gap-2">
                              <span className="flex h-5 w-7 items-center justify-center rounded bg-amber-500/10 text-[10px] font-bold text-amber-700">
                                {lang.flag}
                              </span>
                              <span>{lang.nativeLabel}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {t('settings.appearance.languageHint')}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between gap-4 rounded-xl border border-border/40 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t('settings.appearance.logoutTheme')}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('settings.appearance.logoutThemeDesc')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={keepThemeOnSignOut}
                      onCheckedChange={(checked) => setKeepThemeOnSignOut(checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">{t('settings.security.title')}</CardTitle>
                  <CardDescription>
                    {t('settings.security.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-3 rounded-xl border border-border/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t('settings.security.activeDevices')}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('settings.security.activeDevicesDesc')}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-full" onClick={handleManageDevices}>
                      {t('settings.security.manage')}
                    </Button>
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
                                  {t('settings.security.current')}
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
                            {t('settings.security.revoke')}
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
                        <p className="text-sm font-semibold">{t('settings.security.signOut')}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('settings.security.signOutDesc')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="rounded-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('settings.security.signOut')}
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
