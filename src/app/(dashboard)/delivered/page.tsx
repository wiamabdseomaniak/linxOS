/**
 * Page "Événements livrés" — vue filtrée sur les livraisons terminées.
 * Réutilise le hook `useLogistics` puis filtre localement sur `status === 'livree'`.
 * Affiche statistiques, cartes livraisons, panneau de détails et dialogue d'ajout de note.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Package, CheckCircle2, MessageCircle, FileText, X, AlertTriangle } from 'lucide-react';
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
      {/* En-tête : titre + badge compteur de livraisons livrées. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Événements livrés</h1>
          <p className="text-muted-foreground">
            Voir tous les événements livrés avec succès
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            {events.length} Livrée(s)
          </Badge>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total des livrées</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-violet-100 p-3 dark:bg-violet-900/30">
                  <Package className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total des unités</p>
                  <p className="text-2xl font-bold">{totalUnits}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Villes couvertes</p>
                  <p className="text-2xl font-bold">{uniqueCities}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delivered Events List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tous les événements livrés</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
              </div>
            ) : (
            /* Grille de cartes livraison : badge statut + barre de progression + métadonnées. */
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                // Statut préparation dérivé du statut livraison (cf. DELIVERY_TO_PREP).
                const prepStatus = DELIVERY_TO_PREP[event.status] || event.statut_preparation;
                const prepIdx = PREP_STEPS.indexOf(prepStatus);
                const prepProgress = prepIdx >= 0 ? ((prepIdx + 1) / PREP_STEPS.length) * 100 : 0;

                return (
                  <div
                    key={event.id}
                    className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    {/* Status Badge */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Terminée
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setDetailsDialogOpen(true);
                        }}
                        className="text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/30"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Event Title */}
                    <h3 className="mb-3 text-base font-bold leading-tight text-gray-900 dark:text-gray-100">
                      {event.title}
                    </h3>

                    {/* Contact Name */}
                    <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                      {event.contactName}
                    </p>

                    {/* Address & City */}
                    <div className="mb-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-2">
                        {event.address}, {event.city}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {event.quantity} unités
                      </span>
                    </div>

                    {/* Delivery ID */}
                    <div className="rounded-lg bg-muted/50 dark:bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground">ID de livraison</p>
                      <p className="font-mono text-sm font-medium text-violet-600 dark:text-violet-400">
                        {event.id_livraison}
                      </p>
                    </div>
                  </div>
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
            <SheetTitle>Détails de l'événement</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            {/* Bloc récap : IDs, événement, club, adresse, date/heure, contact. */}
            <div className="rounded-lg bg-muted/50 dark:bg-muted/20 p-4 space-y-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">ID de livraison</p>
                  <p className="font-mono font-medium text-violet-600 dark:text-violet-400">{selectedEvent?.id_livraison}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID de suivi</p>
                  <p className="font-mono font-medium text-purple-600 dark:text-purple-400">{selectedEvent?.id_tracking}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Événement</p>
                <p className="font-semibold">{selectedEvent?.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Club</p>
                <p className="font-medium text-violet-600 dark:text-violet-400">{selectedEvent?.club}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="text-sm">{selectedEvent?.address}, {selectedEvent?.city}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedEvent?.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Heure</p>
                  <p className="font-medium">{selectedEvent?.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantité</p>
                  <p className="font-medium">{selectedEvent?.quantity} unités</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{selectedEvent?.contactName}</p>
                <p className="text-sm text-muted-foreground">{selectedEvent?.contactPhone}</p>
              </div>

              {/* Status Section */}
              <div className="space-y-3 pt-2 border-t border-border/50">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Statut préparation</p>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${PREP_COLORS[selectedEvent ? (DELIVERY_TO_PREP[selectedEvent.status] || selectedEvent.statut_preparation) : ''] || 'bg-gray-100 text-gray-700 dark:text-gray-300'}`}>
                      {PREP_LABELS[selectedEvent ? (DELIVERY_TO_PREP[selectedEvent.status] || selectedEvent.statut_preparation) : ''] || selectedEvent?.statut_preparation}
                    </span>
                    <div className="flex-1 max-w-[100px] sm:max-w-[120px]">
                      <Progress value={selectedEvent ? ((PREP_STEPS.indexOf(DELIVERY_TO_PREP[selectedEvent.status] || selectedEvent.statut_preparation) + 1) / PREP_STEPS.length) * 100 : 0}>
                        <ProgressTrack className="h-1.5">
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
                  <p className="text-sm text-muted-foreground mb-1">Statut livraison</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${DELIVERY_COLORS[selectedEvent?.status || ''] || 'bg-gray-100 text-gray-700 dark:text-gray-300'}`}>
                    {DELIVERY_LABELS[selectedEvent?.status || ''] || selectedEvent?.status}
                  </span>
                </div>
                {selectedEvent?.status === 'echouee' && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg p-2 dark:border-red-800 dark:text-red-300">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Cette livraison a échoué</span>
                  </div>
                )}
              </div>

              {selectedEvent?.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800">{selectedEvent.notes}</p>
                </div>
              )}
            </div>

            {/* Chronologie des étapes de préparation (points colorés, actif/inactif). */}
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium mb-3">Chronologie de la préparation</p>
              <div className="space-y-3">
                {PREP_STEPS.map((step, i) => {
                  const derivedStatus = DELIVERY_TO_PREP[selectedEvent?.status || ''] || selectedEvent?.statut_preparation || '';
                  const currentIdx = PREP_STEPS.indexOf(derivedStatus);
                  const isActive = currentIdx >= i;
                  const label = PREP_LABELS[step] || step;
                  const color = STATUS_COLORS[step] || '#94a3b8';
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isActive ? '' : 'bg-gray-300 dark:bg-gray-600'}`}
                        style={{ backgroundColor: isActive ? color : undefined }}
                      />
                      <span className={`text-sm ${isActive ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Actions rapides</p>
              {/* Boutons WhatsApp (ouvre wa.me) + Ajouter une note (ouvre la modale). */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedEvent && openWhatsApp(selectedEvent.contactPhone)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNoteDialogOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Ajouter une note
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
              Ajouter une note pour : {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Saisissez votre note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
            />
            <div className="space-y-2">
              {/* Zone de dépôt fichiers (input file caché déclenché par onClick du parent). */}
              <label className="text-sm text-muted-foreground">Joindre des fichiers</label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-violet-400 transition-colors"
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
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Cliquez pour télécharger ou glissez-déposez
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PNG, JPG jusqu'à 10 Mo
                  </p>
                </div>
              </div>
              {attachedFiles.length > 0 && (
                <div className="space-y-2 mt-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 dark:bg-muted/20 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
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
                className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-500"
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
