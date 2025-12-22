import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AssociationService, Association } from '../../../services/association.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-directory-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main>
      <!-- En-tête avec image de couverture -->
      <section class="relative h-96 overflow-hidden">
        <div 
          *ngIf="association?.coverImage"
          class="w-full h-full bg-gradient-to-br from-cvac-blue to-cvac-light-blue">
          <img 
            *ngIf="association?.coverImage"
            [src]="getImageUrl(association!.coverImage!)" 
            [alt]="association?.name"
            class="w-full h-full object-cover">
        </div>
        <div 
          *ngIf="!association?.coverImage"
          class="w-full h-full bg-gradient-to-br from-cvac-blue to-cvac-light-blue flex items-center justify-center">
          <i class="fa-solid fa-users text-white text-8xl opacity-50"></i>
        </div>
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40"></div>
        
        <!-- Contenu de l'en-tête -->
        <div class="absolute inset-0 flex items-end">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <div class="flex flex-col md:flex-row items-start md:items-end gap-6">
              <!-- Logo -->
              <div class="w-32 h-32 bg-white rounded-2xl p-3 shadow-2xl">
                    <img 
                      *ngIf="association?.logo"
                      [src]="getImageUrl(association!.logo!)" 
                      [alt]="association?.name + ' logo'"
                      class="w-full h-full object-contain">
                <div *ngIf="!association?.logo" class="w-full h-full bg-cvac-cream rounded-xl flex items-center justify-center">
                  <i class="fa-solid fa-building text-cvac-blue text-4xl"></i>
                </div>
              </div>
              
              <!-- Informations -->
              <div class="flex-1 text-white">
                <div class="mb-2">
                  <span *ngIf="association?.category" class="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1 rounded-full">
                    {{ association?.category }}
                  </span>
                </div>
                <h1 class="text-4xl md:text-5xl font-bold mb-2">{{ association?.name }}</h1>
                <p *ngIf="association?.city" class="text-xl text-white/90">
                  <i class="fa-solid fa-location-dot mr-2"></i>
                  {{ association?.city }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contenu principal -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Message de chargement -->
          <div *ngIf="loading" class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cvac-blue"></div>
            <p class="mt-4 text-gray-600">Chargement des informations...</p>
          </div>

          <!-- Message d'erreur -->
          <div *ngIf="error && !loading" class="bg-red-50 border border-red-200 rounded-lg p-6">
            <div class="flex items-center">
              <i class="fa-solid fa-exclamation-circle text-red-600 text-xl mr-3"></i>
              <p class="text-red-800">{{ error }}</p>
            </div>
            <a routerLink="/directory" class="mt-4 inline-block text-cvac-blue hover:text-cvac-light-blue">
              ← Retour à l'annuaire
            </a>
          </div>

          <!-- Détails de l'association -->
          <div *ngIf="!loading && !error && association" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Colonne principale -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Description -->
              <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 class="text-2xl font-bold text-cvac-blue mb-4">
                  <i class="fa-solid fa-info-circle mr-2"></i>
                  À propos
                </h2>
                <div class="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {{ association.description }}
                </div>
              </div>

              <!-- Activités -->
              <div *ngIf="association.activities" class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 class="text-2xl font-bold text-cvac-blue mb-4">
                  <i class="fa-solid fa-tags mr-2"></i>
                  Activités
                </h2>
                <p class="text-gray-700 leading-relaxed">{{ association.activities }}</p>
              </div>
            </div>

            <!-- Colonne latérale -->
            <div class="space-y-6">
              <!-- Informations de contact -->
              <div class="bg-gradient-to-br from-cvac-blue to-cvac-light-blue rounded-2xl shadow-lg p-8 text-white">
                <h3 class="text-xl font-bold mb-6">
                  <i class="fa-solid fa-address-card mr-2"></i>
                  Informations
                </h3>
                <div class="space-y-4">
                  <div *ngIf="association.email" class="flex items-start">
                    <i class="fa-solid fa-envelope mr-3 mt-1"></i>
                    <div>
                      <p class="text-sm text-white/80">Email</p>
                      <a [href]="'mailto:' + association.email" class="text-white hover:underline">
                        {{ association.email }}
                      </a>
                    </div>
                  </div>
                  
                  <div *ngIf="association.phone" class="flex items-start">
                    <i class="fa-solid fa-phone mr-3 mt-1"></i>
                    <div>
                      <p class="text-sm text-white/80">Téléphone</p>
                      <a [href]="'tel:' + association.phone" class="text-white hover:underline">
                        {{ association.phone }}
                      </a>
                    </div>
                  </div>
                  
                  <div *ngIf="association.website" class="flex items-start">
                    <i class="fa-solid fa-globe mr-3 mt-1"></i>
                    <div>
                      <p class="text-sm text-white/80">Site web</p>
                      <a [href]="association.website" target="_blank" rel="noopener noreferrer" class="text-white hover:underline">
                        {{ association.website }}
                      </a>
                    </div>
                  </div>
                  
                  <div *ngIf="association.address" class="flex items-start">
                    <i class="fa-solid fa-map-marker-alt mr-3 mt-1"></i>
                    <div>
                      <p class="text-sm text-white/80">Adresse</p>
                      <p class="text-white">
                        {{ association.address }}<br>
                        <span *ngIf="association.postalCode">{{ association.postalCode }} </span>{{ association.city }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Statistiques -->
              <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 class="text-xl font-bold text-cvac-blue mb-6">
                  <i class="fa-solid fa-chart-bar mr-2"></i>
                  En bref
                </h3>
                <div class="space-y-4">
                  <div *ngIf="association.foundingYear" class="flex items-center justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Année de création</span>
                    <span class="font-semibold text-cvac-blue">{{ association.foundingYear }}</span>
                  </div>
                  
                  <div *ngIf="association.numberOfMembers" class="flex items-center justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Nombre de membres</span>
                    <span class="font-semibold text-cvac-blue">{{ association.numberOfMembers }}</span>
                  </div>
                  
                  <div *ngIf="association.president" class="flex items-center justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600">Président(e)</span>
                    <span class="font-semibold text-cvac-blue">{{ association.president }}</span>
                  </div>
                </div>
              </div>

              <!-- Bouton retour -->
              <a 
                routerLink="/directory"
                class="block w-full bg-cvac-cream text-cvac-blue px-6 py-4 rounded-lg font-semibold hover:bg-cvac-blue hover:text-white transition-colors text-center">
                <i class="fa-solid fa-arrow-left mr-2"></i>
                Retour à l'annuaire
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class DirectoryDetailComponent implements OnInit {
  association: Association | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private associationService: AssociationService,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAssociation(+id);
    } else {
      this.error = 'Association non trouvée';
      this.loading = false;
    }
  }

  loadAssociation(id: number) {
    this.loading = true;
    this.error = null;

    this.associationService.getAssociationById(id).subscribe({
      next: (response) => {
        let associationData: Association | null = null;
        
        if (response.success && response.data) {
          this.association = response.data;
          associationData = response.data;
        } else if (response.id) {
          this.association = response;
          associationData = response;
        } else {
          this.error = 'Association non trouvée';
        }
        
        // Mettre à jour les meta tags SEO pour cette association
        if (associationData) {
          this.seoService.setAssociationPage({
            name: associationData.name,
            description: associationData.description || '',
            category: associationData.category,
            city: associationData.city,
            image: associationData.coverImage || associationData.logo
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement association:', error);
        this.error = 'Erreur lors du chargement de l\'association';
        this.loading = false;
      }
    });
  }

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/assets/images/associations/${imagePath}`;
  }
}

