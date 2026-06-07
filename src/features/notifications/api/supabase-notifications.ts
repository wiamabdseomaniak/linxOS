/**
 * API Notifications — Supabase.
 * CRUD sur la table `notification` (lecture, marquage lu, suppression).
 * Convertit les lignes Supabase en modèle applicatif `Notification`.
 */

import { supabase, SUPABASE_TABLES } from '@/lib/supabase';
import type { NotificationRow } from '@/types/supabase';
import type { Notification } from '@/types';

/**
 * Adapte une ligne Supabase `notification` au modèle `Notification` consommé par l'UI.
 * Gère le typage par défaut (`type: 'info'`, `lue: false`).
 */
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

/**
 * Récupère les `limit` dernières notifications triées par date décroissante.
 * Renvoie un tableau vide en cas d'erreur.
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
 * Marque une notification comme lue (`lue = true`).
 * Renvoie `true` si la mise à jour a réussi.
 */
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

/**
 * Marque toutes les notifications non lues comme lues en une seule requête.
 */
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

/**
 * Supprime définitivement une notification par son identifiant.
 */
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