import { Injectable } from '@angular/core';

// Configuration API - remplace l'import environment pour éviter les problèmes de bundler
const API_URL = 'https://cvac-choisyleroi.fr/api';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  // Configuration Cloudinary CVAC
  private cloudName = 'dxzvuvlye';
  private baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload/`;

  /**
   * Génère une URL Cloudinary optimisée
   * @param publicId - L'ID public de l'image sur Cloudinary (ex: "cvac/news/image123")
   * @param options - Options de transformation
   */
  getImageUrl(
    publicId: string | null | undefined,
    options: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop';
      quality?: 'auto' | number;
      format?: 'auto' | 'webp' | 'jpg' | 'png';
      gravity?: 'face' | 'auto' | 'center';
    } = {}
  ): string {
    // Si pas d'image, retourner une image par défaut
    if (!publicId) {
      return this.getDefaultImage();
    }

    // Si c'est déjà une URL complète (http/https), la retourner telle quelle
    if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
      return publicId;
    }

    // Construire les transformations
    const transformations: string[] = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) {
      transformations.push(`q_${options.quality}`);
    } else {
      transformations.push('q_auto'); // Qualité automatique par défaut
    }
    if (options.format) {
      transformations.push(`f_${options.format}`);
    } else {
      transformations.push('f_auto'); // Format automatique par défaut
    }
    if (options.gravity) transformations.push(`g_${options.gravity}`);

    const transformString =
      transformations.length > 0 ? transformations.join(',') + '/' : '';

    return `${this.baseUrl}${transformString}${publicId}`;
  }

  /**
   * Récupère une image avec fallback
   */
  getImageWithFallback(
    imageUrl: string | null | undefined,
    fallback?: string
  ): string {
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.includes('cloudinary'))) {
      return imageUrl;
    }
    return fallback || this.getDefaultImage();
  }

  /**
   * Génère une URL pour un avatar optimisé
   */
  getAvatarUrl(publicId: string | null | undefined, size: number = 200): string {
    return this.getImageUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'auto'
    });
  }

  /**
   * Génère une URL pour une image d'article optimisée
   */
  getArticleImageUrl(
    publicId: string | null | undefined,
    width: number = 800,
    height: number = 600
  ): string {
    return this.getImageUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    });
  }

  /**
   * Génère une URL pour un logo optimisé
   */
  getLogoUrl(publicId: string | null | undefined, size: number = 200): string {
    return this.getImageUrl(publicId, {
      width: size,
      height: size,
      crop: 'fit',
      quality: 'auto',
      format: 'auto'
    });
  }

  /**
   * Image par défaut
   */
  public getDefaultImage(): string {
    // Retourner une image placeholder ou une image par défaut
    return 'https://via.placeholder.com/800x600?text=CVAC';
  }

  /**
   * Upload une image vers Cloudinary via l'API
   */
  uploadImage(file: File, type: 'news' | 'project' | 'member' | 'association' | 'page' | 'resource'): Promise<any> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/upload.php`, true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response);
            } else {
              reject(new Error(response.error || 'Erreur lors de l\'upload'));
            }
          } catch (e) {
            reject(new Error('Erreur de parsing de la réponse'));
          }
        } else {
          reject(new Error(`Erreur HTTP: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Erreur réseau'));
      };

      xhr.send(formData);
    });
  }
}

