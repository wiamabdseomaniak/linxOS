export interface SportEvent {
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
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  notes?: string;
}

export const mockSportEvents: SportEvent[] = [
  {
    id: 'evt-001',
    id_livraison: 'LIV-2026-001',
    id_tracking: 'LNX-2026-001',
    title: 'Championnat Régional de Basketball',
    club: 'Wydad Athletic Club',
    address: '12 Rue de la Paix, 75002 Paris',
    city: 'Paris',
    date: '15 mai 2026',
    time: '14:00',
    quantity: 200,
    contactName: 'Marie Dupont',
    contactPhone: '+33 6 12 34 56 78',
    status: 'SCHEDULED',
    notes: '',
  },
  {
    id: 'evt-002',
    id_livraison: 'LIV-2026-002',
    id_tracking: 'LNX-2026-002',
    title: 'Tournoi de Tennis Casablanca',
    club: 'Royal Tennis Club Casablanca',
    address: '78 Boulevard Anfa, Résidence les Jardins',
    city: 'Tangier',
    date: '14 mai 2026',
    time: '14:00',
    quantity: 25,
    contactName: 'Sara Benjelloun',
    contactPhone: '+212 6 56 78 90 12',
    status: 'SCHEDULED',
    notes: 'VIP client',
  },
  {
    id: 'evt-003',
    id_livraison: 'LIV-2026-003',
    id_tracking: 'LNX-2026-003',
    title: 'Championnat Regional de Volleyball',
    club: 'ASFAR Volleyball',
    address: '45 Rue Oued Sebou, Hay Riad',
    city: 'Rabat',
    date: '15 mai 2026',
    time: '09:00',
    quantity: 180,
    contactName: 'Karim Tazi',
    contactPhone: '+212 6 67 89 01 23',
    status: 'SCHEDULED',
    notes: '',
  },
  {
    id: 'evt-004',
    id_livraison: 'LIV-2026-004',
    id_tracking: 'LNX-2026-004',
    title: 'Gala de Bienfaisance annuel',
    club: 'Fondation Actions Sociales',
    address: '234 Avenue Mohammed V',
    city: 'Marrakech',
    date: '13 mai 2026',
    time: '11:00',
    quantity: 15,
    contactName: 'Nadia Cherkaoui',
    contactPhone: '+212 6 78 90 12 34',
    status: 'IN_TRANSIT',
    notes: '',
  },
  {
    id: 'evt-005',
    id_livraison: 'LIV-2026-005',
    id_tracking: 'LNX-2026-005',
    title: 'Exposition Artisanat Traditionnel',
    club: 'Coopérative Artisanale Fès',
    address: '56 Rue Fès, Centre Ville',
    city: 'Fes',
    date: '13 mai 2026',
    time: '15:00',
    quantity: 8,
    contactName: 'Omar Bensouda',
    contactPhone: '+212 6 89 01 23 45',
    status: 'IN_TRANSIT',
    notes: 'Objet fragile - soins spéciaux requis',
  },
  {
    id: 'evt-006',
    id_livraison: 'LIV-2026-006',
    id_tracking: 'LNX-2026-006',
    title: 'Mariage El Amrani - Salle Blanche',
    club: 'Organisation Mariages Prestige',
    address: '89 Boulevard de la Corniche',
    city: 'Tangier',
    date: '12 mai 2026',
    time: '10:00',
    quantity: 5,
    contactName: 'Hind Alaoui',
    contactPhone: '+212 6 90 12 34 56',
    status: 'IN_TRANSIT',
    notes: '',
  },
  {
    id: 'evt-007',
    id_livraison: 'LIV-2026-007',
    id_tracking: 'LNX-2026-007',
    title: 'Finale Coupe du Roi Basketball',
    club: 'Fès Athletic Club',
    address: 'Salle Sportive Ibn ldahir, Rue Atlas',
    city: 'Fès',
    date: '30 mai 2026',
    time: '19:00',
    quantity: 400,
    contactName: 'Mohamed Rida',
    contactPhone: '+212 6 77 88 99 00',
    status: 'IN_TRANSIT',
    notes: '',
  },
  {
    id: 'evt-008',
    id_livraison: 'LIV-2026-008',
    id_tracking: 'LNX-2026-008',
    title: 'Championnat National Handball',
    club: 'Club Casablanca Handball',
    address: 'Palais des Sports, Boulevard Brahim Roudani',
    city: 'Casablanca',
    date: '2 juin 2026',
    time: '17:30',
    quantity: 250,
    contactName: 'Nadia Idrissi',
    contactPhone: '+212 6 88 99 00 11',
    status: 'DELIVERED',
    notes: '',
  },
  {
    id: 'evt-009',
    id_livraison: 'LIV-2026-009',
    id_tracking: 'LNX-2026-009',
    title: 'Cross Country Régional',
    club: 'AS Salé',
    address: 'Stade Municipal de Salé, Avenue Mers Sultan',
    city: 'Salé',
    date: '5 juin 2026',
    time: '08:00',
    quantity: 600,
    contactName: 'Karim Tazi',
    contactPhone: '+212 6 99 00 11 22',
    status: 'DELIVERED',
    notes: '',
  },
  {
    id: 'evt-010',
    id_livraison: 'LIV-2026-010',
    id_tracking: 'LNX-2026-010',
    title: 'Tournoi de Padel International',
    club: 'Marrakech Padel Club',
    address: 'Complexe Royal Palm, Route de l\'Ourika',
    city: 'Marrakech',
    date: '8 juin 2026',
    time: '15:00',
    quantity: 120,
    contactName: 'Olivia Benjelloun',
    contactPhone: '+212 6 10 11 22 33',
    status: 'DELIVERED',
    notes: '',
  },
  {
    id: 'evt-011',
    id_livraison: 'LIV-2026-011',
    id_tracking: 'LNX-2026-011',
    title: 'Compétition de Judo Junior',
    club: 'Club de Judo Tanger',
    address: 'Complexe Sportif de Tanger, Avenue Ibn Batouta',
    city: 'Tanger',
    date: '10 juin 2026',
    time: '10:00',
    quantity: 180,
    contactName: 'Mehdi El Amrani',
    contactPhone: '+212 6 11 22 33 44',
    status: 'SCHEDULED',
    notes: '',
  },
  {
    id: 'evt-012',
    id_livraison: 'LIV-2026-012',
    id_tracking: 'LNX-2026-012',
    title: 'Championnat de Boxe Provincial',
    club: 'Fédération Boxe Maroc',
    address: 'Salle de Boxe Agadir, Boulevard du 11 Janvier',
    city: 'Agadir',
    date: '12 juin 2026',
    time: '20:00',
    quantity: 90,
    contactName: 'Yassine El Fassi',
    contactPhone: '+212 6 12 33 44 55',
    status: 'SCHEDULED',
    notes: '',
  },
  {
    id: 'evt-013',
    id_livraison: 'LIV-2026-013',
    id_tracking: 'LNX-2026-013',
    title: 'Finale Volleyball Régionale',
    club: 'OC Khouribga',
    address: 'Salle Polyvalente Khouribga, Centre Ville',
    city: 'Khouribga',
    date: '15 juin 2026',
    time: '18:00',
    quantity: 200,
    contactName: 'Abdellah Bentaleb',
    contactPhone: '+212 6 13 44 55 66',
    status: 'IN_TRANSIT',
    notes: '',
  },
  {
    id: 'evt-014',
    id_livraison: 'LIV-2026-014',
    id_tracking: 'LNX-2026-014',
    title: 'Meeting d\'Athlétisme',
    club: 'Club d\'Athlétisme Meknès',
    address: 'Stade d\'Athlétisme Meknès, Avenue Hassan II',
    city: 'Meknès',
    date: '18 juin 2026',
    time: '09:00',
    quantity: 350,
    contactName: 'Rachid El Idrissi',
    contactPhone: '+212 6 14 55 66 77',
    status: 'IN_TRANSIT',
    notes: '',
  },
  {
    id: 'evt-015',
    id_livraison: 'LIV-2026-015',
    id_tracking: 'LNX-2026-015',
    title: 'Tournoi de Badminton',
    club: 'Club Sportif Settat',
    address: 'Complexe Sportif Settat, Route de Casablanca',
    city: 'Settat',
    date: '20 juin 2026',
    time: '14:00',
    quantity: 140,
    contactName: 'Laila Benali',
    contactPhone: '+212 6 15 66 77 88',
    status: 'IN_TRANSIT',
    notes: '',
  },
  {
    id: 'evt-016',
    id_livraison: 'LIV-2026-016',
    id_tracking: 'LNX-2026-016',
    title: 'Festival de Musique Gnawa',
    club: 'Association Culturelle Rabat',
    address: '15 Rue des Tensift, Quartier Hassan',
    city: 'Rabat',
    date: '15 mai 2026',
    time: '16:00',
    quantity: 50,
    contactName: 'Mehdi El Fassi',
    contactPhone: '+212 6 11 22 33 44',
    status: 'DELIVERED',
    notes: 'Équipement pour scène principale',
  },
  {
    id: 'evt-017',
    id_livraison: 'LIV-2026-017',
    id_tracking: 'LNX-2026-017',
    title: 'Match de Football Wydad vs Raja',
    club: 'Wydad Athletic Club',
    address: 'Stade Mohammed V, Boulevard Brahim Roudani',
    city: 'Casablanca',
    date: '16 mai 2026',
    time: '18:00',
    quantity: 45,
    contactName: 'Lina Rami',
    contactPhone: '+212 6 22 33 44 55',
    status: 'DELIVERED',
    notes: '',
  },
  {
    id: 'evt-018',
    id_livraison: 'LIV-2026-018',
    id_tracking: 'LNX-2026-018',
    title: 'Exposition d\'Art Contemporain',
    club: 'Musée d\'Art Moderne Marrakech',
    address: '200 Avenue Mohammed VI, Guéliz',
    city: 'Marrakech',
    date: '17 mai 2026',
    time: '10:00',
    quantity: 18,
    contactName: 'Yassine Bennis',
    contactPhone: '+212 6 33 44 55 66',
    status: 'DELIVERED',
    notes: 'Exposition ouvre le 18 mai',
  },
  {
    id: 'evt-019',
    id_livraison: 'LIV-2026-019',
    id_tracking: 'LNX-2026-019',
    title: 'Conference Tech Innovation 2026',
    club: 'TechHub Tanger',
    address: 'Zone Franche, Bureau 45',
    city: 'Tanger',
    date: '14 mai 2026',
    time: '08:00',
    quantity: 30,
    contactName: 'Sara Tahiri',
    contactPhone: '+212 6 44 55 66 77',
    status: 'SCHEDULED',
    notes: '',
  },
  {
    id: 'evt-020',
    id_livraison: 'LIV-2026-020',
    id_tracking: 'LNX-2026-020',
    title: 'Marathon Charité Children',
    club: 'Fondation charity Marathon',
    address: 'Parc de la Ligue, Entrée principale',
    city: 'Casablanca',
    date: '18 mai 2026',
    time: '05:00',
    quantity: 130,
    contactName: 'Omar Choukri',
    contactPhone: '+212 6 55 66 77 88',
    status: 'SCHEDULED',
    notes: '',
  },
];

