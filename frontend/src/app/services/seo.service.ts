import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private baseTitle = 'CVAC - Conseil de la Vie Associative de Choisy-le-Roi';
  private baseDescription = 'CVAC Choisy-le-Roi : Découvrez l\'annuaire des associations de Choisy-le-Roi. Conseil de la Vie Associative au service des associations et des habitants.';
  private baseUrl = 'https://cvac-choisyleroi.fr';
  private baseImage = 'https://cvac-choisyleroi.fr/assets/images/members/logo-def-CVAC.png';

  constructor(
    private title: Title,
    private meta: Meta
  ) {}

  /**
   * Met à jour les meta tags pour une page
   */
  updateTags(config: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
  }): void {
    const title = config.title ? `${config.title} | ${this.baseTitle}` : this.baseTitle;
    const description = config.description || this.baseDescription;
    const keywords = config.keywords || 'CVAC, Choisy-le-Roi, associations Choisy-le-Roi, annuaire associations, conseil vie associative, associations 94, Val-de-Marne';
    const image = config.image || this.baseImage;
    const url = config.url || this.baseUrl;
    const type = config.type || 'website';

    // Titre de la page
    this.title.setTitle(title);

    // Meta description
    this.meta.updateTag({ name: 'description', content: description });
    
    // Meta keywords
    this.meta.updateTag({ name: 'keywords', content: keywords });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:url', content: url });
  }

  /**
   * Met à jour les tags pour la page d'accueil
   */
  setHomePage(): void {
    this.updateTags({
      title: 'Accueil',
      description: 'CVAC Choisy-le-Roi : Découvrez l\'annuaire des associations de Choisy-le-Roi. Conseil de la Vie Associative au service des associations et des habitants. Trouvez une association, rejoignez-nous !',
      keywords: 'CVAC, Choisy-le-Roi, associations Choisy-le-Roi, annuaire associations, conseil vie associative, associations 94, Val-de-Marne, associations culturelles, associations sportives, associations solidarité'
    });
  }

  /**
   * Met à jour les tags pour la page annuaire
   */
  setDirectoryPage(): void {
    this.updateTags({
      title: 'Annuaire des Associations de Choisy-le-Roi',
      description: 'Consultez l\'annuaire complet des associations de Choisy-le-Roi. Trouvez une association par catégorie : culture, sport, solidarité, éducation, environnement, jeunesse.',
      keywords: 'annuaire associations Choisy-le-Roi, associations Choisy-le-Roi, associations 94, associations Val-de-Marne, associations culturelles Choisy-le-Roi, associations sportives Choisy-le-Roi',
      url: `${this.baseUrl}/directory`
    });
  }

  /**
   * Met à jour les tags pour une association spécifique
   */
  setAssociationPage(association: { name: string; description: string; category?: string; city?: string; image?: string }): void {
    const keywords = `association ${association.name}, ${association.category || ''}, Choisy-le-Roi, CVAC, associations 94`;
    this.updateTags({
      title: `${association.name} - Association de Choisy-le-Roi`,
      description: `${association.description.substring(0, 155)}... Association ${association.category || ''} à ${association.city || 'Choisy-le-Roi'}.`,
      keywords: keywords,
      image: association.image || this.baseImage,
      url: `${this.baseUrl}/directory/${association.name.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'article'
    });
  }

  /**
   * Met à jour les tags pour la page contact
   */
  setContactPage(): void {
    this.updateTags({
      title: 'Contact - CVAC Choisy-le-Roi',
      description: 'Contactez le CVAC - Conseil de la Vie Associative de Choisy-le-Roi. Email : cvac.choisy@gmail.com ou contact@cvac-choisyleroi.fr',
      keywords: 'contact CVAC, contact Choisy-le-Roi, CVAC contact, associations Choisy-le-Roi contact',
      url: `${this.baseUrl}/contact`
    });
  }

  /**
   * Met à jour les tags pour la page actualités
   */
  setNewsPage(): void {
    this.updateTags({
      title: 'Actualités des Associations - CVAC Choisy-le-Roi',
      description: 'Découvrez les dernières actualités et événements des associations de Choisy-le-Roi. Restez informé des activités associatives dans votre ville.',
      keywords: 'actualités associations Choisy-le-Roi, événements Choisy-le-Roi, activités associatives, CVAC actualités',
      url: `${this.baseUrl}/news`
    });
  }
}

