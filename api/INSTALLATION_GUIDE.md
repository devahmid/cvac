# Guide d'Installation - API CVAC

## 📋 Prérequis

- PHP 7.4 ou supérieur
- MySQL/MariaDB
- Composer (pour les dépendances Cloudinary)
- Accès à la base de données

---

## 🚀 Installation

### Étape 1 : Exécuter les scripts SQL

1. Connectez-vous à votre base de données (phpMyAdmin ou ligne de commande)
2. Exécutez le script `add_users_and_associations_fields.sql` :

```sql
-- Ce script crée :
-- 1. La table `users` pour l'authentification
-- 2. Ajoute les champs manquants à la table `associations`
```

**Important :** Vérifiez que la table `associations` existe déjà avant d'exécuter ce script.

### Étape 2 : Vérifier la configuration

Vérifiez le fichier `config.php` :
- ✅ Les identifiants de base de données sont corrects
- ✅ Les headers CORS sont configurés
- ✅ La connexion à la base de données fonctionne

### Étape 3 : Tester l'API

#### Test d'authentification

**Inscription :**
```bash
curl -X POST https://votre-domaine.fr/api/auth.php?action=signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "MotDePasse123!",
    "firstname": "Jean",
    "lastname": "Dupont",
    "associationId": null
  }'
```

**Connexion :**
```bash
curl -X POST https://votre-domaine.fr/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "MotDePasse123!"
  }'
```

#### Test des associations

**Créer une association :**
```bash
curl -X POST https://votre-domaine.fr/api/associations.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Association",
    "description": "Description de mon association",
    "email": "contact@association.fr",
    "city": "Choisy-le-Roi",
    "category": "Culture",
    "isPublic": true
  }'
```

**Récupérer les associations publiques :**
```bash
curl https://votre-domaine.fr/api/associations.php?public=true
```

---

## 📁 Fichiers Créés/Modifiés

### Nouveaux fichiers :
- ✅ `auth.php` - Système d'authentification complet
- ✅ `add_users_and_associations_fields.sql` - Script SQL pour les tables
- ✅ `MISSING_FEATURES.md` - Documentation des fonctionnalités
- ✅ `INSTALLATION_GUIDE.md` - Ce guide

### Fichiers modifiés :
- ✅ `associations.php` - Ajout des méthodes POST/PUT et nouveaux filtres

---

## 🔧 Configuration

### Variables d'environnement

Le fichier `config.php` contient les configurations de base de données. Pour la production, vous pouvez créer un fichier `config.production.php` avec vos identifiants.

### Sécurité

**Important :**
- Les mots de passe sont hashés avec `PASSWORD_BCRYPT`
- Les tokens expirent après 30 jours
- Tous les inputs sont sanitizés avec `sanitize()`

**Recommandations :**
- Utilisez HTTPS en production
- Protégez les endpoints POST/PUT avec authentification (à implémenter)
- Ajoutez un rate limiting pour éviter les abus

---

## 🧪 Tests

### Tester la connexion à la base de données

```bash
php test_db.php
```

### Tester l'upload d'images

```bash
php test_upload.php
```

---

## 📝 Notes Importantes

1. **Compatibilité** : Le champ `domain` dans la table `associations` est conservé pour compatibilité, mais `category` est maintenant utilisé en priorité.

2. **Tokens** : Les tokens sont stockés en base de données avec une date d'expiration. Pour une sécurité accrue, considérez l'utilisation de JWT.

3. **Associations publiques** : Par défaut, toutes les nouvelles associations sont publiques (`is_public = TRUE`).

4. **Relations** : Les utilisateurs peuvent être créés sans association (`association_id = NULL`).

---

## 🐛 Dépannage

### Erreur : "Table users doesn't exist"
→ Exécutez le script SQL `add_users_and_associations_fields.sql`

### Erreur : "Column category doesn't exist"
→ Exécutez le script SQL `add_users_and_associations_fields.sql`

### Erreur : "Token invalide"
→ Vérifiez que le token n'a pas expiré (30 jours par défaut)
→ Vérifiez que le header `Authorization: Bearer {token}` est correctement envoyé

### Erreur de connexion à la base de données
→ Vérifiez les identifiants dans `config.php`
→ Vérifiez que la base de données existe
→ Vérifiez les permissions de l'utilisateur MySQL

---

## 📞 Support

Pour toute question, consultez :
- `MISSING_FEATURES.md` - Liste des fonctionnalités
- `API_SUMMARY.md` - Documentation de l'API
- `DEVELOPMENT_PLAN.md` - Plan de développement

---

## ✅ Checklist d'Installation

- [ ] Script SQL exécuté (`add_users_and_associations_fields.sql`)
- [ ] Table `users` créée
- [ ] Champs ajoutés à la table `associations`
- [ ] `config.php` configuré avec les bons identifiants
- [ ] Test d'inscription réussi
- [ ] Test de connexion réussi
- [ ] Test de création d'association réussi
- [ ] Test de récupération des associations publiques réussi

Une fois tous ces points cochés, l'API est prête à être utilisée par le frontend Angular ! 🎉

