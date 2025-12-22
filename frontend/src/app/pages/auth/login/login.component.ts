import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main class="min-h-screen bg-cvac-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <!-- En-tête -->
        <div class="text-center mb-8">
          <div class="inline-block bg-gradient-to-br from-cvac-blue to-cvac-light-blue rounded-2xl p-4 mb-4">
            <i class="fa-solid fa-lock text-white text-3xl"></i>
          </div>
          <h1 class="text-4xl font-bold text-cvac-blue mb-2">Connexion</h1>
          <p class="text-gray-600">Accédez à votre espace personnel</p>
        </div>

        <!-- Formulaire -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            
            <!-- Message d'erreur -->
            <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div class="flex items-center">
                <i class="fa-solid fa-exclamation-circle text-red-600 mr-2"></i>
                <p class="text-red-800 text-sm">{{ error }}</p>
              </div>
            </div>

            <!-- Email -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-envelope mr-2 text-cvac-blue"></i>
                Adresse email
              </label>
              <input 
                type="email"
                [(ngModel)]="credentials.email"
                name="email"
                required
                autocomplete="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                placeholder="votre@email.com">
            </div>

            <!-- Mot de passe -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-lock mr-2 text-cvac-blue"></i>
                Mot de passe
              </label>
              <div class="relative">
                <input 
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="credentials.password"
                  name="password"
                  required
                  autocomplete="current-password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent pr-12"
                  placeholder="••••••••">
                <button 
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cvac-blue">
                  <i [class]="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Se souvenir de moi -->
            <div class="mb-6">
              <label class="flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  [(ngModel)]="rememberMe"
                  name="rememberMe"
                  class="w-4 h-4 text-cvac-blue border-gray-300 rounded focus:ring-cvac-blue">
                <span class="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
            </div>

            <!-- Bouton de connexion -->
            <button 
              type="submit"
              [disabled]="!loginForm.valid || loading"
              class="w-full bg-gradient-to-r from-cvac-blue to-cvac-light-blue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!loading">
                <i class="fa-solid fa-sign-in-alt mr-2"></i>
                Se connecter
              </span>
              <span *ngIf="loading">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Connexion...
              </span>
            </button>

            <!-- Lien mot de passe oublié -->
            <div class="mt-4 text-center">
              <a routerLink="/forgot-password" class="text-sm text-cvac-blue hover:text-cvac-light-blue">
                Mot de passe oublié ?
              </a>
            </div>
          </form>

          <!-- Séparateur -->
          <div class="mt-8 mb-6 flex items-center">
            <div class="flex-1 border-t border-gray-300"></div>
            <span class="px-4 text-sm text-gray-500">ou</span>
            <div class="flex-1 border-t border-gray-300"></div>
          </div>

          <!-- Lien inscription -->
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-2">Vous n'avez pas de compte ?</p>
            <a 
              routerLink="/signup"
              class="text-cvac-blue font-semibold hover:text-cvac-light-blue">
              Créer un compte
            </a>
          </div>
        </div>
      </div>
    </main>
  `
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };
  
  showPassword = false;
  rememberMe = false;
  loading = false;
  error: string | null = null;
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Récupérer l'URL de retour si présente
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Si déjà connecté, rediriger
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response) => {
        if (response.success) {
          // Rediriger vers l'URL de retour ou la page d'accueil
          this.router.navigate([this.returnUrl]);
        } else {
          this.error = response.message || 'Email ou mot de passe incorrect';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erreur connexion:', error);
        this.error = 'Une erreur est survenue. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }
}

