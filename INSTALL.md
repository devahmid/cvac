# Guide d'Installation Angular - CVAC

## Structure du Projet

```
cvac/
├── frontend/              ← Dossier Angular (racine du projet Angular)
│   ├── src/              ← Code source
│   ├── package.json      ← Dépendances Angular
│   ├── angular.json      ← Configuration Angular
│   └── tsconfig.json     ← Configuration TypeScript
├── api/                  ← Backend PHP
└── dist/                 ← Build Angular (généré après compilation)
```

## Installation étape par étape

### 1. Installer Angular CLI globalement (si pas déjà installé)

```bash
npm install -g @angular/cli@19
```

Vérifiez l'installation :
```bash
ng version
```

### 2. Aller dans le dossier frontend

```bash
cd frontend
```

### 3. Installer les dépendances

```bash
npm install --legacy-peer-deps
```

**Note** : `--legacy-peer-deps` est nécessaire si vous avez Node.js 21 (version non officiellement supportée mais fonctionnelle).

### 4. Démarrer le serveur de développement

Depuis le dossier `frontend/` :

```bash
npm start
```

Ou directement :
```bash
ng serve
```

L'application sera accessible sur `http://localhost:4200`

### 5. Compiler pour la production

Depuis le dossier `frontend/` :

```bash
npm run build:prod
```

Les fichiers compilés seront dans le dossier `../dist/` (à la racine du projet `cvac/`)

## Commandes Utiles

**Depuis le dossier `frontend/`** :

```bash
# Développement
npm start                    # Démarrer le serveur de dev sur localhost:4200
ng serve                     # Même chose

# Build
npm run build:prod          # Build pour production (sortie dans ../dist/)
ng build --configuration production

# Générer un nouveau composant
ng generate component nom-du-composant

# Vérifier la configuration
ng version
```

## Résolution des problèmes

### Erreur : "ng: command not found"

**Solution** : Angular CLI n'est pas installé globalement
```bash
npm install -g @angular/cli@19
```

### Erreur : "Cannot find module '@angular/...'"

**Solution** : Les dépendances ne sont pas installées
```bash
cd frontend
npm install --legacy-peer-deps
```

### Erreur lors de `npm install`

**Solutions** :
1. Utilisez `--legacy-peer-deps` :
   ```bash
   npm install --legacy-peer-deps
   ```

2. Supprimez `node_modules` et `package-lock.json` puis réinstallez :
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

### Erreur : Port 4200 déjà utilisé

**Solution** : Utilisez un autre port
```bash
ng serve --port 4201
```

### Avertissement sur la version de Node.js

Si vous voyez des avertissements sur Node.js 21, c'est normal. Angular recommande Node.js 18, 20 ou 22, mais Node.js 21 fonctionne généralement bien. Pour éviter ces avertissements, vous pouvez utiliser Node.js 20 LTS.

## Structure Angular

Le projet utilise Angular 19 en mode **standalone** (sans modules NgModule).

Chaque composant est autonome avec :
- `*.component.ts` - Logique du composant
- `*.component.html` - Template HTML
- `*.component.css` - Styles (optionnel)

## Prochaines étapes

Une fois l'installation terminée :

1. Allez dans le dossier `frontend/`
2. Lancez `npm start`
3. Ouvrez `http://localhost:4200` dans votre navigateur
4. Vous devriez voir la page d'accueil du CVAC

## Important

- **Toujours travailler depuis le dossier `frontend/`** pour les commandes Angular
- Les fichiers compilés iront dans `../dist/` (dossier à la racine du projet)
- Le backend PHP reste dans le dossier `api/` à la racine
