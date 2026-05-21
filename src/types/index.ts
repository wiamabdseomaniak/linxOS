export type UserRole = 'manager' | 'driver' | 'client' | 'logistique';

export type DeliveryStatus = 
  | 'preparation'
  | 'ready_to_deliver'
  | 'on_route'
  | 'delivered'
  | 'received'
  | 'delayed'
  | 'cancelled'
  | 'refused'
  | 'problem'
  | 'returned';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  totalDeliveries?: number;
  completedDeliveries?: number;
  inProgressDeliveries?: number;
  successRate?: number;
}

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
  weight?: number;
  description?: string;
}

export interface Delivery {
  id: string;
  trackingId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  address: string;
  city: string;
  items: DeliveryItem[];
  event?: string;
  status: DeliveryStatus;
  priority: Priority;
  driverId?: string;
  driver?: User;
  scheduledDate: Date;
  deliveredDate?: Date;
  notes?: string;
  proofOfDelivery?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
}

export interface ProblemReport {
  id: string;
  deliveryId: string;
  type: 'broken_product' | 'client_absent' | 'wrong_address' | 'client_refused' | 'delivery_damaged';
  description: string;
  attachments?: string[];
  location?: { lat: number; lng: number };
  priority: Priority;
  status: 'pending' | 'resolved' | 'escalated';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface DashboardStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  successfulDeliveries: number;
  problematicDeliveries: number;
  activeDrivers: number;
  completionRate: number;
  averageDeliveryTime: number;
  todayDeliveries: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface Session {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ip: string;
  location?: string;
  lastActive: Date;
  isCurrent: boolean;
}