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

export type NotificationPriority = 'high' | 'medium' | 'low';

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

export type FilterTab = 'all' | 'unread';