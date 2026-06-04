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

  // Try exact id_livraison match
  const { data: exact } = await supabase
    .from('livraison')
    .select('*, client:client(*)')
    .eq('id_livraison', query)
    .maybeSingle();

  if (exact) return Response.json({ data: exact });

  // Try event name match
  const { data: eventMatch } = await supabase
    .from('livraison')
    .select('*, client:client(*)')
    .ilike('nom_evenement', `%${query}%`)
    .order('date_prevue', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (eventMatch) return Response.json({ data: eventMatch });

  // Try organisateur match
  const { data: orgMatch } = await supabase
    .from('livraison')
    .select('*, client:client(*)')
    .ilike('organisateur', `%${query}%`)
    .order('date_prevue', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orgMatch) return Response.json({ data: orgMatch });

  return Response.json({ data: null });
}
