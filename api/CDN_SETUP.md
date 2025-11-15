# Guide d'Intégration CDN pour les Images

## 🎯 Recommandation : Cloudinary

**Pourquoi Cloudinary ?**
- ✅ **Gratuit jusqu'à 25GB** de stockage et 25GB de bande passante/mois
- ✅ **Transformation d'images à la volée** (redimensionnement, compression, formats WebP/AVIF)
- ✅ **Optimisation automatique** pour le web
- ✅ **API simple** et bien documentée
- ✅ **CDN global** pour des performances optimales
- ✅ **Parfait pour un projet associatif/municipal**

### Alternatives

1. **Cloudflare Images** - Si vous utilisez déjà Cloudflare (gratuit jusqu'à 100k images)
2. **AWS S3 + CloudFront** - Plus professionnel mais plus complexe
3. **Imgix** - Excellent pour la transformation mais payant dès le début

---

## 📦 Installation Cloudinary

### 1. Créer un compte Cloudinary

1. Aller sur https://cloudinary.com
2. Créer un compte gratuit
3. Noter vos identifiants :
   - `Cloud Name`
   - `API Key`
   - `API Secret`

### 2. Installer le SDK PHP

```bash
composer require cloudinary/cloudinary_php
```

Ou télécharger manuellement depuis : https://github.com/cloudinary/cloudinary_php

---

## 🔧 Configuration

### 1. Créer le fichier de configuration

Créer `api/cloudinary_config.php` :

```php
<?php
require_once 'vendor/autoload.php';

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

// Configuration Cloudinary
Configuration::instance([
    'cloud' => [
        'cloud_name' => 'your_cloud_name',
        'api_key' => 'your_api_key',
        'api_secret' => 'your_api_secret'
    ],
    'url' => [
        'secure' => true
    ]
]);

// Fonction helper pour générer les URLs
function getCloudinaryUrl($publicId, $options = []) {
    $defaultOptions = [
        'secure' => true,
        'fetch_format' => 'auto', // Auto WebP/AVIF selon le navigateur
        'quality' => 'auto', // Compression automatique
    ];
    
    $finalOptions = array_merge($defaultOptions, $options);
    
    return cloudinary_url($publicId, $finalOptions);
}

// Fonction pour uploader une image
function uploadToCloudinary($filePath, $folder = 'cvac', $options = []) {
    $uploadApi = new UploadApi();
    
    $defaultOptions = [
        'folder' => $folder,
        'use_filename' => true,
        'unique_filename' => true,
        'overwrite' => false,
        'resource_type' => 'image',
        'eager' => [
            ['width' => 400, 'height' => 300, 'crop' => 'fill'],
            ['width' => 800, 'height' => 600, 'crop' => 'fill'],
            ['width' => 1200, 'height' => 900, 'crop' => 'fill']
        ]
    ];
    
    $finalOptions = array_merge($defaultOptions, $options);
    
    try {
        $result = $uploadApi->upload($filePath, $finalOptions);
        return [
            'success' => true,
            'public_id' => $result['public_id'],
            'url' => $result['secure_url'],
            'width' => $result['width'],
            'height' => $result['height'],
            'format' => $result['format'],
            'bytes' => $result['bytes']
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}
?>
```

---

## 📤 Endpoint d'Upload

Créer `api/upload.php` :

```php
<?php
require_once 'config.php';
require_once 'cloudinary_config.php';

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit();
}

// Vérifier qu'un fichier a été uploadé
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Aucun fichier uploadé']);
    exit();
}

$file = $_FILES['image'];
$folder = isset($_POST['folder']) ? sanitize($_POST['folder']) : 'cvac';
$type = isset($_POST['type']) ? sanitize($_POST['type']) : 'general';

// Validation du type de fichier
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, GIF']);
    exit();
}

// Validation de la taille (max 10MB)
$maxSize = 10 * 1024 * 1024; // 10MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Fichier trop volumineux. Taille maximale : 10MB']);
    exit();
}

// Déterminer le dossier selon le type
$uploadFolder = $folder . '/' . $type;

// Upload vers Cloudinary
$result = uploadToCloudinary($file['tmp_name'], $uploadFolder, [
    'public_id' => $type . '_' . time() . '_' . uniqid()
]);

if ($result['success']) {
    echo json_encode([
        'success' => true,
        'url' => $result['url'],
        'public_id' => $result['public_id'],
        'width' => $result['width'],
        'height' => $result['height'],
        'format' => $result['format'],
        'size' => $result['bytes']
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'upload : ' . $result['error']], JSON_UNESCAPED_UNICODE);
}
?>
```

---

## 🎨 Utilisation dans le Frontend

### Helper Angular pour les URLs Cloudinary

Créer `frontend/src/app/services/image.service.ts` :

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private cloudinaryBaseUrl = 'https://res.cloudinary.com/your_cloud_name/image/upload/';
  
  /**
   * Génère une URL Cloudinary optimisée
   * @param publicId - L'ID public de l'image sur Cloudinary
   * @param options - Options de transformation
   */
  getImageUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}): string {
    const transformations: string[] = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    
    // Ajouter les transformations par défaut
    if (!options.format) transformations.push('f_auto'); // Format automatique
    if (!options.quality) transformations.push('q_auto'); // Qualité automatique
    
    const transformString = transformations.length > 0 
      ? transformations.join(',') + '/' 
      : '';
    
    return `${this.cloudinaryBaseUrl}${transformString}${publicId}`;
  }
  
  /**
   * Récupère une image avec fallback
   */
  getImageWithFallback(imageUrl: string | null | undefined, fallback: string): string {
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return fallback;
  }
}
```

### Utilisation dans les composants

```typescript
import { ImageService } from '../services/image.service';

