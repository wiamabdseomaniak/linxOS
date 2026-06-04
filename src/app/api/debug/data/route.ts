import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return Response.json({ error: 'Missing env vars', url: !!url, anonKey: !!anonKey }, { status: 500 });
  }

  const supabase = createClient(url, anonKey);

  const { data: livraisons, error: err1 } = await supabase
    .from('livraison')
    .select('*')
    .limit(10);

  const { data: stats } = await supabase
    .from('livraison')
    .select('statut_livraison, id_client')
    .limit(100);

  if (err1) {
    return Response.json({ error: err1.message }, { status: 500 });
  }

  const statusDistribution: Record<string, number> = {};
  const clients = new Set<string>();
  stats?.forEach(r => {
    statusDistribution[r.statut_livraison] = (statusDistribution[r.statut_livraison] || 0) + 1;
    if (r.id_client) clients.add(r.id_client);
  });

  return Response.json({
    totalLivraisons: livraisons?.length ?? 0,
    livraisons: livraisons,
    statusDistribution,
    activeClients: clients.size,
    totalWithStats: stats?.length ?? 0,
  });
}
