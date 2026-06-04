'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  Smartphone,
  Shield,
  Monitor,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Loader2,
  Camera,
  Check,
  X,
  LogOut,
  Clock,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/components/providers/theme-provider';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { supabase } from '@/lib/supabase';

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'password', label: 'Mot de passe', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'security', label: 'Sécurité', icon: Shield },
  
];

const sessions = [
  { device: 'Chrome on MacOS', location: 'Casablanca, Maroc', lastActive: 'il y a 2 minutes', current: true },
  { device: 'Safari on iPhone', location: 'Rabat, Maroc', lastActive: 'il y a 1 heure', current: false },
  { device: 'Firefox on Windows', location: 'Marrakech, Maroc', lastActive: 'il y a 3 jours', current: false },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user: fetchedUser, updateProfile } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [formData, setFormData] = useState({
  
  });

  useEffect(() => {
    if (fetchedUser) {
      setFormData({
        name: fetchedUser.name ?? '',
        phone: fetchedUser.phone ?? '',
      });
    }
  }, [fetchedUser]);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    whatsapp: true,
  });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('africa-casablanca');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState(sessions);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
    general?: string;
  }>({});
  const [passwordValues, setPasswordValues] = useState({
    current: 'Logistiquemanager123',
    new: '',
    confirm: '',
  });

  const handleSave = async () => {
    setIsLoading(true);
    setIsLoading(false);
  };

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
    if (!validatePasswordForm()) {
      return;
    }

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
    } catch (err) {
      setPasswordErrors({ general: 'Une erreur inattendue s\'est produite' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleRevokeSession = (device: string) => {
    setActiveSessions(activeSessions.filter((s) => s.device !== device));
  };

  const handleManageDevices = () => {
    alert('Gestion des appareils bientôt disponible !');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérer les paramètres et préférences de votre compte
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64"
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                <TabsList className="flex w-full flex-col bg-transparent">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-violet-100 dark:data-[state=active]:bg-violet-900/30"
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

        {/* Content */}
        <div className="flex-1 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="profile">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-xl">Informations du profil</CardTitle>
                  <CardDescription>
                    Mettre à jour vos informations personnelles et coordonnées
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={fetchedUser?.avatar ?? ''} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-white dark:from-violet-700 dark:to-purple-700">
                          {(fetchedUser?.name ?? '').split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold">{fetchedUser?.name ?? ''}</h3>
                      <p className="text-sm text-muted-foreground">{fetchedUser?.email ?? ''}</p>
                      <Badge className="mt-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
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
              <Card className="border-0 shadow-soft">
                <CardHeader>
                <CardTitle className="text-xl">Changer le mot de passe</CardTitle>
                <CardDescription>
                  Mettez à jour votre mot de passe pour protéger votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      className={`rounded-xl pr-10 ${passwordErrors.current ? 'border-red-500 dark:border-red-400' : ''}`}
                      placeholder="Saisissez le mot de passe actuel"
                      value={passwordValues.current}
                      onChange={(e) => {
                        setPasswordValues({ ...passwordValues, current: e.target.value });
                        if (passwordErrors.current) {
                          setPasswordErrors({ ...passwordErrors, current: undefined });
                        }
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
                    <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      {passwordErrors.current}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className={`rounded-xl ${passwordErrors.new ? 'border-red-500 dark:border-red-400' : ''}`}
                    placeholder="Saisissez le nouveau mot de passe"
                    value={passwordValues.new}
                    onChange={(e) => {
                      setPasswordValues({ ...passwordValues, new: e.target.value });
                      if (passwordErrors.new) {
                        setPasswordErrors({ ...passwordErrors, new: undefined });
                      }
                    }}
                  />
                  {passwordErrors.new && (
                    <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      {passwordErrors.new}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className={`rounded-xl ${passwordErrors.confirm ? 'border-red-500 dark:border-red-400' : ''}`}
                    placeholder="Confirmez le nouveau mot de passe"
                    value={passwordValues.confirm}
                    onChange={(e) => {
                      setPasswordValues({ ...passwordValues, confirm: e.target.value });
                      if (passwordErrors.confirm) {
                        setPasswordErrors({ ...passwordErrors, confirm: undefined });
                      }
                    }}
                  />
                  {passwordErrors.confirm && (
                    <p className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      {passwordErrors.confirm}
                    </p>
                  )}
                </div>
                {passwordErrors.general && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30">
                    <AlertCircle className="h-4 w-4" />
                    {passwordErrors.general}
                  </div>
                )}
                <Button
                    onClick={handleUpdatePassword}
                    disabled={isSavingPassword}
                    className="rounded-xl bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-black dark:text-white"
                  >
                    {isSavingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mise à jour...
                      </>
                    ) : passwordUpdated ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Mis à jour !
                      </>
                    ) : (
                      'Mettre à jour le mot de passe'
                    )}
                  </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">Préférences de notification</CardTitle>
                <CardDescription>
                  Choisissez comment vous souhaitez recevoir les notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'email', label: 'Notifications par email', description: 'Recevoir les mises à jour par email' },
                  { key: 'push', label: 'Notifications push', description: 'Recevoir des alertes instantanées dans votre navigateur' },
                  { key: 'sms', label: 'Notifications par SMS', description: 'Recevoir des SMS pour les mises à jour urgentes' },
                  { key: 'whatsapp', label: 'Notifications WhatsApp', description: 'Recevoir les mises à jour via WhatsApp' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
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

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">Apparence</CardTitle>
                <CardDescription>
                  Personnaliser l\'apparence de l\'application sur votre appareil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      { value: 'light' as const, label: 'Clair', icon: Sun },
                      { value: 'dark' as const, label: 'Sombre', icon: Moon },
                      { value: 'system' as const, label: 'Système', icon: Monitor },
                    ].map((option) => (
                      <div
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                          theme === option.value
                            ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/30'
                            : 'border-border hover:border-violet-300 dark:hover:border-violet-600'
                        }`}
                      >
                        <option.icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Select value={language} onValueChange={(value) => setLanguage(value || 'en')}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">Anglais</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select value={timezone} onValueChange={(value) => setTimezone(value || 'africa-casablanca')}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa-casablanca">Africa/Casablanca (GMT+1)</SelectItem>
                      <SelectItem value="europe-paris">Europe/Paris (GMT+2)</SelectItem>
                      <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">Sécurité</CardTitle>
                <CardDescription>
                  Gérer les paramètres de sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    <div>
                      <p className="font-medium">Authentification à deux facteurs</p>
                      <p className="text-sm text-muted-foreground">
                        Ajouter une couche de sécurité supplémentaire à votre compte
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-xl"
                    onClick={handleToggle2FA}
                  >
                    {twoFactorEnabled ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>

                <Separator />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Appareils actifs</p>
                      <p className="text-sm text-muted-foreground">
                        Gérer les appareils pouvant accéder à votre compte
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-xl"
                    onClick={handleManageDevices}
                  >
                    Gérer
                  </Button>
                  
                </div>

                

                <div className="space-y-4">
                  
                  {activeSessions.map((session) => (
                    <div
                      key={session.device}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-muted/50 p-3 sm:p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/30">
                          {session.device.includes('Mac') || session.device.includes('iPhone') ? (
                            <Smartphone className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          ) : (
                            <Monitor className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{session.device}</p>
                            {session.current && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Actuel</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:gap-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!session.current && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleRevokeSession(session.device)}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Révoquer
                        </Button>
                      )}
                    </div>
                  ))}
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