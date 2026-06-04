import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statut = searchParams.get('statut_livraison') || 'all';
  const ville = searchParams.get('ville') || 'all';

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(url, anonKey);

  let query = supabase
    .from('livraison')
    .select('*, client:client(*)')
    .order('date_prevue', { ascending: false });

  if (statut && statut !== 'all') {
    query = query.eq('statut_livraison', statut);
  }
  if (ville && ville !== 'all') {
    query = query.eq('ville', ville);
  }

  const { data, error } = await query;
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data: data ?? [] });
}