import { Delivery, User, UserRole } from '@/types';

export const mockDeliveries: Delivery[] = [
  {
    id: 'del-001',
    trackingId: 'LNX-2026-001',
    clientName: 'Marie Dupont',
    clientPhone: '+33 6 12 34 56 78',
    clientEmail: 'marie.dupont@example.com',
    address: '12 Rue de la Paix, 75002 Paris',
    city: 'Paris',
    items: [{ id: 'item-001', name: 'Équipements Basketball', quantity: 200, weight: 150 }],
    event: 'Championnat Régional de Basketball',
    status: 'delivered',
    priority: 'high',
    scheduledDate: new Date('2026-05-15'),
    createdAt: new Date('2026-05-10'),
    updatedAt: new Date('2026-05-15'),
  },
  {
    id: 'del-002',
    trackingId: 'LNX-2026-002',
    clientName: 'Sara Benjelloun',
    clientPhone: '+212 6 56 78 90 12',
    address: '78 Boulevard Anfa, Résidence les Jardins',
    city: 'Tangier',
    items: [{ id: 'item-002', name: 'Équipements Tennis', quantity: 25, weight: 20 }],
    event: 'Tournoi de Tennis Casablanca',
    status: 'on_route',
    priority: 'urgent',
    scheduledDate: new Date('2026-05-14'),
    createdAt: new Date('2026-05-12'),
    updatedAt: new Date('2026-05-14'),
  },
  {
    id: 'del-003',
    trackingId: 'LNX-2026-003',
    clientName: 'Karim Tazi',
    clientPhone: '+212 6 67 89 01 23',
    address: '45 Rue Oued Sebou, Hay Riad',
    city: 'Rabat',
    items: [{ id: 'item-003', name: 'Équipements Volleyball', quantity: 180, weight: 120 }],
    event: 'Championnat Régional de Volleyball',
    status: 'ready_to_deliver',
    priority: 'medium',
    scheduledDate: new Date('2026-05-15'),
    createdAt: new Date('2026-05-13'),
    updatedAt: new Date('2026-05-14'),
  },
  {
    id: 'del-004',
    trackingId: 'LNX-2026-004',
    clientName: 'Nadia Cherkaoui',
    clientPhone: '+212 6 78 90 12 34',
    address: '234 Avenue Mohammed V',
    city: 'Marrakech',
    items: [{ id: 'item-004', name: 'Matériel de Gala', quantity: 15, weight: 5 }],
    event: 'Gala de Bienfaisance annuel',
    status: 'delivered',
    priority: 'low',
    scheduledDate: new Date('2026-05-13'),
    createdAt: new Date('2026-05-08'),
    updatedAt: new Date('2026-05-13'),
  },
  {
    id: 'del-005',
    trackingId: 'LNX-2026-005',
    clientName: 'Omar Bensouda',
    clientPhone: '+212 6 89 01 23 45',
    address: '56 Rue Fès, Centre Ville',
    city: 'Fes',
    items: [{ id: 'item-005', name: 'Artisanat Traditionnel', quantity: 8, weight: 2 }],
    event: 'Exposition Artisanat Traditionnel',
    status: 'problem',
    priority: 'urgent',
    scheduledDate: new Date('2026-05-13'),
    createdAt: new Date('2026-05-10'),
    updatedAt: new Date('2026-05-13'),
  },
];

