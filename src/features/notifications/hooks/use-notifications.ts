/**
 * Hook Notifications.
 * Charge la liste, expose les actions (marquer lu, tout marquer, supprimer)
 * et s'abonne au canal temps réel Supabase pour rafraîchir automatiquement
 * la liste à chaque modification côté serveur.
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, SUPABASE_TABLES, isSupabaseConfigured } from '@/lib/supabase';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/features/notifications/api/supabase-notifications';
import type { Notification } from '@/types';

// Forme publique du hook : données + compteurs + actions.
interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

/**
 * Hook for fetching and managing user notifications from Supabase.
 * Subscribes to realtime changes on the notifications table.
 */
export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Référence mutable vers le canal Supabase Realtime (permet le cleanup au démontage).
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase.channel('notifications-changes');

    try {
      channelRef.current
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: SUPABASE_TABLES.NOTIFICATION },
          () => { refresh(); },
        )
        .subscribe();
    } catch {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [refresh]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id_notification === id ? { ...n, lue: true } : n)));
    await markNotificationAsRead(id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })));
    await markAllNotificationsAsRead();
  }, []);

  const remove = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id_notification !== id));
    await deleteNotification(id);
  }, []);

  const unreadCount = notifications.filter((n) => !n.lue).length;

  return { notifications, unreadCount, loading, error, refresh, markAsRead, markAllAsRead, remove };
}