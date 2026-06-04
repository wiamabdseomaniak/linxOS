import { supabase, SUPABASE_TABLES } from '@/lib/supabase';
import type { NotificationRow } from '@/types/supabase';
import type { Notification } from '@/types';

function rowToNotification(row: NotificationRow): Notification {
  const date = row.date_notification ? new Date(row.date_notification) : new Date();
  return {
    id_notification: row.id_notification,
    titre: row.titre,
    message: row.message,
    type: 'info',
    lue: row.lue ?? false,
    createdAt: date,
    dateNotification: date,
    idUtilisateur: row.id_utilisateur ?? '',
    actionUrl: undefined,
  };
}

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