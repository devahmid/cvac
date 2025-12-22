-- Script SQL pour ajouter les fonctionnalités manquantes
-- À exécuter sur votre hébergement mutualisé via phpMyAdmin ou ligne de commande

-- ============================================
-- 1. CRÉER LA TABLE USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    association_id INT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    token VARCHAR(255) NULL,
    token_expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_token (token),
    INDEX idx_association_id (association_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. AJOUTER LES CHAMPS MANQUANTS À LA TABLE ASSOCIATIONS
-- ============================================

-- Ajouter la colonne category (si elle n'existe pas déjà)
ALTER TABLE associations 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) NULL AFTER domain;

-- Copier les données de domain vers category (si domain existe)
UPDATE associations SET category = domain WHERE category IS NULL AND domain IS NOT NULL;

-- Ajouter les autres champs manquants
ALTER TABLE associations 
ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL AFTER address,
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(10) NULL AFTER city,
ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500) NULL AFTER logo,
ADD COLUMN IF NOT EXISTS activities TEXT NULL AFTER description,
ADD COLUMN IF NOT EXISTS president VARCHAR(255) NULL AFTER activities,
ADD COLUMN IF NOT EXISTS founding_year INT NULL AFTER president,
ADD COLUMN IF NOT EXISTS number_of_members INT NULL AFTER founding_year,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE AFTER number_of_members;

-- Ajouter un index sur is_public pour améliorer les performances
ALTER TABLE associations 
ADD INDEX IF NOT EXISTS idx_is_public (is_public),
ADD INDEX IF NOT EXISTS idx_category (category),
ADD INDEX IF NOT EXISTS idx_city (city);

-- ============================================
-- 3. MIGRATION DES DONNÉES EXISTANTES (si nécessaire)
-- ============================================

-- Si vous avez des données dans domain, les copier dans category
-- UPDATE associations SET category = domain WHERE category IS NULL;

-- Définir toutes les associations existantes comme publiques par défaut
-- UPDATE associations SET is_public = TRUE WHERE is_public IS NULL;

-- ============================================
-- NOTES
-- ============================================
-- 1. Le champ 'domain' peut être conservé pour compatibilité ou supprimé plus tard
-- 2. Toutes les associations existantes seront publiques par défaut
-- 3. Les utilisateurs peuvent être créés sans association (association_id = NULL)
-- 4. Les tokens expirent après 30 jours par défaut (à configurer dans auth.php)

