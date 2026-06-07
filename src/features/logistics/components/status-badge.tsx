/**
 * Badge coloré affichant le statut d'une livraison.
 * Le mapping `STYLES` couple une couleur d'arrière-plan et un libellé FR
 * pour chaque valeur possible de `StatutLivraison`.
 */

import type { StatutLivraison } from '@/types/supabase';

// Couleur + libellé pour chaque statut. Type-safe grâce à `Record<StatutLivraison, …>`.
const STYLES: Record<StatutLivraison, { bg: string; label: string }> = {
  planifie: { bg: '#3498db', label: 'Planifié' },
  en_cours: { bg: '#e74c3c', label: 'En transit' },
  livree: { bg: '#2ecc71', label: 'Livré' },
  echouee: { bg: '#e74c3c', label: 'Échoué' },
};

/**
 * Affiche un petit badge rond indiquant le statut d'une livraison.
 * @param status Statut à représenter (clé du mapping `STYLES`).
 */
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
