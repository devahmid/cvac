import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
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

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.formData.consent) {
      this.error = 'Vous devez accepter la politique RGPD';
      return;
    }

    this.http.post('/api/contact.php', this.formData).subscribe({
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

