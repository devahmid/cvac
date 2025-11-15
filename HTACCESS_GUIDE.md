# Guide de Configuration .htaccess pour CVAC

## 📁 Structure des Fichiers .htaccess

Trois fichiers `.htaccess` ont été créés pour gérer différents aspects :

### 1. `.htaccess` (Racine)
- Redirige les requêtes `/api/*` vers le dossier `api/`
- Redirige les autres requêtes vers le frontend

### 2. `frontend/.htaccess`
- **Routing Angular SPA** : Toutes les routes redirigent vers `index.html`
- **Compression GZIP** : Optimise les fichiers CSS/JS/HTML
- **Cache** : Configure le cache pour les assets statiques
- **Sécurité** : Headers de sécurité (XSS, clickjacking, etc.)
- **Performance** : Optimisations pour le chargement

### 3. `api/.htaccess`
- **CORS** : Headers pour les requêtes cross-origin
- **Sécurité** : Protection des fichiers sensibles
- **PHP** : Configuration PHP (upload, timeout, etc.)
- **Compression** : Compression des réponses JSON

---

## 🚀 Déploiement sur Hébergement Mutualisé

### Structure Recommandée

```
cvac-choisyleroi.fr/
├── .htaccess                    # ✅ Créé
├── api/
│   ├── .htaccess               # ✅ Créé
│   ├── *.php                   # Tous les endpoints
│   └── vendor/                 # SDK Cloudinary
└── frontend/
    ├── .htaccess               # ✅ Créé
    ├── index.html              # Point d'entrée Angular
    ├── main.*.js               # Bundle Angular
    ├── polyfills.*.js
    └── assets/                 # Images, fonts, etc.
```

### OU Structure Alternative (Frontend à la racine)

Si vous déployez le build Angular directement à la racine :

```
cvac-choisyleroi.fr/
├── .htaccess                    # Modifier pour pointer vers api/
├── index.html                   # Build Angular
├── main.*.js
├── assets/
└── api/
    ├── .htaccess
    └── *.php
```

Dans ce cas, le `.htaccess` racine devrait être :

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Rediriger les requêtes API vers le dossier api/
    RewriteCond %{REQUEST_URI} ^/api/(.*)$
    RewriteRule ^api/(.*)$ api/$1 [L]

    # Routing Angular SPA
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>
```

---

## ✅ Fonctionnalités Configurées

### Frontend (`frontend/.htaccess`)

✅ **Routing SPA** : Toutes les routes Angular fonctionnent
✅ **Compression GZIP** : Réduction de la taille des fichiers
✅ **Cache intelligent** : Cache long pour les assets, pas de cache pour index.html
✅ **Sécurité** : Headers de protection XSS, clickjacking, etc.
✅ **Performance** : Optimisations de chargement

### API (`api/.htaccess`)

✅ **CORS** : Autorise les requêtes depuis le frontend
✅ **Sécurité** : Protection des fichiers sensibles (config.php, .env, etc.)
✅ **PHP** : Configuration upload (10MB max)
✅ **Compression** : Compression des réponses JSON

---

## 🧪 Tests Post-Déploiement

### 1. Test Routing Angular

Visitez ces URLs et vérifiez qu'elles fonctionnent :
- `https://cvac-choisyleroi.fr/`
- `https://cvac-choisyleroi.fr/about`
- `https://cvac-choisyleroi.fr/members`
- `https://cvac-choisyleroi.fr/news`

Toutes doivent afficher la page Angular (pas d'erreur 404).

### 2. Test API

```bash
# Test depuis le navigateur ou curl
curl https://cvac-choisyleroi.fr/api/members.php
curl https://cvac-choisyleroi.fr/api/news.php
```

### 3. Test Compression

Vérifier dans les DevTools du navigateur (Network) :
- Les fichiers `.js` et `.css` doivent être compressés (gzip)
- La taille transférée doit être inférieure à la taille du fichier

### 4. Test Cache

Vérifier les headers HTTP :
- `index.html` : `Cache-Control: no-cache`
- `main.*.js` : `Cache-Control: public, max-age=31536000`

---

## 🔧 Personnalisation

### Modifier la taille max d'upload

Dans `api/.htaccess` :
```apache
php_value upload_max_filesize 20M
php_value post_max_size 20M
```

### Modifier la durée du cache

Dans `frontend/.htaccess` :
```apache
ExpiresByType text/css "access plus 6 months"
ExpiresByType application/javascript "access plus 6 months"
```

### Ajouter HTTPS uniquement

Ajouter dans `.htaccess` racine :
```apache
<IfModule mod_rewrite.c>
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## 🆘 Dépannage

### Erreur 500 Internal Server Error

1. Vérifier les logs d'erreur PHP
2. Vérifier la syntaxe du `.htaccess`
3. Vérifier que `mod_rewrite` est activé sur le serveur

### Routing Angular ne fonctionne pas

1. Vérifier que `mod_rewrite` est activé
2. Vérifier que le `.htaccess` est bien dans le bon dossier
3. Vérifier les permissions du fichier (644)

### API retourne 404

1. Vérifier que le dossier `api/` existe
2. Vérifier le `.htaccess` dans `api/`
3. Vérifier les permissions des fichiers PHP (644)

### CORS bloque les requêtes

1. Vérifier les headers dans `api/.htaccess`
2. Vérifier que `mod_headers` est activé
3. Vérifier les headers dans `config.php`

---

## 📝 Notes Importantes

⚠️ **Sécurité** :
- Ne jamais commiter les fichiers avec des mots de passe
- Vérifier que les fichiers sensibles sont bien protégés
- Utiliser HTTPS en production

⚠️ **Performance** :
- La compression GZIP réduit significativement la taille des fichiers
- Le cache améliore les temps de chargement
- Tester sur différents navigateurs

⚠️ **Hébergement Mutualisé** :
- Certains hébergeurs limitent les options `.htaccess`
- Vérifier avec votre hébergeur les modules disponibles
- Tester avant le déploiement en production

---

## ✅ Checklist de Déploiement

- [ ] Fichiers `.htaccess` uploadés sur le serveur
- [ ] Permissions correctes (644 pour `.htaccess`)
- [ ] `mod_rewrite` activé sur le serveur
- [ ] `mod_headers` activé sur le serveur
- [ ] Routing Angular testé
- [ ] API testée
- [ ] Compression vérifiée
- [ ] Cache vérifié
- [ ] HTTPS configuré (recommandé)

