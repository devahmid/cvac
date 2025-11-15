# Plan de Développement API CVAC

## 📋 Vue d'ensemble

Ce document décrit le plan de développement pour enrichir l'API du CVAC (Conseil de la Vie Associative et Citoyenne) de Choisy-le-Roi.

## 🎯 Objectifs

1. Compléter les endpoints manquants pour toutes les fonctionnalités du frontend
2. Améliorer les endpoints existants avec pagination, filtres et recherche
3. Ajouter la gestion des uploads (images, documents)
4. Structurer l'API de manière cohérente et maintenable

---

## 📊 État Actuel de l'API

### ✅ Endpoints Existants

1. **`members.php`** (GET)
   - Récupère tous les membres
   - Données de démo si base vide
   - ❌ Pas de pagination
   - ❌ Pas de GET par ID

2. **`news.php`** (GET)
   - Récupère les 20 dernières actualités
   - Données de démo si base vide
   - ❌ Pas de pagination
   - ❌ Pas de filtres (catégorie, date)
   - ❌ Pas de GET par ID

3. **`contact.php`** (POST)
   - Traite les messages de contact
   - Validation complète
   - ✅ Fonctionnel

### ❌ Endpoints Manquants

1. **`associations.php`** - Table existe mais pas d'endpoint
2. **`projects.php`** - Table n'existe pas, endpoint n'existe pas
3. **`resources.php`** - Table n'existe pas, endpoint n'existe pas

---

## 🚀 Plan de Développement

### Phase 1 : Compléter les Tables de Base de Données

#### 1.1 Mettre à jour `database.sql`
- ✅ Table `associations` (existe déjà)
- ➕ Table `projects` (à créer)
- ➕ Table `resources` (à créer)
- ➕ Table `project_associations` (table de liaison)

### Phase 2 : Créer les Endpoints Manquants

#### 2.1 `associations.php`
- **GET** `/api/associations.php` - Liste toutes les associations
  - Paramètres optionnels : `?domain=sport`, `?search=nom`
  - Pagination : `?page=1&limit=20`
- **GET** `/api/associations.php?id=X` - Détails d'une association
- **POST** `/api/associations.php` - Créer une association (admin)
- **PUT** `/api/associations.php?id=X` - Modifier une association (admin)
- **DELETE** `/api/associations.php?id=X` - Supprimer une association (admin)

#### 2.2 `projects.php`
- **GET** `/api/projects.php` - Liste tous les projets
  - Paramètres : `?status=en_cours`, `?year=2024`, `?page=1&limit=20`
- **GET** `/api/projects.php?id=X` - Détails d'un projet
- **POST** `/api/projects.php` - Créer un projet (admin)
- **PUT** `/api/projects.php?id=X` - Modifier un projet (admin)
- **DELETE** `/api/projects.php?id=X` - Supprimer un projet (admin)

#### 2.3 `resources.php`
- **GET** `/api/resources.php` - Liste toutes les ressources
  - Paramètres : `?category=officiels`, `?year=2024`, `?search=mots`
- **GET** `/api/resources.php?id=X` - Détails d'une ressource
- **GET** `/api/resources.php?id=X&download=1` - Télécharger le fichier
- **POST** `/api/resources.php` - Créer une ressource (admin + upload)
- **PUT** `/api/resources.php?id=X` - Modifier une ressource (admin)
- **DELETE** `/api/resources.php?id=X` - Supprimer une ressource (admin)

### Phase 3 : Améliorer les Endpoints Existants

#### 3.1 `news.php` - Améliorations
- ➕ Pagination : `?page=1&limit=20`
- ➕ Filtres : `?category=Événement`, `?year=2024`
- ➕ Recherche : `?search=mots-clés`
- ➕ GET par ID : `?id=X`
- ➕ Incrémenter les vues : `?id=X&increment_views=1`

#### 3.2 `members.php` - Améliorations
- ➕ GET par ID : `?id=X`
- ➕ Filtre par rôle : `?role=Président`
- ➕ Tri personnalisé : `?sort=name|role|association`

### Phase 4 : Système d'Upload

#### 4.1 Créer `upload.php`
- Upload d'images (news, associations, projects)
- Upload de documents PDF (resources)
- Validation des types MIME
- Redimensionnement d'images
- Stockage sécurisé

### Phase 5 : Authentification (Future)

#### 5.1 Système d'authentification
- Table `users` pour les administrateurs
- JWT ou sessions PHP
- Protection des endpoints POST/PUT/DELETE

---

## 📁 Structure des Tables

### Table `projects`
```sql
CREATE TABLE projects (
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
);
```

### Table `project_associations`
```sql
CREATE TABLE project_associations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    association_id INT NOT NULL,
    role VARCHAR(100),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE CASCADE
);
```

### Table `resources`
```sql
CREATE TABLE resources (
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
);
```

---

## 🔧 Améliorations Techniques

### 1. Structure de Réponse Standardisée
```json
{
    "success": true,
    "data": [...],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100,
        "total_pages": 5
    }
}
```

### 2. Gestion d'Erreurs
```json
{
    "success": false,
    "error": "Message d'erreur",
    "code": 400
}
```

### 3. Validation des Données
- Utiliser `sanitize()` pour tous les inputs
- Validation stricte des types
- Vérification des champs requis

### 4. Sécurité
- Protection CSRF (futur)
- Validation des uploads
- Limitation de taille des fichiers
- Sanitization des noms de fichiers

---

## 📝 Priorités

### 🔴 Priorité Haute (Phase 1)
1. Créer les tables manquantes dans `database.sql`
2. Créer `associations.php` (GET uniquement)
3. Créer `projects.php` (GET uniquement)
4. Créer `resources.php` (GET uniquement)

### 🟡 Priorité Moyenne (Phase 2)
1. Améliorer `news.php` avec pagination et filtres
2. Améliorer `members.php` avec GET par ID
3. Ajouter la pagination aux nouveaux endpoints

### 🟢 Priorité Basse (Phase 3)
1. Système d'upload
2. Endpoints POST/PUT/DELETE (nécessite auth)
3. Authentification et autorisation

---

## ✅ Checklist de Développement

- [ ] Mettre à jour `database.sql` avec les nouvelles tables
- [ ] Créer `associations.php` (GET)
- [ ] Créer `projects.php` (GET)
- [ ] Créer `resources.php` (GET)
- [ ] Améliorer `news.php` (pagination, filtres, GET par ID)
- [ ] Améliorer `members.php` (GET par ID, filtres)
- [ ] Créer `upload.php` pour les fichiers
- [ ] Tester tous les endpoints
- [ ] Documenter l'API

---

## 📚 Documentation API

Une fois le développement terminé, créer un fichier `API_DOCUMENTATION.md` avec :
- Liste de tous les endpoints
- Paramètres acceptés
- Exemples de requêtes/réponses
- Codes d'erreur

