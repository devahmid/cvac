# Résumé de l'API CVAC - État Actuel

## 📊 Vue d'ensemble

L'API CVAC a été enrichie avec de nouveaux endpoints et améliorations. Voici un résumé complet de ce qui est disponible.

---

## ✅ Endpoints Disponibles

### 1. **Membres** - `members.php`

**GET** `/api/members.php`
- Récupère tous les membres avec pagination
- **Paramètres optionnels :**
  - `?id=X` - Récupère un membre spécifique
  - `?role=Président` - Filtre par rôle
  - `?sort=name|role|association|role_order` - Tri personnalisé
  - `?page=1` - Numéro de page (défaut: 1)
  - `?limit=50` - Nombre d'éléments par page (défaut: 50, max: 100)

**Exemple :**
```
GET /api/members.php?role=Président&sort=name
GET /api/members.php?id=1
```

**Réponse :**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 10,
    "total_pages": 1
  }
}
```

---

### 2. **Actualités** - `news.php`

**GET** `/api/news.php`
- Récupère les actualités avec pagination et filtres
- **Paramètres optionnels :**
  - `?id=X` - Récupère une actualité spécifique
  - `?category=Événement` - Filtre par catégorie
  - `?year=2024` - Filtre par année
  - `?search=mots-clés` - Recherche dans titre/contenu
  - `?increment_views=1` - Incrémente le compteur de vues (avec id)
  - `?page=1` - Numéro de page (défaut: 1)
  - `?limit=20` - Nombre d'éléments par page (défaut: 20, max: 100)

**Exemple :**
```
GET /api/news.php?category=Événement&year=2024
GET /api/news.php?id=1&increment_views=1
GET /api/news.php?search=festival
```

**Réponse :**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "total_pages": 1
  }
}
```

---

### 3. **Associations** - `associations.php` ⭐ NOUVEAU

**GET** `/api/associations.php`
- Récupère toutes les associations avec pagination
- **Paramètres optionnels :**
  - `?id=X` - Récupère une association spécifique
  - `?domain=Sport` - Filtre par domaine d'activité
  - `?search=nom` - Recherche dans nom/description
  - `?page=1` - Numéro de page (défaut: 1)
  - `?limit=20` - Nombre d'éléments par page (défaut: 20, max: 100)

**Exemple :**
```
GET /api/associations.php?domain=Sport
GET /api/associations.php?id=1
GET /api/associations.php?search=théâtre
```

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Club Sportif Choisyen",
      "description": "...",
      "domain": "Sport",
      "website": "...",
      "email": "...",
      "phone": "...",
      "address": "...",
      "logo": "..."
    }
  ],
  "pagination": {...}
}
```

---

### 4. **Projets Inter-Associatifs** - `projects.php` ⭐ NOUVEAU

**GET** `/api/projects.php`
- Récupère tous les projets avec pagination
- **Paramètres optionnels :**
  - `?id=X` - Récupère un projet spécifique (avec associations liées)
  - `?status=en_cours` - Filtre par statut (planifié, en_cours, terminé, annulé)
  - `?year=2024` - Filtre par année
  - `?page=1` - Numéro de page (défaut: 1)
  - `?limit=20` - Nombre d'éléments par page (défaut: 20, max: 100)

**Exemple :**
```
GET /api/projects.php?status=en_cours
GET /api/projects.php?id=1
GET /api/projects.php?year=2024
```

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Festival Culturel Inter-Générationnel",
      "description": "...",
      "content": "...",
      "image": "...",
      "status": "terminé",
      "start_date": "2024-10-01",
      "end_date": "2024-10-15",
      "location": "Parc Municipal",
      "budget": null,
      "public_target": "Tous âges",
      "participants_count": 800,
      "associations": [
        {
          "id": 2,
          "name": "Théâtre en Mouvement",
          "domain": "Culture",
          "project_role": "Organisateur"
        }
      ]
    }
  ],
  "pagination": {...}
}
```

