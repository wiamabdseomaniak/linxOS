// ------------------------------------------------------------------
// Types alignés sur le schéma Supabase (français)
// ------------------------------------------------------------------

// ── Rôles utilisateur ──────────────────────────────────────────
export type UserRole = 'manager' | 'driver' | 'client' | 'logistique';

// ── User (profil unifié) ──────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  address?: string;
  emailVerified?: Date;
  twoFactorEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalDeliveries?: number;
  completedDeliveries?: number;
  inProgressDeliveries?: number;
  successRate?: number;
}

// ── Statuts livraison ──────────────────────────────────────────
export type StatutPreparation =
  | 'en_attente'
  | 'en_preparation'
  | 'prete'
  | 'terminee';

export type StatutLivraison =
  | 'planifie'
  | 'en_cours'
  | 'livree'
  | 'echouee';

export type StatutTracking =
  | 'planifie'
  | 'en_preparation'
  | 'prete'
  | 'en_cours'
  | 'livree'
  | 'echouee';

// ── Utilisateur ────────────────────────────────────────────────
export interface Utilisateur {
  id_utilisateur: string;
  nom: string;
  prenom: string;
  email: string;
  tele?: string;
  mot_de_passe?: string;        // uniquement pour l'auth (jamais exposé)
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// ── Client ─────────────────────────────────────────────────────
export interface Client {
  id_client: string;
  nomComplet: string;
  telephone: string;
  email?: string;
  adresse?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Livraison ──────────────────────────────────────────────────
export interface Livraison {
  id_livraison: string;
  nomEvenement: string;
  organisateur?: string;
  adresseLivraison: string;
  ville: string;
  datePrevue: Date;
  quantite: number;
  statutPreparation: StatutPreparation;
  statutLivraison: StatutLivraison;
  descriptionProbleme?: string;
  idClient: string;
  idUtilisateur: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Tracking (points de suivi) ─────────────────────────────────
export interface Tracking {
  id_tracking: string;
  statut: StatutTracking;
  dateTracking: Date;
  description?: string;
  idLivraison: string;
  createdAt: Date;
}

// ── Note (commentaires internes) ───────────────────────────────
export interface Note {
  id_note: string;
  contenu: string;
  dateNote: Date;
  idLivraison: string;
}

// ── Notification ───────────────────────────────────────────────
export interface Notification {
  id_notification: string;
  titre: string;
  message: string;
  type: string;
  lue: boolean;
  createdAt: Date;
  dateNotification: Date;
  idUtilisateur: string;
  actionUrl?: string;
}

