import { supabase, SUPABASE_TABLES } from '@/lib/supabase';
import type { UtilisateurRow } from '@/types/supabase';
import type { User } from '@/types';

/**
 * Convert a Supabase utilisateur row to the app's User type.
 */
function rowToUser(row: UtilisateurRow): User {
  return {
    id: row.id_utilisateur,
    name: `${row.prenom} ${row.nom}`,
    email: row.email,
    phone: row.tele ?? '',
    role: 'manager',
    avatar: '',
    department: '',
    address: '',
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    totalDeliveries: 0,
    completedDeliveries: 0,
    inProgressDeliveries: 0,
    successRate: 0,
  };
}

/**
 * Fetch the current authenticated user profile from Supabase.
 * Returns null if no session or no profile.
 */
export async function fetchCurrentProfile(): Promise<User | null> {
  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !authUser) return null;

    const { data, error } = await supabase
      .from(SUPABASE_TABLES.UTILISATEUR)
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle();

    if (error || !data) return null;
    return rowToUser(data as UtilisateurRow);
  } catch {
    return null;
  }
}

/**
 * Fetch a profile by ID (used as a fallback when auth is not yet linked).
 */
export async function fetchProfileById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.UTILISATEUR)
      .select('*')
      .eq('id_utilisateur', id)
      .maybeSingle();

    if (error || !data) return null;
    return rowToUser(data as UtilisateurRow);
  } catch {
    return null;
  }
}

export interface ProfileUpdate {
  name?: string;
  phone?: string;
  address?: string;
  department?: string;
}

/**
 * Update the current authenticated user's profile.
 */
export async function updateCurrentProfile(
  patch: ProfileUpdate,
): Promise<{ success: boolean; error?: string; data?: User }> {
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return { success: false, error: 'Non authentifié' };

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (patch.name) {
      const parts = patch.name.trim().split(/\s+/);
      updatePayload.prenom = parts[0] ?? '';
      updatePayload.nom = parts.slice(1).join(' ') ?? '';
    }
    if (patch.phone) updatePayload.tele = patch.phone;

    const { data, error } = await supabase
      .from(SUPABASE_TABLES.UTILISATEUR)
      .update(updatePayload)
      .eq('email', authUser.email)
      .select('*')
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: rowToUser(data as UtilisateurRow) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erreur inconnue' };
  }
}