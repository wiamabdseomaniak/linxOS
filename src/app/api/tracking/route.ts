/**
 * Route API publique : GET /api/tracking
 * Recherche une livraison par requête texte (ID, nom d'événement ou organisateur).
 * Endpoint consommé par la page publique `/track` (sans authentification).
 */

import { createClient } from '@supabase/supabase-js';
import type { LivraisonRow } from '@/types/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();

  if (!query) {
    return Response.json({ data: null });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(url, anonKey);

  // Stratégie de recherche en cascade : on essaie d'abord la correspondance exacte
  // sur l'ID, puis sur le nom d'événement (LIKE), puis sur l'organisateur.

  // 1. Match exact sur id_livraison.
  const { data: exact } = await supabase
    .from('livraison')
    .select('*, client:client(*)')
    .eq('id_livraison', query)
    .maybeSingle();

  if (exact) return Response.json({ data: exact });

  // 2. Recherche partielle sur le nom d'événement.
  const { data: eventMatch } = await supabase
    .from('livraison')
    .select('*, client:client(*)')
    .ilike('nom_evenement', `%${query}%`)
    .order('date_prevue', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (eventMatch) return Response.json({ data: eventMatch });

  // 3. Recherche partielle sur l'organisateur.
  const { data: orgMatch } = await supabase
    .from('livraison')
    .select('*, client:client(*)')
    .ilike('organisateur', `%${query}%`)
    .order('date_prevue', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orgMatch) return Response.json({ data: orgMatch });

  // Aucune correspondance : la page publique affichera un message "non trouvé".
  return Response.json({ data: null });
}
