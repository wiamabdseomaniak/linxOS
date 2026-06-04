import { Package, Calendar, Truck, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { StatutLivraison } from '@/types/supabase';

export interface StatusCounts {
  all: number;
  scheduled: number;
  in_transit: number;
  delivered: number;
  failed: number;
}

export const CITIES = [
  { value: 'all', label: 'Toutes les villes' },
  { value: 'Casablanca', label: 'Casablanca' },
  { value: 'Rabat', label: 'Rabat' },
  { value: 'Marrakech', label: 'Marrakech' },
];

export const STAT_CARDS = [
  { key: 'all', title: 'Total des événements', color: 'violet' as const, icon: Package, subtitle: 'Tout temps confondu', getValue: (c: StatusCounts) => c.all },
  { key: 'scheduled', title: 'Planifié', color: 'blue' as const, icon: Calendar, subtitle: 'Livraison en attente', getValue: (c: StatusCounts) => c.scheduled },
  { key: 'in_transit', title: 'En transit', color: 'red' as const, icon: Truck, subtitle: 'En cours d\'acheminement', getValue: (c: StatusCounts) => c.in_transit },
  { key: 'completed', title: 'Terminé', color: 'green' as const, icon: CheckCircle2, subtitle: '', getValue: (c: StatusCounts) => c.delivered },
];

export const STATUS_TABS: { status: StatutLivraison; label: string; icon: LucideIcon }[] = [
  { status: 'planifie', label: 'Planifié', icon: Calendar },
  { status: 'en_cours', label: 'En transit', icon: Truck },
  { status: 'livree', label: 'Livré', icon: CheckCircle2 },
  { status: 'echouee', label: 'Échoué', icon: Package },
];

export const STATUS_ACTIVE_CLASS = 'bg-[#f5c400] text-black';
export const STATUS_INACTIVE_CLASS = 'bg-white text-gray-600 border';
