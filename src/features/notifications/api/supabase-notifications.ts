/**
 * API Notifications — Supabase.
 * CRUD sur la table `notification` (création, lecture, marquage, suppression).
 * Les requêtes utilisent RLS pour filtrer par utilisateur connecté.
 */

import { supabase, SUPABASE_TABLES } from '@/lib/supabase';
import type { NotificationRow } from '@/types/supabase';
import type { Notification } from '@/types';

const typeMap: Record<string, string> = {
  delivery: 'delivery',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  event: 'event',
  system: 'system',
};

function rowToNotification(row: NotificationRow): Notification {
  const date = row.date_notification ? new Date(row.date_notification) : new Date();
  return {
    id_notification: row.id_notification,
    titre: row.titre,
    message: row.message,
    type: typeMap[row.type ?? 'info'] ?? 'info',
    lue: row.lue ?? false,
    createdAt: date,
    dateNotification: date,
    idUtilisateur: row.id_utilisateur ?? '',
    actionUrl: row.action_url ?? undefined,
  };
}

/**
 * Crée une notification en base.
 * Retourne la notification créée ou null.
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  options?: { type?: string; actionUrl?: string }
): Promise<Notification | null> {
  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.NOTIFICATION)
      .insert({
        titre: title,
        message,
        type: options?.type ?? 'info',
        action_url: options?.actionUrl ?? null,
        id_utilisateur: userId,
        lue: false,
      })
      .select()
      .single();

    if (error || !data) return null;
    return rowToNotification(data as NotificationRow);
  } catch {
    return null;
  }
}

/**
 * Récupère les `limit` dernières notifications de l'utilisateur connecté.
 * RLS filtre automatiquement par `id_utilisateur = auth.uid()`.
 */
export async function fetchNotifications(limit = 50): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.NOTIFICATION)
      .select('*')
      .order('date_notification', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return (data as NotificationRow[]).map(rowToNotification);
  } catch {
    return [];
  }
}

/**
 * Récupère le nombre de notifications non lues.
 */
export async function fetchUnreadCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from(SUPABASE_TABLES.NOTIFICATION)
      .select('*', { count: 'exact', head: true })
      .eq('lue', false);

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(SUPABASE_TABLES.NOTIFICATION)
      .update({ lue: true })
      .eq('id_notification', id);
    return !error;
  } catch {
    return false;
  }
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(SUPABASE_TABLES.NOTIFICATION)
      .update({ lue: true })
      .eq('lue', false);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteNotification(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(SUPABASE_TABLES.NOTIFICATION)
      .delete()
      .eq('id_notification', id);
    return !error;
  } catch {
    return false;
  }
}
