# Configuration du Domaine API

## 🌐 Domaine de Production

**URL de base :** `https://cvac-choisyleroi.fr`

**URL de l'API :** `https://cvac-choisyleroi.fr/api`

---

## ✅ Configuration Frontend

Tous les services Angular utilisent maintenant la configuration d'environnement :

### Fichiers de configuration :
- `frontend/src/environments/environment.ts` (développement)
- `frontend/src/environments/environment.prod.ts` (production)

### Services mis à jour :
- ✅ `auth.service.ts` → `${environment.apiUrl}/auth.php`
- ✅ `association.service.ts` → `${environment.apiUrl}/associations.php`
- ✅ `image.service.ts` → `${environment.apiUrl}/upload.php`
- ✅ `news.component.ts` → `${environment.apiUrl}/news.php`
- ✅ `news-form.component.ts` → `${environment.apiUrl}/news.php`
- ✅ `members.component.ts` → `${environment.apiUrl}/members.php`
- ✅ `contact.component.ts` → `${environment.apiUrl}/contact.php`

---

## 🔧 Avantages

1. **Centralisation** : Toutes les URLs API sont dans un seul endroit
2. **Flexibilité** : Facile de changer le domaine pour développement/production
3. **Maintenance** : Plus simple à maintenir et mettre à jour

---

## 📝 Utilisation

Pour utiliser l'API dans un nouveau service :

```typescript
import { environment } from '../../environments/environment';

export class MonService {
  private apiUrl = `${environment.apiUrl}/mon-endpoint.php`;
  
  // ...
}
```

---

## 🚀 Déploiement

Lors du build de production, Angular utilise automatiquement `environment.prod.ts` qui pointe vers `https://cvac-choisyleroi.fr/api`.

Pour le développement local, vous pouvez modifier `environment.ts` pour pointer vers votre serveur local si nécessaire.

---

## ✅ Vérification

Tous les appels API pointent maintenant vers :
- ✅ `https://cvac-choisyleroi.fr/api/auth.php`
- ✅ `https://cvac-choisyleroi.fr/api/associations.php`
- ✅ `https://cvac-choisyleroi.fr/api/news.php`
- ✅ `https://cvac-choisyleroi.fr/api/members.php`
- ✅ `https://cvac-choisyleroi.fr/api/contact.php`
- ✅ `https://cvac-choisyleroi.fr/api/upload.php`

