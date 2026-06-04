import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { statut_livraison, description_probleme } = body;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(url, anonKey);

  const updateData: Record<string, unknown> = {};
  if (statut_livraison) updateData.statut_livraison = statut_livraison;
  if (description_probleme !== undefined) updateData.description_probleme = description_probleme;

  const { error } = await supabase
    .from('livraison')
    .update(updateData)
    .eq('id_livraison', id);

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
