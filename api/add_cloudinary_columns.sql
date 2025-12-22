-- Script SQL pour ajouter les colonnes Cloudinary aux tables existantes
-- À exécuter sur votre hébergement mutualisé via phpMyAdmin
-- 
-- Ce script ajoute la colonne cloudinary_public_id aux tables qui en ont besoin
-- Si les colonnes existent déjà, les commandes ALTER TABLE échoueront silencieusement

-- Table des actualités (news)
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255) NULL AFTER image;

-- Table des membres (members)
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255) NULL AFTER avatar;

-- Table des projets (projects)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255) NULL AFTER image;

-- Table des associations (associations)
ALTER TABLE associations 
ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255) NULL AFTER logo;

-- Table des ressources (resources)
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255) NULL AFTER file_path;

-- Table du contenu des pages (page_content)
ALTER TABLE page_content 
ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255) NULL AFTER content;

-- Note: Si votre version de MySQL ne supporte pas "IF NOT EXISTS" dans ALTER TABLE,
-- exécutez ces commandes une par une et ignorez les erreurs si les colonnes existent déjà

-- Pour vérifier que les colonnes ont été ajoutées:
-- DESCRIBE news;
-- DESCRIBE members;
-- DESCRIBE projects;
-- DESCRIBE associations;
-- DESCRIBE resources;
-- DESCRIBE page_content;