export class NewsComponent {
  constructor(private imageService: ImageService) {}
  
  getOptimizedImage(imageUrl: string): string {
    // Si c'est déjà une URL Cloudinary, l'utiliser directement
    if (imageUrl?.includes('cloudinary.com')) {
      return imageUrl;
    }
    
    // Sinon, utiliser le service pour optimiser
    return this.imageService.getImageUrl(imageUrl, {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    });
  }
}
```

### Dans les templates HTML

```html
<!-- Image optimisée pour différentes tailles -->
<img [src]="imageService.getImageUrl(item.image, { width: 800, height: 600, crop: 'fill' })" 
     [alt]="item.title"
     loading="lazy">
```

---

## 📊 Structure des Dossiers Cloudinary

```
cvac/
├── news/          # Images des actualités
├── projects/      # Images des projets
├── members/       # Avatars des membres
├── associations/  # Logos des associations
├── pages/         # Images des pages (hero, etc.)
└── resources/     # Images des ressources
```

---

## 🔄 Migration depuis Google Cloud Storage

### Script de migration (optionnel)

Créer `api/migrate_images.php` :

```php
<?php
require_once 'config.php';
require_once 'cloudinary_config.php';

// Liste des URLs Google Cloud Storage à migrer
$imagesToMigrate = [
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/f5aaa8b9f7-58cc20fbc6dd3a2b17c1.png',
    // ... autres URLs
];

foreach ($imagesToMigrate as $url) {
    // Télécharger l'image
    $imageData = file_get_contents($url);
    $tempFile = tempnam(sys_get_temp_dir(), 'migrate_');
    file_put_contents($tempFile, $imageData);
    
    // Upload vers Cloudinary
    $result = uploadToCloudinary($tempFile, 'cvac/migrated');
    
    if ($result['success']) {
        echo "✅ Migré : {$url} -> {$result['url']}\n";
    } else {
        echo "❌ Erreur : {$url} - {$result['error']}\n";
    }
    
    // Nettoyer
    unlink($tempFile);
}
?>
```

---

## 🎯 Avantages de Cloudinary

1. **Performance** : CDN global avec cache intelligent
2. **Optimisation automatique** : WebP/AVIF selon le navigateur
3. **Transformation à la volée** : Pas besoin de stocker plusieurs tailles
4. **Compression intelligente** : Réduction automatique de la taille
5. **Responsive images** : Génération automatique de différentes tailles
6. **Lazy loading** : Support natif

---

## 📝 Mise à jour de la Base de Données

Ajouter une colonne `cloudinary_public_id` aux tables concernées :

```sql
ALTER TABLE news ADD COLUMN cloudinary_public_id VARCHAR(255);
ALTER TABLE members ADD COLUMN cloudinary_public_id VARCHAR(255);
ALTER TABLE projects ADD COLUMN cloudinary_public_id VARCHAR(255);
ALTER TABLE associations ADD COLUMN cloudinary_public_id VARCHAR(255);
```

---

## 🔐 Sécurité

1. **Limiter les uploads** : Vérifier les types MIME et la taille
2. **Authentification** : Protéger l'endpoint d'upload (à ajouter plus tard)
3. **Validation** : Vérifier que les images ne contiennent pas de code malveillant
4. **Rate limiting** : Limiter le nombre d'uploads par IP

---

## 📚 Ressources

- Documentation Cloudinary : https://cloudinary.com/documentation
- SDK PHP : https://github.com/cloudinary/cloudinary_php
- Transformation d'images : https://cloudinary.com/documentation/image_transformations

---

## ✅ Checklist d'Implémentation

- [ ] Créer un compte Cloudinary
- [ ] Installer le SDK PHP
- [ ] Configurer `cloudinary_config.php`
- [ ] Créer l'endpoint `upload.php`
- [ ] Créer le service Angular `ImageService`
- [ ] Mettre à jour les composants pour utiliser Cloudinary
- [ ] Migrer les images existantes (optionnel)
- [ ] Tester l'upload et l'affichage
- [ ] Mettre à jour la base de données avec les public_ids