---

### 5. **Ressources & Documents** - `resources.php` ⭐ NOUVEAU

**GET** `/api/resources.php`
- Récupère toutes les ressources avec pagination
- **Paramètres optionnels :**
  - `?id=X` - Récupère une ressource spécifique
  - `?id=X&download=1` - Télécharge le fichier PDF
  - `?category=officiels` - Filtre par catégorie (officiels, comptes_rendus, bilans, guides, autres)
  - `?year=2024` - Filtre par année
  - `?search=mots-clés` - Recherche dans titre/description
  - `?page=1` - Numéro de page (défaut: 1)
  - `?limit=20` - Nombre d'éléments par page (défaut: 20, max: 100)

**Exemple :**
```
GET /api/resources.php?category=officiels
GET /api/resources.php?id=1
GET /api/resources.php?id=1&download=1  # Télécharge le PDF
GET /api/resources.php?year=2024&category=comptes_rendus
```

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Règlement de fonctionnement",
      "description": "...",
      "file_path": "/uploads/documents/reglement-2024.pdf",
      "file_size": 870400,
      "file_type": "application/pdf",
      "category": "officiels",
      "year": 2024,
      "download_count": 45
    }
  ],
  "pagination": {...}
}
```

---

### 6. **Contact** - `contact.php`

**POST** `/api/contact.php`
- Envoie un message de contact
- **Body (JSON) :**
```json
{
  "firstname": "Jean",
  "lastname": "Dupont",
  "email": "jean@example.com",
  "association": "Association X",
  "subject": "Demande d'information",
  "message": "Message...",
  "consent": true
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Message envoyé avec succès"
}
```

---

## 🗄️ Structure de la Base de Données

### Tables Créées/Modifiées

1. **`members`** - Membres du CVAC
2. **`news`** - Actualités et événements
3. **`contact_messages`** - Messages de contact
4. **`associations`** - Associations locales
5. **`projects`** ⭐ NOUVELLE - Projets inter-associatifs
6. **`project_associations`** ⭐ NOUVELLE - Table de liaison projets-associations
7. **`resources`** ⭐ NOUVELLE - Ressources et documents

---

## 🔧 Améliorations Apportées

### ✅ Complété
- [x] Création de `associations.php` avec pagination et filtres
- [x] Création de `projects.php` avec pagination et filtres
- [x] Création de `resources.php` avec pagination, filtres et téléchargement
- [x] Amélioration de `news.php` avec pagination, filtres et GET par ID
- [x] Amélioration de `members.php` avec GET par ID et filtres
- [x] Ajout des tables manquantes dans `database.sql`
- [x] Structure de réponse standardisée avec pagination

### 🔄 À Faire (Futur)
- [ ] Système d'upload de fichiers (images, documents)
- [ ] Endpoints POST/PUT/DELETE pour la gestion complète (nécessite authentification)
- [ ] Système d'authentification et autorisation
- [ ] Documentation API complète avec exemples

---

## 📝 Notes Importantes

1. **Données de Démo** : Tous les endpoints retournent des données de démo si la base de données est vide
2. **Pagination** : Tous les endpoints de liste supportent la pagination
3. **Filtres** : La plupart des endpoints supportent des filtres multiples
4. **Sécurité** : Tous les inputs sont sanitizés avec la fonction `sanitize()`
5. **CORS** : Les headers CORS sont configurés dans `config.php`

---

## 🚀 Prochaines Étapes Recommandées

1. **Tester tous les endpoints** avec des requêtes réelles
2. **Créer le système d'upload** pour les images et documents
3. **Implémenter l'authentification** pour les opérations POST/PUT/DELETE
4. **Créer une documentation API interactive** (Swagger/OpenAPI)
5. **Ajouter des tests unitaires** pour chaque endpoint

---

## 📞 Support

Pour toute question ou problème, consultez le fichier `DEVELOPMENT_PLAN.md` pour le plan de développement complet.

