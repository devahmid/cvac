# 🚀 Guide de Déploiement CVAC - cvac-choisyleroi.fr

## 📋 Informations de Production

- **Site web**: cvac-choisyleroi.fr
- **Base de données**: u281164575_cvac
- **Utilisateur MySQL**: u281164575_admin
- **CDN Images**: Cloudinary (dxzvuvlye)

---

## ✅ Prérequis

- [x] Base de données créée
- [x] Mot de passe MySQL configuré dans `api/config.php`
- [x] Cloudinary configuré
- [x] Fichiers `.htaccess` créés

---

## 📦 Étape 1 : Préparer le Build Frontend

```bash
cd frontend
ng build --configuration production
```

Les fichiers seront générés dans `frontend/dist/cvac/` (ou `frontend/dist/` selon votre configuration Angular).

---

## 📤 Étape 2 : Uploader les Fichiers

### Structure sur le Serveur

```
cvac-choisyleroi.fr/
├── .htaccess                    # ✅ Uploader
├── api/
│   ├── .htaccess               # ✅ Uploader
│   ├── config.php              # ✅ Avec mot de passe MySQL
│   ├── cloudinary_config.php   # ✅ Déjà configuré
│   ├── *.php                   # ✅ Tous les endpoints
│   └── vendor/                 # ✅ Après composer install
└── frontend/ (ou racine)
    ├── .htaccess               # ✅ Uploader
    ├── index.html              # ✅ Build Angular
    ├── main.*.js               # ✅ Build Angular
    ├── polyfills.*.js          # ✅ Build Angular
    └── assets/                 # ✅ Build Angular
```

### Commandes FTP/SFTP

```bash
# Uploader tous les fichiers
# Via FTP client ou commande scp
```

---

## 🗄️ Étape 3 : Configurer la Base de Données

### Via phpMyAdmin

1. Connectez-vous à phpMyAdmin
2. Sélectionnez la base `u281164575_cvac`
3. Onglet "SQL"
4. Copiez-collez le contenu de `api/database.sql`
5. Exécutez

### Vérifier

```bash
# Tester la connexion (si vous avez accès SSH)
php api/test_db.php
```

---

## 📚 Étape 4 : Installer les Dépendances PHP

### Via SSH (si disponible)

```bash
cd api
composer install --no-dev --optimize-autoloader
```

### Via FTP

Si pas d'accès SSH, téléchargez le dossier `vendor/` depuis votre machine locale après avoir exécuté `composer install`.

---

## 🔧 Étape 5 : Configurer les Permissions

### Permissions des Fichiers

```bash
# Fichiers PHP
chmod 644 api/*.php

# Fichiers .htaccess
chmod 644 .htaccess
chmod 644 frontend/.htaccess
chmod 644 api/.htaccess

# Dossier uploads (si vous créez un dossier pour uploads locaux)
chmod 755 uploads/
chmod 755 uploads/documents/
```

---

## 🧪 Étape 6 : Tests Post-Déploiement

### 1. Test Frontend

Visitez : `https://cvac-choisyleroi.fr/`

Vérifiez :
- ✅ La page d'accueil se charge
- ✅ Le routing fonctionne (essayer `/about`, `/members`, etc.)
- ✅ Les images s'affichent
- ✅ Les styles sont appliqués

### 2. Test API

```bash
# Test membres
curl https://cvac-choisyleroi.fr/api/members.php

# Test actualités
curl https://cvac-choisyleroi.fr/api/news.php

# Test associations
curl https://cvac-choisyleroi.fr/api/associations.php
```

### 3. Test Upload Cloudinary

```bash
curl -X POST https://cvac-choisyleroi.fr/api/upload.php \
  -F "image=@test.jpg" \
  -F "type=news"
```

---

## 🔐 Étape 7 : Sécurité

### Vérifications

- [ ] Le fichier `api/config.php` n'est pas accessible publiquement
- [ ] Le fichier `.env` n'existe pas ou est protégé
- [ ] HTTPS est activé (recommandé)
- [ ] Les permissions des fichiers sont correctes

### Protection des Fichiers Sensibles

Les fichiers `.htaccess` protègent déjà :
- `config.php`
- `cloudinary_config.php`
- `.env`
- `composer.json/lock`

---

## 📝 Checklist Complète

### Avant Déploiement
- [x] Build Angular créé (`ng build`)
- [x] Mot de passe MySQL dans `config.php`
- [x] Cloudinary configuré
- [x] Fichiers `.htaccess` créés

### Déploiement
- [ ] Fichiers uploadés sur le serveur
- [ ] Base de données créée (`database.sql`)
- [ ] Dépendances PHP installées (`composer install`)
- [ ] Permissions configurées

### Tests
- [ ] Frontend accessible
- [ ] Routing Angular fonctionne
- [ ] API répond correctement
- [ ] Upload Cloudinary fonctionne
- [ ] Images s'affichent

### Sécurité
- [ ] HTTPS activé
- [ ] Fichiers sensibles protégés
- [ ] Permissions correctes

---

## 🆘 Dépannage

### Erreur 500

1. Vérifier les logs d'erreur PHP
2. Vérifier la syntaxe des fichiers `.htaccess`
3. Vérifier que `mod_rewrite` est activé

### Routing Angular ne fonctionne pas

1. Vérifier `frontend/.htaccess`
2. Vérifier que `mod_rewrite` est activé
3. Vérifier les permissions (644)

### API retourne 404

1. Vérifier `api/.htaccess`
2. Vérifier que les fichiers PHP sont bien uploadés
3. Vérifier les permissions (644)

### Erreur de connexion MySQL

1. Vérifier le mot de passe dans `config.php`
2. Vérifier que la base existe
3. Tester avec `test_db.php`

---

## 📞 Support

En cas de problème :
1. Vérifier les logs d'erreur PHP
2. Tester avec les scripts de test (`test_db.php`, `test_cloudinary.php`)
3. Vérifier la configuration dans `config.php`

---

## 🎉 Une fois Déployé

Votre site sera accessible à :
- **Frontend**: https://cvac-choisyleroi.fr
- **API**: https://cvac-choisyleroi.fr/api/

Tout est prêt pour la production ! 🚀
