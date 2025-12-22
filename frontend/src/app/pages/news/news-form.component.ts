import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ImageUploadComponent } from '../../components/image-upload/image-upload.component';

// Configuration API - remplace l'import environment pour éviter les problèmes de bundler
const API_URL = 'https://cvac-choisyleroi.fr/api';

/**
 * Composant de formulaire pour créer/éditer des actualités
 * Exemple d'utilisation complète avec Cloudinary
 */
@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent],
  template: `
    <main class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- En-tête -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-cvac-blue mb-2">
            {{ isEditMode ? 'Modifier une actualité' : 'Créer une actualité' }}
          </h1>
          <p class="text-gray-600">
            {{ isEditMode ? 'Modifiez les informations de l\'actualité' : 'Remplissez le formulaire pour créer une nouvelle actualité' }}
          </p>
        </div>

        <!-- Formulaire -->
        <form (ngSubmit)="onSubmit()" class="bg-white rounded-xl shadow-lg p-8 space-y-6">
          
          <!-- Titre -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Titre <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="title"
              [(ngModel)]="formData.title"
              name="title"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
          </div>

          <!-- Catégorie -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select 
              id="category"
              [(ngModel)]="formData.category"
              name="category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
              <option value="">Sélectionner une catégorie</option>
              <option value="Réunion plénière">Réunion plénière</option>
              <option value="Événement">Événement</option>
              <option value="Projet">Projet</option>
              <option value="Annonce">Annonce</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <!-- Date -->
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
              Date <span class="text-red-500">*</span>
            </label>
            <input 
              type="date" 
              id="date"
              [(ngModel)]="formData.date"
              name="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
          </div>

          <!-- Image avec upload Cloudinary -->
          <div>
            <app-image-upload
              label="Image de l'actualité"
              [currentPublicId]="formData.cloudinary_public_id"
              (imageUploaded)="onImageUploaded($event)"
              (imageRemoved)="onImageRemoved()">
            </app-image-upload>
          </div>

          <!-- Extrait -->
          <div>
            <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
              Extrait (résumé court)
            </label>
            <textarea 
              id="excerpt"
              [(ngModel)]="formData.excerpt"
              name="excerpt"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
              placeholder="Un résumé court qui apparaîtra dans la liste des actualités..."></textarea>
            <p class="mt-1 text-sm text-gray-500">
              {{ (formData.excerpt || '').length }} caractères
            </p>
          </div>

          <!-- Contenu -->
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
              Contenu <span class="text-red-500">*</span>
            </label>
            <textarea 
              id="content"
              [(ngModel)]="formData.content"
              name="content"
              required
              rows="10"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
              placeholder="Contenu complet de l'actualité..."></textarea>
            <p class="mt-1 text-sm text-gray-500">
              {{ (formData.content || '').length }} caractères
            </p>
          </div>

          <!-- Messages d'erreur/succès -->
          <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <i class="fa-solid fa-exclamation-circle text-red-600 mr-2"></i>
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>

          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center">
              <i class="fa-solid fa-check-circle text-green-600 mr-2"></i>
              <p class="text-sm text-green-800">{{ successMessage }}</p>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button 
              type="button"
              (click)="onCancel()"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button 
              type="submit"
              [disabled]="submitting"
              class="px-6 py-2 bg-cvac-blue text-white rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!submitting">
                {{ isEditMode ? 'Mettre à jour' : 'Créer' }}
              </span>
              <span *ngIf="submitting">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                {{ isEditMode ? 'Mise à jour...' : 'Création...' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  `
})
export class NewsFormComponent implements OnInit {
  isEditMode = false;
  newsId: number | null = null;
  submitting = false;
  error: string | null = null;
  successMessage: string | null = null;

  formData = {
    title: '',
    content: '',
    excerpt: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Date du jour par défaut
    cloudinary_public_id: null as string | null
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.newsId = +params['id'];
        this.loadNews();
      }
    });
  }

  loadNews() {
    if (!this.newsId) return;

    this.http.get<any>(`${API_URL}/news.php?id=${this.newsId}`)
      .subscribe({
        next: (news) => {
          this.formData = {
            title: news.title || '',
            content: news.content || '',
            excerpt: news.excerpt || '',
            category: news.category || '',
            date: news.date || new Date().toISOString().split('T')[0],
            cloudinary_public_id: news.cloudinary_public_id || null
          };
        },
        error: (error) => {
          console.error('Erreur chargement actualité:', error);
          this.error = 'Erreur lors du chargement de l\'actualité';
        }
      });
  }

  onImageUploaded(publicId: string) {
    this.formData.cloudinary_public_id = publicId;
    this.successMessage = 'Image uploadée avec succès !';
    setTimeout(() => this.successMessage = null, 3000);
  }

  onImageRemoved() {
    this.formData.cloudinary_public_id = null;
  }

  onSubmit() {
    if (!this.formData.title || !this.formData.content) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.submitting = true;
    this.error = null;
    this.successMessage = null;

    const url = this.isEditMode 
      ? `${API_URL}/news.php?id=${this.newsId}` 
      : `${API_URL}/news.php`;
    
    const method = this.isEditMode ? 'PUT' : 'POST';

    this.http.request(method, url, {
      body: this.formData,
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (response: any) => {
        this.submitting = false;
        if (response.success) {
          this.successMessage = response.message || 
            (this.isEditMode ? 'Actualité mise à jour avec succès !' : 'Actualité créée avec succès !');
          
          // Rediriger après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/news']);
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Erreur sauvegarde:', error);
        this.submitting = false;
        this.error = error.error?.error || 
          (this.isEditMode ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/news']);
  }
}

