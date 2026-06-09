'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { getSupabase, SUPABASE_TABLES, isSupabaseConfigured } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
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

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<SupabaseClient['channel']> | null>(null);

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

  // Souscription Realtime unique (créée une seule fois au montage)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const client = getSupabase();
    if (!client) return;

    const channel = client.channel(`notifications-${Date.now()}`);

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: SUPABASE_TABLES.NOTIFICATION },
        (payload) => {
          console.log('[Notif] Realtime INSERT reçu:', payload.new);
          const newRow = payload.new as Record<string, unknown>;
          const title = (newRow.titre as string) ?? 'Nouvelle notification';
          const message = (newRow.message as string) ?? '';
          toast(title, { description: message, duration: 5000 });
          refresh();
        },
      )
      .subscribe((status) => {
        console.log('[Notif] Souscription Realtime status:', status);
      });

    channelRef.current = channel;

    return () => {
      console.log('[Notif] Nettoyage souscription Realtime');
      client.removeChannel(channel);
      channelRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
