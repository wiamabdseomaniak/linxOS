/**
 * Types métiers liés au système de notifications in-app.
 * Indépendants du modèle `Notification` Supabase pour découpler
 * l'UI des évolutions côté BDD.
 */

// Catégories de notifications prises en charge par l'UI.
export type NotificationType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'mention'
  | 'payment'
  | 'security'
  | 'team'
  | 'system'
  | 'delivery'
  | 'event';

// Niveau de priorité pour le tri et la mise en avant visuelle.
export type NotificationPriority = 'high' | 'medium' | 'low';

// Forme d'une notification telle que consommée par les composants UI.
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  priority?: NotificationPriority;
  timestamp: Date;
  actionUrl?: string;
  avatar?: string;
}

// Filtre simple du dropdown de notifications.
export type FilterTab = 'all' | 'unread';