import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SeoService } from '../../services/seo.service';

// Configuration API - remplace l'import environment pour éviter les problèmes de bundler
const API_URL = 'https://cvac-choisyleroi.fr/api';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
  formData = {
    firstname: '',
    lastname: '',
    email: '',
    association: '',
    subject: '',
    message: '',
    consent: false
  };
  
  submitted = false;
  error = '';

  constructor(
    private http: HttpClient,
    private seoService: SeoService
  ) {}

  ngOnInit() {
    this.seoService.setContactPage();
  }

  onSubmit() {
    if (!this.formData.consent) {
      this.error = 'Vous devez accepter la politique RGPD';
      return;
    }

    this.http.post(`${API_URL}/contact.php`, this.formData).subscribe({
      next: () => {
        this.submitted = true;
        this.error = '';
        // Réinitialiser le formulaire
        this.formData = {
          firstname: '',
          lastname: '',
          email: '',
          association: '',
          subject: '',
          message: '',
          consent: false
        };
      },
      error: () => {
        this.error = 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
}

