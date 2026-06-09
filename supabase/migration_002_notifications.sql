-- ============================================
-- Migration 002 : Amélioration des notifications
-- 1. Ajoute les colonnes type et action_url
-- 2. RLS désactivée (le système gère les permissions en app)
-- 3. Rafraîchit Realtime sur la table notification
-- ============================================

-- 1. Ajout des colonnes manquantes
ALTER TABLE notification
  ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'info',
  ADD COLUMN IF NOT EXISTS action_url TEXT;

-- 2. Désactive RLS pour permettre les INSERT/UPDATE depuis le client
ALTER TABLE notification DISABLE ROW LEVEL SECURITY;

-- Supprime les éventuelles anciennes politiques
DROP POLICY IF EXISTS "Lecture de ses propres notifications" ON notification;
DROP POLICY IF EXISTS "Insertion de notification" ON notification;
DROP POLICY IF EXISTS "Mise à jour de ses notifications" ON notification;
DROP POLICY IF EXISTS "Suppression de ses notifications" ON notification;

-- 3. Rafraîchit la publication Realtime pour inclure les nouvelles colonnes
ALTER PUBLICATION supabase_realtime ADD TABLE notification;
