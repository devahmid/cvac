# Guide de Déploiement - CVAC

## Préparation avant déploiement

### 1. Compiler l'application Angular

```bash
# Installer les dépendances si ce n'est pas déjà fait
npm install

# Compiler pour la production
npm run build:prod
```

Cette commande génère les fichiers dans le dossier `dist/`.

### 2. Préparer les fichiers pour l'upload

Vous devez uploader sur votre hébergement mutualisé :

#### Structure sur le serveur :

```
public_html/ (ou www/)
│
├── index.html                    ← Depuis dist/index.html
├── *.js                          ← Tous les fichiers .js depuis dist/
├── *.css                         ← Tous les fichiers .css depuis dist/
├── favicon.ico                   ← Depuis dist/favicon.ico
│
├── api/                          ← Dossier complet depuis api/
│   ├── config.php
│   ├── members.php
│   ├── news.php
│   ├── contact.php
│   └── database.sql              ← Pour import initial uniquement
│
└── .htaccess                     ← Depuis la racine du projet
```

## Étapes de déploiement

### Étape 1 : Créer la base de données

1. Connectez-vous à votre panneau d'hébergement (cPanel, Plesk, etc.)
2. Ouvrez phpMyAdmin
3. Créez une nouvelle base de données (ex: `cvac_db`)
4. Créez un utilisateur MySQL et accordez-lui tous les droits sur cette base
5. Importez le fichier `api/database.sql` dans cette base

### Étape 2 : Configurer l'API PHP

1. Éditez le fichier `api/config.php` sur le serveur
2. Modifiez les constantes de connexion :
   ```php
   define('DB_HOST', 'localhost');  // Ou l'adresse fournie par votre hébergeur
   define('DB_NAME', 'cvac_db');    // Le nom de votre base
   define('DB_USER', 'votre_user');  // Votre utilisateur MySQL
   define('DB_PASS', 'votre_pass');  // Votre mot de passe MySQL
   ```

### Étape 3 : Uploader les fichiers

#### Option A : Via FTP/SFTP

1. Connectez-vous à votre serveur via FileZilla ou un autre client FTP
2. Naviguez vers `public_html/` (ou `www/`)
3. Uploader tous les fichiers depuis `dist/` vers la racine
4. Uploader le dossier `api/` complet
5. Uploader le fichier `.htaccess`

#### Option B : Via cPanel File Manager

1. Connectez-vous à cPanel
2. Ouvrez le File Manager
3. Naviguez vers `public_html/`
4. Uploader les fichiers un par un ou en archive ZIP (puis extraire)

### Étape 4 : Vérifier les permissions

- Le fichier `.htaccess` doit être présent à la racine
- Les fichiers PHP doivent avoir les permissions 644
- Les dossiers doivent avoir les permissions 755

### Étape 5 : Tester l'application

1. Visitez votre domaine : `https://votre-domaine.com`
2. Vérifiez que la page d'accueil s'affiche correctement
3. Testez la navigation entre les pages
4. Testez le formulaire de contact : `https://votre-domaine.com/contact`
5. Vérifiez les APIs :
   - `https://votre-domaine.com/api/members.php`
   - `https://votre-domaine.com/api/news.php`

## Résolution des problèmes courants

### Problème : Erreur 404 sur les routes Angular

**Solution** : Vérifiez que le fichier `.htaccess` est bien présent et que mod_rewrite est activé sur votre serveur.

### Problème : Les APIs ne fonctionnent pas

**Solutions** :
- Vérifiez les identifiants de base de données dans `api/config.php`
- Vérifiez que PHP est activé sur votre hébergement
- Vérifiez les logs d'erreur PHP dans cPanel

### Problème : Erreur CORS

**Solution** : Les headers CORS sont déjà configurés dans `api/config.php`. Si le problème persiste, contactez votre hébergeur.

### Problème : Les images ne s'affichent pas

**Solution** : Vérifiez que les URLs des images dans les templates sont accessibles. Les images utilisent des URLs externes (Google Cloud Storage) qui devraient fonctionner.

## Mise à jour de l'application

Pour mettre à jour l'application :

1. Faites vos modifications dans le code source
2. Recompilez : `npm run build:prod`
3. Uploader uniquement les fichiers modifiés depuis `dist/`
4. Si vous avez modifié les APIs PHP, uploader les fichiers PHP modifiés

## Sécurité

- Ne laissez jamais le fichier `api/config.php` avec des identifiants par défaut
- Changez les mots de passe de la base de données régulièrement
- Gardez une sauvegarde régulière de la base de données
- Ne partagez jamais les identifiants de la base de données

## Support

En cas de problème, vérifiez :
1. Les logs d'erreur PHP dans votre panneau d'hébergement
2. La console du navigateur (F12) pour les erreurs JavaScript
3. Les logs Apache si disponibles

