/**
 * Page publique de suivi — accessible sans authentification.
 * Permet à un destinataire de retrouver une livraison via son ID de suivi
 * et d'afficher un mini-timeline + les informations de contact.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, MapPin, Phone, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { trackByQuery } from '@/features/tracking/api/supabase-tracking';
import { cn } from '@/lib/utils';
import type { LogisticsEvent } from '@/types/supabase';

// Étapes du mini-timeline affiché à l'utilisateur final.
const steps = [
  { id: 'planifie', label: 'Planifié', icon: Calendar },
  { id: 'en_cours', label: 'En transit', icon: Truck },
  { id: 'livree', label: 'Livré', icon: CheckCircle2 },
];

export default function TrackPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundEvent, setFoundEvent] = useState<LogisticsEvent | null>(null);
  const [searching, setSearching] = useState(false);

  // Déclenche la recherche via l'API et met à jour l'état local.
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const event = await trackByQuery(searchQuery);
      setFoundEvent(event);
    } finally {
      setSearching(false);
    }
  };

  // Renvoie l'index de l'étape courante dans le mini-timeline.
  const getCurrentStepIndex = (status: string) => {
    if (status === 'echouee') return -1;
    return steps.findIndex((s) => s.id === status);
  };

  // Libellé FR associé à un statut de livraison.
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planifie': return 'Planifié';
      case 'en_cours': return 'En transit';
      case 'livree': return 'Livré';
      case 'echouee': return 'Échouée';
      default: return status;
    }
  };

  return (
    // Conteneur plein écran avec un dégradé jaune/indigo (clair) ou gris (sombre).
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* En-tête minimaliste : lien de retour vers la page de connexion. */}
      <header className="border-b bg-white/80 backdrop-blur-xl dark:bg-gray-900/80">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link href="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Bloc d'accroche : logo (variante claire + sombre) + titre + sous-titre.
            Animation Framer Motion : léger fondu descendant à l'apparition. */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <img
            src="/L__2_-removebg-preview.png"
            alt="LINXOS"
            className="mx-auto mb-4 h-16 w-auto dark:hidden"
          />
          <img
            src="/L-removebg-preview.png"
            alt="LINXOS"
            className="mx-auto mb-4 hidden h-16 w-auto dark:block"
          />
          <h1 className="text-3xl font-bold">Suivez votre livraison</h1>
          <p className="mt-2 text-muted-foreground">
            Saisissez votre ID de suivi, ID de livraison ou numéro de téléphone
          </p>
        </motion.div>

        {/* Carte de recherche : champ texte + bouton "Suivre".
            La recherche se déclenche au clic ou via la touche Entrée.
            Le bouton est désactivé tant que le champ est vide ou pendant le chargement. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ID de livraison or ID de suivi"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-12 sm:h-14 rounded-xl pl-10 sm:pl-12 text-base sm:text-lg"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  disabled={searching || !searchQuery.trim()}
                  className="h-12 sm:h-14 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 px-4 sm:px-8 w-full sm:w-auto shadow-lg shadow-yellow-500/25 dark:bg-yellow-600 dark:hover:bg-yellow-500"
                >
                  {searching ? 'Recherche…' : 'Suivre'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {foundEvent ? (
          // Carte de résultat : entête jaune avec ID de suivi + statut + quantité,
          // puis mini-timeline, alerte éventuelle et grille de détails.
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <Card className="border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white dark:from-yellow-600 dark:to-yellow-600">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{foundEvent.id_tracking}</CardTitle>
                    <p className="mt-1 text-white/80 dark:text-white/60">
                      {getStatusLabel(foundEvent.status)}
                    </p>
                  </div>
                  <Badge className="bg-white/20 text-white dark:bg-black/20 dark:text-gray-200 text-lg px-4 py-1">
                    {foundEvent.quantity} units
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Mini-timeline 3 étapes (Planifié → En transit → Livré).
                    - `isActive` : l'étape est atteinte (jaune plein).
                    - `isCurrent` : l'étape exacte en cours (mise en avant + ombre).
                    - Le trait horizontal entre deux étapes passe en jaune dès qu'on
                      a franchi la première des deux (`currentIndex > index`). */}
                <div className="mb-8">
                  <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                      const currentIndex = getCurrentStepIndex(foundEvent.status);
                      const isActive = currentIndex >= index;
                      const isCurrent = currentIndex === index;
                      const Icon = step.icon;

                      return (
                        <div key={step.id} className="flex flex-1 flex-col items-center">
                          <div
                            className={cn(
                              'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all',
                              isActive
                                ? 'border-yellow-500 bg-yellow-500 text-white dark:border-yellow-600 dark:bg-yellow-600'
                                : 'border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500',
                              isCurrent && 'scale-110 shadow-lg shadow-yellow-500/25'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className={cn('mt-2 whitespace-nowrap text-[10px] sm:text-xs font-medium', isActive ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500')}>
                            {step.label}
                          </p>
                          {index < steps.length - 1 && (
                            <div
                              className={cn(
                                'absolute left-1/2 top-6 h-0.5 w-full -translate-x-1/2',
                                currentIndex > index ? 'bg-yellow-500 dark:bg-yellow-600' : 'bg-gray-200 dark:bg-gray-700'
                              )}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bandeau d'alerte rouge affiché uniquement en cas de livraison échouée. */}
                {foundEvent.status === 'echouee' && (
                  <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <p className="font-medium">Il y a un problème avec cette livraison</p>
                    </div>
                    <p className="mt-1 text-sm">Notre équipe travaille à le résoudre. Veuillez contacter le support pour plus d'informations.</p>
                  </div>
                )}

                {/* Grille 2 colonnes : détails de l'événement (gauche) + destinataire (droite).
                    Sur mobile (`md:grid-cols-2`), les colonnes s'empilent. */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Détails de l'événement</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Nom de l'événement</p>
                        <p className="font-medium">{foundEvent.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Club</p>
                        <p className="font-medium">{foundEvent.club}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        <div>
                          <p className="text-sm text-muted-foreground">Adresse de livraison</p>
                          <p className="font-medium">{foundEvent.address}</p>
                          <p className="text-sm text-muted-foreground">{foundEvent.city}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-1 h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date de l'événement</p>
                          <p className="font-medium">{foundEvent.date}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Package className="mt-1 h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        <div>
                          <p className="text-sm text-muted-foreground">Quantité</p>
                          <p className="font-medium">{foundEvent.quantity} units</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Destinataire</h3>
                    <div className="space-y-3">
                      {/* Avatar placeholder jaune : initiales calculées à partir du nom complet. */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-yellow-500 text-white font-semibold">
                          {foundEvent.contactName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{foundEvent.contactName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="mt-1 h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        <p className="font-medium">{foundEvent.contactPhone}</p>
                      </div>
                    </div>

                    {/* ID de livraison interne (différent de l'ID de suivi affiché dans l'entête). */}
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-muted-foreground">ID de livraison</p>
                      <p className="font-mono font-medium text-violet-600">{foundEvent.id_livraison}</p>
                    </div>

                    {/* Bloc notes affiché uniquement si le champ est rempli. */}
                    {foundEvent.notes && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800 mt-1">
                          {foundEvent.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        // État vide : recherche lancée mais aucun résultat — message d'erreur centré.
        ) : searchQuery && !foundEvent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <Card className="border-0 shadow-2xl">
              <CardContent className="py-16">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold">Aucune livraison trouvée</h2>
                <p className="mt-2 text-muted-foreground">
                  Nous n&apos;avons pas trouvé de livraison correspondant à votre recherche. Veuillez vérifier votre ID de suivi ou contacter le support.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </main>

      {/* Pied de page : copyright statique. */}
      <footer className="mt-16 border-t bg-white/80 backdrop-blur-xl dark:bg-gray-900/80">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 LINXOS. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}