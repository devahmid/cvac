import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Configuration API - remplace l'import environment pour éviter les problèmes de bundler
const API_URL = 'https://cvac-choisyleroi.fr/api';

export interface Association {
  id?: number;
  name: string;
  description: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  city: string;
  logo?: string;
  coverImage?: string;
  category?: string;
  activities?: string;
  president?: string;
  foundingYear?: number;
  numberOfMembers?: number;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssociationService {
  private apiUrl = `${API_URL}/associations.php`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les associations publiques
   */
  getPublicAssociations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?public=true`);
  }

  /**
   * Récupère une association par son ID
   */
  getAssociationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${id}`);
  }

  /**
   * Crée une nouvelle association
   */
  createAssociation(association: Association): Observable<any> {
    return this.http.post<any>(this.apiUrl, association);
  }

  /**
   * Met à jour une association
   */
  updateAssociation(id: number, association: Association): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?id=${id}`, association);
  }

  /**
   * Recherche des associations
   */
  searchAssociations(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?search=${encodeURIComponent(query)}`);
  }

  /**
   * Filtre les associations par catégorie
   */
  getAssociationsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?category=${encodeURIComponent(category)}`);
  }

  /**
   * Supprime une association
   */
  deleteAssociation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }
}

