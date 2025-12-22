import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
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
          <h1 class="text-4xl font-bold text-cvac-blue mb-2">Réinitialiser le mot de passe</h1>
          <p class="text-gray-600">Entrez votre nouveau mot de passe</p>
        </div>

        <!-- Formulaire -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <form (ngSubmit)="onSubmit()" #resetPasswordForm="ngForm">
            
            <!-- Message de succès -->
            <div *ngIf="success" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div class="flex items-start">
                <i class="fa-solid fa-check-circle text-green-600 text-xl mr-3"></i>
                <div>
                  <h3 class="font-semibold text-green-800 mb-1">Mot de passe réinitialisé !</h3>
                  <p class="text-green-700 text-sm mb-3">
                    Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
                  </p>
                  <a 
                    routerLink="/login"
                    class="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                    Se connecter
                  </a>
                </div>
              </div>
            </div>

            <!-- Message d'erreur -->
            <div *ngIf="error && !success" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div class="flex items-center">
                <i class="fa-solid fa-exclamation-circle text-red-600 mr-2"></i>
                <p class="text-red-800 text-sm">{{ error }}</p>
              </div>
            </div>

            <!-- Message token invalide -->
            <div *ngIf="invalidToken" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div class="flex items-start">
                <i class="fa-solid fa-exclamation-triangle text-yellow-600 text-xl mr-3"></i>
                <div>
                  <h3 class="font-semibold text-yellow-800 mb-1">Lien invalide ou expiré</h3>
                  <p class="text-yellow-700 text-sm mb-3">
                    Ce lien de réinitialisation n'est plus valide. Veuillez demander un nouveau lien.
                  </p>
                  <a 
                    routerLink="/forgot-password"
                    class="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-700 transition-colors">
                    Demander un nouveau lien
                  </a>
                </div>
              </div>
            </div>

            <!-- Formulaire -->
            <div *ngIf="!success && !invalidToken">
              <!-- Nouveau mot de passe -->
              <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-lock mr-2 text-cvac-blue"></i>
                  Nouveau mot de passe
                </label>
                <div class="relative">
                  <input 
                    [type]="showPassword ? 'text' : 'password'"
                    [(ngModel)]="password"
                    name="password"
                    required
                    minlength="8"
                    autocomplete="new-password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent pr-12"
                    placeholder="••••••••">
                  <button 
                    type="button"
                    (click)="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cvac-blue">
                    <i [class]="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
              </div>

              <!-- Confirmation mot de passe -->
              <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fa-solid fa-lock mr-2 text-cvac-blue"></i>
                  Confirmer le mot de passe
                </label>
                <div class="relative">
                  <input 
                    [type]="showConfirmPassword ? 'text' : 'password'"
                    [(ngModel)]="confirmPassword"
                    name="confirmPassword"
                    required
                    autocomplete="new-password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent pr-12"
                    placeholder="••••••••">
                  <button 
                    type="button"
                    (click)="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cvac-blue">
                    <i [class]="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </button>
                </div>
                <p *ngIf="password && confirmPassword && password !== confirmPassword" class="text-xs text-red-500 mt-1">
                  Les mots de passe ne correspondent pas
                </p>
              </div>

              <!-- Bouton -->
              <button 
                type="submit"
                [disabled]="!resetPasswordForm.valid || loading || password !== confirmPassword"
                class="w-full bg-cvac-blue text-white py-3 rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4">
                <span *ngIf="!loading">
                  <i class="fa-solid fa-check mr-2"></i>
                  Réinitialiser le mot de passe
                </span>
                <span *ngIf="loading">
                  <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                  Réinitialisation...
                </span>
              </button>

              <!-- Lien retour connexion -->
              <div class="text-center">
                <a 
                  routerLink="/login"
                  class="text-sm text-cvac-blue hover:text-cvac-light-blue">
                  <i class="fa-solid fa-arrow-left mr-1"></i>
                  Retour à la connexion
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  `
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  error: string | null = null;
  success = false;
  invalidToken = false;
  token: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Récupérer le token depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      if (!this.token) {
        this.invalidToken = true;
        this.error = 'Token de réinitialisation manquant';
      }
    });
  }

  onSubmit() {
    if (!this.token) {
      this.invalidToken = true;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Le mot de passe doit contenir au moins 8 caractères';
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.resetPassword(this.token, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.success = true;
        } else {
          this.error = response.message || 'Une erreur est survenue';
          if (response.message?.includes('invalide') || response.message?.includes('expiré')) {
            this.invalidToken = true;
          }
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Une erreur est survenue lors de la réinitialisation';
        if (error.error?.message?.includes('invalide') || error.error?.message?.includes('expiré')) {
          this.invalidToken = true;
        }
      }
    });
  }
}

