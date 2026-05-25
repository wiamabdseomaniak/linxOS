'use client';

// ============================================
// IMPORTS
// Bibliothèques et composants nécessaires
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  MapPin,
  Clock,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import type { SportEvent } from '@/lib/mock-data';

// ============================================
// COMPOSANT PRINCIPAL: LogisticsPage
// Page du tableau de bord logistique
// ============================================

export default function LogisticsPage() {
  
  // ============================================
  // ETAT DU COMPOSANT (STATE)
  // Variables d'état pour gérer les données et l'UI
  // ============================================

  const [selectedCity, setSelectedCity] = useState('all');
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetch('/api/deliveries/events')
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  
  // Fichiers joints à la note
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  
  // Statut actif pour le filtrage des cartes (par défaut: ALL pour montrer tous les statuts)
  const [activeStatus, setActiveStatus] = useState<'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'ALL'>('ALL');

  // ============================================
  // DONNÉES CALCULÉES
  // Valeurs dérivées des données d'état
  // ============================================

  // Calcul du nombre d'événements par statut
  const statusCounts = {
    all: events.length,
    scheduled: events.filter(e => e.status === 'SCHEDULED').length,
    in_transit: events.filter(e => e.status === 'IN_TRANSIT').length,
    delivered: events.filter(e => e.status === 'DELIVERED').length,
    failed: events.filter(e => e.status === 'FAILED').length,
  };

// Filtrage des événements selon le statut actif
const filteredEvents = activeStatus === 'ALL' ? events : events.filter(e => e.status === activeStatus);

  // ============================================
  // FONCTIONS DE GESTION
  // Fonctions pour modifier l'état et gérer les interactions
  // ============================================

  // Met à jour le statut d'un événement (changement d'état de livraison)
  // Permet de faire avancer une livraison: Scheduled -> In Transit -> Delivered
  const updateEventStatus = (eventId: string, newStatus: SportEvent['status']) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, status: newStatus } : e
    ));
  };

  // Ajoute une note à un événement avec gestion des fichiers joints
  const updateEventNote = (eventId: string, note: string) => {
    // Ajoute les noms des fichiers joints à la note
    const fileNames = attachedFiles.length > 0
      ? `\n\nAttached files: ${attachedFiles.map(f => f.name).join(', ')}`
      : '';
    setEvents(events.map(e =>
      e.id === eventId ? { ...e, notes: note + fileNames } : e
    ));
    // Réinitialise les états après enregistrement
    setNoteDialogOpen(false);
    setNoteText('');
    setAttachedFiles([]);
  };

  // Ouvre WhatsApp avec le numéro de téléphone du contact
  // Formate le numéro pour WhatsApp (enlève les espaces, remplace +212 par 212)
  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, '').replace('+212', '212');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  // ============================================
  // RENDU DU COMPOSANT
  // Structure visuelle de la page
  // ============================================

  return (
    <div className="space-y-6">
      
      {/* ============================================ */}
      {/* EN-TÊTE DE LA PAGE */}
      {/* Titre principal et sélecteur de ville */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          {/* Titre du tableau de bord */}
          <h1 className="text-3xl font-bold tracking-tight">Logistics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of your logistics operations
          </p>
        </div>
        
        {/* Sélecteur de ville pour filtrer les événements */}
        <div className="flex gap-3">
          <Select value={selectedCity} onValueChange={(value) => setSelectedCity(value || 'all')}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Casablanca">Casablanca</SelectItem>
              <SelectItem value="Rabat">Rabat</SelectItem>
              <SelectItem value="Marrakech">Marrakech</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* CARTES DE STATISTIQUES */}
      {/* 4 cartes résumant l'état des livraisons */}
      {/* ============================================ */}
      <div className="grid gap-4 grid-cols-4">
        
        {/* Carte 1: Total des événements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-soft hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold">{events.length}</p>
                  <div className="flex items-center gap-1 text-xs text-violet-600">
                    <Package className="h-3 w-3" />
                    All time
                  </div>
                </div>
                <div className="rounded-full bg-violet-100 p-3 dark:bg-violet-900/30">
                  <Package className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte 2: Événements planifiés (Scheduled) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-0 shadow-soft hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-3xl font-bold">{statusCounts.scheduled}</p>
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Calendar className="h-3 w-3" />
                    Pending delivery
                  </div>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte 3: Événements en cours de livraison (In Transit) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-soft hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-3xl font-bold">{statusCounts.in_transit}</p>
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <Truck className="h-3 w-3" />
                    On the way
                  </div>
                </div>
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                  <Truck className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte 4: Événements livrés (Completed) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-0 shadow-soft hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold">{statusCounts.delivered}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    {Math.round((statusCounts.delivered / events.length) * 100)}% success rate
                  </div>
                </div>
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================ */}
{/* ONGLETS DE STATUT DE LIVRAISON */}
  {/* Barre de navigation horizontale pour filtrer par statut */}
  {/* ============================================ */}
  <Card className="border-0 shadow-soft">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* Bouton: Tous (All) */}
        <button
          onClick={() => setActiveStatus('ALL')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStatus === 'ALL' ? 'bg-[#f5c400] text-black' : 'bg-white text-gray-600 border'}`}
        >
          <Package className="h-4 w-4" />
          All ({statusCounts.all})
        </button>
        
        {/* Bouton: Planifié (Scheduled) */}
        <button
          onClick={() => setActiveStatus('SCHEDULED')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStatus === 'SCHEDULED' ? 'bg-[#f5c400] text-black' : 'bg-white text-gray-600 border'}`}
        >
          <Calendar className="h-4 w-4" />
          Scheduled ({statusCounts.scheduled})
        </button>
        
        {/* Bouton: En Transit (In Transit) */}
        <button
          onClick={() => setActiveStatus('IN_TRANSIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStatus === 'IN_TRANSIT' ? 'bg-[#f5c400] text-black' : 'bg-white text-gray-600 border'}`}
        >
          <Truck className="h-4 w-4" />
          In Transit ({statusCounts.in_transit})
        </button>
        
        {/* Bouton: Livré (Delivered) */}
        <button
          onClick={() => setActiveStatus('DELIVERED')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStatus === 'DELIVERED' ? 'bg-[#f5c400] text-black' : 'bg-white text-gray-600 border'}`}
        >
          <CheckCircle2 className="h-4 w-4" />
          Delivered ({statusCounts.delivered})
        </button>
        
        {/* Bouton: Échoué (Failed) */}
        <button
          onClick={() => setActiveStatus('FAILED')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${activeStatus === 'FAILED' ? 'bg-[#f5c400] text-black' : 'bg-white text-gray-600 border'}`}
        >
          <AlertTriangle className="h-4 w-4" />
          Failed ({statusCounts.failed})
        </button>
      </div>
    </CardContent>
  </Card>

      {/* ============================================ */}
      {/* LISTE DES LIVRAISONS */}
      {/* Grille d'événements avec badges et boutons d'action */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Delivery Operations</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Grille responsive: 1 colonne mobile, 2 tablet, 3 laptop, 4 grand écran */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  {/* Badge de statut avec couleur dynamique selon le statut */}
                  <div className="mb-3 flex items-center justify-between">
                    {event.status === 'SCHEDULED' && (
                      <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: '#3498db' }}>
                        Scheduled
                      </span>
                    )}
                    {event.status === 'IN_TRANSIT' && (
                      <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: '#e74c3c' }}>
                        In Transit
                      </span>
                    )}
                    {event.status === 'DELIVERED' && (
                      <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: '#2ecc71' }}>
                        Delivered
                      </span>
                    )}
                    {event.status === 'FAILED' && (
                      <span className="rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: '#e74c3c' }}>
                        Failed
                      </span>
                    )}
                  </div>

                  {/* Titre de l'événement */}
                  <h3 className="mb-3 text-base font-bold leading-tight text-gray-900">
                    {event.title}
                  </h3>

                  {/* Nom du contact */}
                  <p className="mb-2 text-sm text-gray-700">
                    {event.contactName}
                  </p>

                  {/* Adresse de livraison avec icône de localisation */}
                  <div className="mb-3 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-2">
                      {event.address}
                    </span>
                  </div>
                  
                  {/* Badge de ville */}
                  <div className="mb-3 flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                      {event.city}
                    </span>
                  </div>

                  {/* Date et heure de livraison */}
                  <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  {/* Quantité d'unités à livrer */}
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      {event.quantity} units
                    </span>
                  </div>

                  {/* Boutons d'action selon le statut */}
                  <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                    {/* Bouton Details - toujours visible */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(event);
                        setDetailsDialogOpen(true);
                      }}
                      className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                    
                    {/* Bouton Start Route - affiché seulement pour Scheduled */}
                    {event.status === 'SCHEDULED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                        onClick={() => updateEventStatus(event.id, 'IN_TRANSIT')}
                      >
                        Start Route
                      </Button>
                    )}
                    
                    {/* Boutons Delivered et Failed - affichés seulement pour In Transit */}
                    {event.status === 'IN_TRANSIT' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-lg border-green-200 text-green-700 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                          onClick={() => updateEventStatus(event.id, 'DELIVERED')}
                        >
                          Delivered
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-red-200 text-red-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                          onClick={() => updateEventStatus(event.id, 'FAILED')}
                        >
                          Failed
                        </Button>
                      </>
                    )}
                    
                    {/* Message Completed/Failed - affiché pour Delivered ou Failed */}
                    {(event.status === 'DELIVERED' || event.status === 'FAILED') && (
                      <span className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                        {event.status === 'DELIVERED' ? 'Completed' : 'Failed'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* DIALOGUE D'AJOUT DE NOTE */}
      {/* Permet d'ajouter une note avec fichiers joints */}
      {/* ============================================ */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add note for: {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Zone de texte pour la note */}
            <Textarea
              placeholder="Enter your note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
            />
            
            {/* Zone de téléchargement de fichiers */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Attach Files</label>
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
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              
              {/* Liste des fichiers joints avec option de suppression */}
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
            
            {/* Boutons Annuler et Enregistrer */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setNoteDialogOpen(false);
                setNoteText('');
                setAttachedFiles([]);
              }}>
                Cancel
              </Button>
              <Button
                onClick={() => selectedEvent && updateEventNote(selectedEvent.id, noteText)}
                className="bg-yellow-400 hover:bg-yellow-500"
                disabled={!noteText.trim() && attachedFiles.length === 0}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* FEUILLE DE DÉTAILS DE L'ÉVÉNEMENT */}
      {/* Affiche les informations complètes de l'événement sélectionné */}
      {/* ============================================ */}
      <Sheet open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Event Details</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            
            {/* Section principale: IDs, événement, club, adresse, date, contact, statut */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              {/* IDs de livraison et tracking */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery ID</p>
                  <p className="font-mono font-medium text-violet-600">{selectedEvent?.id_livraison}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tracking ID</p>
                  <p className="font-mono font-medium text-purple-600">{selectedEvent?.id_tracking}</p>
                </div>
              </div>
              
              {/* Titre de l'événement */}
              <div>
                <p className="text-sm text-muted-foreground">Event</p>
                <p className="font-semibold">{selectedEvent?.title}</p>
              </div>
              
              {/* Nom du club */}
              <div>
                <p className="text-sm text-muted-foreground">Club</p>
                <p className="font-medium text-violet-600">{selectedEvent?.club}</p>
              </div>
              
              {/* Adresse complète */}
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-sm">{selectedEvent?.address}, {selectedEvent?.city}</p>
              </div>
              
              {/* Date, heure et quantité */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedEvent?.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedEvent?.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{selectedEvent?.quantity} units</p>
                </div>
              </div>
              
              {/* Informations de contact */}
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{selectedEvent?.contactName}</p>
                <p className="text-sm text-muted-foreground">{selectedEvent?.contactPhone}</p>
              </div>
              
              {/* Statut actuel avec badge coloré */}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={
                  selectedEvent?.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  selectedEvent?.status === 'IN_TRANSIT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  selectedEvent?.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }>
                  {selectedEvent?.status === 'SCHEDULED' && 'Scheduled'}
                  {selectedEvent?.status === 'IN_TRANSIT' && 'In Transit'}
                  {selectedEvent?.status === 'DELIVERED' && 'Delivered'}
                  {selectedEvent?.status === 'FAILED' && 'Failed'}
                </Badge>
              </div>
              
              {/* Notes existantes (si présentes) */}
              {selectedEvent?.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800">{selectedEvent.notes}</p>
                </div>
              )}
            </div>

            {/* Actions rapides: WhatsApp et Ajouter une note */}
            <div>
              <p className="text-sm font-medium mb-3">Quick Actions</p>
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
                  Add Note
                </Button>
              </div>
            </div>

            {/* Timeline du statut de livraison */}
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium mb-3">Status Timeline</p>
              <div className="space-y-4">
                
                {/* Étape 1: Planifié (Scheduled) */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {/* Point vert si le statut est >= Scheduled, gris sinon */}
                    <div className={`w-3 h-3 rounded-full ${selectedEvent?.status === 'DELIVERED' || selectedEvent?.status === 'IN_TRANSIT' || selectedEvent?.status === 'SCHEDULED' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="w-px h-4 bg-border" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Scheduled</p>
                    <p className="text-xs text-muted-foreground">Event scheduled for delivery</p>
                  </div>
                </div>
                
                {/* Étape 2: En Transit (In Transit) */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedEvent?.status === 'DELIVERED' || selectedEvent?.status === 'IN_TRANSIT' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="w-px h-4 bg-border" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">In Transit</p>
                    <p className="text-xs text-muted-foreground">Package on the way</p>
                  </div>
                </div>
                
                {/* Étape 3: Livré ou Échoué */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${selectedEvent?.status === 'DELIVERED' ? 'bg-green-500' : selectedEvent?.status === 'FAILED' ? 'bg-red-500' : 'bg-gray-300'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedEvent?.status === 'FAILED' ? 'Failed' : 'Delivered'}</p>
                    <p className="text-xs text-muted-foreground">{selectedEvent?.status === 'FAILED' ? 'Delivery could not be completed' : 'Successfully delivered'}</p>
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