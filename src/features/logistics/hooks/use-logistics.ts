/**
 * Hook principal du module Logistique.
 * Combine chargement, mutation (statut, notes), filtrage par statut,
 * comptage par catégorie et ouverture WhatsApp.
 */

'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  fetchLogisticsEvents,
  updateEventStatus,
  updateEventNotes,
} from '@/features/logistics/api/supabase-logistics';
import type { LogisticsEvent, StatutLivraison } from '@/types/supabase';
import type { StatusCounts } from '@/features/logistics/constants';

// État interne du hook.
export interface LogisticsState {
  events: LogisticsEvent[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  statusCounts: StatusCounts;
  filteredEvents: LogisticsEvent[];
}

// Actions exposées aux composants (chargement, mises à jour, WhatsApp).
export interface LogisticsActions {
  loadEvents: () => Promise<void>;
  handleUpdateStatus: (eventId: string, newStatus: StatutLivraison) => Promise<void>;
  handleUpdateNote: (eventId: string, note: string, attachedFiles: File[]) => Promise<void>;
  openWhatsApp: (phone: string) => void;
}

export function useLogistics(
  activeStatus: StatutLivraison,
  selectedCity: string
): LogisticsState & LogisticsActions {
  const [state, setState] = useState<LogisticsState>({
    events: [],
    loading: true,
    error: null,
    connected: false,
    statusCounts: { all: 0, scheduled: 0, in_transit: 0, delivered: 0, failed: 0 },
    filteredEvents: [],
  });

  /**
   * Recharge la liste des livraisons depuis l'API pour la ville sélectionnée.
   * Met à jour `connected` en fonction du succès/échec pour informer l'UI.
   */
  const loadEvents = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchLogisticsEvents({
        ville: selectedCity,
      });
      setState(prev => ({ ...prev, events: data, loading: false, error: null, connected: true }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load';
      setState(prev => ({ ...prev, loading: false, error: message, connected: false }));
    }
  }, [selectedCity]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  /**
   * Met à jour le statut d'une livraison : applique d'abord l'optimistic update,
   * puis rollback (recharge complète) en cas d'erreur.
   */
  const handleUpdateStatus = useCallback(async (eventId: string, newStatus: StatutLivraison) => {
    try {
      const result = await updateEventStatus(eventId, newStatus);
      if (!result.success) throw new Error(result.error);
      setState(prev => ({
        ...prev,
        events: prev.events.map(e => (e.id === eventId ? { ...e, status: newStatus } : e)),
      }));
    } catch (err) {
      console.error('Status update failed:', err);
      loadEvents();
    }
  }, [loadEvents]);

  /**
   * Met à jour la note d'une livraison (avec éventuelle liste de pièces jointes
   * concaténée en suffixe texte) — optimistic update + rollback en cas d'erreur.
   */
  const handleUpdateNote = useCallback(async (
    eventId: string,
    note: string,
    attachedFiles: File[],
  ) => {
    const fileAppendix = attachedFiles.length > 0
      ? `\n\nAttached files: ${attachedFiles.map(f => f.name).join(', ')}`
      : '';
    const fullNote = note + fileAppendix;

    setState(prev => ({
      ...prev,
      events: prev.events.map(e => (e.id === eventId ? { ...e, notes: fullNote } : e)),
    }));

    try {
      const result = await updateEventNotes(eventId, fullNote);
      if (!result.success) throw new Error(result.error);
    } catch (err) {
      console.error('Note update failed:', err);
      loadEvents();
    }
  }, [loadEvents]);

  /**
   * Ouvre WhatsApp Web vers le contact fourni.
   * Convertit le format local marocain (+212 / 0X) en identifiant international.
   */
  const openWhatsApp = useCallback((phone: string) => {
    const clean = phone.replace(/\s/g, '').replace('+212', '212');
    window.open(`https://wa.me/${clean}`, '_blank');
  }, []);

  // Agrégat mémoïsé des compteurs par statut, recalculé uniquement quand `events` change.
  const statusCounts: StatusCounts = useMemo(() => ({
    all: state.events.length,
    scheduled: state.events.filter(e => e.status === 'planifie').length,
    in_transit: state.events.filter(e => e.status === 'en_cours').length,
    delivered: state.events.filter(e => e.status === 'livree').length,
    failed: state.events.filter(e => e.status === 'echouee').length,
  }), [state.events]);

  // Sous-ensemble d'événements correspondant à l'onglet actif (statut sélectionné).
  const filteredEvents = useMemo(
    () => state.events.filter(e => e.status === activeStatus),
    [state.events, activeStatus],
  );

  return {
    ...state,
    statusCounts,
    filteredEvents,
    loadEvents,
    handleUpdateStatus,
    handleUpdateNote,
    openWhatsApp,
  };
}
