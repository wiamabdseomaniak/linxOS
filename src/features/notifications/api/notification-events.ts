/**
 * Service de notifications métier — LINXOS.
 * Crée des notifications lors d'événements clés (livraison, sponsoring, preuve).
 * Deux versions :
 *  - `createBrowserNotification` (côté client, via le proxy Supabase)
 *  - `createServerNotification` (côté API route, nécessite un client Supabase)
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// ── Mapping type → libellé ────────────────────────────────────
const EVENT_LABELS: Record<string, { title: string; type: string }> = {
  sponsoring_created: { title: 'Nouvelle demande de sponsoring', type: 'event' },
  delivery_assigned: { title: 'Livraison assignée', type: 'delivery' },
  delivery_updated: { title: 'Livraison modifiée', type: 'info' },
  delivery_validated: { title: 'Livraison validée', type: 'success' },
  delivery_rejected: { title: 'Livraison rejetée', type: 'error' },
  proof_added: { title: 'Preuve de consommation ajoutée', type: 'info' },
  proof_validated: { title: 'Preuve de consommation validée', type: 'success' },
};

function getEventConfig(eventType: string) {
  return EVENT_LABELS[eventType] ?? { title: 'Notification', type: 'info' };
}

/**
 * Crée une notification via le client navigateur (proxy Supabase).
 * Utilisé dans les composants React / hooks.
 */
export async function createBrowserNotification(
  userId: string,
  eventType: string,
  message: string,
  actionUrl?: string,
) {
  const { supabase } = await import('@/lib/supabase');
  const config = getEventConfig(eventType);

  const { error } = await supabase
    .from('notification')
    .insert({
      titre: config.title,
      message,
      type: config.type,
      action_url: actionUrl ?? null,
      id_utilisateur: userId,
      lue: false,
    });

  if (error) {
    console.error('[Notification] Erreur création:', error.message);
  }
}

/**
 * Crée une notification côté serveur (dans une API route).
 * Nécessite un client Supabase déjà authentifié (service_role).
 */
export async function createServerNotification(
  supabase: SupabaseClient,
  userId: string,
  eventType: string,
  message: string,
  actionUrl?: string,
) {
  const config = getEventConfig(eventType);

  const { error } = await supabase
    .from('notification')
    .insert({
      titre: config.title,
      message,
      type: config.type,
      action_url: actionUrl ?? null,
      id_utilisateur: userId,
      lue: false,
    });

  if (error) {
    console.error('[Notification] Erreur création serveur:', error.message);
  }
}
