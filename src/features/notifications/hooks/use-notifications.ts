'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, SUPABASE_TABLES, isSupabaseConfigured } from '@/lib/supabase';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/features/notifications/api/supabase-notifications';
import type { Notification } from '@/types';

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

  // Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: SUPABASE_TABLES.NOTIFICATION },
        () => {
          refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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