import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
          
          <nav class="hidden lg:flex space-x-8">
            <a routerLink="/" routerLinkActive="text-cvac-blue font-semibold" [routerLinkActiveOptions]="{exact: true}" class="text-gray-700 hover:text-cvac-blue transition-colors">Accueil</a>
            <a routerLink="/about" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Le CVAC</a>
            <a routerLink="/missions-values" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Missions & Valeurs</a>
            <a routerLink="/members" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Les Membres</a>
            <a routerLink="/news" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Actualités</a>
            <a routerLink="/contact" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors">Contact</a>
          </nav>
          
          <button class="lg:hidden text-cvac-blue" (click)="toggleMobileMenu()">
            <i class="fa-solid fa-bars text-xl"></i>
          </button>
        </div>
        
        <!-- Menu mobile -->
        <div *ngIf="mobileMenuOpen" class="lg:hidden pb-4">
          <nav class="flex flex-col space-y-4">
            <a routerLink="/" routerLinkActive="text-cvac-blue font-semibold" [routerLinkActiveOptions]="{exact: true}" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Accueil</a>
            <a routerLink="/about" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Le CVAC</a>
            <a routerLink="/missions-values" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Missions & Valeurs</a>
            <a routerLink="/members" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Les Membres</a>
            <a routerLink="/news" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Actualités</a>
            <a routerLink="/contact" routerLinkActive="text-cvac-blue font-semibold" class="text-gray-700 hover:text-cvac-blue transition-colors" (click)="toggleMobileMenu()">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}

