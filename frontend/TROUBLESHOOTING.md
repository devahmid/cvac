# Guide de dépannage - Formulaire d'inscription d'association

## Problème : Le formulaire ne s'affiche pas

### Vérifications à faire :

1. **Vérifier que le serveur compile sans erreur**
   ```bash
   cd frontend
   npm start
   ```

2. **Vérifier la console du navigateur (F12)**
   - Ouvrir les outils développeur
   - Aller sur l'onglet "Console"
   - Vérifier s'il y a des erreurs JavaScript

3. **Vérifier que la route fonctionne**
   - Aller sur `http://localhost:4200/directory/register`
   - Vérifier si la page se charge (même vide)

4. **Vérifier les fichiers environment**
   ```bash
   ls -la src/environments/
   cat src/environments/environment.ts
   ```

5. **Nettoyer le cache et relancer**
   ```bash
   rm -rf .angular node_modules/.cache
   npm start
   ```

### Si le problème persiste :

1. **Vérifier que le composant est bien exporté**
   - Le fichier doit se terminer par `export class DirectoryRegisterComponent`
   - Vérifier qu'il n'y a pas d'erreurs de syntaxe

2. **Tester avec un composant minimal**
   - Créer un composant de test pour vérifier que le routing fonctionne

3. **Vérifier les imports**
   - Tous les imports doivent être corrects
   - Vérifier que les services (AssociationService, ImageService) existent

## Fichiers importants :

- `src/app/pages/directory/register/directory-register.component.ts` - Le composant
- `src/app/app.routes.ts` - La route (ligne 43)
- `src/environments/environment.ts` - Configuration API
- `src/app/services/association.service.ts` - Service pour créer les associations

