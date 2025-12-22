import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssociationService, Association } from '../../../services/association.service';
import { ImageService } from '../../../services/image.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-directory-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main>
      <!-- En-tête -->
      <section class="bg-gradient-to-br from-cvac-blue to-cvac-light-blue py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-5xl font-bold text-white mb-4">Modifier mon association</h1>
          <p class="text-xl text-white/90 max-w-3xl mx-auto">
            Mettez à jour les informations de votre association
          </p>
        </div>
      </section>

      <!-- Formulaire -->
      <section class="py-16 bg-cvac-cream">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            <!-- Message de chargement -->
            <div *ngIf="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cvac-blue"></div>
              <p class="mt-4 text-gray-600">Chargement des données...</p>
            </div>

            <!-- Message d'erreur accès -->
            <div *ngIf="accessDenied" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div class="flex items-start">
                <i class="fa-solid fa-exclamation-circle text-red-600 text-2xl mr-3"></i>
                <div>
                  <h3 class="text-lg font-bold text-red-800 mb-2">Accès refusé</h3>
                  <p class="text-red-700 mb-4">
                    Vous n'êtes pas autorisé à modifier cette association.
                  </p>
                  <a routerLink="/profile" class="text-red-700 hover:text-red-800 font-semibold">
                    Retour au profil →
                  </a>
                </div>
              </div>
            </div>

            <!-- Message de succès -->
            <div *ngIf="submitted" class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div class="flex items-start">
                <i class="fa-solid fa-check-circle text-green-600 text-2xl mr-3"></i>
                <div>
                  <h3 class="text-lg font-bold text-green-800 mb-2">Modification réussie !</h3>
                  <p class="text-green-700 mb-4">
                    Votre association a été mise à jour avec succès.
                  </p>
                  <div class="flex gap-4">
                    <a routerLink="/profile" class="text-green-700 hover:text-green-800 font-semibold">
                      Retour au profil
                    </a>
                    <a [routerLink]="['/directory', associationId]" class="text-green-700 hover:text-green-800 font-semibold">
                      Voir la fiche →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulaire -->
            <form *ngIf="!submitted && !loading && !accessDenied" (ngSubmit)="onSubmit()" #form="ngForm">
              
              <!-- Informations générales -->
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-cvac-blue mb-6">
                  <i class="fa-solid fa-info-circle mr-2"></i>
                  Informations générales
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Nom de l'association <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      [(ngModel)]="association.name"
                      name="name"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Catégorie <span class="text-red-500">*</span>
                    </label>
                    <select 
                      [(ngModel)]="association.category"
                      name="category"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                      <option value="">Sélectionner une catégorie</option>
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

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Année de création
                    </label>
                    <input 
                      type="number"
                      [(ngModel)]="association.foundingYear"
                      name="foundingYear"
                      min="1900"
                      [max]="currentYear"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-cvac-blue mb-6">
                  <i class="fa-solid fa-align-left mr-2"></i>
                  Description
                </h2>
                
                <div class="mb-6">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span class="text-red-500">*</span>
                  </label>
                  <textarea 
                    [(ngModel)]="association.description"
                    name="description"
                    required
                    rows="6"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                    placeholder="Décrivez votre association, ses objectifs, ses activités..."></textarea>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Activités principales
                  </label>
                  <input 
                    type="text"
                    [(ngModel)]="association.activities"
                    name="activities"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                    placeholder="Ex: Organiser des événements culturels, cours de danse...">
                </div>
              </div>

              <!-- Contact -->
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-cvac-blue mb-6">
                  <i class="fa-solid fa-address-card mr-2"></i>
                  Contact
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="email"
                      [(ngModel)]="association.email"
                      name="email"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input 
                      type="tel"
                      [(ngModel)]="association.phone"
                      name="phone"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Site web
                    </label>
                    <input 
                      type="url"
                      [(ngModel)]="association.website"
                      name="website"
                      placeholder="https://..."
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Président(e)
                    </label>
                    <input 
                      type="text"
                      [(ngModel)]="association.president"
                      name="president"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  </div>
                </div>
              </div>

              <!-- Adresse -->
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-cvac-blue mb-6">
                  <i class="fa-solid fa-map-marker-alt mr-2"></i>
                  Adresse
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Adresse
                    </label>
                    <input 
                      type="text"
                      [(ngModel)]="association.address"
                      name="address"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Code postal
                    </label>
                    <input 
                      type="text"
                      [(ngModel)]="association.postalCode"
                      name="postalCode"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Ville <span class="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      [(ngModel)]="association.city"
                      name="city"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  </div>
                </div>
              </div>

              <!-- Images -->
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-cvac-blue mb-6">
                  <i class="fa-solid fa-images mr-2"></i>
                  Images
                </h2>
                
                <!-- Logo actuel -->
                <div *ngIf="association.logo" class="mb-4">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Logo actuel</label>
                  <div class="flex items-center gap-4">
                    <img [src]="getImageUrl(association.logo)" alt="Logo" class="w-24 h-24 object-contain border border-gray-300 rounded-lg p-2">
                    <button 
                      type="button"
                      (click)="association.logo = ''"
                      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      <i class="fa-solid fa-trash mr-2"></i>
                      Supprimer
                    </button>
                  </div>
                </div>

                <!-- Image de couverture actuelle -->
                <div *ngIf="association.coverImage" class="mb-4">
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Image de couverture actuelle</label>
                  <div class="flex items-center gap-4">
                    <img [src]="getImageUrl(association.coverImage)" alt="Couverture" class="w-48 h-32 object-cover border border-gray-300 rounded-lg">
                    <button 
                      type="button"
                      (click)="association.coverImage = ''"
                      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      <i class="fa-solid fa-trash mr-2"></i>
                      Supprimer
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      {{ association.logo ? 'Nouveau logo' : 'Logo' }}
                    </label>
                    <input 
                      type="file"
                      (change)="onLogoChange($event)"
                      accept="image/*"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                    <p class="text-xs text-gray-500 mt-1">Format recommandé: carré, max 2MB</p>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      {{ association.coverImage ? 'Nouvelle image de couverture' : 'Image de couverture' }}
                    </label>
                    <input 
                      type="file"
                      (change)="onCoverImageChange($event)"
                      accept="image/*"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                    <p class="text-xs text-gray-500 mt-1">Format recommandé: 16:9, max 5MB</p>
                  </div>
                </div>
              </div>

              <!-- Visibilité -->
              <div class="mb-8">
                <div class="bg-cvac-cream rounded-lg p-6">
                  <label class="flex items-start cursor-pointer">
                    <input 
                      type="checkbox"
                      [(ngModel)]="association.isPublic"
                      name="isPublic"
                      class="mt-1 mr-3 w-5 h-5 text-cvac-blue focus:ring-cvac-blue border-gray-300 rounded">
                    <div>
                      <span class="font-semibold text-gray-700">Rendre mon association visible dans l'annuaire public</span>
                      <p class="text-sm text-gray-600 mt-1">
                        En cochant cette case, votre association sera visible par tous les visiteurs du site une fois validée par un administrateur.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Boutons -->
              <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <!-- Bouton suppression -->
                <button 
                  type="button"
                  (click)="confirmDelete()"
                  [disabled]="deleting"
                  class="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <span *ngIf="!deleting">
                    <i class="fa-solid fa-trash mr-2"></i>
                    Supprimer l'association
                  </span>
                  <span *ngIf="deleting">
                    <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                    Suppression...
                  </span>
                </button>
                
                <!-- Boutons droite -->
                <div class="flex flex-col sm:flex-row gap-4">
                  <a 
                    routerLink="/profile"
                    class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center">
                    Annuler
                  </a>
                  <button 
                    type="submit"
                    [disabled]="!form.valid || submitting"
                    class="px-8 py-3 bg-cvac-blue text-white rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <span *ngIf="!submitting">
                      <i class="fa-solid fa-check mr-2"></i>
                      Enregistrer les modifications
                    </span>
                    <span *ngIf="submitting">
                      <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                      Enregistrement...
                    </span>
                  </button>
                </div>
              </div>
              
              <!-- Modal de confirmation de suppression -->
              <div *ngIf="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="showDeleteConfirm = false">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4" (click)="$event.stopPropagation()">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <i class="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
                      </div>
                      <h3 class="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
                    </div>
                    <p class="text-gray-600 mb-6">
                      Êtes-vous sûr de vouloir supprimer l'association <strong>{{ association.name }}</strong> ? Cette action est irréversible et toutes les données de l'association seront définitivement supprimées.
                    </p>
                    <div class="flex gap-4 justify-end">
                      <button 
                        (click)="showDeleteConfirm = false"
                        class="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                        Annuler
                      </button>
                      <button 
                        (click)="deleteAssociation()"
                        [disabled]="deleting"
                        class="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <span *ngIf="!deleting">
                          <i class="fa-solid fa-trash mr-2"></i>
                          Supprimer
                        </span>
                        <span *ngIf="deleting">
                          <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                          Suppression...
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message d'erreur -->
              <div *ngIf="error" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-800">{{ error }}</p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  `
})
export class DirectoryEditComponent implements OnInit {
  association: Partial<Association> = {};
  associationId: number | null = null;
  submitted = false;
  submitting = false;
  loading = true;
  accessDenied = false;
  error: string | null = null;
  currentYear = new Date().getFullYear();
  showDeleteConfirm = false;
  deleting = false;

