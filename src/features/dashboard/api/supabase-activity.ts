import type {
  ActivityItem,
  ProblemReport,
} from '@/types/supabase';
import type { DeliveryPriority } from '@/types/supabase';

export interface UrgentDelivery {
  id: string;
  trackingId: string;
  clientName: string;
  city: string;
  priority: DeliveryPriority;
  scheduledDate: Date;
}

interface DashboardApiResponse {
  activity: { id: string; action: string; driver: string | null; time: string; status: string }[];
  problems: { id: string; event: string; problem: string; count: number; status: string; statusColor: string }[];
  urgent: { id: string; trackingId: string; clientName: string; city: string; priority: string; scheduledDate: string }[];
}

let cachedDashboard: DashboardApiResponse | null = null;

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

export function clearActivityCache() {
  cachedDashboard = null;
}

export async function fetchActivityTimeline(limit = 8): Promise<ActivityItem[]> {
  const data = await fetchDashboardActivity();
  return data.activity.slice(0, limit).map(a => ({
    id: a.id,
    action: a.action,
    driver: a.driver,
    time: a.time,
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