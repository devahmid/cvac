-- Ajouter les colonnes pour la réinitialisation du mot de passe
-- Ce script est idempotent (peut être exécuté plusieurs fois sans erreur)

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255) NULL AFTER password,
ADD COLUMN IF NOT EXISTS password_reset_expires_at DATETIME NULL AFTER password_reset_token;

-- Ajouter un index pour améliorer les performances des recherches par token
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON users(password_reset_token);

