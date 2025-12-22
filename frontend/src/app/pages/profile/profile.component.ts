import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { AssociationService, Association } from '../../services/association.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main class="min-h-screen bg-cvac-cream py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- En-tête -->
        <div class="text-center mb-8">
          <div class="inline-block bg-gradient-to-br from-cvac-blue to-cvac-light-blue rounded-2xl p-4 mb-4">
            <i class="fa-solid fa-user-circle text-white text-3xl"></i>
          </div>
          <h1 class="text-4xl font-bold text-cvac-blue mb-2">Mon Profil</h1>
          <p class="text-gray-600">Gérez vos informations personnelles et votre association</p>
        </div>

        <!-- Informations personnelles -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 class="text-2xl font-bold text-cvac-blue mb-6">
            <i class="fa-solid fa-user mr-2"></i>
            Informations personnelles
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Prénom
              </label>
              <input 
                type="text"
                [value]="user?.firstname || ''"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                readonly>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Nom
              </label>
              <input 
                type="text"
                [value]="user?.lastname || ''"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                readonly>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input 
                type="email"
                [value]="user?.email || ''"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                readonly>
            </div>
          </div>
        </div>

        <!-- Association -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-cvac-blue mb-6">
            <i class="fa-solid fa-building mr-2"></i>
            Mon Association
          </h2>

          <!-- Message de chargement -->
          <div *ngIf="loadingAssociation" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
            <p class="mt-2 text-gray-600">Chargement...</p>
          </div>

          <!-- Aucune association -->
          <div *ngIf="!loadingAssociation && !user?.associationId" class="text-center py-8">
            <div class="w-16 h-16 bg-cvac-cream rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-building text-cvac-blue text-2xl"></i>
            </div>
            <p class="text-gray-600 mb-4">Vous n'êtes associé à aucune association pour le moment.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                routerLink="/directory/register"
                class="inline-block bg-cvac-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors">
                <i class="fa-solid fa-plus mr-2"></i>
                Créer une association
              </a>
              <button 
                (click)="showAssociationSelector = true"
                class="inline-block bg-cvac-cream text-cvac-blue px-6 py-3 rounded-lg font-semibold hover:bg-cvac-blue hover:text-white transition-colors border border-cvac-blue">
                <i class="fa-solid fa-search mr-2"></i>
                Rejoindre une association existante
              </button>
            </div>
          </div>

          <!-- Association actuelle -->
          <div *ngIf="!loadingAssociation && user?.associationId && currentAssociation" class="space-y-6">
            <!-- Carte de l'association -->
            <div class="bg-gradient-to-br from-cvac-blue to-cvac-light-blue rounded-xl p-6 text-white">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-2xl font-bold mb-2">{{ currentAssociation.name }}</h3>
                  <p class="text-white/90 mb-4">{{ currentAssociation.description }}</p>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <div *ngIf="currentAssociation.city">
                      <i class="fa-solid fa-location-dot mr-2"></i>
                      {{ currentAssociation.city }}
                    </div>
                    <div *ngIf="currentAssociation.category">
                      <i class="fa-solid fa-tag mr-2"></i>
                      {{ currentAssociation.category }}
                    </div>
                  </div>
                </div>
                <div *ngIf="currentAssociation.logo" class="w-20 h-20 bg-white rounded-lg p-2 ml-4">
                  <img [src]="getImageUrl(currentAssociation.logo)" [alt]="currentAssociation.name" class="w-full h-full object-contain">
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-4">
              <a 
                [routerLink]="['/directory', currentAssociation.id]"
                class="flex-1 bg-cvac-cream text-cvac-blue px-6 py-3 rounded-lg font-semibold hover:bg-cvac-blue hover:text-white transition-colors text-center">
                <i class="fa-solid fa-eye mr-2"></i>
                Voir la fiche de l'association
              </a>
              <a 
                [routerLink]="['/directory', currentAssociation.id, 'edit']"
                class="flex-1 bg-cvac-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors text-center">
                <i class="fa-solid fa-edit mr-2"></i>
                Modifier mon association
              </a>
              <button 
                (click)="showAssociationSelector = true"
                class="flex-1 bg-white border-2 border-cvac-blue text-cvac-blue px-6 py-3 rounded-lg font-semibold hover:bg-cvac-blue hover:text-white transition-colors">
                <i class="fa-solid fa-exchange-alt mr-2"></i>
                Changer d'association
              </button>
            </div>
          </div>

          <!-- Sélecteur d'association -->
          <div *ngIf="showAssociationSelector" class="mt-6 p-6 bg-cvac-cream rounded-xl border-2 border-cvac-blue" #associationSelector>
            <h3 class="text-lg font-bold text-cvac-blue mb-4">Sélectionner une association</h3>
            
            <div class="mb-4">
              <div class="relative">
                <input 
                  type="text"
                  [(ngModel)]="associationSearch"
                  (input)="searchAssociations()"
                  placeholder="Rechercher une association..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                <i class="fa-solid fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <!-- Liste des associations -->
            <div *ngIf="associationSearch && filteredAssociations.length > 0" class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg mb-4">
              <div 
                *ngFor="let asso of filteredAssociations"
                (click)="selectAssociation(asso)"
                class="px-4 py-3 hover:bg-cvac-cream cursor-pointer border-b border-gray-100 last:border-b-0"
                [class.bg-cvac-cream]="selectedAssociation?.id === asso.id">
                <div class="font-semibold text-cvac-blue">{{ asso.name }}</div>
                <div class="text-xs text-gray-500">{{ asso.city }} • {{ asso.category }}</div>
              </div>
            </div>

            <div *ngIf="associationSearch && filteredAssociations.length === 0" class="text-sm text-gray-500 text-center py-4 mb-4">
              Aucune association trouvée
            </div>

            <div class="flex gap-4">
              <button 
                (click)="updateAssociation()"
                [disabled]="!selectedAssociation || updating"
                class="flex-1 bg-cvac-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span *ngIf="!updating">
                  <i class="fa-solid fa-check mr-2"></i>
                  Valider
                </span>
                <span *ngIf="updating">
                  <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                  Mise à jour...
                </span>
              </button>
              <button 
                (click)="cancelAssociationSelection()"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Annuler
              </button>
            </div>
          </div>

          <!-- Message de succès/erreur -->
          <div *ngIf="message" class="mt-4 p-4 rounded-lg" [class.bg-green-50]="messageType === 'success'" [class.bg-red-50]="messageType === 'error'" [class.border-green-200]="messageType === 'success'" [class.border-red-200]="messageType === 'error'" [class.border]="true">
            <p [class.text-green-800]="messageType === 'success'" [class.text-red-800]="messageType === 'error'">{{ message }}</p>
          </div>
        </div>
      </div>
    </main>
  `
})
export class ProfileComponent implements OnInit {
  @ViewChild('associationSelector') associationSelectorElement?: ElementRef;
  
  user: User | null = null;
  currentAssociation: Association | null = null;
  loadingAssociation = false;
  
  // Sélection d'association
  showAssociationSelector = false;
  associationSearch = '';
  associations: Association[] = [];
  filteredAssociations: Association[] = [];
  selectedAssociation: Association | null = null;
  updating = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';

  constructor(
    private authService: AuthService,
    private associationService: AssociationService,
    private elementRef: ElementRef
  ) {}
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Fermer le sélecteur d'association si on clique en dehors
    if (this.showAssociationSelector) {
      const selectorEl = this.associationSelectorElement?.nativeElement;
      const buttonEls = this.elementRef.nativeElement.querySelectorAll('button[class*="exchange-alt"], button[class*="search"]');
      const clickedInside = selectorEl && selectorEl.contains(event.target);
      const clickedOnButton = Array.from(buttonEls).some((btn: any) => btn.contains(event.target));
      
      if (!clickedInside && !clickedOnButton) {
        this.showAssociationSelector = false;
        this.associationSearch = '';
        this.filteredAssociations = [];
        this.selectedAssociation = null;
      }
    }
  }

  ngOnInit() {
    // Récupérer l'utilisateur actuel
    this.user = this.authService.getCurrentUser();
    
    if (!this.user) {
      // Rediriger vers la connexion si pas d'utilisateur
      return;
    }

    // Charger l'association de l'utilisateur
    if (this.user.associationId) {
      this.loadAssociation(this.user.associationId);
    }

    // Charger toutes les associations pour la recherche
    this.loadAssociations();
  }

  loadAssociation(id: number) {
    this.loadingAssociation = true;
    this.associationService.getAssociationById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentAssociation = response.data;
        } else if (response.id) {
          this.currentAssociation = response;
        }
        this.loadingAssociation = false;
      },
      error: () => {
        this.loadingAssociation = false;
      }
    });
  }

  loadAssociations() {
    this.associationService.getPublicAssociations().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.associations = response.data;
        } else if (Array.isArray(response)) {
          this.associations = response;
        }
      },
      error: () => {
        this.associations = [];
      }
    });
  }

  searchAssociations() {
    if (!this.associationSearch || this.associationSearch.length < 2) {
      this.filteredAssociations = [];
      return;
    }

    const query = this.associationSearch.toLowerCase();
    this.filteredAssociations = this.associations.filter(asso => 
      asso.name.toLowerCase().includes(query) ||
      asso.city.toLowerCase().includes(query) ||
      (asso.category && asso.category.toLowerCase().includes(query))
    ).slice(0, 10);
  }

  selectAssociation(association: Association) {
    this.selectedAssociation = association;
  }

  updateAssociation() {
    if (!this.selectedAssociation || !this.user) {
      return;
    }

    this.updating = true;
    this.message = null;

    // Mettre à jour l'association de l'utilisateur via l'API
    // Note: Vous devrez créer un endpoint pour mettre à jour l'associationId de l'utilisateur
    // Pour l'instant, on met à jour localement
    const updatedUser: User = {
      ...this.user,
      associationId: this.selectedAssociation.id
    };

    // TODO: Appel API pour mettre à jour l'associationId
    // this.authService.updateUserAssociation(this.selectedAssociation.id).subscribe({
    //   next: () => {
    //     this.authService.updateUser(updatedUser);
    //     this.user = updatedUser;
    //     this.currentAssociation = this.selectedAssociation;
    //     this.showAssociationSelector = false;
    //     this.selectedAssociation = null;
    //     this.associationSearch = '';
    //     this.message = 'Association mise à jour avec succès !';
    //     this.messageType = 'success';
    //     this.updating = false;
    //   },
    //   error: () => {
    //     this.message = 'Erreur lors de la mise à jour';
    //     this.messageType = 'error';
    //     this.updating = false;
    //   }
    // });

    // Solution temporaire : mise à jour locale
    this.authService.updateUser(updatedUser);
    this.user = updatedUser;
    this.currentAssociation = this.selectedAssociation;
    this.showAssociationSelector = false;
    this.selectedAssociation = null;
    this.associationSearch = '';
    this.message = 'Association mise à jour avec succès !';
    this.messageType = 'success';
    this.updating = false;

    setTimeout(() => {
      this.message = null;
    }, 3000);
  }

  cancelAssociationSelection() {
    this.showAssociationSelector = false;
    this.selectedAssociation = null;
    this.associationSearch = '';
    this.filteredAssociations = [];
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/assets/images/associations/${imagePath}`;
  }
}

