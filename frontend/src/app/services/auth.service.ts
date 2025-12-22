import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// Configuration API - remplace l'import environment pour éviter les problèmes de bundler
const API_URL = 'https://cvac-choisyleroi.fr/api';

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role?: string;
  associationId?: number;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${API_URL}/auth.php`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Vérifier si l'utilisateur est toujours connecté au démarrage
    this.checkAuthStatus();
  }

  /**
   * Connexion d'un utilisateur
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}?action=login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.success && response.user && response.token) {
          this.setSession(response.user, response.token);
        }
      })
    );
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  signup(userData: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    associationId?: number;
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}?action=signup`, userData).pipe(
      tap(response => {
        if (response.success && response.user && response.token) {
          this.setSession(response.user, response.token);
        }
      })
    );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem('cvac_user');
    localStorage.removeItem('cvac_token');
    this.currentUserSubject.next(null);
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!token && !!user;
  }

  /**
   * Récupère l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Récupère le token d'authentification
   */
  getToken(): string | null {
    return localStorage.getItem('cvac_token');
  }

  /**
   * Vérifie le statut d'authentification avec le serveur
   */
  checkAuthStatus(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      // Vérifier avec le serveur si le token est toujours valide
      this.http.get<{success: boolean, user?: User}>(`${this.apiUrl}?action=check&token=${token}`).subscribe({
        next: (response) => {
          if (response.success && response.user) {
            this.setSession(response.user, token);
          } else {
            this.logout();
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  /**
   * Met à jour les informations de l'utilisateur
   */
  updateUser(user: User): void {
    this.setSession(user, this.getToken() || '');
  }

  /**
   * Stocke la session utilisateur
   */
  private setSession(user: User, token: string): void {
    localStorage.setItem('cvac_user', JSON.stringify(user));
    localStorage.setItem('cvac_token', token);
    this.currentUserSubject.next(user);
  }

  /**
   * Récupère l'utilisateur stocké
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('cvac_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Met à jour l'association liée à l'utilisateur
   */
  updateUserAssociation(associationId: number | null): Observable<any> {
    // Si associationId est 0, envoyer null pour retirer l'association
    const valueToSend = associationId === 0 ? null : associationId;
    
    return this.http.put<any>(`${this.apiUrl}?action=updateAssociation`, {
      associationId: valueToSend
    }).pipe(
      tap((response) => {
        if (response.success && response.user) {
          // Mettre à jour la session avec les nouvelles données utilisateur
          this.setSession(response.user, this.getToken() || '');
        }
      })
    );
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=forgot-password`, {
      email
    });
  }

  /**
   * Réinitialise le mot de passe avec un token
   */
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=reset-password`, {
      token,
      password
    });
  }
}

