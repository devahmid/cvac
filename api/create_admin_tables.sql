-- Tables pour les fonctionnalités admin avancées

-- Table des logs d'activité admin
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table pour les templates d'emails
CREATE TABLE IF NOT EXISTS email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    variables TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table pour l'historique des emails envoyés
CREATE TABLE IF NOT EXISTS email_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    recipients TEXT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sent_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    template_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajouter colonnes de modération aux actualités si elles n'existent pas
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS status ENUM('draft', 'pending', 'published', 'rejected') DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS author_id INT NULL,
ADD COLUMN IF NOT EXISTS validated_at DATETIME NULL,
ADD COLUMN IF NOT EXISTS validated_by INT NULL,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL,
ADD INDEX IF NOT EXISTS idx_status (status),
ADD INDEX IF NOT EXISTS idx_author_id (author_id);

-- Ajouter contraintes si elles n'existent pas
ALTER TABLE news
ADD CONSTRAINT fk_news_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_news_validated_by FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL;

-- Insérer quelques templates d'emails par défaut
INSERT INTO email_templates (name, subject, body, variables) VALUES
('bienvenue', 'Bienvenue sur le site CVAC', 'Bonjour {{firstname}},\n\nNous sommes ravis de vous accueillir sur le site du CVAC - Conseil de la Vie Associative.\n\nVotre compte a été validé et vous pouvez maintenant accéder à toutes les fonctionnalités du site.\n\nCordialement,\nL''équipe CVAC', 'firstname'),
('validation_association', 'Votre association a été validée', 'Bonjour {{firstname}},\n\nNous avons le plaisir de vous informer que votre association "{{association_name}}" a été validée et est maintenant visible dans l''annuaire.\n\nCordialement,\nL''équipe CVAC', 'firstname,association_name'),
('rejet_association', 'Décision concernant votre association', 'Bonjour {{firstname}},\n\nNous avons examiné votre demande d''inscription pour l''association "{{association_name}}".\n\nMalheureusement, nous ne pouvons pas valider votre association pour le moment.\n\nRaison : {{reason}}\n\nCordialement,\nL''équipe CVAC', 'firstname,association_name,reason')
ON DUPLICATE KEY UPDATE name=name;

