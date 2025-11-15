-- Script SQL pour créer la base de données CVAC
-- À exécuter sur votre hébergement mutualisé via phpMyAdmin ou ligne de commande
-- 
-- Base de données de production: u281164575_cvac
-- Utilisateur: u281164575_admin
-- Site: cvac-choisyleroi.fr
--
-- ⚠️ IMPORTANT: La base de données doit déjà exister sur votre hébergement
-- Ce script crée uniquement les tables, pas la base de données elle-même

-- Si vous créez la base manuellement, utilisez:
-- CREATE DATABASE IF NOT EXISTS u281164575_cvac CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données (décommenter si nécessaire)
-- USE u281164575_cvac;

-- Table des membres du CVAC
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    association VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    description TEXT,
    avatar VARCHAR(500),
    role_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des actualités
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image VARCHAR(500),
    category VARCHAR(100),
    date DATE NOT NULL,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    association VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des associations
CREATE TABLE IF NOT EXISTS associations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    domain VARCHAR(100),
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    logo VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des projets inter-associatifs
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    image VARCHAR(500),
    status ENUM('planifié', 'en_cours', 'terminé', 'annulé') DEFAULT 'planifié',
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    budget DECIMAL(10,2),
    public_target VARCHAR(255),
    participants_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table de liaison projets-associations
