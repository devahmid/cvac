# Fonctionnalités Manquantes - API CVAC

## 📋 Résumé

Ce document liste les fonctionnalités manquantes nécessaires pour le fonctionnement complet du frontend Angular.

---

## 🔴 CRITIQUE - À Créer Immédiatement

### 1. **Système d'Authentification** - `auth.php` ✅ CRÉÉ

**Endpoints nécessaires :**
- `POST /api/auth.php?action=signup` - Inscription d'un utilisateur
- `POST /api/auth.php?action=login` - Connexion
- `GET /api/auth.php?action=check&token=XXX` - Vérification du token
- `PUT /api/auth.php?action=updateAssociation` - Mise à jour de l'association de l'utilisateur

**Table nécessaire :**
- `users` - Table pour stocker les utilisateurs

**Champs utilisateur nécessaires :**
- id, email, password (hashé), firstname, lastname, associationId, role, created_at, updated_at

---

### 2. **Table `users`** ✅ SQL CRÉÉ (à exécuter)

**Structure nécessaire :**
```sql
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
    FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3. **Table `associations` - Champs manquants** ✅ SQL CRÉÉ (à exécuter)

**Champs manquants à ajouter :**
- `category` VARCHAR(100) - Catégorie (Culture, Sport, Social, etc.)
- `city` VARCHAR(100) - Ville (déjà utilisé dans le frontend)
- `postal_code` VARCHAR(10) - Code postal
- `cover_image` VARCHAR(500) - Image de couverture
- `activities` TEXT - Activités principales
- `president` VARCHAR(255) - Nom du président
- `founding_year` INT - Année de création
- `number_of_members` INT - Nombre de membres
- `is_public` BOOLEAN DEFAULT TRUE - Visibilité dans l'annuaire public

**Note :** Le champ `domain` existe déjà mais devrait être renommé en `category` pour correspondre au frontend.

---

### 4. **associations.php - Méthodes POST/PUT** ✅ COMPLÉTÉ

**Méthodes manquantes :**
- `POST /api/associations.php` - Créer une nouvelle association
- `PUT /api/associations.php?id=X` - Mettre à jour une association
- `GET /api/associations.php?public=true` - Filtrer les associations publiques
- `GET /api/associations.php?category=X` - Filtrer par catégorie

**Fonctionnalités actuelles :**
- ✅ GET avec pagination
- ✅ GET par ID
- ✅ Recherche par nom/description
- ✅ Filtre par domain (à renommer en category)

---

## 🟡 IMPORTANT - À Améliorer

### 5. **Gestion des tokens JWT** ⚠️ À IMPLÉMENTER

**Nécessaire pour :**
- Authentification sécurisée
- Protection des endpoints POST/PUT/DELETE
- Gestion des sessions utilisateur

**Options :**
- Utiliser JWT (JSON Web Tokens)
- Ou tokens simples stockés en base de données

---

### 6. **Validation et Sécurité** ⚠️ À RENFORCER

**À ajouter :**
- Validation stricte des données d'entrée
- Protection CSRF (pour les formulaires)
- Rate limiting (limitation des requêtes)
- Validation des emails uniques
- Hashage sécurisé des mots de passe (password_hash avec PASSWORD_BCRYPT)

---

## ✅ Ce qui existe déjà

- ✅ `associations.php` - GET avec pagination et filtres
- ✅ `news.php` - Gestion complète des actualités
- ✅ `members.php` - Gestion des membres
- ✅ `projects.php` - Gestion des projets
- ✅ `resources.php` - Gestion des ressources
- ✅ `contact.php` - Envoi de messages
- ✅ `upload.php` - Upload d'images via Cloudinary
- ✅ `config.php` - Configuration de base de données
- ✅ Table `associations` (structure de base)

---

## 🚀 Plan d'Action Recommandé

### Phase 1 - Urgent (Fonctionnalités critiques)
1. ✅ **CRÉÉ** - Script SQL pour créer la table `users` (`add_users_and_associations_fields.sql`)
2. ✅ **CRÉÉ** - `auth.php` avec signup/login/check/updateAssociation
3. ✅ **CRÉÉ** - Script SQL pour ajouter les champs manquants à `associations` (`add_users_and_associations_fields.sql`)
4. ✅ **CRÉÉ** - POST/PUT ajoutés à `associations.php` avec tous les filtres nécessaires

### Phase 2 - Important (Améliorations)
1. ✅ **IMPLÉMENTÉ** - Gestion des tokens (tokens simples stockés en BDD avec expiration)
2. ✅ **IMPLÉMENTÉ** - Validation stricte des données (sanitize, validation des champs requis)
3. ⚠️ **PARTIEL** - Protection des endpoints (auth.php protégé, associations.php POST/PUT non protégés pour l'instant)

### Phase 3 - Optionnel (Optimisations)
1. ✅ Rate limiting
2. ✅ Logging des actions
3. ✅ Documentation API complète

---

## 📝 Notes Techniques

### Format de réponse attendu par le frontend

**Succès :**
```json
{
  "success": true,
  "data": {...},
  "message": "Opération réussie"
}
```

**Erreur :**
```json
{
  "success": false,
  "error": "Message d'erreur",
  "message": "Message d'erreur" // Pour compatibilité
}
```

### Authentification

Le frontend envoie le token dans le header :
```
Authorization: Bearer {token}
```

L'API doit vérifier ce token pour les endpoints protégés.

---

## 🔗 Références

- Frontend Angular : `/frontend/src/app/services/auth.service.ts`
- Frontend Angular : `/frontend/src/app/services/association.service.ts`
- Interface Association : `/frontend/src/app/services/association.service.ts` (ligne 5-25)

