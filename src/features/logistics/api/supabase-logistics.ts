/**
 * API Logistique — appels aux routes `/api/logistics`.
 * Gère la lecture paginée/filtrée et la mise à jour (statut, notes)
 * des livraisons. Les lignes brutes Supabase sont converties en `LogisticsEvent`.
 */

import type { LivraisonRow, LogisticsEvent, StatutLivraison } from '@/types/supabase';

/**
 * Convertit une ligne Supabase `livraison` (avec jointure `client` optionnelle)
 * en modèle `LogisticsEvent` consommé par l'UI (dates localisées FR, défauts, etc.).
 */
function rowToEvent(row: Partial<LivraisonRow>): LogisticsEvent {
  const dateObj = row.date_prevue ? new Date(row.date_prevue) : null;
  const client = (row as Record<string, unknown>).client as { nom_complet?: string; telephone?: string } | null ?? null;
  return {
    id: row.id_livraison ?? '',
    id_livraison: row.id_livraison ?? '',
    id_tracking: row.id_livraison ?? '',
    title: row.nom_evenement ?? 'Événement sans titre',
    club: row.organisateur ?? '',
    address: row.adresse_livraison ?? '',
    city: row.ville ?? '',
    date: dateObj
      ? dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : '',
    time: dateObj
      ? dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : '',
    quantity: Number(row.quantite ?? 0),
    contactName: client?.nom_complet ?? row.organisateur ?? '',
    contactPhone: client?.telephone ?? '',
    status: row.statut_livraison as StatutLivraison ?? 'planifie',
    statut_preparation: row.statut_preparation ?? 'en_attente',
    notes: row.description_probleme ?? undefined,
  };
}

// Filtres disponibles pour la requête `/api/logistics` (les valeurs "all" sont ignorées).
export interface LogisticsFilter {
  statut_livraison?: string;
  ville?: string;
}

/**
 * Récupère la liste des livraisons en appliquant les filtres `statut_livraison` et `ville`.
 * Renvoie un tableau vide en cas d'absence de données.
 */
export async function fetchLogisticsEvents(
  filter?: LogisticsFilter
): Promise<LogisticsEvent[]> {
  const params = new URLSearchParams();
  if (filter?.statut_livraison && filter.statut_livraison !== 'all') {
    params.set('statut_livraison', filter.statut_livraison);
  }
  if (filter?.ville && filter.ville !== 'all') {
    params.set('ville', filter.ville);
  }

  const res = await fetch(`/api/logistics?${params.toString()}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  const { data } = await res.json();
  if (!data) return [];
  return (data as LivraisonRow[]).map(rowToEvent);
}

// Réponse générique des endpoints PATCH : succès booléen + message d'erreur éventuel.
export interface StatusUpdateResult {
  success: boolean;
  error?: string;
}

/**
 * Met à jour le statut de livraison (`statut_livraison`) côté serveur.
 * Utilise l'endpoint PATCH `/api/logistics/:id`.
 */
export async function updateEventStatus(
  eventId: string,
  newStatus: StatutLivraison
): Promise<StatusUpdateResult> {
  try {
    const res = await fetch(`/api/logistics/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut_livraison: newStatus }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erreur réseau' };
  }
}

/**
 * Met à jour la description du problème (`description_probleme`) sur une livraison.
 * Endpoint PATCH `/api/logistics/:id`.
 */
export async function updateEventNotes(
  eventId: string,
  notes: string
): Promise<StatusUpdateResult> {
  try {
    const res = await fetch(`/api/logistics/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description_probleme: notes }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erreur réseau' };
  }
}
