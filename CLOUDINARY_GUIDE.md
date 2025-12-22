# Guide Complet Cloudinary - CVAC

## 📚 Table des matières
1. [Comment ça fonctionne ?](#comment-ça-fonctionne)
2. [Flux complet de A à Z](#flux-complet-de-a-à-z)
3. [Stockage en base de données](#stockage-en-base-de-données)
4. [Utilisation dans le frontend](#utilisation-dans-le-frontend)
5. [Exemples pratiques](#exemples-pratiques)
6. [Composant d'upload](#composant-dupload)

---

## Comment ça fonctionne ?

### Architecture Cloudinary

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ──────> │  API PHP     │ ──────> │  Cloudinary │
│  (Angular)  │         │  (upload.php)│         │   (CDN)     │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │                        │
      │                        │                        │
      │                        ▼                        │
      │                 ┌──────────────┐               │
      │                 │   Base de    │               │
      │                 │   données    │               │
      │                 │  (public_id) │               │
      │                 └──────────────┘               │
      │                                                 │
      └─────────────────────────────────────────────────┘
                    Affichage de l'image
```

### Concepts clés

1. **Public ID** : Identifiant unique de l'image sur Cloudinary (ex: `cvac/resources/phpo0awqf_xdfkmq`)
2. **URL Cloudinary** : URL complète avec transformations (ex: `https://res.cloudinary.com/dxzvuvlye/image/upload/w_800,h_600,c_fill/cvac/resources/phpo0awqf_xdfkmq.jpg`)
3. **Transformations** : Modifications à la volée (taille, qualité, format)

---

## Flux complet de A à Z

### Étape 1 : Upload de l'image

**Côté Frontend (Angular) :**
```typescript
// Dans votre composant
import { ImageService } from '../services/image.service';

constructor(private imageService: ImageService) {}

async uploadImage(file: File) {
  try {
    const result = await this.imageService.uploadImage(file, 'resource');
    console.log('Upload réussi !', result);
    // result contient :
    // {
    //   success: true,
    //   public_id: "cvac/resources/phpo0awqf_xdfkmq",
    //   url: "https://res.cloudinary.com/...",
    //   width: 1644,
    //   height: 1100,
    //   format: "jpg"
    // }
    
    // Sauvegarder le public_id en base de données
    await this.saveToDatabase(result.public_id);
    
  } catch (error) {
    console.error('Erreur upload:', error);
  }
}
```

**Côté API (PHP) :**
```php
// upload.php reçoit le fichier
// 1. Valide le fichier (type, taille)
// 2. Upload vers Cloudinary
// 3. Retourne le public_id et l'URL
```

### Étape 2 : Stockage en base de données

**Important :** Stockez uniquement le **public_id**, pas l'URL complète !

```sql
-- Exemple de table avec Cloudinary
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    content TEXT,
    cloudinary_public_id VARCHAR(255), -- ✅ Stocker le public_id ici
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exemple d'insertion
INSERT INTO news (title, content, cloudinary_public_id) 
VALUES (
    'Titre de l\'actualité',
    'Contenu...',
    'cvac/resources/phpo0awqf_xdfkmq' -- ✅ Public ID seulement
);
```

### Étape 3 : Récupération et affichage

**Côté API (PHP) :**
```php
// members.php ou news.php
$stmt = $pdo->query("SELECT id, name, cloudinary_public_id FROM members");
$members = $stmt->fetchAll();

// Retourner le public_id dans la réponse JSON
echo json_encode([
    'success' => true,
    'data' => $members // Contient cloudinary_public_id
]);
```

**Côté Frontend (Angular) :**
```typescript
// Dans votre composant
import { ImageService } from '../services/image.service';

constructor(private imageService: ImageService) {}

// Récupérer les données de l'API
loadNews() {
  this.http.get('/api/news.php').subscribe((response: any) => {
    this.news = response.data;
    // Chaque news contient cloudinary_public_id
  });
}

// Générer l'URL optimisée pour l'affichage
getImageUrl(publicId: string): string {
  return this.imageService.getImageUrl(publicId, {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
}
```

**Côté Template (HTML) :**
```html
<img [src]="getImageUrl(news.cloudinary_public_id)" 
     [alt]="news.title"
     class="w-full h-64 object-cover">
```

---

## Stockage en base de données

### Structure recommandée

```sql
-- Table news avec Cloudinary
ALTER TABLE news 
ADD COLUMN cloudinary_public_id VARCHAR(255) NULL AFTER content;

-- Table members avec Cloudinary
ALTER TABLE members 
ADD COLUMN cloudinary_public_id VARCHAR(255) NULL AFTER description;

-- Table projects avec Cloudinary
ALTER TABLE projects 
ADD COLUMN cloudinary_public_id VARCHAR(255) NULL AFTER description;
```

### Exemple d'insertion après upload

```php
// Dans votre endpoint PHP (ex: news.php)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // $data['cloudinary_public_id'] vient du frontend après upload
    $stmt = $pdo->prepare("
        INSERT INTO news (title, content, cloudinary_public_id) 
        VALUES (?, ?, ?)
    ");
    $stmt->execute([
        $data['title'],
        $data['content'],
        $data['cloudinary_public_id'] // ✅ Public ID seulement
    ]);
}
```

---

## Utilisation dans le frontend

### Service ImageService (déjà configuré)

Votre `ImageService` est déjà prêt ! Voici comment l'utiliser :

```typescript
import { ImageService } from './services/image.service';

export class NewsComponent {
  constructor(private imageService: ImageService) {}
  
  // Méthode 1 : Image simple avec transformations
  getNewsImage(publicId: string): string {
    return this.imageService.getImageUrl(publicId, {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto'
    });
  }
  
  // Méthode 2 : Image d'article (méthode helper)
  getArticleImage(publicId: string): string {
    return this.imageService.getArticleImageUrl(publicId, 800, 600);
  }
  
  // Méthode 3 : Avatar optimisé
  getAvatar(publicId: string): string {
    return this.imageService.getAvatarUrl(publicId, 200);
  }
}
```

### Exemple dans un template HTML

```html
<!-- Image d'article -->
<img [src]="imageService.getArticleImageUrl(news.cloudinary_public_id, 800, 600)" 
     [alt]="news.title">

<!-- Avatar -->
<img [src]="imageService.getAvatarUrl(member.cloudinary_public_id, 200)" 
     [alt]="member.name"
     class="rounded-full">

<!-- Image avec transformations personnalisées -->
<img [src]="imageService.getImageUrl(project.cloudinary_public_id, {
  width: 1200,
  height: 800,
  crop: 'fill',
  quality: 'auto',
  format: 'webp'
})" 
     [alt]="project.title">
```

---

## Exemples pratiques

### Exemple 1 : Upload depuis un formulaire

```typescript
// news-form.component.ts
import { ImageService } from '../services/image.service';
import { HttpClient } from '@angular/common/http';

export class NewsFormComponent {
  selectedFile: File | null = null;
  
  constructor(
    private imageService: ImageService,
    private http: HttpClient
  ) {}
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  
  async submitForm(formData: any) {
    let cloudinaryPublicId = null;
    
    // 1. Upload l'image si un fichier est sélectionné
    if (this.selectedFile) {
      try {
        const uploadResult = await this.imageService.uploadImage(
          this.selectedFile, 
          'news'
        );
        cloudinaryPublicId = uploadResult.public_id;
        console.log('Image uploadée:', uploadResult.url);
      } catch (error) {
        console.error('Erreur upload:', error);
        return;
      }
    }
    
    // 2. Sauvegarder en base avec le public_id
    const newsData = {
      title: formData.title,
      content: formData.content,
      cloudinary_public_id: cloudinaryPublicId // ✅ Public ID seulement
    };
    
    this.http.post('/api/news.php', newsData).subscribe({
      next: (response) => {
        console.log('Actualité créée !', response);
      },
      error: (error) => {
        console.error('Erreur sauvegarde:', error);
      }
    });
  }
}
```

### Exemple 2 : Afficher une liste d'actualités

```typescript
// news.component.ts
import { ImageService } from '../services/image.service';
import { HttpClient } from '@angular/common/http';

export class NewsComponent {
  news: any[] = [];
  
  constructor(
    private http: HttpClient,
    public imageService: ImageService // ✅ Public pour utiliser dans le template
  ) {}
  
  ngOnInit() {
    this.loadNews();
  }
  
  loadNews() {
    this.http.get('/api/news.php').subscribe({
      next: (response: any) => {
        this.news = response.data;
        // Chaque news contient cloudinary_public_id
      },
      error: (error) => {
        console.error('Erreur chargement:', error);
      }
    });
  }
}
```

```html
<!-- news.component.html -->
<div *ngFor="let article of news" class="news-card">
  <!-- Image optimisée avec Cloudinary -->
  <img [src]="imageService.getArticleImageUrl(article.cloudinary_public_id, 800, 600)" 
       [alt]="article.title"
       class="w-full h-64 object-cover">
  
  <h3>{{ article.title }}</h3>
  <p>{{ article.content }}</p>
</div>
```

### Exemple 3 : Mettre à jour une image existante

```typescript
async updateNewsImage(newsId: number, newFile: File) {
  // 1. Upload la nouvelle image
  const uploadResult = await this.imageService.uploadImage(newFile, 'news');
  
  // 2. Supprimer l'ancienne image de Cloudinary (optionnel)
  // (nécessite un endpoint DELETE dans l'API)
  
  // 3. Mettre à jour en base de données
  this.http.put(`/api/news.php?id=${newsId}`, {
    cloudinary_public_id: uploadResult.public_id
  }).subscribe({
    next: () => {
      console.log('Image mise à jour !');
      this.loadNews(); // Recharger la liste
    }
  });
}
```

---

## Composant d'upload

### Composant réutilisable pour upload d'images

```typescript
// image-upload.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-image-upload',
  template: `
    <div class="image-upload">
      <input 
        type="file" 
        #fileInput 
        (change)="onFileSelected($event)"
        accept="image/*"
        class="hidden">
      
      <button 
        (click)="fileInput.click()"
        [disabled]="uploading"
        class="btn-upload">
        {{ uploading ? 'Upload en cours...' : 'Choisir une image' }}
      </button>
      
      <div *ngIf="previewUrl" class="preview">
        <img [src]="previewUrl" alt="Preview">
        <button (click)="removeImage()">Supprimer</button>
      </div>
      
      <div *ngIf="error" class="error">
        {{ error }}
      </div>
    </div>
  `
})
export class ImageUploadComponent {
  @Output() imageUploaded = new EventEmitter<string>(); // Émet le public_id
  
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading = false;
  error: string | null = null;
  
  constructor(private imageService: ImageService) {}
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validation
    if (file.size > 10 * 1024 * 1024) {
      this.error = 'Fichier trop volumineux (max 10MB)';
      return;
    }
    
    this.selectedFile = file;
    
    // Aperçu local
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  async uploadImage(type: 'news' | 'member' | 'project' | 'resource') {
    if (!this.selectedFile) return;
    
    this.uploading = true;
    this.error = null;
    
    try {
      const result = await this.imageService.uploadImage(this.selectedFile, type);
      
      // Émettre le public_id vers le composant parent
      this.imageUploaded.emit(result.public_id);
      
      console.log('Upload réussi:', result.url);
    } catch (error: any) {
      this.error = error.message || 'Erreur lors de l\'upload';
    } finally {
      this.uploading = false;
    }
  }
  
  removeImage() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.error = null;
  }
}
```

### Utilisation du composant

```typescript
// Dans votre formulaire
export class NewsFormComponent {
  cloudinaryPublicId: string | null = null;
  
  onImageUploaded(publicId: string) {
    this.cloudinaryPublicId = publicId;
    console.log('Public ID reçu:', publicId);
  }
}
```

```html
<!-- Dans votre template -->
<app-image-upload 
  (imageUploaded)="onImageUploaded($event)">
</app-image-upload>

<!-- Le public_id est maintenant disponible dans cloudinaryPublicId -->
```

---

## Résumé : Workflow complet

### 1. Upload
```
Utilisateur sélectionne image
    ↓
Frontend → API upload.php
    ↓
API → Cloudinary (upload)
    ↓
Cloudinary retourne public_id
    ↓
Frontend reçoit public_id
```

### 2. Sauvegarde
```
Frontend envoie public_id + données formulaire
    ↓
API sauvegarde en base de données
    ↓
public_id stocké dans la colonne cloudinary_public_id
```

### 3. Affichage
```
Frontend charge les données depuis l'API
    ↓
Chaque enregistrement contient cloudinary_public_id
    ↓
ImageService génère l'URL Cloudinary avec transformations
    ↓
Template affiche l'image optimisée
```

---

## Avantages de cette approche

✅ **Performance** : Images optimisées automatiquement (WebP, compression)
✅ **Flexibilité** : Transformations à la volée (taille, qualité)
✅ **CDN** : Images servies depuis Cloudinary (rapide partout)
✅ **Stockage** : Seul le public_id en base (léger)
✅ **Scalabilité** : Cloudinary gère le stockage et la bande passante

---

## Points importants à retenir

1. **Stockez uniquement le `public_id`** en base de données, pas l'URL complète
2. **Générez les URLs** côté frontend avec `ImageService` pour les transformations
3. **Utilisez les transformations** pour optimiser selon le contexte (avatar, article, etc.)
4. **Gérez les erreurs** lors de l'upload et l'affichage
5. **Validez les fichiers** avant upload (type, taille)

---

## Prochaines étapes

1. ✅ Upload fonctionne (test réussi)
2. ⏭️ Créer des formulaires avec upload d'images
3. ⏭️ Mettre à jour les tables en base de données
4. ⏭️ Intégrer dans les composants existants
5. ⏭️ Tester l'affichage avec les transformations



