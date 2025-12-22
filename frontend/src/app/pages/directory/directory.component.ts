import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssociationService, Association } from '../../services/association.service';
import { AuthService } from '../../services/auth.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main>
      <!-- En-tête -->
      <section class="bg-gradient-to-br from-cvac-blue to-cvac-light-blue py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <span class="text-sm font-semibold text-white">Annuaire</span>
          </div>
          <h1 class="text-5xl font-bold text-white mb-4">Annuaire des Associations</h1>
          <p class="text-xl text-white/90 max-w-3xl mx-auto">
            Découvrez toutes les associations de Choisy-le-Roi et leurs activités
          </p>
        </div>
      </section>

      <!-- Barre de recherche et filtres -->
      <section class="py-8 bg-white border-b border-gray-200 sticky top-20 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row gap-4 items-center">
            <!-- Recherche -->
            <div class="flex-1 w-full md:w-auto">
              <div class="relative">
                <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery"
                  (input)="onSearch()"
                  placeholder="Rechercher une association..." 
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
              </div>
            </div>

            <!-- Filtre par catégorie -->
            <div class="w-full md:w-auto">
              <select 
                [(ngModel)]="selectedCategory"
                (change)="onCategoryChange()"
                class="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                <option value="">Toutes les catégories</option>
                <option value="Culture">Culture</option>
                <option value="Sport">Sport</option>
                <option value="Social">Social</option>
                <option value="Éducation">Éducation</option>
                <option value="Environnement">Environnement</option>
                <option value="Jeunesse">Jeunesse</option>
                <option value="Solidarité">Solidarité</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <!-- Bouton inscription -->
            <button 
              (click)="goToRegister()"
              class="w-full md:w-auto bg-cvac-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors text-center">
              <i class="fa-solid fa-plus mr-2"></i>
              Inscrire mon association
            </button>
          </div>
        </div>
      </section>

      <!-- Liste des associations -->
      <section class="py-16 bg-cvac-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Message de chargement -->
          <div *ngIf="loading" class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cvac-blue"></div>
            <p class="mt-4 text-gray-600">Chargement des associations...</p>
          </div>

          <!-- Message d'erreur -->
          <div *ngIf="error && !loading" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div class="flex items-center">
              <i class="fa-solid fa-exclamation-circle text-red-600 text-xl mr-3"></i>
              <p class="text-red-800">{{ error }}</p>
            </div>
          </div>

          <!-- Grille des associations -->
          <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article 
              *ngFor="let association of filteredAssociations" 
              class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer group"
              [routerLink]="['/directory', association.id]">
              
              <!-- Image de couverture -->
              <div class="h-56 overflow-hidden bg-gradient-to-br from-cvac-blue to-cvac-light-blue relative">
                <img 
                  *ngIf="association.coverImage"
                  [src]="getImageUrl(association.coverImage)" 
                  [alt]="association.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                <div *ngIf="!association.coverImage" class="w-full h-full flex items-center justify-center">
                  <i class="fa-solid fa-users text-white text-6xl opacity-50"></i>
                </div>
                
                <!-- Overlay gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <!-- Logo -->
                <div class="absolute -bottom-14 left-1/2 transform -translate-x-1/2 z-10">
                  <div class="w-28 h-28 bg-white rounded-2xl p-3 shadow-2xl border-4 border-white">
                    <img 
                      *ngIf="association.logo"
                      [src]="getImageUrl(association.logo)" 
                      [alt]="association.name + ' logo'"
                      class="w-full h-full object-contain">
                    <div *ngIf="!association.logo" class="w-full h-full bg-gradient-to-br from-cvac-cream to-white rounded-xl flex items-center justify-center">
                      <i class="fa-solid fa-building text-cvac-blue text-3xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contenu -->
              <div class="pt-20 pb-6 px-6">
                <!-- Catégorie -->
                <div class="flex items-center justify-center mb-3">
                  <span *ngIf="association.category" class="inline-block bg-gradient-to-r from-cvac-blue to-cvac-light-blue text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                    {{ association.category }}
                  </span>
                </div>

                <!-- Nom -->
                <h3 class="text-xl font-bold text-cvac-blue mb-3 text-center group-hover:text-cvac-light-blue transition-colors min-h-[3rem] flex items-center justify-center">
                  {{ association.name }}
                </h3>

                <!-- Description -->
                <p class="text-gray-600 text-sm mb-4 line-clamp-3 text-center leading-relaxed">
                  {{ getExcerpt(association.description) }}
                </p>

                <!-- Informations -->
                <div class="space-y-2 mb-4">
                  <div *ngIf="association.city" class="flex items-center text-sm text-gray-500 justify-center">
                    <i class="fa-solid fa-location-dot mr-2 text-cvac-blue"></i>
                    <span>{{ association.city }}</span>
                  </div>
                  <div *ngIf="association.activities" class="flex items-center text-sm text-gray-500 justify-center">
                    <i class="fa-solid fa-tags mr-2 text-cvac-blue"></i>
                    <span class="line-clamp-1">{{ association.activities }}</span>
                  </div>
                </div>

                <!-- Bouton voir plus -->
                <div class="text-center pt-4 border-t border-gray-100">
                  <span class="text-cvac-blue font-semibold group-hover:text-cvac-light-blue transition-colors inline-flex items-center">
                    Voir les détails 
                    <i class="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </div>
              </div>
            </article>
          </div>

          <!-- Message si aucune association -->
          <div *ngIf="!loading && !error && filteredAssociations.length === 0" class="text-center py-20">
            <div class="w-24 h-24 bg-cvac-cream rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fa-solid fa-building text-cvac-blue text-4xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-cvac-blue mb-2">Aucune association trouvée</h3>
            <p class="text-gray-600 mb-6">
              {{ searchQuery || selectedCategory ? 'Essayez de modifier vos critères de recherche.' : 'Soyez le premier à inscrire votre association !' }}
            </p>
            <button 
              (click)="goToRegister()"
              class="inline-block bg-cvac-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors">
              <i class="fa-solid fa-plus mr-2"></i>
              Inscrire mon association
            </button>
          </div>
        </div>
      </section>
    </main>
  `
})
export class DirectoryComponent implements OnInit {
  associations: Association[] = [];
  filteredAssociations: Association[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  selectedCategory = '';

  constructor(
    private associationService: AssociationService,
    private authService: AuthService,
    private router: Router,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.seoService.setDirectoryPage();
    this.loadAssociations();
  }

  loadAssociations() {
    this.loading = true;
    this.error = null;

    this.associationService.getPublicAssociations().subscribe({
      next: (response) => {
        console.log('Réponse API associations:', response); // Debug
        if (response.success && response.data) {
          // Mapper les données de l'API vers le format attendu par le frontend
          this.associations = response.data
            .filter((a: any) => {
              // Accepter si is_public est true, 1, ou si isPublic est true
              return a.is_public === true || a.is_public === 1 || a.isPublic === true;
            })
            .map((a: any) => ({
              id: a.id,
              name: a.name,
              description: a.description,
              email: a.email,
              phone: a.phone,
              website: a.website,
              address: a.address,
              postalCode: a.postal_code,
              city: a.city,
              logo: a.logo,
              coverImage: a.cover_image,
              category: a.category,
              activities: a.activities,
              president: a.president,
              foundingYear: a.founding_year,
              numberOfMembers: a.number_of_members,
              isPublic: a.is_public === true || a.is_public === 1 || a.isPublic === true,
              createdAt: a.created_at,
              updatedAt: a.updated_at
            }));
        } else if (Array.isArray(response)) {
          this.associations = response
            .filter((a: any) => {
              // Accepter si is_public est true, 1, ou si isPublic est true
              return a.is_public === true || a.is_public === 1 || a.isPublic === true;
            })
            .map((a: any) => ({
              id: a.id,
              name: a.name,
              description: a.description,
              email: a.email,
              phone: a.phone,
              website: a.website,
              address: a.address,
              postalCode: a.postal_code,
              city: a.city,
              logo: a.logo,
              coverImage: a.cover_image,
              category: a.category,
              activities: a.activities,
              president: a.president,
              foundingYear: a.founding_year,
              numberOfMembers: a.number_of_members,
              isPublic: a.is_public === true || a.is_public === 1 || a.isPublic === true,
              createdAt: a.created_at,
              updatedAt: a.updated_at
            }));
        } else {
          this.associations = [];
        }
        console.log('Associations mappées:', this.associations); // Debug
        this.filterAssociations();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement associations:', error);
        this.error = 'Erreur lors du chargement des associations';
        this.loading = false;
        this.associations = [];
        this.filteredAssociations = [];
      }
    });
  }

  onSearch() {
    this.filterAssociations();
  }

  onCategoryChange() {
    this.filterAssociations();
  }

  filterAssociations() {
    let filtered = [...this.associations];

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(asso => 
        (asso.name && asso.name.toLowerCase().includes(query)) ||
        (asso.description && asso.description.toLowerCase().includes(query)) ||
        (asso.city && asso.city.toLowerCase().includes(query)) ||
        (asso.activities && asso.activities.toLowerCase().includes(query))
      );
    }

    // Filtre par catégorie
    if (this.selectedCategory) {
      filtered = filtered.filter(asso => asso.category === this.selectedCategory);
    }

    this.filteredAssociations = filtered;
  }

  getExcerpt(text: string, maxLength: number = 120): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/assets/images/associations/${imagePath}`;
  }

  goToRegister() {
    // Vérifier si l'utilisateur est connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/directory/register']);
    } else {
      // Rediriger vers la page de connexion avec l'URL de retour
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/directory/register' } });
    }
  }
}

