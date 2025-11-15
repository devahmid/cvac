# 🚀 Guide de Démarrage Rapide - Cloudinary CDN

## Installation en 5 minutes

### 1. Créer un compte Cloudinary (2 min)

1. Aller sur https://cloudinary.com/users/register/free
2. Créer un compte gratuit
3. Noter vos identifiants depuis le Dashboard :
   - **Cloud Name** (ex: `dxyz123`)
   - **API Key** (ex: `123456789012345`)
   - **API Secret** (ex: `abcdefghijklmnopqrstuvwxyz`)

### 2. Installer le SDK PHP (1 min)

```bash
cd /Users/aitoualiahmid/Documents/APPS-web/cvac/api
composer require cloudinary/cloudinary_php
```

**OU** si vous n'avez pas Composer, télécharger manuellement :
- https://github.com/cloudinary/cloudinary_php/releases

### 3. Configurer Cloudinary (1 min)

Éditer `api/cloudinary_config.php` et remplacer :

```php
'cloud_name' => 'your_cloud_name',      // ← Votre Cloud Name
'api_key' => 'your_api_key',              // ← Votre API Key
'api_secret' => 'your_api_secret'         // ← Votre API Secret
```

### 4. Configurer le Frontend (1 min)

Éditer `frontend/src/app/services/image.service.ts` et remplacer :

```typescript
private cloudName = 'your_cloud_name'; // ← Votre Cloud Name
```

### 5. Tester l'upload

```bash
# Tester l'endpoint d'upload
curl -X POST http://localhost/api/upload.php \
  -F "image=@/path/to/your/image.jpg" \
  -F "type=news"
```

---

## ✅ C'est tout !

Votre CDN Cloudinary est maintenant configuré. Vous pouvez :

1. **Uploader des images** via `/api/upload.php`
2. **Utiliser les images optimisées** dans vos composants Angular
3. **Bénéficier automatiquement** de :
   - Compression WebP/AVIF
   - Redimensionnement à la volée
   - CDN global
   - Cache intelligent

---

## 📝 Exemple d'utilisation

### Dans un composant Angular

```typescript
import { ImageService } from '../services/image.service';

export class NewsComponent {
  constructor(private imageService: ImageService) {}
  
  // Utiliser une image optimisée
  getImageUrl(imageId: string): string {
    return this.imageService.getArticleImageUrl(imageId, 800, 600);
  }
}
```

### Dans un template HTML

```html
<img [src]="imageService.getArticleImageUrl(item.cloudinary_public_id)" 
     [alt]="item.title"
     loading="lazy">
```

---

## 🎯 Avantages immédiats

- ✅ **Performance** : Images chargées depuis un CDN global
- ✅ **Optimisation** : Format WebP/AVIF automatique
- ✅ **Taille réduite** : Compression intelligente
- ✅ **Responsive** : Tailles adaptées automatiquement
- ✅ **Gratuit** : 25GB de stockage + 25GB de bande passante/mois

---

## 📚 Documentation

- Guide complet : `api/CDN_SETUP.md`
- Configuration : `api/cloudinary_config.php`
- Endpoint upload : `api/upload.php`
- Service Angular : `frontend/src/app/services/image.service.ts`

---

## 🆘 Support

En cas de problème :
1. Vérifier que le SDK est installé : `composer show cloudinary/cloudinary_php`
2. Vérifier les credentials dans `cloudinary_config.php`
3. Consulter les logs PHP pour les erreurs
4. Vérifier la documentation Cloudinary : https://cloudinary.com/documentation

