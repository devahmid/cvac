import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <a routerLink="/" class="flex items-center">
            <div class="w-16 h-16 flex items-center justify-center">
              <img src="/assets/images/members/logo-def-CVAC.png" alt="Logo CVAC" class="w-full h-full object-contain">
            </div>
          </a>
          
          <nav class="hidden lg:flex space-x-8 items-center">
            <a routerLink="/" routerLinkActive="text-cvac-blue font-semibold" [routerLinkActiveOptions]="{exact: true}" class="text-gray-700 hover:text-cvac-blue transition-colors">Accueil</a>
            <a routerLink="/about" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Le CVAC</a>
            <a routerLink="/missions-values" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Missions & Valeurs</a>
            <a routerLink="/members" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Les Membres</a>
            <a routerLink="/directory" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Annuaire</a>
            <a routerLink="/news" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Actualités</a>
            <a routerLink="/contact" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Contact</a>
            
            <!-- Menu utilisateur -->
            <div *ngIf="currentUser" class="relative ml-4" #userMenu>
              <button (click)="toggleUserMenu(); $event.stopPropagation()" class="flex items-center space-x-2 text-gray-700 hover:text-cvac-blue transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-cvac-blue to-cvac-light-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {{ getUserInitials() }}
                </div>
                <span class="hidden xl:block">{{ currentUser.firstname }}</span>
                <i class="fa-solid fa-chevron-down text-xs"></i>
              </button>
              
              <!-- Dropdown menu -->
              <div *ngIf="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50" (click)="$event.stopPropagation()">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900">{{ currentUser.firstname }} {{ currentUser.lastname }}</p>
                  <p class="text-xs text-gray-500">{{ currentUser.email }}</p>
                </div>
                <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cvac-cream transition-colors" (click)="closeUserMenu()">
                  <i class="fa-solid fa-user mr-2"></i>
                  Mon profil
                </a>
                <a routerLink="/news/new" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cvac-cream transition-colors" (click)="closeUserMenu()">
                  <i class="fa-solid fa-plus mr-2"></i>
                  Créer une actualité
                </a>
                <a *ngIf="currentUser?.role === 'admin'" routerLink="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cvac-cream transition-colors" (click)="closeUserMenu()">
                  <i class="fa-solid fa-shield-halved mr-2"></i>
                  Administration
                </a>
                <div class="border-t border-gray-100 my-1"></div>
                <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <i class="fa-solid fa-sign-out-alt mr-2"></i>
                  Déconnexion
                </button>
              </div>
            </div>
            
            <!-- Bouton connexion si non connecté -->
            <a *ngIf="!currentUser" routerLink="/login" class="ml-4 bg-cvac-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-cvac-light-blue transition-colors">
              Connexion
            </a>
          </nav>
          
          <div class="flex items-center space-x-4 lg:hidden">
            <!-- Menu utilisateur mobile -->
            <div *ngIf="currentUser" class="relative" #userMenuMobile>
              <button (click)="toggleUserMenu(); $event.stopPropagation()" class="w-8 h-8 bg-gradient-to-br from-cvac-blue to-cvac-light-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {{ getUserInitials() }}
              </button>
              <!-- Dropdown menu mobile -->
              <div *ngIf="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50" (click)="$event.stopPropagation()">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900">{{ currentUser.firstname }} {{ currentUser.lastname }}</p>
                  <p class="text-xs text-gray-500">{{ currentUser.email }}</p>
                </div>
                <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cvac-cream transition-colors" (click)="closeUserMenu()">
                  <i class="fa-solid fa-user mr-2"></i>
                  Mon profil
                </a>
                <a *ngIf="currentUser?.role === 'admin'" routerLink="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-cvac-cream transition-colors" (click)="closeUserMenu()">
                  <i class="fa-solid fa-shield-halved mr-2"></i>
                  Administration
                </a>
                <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <i class="fa-solid fa-sign-out-alt mr-2"></i>
                  Déconnexion
                </button>
              </div>
            </div>
            <button class="text-cvac-blue" (click)="toggleMobileMenu()" #mobileMenuButton>
              <i class="fa-solid fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        <!-- Menu mobile -->
        <div *ngIf="mobileMenuOpen" class="lg:hidden pb-4" #mobileMenu (click)="$event.stopPropagation()">
          <nav class="flex flex-col space-y-4">
            <a routerLink="/" routerLinkActive="text-cvac-blue font-semibold" [routerLinkActiveOptions]="{exact: true}" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Accueil</a>
            <a routerLink="/about" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Le CVAC</a>
            <a routerLink="/missions-values" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Missions & Valeurs</a>
            <a routerLink="/members" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Les Membres</a>
            <a routerLink="/directory" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Annuaire</a>
            <a routerLink="/news" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Actualités</a>
            <a routerLink="/contact" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Contact</a>
            <div *ngIf="!currentUser" class="pt-4 border-t border-gray-200">
              <a routerLink="/login" class="block text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Connexion</a>
              <a routerLink="/signup" class="block text-gray-700 hover:text-cvac-blue transition-colors mt-2" (click)="toggleMobileMenu()">Inscription</a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    /* Correctifs Safari pour le header sticky */
    header {
      position: -webkit-sticky;
      position: sticky;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    
    /* Correction pour les images dans le header sur Safari */
    header img {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }
    
    /* Correction pour les transitions sur Safari */
    header a,
    header button {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-tap-highlight-color: transparent;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu') userMenuElement?: ElementRef;
  @ViewChild('userMenuMobile') userMenuMobileElement?: ElementRef;
  @ViewChild('mobileMenu') mobileMenuElement?: ElementRef;
  @ViewChild('mobileMenuButton') mobileMenuButtonElement?: ElementRef;
  
  mobileMenuOpen = false;
  userMenuOpen = false;
  currentUser: User | null = null;
  private userSubscription?: Subscription;

  constructor(private authService: AuthService, private elementRef: ElementRef, private router: Router) {}
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Fermer le menu utilisateur si on clique en dehors
    if (this.userMenuOpen) {
      const userMenuEl = this.userMenuElement?.nativeElement || this.userMenuMobileElement?.nativeElement;
      if (userMenuEl && !userMenuEl.contains(event.target)) {
        this.userMenuOpen = false;
      }
    }
    
    // Fermer le menu mobile si on clique en dehors
    if (this.mobileMenuOpen) {
      const mobileMenuEl = this.mobileMenuElement?.nativeElement;
      const mobileMenuButtonEl = this.mobileMenuButtonElement?.nativeElement;
      const clickedInsideMenu = mobileMenuEl && mobileMenuEl.contains(event.target);
      const clickedOnButton = mobileMenuButtonEl && mobileMenuButtonEl.contains(event.target);
      
      if (!clickedInsideMenu && !clickedOnButton) {
        this.mobileMenuOpen = false;
      }
    }
  }

  ngOnInit() {
    // S'abonner aux changements de l'utilisateur
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.userMenuOpen = false;
    }
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  closeUserMenu() {
    this.userMenuOpen = false;
    this.mobileMenuOpen = false;
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    return (this.currentUser.firstname.charAt(0) + this.currentUser.lastname.charAt(0)).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.userMenuOpen = false;
    this.mobileMenuOpen = false;
    // Rediriger vers la page d'accueil après déconnexion
    this.router.navigate(['/']);
  }
}

