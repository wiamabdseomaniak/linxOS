/**
 * Constantes globales de l'application LinxOS.
 * Centralise les informations de marque, les tokens de design,
 * les routes, les statuts de livraison et les libellés UI réutilisables.
 */

// Identité de l'application (affichée dans le layout, le navigateur, etc.)
export const APP_NAME = 'LINXOS';
export const APP_DESCRIPTION = 'Plateforme de Logistique et Sponsoring';

/**
 * Tokens de design partagés (couleurs de marque, couleurs de statut).
 * Utilisés par les composants et les graphes pour garantir la cohérence visuelle.
 */
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

/**
 * Mapping centralisé des routes de l'application.
 * Évite les chaînes en dur dispersées dans le code et facilite les refactos.
 */
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

/**
 * Statuts possibles d'une livraison avec leur libellé FR et leur couleur Tailwind.
 * Référencés par le module logistique pour l'affichage des badges et le filtrage.
 */
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

/**
 * Niveaux de priorité d'une livraison, du plus bas au plus critique.
 * Les classes CSS combinent texte + fond pour fonctionner en mode clair et sombre.
 */
export const PRIORITIES = {
  low: { label: 'Faible', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  medium: { label: 'Moyenne', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  high: { label: 'Haute', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  urgent: { label: 'Urgente', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
} as const;

/**
 * Catalogue des types de problèmes remontés lors d'une livraison.
 * Utilisé pour normaliser les signalements côté client et serveur.
 */
export const PROBLEM_TYPES = {
  broken_product: 'Produit cassé',
  client_absent: 'Client absent',
  wrong_address: 'Mauvaise adresse',
  client_refused: 'Client a refusé',
  delivery_damaged: 'Livraison endommagée',
} as const;

/**
 * Liste des villes supportées par la plateforme.
 * Sert au remplissage des sélecteurs d'adresse et aux filtres analytiques.
 */
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

/**
 * Configuration du menu latéral (libellé, icône Lucide, route cible).
 * L'icône est stockée en chaîne puis résolue par le composant Sidebar.
 */
export const SIDEBAR_MENU = [
  { name: 'Tableau de bord', icon: 'LayoutDashboard', path: ROUTES.DASHBOARD.HOME },
  { name: 'Logistique', icon: 'Truck', path: ROUTES.DASHBOARD.LOGISTICS },
  { name: 'Livrées', icon: 'CheckCircle2', path: ROUTES.DASHBOARD.DELIVERED },
  { name: 'Notifications', icon: 'Bell', path: ROUTES.DASHBOARD.NOTIFICATIONS },
  { name: 'Paramètres', icon: 'Settings', path: ROUTES.DASHBOARD.SETTINGS },
  { name: 'Profil', icon: 'User', path: ROUTES.DASHBOARD.PROFILE },
] as const;