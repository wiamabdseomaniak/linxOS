/**
 * API Activité du tableau de bord.
 * Regroupe les appels à l'endpoint `/api/dashboard` pour les sections
 * "activité récente", "problèmes" et "livraisons urgentes".
 *
 * Une mémoïsation simple évite de re-frapper l'API tant que `clearActivityCache` n'est pas appelé.
 */

import type {
  ActivityItem,
  ProblemReport,
} from '@/types/supabase';
import type { DeliveryPriority } from '@/types/supabase';

// Forme applicative d'une livraison urgente utilisée par les composants UI.
export interface UrgentDelivery {
  id: string;
  trackingId: string;
  clientName: string;
  city: string;
  priority: DeliveryPriority;
  scheduledDate: Date;
}

interface DashboardApiResponse {
  activity: { id: string; action: string; driver: string | null; status: string }[];
  problems: { id: string; event: string; problem: string; count: number; status: string; statusColor: string }[];
  urgent: { id: string; trackingId: string; clientName: string; city: string; priority: string; scheduledDate: string }[];
}

// Cache mémoire partagé par les fonctions de ce module.
let cachedDashboard: DashboardApiResponse | null = null;

/**
 * Appelle `/api/dashboard` une seule fois par cycle de vie du module
 * puis sert le cache aux consommateurs.
 */
async function fetchDashboardActivity(): Promise<DashboardApiResponse> {
  if (cachedDashboard) return cachedDashboard;
  const res = await fetch('/api/dashboard');
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  const data = await res.json();
  cachedDashboard = { activity: data.activity, problems: data.problems, urgent: data.urgent };
  return cachedDashboard;
}

// Vide le cache (à appeler après une mutation côté serveur, par exemple).
export function clearActivityCache() {
  cachedDashboard = null;
}

export async function fetchActivityTimeline(limit = 8): Promise<ActivityItem[]> {
  const data = await fetchDashboardActivity();
  return data.activity.slice(0, limit).map(a => ({
    id: a.id,
    action: a.action,
    driver: a.driver,
    status: a.status,
  }));
}

export async function fetchProblemReports(): Promise<ProblemReport[]> {
  const data = await fetchDashboardActivity();
  return data.problems as ProblemReport[];
}

export async function fetchUrgentDeliveries(limit = 3): Promise<UrgentDelivery[]> {
  const data = await fetchDashboardActivity();
  return data.urgent.slice(0, limit).map(u => ({
    id: u.id,
    trackingId: u.trackingId,
    clientName: u.clientName,
    city: u.city,
    priority: 'urgent' as DeliveryPriority,
    scheduledDate: new Date(u.scheduledDate),
  }));
}