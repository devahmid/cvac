import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Configuration API - remplace l'import environment pour éviter les problèmes de bundler
const API_URL = 'https://cvac-choisyleroi.fr/api';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${API_URL}/admin.php`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les associations en attente de validation
   */
  getPendingAssociations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=pending-associations`);
  }

  /**
   * Récupère les utilisateurs en attente de validation
   */
  getPendingUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=pending-users`);
  }

  /**
   * Récupère les statistiques du dashboard
   */
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=stats`);
  }

  /**
   * Valide ou rejette une association
   */
  validateAssociation(id: number, approved: boolean, reason?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=validate-association`, {
      id,
      approved,
      reason
    });
  }

  /**
   * Valide ou rejette un utilisateur
   */
  validateUser(id: number, approved: boolean, reason?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=validate-user`, {
      id,
      approved,
      reason
    });
  }

  /**
   * Récupère toutes les associations
   */
  getAllAssociations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=all-associations`);
  }

  /**
   * Met à jour le statut d'une association
   */
  updateAssociationStatus(id: number, status: 'pending' | 'approved' | 'rejected', reason?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=update-association-status`, {
      id,
      status,
      reason
    });
  }

  /**
   * Supprime une association
   */
  deleteAssociation(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=delete-association`, {
      id
    });
  }

  /**
   * Récupère tous les utilisateurs
   */
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=all-users`);
  }

  /**
   * Met à jour le rôle d'un utilisateur
   */
  updateUserRole(id: number, role: 'user' | 'admin'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=update-user-role`, {
      id,
      role
    });
  }

  /**
   * Supprime un utilisateur
   */
  deleteUser(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=delete-user`, {
      id
    });
  }

  /**
   * Envoie un email à plusieurs utilisateurs
   */
  sendEmailToUsers(recipients: number[], subject: string, message: string, templateId?: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=send-email-to-users`, {
      recipients,
      subject,
      message,
      template_id: templateId
    });
  }

  /**
   * Exporte les utilisateurs en CSV
   */
  exportUsersCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}?action=export-users-csv`, {
      responseType: 'blob'
    });
  }

  /**
   * Exporte les associations en CSV
   */
  exportAssociationsCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}?action=export-associations-csv`, {
      responseType: 'blob'
    });
  }

  /**
   * Récupère les logs d'activité admin
   */
  getAdminLogs(page: number = 1, limit: number = 50): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=admin-logs&page=${page}&limit=${limit}`);
  }

  /**
   * Récupère les statistiques avancées
   */
  getAdvancedStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=advanced-stats`);
  }

  /**
   * Récupère les actualités en attente de modération
   */
  getPendingNews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=pending-news`);
  }

  /**
   * Récupère toutes les actualités
   */
  getAllNews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=all-news`);
  }

  /**
   * Valide ou rejette une actualité
   */
  validateNews(id: number, approved: boolean, reason?: string): Observable<any> {
    const action = approved ? 'validate-news' : 'reject-news';
    return this.http.post<any>(`${this.apiUrl}?action=${action}`, {
      id,
      reason
    });
  }

  /**
   * Supprime une actualité
   */
  deleteNews(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=delete-news`, {
      id
    });
  }

  /**
   * Récupère les templates d'emails
   */
  getEmailTemplates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=email-templates`);
  }

  /**
   * Sauvegarde un template d'email
   */
  saveEmailTemplate(template: { id?: number; name: string; subject: string; body: string; variables?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=save-email-template`, template);
  }

  /**
   * Supprime un template d'email
   */
  deleteEmailTemplate(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=delete-email-template`, {
      id
    });
  }

  /**
   * Récupère l'historique des emails envoyés
   */
  getEmailHistory(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=email-history&page=${page}&limit=${limit}`);
  }
}

