import type {
  DashboardStats,
  WeeklyPerformance,
  CityData,
  StatusDistribution,
} from '@/types/supabase';

interface DashboardApiResponse {
  stats: DashboardStats;
  weekly: WeeklyPerformance[];
  byCity: CityData[];
  activity: { id: string; action: string; driver: string | null; time: string; status: string }[];
  problems: { id: string; event: string; problem: string; count: number; status: string; statusColor: string }[];
  urgent: { id: string; trackingId: string; clientName: string; city: string; priority: string; scheduledDate: string }[];
}

let cachedDashboard: DashboardApiResponse | null = null;

async function fetchDashboardAll(): Promise<DashboardApiResponse> {
  if (cachedDashboard) return cachedDashboard;
  const res = await fetch('/api/dashboard');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  cachedDashboard = data;
  return data;
}

export function clearDashboardCache() {
  cachedDashboard = null;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await fetchDashboardAll();
  return data.stats;
}

export async function fetchWeeklyPerformance(): Promise<WeeklyPerformance[]> {
  const data = await fetchDashboardAll();
  return data.weekly;
}

export async function fetchDeliveriesByCity(): Promise<CityData[]> {
  const data = await fetchDashboardAll();
  return data.byCity;
}

export async function fetchStatusDistribution(): Promise<StatusDistribution[]> {
  const data = await fetchDashboardAll();
  const colorMap: Record<string, string> = {
    livree: '#22c55e',
    en_cours: '#ef4444',
    planifie: '#3b82f6',
    echouee: '#f97316',
  };
  return [
    { name: 'planifie', value: data.stats.totalDeliveries - data.stats.activeDeliveries - data.stats.completedDeliveries - data.stats.failedDeliveries, color: colorMap.planifie },
    { name: 'en_cours', value: data.stats.activeDeliveries, color: colorMap.en_cours },
    { name: 'livree', value: data.stats.completedDeliveries, color: colorMap.livree },
    { name: 'echouee', value: data.stats.failedDeliveries, color: colorMap.echouee },
  ].filter(s => s.value > 0);
}