export const mockCurrentUser: User = {
  id: 'user-001',
  name: 'Ahmed Benali',
  email: 'logistique.linxos@gmail.com',
  phone: '0612345678',
  role: 'logistique' as UserRole,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  address: 'Casablanca, Morocco',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-05-15'),
};

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'delivery' | 'event' | 'system' | 'alert';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'Delivery Completed',
    message: 'Your package LIV-2026-001 has been delivered successfully.',
    type: 'delivery',
    read: false,
    createdAt: '2026-05-15T10:30:00Z',
  },
  {
    id: 'notif-002',
    title: 'New Event Scheduled',
    message: 'Championnat Régional de Basketball has been scheduled for 15 May 2026.',
    type: 'event',
    read: false,
    createdAt: '2026-05-14T09:00:00Z',
  },
  {
    id: 'notif-003',
    title: 'Delivery Failed',
    message: 'Package LIV-2026-005 delivery attempt failed. Will retry tomorrow.',
    type: 'alert',
    read: true,
    createdAt: '2026-05-13T16:45:00Z',
  },
  {
    id: 'notif-004',
    title: 'System Update',
    message: 'Linxos Platform will undergo maintenance on 20 May 2026 from 02:00 to 04:00.',
    type: 'system',
    read: true,
    createdAt: '2026-05-12T14:00:00Z',
  },
  {
    id: 'notif-005',
    title: 'New Delivery Assigned',
    message: 'You have been assigned to deliver Tournoi de Tennis Casablanca.',
    type: 'delivery',
    read: false,
    createdAt: '2026-05-14T11:20:00Z',
  },
];

