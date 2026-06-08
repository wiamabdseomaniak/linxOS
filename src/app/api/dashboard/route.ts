/**
 * Route API : GET /api/dashboard
 * Agrège plusieurs sections du tableau de bord :
 * - Statistiques globales (totaux, par statut, clients actifs)
 * - Livraisons mensuelles
 * - Répartition par ville
 * - Activité récente (8 dernières livraisons)
 * - Problèmes signalés
 * - Livraisons urgentes en transit
 *
 * Les requêtes Supabase sont exécutées en parallèle pour minimiser la latence.
 */

import { createClient } from '@supabase/supabase-js';

// Force un rendu dynamique (pas de cache statique) car les données changent à chaque appel.
export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(url, anonKey);

  // 1. Statistiques agrégées : comptage par statut + clients uniques.
  const { data: stats } = await supabase
    .from('livraison')
    .select('statut_livraison, id_client');

  const total = stats?.length ?? 0;
  const enCours = stats?.filter(r => r.statut_livraison === 'en_cours').length ?? 0;
  const livrees = stats?.filter(r => r.statut_livraison === 'livree').length ?? 0;
  const echouees = stats?.filter(r => r.statut_livraison === 'echouee').length ?? 0;
  const clientsActifs = new Set(stats?.map(r => r.id_client).filter(Boolean)).size;

  // 2. Livraisons mensuelles : histogramme sur 12 mois à partir de `date_prevue`.
  const { data: monthly } = await supabase.from('livraison').select('date_prevue');
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const counts = new Array(12).fill(0);
  monthly?.forEach(r => {
    if (r.date_prevue) {
      counts[new Date(r.date_prevue).getUTCMonth()]++;
    }
  });

  // 3. Répartition par ville (les valeurs nulles sont regroupées sous "Inconnue").
  const { data: cities } = await supabase.from('livraison').select('ville');
  const cityMap = new Map<string, number>();
  cities?.forEach(r => {
    const c = r.ville || 'Inconnue';
    cityMap.set(c, (cityMap.get(c) || 0) + 1);
  });

  // 4. Activité récente : 8 dernières livraisons + leur historique de tracking.
  const { data: activity } = await supabase
    .from('livraison')
    .select('*, tracking(*)')
    .order('date_prevue', { ascending: false })
    .limit(8);

  // 5. Livraisons urgentes (en_cours, triées par date prévue, max 3) + jointure client.
  const { data: urgent } = await supabase
    .from('livraison')
    .select('*, client(*)')
    .eq('statut_livraison', 'en_cours')
    .order('date_prevue', { ascending: true })
    .limit(3);

  return Response.json({
    stats: {
      totalDeliveries: total,
      activeDeliveries: enCours,
      completedDeliveries: livrees,
      failedDeliveries: echouees,
      totalRevenue: 0,
      activeClients: clientsActifs,
    },
    weekly: monthNames.map((month, i) => ({ day: month, livrées: counts[i], revenue: 0 })),
    byCity: Array.from(cityMap.entries()).map(([city, livrées]) => ({ city, livrées, revenue: 0 })),
    activity: (activity ?? []).map(r => ({
      id: r.id_livraison,
      action: r.nom_evenement,
      driver: r.organisateur,
      status: r.statut_livraison ?? '',
    })),
    problems: (activity ?? []).filter(r => r.description_probleme).map(r => ({
      id: r.id_livraison,
      event: r.nom_evenement,
      problem: r.description_probleme ?? 'Problème signalé',
      count: 1,
      status: 'pending',
      statusColor: 'bg-yellow-100 text-yellow-700',
    })),
    urgent: (urgent ?? []).map(r => ({
      id: r.id_livraison,
      trackingId: r.id_livraison,
      clientName: r.organisateur,
      city: r.ville ?? '',
      priority: 'urgent',
      scheduledDate: r.date_prevue ? new Date(r.date_prevue).toISOString() : new Date().toISOString(),
    })),
  });
}
