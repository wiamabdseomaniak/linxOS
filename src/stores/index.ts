/**
 * Stores Zustand centralisés de l'application.
 * Regroupe quatre domaines : Auth, Livraison, Notification, UI.
 * Les stores persistants (Auth, UI) s'appuient sur le middleware
 * `persist` avec une clé localStorage dédiée.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Utilisateur, Livraison, Notification, StatutLivraison, StatutPreparation } from '@/types';

// État et actions du store d'authentification.
interface AuthState {
  user: Utilisateur | null;
  isAuthenticated: boolean;
  login: (user: Utilisateur) => void;
  logout: () => void;
  updateUser: (user: Partial<Utilisateur>) => void;
}

// Persisté dans localStorage (clé "linxos-auth") pour survivre à un refresh.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    { name: 'linxos-auth' }
  )
);

// État et actions du store de livraisons (CRUD + filtres + sélections).
interface LivraisonState {
  livraisons: Livraison[];
  selectedLivraison: Livraison | null;
  filter: {
    statutPreparation: StatutPreparation | 'all';
    statutLivraison: StatutLivraison | 'all';
    ville: string;
    search: string;
  };
  setLivraisons: (livraisons: Livraison[]) => void;
  addLivraison: (livraison: Livraison) => void;
  updateLivraison: (id: string, data: Partial<Livraison>) => void;
  deleteLivraison: (id: string) => void;
  setSelectedLivraison: (livraison: Livraison | null) => void;
  setFilter: (filter: Partial<LivraisonState['filter']>) => void;
  updateLivraisonPreparation: (id: string, statut: StatutPreparation) => void;
  updateLivraisonStatus: (id: string, statut: StatutLivraison) => void;
}

// Non persistant : la source de vérité reste Supabase.
export const useLivraisonStore = create<LivraisonState>((set) => ({
  livraisons: [],
  selectedLivraison: null,
  filter: {
    statutPreparation: 'all',
    statutLivraison: 'all',
    ville: '',
    search: '',
  },
  setLivraisons: (livraisons) => set({ livraisons }),
  addLivraison: (livraison) =>
    set((state) => ({ livraisons: [...state.livraisons, livraison] })),
  updateLivraison: (id, data) =>
    set((state) => ({
      livraisons: state.livraisons.map((l) =>
        l.id_livraison === id ? { ...l, ...data } : l
      ),
    })),
  deleteLivraison: (id) =>
    set((state) => ({
      livraisons: state.livraisons.filter((l) => l.id_livraison !== id),
    })),
  setSelectedLivraison: (livraison) => set({ selectedLivraison: livraison }),
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
  updateLivraisonPreparation: (id, statut) =>
    set((state) => ({
      livraisons: state.livraisons.map((l) =>
        l.id_livraison === id ? { ...l, statutPreparation: statut } : l
      ),
    })),
  updateLivraisonStatus: (id, statut) =>
    set((state) => ({
      livraisons: state.livraisons.map((l) =>
        l.id_livraison === id ? { ...l, statutLivraison: statut } : l
      ),
    })),
}));

// État et actions du store de notifications (liste locale + compteur de non-lus).
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

// Non persistant : alimenté principalement par `useNotifications()` (Supabase).
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id_notification === id ? { ...n, lue: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, lue: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id_notification !== id),
      unreadCount: state.notifications.find((n) => n.id_notification === id && !n.lue)
        ? state.unreadCount - 1
        : state.unreadCount,
    })),
}));

// État et actions du store UI (sidebar + thème).
interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setTheme: (theme: UIState['theme']) => void;
}

// Persisté (clé "linxos-ui") pour conserver les préférences de l'utilisateur.
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      theme: 'system',
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleMobileSidebar: () =>
        set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'linxos-ui' }
  )
);