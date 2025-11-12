import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news.component.html'
})
export class NewsComponent {
  news: any[] = [];

  constructor(private http: HttpClient) {
    this.loadNews();
  }

  loadNews() {
    this.http.get<any[]>('/api/news.php').subscribe({
      next: (data) => {
        this.news = data;
      },
      error: () => {
        // Fallback si l'API n'est pas disponible - on garde news vide pour afficher les actualités statiques
        this.news = [];
      }
    });
  }
}

