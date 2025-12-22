import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssociationService, Association } from '../../../services/association.service';
import { ImageService } from '../../../services/image.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-directory-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main>
      <!-- En-tête -->
      <section class="bg-gradient-to-br from-cvac-blue to-cvac-light-blue py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-5xl font-bold text-white mb-4">Inscrire mon association</h1>
          <p class="text-xl text-white/90 max-w-3xl mx-auto">
            Rejoignez l'annuaire des associations de Choisy-le-Roi et faites connaître votre structure
          </p>
        </div>
      </section>

      <!-- Formulaire -->
      <section class="py-16 bg-cvac-cream">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            <!-- Message de succès -->
            <div *ngIf="submitted" class="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div class="flex items-start">
                <i class="fa-solid fa-check-circle text-green-600 text-2xl mr-3"></i>
                <div>
                  <h3 class="text-lg font-bold text-green-800 mb-2">Inscription réussie !</h3>
                  <p class="text-green-700 mb-4">
                    Votre association a été enregistrée avec succès. Elle sera visible dans l'annuaire une fois validée par un administrateur.
                  </p>
                  <a routerLink="/directory" class="text-green-700 hover:text-green-800 font-semibold">
                    ← Retour à l'annuaire
                  </a>
                </div>
              </div>
            </div>

            <!-- Message si l'utilisateur a déjà une association -->
            <div *ngIf="userHasAssociation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div class="flex items-start">
                <i class="fa-solid fa-exclamation-triangle text-yellow-600 text-2xl mr-3"></i>
                <div>
                  <h3 class="text-lg font-bold text-yellow-800 mb-2">Association déjà existante</h3>
                  <p class="text-yellow-700 mb-4">
                    Vous avez déjà une association liée à votre compte. Vous ne pouvez créer qu'une seule association.
                  </p>
                  <a routerLink="/profile" class="text-yellow-700 hover:text-yellow-800 font-semibold">
                    Voir mon profil →
                  </a>
                </div>
              </div>
            </div>

            <!-- Formulaire -->
            <form *ngIf="!submitted && !userHasAssociation" (ngSubmit)="onSubmit()" #form="ngForm">
              
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
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Logo
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
                      Image de couverture
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
              <div class="flex flex-col sm:flex-row gap-4 justify-end">
                <a 
                  routerLink="/directory"
                  class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center">
                  Annuler
                </a>
                <button 
                  type="submit"
                  [disabled]="!form.valid || submitting"
                  class="px-8 py-3 bg-cvac-blue text-white rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <span *ngIf="!submitting">
                    <i class="fa-solid fa-check mr-2"></i>
                    Enregistrer mon association
                  </span>
                  <span *ngIf="submitting">
                    <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                    Enregistrement...
                  </span>
                </button>
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
export class DirectoryRegisterComponent implements OnInit {
  association: Partial<Association> = {
    name: '',
    description: '',
    email: '',
    city: 'Choisy-le-Roi',
    isPublic: true
  };
  
  submitted = false;
  submitting = false;
  error: string | null = null;
  currentYear = new Date().getFullYear();
  userHasAssociation = false;

  constructor(
    private associationService: AssociationService,
    private imageService: ImageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est connecté et s'il a déjà une association
    const user = this.authService.getStoredUser();
    if (user) {
      // Pré-remplir l'email avec l'email de l'utilisateur
      if (user.email && !this.association.email) {
        this.association.email = user.email;
      }
      
      // Vérifier si l'utilisateur a déjà une association
      if (user.associationId) {
        this.userHasAssociation = true;
        this.error = 'Vous avez déjà une association liée à votre compte. Vous ne pouvez créer qu\'une seule association.';
      }
    }
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
    // Vérifier que l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/directory/register' } });
      return;
    }

    // Vérifier si l'utilisateur a déjà une association
    const user = this.authService.getStoredUser();
    if (user?.associationId) {
      this.error = 'Vous avez déjà une association liée à votre compte.';
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

    this.associationService.createAssociation(associationData).subscribe({
      next: (response) => {
        // Si l'association a été créée avec succès, lier l'utilisateur à cette association
        if (response.success && response.data?.id) {
          const associationId = response.data.id;
          const user = this.authService.getStoredUser();
          
          if (user) {
            // Mettre à jour l'associationId de l'utilisateur
            this.authService.updateUserAssociation(associationId).subscribe({
              next: () => {
                console.log('Association liée à l\'utilisateur avec succès');
                this.submitted = true;
                this.submitting = false;
              },
              error: (error) => {
                console.error('Erreur lors de la liaison de l\'association:', error);
                // L'association a été créée mais la liaison a échoué
                // On affiche quand même le message de succès
                this.submitted = true;
                this.submitting = false;
              }
            });
          } else {
            this.submitted = true;
            this.submitting = false;
          }
        } else {
          this.submitted = true;
          this.submitting = false;
        }
      },
      error: (error) => {
        console.error('Erreur création association:', error);
        this.error = error.error?.error || error.error?.message || 'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.';
        this.submitting = false;
      }
    });
  }
}
