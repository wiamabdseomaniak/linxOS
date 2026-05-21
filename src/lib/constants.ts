export const APP_NAME = 'LINXOS';
export const APP_DESCRIPTION = 'Logistics & Sponsoring Platform';

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
  preparation: { label: 'Preparation', color: 'bg-blue-500' },
  ready_to_deliver: { label: 'Ready to Deliver', color: 'bg-amber-500' },
  on_route: { label: 'On Route', color: 'bg-purple-500' },
  delivered: { label: 'Delivered', color: 'bg-green-500' },
  received: { label: 'Received', color: 'bg-emerald-500' },
  delayed: { label: 'Delayed', color: 'bg-orange-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
  refused: { label: 'Refused', color: 'bg-pink-500' },
  problem: { label: 'Problem', color: 'bg-red-600' },
  returned: { label: 'Returned', color: 'bg-gray-500' },
} as const;

export const PRIORITIES = {
  low: { label: 'Low', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  medium: { label: 'Medium', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  high: { label: 'High', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  urgent: { label: 'Urgent', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
} as const;

export const PROBLEM_TYPES = {
  broken_product: 'Broken Product',
  client_absent: 'Client Absent',
  wrong_address: 'Wrong Address',
  client_refused: 'Client Refused',
  delivery_damaged: 'Delivery Damaged',
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
  { name: 'Dashboard', icon: 'LayoutDashboard', path: ROUTES.DASHBOARD.HOME },
  { name: 'Logistics', icon: 'Truck', path: ROUTES.DASHBOARD.LOGISTICS },
  { name: 'Delivered', icon: 'CheckCircle2', path: ROUTES.DASHBOARD.DELIVERED },
  { name: 'Notifications', icon: 'Bell', path: ROUTES.DASHBOARD.NOTIFICATIONS },
  { name: 'Settings', icon: 'Settings', path: ROUTES.DASHBOARD.SETTINGS },
  { name: 'Profile', icon: 'User', path: ROUTES.DASHBOARD.PROFILE },
] as const;