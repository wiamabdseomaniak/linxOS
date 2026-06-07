/**
 * Composant Label — étiquette de formulaire accessible.
 * Se grise automatiquement lorsque le contrôle associé est désactivé
 * (via `peer-disabled` ou `group-data-[disabled=true]`).
 */

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// Étiquette HTML associée à un champ (utiliser `htmlFor` pour lier l'input).
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
