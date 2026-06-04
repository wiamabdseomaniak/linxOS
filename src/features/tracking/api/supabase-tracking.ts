import type { LivraisonRow, LogisticsEvent, StatutLivraison } from '@/types/supabase';

function rowToEvent(row: LivraisonRow): LogisticsEvent {
  const dateObj = row.date_prevue ? new Date(row.date_prevue) : null;
  const client = row.client ?? null;
  return {
    id: row.id_livraison,
    id_livraison: row.id_livraison,
    id_tracking: row.id_livraison,
    title: row.nom_evenement ?? 'Événement sans titre',
    club: row.organisateur,
    address: row.adresse_livraison,
    city: row.ville ?? '',
    date: dateObj
      ? dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : '',
    time: dateObj
      ? dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : '',
    quantity: Number(row.quantite ?? 0),
    contactName: client?.nom_complet ?? row.organisateur,
    contactPhone: client?.telephone ?? '',
    status: (row.statut_livraison as StatutLivraison) ?? 'planifie',
    statut_preparation: row.statut_preparation ?? 'en_attente',
    notes: row.description_probleme ?? undefined,
  };
}

export async function trackByQuery(query: string): Promise<LogisticsEvent | null> {
  try {
    const trimmed = query.trim();
    if (!trimmed) return null;

    const res = await fetch(`/api/tracking?query=${encodeURIComponent(trimmed)}`);
    if (!res.ok) return null;

    const { data } = await res.json();
    if (!data) return null;

    return rowToEvent(data as LivraisonRow);
  } catch {
    return null;
  }
}
