import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html'
})
export class ImageUploadComponent implements OnChanges {
  @Input() label = 'Choisir une image';
  @Input() accept = 'image/*';
  @Input() maxSizeMB = 10;
  @Input() currentImageUrl: string | null = null; // Image actuelle (pour édition)
  @Input() currentPublicId: string | null = null; // Public ID actuel (Cloudinary)
  
  @Output() imageUploaded = new EventEmitter<string>(); // Émet le public_id
  @Output() imageRemoved = new EventEmitter<void>();
  @Output() uploadError = new EventEmitter<string>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading = false;
  error: string | null = null;
  uploadProgress = 0;

  constructor(private imageService: ImageService) {
    // Si une image actuelle est fournie, l'afficher comme aperçu
    if (this.currentImageUrl) {
      this.previewUrl = this.currentImageUrl;
    } else if (this.currentPublicId) {
      this.previewUrl = this.imageService.getArticleImageUrl(this.currentPublicId, 400, 300);
    }
  }

  ngOnChanges() {
    // Mettre à jour l'aperçu si l'image actuelle change
    if (this.currentImageUrl) {
      this.previewUrl = this.currentImageUrl;
    } else if (this.currentPublicId) {
      this.previewUrl = this.imageService.getArticleImageUrl(this.currentPublicId, 400, 300);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validation du type
    if (!file.type.startsWith('image/')) {
      this.showError('Veuillez sélectionner un fichier image');
      return;
    }

    // Validation de la taille
    const maxSizeBytes = this.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.showError(`Fichier trop volumineux. Taille maximale: ${this.maxSizeMB}MB`);
      return;
    }

    this.selectedFile = file;
    this.error = null;

    // Créer un aperçu local
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async uploadImage(type: 'news' | 'member' | 'project' | 'association' | 'page' | 'resource' = 'news') {
    if (!this.selectedFile) {
      this.showError('Veuillez sélectionner une image');
      return;
    }

    this.uploading = true;
    this.error = null;
    this.uploadProgress = 0;

    try {
      // Simuler la progression (Cloudinary ne fournit pas de progression réelle via notre API)
      const progressInterval = setInterval(() => {
        if (this.uploadProgress < 90) {
          this.uploadProgress += 10;
        }
      }, 200);

      const result = await this.imageService.uploadImage(this.selectedFile, type);
      
      clearInterval(progressInterval);
      this.uploadProgress = 100;

      // Émettre le public_id vers le composant parent
      this.imageUploaded.emit(result.public_id);
      
      console.log('Upload réussi:', result.url);
      
      // Réinitialiser après un court délai pour voir le succès
      setTimeout(() => {
        this.uploading = false;
        this.uploadProgress = 0;
      }, 500);

    } catch (error: any) {
      this.showError(error.message || 'Erreur lors de l\'upload');
      this.uploading = false;
      this.uploadProgress = 0;
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.previewUrl = this.currentImageUrl || 
                     (this.currentPublicId ? this.imageService.getArticleImageUrl(this.currentPublicId, 400, 300) : null);
    this.error = null;
    this.imageRemoved.emit();
  }

  private showError(message: string) {
    this.error = message;
    this.uploadError.emit(message);
  }
}

