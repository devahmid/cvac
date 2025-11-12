# Guide de Démarrage Rapide - CVAC

## Installation et Démarrage

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données (optionnel pour développement)

Pour tester les APIs PHP en local, vous pouvez :

1. Installer XAMPP, WAMP ou MAMP
2. Créer une base de données `cvac_db`
3. Importer `api/database.sql`
4. Modifier `api/config.php` avec vos identifiants locaux

### 3. Démarrer le serveur de développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## Structure du Projet

- **frontend/** : Code source Angular
- **api/** : Backend PHP avec les APIs REST
- **templates/** : Templates HTML originaux (référence)
- **dist/** : Fichiers compilés (générés après `npm run build`)

## Commandes Utiles

```bash
# Développement
npm start                    # Démarrer le serveur de dev sur localhost:4200

# Production
npm run build:prod          # Compiler pour la production

# Les fichiers compilés seront dans dist/
```

## Pages Disponibles

- `/` - Page d'accueil
- `/about` - À propos du CVAC
- `/missions-values` - Missions et valeurs
- `/members` - Les membres du CVAC
- `/news` - Actualités et événements
- `/contact` - Formulaire de contact
- `/associations` - Les associations locales
- `/projects` - Projets inter-associatifs
- `/legal` - Mentions légales et RGPD
- `/resources` - Ressources et documents

## APIs PHP

Les APIs sont disponibles dans le dossier `api/` :

- `GET /api/members.php` - Liste des membres
- `GET /api/news.php` - Liste des actualités
- `POST /api/contact.php` - Envoi de message

## Notes Importantes

1. **Angular 19** : Ce projet utilise Angular 19 (dernière version stable). Angular 20 n'existe pas encore.

2. **Tailwind CSS** : Utilisé via CDN dans `index.html`. Pour un développement plus avancé, vous pouvez installer Tailwind localement.

3. **Hébergement mutualisé** : L'application est conçue pour fonctionner sur un hébergement mutualisé standard. Voir `DEPLOY.md` pour les instructions de déploiement.

4. **Base de données** : Les APIs retournent des données de démo si la base de données n'est pas configurée.

## Prochaines Étapes

1. Compléter le contenu des pages à partir des templates HTML dans `templates/`
2. Configurer la base de données sur votre hébergement
3. Personnaliser les couleurs et le design si nécessaire
4. Ajouter d'autres fonctionnalités selon vos besoins