  constructor(
    private associationService: AssociationService,
    private imageService: ImageService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Vérifier que l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // Récupérer l'ID de l'association depuis l'URL
    this.route.params.subscribe(params => {
      this.associationId = +params['id'];
      if (this.associationId) {
        this.loadAssociation();
      } else {
        this.loading = false;
        this.error = 'ID d\'association invalide';
      }
    });
  }

  loadAssociation() {
    if (!this.associationId) return;

    this.loading = true;
    this.error = null;

    this.associationService.getAssociationById(this.associationId).subscribe({
      next: (response) => {
        let associationData: any = null;
        
        if (response.success && response.data) {
          associationData = response.data;
        } else if (response.id) {
          associationData = response;
        }

        if (!associationData) {
          this.loading = false;
          this.error = 'Association non trouvée';
          return;
        }

        // Vérifier que l'utilisateur connecté est bien le propriétaire de l'association
        const user = this.authService.getStoredUser();
        if (!user || user.associationId !== this.associationId) {
          this.loading = false;
          this.accessDenied = true;
          return;
        }

        // Mapper les données de l'API vers le format attendu par le frontend
        this.association = {
          id: associationData.id,
          name: associationData.name,
          description: associationData.description,
          email: associationData.email,
          phone: associationData.phone,
          website: associationData.website,
          address: associationData.address,
          postalCode: associationData.postal_code,
          city: associationData.city,
          logo: associationData.logo,
          coverImage: associationData.cover_image,
          category: associationData.category,
          activities: associationData.activities,
          president: associationData.president,
          foundingYear: associationData.founding_year,
          numberOfMembers: associationData.number_of_members,
          isPublic: associationData.is_public === 1 || associationData.isPublic === true
        };

        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement association:', error);
        this.loading = false;
        this.error = 'Erreur lors du chargement de l\'association';
      }
    });
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file, 'logo');
    }
  }

  onCoverImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file, 'cover');
    }
  }

  uploadImage(file: File, type: 'logo' | 'cover') {
    this.imageService.uploadImage(file, 'association').then(
      (response) => {
        if (type === 'logo') {
          this.association.logo = response.url || response.publicId;
        } else {
          this.association.coverImage = response.url || response.publicId;
        }
      },
      (error) => {
        console.error('Erreur upload image:', error);
        this.error = 'Erreur lors de l\'upload de l\'image';
      }
    );
  }

  onSubmit() {
    if (!this.associationId) {
      this.error = 'ID d\'association invalide';
      return;
    }

    // Vérifier que l'utilisateur est toujours connecté et propriétaire
    const user = this.authService.getStoredUser();
    if (!user || user.associationId !== this.associationId) {
      this.error = 'Vous n\'êtes pas autorisé à modifier cette association';
      return;
    }

    if (!this.association.name || !this.association.description || !this.association.email || !this.association.city) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.submitting = true;
    this.error = null;

    const associationData: Association = {
      name: this.association.name!,
      description: this.association.description!,
      email: this.association.email!,
      phone: this.association.phone,
      website: this.association.website,
      address: this.association.address,
      postalCode: this.association.postalCode,
      city: this.association.city!,
      logo: this.association.logo,
      coverImage: this.association.coverImage,
      category: this.association.category,
      activities: this.association.activities,
      president: this.association.president,
      foundingYear: this.association.foundingYear,
      numberOfMembers: this.association.numberOfMembers,
      isPublic: this.association.isPublic ?? true
    };

    this.associationService.updateAssociation(this.associationId, associationData).subscribe({
      next: () => {
        this.submitted = true;
        this.submitting = false;
      },
      error: (error) => {
        console.error('Erreur modification association:', error);
        this.error = error.error?.error || error.error?.message || 'Une erreur est survenue lors de la modification. Veuillez réessayer.';
        this.submitting = false;
      }
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/assets/images/associations/${imagePath}`;
  }

  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  deleteAssociation() {
    if (!this.associationId) {
      this.error = 'ID d\'association invalide';
      return;
    }

    // Vérifier que l'utilisateur est toujours connecté et propriétaire
    const user = this.authService.getStoredUser();
    if (!user || user.associationId !== this.associationId) {
      this.error = 'Vous n\'êtes pas autorisé à supprimer cette association';
      return;
    }

    this.deleting = true;
    this.error = null;

    this.associationService.deleteAssociation(this.associationId).subscribe({
      next: () => {
        // Mettre à jour l'utilisateur pour retirer l'association_id (passer null)
        // Note: On passe 0 qui sera converti en NULL par l'API
        this.authService.updateUserAssociation(0).subscribe({
          next: (response) => {
            // Mettre à jour la session locale
            const currentUser = this.authService.getStoredUser();
            if (currentUser) {
              const updatedUser = { ...currentUser, associationId: undefined };
              localStorage.setItem('cvac_user', JSON.stringify(updatedUser));
            }
            // Rediriger vers le profil après suppression
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
            // Mettre à jour quand même localement
            const currentUser = this.authService.getStoredUser();
            if (currentUser) {
              const updatedUser = { ...currentUser, associationId: undefined };
              localStorage.setItem('cvac_user', JSON.stringify(updatedUser));
            }
            // Rediriger vers le profil
            this.router.navigate(['/profile']);
          }
        });
      },
      error: (error) => {
        console.error('Erreur suppression association:', error);
        this.error = error.error?.error || error.error?.message || 'Une erreur est survenue lors de la suppression. Veuillez réessayer.';
        this.deleting = false;
        this.showDeleteConfirm = false;
      }
    });
  }
}

