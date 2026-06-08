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
  adresse TEXT,
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



