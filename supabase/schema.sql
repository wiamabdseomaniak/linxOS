-- ============================================
-- Schéma Supabase - LinxOS Platform
-- Execute ce SQL dans le Supabase SQL Editor
-- ============================================

-- ============================================
-- TABLE: utilisateur
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateur (
  id_utilisateur UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  tele VARCHAR(50),
  mot_de_passe TEXT NOT NULL,
 
);

CREATE INDEX IF NOT EXISTS idx_utilisateur_email ON utilisateur(email);
ALTER TABLE utilisateur ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE: client
-- ============================================
CREATE TABLE IF NOT EXISTS client (
  id_client UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet VARCHAR(255) NOT NULL,
  telephone VARCHAR(50),
  email VARCHAR(255),
  adresse TEXT,

);

CREATE INDEX IF NOT EXISTS idx_client_email ON client(email);
CREATE INDEX IF NOT EXISTS idx_client_nom ON client(nom_complet);
ALTER TABLE Client DISABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE: livraison
-- ============================================
CREATE TABLE IF NOT EXISTS livraison (
  id_livraison UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_evenement VARCHAR(255) NOT NULL,
  organisateur VARCHAR(255) NOT NULL,
  adresse_livraison TEXT NOT NULL,
  ville VARCHAR(255) NOT NULL,
  date_prevue DATE NOT NULL,
  quantite INTEGER DEFAULT 0,
  statut_preparation VARCHAR(50) DEFAULT 'en_attente',
  statut_livraison VARCHAR(50) DEFAULT 'planifie',
  description_probleme TEXT,
  id_client UUID REFERENCES client(id_client) ON DELETE SET NULL,
  id_utilisateur UUID REFERENCES utilisateur(id_utilisateur) ON DELETE SET NULL,

);

CREATE INDEX IF NOT EXISTS idx_livraison_statut_prep ON livraison(statut_preparation);
CREATE INDEX IF NOT EXISTS idx_livraison_statut_liv ON livraison(statut_livraison);
CREATE INDEX IF NOT EXISTS idx_livraison_ville ON livraison(ville);
CREATE INDEX IF NOT EXISTS idx_livraison_date ON livraison(date_prevue);
CREATE INDEX IF NOT EXISTS idx_livraison_client ON livraison(id_client);
ALTER TABLE Livraison DISABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE: tracking
-- ============================================
CREATE TABLE IF NOT EXISTS tracking (
  id_tracking UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statut VARCHAR(50) NOT NULL,
  date_tracking TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  id_livraison UUID REFERENCES livraison(id_livraison) ON DELETE CASCADE,
);

