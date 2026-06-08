/**
 * API Profil — Supabase.
 * Centralise les requêtes liées à la table `utilisateur` (lecture / mise à jour)
 * et adapte les lignes brutes au modèle `User` consommé par l'UI.
 */

import { supabase, SUPABASE_TABLES } from '@/lib/supabase';
import type { UtilisateurRow } from '@/types/supabase';
import type { User } from '@/types';

/**
 * Convertit une ligne Supabase `utilisateur` en modèle `User` de l'application.
 * Normalise les valeurs nulles et les dates ISO en objets `Date`.
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
    address: row.adresse ?? '',
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    totalDeliveries: 0,
    completedDeliveries: 0,
    inProgressDeliveries: 0,
    successRate: 0,
  };
}

/**
 * Récupère le profil de l'utilisateur courant à partir de la session Supabase.
 * Renvoie `null` si pas de session active ou si aucun profil ne correspond.
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
 * Récupère un profil directement par son identifiant.
 * Utilisé en repli tant que l'auth Supabase n'est pas relié à un compte.
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
 * Met à jour le profil de l'utilisateur authentifié.
 * Convertit le `name` complet en `prenom` + `nom` puis applique le patch SQL.
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
    if (patch.address) updatePayload.adresse = patch.address;

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