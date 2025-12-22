-- Script SQL pour ajouter les champs de validation/modération
-- À exécuter sur votre hébergement mutualisé via phpMyAdmin

-- ============================================
-- 1. AJOUTER LES CHAMPS DE VALIDATION À LA TABLE ASSOCIATIONS
-- ============================================

-- Ajouter le statut de validation
ALTER TABLE associations 
ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' AFTER is_public,
ADD COLUMN IF NOT EXISTS validated_at DATETIME NULL AFTER status,
ADD COLUMN IF NOT EXISTS validated_by INT NULL AFTER validated_at,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL AFTER validated_by,
ADD INDEX IF NOT EXISTS idx_status (status);

-- Ajouter une clé étrangère pour validated_by (vers users)
-- Note: Si la table users n'existe pas encore, cette commande échouera
-- Dans ce cas, exécutez d'abord setup_complete.sql
ALTER TABLE associations 
ADD CONSTRAINT fk_associations_validated_by 
FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- 2. AJOUTER LES CHAMPS DE VALIDATION À LA TABLE USERS
-- ============================================

-- Ajouter le statut de validation pour les utilisateurs
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected', 'active') DEFAULT 'pending' AFTER role,
ADD COLUMN IF NOT EXISTS validated_at DATETIME NULL AFTER status,
ADD COLUMN IF NOT EXISTS validated_by INT NULL AFTER validated_at,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL AFTER validated_by,
ADD INDEX IF NOT EXISTS idx_user_status (status);

-- Ajouter une clé étrangère pour validated_by (auto-référence)
ALTER TABLE users 
ADD CONSTRAINT fk_users_validated_by 
FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- 3. MIGRATION DES DONNÉES EXISTANTES
-- ============================================

-- Toutes les associations existantes sont approuvées par défaut
UPDATE associations SET status = 'approved' WHERE status IS NULL OR status = 'pending';

-- Tous les utilisateurs existants sont actifs par défaut
UPDATE users SET status = 'active' WHERE status IS NULL OR status = 'pending';

-- ============================================
-- NOTES
-- ============================================
-- 1. Les nouvelles associations créées auront le statut 'pending' par défaut
-- 2. Les nouveaux utilisateurs auront le statut 'pending' par défaut
-- 3. Seuls les administrateurs peuvent valider/rejeter
-- 4. Les associations/utilisateurs rejetés ne sont pas visibles publiquement

