// ============================================
// Types Supabase - LinxOS Platform
// Correspond exactement à la structure des tables
// ============================================

// ---- Enums ----

export type StatutPreparation = 'en_attente' | 'en_preparation' | 'prete' | 'terminee';
export type StatutLivraison = 'planifie' | 'en_cours' | 'livree' | 'echouee';
export type StatutTracking = 'planifie' | 'en_preparation' | 'prete' | 'en_cours' | 'livree' | 'echouee';

export type DeliveryStatus = StatutLivraison;

// ---- Row types (correspondent aux colonnes SQL) ----

export interface UtilisateurRow {
  id_utilisateur: string;
  nom: string;
  prenom: string;
  email: string;
  tele: string | null;
  adresse: string | null;
  mot_de_passe: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ClientRow {
  id_client: string;
  nom_complet: string;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LivraisonRow {
  id_livraison: string;
  nom_evenement: string;
  organisateur: string;
  adresse_livraison: string;
  ville: string;
  date_prevue: string;
  quantite: number | null;
  statut_preparation: string | null;
  statut_livraison: string | null;
  description_probleme: string | null;
  id_client: string | null;
  id_utilisateur: string | null;
  created_at: string | null;
  updated_at: string | null;
  client?: ClientRow | null;
}

export interface TrackingRow {
  id_tracking: string;
  statut: string;
  date_tracking: string | null;
  description: string | null;
  id_livraison: string | null;
  created_at: string | null;
}

export interface NoteRow {
  id_note: string;
  contenu: string;
  date_note: string | null;
  id_livraison: string | null;
}

export interface NotificationRow {
  id_notification: string;
  titre: string;
  message: string;
  date_notification: string | null;
  lue: boolean | null;
  id_utilisateur: string | null;
}

export interface EmailVerificationRow {
  id: string;
  email: string;
  code_hash: string;
  expires_at: string;
  attempts: number | null;
  resend_attempts: number | null;
  used: boolean | null;
  created_at: string | null;
}

// ---- Domain models (vues applicatives) ----

export interface LivraisonEvent {
  id: string;
  nom_evenement: string;
  organisateur: string;
  adresse_livraison: string;
  ville: string;
  date_prevue: string;
  date_formatted: string;
  quantite: number;
  client_nom: string;
  client_telephone: string;
  statut_preparation: StatutPreparation;
  statut_livraison: StatutLivraison;
  description_probleme?: string;
  id_client: string;
}


export type DeliveryPriority = 'low' | 'medium' | 'high' | 'urgent';
export type UserRoleDb = 'manager' | 'driver' | 'client' | 'logistique';
export type NotificationTypeDb =
  | 'delivery'
  | 'event'
  | 'system'
  | 'alert'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type ProblemTypeDb =
  | 'late_delivery'
  | 'wrong_item'
  | 'damaged_package'
  | 'wrong_address'
  | 'client_absent';
export type ProblemStatusDb = 'pending' | 'in_review' | 'resolved' | 'escalated';

export interface DeliveryRow {
  id: string;
  tracking_id: string;
  user_id: string | null;
  client_name: string;
  contact_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  client_address: string;
  pickup_address: string;
  city: string | null;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  event: string | null;
  scheduled_date: string | null;
  actual_delivery_date: string | null;
  delivered_date: string | null;
  failed_date: string | null;
  failed_reason: string | null;
  proof_of_delivery: string | null;
  notes: string | null;
  weight: number | null;
  delivery_fee: number | null;
  quantity: number | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRoleDb;
  avatar: string | null;
  department: string | null;
  address: string | null;
  total_deliveries: number | null;
  completed_deliveries: number | null;
  in_progress_deliveries: number | null;
  success_rate: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface NotificationRow {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: NotificationTypeDb;
  read: boolean | null;
  action_url: string | null;
  created_at: string | null;
}

export interface ActivityLogRow {
  id: string;
  user_id: string | null;
  action: string;
  description: string | null;
  entity_type: string | null;
  entity_id: string | null;
  driver_name: string | null;
  status: string | null;
  created_at: string | null;
}

export interface DashboardMetricRow {
  id: string;
  metric_type: 'overall' | 'weekly' | 'city' | 'status';
  metric_key: string;
  metric_value: number;
  secondary_value: number | null;
  sort_order: number | null;
  color: string | null;
  updated_at: string | null;
}

export interface ProblemReportRow {
  id: string;
  delivery_id: string | null;
  event_name: string;
  problem_type: ProblemTypeDb;
  count: number | null;
  status: ProblemStatusDb;
  created_at: string | null;
  resolved_at: string | null;
}

// ============================================
// Domain models (vues applicatives)
// ============================================

export interface LogisticsEvent {
  id: string;
  id_livraison: string;
  id_tracking: string;
  title: string;
  club: string;
  address: string;
  city: string;
  date: string;
  time: string;
  quantity: number;
  contactName: string;
  contactPhone: string;
  status: DeliveryStatus;
  statut_preparation: string;
  notes?: string;
}

export interface DashboardStats {
  totalDeliveries: number;
  activeDeliveries: number;
  completedDeliveries: number;
  failedDeliveries: number;
  totalRevenue: number;
  activeClients: number;
}

export interface WeeklyPerformance {
  day: string;
  livrées: number;
  revenue: number;
}

export interface CityData {
  city: string;
  livrées: number;
  revenue: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  driver: string | null;
  status: string;
}

export interface ProblemReport {
  id: string;
  event: string;
  problem: string;
  count: number;
  status: string;
  statusColor: string;
}
