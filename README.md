# CVAC - Application Web

Application web pour le Conseil de la Vie Associative de Choisy-le-Roi, développée avec Angular 19 et PHP pour hébergement mutualisé.

## Structure du Projet

```
cvac/
├── frontend/              # Application Angular
│   └── src/
│       └── app/
│           ├── components/   # Composants réutilisables (header, footer)
│           └── pages/         # Pages de l'application
├── api/                   # Backend PHP
│   ├── config.php        # Configuration de la base de données
│   ├── members.php       # API des membres
│   ├── news.php          # API des actualités
│   └── contact.php       # API du formulaire de contact
├── dist/                  # Build Angular (généré après compilation)
├── templates/            # Templates HTML originaux
└── .htaccess             # Configuration Apache pour hébergement mutualisé
```

## Prérequis

- Node.js 18+ et npm
- PHP 7.4+ avec extensions PDO et MySQL
- MySQL/MariaDB
- Hébergement mutualisé avec Apache et mod_rewrite activé

## Installation

### 1. Installation des dépendances Angular

```bash
npm install
```

### 2. Configuration de la base de données

1. Créez une base de données MySQL sur votre hébergement
2. Importez le fichier `api/database.sql` via phpMyAdmin
3. Modifiez les identifiants dans `api/config.php` :
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'cvac_db');
   define('DB_USER', 'votre_utilisateur');
   define('DB_PASS', 'votre_mot_de_passe');
   ```

### 3. Développement local

```bash
# Démarrer le serveur de développement Angular
npm start

# L'application sera accessible sur http://localhost:4200
```

### 4. Build pour production

```bash
# Compiler l'application Angular
npm run build:prod

# Les fichiers compilés seront dans le dossier dist/
```

## Déploiement sur hébergement mutualisé

### Structure de déploiement

Sur votre hébergement mutualisé, la structure doit être :

```
public_html/ (ou www/)
├── index.html              # Fichier principal Angular (depuis dist/)
├── *.js                     # Fichiers JavaScript compilés (depuis dist/)
├── *.css                    # Fichiers CSS compilés (depuis dist/)
├── assets/                  # Assets statiques (depuis dist/assets/)
├── api/                     # Dossier PHP
│   ├── config.php
│   ├── members.php
│   ├── news.php
│   └── contact.php
└── .htaccess                # Configuration Apache
```

### Étapes de déploiement

1. **Compiler l'application Angular** :
   ```bash
   npm run build:prod
   ```

2. **Uploader les fichiers** :
   - Copiez tous les fichiers du dossier `dist/` vers la racine de votre hébergement (`public_html/` ou `www/`)
   - Copiez le dossier `api/` vers la racine de votre hébergement
   - Copiez le fichier `.htaccess` vers la racine

3. **Configurer la base de données** :
   - Créez la base de données via votre panneau d'hébergement
   - Importez `api/database.sql`
   - Modifiez `api/config.php` avec vos identifiants

4. **Vérifier les permissions** :
   - Assurez-vous que le fichier `.htaccess` est bien présent
   - Vérifiez que mod_rewrite est activé sur votre serveur

### Configuration du .htaccess

Le fichier `.htaccess` est déjà configuré pour :
- Rediriger toutes les requêtes vers `index.html` (pour le routing Angular)
- Exclure les requêtes vers `/api/` de la redirection
- Activer la compression GZIP
- Configurer le cache des fichiers statiques

## API PHP

### Endpoints disponibles

- `GET /api/members.php` - Liste des membres du CVAC
- `GET /api/news.php` - Liste des actualités
- `POST /api/contact.php` - Envoi d'un message de contact

### Format des réponses

Toutes les réponses sont au format JSON avec encodage UTF-8.

**Exemple de réponse membres** :
```json
[
  {
    "id": 1,
    "name": "Jean-Michel Dupont",
    "role": "Président",
    "association": "Association Culturelle de Choisy",
    "email": "j.dupont@cvac-choisy.fr",
    "description": "...",
    "avatar": "..."
  }
]
```

## Développement

### Ajouter une nouvelle page

1. Créer un composant dans `frontend/src/app/pages/`
2. Ajouter la route dans `frontend/src/app/app.routes.ts`
3. Ajouter le lien dans le header si nécessaire

### Ajouter une nouvelle API

1. Créer un fichier PHP dans `api/`
2. Inclure `config.php` pour la connexion à la base
3. Implémenter la logique de l'API
4. Appeler l'API depuis Angular avec `HttpClient`

## Notes importantes

- **Angular 19** : La version utilisée est Angular 19 (la dernière version stable). Angular 20 n'existe pas encore.
- **Hébergement mutualisé** : L'application est conçue pour fonctionner sur un hébergement mutualisé standard avec PHP et Apache.
- **Base de données** : Les données sont stockées en MySQL/MariaDB. Des données de démo sont retournées si la base est vide.
- **CORS** : Les headers CORS sont configurés dans `api/config.php` pour permettre les requêtes depuis Angular.

## Support

Pour toute question ou problème, contactez l'équipe de développement.
