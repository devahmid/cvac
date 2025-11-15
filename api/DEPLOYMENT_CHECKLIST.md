# ✅ Checklist de Déploiement CVAC

## 📋 Informations de Production

- **Site web**: cvac-choisyleroi.fr
- **Base de données**: u281164575_cvac
- **Utilisateur MySQL**: u281164575_admin
- **CDN Images**: Cloudinary (dxzvuvlye)

---

## 🔧 Configuration Base de Données

### 1. Ajouter le mot de passe MySQL

Éditer `api/config.php` et remplir :
```php
define('DB_PASS', 'votre_mot_de_passe_mysql');
```

### 2. Créer les tables

Via phpMyAdmin :
1. Connectez-vous à phpMyAdmin
2. Sélectionnez la base `u281164575_cvac`
3. Onglet "SQL"
4. Copiez-collez le contenu de `database.sql`
5. Exécutez

### 3. Vérifier la connexion

```bash
php api/test_db.php
```

---

## 📤 Configuration Cloudinary

✅ **Déjà configuré** avec vos credentials :
- Cloud Name: `dxzvuvlye`
- API Key: `554544883388485`
- API Secret: `7goZ7gfaUYB2buWATmDppyG8Hvw`

---

## 📁 Structure des Fichiers sur le Serveur

```
cvac-choisyleroi.fr/
├── api/
│   ├── config.php              # ⚠️ Ajouter le mot de passe MySQL
│   ├── cloudinary_config.php   # ✅ Configuré
│   ├── upload.php              # ✅ Prêt
│   ├── *.php                   # Tous les endpoints
│   └── vendor/                 # SDK Cloudinary (composer install)
├── frontend/
│   └── dist/                   # Build Angular (ng build)
└── uploads/                    # Dossier pour uploads locaux (si nécessaire)
    └── documents/              # Documents PDF
```

---

## 🚀 Déploiement Frontend Angular

### Build de production

```bash
cd frontend
ng build --configuration production
```

Les fichiers seront dans `frontend/dist/`

### Configuration du serveur web

Assurez-vous que :
- Les routes Angular sont redirigées vers `index.html`
- Les requêtes `/api/*` sont proxyfiées vers le dossier `api/`
- Les headers CORS sont configurés

---

## ✅ Checklist Complète

### Base de Données
- [ ] Mot de passe MySQL ajouté dans `config.php`
- [ ] Tables créées via `database.sql`
- [ ] Test de connexion réussi (`test_db.php`)

### API
- [ ] Tous les fichiers PHP uploadés
- [ ] SDK Cloudinary installé (`composer install` dans `api/`)
- [ ] Permissions des fichiers correctes (644)
- [ ] Test des endpoints API

### Cloudinary
- [ ] Configuration testée (`test_cloudinary.php`)
- [ ] Upload fonctionnel (`upload.php`)

### Frontend
- [ ] Build de production créé
- [ ] Fichiers déployés sur le serveur
- [ ] Routes Angular configurées
- [ ] API accessible depuis le frontend

### Sécurité
- [ ] Mot de passe MySQL sécurisé
- [ ] Fichiers `.env` non committés
- [ ] Permissions de fichiers correctes
- [ ] HTTPS activé (recommandé)

---

## 🧪 Tests Post-Déploiement

### 1. Test API

```bash
# Test membres
curl https://cvac-choisyleroi.fr/api/members.php

# Test actualités
curl https://cvac-choisyleroi.fr/api/news.php

# Test associations
curl https://cvac-choisyleroi.fr/api/associations.php
```

### 2. Test Upload

```bash
curl -X POST https://cvac-choisyleroi.fr/api/upload.php \
  -F "image=@test.jpg" \
  -F "type=news"
```

### 3. Test Frontend

- Vérifier que toutes les pages se chargent
- Vérifier que les images s'affichent
- Vérifier que les formulaires fonctionnent

---

## 🆘 Dépannage

### Erreur "Access denied" MySQL
- Vérifier le mot de passe dans `config.php`
- Vérifier les permissions de l'utilisateur MySQL

### Erreur "Table doesn't exist"
- Exécuter `database.sql` dans phpMyAdmin

### Images ne s'affichent pas
- Vérifier la configuration Cloudinary
- Vérifier que les URLs Cloudinary sont correctes

### API ne répond pas
- Vérifier les permissions des fichiers PHP
- Vérifier les logs d'erreur PHP
- Vérifier la configuration CORS

---

## 📞 Support

En cas de problème :
1. Vérifier les logs d'erreur PHP
2. Tester avec `test_db.php` et `test_cloudinary.php`
3. Vérifier la configuration dans `config.php`

---

## 📚 Documentation

- Configuration BDD : `DATABASE_SETUP.md`
- Configuration Cloudinary : `CDN_SETUP.md`
- Guide API : `API_COMPLETE_SUMMARY.md`

