/**
 * Route API : GET /api/search?q=<term>
 * Recherche globale multi-sources (livraisons + clients + utilisateurs).
 * Renvoie un tableau mixte limité à 10 résultats, trié par pertinence (ILIKE partiel).
 * Consommée par la barre de recherche globale de la Navbar.
 */

import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export type SearchResultType = 'delivery' | 'client' | 'driver';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  path: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return Response.json({ data: [] as SearchResult[] });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(url, anonKey);
  const pattern = `%${query}%`;

  // Lance les 3 recherches en parallèle pour minimiser la latence.
  const [deliveries, clients, drivers] = await Promise.all([
    supabase
      .from('livraison')
      .select('id_livraison, nom_evenement, ville, statut_livraison')
      .or(`id_livraison.ilike.${pattern},nom_evenement.ilike.${pattern},organisateur.ilike.${pattern},ville.ilike.${pattern}`)
      .order('date_prevue', { ascending: false })
      .limit(5),
    supabase
      .from('client')
      .select('id_client, nom_complet, telephone, ville:adresse')
      .or(`nom_complet.ilike.${pattern},email.ilike.${pattern},telephone.ilike.${pattern}`)
      .limit(3),
    supabase
      .from('utilisateur')
      .select('id_utilisateur, nom, prenom, email')
      .or(`nom.ilike.${pattern},prenom.ilike.${pattern},email.ilike.${pattern}`)
      .limit(3),
  ]);

  const results: SearchResult[] = [];

  for (const d of deliveries.data ?? []) {
    results.push({
      id: d.id_livraison,
      type: 'delivery',
      title: d.id_livraison,
      subtitle: `${d.nom_evenement ?? 'Livraison'} · ${d.ville ?? ''}`,
      path: `/logistics?focus=${d.id_livraison}`,
    });
  }

  for (const c of clients.data ?? []) {
    results.push({
      id: c.id_client,
      type: 'client',
      title: c.nom_complet,
      subtitle: c.telephone ?? 'Client',
      path: '/logistics',
    });
  }

  for (const u of drivers.data ?? []) {
    const fullName = `${u.prenom ?? ''} ${u.nom ?? ''}`.trim() || u.email;
    results.push({
      id: u.id_utilisateur,
      type: 'driver',
      title: fullName,
      subtitle: u.email,
      path: '/profile',
    });
  }

  return Response.json({ data: results.slice(0, 10) });
}