CREATE TABLE IF NOT EXISTS project_associations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    association_id INT NOT NULL,
    role VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_association (project_id, association_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des ressources et documents
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    file_type VARCHAR(50),
    category ENUM('officiels', 'comptes_rendus', 'bilans', 'guides', 'autres') NOT NULL,
    year INT,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des membres réels du CVAC (ordre : femmes d'abord, puis hommes)
INSERT INTO members (name, role, association, description, role_order) VALUES
('Ahlem ZENATI', 'Présidente', 'Les Fleurs des Navigateurs', 'Présidente du CVAC, représentante de l\'association Les Fleurs des Navigateurs.', 1),
('Michèle COUDERC', 'Membre', 'Choisy ta coop', 'Membre du CVAC, représentante de l\'association Choisy ta coop.', 2),
('Josette LEVÊQUE', 'Membre', 'Danses et loisirs', 'Membre du CVAC, représentante de l\'association Danses et loisirs.', 3),
('Rachel PRIEST', 'Membre', 'Sla Formations', 'Membre du CVAC, représentante de l\'association Sla Formations.', 4),
('Yvonne ZODO', 'Membre', 'Société Régionale des Beaux-Arts', 'Membre du CVAC, représentante de la Société Régionale des Beaux-Arts.', 5),
('Eric DIOR', 'Vice-président', 'On sème pour la ville', 'Vice-président du CVAC, représentant de l\'association On sème pour la ville.', 6),
('Ahmid AIT OUALI', 'Membre', 'Les Résidents des Hautes Bornes', 'Membre du CVAC, représentant de l\'association Les Résidents des Hautes Bornes.', 7),
('Azedine ARIF', 'Membre', 'Association d\'Éducation Créative à l\'Environnement', 'Membre du CVAC, représentant de l\'Association d\'Éducation Créative à l\'Environnement.', 8),
('Serge LECLERC', 'Membre', 'Association Sociale de Réinsertion par le Logement', 'Membre du CVAC, représentant de l\'Association Sociale de Réinsertion par le Logement.', 9),
('Noham SETTBON', 'Membre', 'La Santé à Choisy', 'Membre du CVAC, représentant de l\'association La Santé à Choisy.', 10);

INSERT INTO news (title, content, excerpt, category, date) VALUES
('Réunion plénière du CVAC', 'Retour sur notre dernière assemblée générale et les projets votés pour 2025.', 'Retour sur notre dernière assemblée générale...', 'Réunion plénière', '2024-11-15'),
('Festival Inter-Associatif', 'Un événement réussi qui a rassemblé plus de 20 associations choisyennes.', 'Un événement réussi qui a rassemblé...', 'Événement', '2024-11-08');

-- Données d'exemple pour les associations
INSERT INTO associations (name, description, domain, email, phone, address) VALUES
('Club Sportif Choisyen', 'Association sportive proposant football, basketball et activités jeunesse depuis plus de 30 ans.', 'Sport', 'contact@club-sportif-choisy.fr', '01 23 45 67 89', 'Stade Municipal, Choisy-le-Roi'),
('Théâtre en Mouvement', 'Compagnie théâtrale amateur proposant cours et spectacles pour tous les âges.', 'Culture', 'contact@theatre-mouvement.fr', '01 23 45 67 90', 'Centre Culturel, Choisy-le-Roi'),
('Solidarité Choisyenne', 'Association d\'aide aux personnes en difficulté et de soutien aux familles.', 'Solidarité', 'contact@solidarite-choisy.fr', '01 23 45 67 91', 'Maison des Associations, Choisy-le-Roi');

-- Table pour le contenu éditable des pages
CREATE TABLE IF NOT EXISTS page_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_slug VARCHAR(100) NOT NULL,
    section_key VARCHAR(100) NOT NULL,
    content_type ENUM('text', 'html', 'json', 'image') DEFAULT 'text',
    content TEXT,
    metadata JSON,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_page_section (page_slug, section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table pour les valeurs du CVAC
CREATE TABLE IF NOT EXISTS values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table pour les missions du CVAC
CREATE TABLE IF NOT EXISTS missions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table pour les statistiques
CREATE TABLE IF NOT EXISTS statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) NOT NULL UNIQUE,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour les projets
INSERT INTO projects (title, description, content, status, start_date, end_date, location, public_target, participants_count) VALUES
('Festival Culturel Inter-Générationnel', 'Un événement rassemblant toutes les générations autour d\'activités culturelles diversifiées : concerts, ateliers créatifs, spectacles de danse et expositions.', 'Détails complets du festival...', 'terminé', '2024-10-01', '2024-10-15', 'Parc Municipal', 'Tous âges', 800),
('Choisy Verte & Solidaire', 'Projet alliant protection de l\'environnement et solidarité, avec des actions de nettoyage, de sensibilisation et d\'aide aux familles en difficulté.', 'Détails du projet environnemental...', 'en_cours', '2024-10-01', '2025-03-31', 'Quartiers de Choisy', 'Familles et bénévoles', 150),
('Mentorat Jeunesse', 'Programme d\'accompagnement des jeunes par des bénévoles expérimentés pour l\'orientation et l\'insertion professionnelle.', 'Détails du programme de mentorat...', 'planifié', '2025-01-01', '2025-12-31', 'Maison des Jeunes', 'Jeunes 16-25 ans', 0),
('Numérique pour Tous', 'Formation aux outils numériques pour réduire la fracture digitale, avec un focus sur les seniors.', 'Détails des formations...', 'en_cours', '2024-09-01', '2025-06-30', 'Centre Social', 'Seniors', 120);

-- Données d'exemple pour les valeurs
INSERT INTO values (title, description, icon, display_order) VALUES
('Laïcité', 'Garantir la neutralité et le respect de toutes les convictions dans un cadre républicain', 'balance-scale', 1),
('Respect', 'Cultiver l\'écoute mutuelle et la bienveillance dans tous nos échanges', 'heart', 2),
('Tolérance', 'Accepter la diversité des opinions et des approches dans le respect des valeurs communes', 'dove', 3),
('Solidarité', 'Favoriser l\'entraide collective et le soutien mutuel entre associations', 'hands-helping', 4),
('Inclusivité', 'Assurer l\'ouverture à tous sans discrimination et favoriser la participation de chacun', 'users-line', 5),
('Représentativité', 'Refléter la diversité du tissu associatif choisyen dans sa richesse et sa pluralité', 'users-between-lines', 6),
('Parité', 'Garantir l\'égalité femmes-hommes dans la gouvernance et la prise de décision', 'venus-mars', 7),
('Liberté de Conscience', 'Respecter la liberté de pensée et d\'expression de chaque membre et association', 'brain', 8);

-- Données d'exemple pour les missions
INSERT INTO missions (title, description, icon, display_order) VALUES
('Interface Ville-Associations', 'Faciliter le dialogue et les échanges entre les associations choisyennes et la municipalité pour une collaboration harmonieuse et constructive.', 'bridge', 1),
('Recueil des Besoins', 'Identifier et collecter les besoins exprimés par le tissu associatif pour mieux orienter les politiques publiques locales.', 'clipboard-list', 2),
('Espace de Concertation', 'Offrir un lieu d\'échange, de réflexion et de débat où les associations peuvent partager leurs expériences et s\'entraider mutuellement.', 'comments', 3),
('Force de Proposition', 'Formuler des propositions concrètes concernant les projets associatifs et les initiatives inter-associatives à développer sur le territoire.', 'lightbulb', 4),
('Promotion des Valeurs', 'Valoriser et promouvoir les valeurs associatives, le bénévolat et l\'engagement citoyen auprès de tous les habitants.', 'megaphone', 5),
('Représentation Associative', 'Représenter les associations choisyennes auprès de la municipalité et porter leurs voix dans les instances décisionnelles locales.', 'handshake', 6);

-- Données d'exemple pour les statistiques
INSERT INTO statistics (key_name, label, value, icon, display_order) VALUES
('associations_count', 'Associations', '200+', 'users', 1),
('domains_count', 'Domaines', '15', 'tags', 2),
('volunteers_count', 'Bénévoles', '5000+', 'hands-helping', 3),
('projects_supported', 'Projets Soutenus', '15', 'project-diagram', 4),
('associations_involved', 'Associations Impliquées', '45', 'users-gear', 5),
('beneficiaries', 'Bénéficiaires', '2.5K', 'user-group', 6),
('satisfaction_rate', 'Taux de Satisfaction', '85%', 'star', 7);

-- Ajout des colonnes Cloudinary pour le stockage des images
ALTER TABLE news ADD COLUMN cloudinary_public_id VARCHAR(255) NULL AFTER image;
ALTER TABLE members ADD COLUMN cloudinary_public_id VARCHAR(255) NULL AFTER avatar;
ALTER TABLE projects ADD COLUMN cloudinary_public_id VARCHAR(255) NULL AFTER image;
ALTER TABLE associations ADD COLUMN cloudinary_public_id VARCHAR(255) NULL AFTER logo;
ALTER TABLE page_content ADD COLUMN cloudinary_public_id VARCHAR(255) NULL AFTER content;

