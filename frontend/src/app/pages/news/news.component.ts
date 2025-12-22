import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ImageService } from '../../services/image.service';
import { SeoService } from '../../services/seo.service';

// Configuration API - remplace l'import environment pour éviter les problèmes de bundler
const API_URL = 'https://cvac-choisyleroi.fr/api';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news.component.html'
})
export class NewsComponent implements OnInit {
  news: any[] = [];
  loading = true;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 12;

  constructor(
    private http: HttpClient,
    public imageService: ImageService, // Public pour utiliser dans le template
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.seoService.setNewsPage();
    this.loadNews();
  }

  loadNews(page: number = 1) {
    this.loading = true;
    this.error = null;
    
    this.http.get<any>(`${API_URL}/news.php?page=${page}&limit=${this.itemsPerPage}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.news = response.data || [];
            this.currentPage = response.pagination?.page || 1;
            this.totalPages = response.pagination?.total_pages || 1;
            this.totalItems = response.pagination?.total || 0;
          } else {
            // Format simple (compatibilité)
            this.news = Array.isArray(response) ? response : [];
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur chargement actualités:', error);
          this.error = 'Erreur lors du chargement des actualités';
          this.loading = false;
        }
      });
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadNews(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Génère l'URL Cloudinary pour une actualité
   * Utilise cloudinary_public_id si disponible, sinon fallback sur image
   */
  getNewsImageUrl(newsItem: any): string {
    // Priorité 1 : cloudinary_public_id (Cloudinary)
    if (newsItem.cloudinary_public_id) {
      return this.imageService.getArticleImageUrl(
        newsItem.cloudinary_public_id,
        800,
        600
      );
    }
    
    // Priorité 2 : image (URL complète ou ancien système)
    if (newsItem.image) {
      // Si c'est déjà une URL complète, la retourner telle quelle
      if (newsItem.image.startsWith('http://') || newsItem.image.startsWith('https://')) {
        return newsItem.image;
      }
      // Sinon, essayer de construire l'URL Cloudinary
      return this.imageService.getArticleImageUrl(newsItem.image, 800, 600);
    }
    
    // Fallback : image par défaut
    return this.imageService.getDefaultImage();
  }

  /**
   * Formate la date pour l'affichage
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Génère un extrait du contenu
   */
  getExcerpt(content: string, maxLength: number = 150): string {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }

  // Exposer Math pour le template
  Math = Math;

  /**
   * Gère l'erreur de chargement d'image
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.imageService.getDefaultImage();
    }
  }
}

