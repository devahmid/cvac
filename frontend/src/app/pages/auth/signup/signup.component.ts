import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AssociationService, Association } from '../../../services/association.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main class="min-h-screen bg-cvac-cream py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <!-- En-tête -->
        <div class="text-center mb-8">
          <div class="inline-block bg-gradient-to-br from-cvac-blue to-cvac-light-blue rounded-2xl p-4 mb-4">
            <i class="fa-solid fa-user-plus text-white text-3xl"></i>
          </div>
          <h1 class="text-4xl font-bold text-cvac-blue mb-2">Créer un compte</h1>
          <p class="text-gray-600">Rejoignez la communauté CVAC</p>
        </div>

        <!-- Formulaire -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <form (ngSubmit)="onSubmit()" #signupForm="ngForm">
            
            <!-- Message d'erreur -->
            <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div class="flex items-center">
                <i class="fa-solid fa-exclamation-circle text-red-600 mr-2"></i>
                <p class="text-red-800 text-sm">{{ error }}</p>
              </div>
            </div>

            <!-- Message de succès -->
            <div *ngIf="success" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div class="flex items-center">
                <i class="fa-solid fa-check-circle text-green-600 mr-2"></i>
                <p class="text-green-800 text-sm">{{ success }}</p>
              </div>
            </div>

            <!-- Informations personnelles -->
            <div class="mb-6">
              <h2 class="text-xl font-bold text-cvac-blue mb-4">
                <i class="fa-solid fa-user mr-2"></i>
                Informations personnelles
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    [(ngModel)]="userData.firstname"
                    name="firstname"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                    placeholder="Jean">
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Nom <span class="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    [(ngModel)]="userData.lastname"
                    name="lastname"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                    placeholder="Dupont">
                </div>
              </div>
            </div>

            <!-- Informations de connexion -->
            <div class="mb-6">
              <h2 class="text-xl font-bold text-cvac-blue mb-4">
                <i class="fa-solid fa-lock mr-2"></i>
                Informations de connexion
              </h2>
              
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email <span class="text-red-500">*</span>
                </label>
                <input 
                  type="email"
                  [(ngModel)]="userData.email"
                  name="email"
                  required
                  autocomplete="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                  placeholder="votre@email.com">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Mot de passe <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      [type]="showPassword ? 'text' : 'password'"
                      [(ngModel)]="userData.password"
                      name="password"
                      required
                      autocomplete="new-password"
                      (input)="checkPasswordStrength()"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent pr-12"
                      placeholder="••••••••">
                    <button 
                      type="button"
                      (click)="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cvac-blue">
                      <i [class]="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>
                  <!-- Indicateur de force du mot de passe -->
                  <div *ngIf="userData.password" class="mt-2">
                    <div class="flex gap-1">
                      <div [class]="getPasswordStrengthClass(0)"></div>
                      <div [class]="getPasswordStrengthClass(1)"></div>
                      <div [class]="getPasswordStrengthClass(2)"></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">{{ passwordStrengthText }}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmer le mot de passe <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      [type]="showConfirmPassword ? 'text' : 'password'"
                      [(ngModel)]="confirmPassword"
                      name="confirmPassword"
                      required
                      autocomplete="new-password"
                      class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent pr-12"
                      [class.border-red-300]="confirmPassword && userData.password !== confirmPassword"
                      [class.border-gray-300]="!confirmPassword || userData.password === confirmPassword"
                      placeholder="••••••••">
                    <button 
                      type="button"
                      (click)="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cvac-blue">
                      <i [class]="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>
                  <p *ngIf="confirmPassword && userData.password !== confirmPassword" class="text-xs text-red-500 mt-1">
                    Les mots de passe ne correspondent pas
                  </p>
                </div>
              </div>
            </div>

            <!-- Association -->
            <div class="mb-6">
              <h2 class="text-xl font-bold text-cvac-blue mb-4">
                <i class="fa-solid fa-building mr-2"></i>
                Association
              </h2>
              
              <div class="mb-4">
                <label class="flex items-center mb-3">
                  <input 
                    type="radio"
                    [(ngModel)]="associationChoice"
                    name="associationChoice"
                    value="existing"
                    (change)="onAssociationChoiceChange('existing')"
                    class="w-4 h-4 text-cvac-blue border-gray-300 focus:ring-cvac-blue">
                  <span class="ml-2 text-sm font-semibold text-gray-700">Je suis membre d'une association existante</span>
                </label>
                
                <label class="flex items-center">
                  <input 
                    type="radio"
                    [(ngModel)]="associationChoice"
                    name="associationChoice"
                    value="new"
                    (change)="onAssociationChoiceChange('new')"
                    class="w-4 h-4 text-cvac-blue border-gray-300 focus:ring-cvac-blue">
                  <span class="ml-2 text-sm font-semibold text-gray-700">Je crée une nouvelle association</span>
                </label>
                
                <label class="flex items-center mt-3">
                  <input 
                    type="radio"
                    [(ngModel)]="associationChoice"
                    name="associationChoice"
                    value="none"
                    (change)="onAssociationChoiceChange('none')"
                    class="w-4 h-4 text-cvac-blue border-gray-300 focus:ring-cvac-blue">
                  <span class="ml-2 text-sm font-semibold text-gray-700">Je ne suis pas membre d'une association</span>
                </label>
              </div>

              <!-- Sélection association existante -->
              <div *ngIf="associationChoice === 'existing'" class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Sélectionner une association <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input 
                    type="text"
                    [(ngModel)]="associationSearch"
                    (input)="searchAssociations()"
                    name="associationSearch"
                    placeholder="Rechercher une association..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  <i class="fa-solid fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                
                <!-- Liste des associations -->
                <div *ngIf="associationSearch && filteredAssociations.length > 0" class="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                  <div 
                    *ngFor="let asso of filteredAssociations"
                    (click)="selectAssociation(asso)"
                    class="px-4 py-3 hover:bg-cvac-cream cursor-pointer border-b border-gray-100 last:border-b-0"
                    [class.bg-cvac-cream]="selectedAssociation?.id === asso.id">
                    <div class="font-semibold text-cvac-blue">{{ asso.name }}</div>
                    <div class="text-xs text-gray-500">{{ asso.city }} • {{ asso.category }}</div>
                  </div>
                </div>
                
                <div *ngIf="associationSearch && filteredAssociations.length === 0 && !loadingAssociations" class="mt-2 text-sm text-gray-500 text-center py-2">
                  Aucune association trouvée
                </div>
                
                <div *ngIf="selectedAssociation" class="mt-3 p-3 bg-cvac-cream rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-cvac-blue">{{ selectedAssociation.name }}</div>
                      <div class="text-xs text-gray-600">{{ selectedAssociation.city }}</div>
                    </div>
                    <button 
                      type="button"
                      (click)="selectedAssociation = null; userData.associationId = undefined"
                      class="text-red-500 hover:text-red-700">
                      <i class="fa-solid fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Créer nouvelle association -->
              <div *ngIf="associationChoice === 'new'" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-800 mb-3">
                  <i class="fa-solid fa-info-circle mr-2"></i>
                  Vous pourrez créer votre association après l'inscription depuis votre profil.
                </p>
                <a 
                  routerLink="/directory/register"
                  class="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                  Créer mon association maintenant →
                </a>
              </div>
            </div>

            <!-- Conditions d'utilisation -->
            <div class="mb-6">
              <label class="flex items-start cursor-pointer">
                <input 
                  type="checkbox"
                  [(ngModel)]="acceptTerms"
                  name="acceptTerms"
                  required
                  class="mt-1 w-4 h-4 text-cvac-blue border-gray-300 rounded focus:ring-cvac-blue">
                <span class="ml-2 text-sm text-gray-600">
                  J'accepte les <a href="/legal" target="_blank" class="text-cvac-blue hover:underline">conditions d'utilisation</a> 
                  et la <a href="/legal" target="_blank" class="text-cvac-blue hover:underline">politique de confidentialité</a> <span class="text-red-500">*</span>
                </span>
              </label>
            </div>

            <!-- Bouton d'inscription -->
            <button 
              type="submit"
              [disabled]="!signupForm.valid || loading || userData.password !== confirmPassword"
              class="w-full bg-gradient-to-r from-cvac-blue to-cvac-light-blue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!loading">
                <i class="fa-solid fa-user-plus mr-2"></i>
                Créer mon compte
              </span>
              <span *ngIf="loading">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Création du compte...
              </span>
            </button>
          </form>

          <!-- Séparateur -->
          <div class="mt-8 mb-6 flex items-center">
            <div class="flex-1 border-t border-gray-300"></div>
            <span class="px-4 text-sm text-gray-500">ou</span>
            <div class="flex-1 border-t border-gray-300"></div>
          </div>

          <!-- Lien connexion -->
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-2">Vous avez déjà un compte ?</p>
            <a 
              routerLink="/login"
              class="text-cvac-blue font-semibold hover:text-cvac-light-blue">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </main>
  `
})
export class SignupComponent implements OnInit {
  userData = {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    associationId: undefined as number | undefined
  };
  
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  acceptTerms = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  passwordStrength = 0;
  
  // Association
  associationChoice: 'existing' | 'new' | 'none' = 'none';
  associationSearch = '';
  associations: Association[] = [];
  filteredAssociations: Association[] = [];
  selectedAssociation: Association | null = null;
  loadingAssociations = false;

  constructor(
    private authService: AuthService,
    private associationService: AssociationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si déjà connecté, rediriger
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    
    // Charger toutes les associations pour la recherche
    this.loadAssociations();
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
        // En cas d'erreur, continuer sans les associations
        this.associations = [];
      }
    });
  }

  onAssociationChoiceChange(choice: string) {
    this.associationChoice = choice as 'existing' | 'new' | 'none';
    this.selectedAssociation = null;
    this.userData.associationId = undefined;
    this.associationSearch = '';
    this.filteredAssociations = [];
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
    ).slice(0, 10); // Limiter à 10 résultats
  }

  selectAssociation(association: Association) {
    this.selectedAssociation = association;
    this.userData.associationId = association.id;
    this.associationSearch = association.name;
    this.filteredAssociations = [];
  }

  checkPasswordStrength() {
    const password = this.userData.password;
    if (!password) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password) && /[^a-zA-Z\d]/.test(password)) strength++;

    this.passwordStrength = strength;
  }

  getPasswordStrengthClass(index: number): string {
    const baseClass = 'h-1 flex-1 rounded';
    if (index < this.passwordStrength) {
      if (this.passwordStrength === 1) return `${baseClass} bg-red-500`;
      if (this.passwordStrength === 2) return `${baseClass} bg-yellow-500`;
      if (this.passwordStrength === 3) return `${baseClass} bg-green-500`;
    }
    return `${baseClass} bg-gray-200`;
  }

  get passwordStrengthText(): string {
    switch (this.passwordStrength) {
      case 0:
        return 'Très faible';
      case 1:
        return 'Faible';
      case 2:
        return 'Moyen';
      case 3:
        return 'Fort';
      default:
        return '';
    }
  }

  onSubmit() {
    if (this.userData.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.acceptTerms) {
      this.error = 'Vous devez accepter les conditions d\'utilisation';
      return;
    }

    if (this.associationChoice === 'existing' && !this.selectedAssociation) {
      this.error = 'Veuillez sélectionner une association';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    // Préparer les données d'inscription
    const signupData: any = {
      email: this.userData.email,
      password: this.userData.password,
      firstname: this.userData.firstname,
      lastname: this.userData.lastname
    };

    // Ajouter l'ID de l'association si sélectionnée
    if (this.associationChoice === 'existing' && this.userData.associationId) {
      signupData.associationId = this.userData.associationId;
    }

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = 'Compte créé avec succès ! Redirection...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        } else {
          this.error = response.message || 'Une erreur est survenue lors de la création du compte';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erreur inscription:', error);
        this.error = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }
}

