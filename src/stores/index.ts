import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Delivery, Notification, DeliveryStatus } from '@/types';
import { mockNotifications } from '@/lib/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

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

interface DeliveryState {
  deliveries: Delivery[];
  selectedDelivery: Delivery | null;
  filter: {
    status: DeliveryStatus | 'all';
    city: string;
    priority: string;
    search: string;
  };
  setDeliveries: (deliveries: Delivery[]) => void;
  addDelivery: (delivery: Delivery) => void;
  updateDelivery: (id: string, data: Partial<Delivery>) => void;
  deleteDelivery: (id: string) => void;
  setSelectedDelivery: (delivery: Delivery | null) => void;
  setFilter: (filter: Partial<DeliveryState['filter']>) => void;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  deliveries: [],
  selectedDelivery: null,
  filter: {
    status: 'all',
    city: '',
    priority: '',
    search: '',
  },
  setDeliveries: (deliveries) => set({ deliveries }),
  addDelivery: (delivery) =>
    set((state) => ({ deliveries: [...state.deliveries, delivery] })),
  updateDelivery: (id, data) =>
    set((state) => ({
      deliveries: state.deliveries.map((d) =>
        d.id === id ? { ...d, ...data } : d
      ),
    })),
  deleteDelivery: (id) =>
    set((state) => ({
      deliveries: state.deliveries.filter((d) => d.id !== id),
    })),
  setSelectedDelivery: (delivery) => set({ selectedDelivery: delivery }),
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
  updateDeliveryStatus: (id, status) =>
    set((state) => ({
      deliveries: state.deliveries.map((d) =>
        d.id === id ? { ...d, status } : d
      ),
    })),
}));

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications as unknown as Notification[],
  unreadCount: mockNotifications.filter((n) => !n.read).length,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id && !n.read)
        ? state.unreadCount - 1
        : state.unreadCount,
    })),
}));

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setTheme: (theme: UIState['theme']) => void;
}

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