/**
 * Hook principal du tableau de bord.
 * Charge en parallèle toutes les sections (stats, weekly, byCity, byStatus,
 * activity, problems, urgent) et expose un état consolidé + un `refresh()`.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  fetchDashboardStats,
  fetchWeeklyPerformance,
  fetchDeliveriesByCity,
  fetchStatusDistribution,
} from '@/features/dashboard/api/supabase-dashboard';
import {
  fetchActivityTimeline,
  fetchProblemReports,
  fetchUrgentDeliveries,
  type UrgentDelivery,
} from '@/features/dashboard/api/supabase-activity';
import type {
  DashboardStats,
  WeeklyPerformance,
  CityData,
  StatusDistribution,
  ActivityItem,
  ProblemReport,
} from '@/types/supabase';

// Valeur initiale "neutre" pour éviter les `undefined` dans les vues avant chargement.
const EMPTY_STATS: DashboardStats = {
  totalDeliveries: 0,
  activeDeliveries: 0,
  completedDeliveries: 0,
  failedDeliveries: 0,
  totalRevenue: 0,
  activeClients: 0,
};

// Forme de retour publique du hook.
interface UseDashboardResult {
  stats: DashboardStats;
  weekly: WeeklyPerformance[];
  byCity: CityData[];
  byStatus: StatusDistribution[];
  activity: ActivityItem[];
  problems: ProblemReport[];
  urgent: UrgentDelivery[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Aggregated dashboard data hook.
 * Fetches all dashboard sections in parallel and exposes loading + error states.
 */
export function useDashboard(): UseDashboardResult {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [weekly, setWeekly] = useState<WeeklyPerformance[]>([]);
  const [byCity, setByCity] = useState<CityData[]>([]);
  const [byStatus, setByStatus] = useState<StatusDistribution[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [problems, setProblems] = useState<ProblemReport[]>([]);
  const [urgent, setUrgent] = useState<UrgentDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, w, c, st, a, p, u] = await Promise.all([
        fetchDashboardStats(),
        fetchWeeklyPerformance(),
        fetchDeliveriesByCity(),
        fetchStatusDistribution(),
        fetchActivityTimeline(8),
        fetchProblemReports(),
        fetchUrgentDeliveries(3),
      ]);
      setStats(s);
      setWeekly(w);
      setByCity(c);
      setByStatus(st);
      setActivity(a);
      setProblems(p);
      setUrgent(u);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, weekly, byCity, byStatus, activity, problems, urgent, loading, error, refresh };
}