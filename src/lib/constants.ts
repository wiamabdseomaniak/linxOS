export const APP_NAME = 'LINXOS';
export const APP_DESCRIPTION = 'Plateforme de Logistique et Sponsoring';

export const DESIGN_TOKENS = {
  brand: {
    primary: '#F5C400',
    primaryHover: '#E6B800',
    accent: '#7C3AED',
    accentHover: '#6D28D9',
  },
  status: {
    planifie: '#3B82F6',
    enCours: '#F97316',
    livree: '#22C55E',
    echouee: '#EF4444',
  },
} as const;

export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    HOME: '/dashboard',
    LOGISTICS: '/logistics',
    DELIVERED: '/delivered',
    NOTIFICATIONS: '/notifications',
    SETTINGS: '/settings',
    PROFILE: '/profile',
  },
  PUBLIC: {
    TRACK: '/track',
  },
} as const;

export const DELIVERY_STATUSES = {
  preparation: { label: 'Préparation', color: 'bg-blue-500' },
  ready_to_deliver: { label: 'Prêt à livrer', color: 'bg-amber-500' },
  on_route: { label: 'En tournée', color: 'bg-purple-500' },
  delivered: { label: 'Livré', color: 'bg-green-500' },
  received: { label: 'Reçu', color: 'bg-emerald-500' },
  delayed: { label: 'Retardé', color: 'bg-orange-500' },
  cancelled: { label: 'Annulé', color: 'bg-red-500' },
  refused: { label: 'Refusé', color: 'bg-pink-500' },
  problem: { label: 'Problème', color: 'bg-red-600' },
  returned: { label: 'Retourné', color: 'bg-gray-500' },
} as const;

export const PRIORITIES = {
  low: { label: 'Faible', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  medium: { label: 'Moyenne', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  high: { label: 'Haute', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  urgent: { label: 'Urgente', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
} as const;

export const PROBLEM_TYPES = {
  broken_product: 'Produit cassé',
  client_absent: 'Client absent',
  wrong_address: 'Mauvaise adresse',
  client_refused: 'Client a refusé',
  delivery_damaged: 'Livraison endommagée',
} as const;

export const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fes',
  'Tangier',
  'Agadir',
  'Meknes',
  'Oujda',
  'Kenitra',
  'Tetouan',
] as const;

export const SIDEBAR_MENU = [
  { name: 'Tableau de bord', icon: 'LayoutDashboard', path: ROUTES.DASHBOARD.HOME },
  { name: 'Logistique', icon: 'Truck', path: ROUTES.DASHBOARD.LOGISTICS },
  { name: 'Livrées', icon: 'CheckCircle2', path: ROUTES.DASHBOARD.DELIVERED },
  { name: 'Notifications', icon: 'Bell', path: ROUTES.DASHBOARD.NOTIFICATIONS },
  { name: 'Paramètres', icon: 'Settings', path: ROUTES.DASHBOARD.SETTINGS },
  { name: 'Profil', icon: 'User', path: ROUTES.DASHBOARD.PROFILE },
] as const;