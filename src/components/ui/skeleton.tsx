/**
 * Composant Skeleton — placeholder animé pour états de chargement.
 * Animation `animate-pulse` + fond `bg-muted`. Coins `rounded-2xl`.
 */

import { cn } from "@/lib/utils"

// Bloc gris clignotant à utiliser pendant le chargement d'un contenu réel.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-2xl bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
