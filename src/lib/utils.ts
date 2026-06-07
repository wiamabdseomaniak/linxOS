/**
 * Utilitaires transverses utilisés dans toute l'application.
 * Contient notamment le helper `cn` (clsx + tailwind-merge) recommandé par shadcn/ui.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine des classes conditionnelles et résout les conflits Tailwind.
 * `clsx` évalue les valeurs falsy, `twMerge` garde la dernière déclaration gagnante.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
