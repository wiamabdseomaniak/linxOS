'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type {
  DashboardStats,
  WeeklyPerformance,
  CityData,
  StatusDistribution,
  ActivityItem,
  ProblemReport,
} from '@/types/supabase';

interface DashboardApiResponse {
  stats: DashboardStats;
  weekly: WeeklyPerformance[];
  byCity: CityData[];
  activity: { id: string; action: string; driver: string | null; status: string }[];
  problems: { id: string; event: string; problem: string; count: number; status: string; statusColor: string }[];
  urgent: { id: string; trackingId: string; clientName: string; city: string; priority: string; scheduledDate: string }[];
}

interface UrgentDelivery {
  id: string;
  trackingId: string;
  clientName: string;
  city: string;
  priority: 'urgent';
  scheduledDate: Date;
}

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

const EMPTY_STATS: DashboardStats = {
  totalDeliveries: 0,
  activeDeliveries: 0,
  completedDeliveries: 0,
  failedDeliveries: 0,
  totalRevenue: 0,
  activeClients: 0,
};

function computeStatusDistribution(stats: DashboardStats): StatusDistribution[] {
  const colorMap: Record<string, string> = {
    livree: '#22c55e',
    en_cours: '#ef4444',
    planifie: '#3b82f6',
    echouee: '#f97316',
  };
  return [
    { name: 'planifie', value: stats.totalDeliveries - stats.activeDeliveries - stats.completedDeliveries - stats.failedDeliveries, color: colorMap.planifie },
    { name: 'en_cours', value: stats.activeDeliveries, color: colorMap.en_cours },
    { name: 'livree', value: stats.completedDeliveries, color: colorMap.livree },
    { name: 'echouee', value: stats.failedDeliveries, color: colorMap.echouee },
  ].filter(s => s.value > 0);
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const stats = data?.stats ?? EMPTY_STATS;
  const weekly = data?.weekly ?? [];
  const byCity = data?.byCity ?? [];
  const byStatus = useMemo(() => computeStatusDistribution(stats), [stats]);
  const activity: ActivityItem[] = useMemo(
    () => (data?.activity ?? []).map(a => ({ id: a.id, action: a.action, driver: a.driver, status: a.status })),
    [data?.activity],
  );
  const problems: ProblemReport[] = useMemo(() => (data?.problems ?? []) as ProblemReport[], [data?.problems]);
  const urgent: UrgentDelivery[] = useMemo(
    () => (data?.urgent ?? []).map(u => ({
      id: u.id,
      trackingId: u.trackingId,
      clientName: u.clientName,
      city: u.city,
      priority: 'urgent' as const,
      scheduledDate: new Date(u.scheduledDate),
    })),
    [data?.urgent],
  );

  return { stats, weekly, byCity, byStatus, activity, problems, urgent, loading, error, refresh };
}
