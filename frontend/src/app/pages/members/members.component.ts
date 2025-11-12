import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './members.component.html'
})
export class MembersComponent {
  members: any[] = [];

  constructor(private http: HttpClient) {
    this.loadMembers();
  }

  loadMembers() {
    this.http.get<any[]>('/api/members.php').subscribe({
      next: (data) => {
        this.members = data;
      },
      error: () => {
        // Fallback si l'API n'est pas disponible - on garde members vide pour afficher les membres statiques
        this.members = [];
      }
    });
  }
}

