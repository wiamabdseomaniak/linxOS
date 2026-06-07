/**
 * Page Notifications — historique complet.
 * Filtre lues / non lues, trie par date, permet de marquer comme lu
 * ou de supprimer. Branchée sur le hook `useNotifications`
 * (avec abonnement temps réel Supabase).
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Package,
  Truck,
  User,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotifications } from '@/features/notifications/hooks/use-notifications';
import { cn } from '@/lib/utils';

// Mapping type de notification → icône Lucide.
const notificationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  delivery: Package,
  event: Calendar,
  alert: AlertTriangle,
  system: Bell,
};

const notificationColors: Record<string, string> = {
  success: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  error: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  warning: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
  info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  delivery: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30',
  event: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  alert: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
  system: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30',
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, remove } = useNotifications();
  const [filterType, setFilterType] = useState('unread');

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.lue;
    if (filterType === 'read') return n.lue;
    return true;
  });

  // Formate une date en durée relative FR ("il y a 5 min", "il y a 2 h", etc.).
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours} h`;
    return `Il y a ${days} j`;
  };

  return (
    <div className="space-y-6">
      {/* En-tête : titre + compteur de non-lues + bouton "tout marquer comme lu". */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Tout est à jour !'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="rounded-xl"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
        </div>
      </motion.div>

      {/* Barre de filtres : onglets Non lues / Lues + tri par date. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Tabs defaultValue="unread" className="w-full sm:w-auto" onValueChange={(v) => setFilterType(v)}>
                <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                  <TabsTrigger value="unread">Non lues</TabsTrigger>
                  <TabsTrigger value="read">Lues</TabsTrigger>
                </TabsList>
              </Tabs>
              <Select defaultValue="newest">
                <SelectTrigger className="w-full rounded-xl sm:w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récentes d'abord</SelectItem>
                  <SelectItem value="oldest">Plus anciennes d'abord</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        {filteredNotifications.length === 0 ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-violet-100 p-4 dark:bg-violet-900/30">
                <Bell className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Aucune notification</h3>
              <p className="text-sm text-muted-foreground">
                Tout est à jour ! Revenez plus tard pour les mises à jour.
              </p>
            </CardContent>
          </Card>
        ) : (
          // Chaque carte de notification : icône colorée, titre (avec pastille non-lue), message, actions.
          filteredNotifications.map((notification, index) => {
            const Icon = notificationIcons[notification.type];
            return (
              <motion.div
                key={notification.id_notification}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    'border-0 shadow-soft transition-all hover:shadow-md',
                    // Fond dégradé violet pour mettre en valeur les non-lues.
                    !notification.lue && 'bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-950/10 dark:to-purple-950/10'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={cn('rounded-full p-2', notificationColors[notification.type])}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className={cn('font-semibold', !notification.lue && 'text-violet-600')}>
                              {notification.titre}
                            </h4>
                            {/* Pastille violette pour les notifications non lues. */}
                            {!notification.lue && (
                              <span className="h-2 w-2 rounded-full bg-violet-600" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(new Date(notification.createdAt || notification.dateNotification))}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-sm text-violet-600 hover:text-violet-700 hover:underline"
                          >
                            Voir les détails
                          </a>
                        )}
                      </div>
                      {/* Actions : marquer comme lu (si non lue) + supprimer. */}
                      <div className="flex items-center gap-1">
                        {!notification.lue && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id_notification)}
                            title="Marquer comme lu"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => remove(notification.id_notification)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}