import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main class="min-h-screen bg-cvac-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <!-- En-tête -->
        <div class="text-center mb-8">
          <div class="inline-block bg-gradient-to-br from-cvac-blue to-cvac-light-blue rounded-2xl p-4 mb-4">
            <i class="fa-solid fa-key text-white text-3xl"></i>
          </div>
          <h1 class="text-4xl font-bold text-cvac-blue mb-2">Mot de passe oublié</h1>
          <p class="text-gray-600">Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
        </div>

        <!-- Formulaire -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <form (ngSubmit)="onSubmit()" #forgotPasswordForm="ngForm">
            
            <!-- Message de succès -->
            <div *ngIf="success" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div class="flex items-start">
                <i class="fa-solid fa-check-circle text-green-600 text-xl mr-3"></i>
                <div>
                  <h3 class="font-semibold text-green-800 mb-1">Email envoyé !</h3>
                  <p class="text-green-700 text-sm">
                    Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe.
                  </p>
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

            <!-- Email -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-envelope mr-2 text-cvac-blue"></i>
                Adresse email
              </label>
              <input 
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                autocomplete="email"
                [disabled]="success"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="votre@email.com">
            </div>

            <!-- Bouton -->
            <button 
              type="submit"
              [disabled]="!forgotPasswordForm.valid || loading || success"
              class="w-full bg-cvac-blue text-white py-3 rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4">
              <span *ngIf="!loading">
                <i class="fa-solid fa-paper-plane mr-2"></i>
                Envoyer le lien de réinitialisation
              </span>
              <span *ngIf="loading">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Envoi en cours...
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
          </form>
        </div>
      </div>
    </main>
  `
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  error: string | null = null;
  success = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email) {
      this.error = 'Veuillez entrer votre adresse email';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = false;

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.success = true;
        } else {
          this.error = response.message || 'Une erreur est survenue';
        }
      },
      error: (error) => {
        this.loading = false;
        // Pour des raisons de sécurité, on affiche toujours un message de succès
        // même si l'email n'existe pas dans la base
        this.success = true;
        console.error('Erreur mot de passe oublié:', error);
      }
    });
  }
}

