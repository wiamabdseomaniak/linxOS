import type { StatutLivraison } from '@/types/supabase';

const STYLES: Record<StatutLivraison, { bg: string; label: string }> = {
  planifie: { bg: '#3498db', label: 'Planifié' },
  en_cours: { bg: '#e74c3c', label: 'En transit' },
  livree: { bg: '#2ecc71', label: 'Livré' },
  echouee: { bg: '#e74c3c', label: 'Échoué' },
};

export function StatusBadge({ status }: { status: StatutLivraison }) {
  const s = STYLES[status];
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: s.bg }}
    >
      {s.label}
    </span>
  );
}
