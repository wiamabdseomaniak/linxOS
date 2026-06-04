'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchCurrentProfile, updateCurrentProfile, type ProfileUpdate } from '@/features/auth/api/supabase-profile';
import type { User } from '@/types';

interface UseCurrentUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateProfile: (patch: ProfileUpdate) => Promise<boolean>;
}

/**
 * Hook to fetch and update the current authenticated user profile from Supabase.
 * Returns null/loading when Supabase is not configured or no session is present.
 */
export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await fetchCurrentProfile();
      setUser(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateProfile = useCallback(
    async (patch: ProfileUpdate) => {
      const result = await updateCurrentProfile(patch);
      if (result.success && result.data) {
        setUser(result.data);
        return true;
      }
      setError(result.error ?? null);
      return false;
    },
    [],
  );

  return { user, loading, error, refresh, updateProfile };
}