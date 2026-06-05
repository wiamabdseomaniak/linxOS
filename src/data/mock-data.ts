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
  status: 'planifie' | 'en_cours' | 'livree' | 'echouee';
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
    status: 'planifie',
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
    status: 'planifie',
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
    status: 'planifie',
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
    status: 'en_cours',
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
    status: 'en_cours',
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
    status: 'en_cours',
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
    status: 'en_cours',
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
    status: 'livree',
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
    status: 'livree',
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
    status: 'livree',
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
    status: 'planifie',
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
    status: 'planifie',
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
    status: 'en_cours',
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
    status: 'en_cours',
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
    status: 'en_cours',
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
    status: 'livree',
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
    status: 'livree',
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
    status: 'livree',
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
    status: 'planifie',
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
    status: 'planifie',
    notes: '',
  },
];

import { User, UserRole } from '@/types';

export const mockDeliveries = [
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
  type: 'delivery' | 'event' | 'system' | 'alert' | 'success' | 'warning' | 'error' | 'info';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'Livraison terminée',
    message: 'Votre colis LIV-2026-001 a été livré avec succès.',
    type: 'delivery',
    read: false,
    createdAt: '2026-05-15T10:30:00Z',
  },
  {
    id: 'notif-002',
    title: 'Nouvel événement planifié',
    message: 'Le Championnat Régional de Basketball a été planifié pour le 15 mai 2026.',
    type: 'event',
    read: false,
    createdAt: '2026-05-14T09:00:00Z',
  },
  {
    id: 'notif-003',
    title: 'Livraison échouée',
    message: 'La tentative de livraison du colis LIV-2026-005 a échoué. Nouvelle tentative demain.',
    type: 'alert',
    read: true,
    createdAt: '2026-05-13T16:45:00Z',
  },
  {
    id: 'notif-004',
    title: 'Mise à jour système',
    message: 'La plateforme Linxos sera en maintenance le 20 mai 2026 de 02h00 à 04h00.',
    type: 'system',
    read: true,
    createdAt: '2026-05-12T14:00:00Z',
  },
  {
    id: 'notif-005',
    title: 'Nouvelle livraison assignée',
    message: 'Vous avez été assigné pour livrer le Tournoi de Tennis Casablanca.',
    type: 'delivery',
    read: false,
    createdAt: '2026-05-14T11:20:00Z',
  },
  {
    id: 'notif-006',
    title: 'Paiement confirmé',
    message: 'Le paiement de 12 500 MAD pour la livraison LIV-2026-003 a été confirmé.',
    type: 'success',
    read: false,
    createdAt: '2026-05-15T08:45:00Z',
  },
  {
    id: 'notif-007',
    title: 'Retard signalé',
    message: 'La livraison LIV-2026-008 est en retard à cause des conditions de circulation.',
    type: 'warning',
    read: false,
    createdAt: '2026-05-15T09:30:00Z',
  },
  {
    id: 'notif-008',
    title: 'Nouveau message du chauffeur',
    message: 'Mohammed Idrissi a signalé un problème d\'accès au site de livraison.',
    type: 'info',
    read: true,
    createdAt: '2026-05-14T15:20:00Z',
  },
  {
    id: 'notif-009',
    title: 'Livraison retournée',
    message: 'Le colis LIV-2026-007 a été retourné à l\'entrepôt suite à une adresse incorrecte.',
    type: 'error',
    read: false,
    createdAt: '2026-05-15T07:10:00Z',
  },
  {
    id: 'notif-010',
    title: 'Rapport hebdomadaire disponible',
    message: 'Le rapport de performance de la semaine 19 est maintenant disponible dans votre tableau de bord.',
    type: 'system',
    read: true,
    createdAt: '2026-05-13T12:00:00Z',
  },
  {
    id: 'notif-011',
    title: 'Événement ajouté',
    message: 'Un nouvel événement "Marathon de Marrakech" a été ajouté à votre planning.',
    type: 'event',
    read: false,
    createdAt: '2026-05-15T06:30:00Z',
  },
  {
    id: 'notif-012',
    title: 'Vérification requise',
    message: 'Veuillez vérifier les documents de livraison pour le colis LIV-2026-010.',
    type: 'alert',
    read: false,
    createdAt: '2026-05-14T10:15:00Z',
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
  { day: 'Jan', deliveries: 180, revenue: 360000 },
  { day: 'Fév', deliveries: 210, revenue: 420000 },
  { day: 'Mar', deliveries: 195, revenue: 390000 },
  { day: 'Avr', deliveries: 240, revenue: 480000 },
  { day: 'Mai', deliveries: 270, revenue: 540000 },
  { day: 'Jun', deliveries: 220, revenue: 440000 },
  { day: 'Jul', deliveries: 190, revenue: 380000 },
];

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export const mockStatusDistribution: StatusDistribution[] = [
  { name: 'Livrée', value: 1120, color: '#22c55e' },
  { name: 'En transit', value: 89, color: '#ef4444' },
  { name: 'Planifiée', value: 45, color: '#3b82f6' },
  { name: 'Échouée', value: 38, color: '#f97316' },
];

export interface ActivityItem {
  id: string;
  action: string;
  driver: string | null;
  time: string;
  status: string;
}

export const mockActivityTimeline: ActivityItem[] = [
  { id: 'act-001', action: 'Livraison terminée', driver: 'Mohammed Idrissi', time: '09:30', status: 'delivered' },
  { id: 'act-002', action: 'Colis ramassé', driver: 'Fatima Alaoui', time: '09:15', status: 'delivered' },
  { id: 'act-003', action: 'En cours de livraison', driver: 'Youssef Benali', time: '09:00', status: 'in_transit' },
  { id: 'act-004', action: 'Assigné au chauffeur', driver: null, time: '08:30', status: 'scheduled' },
  { id: 'act-005', action: 'Commande confirmée', driver: null, time: '08:00', status: 'scheduled' },
  { id: 'act-006', action: 'Livraison échouée - nouvelle tentative planifiée', driver: 'Sara Tazi', time: '07:45', status: 'failed' },
  { id: 'act-007', action: 'Colis arrivé au centre', driver: null, time: '07:30', status: 'in_transit' },
  { id: 'act-008', action: 'Colis récupéré chez l\'expéditeur', driver: 'Karim Alaoui', time: '07:00', status: 'in_transit' },
];
