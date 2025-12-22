import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Configuration API - remplace l'import environment pour éviter les problèmes de bundler
const API_URL = 'https://cvac-choisyleroi.fr/api';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './members.component.html'
})
export class MembersComponent {
  members: any[] = [];

  // Chemin de base pour les images des membres
  private readonly membersImagePath = '/assets/images/members/';

  // Mapping des noms vers les noms de fichiers d'images (correspond aux fichiers réels dans assets/images/members/)
  // Format: 'Nom Membre': { baseName: 'nom-fichier', extension: '.png' | '.jpg' | '.jpeg' | '.webp' }
  // Si baseName est null, aucune image ne sera affichée
  private readonly memberImageMap: { [key: string]: { baseName: string | null; extension?: string } } = {
    'Ahlem ZENATI': { baseName: 'ahlem', extension: '.png' },
    'Michèle COUDERC': { baseName: null }, // Pas de photo pour l'instant
    'Josette LEVÊQUE': { baseName: 'jo', extension: '.png' },
    'Rachel PRIEST': { baseName: 'rachel', extension: '.jpeg' },
    'Yvonne ZODO': { baseName: 'yvonne', extension: '.png' },
    'Eric DIOR': { baseName: 'eric', extension: '.webp' },
    'Noham SETTBON': { baseName: 'noham', extension: '.jpeg' },
    'Azedine ARIF': { baseName: 'azedine', extension: '.png' },
    'Serge LECLERC': { baseName: 'serge', extension: '.jpeg' },
    'Ahmid AIT OUALI': { baseName: 'ahmid', extension: '.jpeg' },
  };

  // Membres réels du CVAC (données en dur - ordre : femmes d'abord)
  private defaultMembers = [
    {
      id: 1,
      name: 'Ahlem ZENATI',
      role: 'Présidente',
      association: 'Les Fleurs des Navigateurs',
      description: 'Présidente du CVAC, représentante de l\'association Les Fleurs des Navigateurs.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
      role_order: 1
    },
    {
      id: 2,
      name: 'Michèle COUDERC',
      role: 'Membre',
      association: 'Choisy ta coop',
      description: 'Membre du CVAC, représentante de l\'association Choisy ta coop.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg',
      role_order: 2
    },
    {
      id: 3,
      name: 'Josette LEVÊQUE',
      role: 'Membre',
      association: 'Danses et loisirs',
      description: 'Membre du CVAC, représentante de l\'association Danses et loisirs.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg',
      role_order: 3
    },
    {
      id: 4,
      name: 'Rachel PRIEST',
      role: 'Membre',
      association: 'Sla Formations',
      description: 'Membre du CVAC, représentante de l\'association Sla Formations.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
      role_order: 4
    },
    {
      id: 5,
      name: 'Yvonne ZODO',
      role: 'Membre',
      association: 'Société Régionale des Beaux-Arts',
      description: 'Membre du CVAC, représentante de la Société Régionale des Beaux-Arts.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
      role_order: 5
    },
    {
      id: 6,
      name: 'Eric DIOR',
      role: 'Vice-président',
      association: 'On sème pour la ville',
      description: 'Vice-président du CVAC, représentant de l\'association On sème pour la ville.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
      role_order: 6
    },
    {
      id: 7,
      name: 'Ahmid AIT OUALI',
      role: 'Membre',
      association: 'Les Résidents des Hautes Bornes',
      description: 'Membre du CVAC, représentant de l\'association Les Résidents des Hautes Bornes.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      role_order: 7
    },
    {
      id: 8,
      name: 'Azedine ARIF',
      role: 'Membre',
      association: 'Association d\'Éducation Créative à l\'Environnement',
      description: 'Membre du CVAC, représentant de l\'Association d\'Éducation Créative à l\'Environnement.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
      role_order: 8
    },
    {
      id: 9,
      name: 'Serge LECLERC',
      role: 'Membre',
      association: 'Association Sociale de Réinsertion par le Logement',
      description: 'Membre du CVAC, représentant de l\'Association Sociale de Réinsertion par le Logement.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg',
      role_order: 9
    },
    {
      id: 10,
      name: 'Noham SETTBON',
      role: 'Membre',
      association: 'La Santé à Choisy',
      description: 'Membre du CVAC, représentant de l\'association La Santé à Choisy.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      role_order: 10
    }
  ];

  constructor(private http: HttpClient) {
    // Initialiser avec les membres par défaut
    this.members = this.defaultMembers;
    // Essayer de charger depuis l'API, sinon garder les données par défaut
    this.loadMembers();
  }

  loadMembers() {
    this.http.get<any>(`${API_URL}/members.php`).subscribe({
      next: (response) => {
        // Gérer la nouvelle structure avec data/pagination ou l'ancienne structure directe
        if (response.success && response.data && response.data.length > 0) {
          this.members = response.data;
        } else if (Array.isArray(response) && response.length > 0) {
          // Compatibilité avec l'ancien format
          this.members = response;
        }
        // Si pas de données de l'API, garder les membres par défaut
      },
      error: () => {
        // En cas d'erreur API, garder les membres par défaut déjà initialisés
        // Les membres sont déjà initialisés dans le constructeur
      }
    });
  }

  /**
   * Génère le chemin de l'image locale pour un membre
   * TOUJOURS essaie d'abord les images locales avec l'extension connue, puis essaie les autres si nécessaire
   * Retourne une chaîne vide si aucune image ne doit être affichée
   */
  getMemberImage(member: any): string {
    // Chercher le nom de fichier dans le mapping
    const imageInfo = this.memberImageMap[member.name];
    if (imageInfo) {
      // Si baseName est null, ne pas afficher d'image
      if (imageInfo.baseName === null) {
        return '';
      }
      // Utiliser l'extension connue si disponible, sinon essayer .png par défaut
      const extension = imageInfo.extension || '.png';
      return `${this.membersImagePath}${imageInfo.baseName}${extension}`;
    }

    // Si pas de mapping trouvé, utiliser l'avatar par défaut ou une image générique
    return member.avatar || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg';
  }

  /**
   * Gère l'erreur de chargement d'image (si l'image locale n'existe pas)
   * Essaie différentes extensions : .png, .jpg, .jpeg, .webp
   * Si aucune extension ne fonctionne, utilise l'avatar par défaut
   */
  onImageError(event: any, member: any): void {
    const imageInfo = this.memberImageMap[member.name];
    if (imageInfo) {
      const currentSrc = event.target.src;
      const basePath = `${this.membersImagePath}${imageInfo.baseName}`;
      
      // Liste des extensions à essayer dans l'ordre
      const extensions = ['.png', '.jpg', '.jpeg', '.webp'];
      const currentExt = extensions.find(ext => currentSrc.includes(ext));
      const currentIndex = currentExt ? extensions.indexOf(currentExt) : -1;
      
      // Essayer l'extension suivante
      if (currentIndex >= 0 && currentIndex < extensions.length - 1) {
        event.target.src = `${basePath}${extensions[currentIndex + 1]}`;
        return;
      }
      
      // Si toutes les extensions ont échoué, utiliser l'avatar par défaut
      event.target.src = member.avatar || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg';
      return;
    }
    // Si pas de mapping, utiliser l'avatar par défaut
    event.target.src = member.avatar || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg';
  }

  // Getters pour le bureau et les membres
  get bureau() {
    return this.members.filter(m => m.role === 'Présidente' || m.role === 'Vice-président');
  }

  get membresActifs() {
    return this.members.filter(m => m.role === 'Membre');
  }
}