export interface DashboardStats {
  totalDeliveries: number;
  activeDeliveries: number;
  completedDeliveries: number;
  failedDeliveries: number;
  totalRevenue: number;
  activeClients: number;
}

export const mockDashboardStats: DashboardStats = {
  totalDeliveries: 1247,
  activeDeliveries: 89,
  completedDeliveries: 1120,
  failedDeliveries: 38,
  totalRevenue: 2450000,
  activeClients: 156,
};

export interface CityData {
  city: string;
  deliveries: number;
  revenue: number;
}

export const mockDeliveriesByCity: CityData[] = [
  { city: 'Casablanca', deliveries: 342, revenue: 684000 },
  { city: 'Rabat', deliveries: 245, revenue: 490000 },
  { city: 'Marrakech', deliveries: 198, revenue: 396000 },
  { city: 'Tangier', deliveries: 156, revenue: 312000 },
  { city: 'Fes', deliveries: 124, revenue: 248000 },
  { city: 'Agadir', deliveries: 98, revenue: 196000 },
  { city: 'Others', deliveries: 84, revenue: 224000 },
];

export interface WeeklyPerformance {
  day: string;
  deliveries: number;
  revenue: number;
}

export const mockWeeklyPerformance: WeeklyPerformance[] = [
  { day: 'Mon', deliveries: 45, revenue: 90000 },
  { day: 'Tue', deliveries: 52, revenue: 104000 },
  { day: 'Wed', deliveries: 48, revenue: 96000 },
  { day: 'Thu', deliveries: 61, revenue: 122000 },
  { day: 'Fri', deliveries: 73, revenue: 146000 },
  { day: 'Sat', deliveries: 38, revenue: 76000 },
  { day: 'Sun', deliveries: 22, revenue: 44000 },
];

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export const mockStatusDistribution: StatusDistribution[] = [
  { name: 'Delivered', value: 1120, color: '#22c55e' },
  { name: 'In Transit', value: 89, color: '#ef4444' },
  { name: 'Scheduled', value: 45, color: '#3b82f6' },
  { name: 'Failed', value: 38, color: '#f97316' },
];

export interface ActivityItem {
  id: string;
  action: string;
  driver: string | null;
  time: string;
  status: string;
}

export const mockActivityTimeline: ActivityItem[] = [
  { id: 'act-001', action: 'Delivery completed', driver: 'Mohammed Idrissi', time: '09:30', status: 'delivered' },
  { id: 'act-002', action: 'Package picked up', driver: 'Fatima Alaoui', time: '09:15', status: 'delivered' },
  { id: 'act-003', action: 'Out for delivery', driver: 'Youssef Benali', time: '09:00', status: 'in_transit' },
  { id: 'act-004', action: 'Assigned to driver', driver: null, time: '08:30', status: 'scheduled' },
  { id: 'act-005', action: 'Order confirmed', driver: null, time: '08:00', status: 'scheduled' },
  { id: 'act-006', action: 'Delivery failed - retry scheduled', driver: 'Sara Tazi', time: '07:45', status: 'failed' },
  { id: 'act-007', action: 'Package arrived at hub', driver: null, time: '07:30', status: 'in_transit' },
  { id: 'act-008', action: 'Order picked up from sender', driver: 'Karim Alaoui', time: '07:00', status: 'in_transit' },
];