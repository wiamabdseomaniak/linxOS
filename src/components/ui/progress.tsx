/**
 * Composant Progress (Base UI) — barre de progression accessible.
 * Expose : Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue.
 * La valeur (`value` entre 0 et 100) est automatiquement annoncée aux lecteurs d'écran.
 */

"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

// Racine : conteneur flex qui aligne label / value / track.
function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

// Piste (fond gris) sur laquelle glisse l'indicateur.
function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-3 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

// Indicateur coloré qui se remplit proportionnellement à `value`.
function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("h-full bg-primary transition-all", className)}
      {...props}
    />
  )
}

// Libellé textuel associé à la progression (ex : "Upload en cours").
function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

// Affichage textuel de la valeur (ex : "45 %"), aligné à droite (`ms-auto`).
function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ms-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
