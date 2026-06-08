/**
 * API Agrégats du tableau de bord.
 * Récupère via `/api/dashboard` les statistiques, performances et répartitions
 * et les expose via des fonctions spécialisées.
 */

import type {
  DashboardStats,
  WeeklyPerformance,
  CityData,
  StatusDistribution,
} from '@/types/supabase';
import { supabase } from '@/lib/supabase';

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

// Vide le cache — utile après une mutation (statut changé, livraison créée, etc.).
export function clearDashboardCache() {
  cachedDashboard = null;
}

// Renvoie les compteurs globaux (totaux, actives, terminées, échouées, revenus, clients).
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await fetchDashboardAll();
  return data.stats;
}

// Renvoie la performance journalière sur la semaine en cours.
export async function fetchWeeklyPerformance(): Promise<WeeklyPerformance[]> {
  const data = await fetchDashboardAll();
  return data.weekly;
}

const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

/**
 * Récupère les livraisons mensuelles directement depuis Supabase
 * sans passer par le cache du dashboard.
 */
export async function fetchMonthlyDeliveries(): Promise<WeeklyPerformance[]> {
  if (!supabase.from) return [];

  const { data } = await supabase
    .from('livraison')
    .select('date_prevue');

  const counts = new Array(12).fill(0);
  data?.forEach(r => {
    if (r.date_prevue) {
      counts[new Date(r.date_prevue).getUTCMonth()]++;
    }
  });

  return MONTH_NAMES.map((month, i) => ({
    day: month,
    livrées: counts[i],
    revenue: 0,
  }));
}

// Renvoie la répartition des livraisons par ville.
export async function fetchDeliveriesByCity(): Promise<CityData[]> {
  const data = await fetchDashboardAll();
  return data.byCity;
}

/**
 * Calcule la répartition par statut à partir des compteurs.
 * Déduit le nombre "planifié" par soustraction pour rester cohérent avec les autres sections.
 */
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
