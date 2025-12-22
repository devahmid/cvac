import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 flex items-center justify-center">
                <img src="/assets/images/members/logo-def-CVAC.png" alt="Logo CVAC" class="w-full h-full object-contain">
              </div>
              <div>
                <h3 class="text-lg font-semibold">Conseil de la Vie Associative</h3>
                <p class="text-gray-400">Choisy-le-Roi</p>
              </div>
            </div>
            <p class="text-gray-400 mb-4">
              Instance consultative au service des associations et des habitants de Choisy-le-Roi.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fa-brands fa-facebook text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fa-brands fa-twitter text-xl"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fa-solid fa-envelope text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Navigation</h4>
            <ul class="space-y-2">
              <li><a routerLink="/about" class="text-gray-400 hover:text-white transition-colors">Le CVAC</a></li>
              <li><a routerLink="/missions-values" class="text-gray-400 hover:text-white transition-colors">Missions & Valeurs</a></li>
              <li><a routerLink="/members" class="text-gray-400 hover:text-white transition-colors">Les Membres</a></li>
              <li><a routerLink="/news" class="text-gray-400 hover:text-white transition-colors">Actualités</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Contact</h4>
            <div class="space-y-2 text-gray-400">
              <a href="mailto:cvac.choisy@gmail.com" class="flex items-center hover:text-white transition-colors">
                <i class="fa-solid fa-envelope mr-2"></i>
                cvac.choisy&#64;gmail.com
              </a>
              <a href="mailto:contact@cvac-choisyleroi.fr" class="flex items-center hover:text-white transition-colors">
                <i class="fa-solid fa-envelope mr-2"></i>
                contact&#64;cvac-choisyleroi.fr
              </a>
              <p class="flex items-center mt-4">
                <i class="fa-solid fa-map-marker-alt mr-2"></i>
                Mairie de Choisy-le-Roi
              </p>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © {{ currentYear }} CVAC - Conseil de la Vie Associative de Choisy-le-Roi
          </p>
          <div class="flex space-x-4 mt-4 md:mt-0">
            <a routerLink="/legal" class="text-gray-400 hover:text-white text-sm transition-colors">Mentions légales</a>
            <a routerLink="/legal" class="text-gray-400 hover:text-white text-sm transition-colors">RGPD</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

