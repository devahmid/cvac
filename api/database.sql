-- Script SQL pour créer la base de données CVAC
-- À exécuter sur votre hébergement mutualisé via phpMyAdmin ou ligne de commande

CREATE DATABASE IF NOT EXISTS cvac_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cvac_db;

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

-- Insertion de données d'exemple (optionnel)
INSERT INTO members (name, role, association, email, description, role_order) VALUES
('Jean-Michel Dupont', 'Président', 'Association Culturelle de Choisy', 'j.dupont@cvac-choisy.fr', 'Fort de 15 ans d\'engagement associatif, Jean-Michel pilote le CVAC depuis sa création.', 1),
('Sophie Martinez', 'Vice-Présidente', 'Solidarité et Entraide Choisyenne', 's.martinez@cvac-choisy.fr', 'Engagée dans le secteur social depuis 20 ans, Sophie apporte son expertise en matière de solidarité.', 2);

INSERT INTO news (title, content, excerpt, category, date) VALUES
('Réunion plénière du CVAC', 'Retour sur notre dernière assemblée générale et les projets votés pour 2025.', 'Retour sur notre dernière assemblée générale...', 'Réunion plénière', '2024-11-15'),
('Festival Inter-Associatif', 'Un événement réussi qui a rassemblé plus de 20 associations choisyennes.', 'Un événement réussi qui a rassemblé...', 'Événement', '2024-11-08');