CREATE INDEX IF NOT EXISTS idx_tracking_livraison ON tracking(id_livraison);
CREATE INDEX IF NOT EXISTS idx_tracking_date ON tracking(date_tracking DESC);
ALTER TABLE tracking ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE: note
-- ============================================
CREATE TABLE IF NOT EXISTS note (
  id_note UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contenu TEXT NOT NULL,
  date_note TIMESTAMPTZ DEFAULT NOW(),
  id_livraison UUID REFERENCES livraison(id_livraison) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_note_livraison ON note(id_livraison);
ALTER TABLE note ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE: notification
-- ============================================
CREATE TABLE IF NOT EXISTS notification (
  id_notification UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  date_notification TIMESTAMPTZ DEFAULT NOW(),
  lue BOOLEAN DEFAULT FALSE,
  id_utilisateur UUID REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notification_utilisateur ON notification(id_utilisateur);
CREATE INDEX IF NOT EXISTS idx_notification_lue ON notification(lue);
CREATE INDEX IF NOT EXISTS idx_notification_date ON notification(date_notification DESC);
ALTER TABLE notification ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABLE: email_verifications
-- ============================================
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  resend_attempts INTEGER DEFAULT 0,
  used BOOLEAN DEFAULT FALSE,

);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email
ON email_verifications(email) WHERE used = FALSE;

CREATE INDEX IF NOT EXISTS idx_email_verifications_expires
ON email_verifications(expires_at);

ALTER TABLE email_verifications DISABLE ROW LEVEL SECURITY;

-- ============================================
-- SEED DATA - Utilisateurs
-- ============================================
INSERT INTO utilisateur (id_utilisateur, nom, prenom, email, tele, mot_de_passe) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Benali', 'Ahmed', 'logistique.linxos@gmail.com', '0612345678', 'Logistiquemanager123'),
  

-- ============================================
-- SEED DATA - Clients
-- ============================================
INSERT INTO client (id_client, nom_complet, telephone, email, adresse) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Wydad Athletic Club', '+33 6 12 34 56 78', 'contact@wac.ma', '12 Rue de la Paix, 75002 Paris'),
  ('00000000-0000-0000-0000-000000000102', 'Royal Tennis Club Casablanca', '+212 6 56 78 90 12', 'info@rtcc.ma', '78 Boulevard Anfa, Résidence les Jardins'),
  ('00000000-0000-0000-0000-000000000103', 'ASFAR Volleyball', '+212 6 67 89 01 23', 'asfar@volley.ma', '45 Rue Oued Sebou, Hay Riad'),
  ('00000000-0000-0000-0000-000000000104', 'Fondation Actions Sociales', '+212 6 78 90 12 34', 'contact@fas.ma', '234 Avenue Mohammed V, Marrakech'),
  ('00000000-0000-0000-0000-000000000105', 'Coopérative Artisanale Fès', '+212 6 89 01 23 45', 'coop@fes.ma', '56 Rue Fès, Centre Ville'),
  ('00000000-0000-0000-0000-000000000106', 'Organisation Mariages Prestige', '+212 6 90 12 34 56', 'prestige@mariage.ma', '89 Boulevard de la Corniche'),
  ('00000000-0000-0000-0000-000000000107', 'Fès Athletic Club', '+212 6 77 88 99 00', 'fac@fes.ma', 'Salle Sportive Ibn ldahir, Rue Atlas'),
  ('00000000-0000-0000-0000-000000000108', 'Club Casablanca Handball', '+212 6 88 99 00 11', 'cch@hand.ma', 'Palais des Sports, Boulevard Brahim Roudani'),
  ('00000000-0000-0000-0000-000000000109', 'Conférence Internationale', '+212 6 99 00 11 22', 'conf@int.ma', 'Centre d''Affaires, Boulevard Zerktouni'),
  ('00000000-0000-0000-0000-000000000110', 'Raja Club Athletic', '+212 6 33 44 55 66', 'contact@rca.ma', 'Complexe Sportif Prince Moulay Abdellah');


-- ============================================
-- SEED DATA - Livraisons
-- ============================================
INSERT INTO livraison (id_livraison, nom_evenement, organisateur, adresse_livraison, ville, date_prevue, quantite, statut_preparation, statut_livraison, description_probleme, id_client, id_utilisateur) VALUES
  ('00000000-0000-0000-0000-000000001001', 'Championnat Régional de Basketball', 'Wydad Athletic Club', '12 Rue de la Paix, 75002 Paris', 'Casablanca', '2026-05-15', 200, 'prete', 'planifie', NULL, '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001002', 'Tournoi de Tennis Casablanca', 'Royal Tennis Club Casablanca', '78 Boulevard Anfa, Résidence les Jardins', 'Tangier', '2026-05-14', 25, 'prete', 'planifie', NULL, '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001003', 'Championnat Regional de Volleyball', 'ASFAR Volleyball', '45 Rue Oued Sebou, Hay Riad', 'Rabat', '2026-05-15', 180, 'prete', 'planifie', NULL, '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001004', 'Gala de Bienfaisance annuel', 'Fondation Actions Sociales', '234 Avenue Mohammed V', 'Marrakech', '2026-05-13', 15, 'terminee', 'en_cours', NULL, '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001005', 'Exposition Artisanat Traditionnel', 'Coopérative Artisanale Fès', '56 Rue Fès, Centre Ville', 'Fes', '2026-05-13', 8, 'terminee', 'en_cours', 'Objet fragile - soins spéciaux requis', '00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001006', 'Mariage El Amrani - Salle Blanche', 'Organisation Mariages Prestige', '89 Boulevard de la Corniche', 'Tangier', '2026-05-12', 5, 'terminee', 'en_cours', NULL, '00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001007', 'Finale Coupe du Roi Basketball', 'Fès Athletic Club', 'Salle Sportive Ibn ldahir, Rue Atlas', 'Fes', '2026-05-30', 400, 'en_attente', 'en_cours', NULL, '00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001008', 'Championnat National Handball', 'Club Casablanca Handball', 'Palais des Sports, Boulevard Brahim Roudani', 'Casablanca', '2026-06-02', 250, 'terminee', 'livree', NULL, '00000000-0000-0000-0000-000000000108', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001009', 'Conférence Internationale sur la Logistique', 'Conférence Internationale', 'Centre d''Affaires, Boulevard Zerktouni', 'Casablanca', '2026-05-10', 300, 'terminee', 'livree', NULL, '00000000-0000-0000-0000-000000000109', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001010', 'Festival Mawazine', 'Fondation Actions Sociales', 'Résidence Al Houda, Appt 5, Avenue de la Plage', 'Rabat', '2026-05-08', 5000, 'terminee', 'livree', 'Livraison échelonnée', '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001011', 'Salon International de l''Agriculture', 'Fondation Actions Sociales', '12 Rue Atlas, Quartier Industriel', 'Marrakech', '2026-05-05', 1200, 'terminee', 'livree', 'Accès par l''entrée sud', '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000001012', 'Match de Football Raja vs Wydad', 'Raja Club Athletic', 'Complexe Sportif Prince Moulay Abdellah', 'Rabat', '2026-05-03', 100, 'terminee', 'echouee', 'Adresse incorrecte - livraison impossible', '00000000-0000-0000-0000-000000000110', '00000000-0000-0000-0000-000000000001');

-- ============================================
-- SEED DATA - Tracking
-- ============================================
INSERT INTO tracking (statut, date_tracking, description, id_livraison) VALUES
  ('planifie', '2026-05-01 09:00:00+01', 'Livraison planifiée', '00000000-0000-0000-0000-000000001001'),
  ('en_preparation', '2026-05-10 10:00:00+01', 'Préparation en cours', '00000000-0000-0000-0000-000000001001'),
  ('prete', '2026-05-13 14:00:00+01', 'Livraison prête', '00000000-0000-0000-0000-000000001001'),
  ('planifie', '2026-05-01 09:00:00+01', 'Livraison planifiée', '00000000-0000-0000-0000-000000001008'),
  ('en_preparation', '2026-05-28 10:00:00+01', 'Préparation en cours', '00000000-0000-0000-0000-000000001008'),
  ('prete', '2026-06-01 14:00:00+01', 'Livraison prête', '00000000-0000-0000-0000-000000001008'),
  ('en_cours', '2026-06-02 10:00:00+01', 'En cours de livraison', '00000000-0000-0000-0000-000000001008'),
  ('livree', '2026-06-02 18:30:00+01', 'Livrée avec succès', '00000000-0000-0000-0000-000000001008'),
  ('planifie', '2026-04-25 09:00:00+01', 'Livraison planifiée', '00000000-0000-0000-0000-000000001012'),
  ('en_preparation', '2026-05-01 10:00:00+01', 'Préparation en cours', '00000000-0000-0000-0000-000000001012'),
  ('en_cours', '2026-05-03 14:00:00+01', 'Tentative de livraison', '00000000-0000-0000-0000-000000001012'),
  ('echouee', '2026-05-03 17:30:00+01', 'Adresse incorrecte', '00000000-0000-0000-0000-000000001012');

-- ============================================
-- SEED DATA - Notes
-- ============================================
INSERT INTO note (contenu, date_note, id_livraison) VALUES
  ('Contacter le client 24h avant livraison', '2026-05-10 09:00:00+01', '00000000-0000-0000-0000-000000001001'),
  ('Matériel fragile - manipulation soigneuse requise', '2026-05-11 10:00:00+01', '00000000-0000-0000-0000-000000001005'),
  ('Livraison échelonnée en 3 lots', '2026-05-05 08:00:00+01', '00000000-0000-0000-0000-000000001010');

-- ============================================
-- SEED DATA - Notifications
-- ============================================
INSERT INTO notification (titre, message, date_notification, lue, id_utilisateur) VALUES
  ('Livraison terminée', 'Votre livraison pour "Championnat National Handball" a été livrée avec succès.', '2026-06-02T18:30:00Z', false, '00000000-0000-0000-0000-000000000001'),
  ('Nouvel événement planifié', 'Le Championnat Régional de Basketball a été planifié pour le 15 mai 2026.', '2026-05-14T09:00:00Z', false, '00000000-0000-0000-0000-000000000001'),
  ('Livraison échouée', 'La livraison pour "Match Raja vs Wydad" a échoué (adresse incorrecte).', '2026-05-03T17:30:00Z', true, '00000000-0000-0000-0000-000000000001'),
  ('Mise à jour système', 'La plateforme Linxos sera en maintenance le 20 mai 2026 de 02h00 à 04h00.', '2026-05-12T14:00:00Z', true, '00000000-0000-0000-0000-000000000001'),
  ('Nouveau client ajouté', 'Le client "Salon International de l''Agriculture" a été ajouté.', '2026-04-28T11:00:00Z', false, '00000000-0000-0000-0000-000000000001'),


-- ============================================



