/**
 * Page "Événements livrés" — vue filtrée sur les livraisons terminées.
 * Réutilise le hook `useLogistics` puis filtre localement sur `status === 'livree'`.
 * Affiche statistiques, cartes livraisons, panneau de détails et dialogue d'ajout de note.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Package, CheckCircle2, MessageCircle, FileText, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { LogisticsEvent } from '@/types/supabase';
import { useLogistics } from '@/features/logistics/hooks/use-logistics';

// Mapping statut livraison → étape de préparation dérivée.
const DELIVERY_TO_PREP: Record<string, string> = {
  planifie: 'en_preparation',
  en_cours: 'prete',
  livree: 'terminee',
  echouee: 'terminee',
};

const PREP_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  en_preparation: 'En préparation',
  prete: 'Prête',
  terminee: 'Terminée',
};

const PREP_COLORS: Record<string, string> = {
  en_attente: 'bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:text-gray-300',
  en_preparation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  prete: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  terminee: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const DELIVERY_LABELS: Record<string, string> = {
  planifie: 'Planifiée',
  en_cours: 'En cours',
  livree: 'Livrée',
  echouee: 'Échouée',
};

const DELIVERY_COLORS: Record<string, string> = {
  planifie: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  en_cours: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  livree: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  echouee: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const PREP_STEPS = ['en_attente', 'en_preparation', 'prete', 'terminee'];
const DELIVERY_STEPS = ['planifie', 'en_cours', 'livree'];

const STATUS_COLORS: Record<string, string> = {
  en_attente: '#94a3b8',
  en_preparation: '#3b82f6',
  prete: '#f59e0b',
  terminee: '#22c55e',
  planifie: '#3b82f6',
  en_cours: '#f59e0b',
  livree: '#22c55e',
  echouee: '#ef4444',
};

export default function DeliveredPage() {
  const [selectedEvent, setSelectedEvent] = useState<LogisticsEvent | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const {
    events: allEvents,
    loading,
    handleUpdateNote,
    openWhatsApp,
  } = useLogistics('livree', 'all');

  // Filtre local supplémentaire : useLogistics peut renvoyer des statuts
  // proches ; on garde uniquement les livraisons réellement terminées.
  const events = allEvents.filter(e => e.status === 'livree');

  // Pré-remplit la note existante à l'ouverture du dialogue.
  const openNoteDialog = (event: LogisticsEvent) => {
    setSelectedEvent(event);
    setNoteText(event.notes || '');
    setNoteDialogOpen(true);
  };

  // Agrégats affichés dans les 3 cartes-statistiques.
  const totalUnits = events.reduce((s, e) => s + e.quantity, 0);
  const uniqueCities = new Set(events.map(e => e.city)).size;

  return (
    <div className="space-y-6">
      {/* En-tête : titre + badge compteur + barre décorative. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-green-400 to-emerald-600" />
            <h1 className="text-3xl font-bold tracking-tight">Événements livrés</h1>
          </div>
          <p className="text-muted-foreground ml-5">
            Succès de livraison sur l'ensemble des événements
          </p>
        </div>
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-1.5 text-sm font-semibold">
          <CheckCircle2 className="mr-1.5 h-4 w-4" />
          {events.length} Livrée{events.length > 1 ? 's' : ''}
        </Badge>
      </motion.div>

      {/* Stats Overview — cartes élégantes avec icônes dégradées. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-green-100 dark:border-green-900/50 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 p-3 shadow-sm">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total des livrées</p>
                  <p className="text-3xl font-bold tracking-tight">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border border-violet-100 dark:border-violet-900/50 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 p-3 shadow-sm">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unités livrées</p>
                  <p className="text-3xl font-bold tracking-tight">{totalUnits}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-blue-100 dark:border-blue-900/50 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 p-3 shadow-sm">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Villes couvertes</p>
                  <p className="text-3xl font-bold tracking-tight">{uniqueCities}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delivered Events Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Tous les événements livrés</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{events.length} événement{events.length > 1 ? 's' : ''} livré{events.length > 1 ? 's' : ''}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-400 border-t-transparent" />
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-green-50 dark:bg-green-900/20 p-4 mb-4">
                  <Package className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-lg font-semibold text-muted-foreground">Aucune livraison livrée</p>
                <p className="text-sm text-muted-foreground mt-1">Les livraisons marquées "Livrée" apparaîtront ici</p>
              </div>
            ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {events.map((event, idx) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    key={event.id}
                    className="group relative flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {/* Accent top bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-green-400 to-emerald-500" />

                    {/* Status Badge + Details button */}
                    <div className="mb-3 flex items-center justify-between pt-4 px-5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Terminée
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setDetailsDialogOpen(true);
                        }}
                        className="text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Event Title */}
                    <div className="px-5">
                      <h3 className="text-base font-bold leading-tight text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem]">
                        {event.title}
                      </h3>
                    </div>

                    {/* Contact & Infos */}
                    <div className="px-5 mt-3 space-y-2 flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {event.contactName}
                      </p>
                      <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span className="line-clamp-2">
                          {event.address}, {event.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{event.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {event.quantity} unité{event.quantity > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Delivery ID footer */}
                    <div className="mt-4 mx-0 rounded-b-xl border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50 px-5 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">ID Livraison</span>
                        <span className="font-mono text-xs font-semibold text-violet-600 dark:text-violet-400">
                          {event.id_livraison}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Sheet */}
      <Sheet open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Détails de la livraison</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            {/* Hero section : titre + statut */}
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-900/50 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">Événement</p>
                  <p className="text-lg font-bold">{selectedEvent?.title}</p>
                </div>
                <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                  Terminée
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-100/50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Livrée avec succès</span>
              </div>
            </div>

            {/* Bloc récap : IDs, événement, club, adresse, date/heure, contact. */}
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">ID Livraison</p>
                  <p className="font-mono font-semibold text-violet-600 dark:text-violet-400">{selectedEvent?.id_livraison}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">ID Suivi</p>
                  <p className="font-mono font-semibold text-purple-600 dark:text-purple-400">{selectedEvent?.id_tracking}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Club</p>
                    <p className="font-semibold text-violet-600 dark:text-violet-400">{selectedEvent?.club}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Adresse</p>
                  <p className="text-sm font-medium">{selectedEvent?.address}, {selectedEvent?.city}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Date</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{selectedEvent?.date}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Heure</p>
                  <p className="font-medium">{selectedEvent?.time}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Quantité</p>
                  <p className="font-semibold text-lg">{selectedEvent?.quantity} unité{selectedEvent?.quantity && selectedEvent.quantity > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Contact</p>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-600 text-white text-sm font-bold">
                    {selectedEvent?.contactName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedEvent?.contactName}</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent?.contactPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 space-y-4 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Statuts</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Statut préparation</p>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${PREP_COLORS[selectedEvent ? (DELIVERY_TO_PREP[selectedEvent.status] || selectedEvent.statut_preparation) : ''] || 'bg-gray-100 text-gray-700 dark:text-gray-300'}`}>
                      {PREP_LABELS[selectedEvent ? (DELIVERY_TO_PREP[selectedEvent.status] || selectedEvent.statut_preparation) : ''] || selectedEvent?.statut_preparation}
                    </span>
                    <div className="flex-1 max-w-[120px]">
                      <Progress value={selectedEvent ? ((PREP_STEPS.indexOf(DELIVERY_TO_PREP[selectedEvent.status] || selectedEvent.statut_preparation) + 1) / PREP_STEPS.length) * 100 : 0}>
                        <ProgressTrack className="h-2 rounded-full">
                          <ProgressIndicator
                            className="rounded-full"
                            style={{ backgroundColor: STATUS_COLORS[selectedEvent ? (DELIVERY_TO_PREP[selectedEvent.status] || selectedEvent.statut_preparation) : ''] || 'var(--muted-foreground)' }}
                          />
                        </ProgressTrack>
                      </Progress>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Statut livraison</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${DELIVERY_COLORS[selectedEvent?.status || ''] || 'bg-gray-100 text-gray-700 dark:text-gray-300'}`}>
                    {DELIVERY_LABELS[selectedEvent?.status || ''] || selectedEvent?.status}
                  </span>
                </div>
                {selectedEvent?.notes && (
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Notes</p>
                    <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">{selectedEvent.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Chronologie</p>
              <div className="space-y-0">
                {PREP_STEPS.map((step, i) => {
                  const derivedStatus = DELIVERY_TO_PREP[selectedEvent?.status || ''] || selectedEvent?.statut_preparation || '';
                  const currentIdx = PREP_STEPS.indexOf(derivedStatus);
                  const isActive = currentIdx >= i;
                  const isLast = i === PREP_STEPS.length - 1;
                  const label = PREP_LABELS[step] || step;
                  const color = STATUS_COLORS[step] || '#94a3b8';
                  return (
                    <div key={step} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 ${isActive ? 'border-0' : 'border-gray-300 dark:border-gray-600'} flex items-center justify-center`}
                          style={{ backgroundColor: isActive ? color : 'transparent' }}>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-8 ${isActive ? 'bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                      </div>
                      <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                        <p className={`text-sm ${isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                          {label}
                        </p>
                        {isActive && i === currentIdx && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Actuel</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Actions rapides</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => selectedEvent && openWhatsApp(selectedEvent.contactPhone)}
                  className="flex-1 sm:flex-none"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setNoteDialogOpen(true)}
                  className="flex-1 sm:flex-none"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Note
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une note</DialogTitle>
            <DialogDescription>
              Note pour : <span className="font-medium text-foreground">{selectedEvent?.title}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Saisissez votre note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              className="resize-none focus-visible:ring-green-500"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Fichiers joints</label>
              <div
                className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 dark:hover:border-green-600 transition-colors bg-gray-50/50 dark:bg-gray-800/30"
                onClick={() => document.getElementById('delivered-file-input')?.click()}
              >
                <input
                  id="delivered-file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setAttachedFiles(prev => [...prev, ...files]);
                  }}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cliquez pour télécharger
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PNG, JPG (max 10 Mo)
                  </p>
                </div>
              </div>
              {attachedFiles.length > 0 && (
                <div className="space-y-2 mt-3">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 flex-shrink-0 text-violet-600 dark:text-violet-400" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">({(file.size / 1024).toFixed(1)} Ko)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-muted-foreground hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => {
                setNoteDialogOpen(false);
                setNoteText('');
                setAttachedFiles([]);
              }}>
                Annuler
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedEvent) return;
                  await handleUpdateNote(selectedEvent.id, noteText, attachedFiles);
                  setNoteDialogOpen(false);
                  setNoteText('');
                  setAttachedFiles([]);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm"
                disabled={!noteText.trim() && attachedFiles.length === 0}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
