/**
 * Page Logistique — gestion opérationnelle des livraisons.
 * Permet de filtrer par statut / ville, de démarrer une tournée,
 * de marquer comme livrée/échouée, d'ajouter des notes et d'ouvrir WhatsApp.
 * Branchée sur le hook `useLogistics`.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  MapPin,
  Calendar,
  Truck,
  CheckCircle2,
  MessageCircle,
  FileText,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { StatutLivraison, LogisticsEvent } from '@/types/supabase';
import { useLogistics } from '@/features/logistics/hooks/use-logistics';

export default function LogisticsPage() {

  // ── Filtres & onglets ──────────────────────────────────────────
  // Ville sélectionnée pour le filtrage (par défaut: toutes les villes)
  const [selectedCity, setSelectedCity] = useState('all');

  // Statut actif pour le filtrage des cartes (par défaut: planifié)
  const [activeStatus, setActiveStatus] = useState<StatutLivraison>('planifie');

  // ── Dialogues & sheet de détails ──────────────────────────────
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LogisticsEvent | null>(null);

  // ── Composition d'une note (texte + pièces jointes) ───────────
  const [noteText, setNoteText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Données + actions du module logistique (lecture, mutations, WhatsApp).
  const {
    events,
    loading,
    error,
    statusCounts,
    filteredEvents,
    handleUpdateStatus,
    handleUpdateNote,
    openWhatsApp,
  } = useLogistics(activeStatus, selectedCity);

  return (
    <div className="space-y-6">
      
      {/* En-tête : titre + sous-titre (placeholder pour de futurs filtres). */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord logistique</h1>
          <p className="text-muted-foreground">
            Aperçu en temps réel de vos opérations logistiques
          </p>
        </div>


      </motion.div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 text-sm">
          Erreur : {error}
        </div>
      )}

      {/* 4 cartes statistiques : total / planifié / en transit / livré (% succès). */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {/* Carte 1 : total des événements (toutes périodes). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <Card className="border-0 shadow-soft hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total des événements</p>
                  <p className="text-3xl font-bold">{events.length}</p>
                  <div className="flex items-center gap-1 text-xs text-violet-600">
                    <Package className="h-3 w-3" />
                    Tout temps confondu
                  </div>
                </div>
                <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/30">
                  <Package className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte 2 : livraisons planifiées (en attente de démarrage). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex-1"
        >
          <Card className="border-0 shadow-soft hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Planifié</p>
                  <p className="text-3xl font-bold">{statusCounts.scheduled}</p>
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Calendar className="h-3 w-3" />
                    Livraison en attente
                  </div>
                </div>
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte 3 : livraisons en transit (tournée en cours). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <Card className="border-0 shadow-soft hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">En transit</p>
                  <p className="text-3xl font-bold">{statusCounts.in_transit}</p>
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <Truck className="h-3 w-3" />
                    En cours d'acheminement
                  </div>
                </div>
                <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                  <Truck className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte 4 : livraisons terminées (% de succès sur le total). */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex-1"
        >
          <Card className="border-0 shadow-soft hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Terminé</p>
                  <p className="text-3xl font-bold">{statusCounts.delivered}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    {Math.round((statusCounts.delivered / events.length) * 100)}% de succès
                  </div>
                </div>
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Onglets de filtrage par statut (un seul actif à la fois). */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveStatus('planifie')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStatus === 'planifie' ? 'bg-[#f5c400] dark:bg-[#e6b800] text-black dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border'}`}
            >
              <Calendar className="h-4 w-4" />
              Planifié ({statusCounts.scheduled})
            </button>

            <button
              onClick={() => setActiveStatus('en_cours')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStatus === 'en_cours' ? 'bg-[#f5c400] dark:bg-[#e6b800] text-black dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border'}`}
            >
              <Truck className="h-4 w-4" />
              En transit ({statusCounts.in_transit})
            </button>

            <button
              onClick={() => setActiveStatus('livree')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStatus === 'livree' ? 'bg-[#f5c400] dark:bg-[#e6b800] text-black dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border'}`}
            >
              <CheckCircle2 className="h-4 w-4" />
              Livré ({statusCounts.delivered})
            </button>

            <button
              onClick={() => setActiveStatus('echouee')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStatus === 'echouee' ? 'bg-[#f5c400] dark:bg-[#e6b800] text-black dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border'}`}
            >
              <AlertTriangle className="h-4 w-4" />
              Échoué ({statusCounts.failed})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Grille des livraisons filtrées (1 col. mobile → 4 col. ≥ xl). */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Opérations de livraison</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    {/* Badge statut : couleur de fond + libellé FR selon `event.status`. */}
                    <div className="mb-3 flex items-center justify-between">
                      {event.status === 'planifie' && (
                        <span className="rounded-full px-3 py-1 text-xs font-medium text-white bg-[var(--status-planifie)]">
                          Planifié
                        </span>
                      )}
                      {event.status === 'en_cours' && (
                        <span className="rounded-full px-3 py-1 text-xs font-medium text-white bg-[var(--status-en-cours)]">
                          En transit
                        </span>
                      )}
                      {event.status === 'livree' && (
                        <span className="rounded-full px-3 py-1 text-xs font-medium text-white bg-[var(--status-livree)]">
                          Livrée
                        </span>
                      )}
                      {event.status === 'echouee' && (
                        <span className="rounded-full px-3 py-1 text-xs font-medium text-white bg-[var(--status-echouee)]">
                          Échouée
                        </span>
                      )}
                    </div>

                    {/* Titre de l'événement + nom du contact principal. */}
                    <h3 className="mb-3 text-base font-bold leading-tight text-gray-900 dark:text-gray-100">
                      {event.title}
                    </h3>
                    <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                      {event.contactName}
                    </p>

                    {/* Adresse (line-clamp 2 lignes max) + badge ville. */}
                    <div className="mb-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-2">
                        {event.address}
                      </span>
                    </div>
                    <div className="mb-3 flex items-center gap-2 text-sm">
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                        {event.city}
                      </span>
                    </div>

                    {/* Date planifiée + quantité à livrer. */}
                    <div className="mb-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {event.quantity} unités
                      </span>
                    </div>

                    {/* Boutons d'action contextuels selon le statut de la livraison. */}
                    <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-3 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setDetailsDialogOpen(true);
                        }}
                        className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/30"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Détails
                      </Button>

                      {/* Planifié : bouton "Démarrer la tournée" → passe en en_cours. */}
                      {event.status === 'planifie' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-lg border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 hover:border-blue-200"
                          onClick={() => handleUpdateStatus(event.id, 'en_cours')}
                        >
                          Démarrer la tournée
                        </Button>
                      )}

                      {/* En transit : actions finales (livrée / échouée). */}
                      {event.status === 'en_cours' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-lg border-green-200 dark:border-green-800 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 hover:border-green-300"
                            onClick={() => handleUpdateStatus(event.id, 'livree')}
                          >
                            Livrée
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-red-200 dark:border-red-800 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 hover:border-red-300"
                            onClick={() => handleUpdateStatus(event.id, 'echouee')}
                          >
                            Échouée
                          </Button>
                        </>
                      )}

                      {/* Terminée : libellé statique (aucune action). */}
                      {(event.status === 'livree' || event.status === 'echouee') && (
                        <span className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {event.status === 'livree' ? 'Terminé' : 'Échouée'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog d'ajout de note : zone de texte + drop zone fichiers + actions. */}
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

            {/* Drop zone de fichiers : déclenche un <input type=file> caché. */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Joindre des fichiers</label>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-violet-400 transition-colors"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
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

              {/* Liste des pièces jointes avec retrait individuel. */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2 mt-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-violet-600" />
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

            {/* Actions du dialog : annuler (vide tout) / enregistrer (PATCH note). */}
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
                className="bg-yellow-400 hover:bg-yellow-500"
                disabled={!noteText.trim() && attachedFiles.length === 0}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sheet de détails : carte info + actions rapides + timeline statut. */}
      <Sheet open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Détails de l'événement</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-6">

            {/* Bloc info principal : IDs, événement, club, adresse, date, contact, statut. */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">ID de livraison</p>
                  <p className="font-mono font-medium text-violet-600">{selectedEvent?.id_livraison}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID de suivi</p>
                  <p className="font-mono font-medium text-purple-600">{selectedEvent?.id_tracking}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Événement</p>
                <p className="font-semibold">{selectedEvent?.title}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Club</p>
                <p className="font-medium text-violet-600">{selectedEvent?.club}</p>
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
                  <p className="text-sm text-muted-foreground">Quantité</p>
                  <p className="font-medium">{selectedEvent?.quantity} unités</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{selectedEvent?.contactName}</p>
                <p className="text-sm text-muted-foreground">{selectedEvent?.contactPhone}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge className={
                  selectedEvent?.status === 'planifie' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  selectedEvent?.status === 'en_cours' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  selectedEvent?.status === 'livree' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }>
                  {selectedEvent?.status === 'planifie' && 'Planifié'}
                  {selectedEvent?.status === 'en_cours' && 'En transit'}
                  {selectedEvent?.status === 'livree' && 'Livrée'}
                  {selectedEvent?.status === 'echouee' && 'Échouée'}
                </Badge>
              </div>

              {selectedEvent?.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800">{selectedEvent.notes}</p>
                </div>
              )}
            </div>

            {/* Actions rapides : WhatsApp + ouverture du dialog de note. */}
            <div>
              <p className="text-sm font-medium mb-3">Actions rapides</p>
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

            {/* Timeline 3 étapes : chaque point s'allume quand le statut courant l'a atteinte. */}
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium mb-3">Chronologie du statut</p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedEvent?.status === 'livree' || selectedEvent?.status === 'en_cours' || selectedEvent?.status === 'planifie' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="w-px h-4 bg-border" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Planifié</p>
                    <p className="text-xs text-muted-foreground">Événement planifié pour livraison</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedEvent?.status === 'livree' || selectedEvent?.status === 'en_cours' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="w-px h-4 bg-border" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">En transit</p>
                    <p className="text-xs text-muted-foreground">Colis en cours d'acheminement</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedEvent?.status === 'livree' ? 'bg-green-500' : selectedEvent?.status === 'echouee' ? 'bg-red-500' : 'bg-gray-300'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedEvent?.status === 'echouee' ? 'Échouée' : 'Livrée'}</p>
                    <p className="text-xs text-muted-foreground">{selectedEvent?.status === 'echouee' ? 'La livraison n\'a pas pu être effectuée' : 'Livrée avec succès'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}