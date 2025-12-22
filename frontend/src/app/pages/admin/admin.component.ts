import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main class="min-h-screen bg-cvac-cream">
      <!-- En-tête -->
      <section class="bg-gradient-to-br from-cvac-blue to-cvac-light-blue py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">
                <i class="fa-solid fa-shield-halved mr-3"></i>
                Administration
              </h1>
              <p class="text-white/90">Gérer les validations et la modération</p>
            </div>
            <a routerLink="/" class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
              <i class="fa-solid fa-home mr-2"></i>
              Retour au site
            </a>
          </div>
        </div>
      </section>

      <!-- Statistiques -->
      <section class="py-8 bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm mb-1">Associations en attente</p>
                  <p class="text-3xl font-bold">{{ stats?.pending_associations || 0 }}</p>
                </div>
                <i class="fa-solid fa-building text-4xl opacity-50"></i>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-yellow-100 text-sm mb-1">Utilisateurs en attente</p>
                  <p class="text-3xl font-bold">{{ stats?.pending_users || 0 }}</p>
                </div>
                <i class="fa-solid fa-users text-4xl opacity-50"></i>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm mb-1">Total associations</p>
                  <p class="text-3xl font-bold">{{ stats?.total_associations || 0 }}</p>
                </div>
                <i class="fa-solid fa-list text-4xl opacity-50"></i>
              </div>
            </div>
            
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-sm mb-1">Total utilisateurs</p>
                  <p class="text-3xl font-bold">{{ stats?.total_users || 0 }}</p>
                </div>
                <i class="fa-solid fa-user-group text-4xl opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contenu principal -->
      <section class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Associations en attente -->
            <div class="bg-white rounded-2xl shadow-lg p-8">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-cvac-blue">
                  <i class="fa-solid fa-building mr-2"></i>
                  Associations en attente
                </h2>
                <button 
                  (click)="loadPendingAssociations()"
                  class="text-cvac-blue hover:text-cvac-light-blue">
                  <i class="fa-solid fa-refresh"></i>
                </button>
              </div>

              <div *ngIf="loadingAssociations" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
              </div>

              <div *ngIf="!loadingAssociations && pendingAssociations.length === 0" class="text-center py-8">
                <i class="fa-solid fa-check-circle text-green-500 text-4xl mb-3"></i>
                <p class="text-gray-600">Aucune association en attente</p>
              </div>

              <div *ngIf="!loadingAssociations && pendingAssociations.length > 0" class="space-y-4">
                <div 
                  *ngFor="let asso of pendingAssociations" 
                  class="border border-gray-200 rounded-lg p-4 hover:border-cvac-blue transition-colors">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h3 class="font-bold text-cvac-blue mb-1">{{ asso.name }}</h3>
                      <p class="text-sm text-gray-600 line-clamp-2">{{ asso.description }}</p>
                      <div class="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                        <span *ngIf="asso.category" class="bg-cvac-cream px-2 py-1 rounded">{{ asso.category }}</span>
                        <span *ngIf="asso.city">{{ asso.city }}</span>
                        <span *ngIf="asso.email">{{ asso.email }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex gap-2 mt-4">
                    <button 
                      (click)="validateAssociation(asso.id, true)"
                      [disabled]="processing[asso.id]"
                      class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">
                      <i class="fa-solid fa-check mr-2"></i>
                      Valider
                    </button>
                    <button 
                      (click)="showRejectModal(asso.id, 'association')"
                      [disabled]="processing[asso.id]"
                      class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">
                      <i class="fa-solid fa-times mr-2"></i>
                      Rejeter
                    </button>
                    <a 
                      [routerLink]="['/directory', asso.id]"
                      target="_blank"
                      class="bg-cvac-blue hover:bg-cvac-light-blue text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Utilisateurs en attente -->
            <div class="bg-white rounded-2xl shadow-lg p-8">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-cvac-blue">
                  <i class="fa-solid fa-users mr-2"></i>
                  Utilisateurs en attente
                </h2>
                <button 
                  (click)="loadPendingUsers()"
                  class="text-cvac-blue hover:text-cvac-light-blue">
                  <i class="fa-solid fa-refresh"></i>
                </button>
              </div>

              <div *ngIf="loadingUsers" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
              </div>

              <div *ngIf="!loadingUsers && pendingUsers.length === 0" class="text-center py-8">
                <i class="fa-solid fa-check-circle text-green-500 text-4xl mb-3"></i>
                <p class="text-gray-600">Aucun utilisateur en attente</p>
              </div>

              <div *ngIf="!loadingUsers && pendingUsers.length > 0" class="space-y-4">
                <div 
                  *ngFor="let user of pendingUsers" 
                  class="border border-gray-200 rounded-lg p-4 hover:border-cvac-blue transition-colors">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h3 class="font-bold text-cvac-blue mb-1">
                        {{ user.firstname }} {{ user.lastname }}
                      </h3>
                      <p class="text-sm text-gray-600">{{ user.email }}</p>
                      <div class="mt-2 text-xs text-gray-500">
                        <span *ngIf="user.association_name">Association: {{ user.association_name }}</span>
                        <span *ngIf="!user.association_name" class="text-gray-400">Aucune association</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex gap-2 mt-4">
                    <button 
                      (click)="validateUser(user.id, true)"
                      [disabled]="processing[user.id]"
                      class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">
                      <i class="fa-solid fa-check mr-2"></i>
                      Valider
                    </button>
                    <button 
                      (click)="showRejectModal(user.id, 'user')"
                      [disabled]="processing[user.id]"
                      class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">
                      <i class="fa-solid fa-times mr-2"></i>
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Liste complète des associations -->
      <section class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-cvac-blue">
                <i class="fa-solid fa-list mr-2"></i>
                Toutes les associations
              </h2>
              <button 
                (click)="loadAllAssociations()"
                class="text-cvac-blue hover:text-cvac-light-blue">
                <i class="fa-solid fa-refresh mr-2"></i>
                Actualiser
              </button>
            </div>

            <div *ngIf="loadingAllAssociations" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
            </div>

            <div *ngIf="!loadingAllAssociations && allAssociations.length === 0" class="text-center py-8">
              <i class="fa-solid fa-building text-gray-400 text-4xl mb-3"></i>
              <p class="text-gray-600">Aucune association</p>
            </div>

            <div *ngIf="!loadingAllAssociations && filteredAssociations.length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Catégorie</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Ville</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Créateur</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                    <th class="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    *ngFor="let asso of filteredAssociations" 
                    class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4">
                      <div class="font-semibold text-cvac-blue">{{ asso.name }}</div>
                      <div class="text-xs text-gray-500 line-clamp-1">{{ asso.description }}</div>
                    </td>
                    <td class="py-3 px-4">
                      <span *ngIf="asso.category" class="bg-cvac-cream px-2 py-1 rounded text-sm">{{ asso.category }}</span>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-600">{{ asso.city }}</td>
                    <td class="py-3 px-4 text-sm text-gray-600">
                      <div *ngIf="asso.creator_firstname">{{ asso.creator_firstname }} {{ asso.creator_lastname }}</div>
                      <div class="text-xs text-gray-400">{{ asso.creator_email }}</div>
                    </td>
                    <td class="py-3 px-4">
                      <select 
                        [value]="asso.status || 'pending'"
                        (change)="changeAssociationStatus(asso.id, $event)"
                        [disabled]="processing[asso.id]"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                        [class.bg-yellow-100]="asso.status === 'pending'"
                        [class.bg-green-100]="asso.status === 'approved'"
                        [class.bg-red-100]="asso.status === 'rejected'">
                        <option value="pending">En attente</option>
                        <option value="approved">Approuvée</option>
                        <option value="rejected">Rejetée</option>
                      </select>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-center gap-2">
                        <a 
                          [routerLink]="['/directory', asso.id]"
                          target="_blank"
                          class="text-cvac-blue hover:text-cvac-light-blue"
                          title="Voir">
                          <i class="fa-solid fa-eye"></i>
                        </a>
                        <button 
                          (click)="confirmDeleteAssociation(asso.id, asso.name)"
                          [disabled]="processing[asso.id]"
                          class="text-red-500 hover:text-red-600 disabled:opacity-50"
                          title="Supprimer">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Liste complète des utilisateurs -->
      <section class="py-12 bg-cvac-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-cvac-blue">
                <i class="fa-solid fa-users mr-2"></i>
                Tous les utilisateurs
              </h2>
              <div class="flex gap-4">
                <button 
                  (click)="openEmailModal()"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  <i class="fa-solid fa-envelope mr-2"></i>
                  Envoyer un email
                </button>
                <button 
                  (click)="loadAllUsers()"
                  class="text-cvac-blue hover:text-cvac-light-blue">
                  <i class="fa-solid fa-refresh mr-2"></i>
                  Actualiser
                </button>
              </div>
            </div>

            <div *ngIf="loadingAllUsers" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
            </div>

            <div *ngIf="!loadingAllUsers && allUsers.length === 0" class="text-center py-8">
              <i class="fa-solid fa-user-group text-gray-400 text-4xl mb-3"></i>
              <p class="text-gray-600">Aucun utilisateur</p>
            </div>

            <!-- Recherche et filtres utilisateurs -->
            <div class="mb-6 flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                <input 
                  type="text"
                  [(ngModel)]="searchUsersQuery"
                  (input)="filterUsers()"
                  placeholder="Rechercher un utilisateur..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
              </div>
              <div class="w-full md:w-auto">
                <select 
                  [(ngModel)]="filterUserStatus"
                  (change)="filterUsers()"
                  class="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="active">Actifs</option>
                  <option value="approved">Approuvés</option>
                  <option value="rejected">Rejetés</option>
                </select>
              </div>
              <div class="w-full md:w-auto">
                <select 
                  [(ngModel)]="filterUserRole"
                  (change)="filterUsers()"
                  class="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
                  <option value="">Tous les rôles</option>
                  <option value="user">Utilisateurs</option>
                  <option value="admin">Administrateurs</option>
                </select>
              </div>
            </div>

            <div *ngIf="!loadingAllUsers && filteredUsers.length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">
                      <input 
                        type="checkbox"
                        (change)="toggleSelectAllUsers($event)"
                        [checked]="selectedUsers.length === filteredUsers.length && filteredUsers.length > 0"
                        class="w-4 h-4 text-cvac-blue border-gray-300 rounded">
                    </th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Association</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Rôle</th>
                    <th class="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    *ngFor="let user of filteredUsers" 
                    class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4">
                      <input 
                        type="checkbox"
                        [checked]="selectedUsers.includes(user.id)"
                        (change)="toggleUserSelection(user.id)"
                        class="w-4 h-4 text-cvac-blue border-gray-300 rounded">
                    </td>
                    <td class="py-3 px-4">
                      <div class="font-semibold text-cvac-blue">{{ user.firstname }} {{ user.lastname }}</div>
                      <div class="text-xs text-gray-500">Inscrit le {{ formatDate(user.created_at) }}</div>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-600">{{ user.email }}</td>
                    <td class="py-3 px-4 text-sm text-gray-600">
                      <span *ngIf="user.association_name" class="bg-cvac-cream px-2 py-1 rounded">{{ user.association_name }}</span>
                      <span *ngIf="!user.association_name" class="text-gray-400">Aucune</span>
                    </td>
                    <td class="py-3 px-4">
                      <select 
                        [value]="user.status || 'pending'"
                        (change)="changeUserStatus(user.id, $event)"
                        [disabled]="processing[user.id]"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                        [class.bg-yellow-100]="user.status === 'pending'"
                        [class.bg-green-100]="user.status === 'active' || user.status === 'approved'"
                        [class.bg-red-100]="user.status === 'rejected'">
                        <option value="pending">En attente</option>
                        <option value="active">Actif</option>
                        <option value="approved">Approuvé</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                    </td>
                    <td class="py-3 px-4">
                      <select 
                        [value]="user.role || 'user'"
                        (change)="changeUserRole(user.id, $event)"
                        [disabled]="processing[user.id]"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-cvac-blue focus:border-transparent"
                        [class.bg-purple-100]="user.role === 'admin'">
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-center gap-2">
                        <button 
                          (click)="confirmDeleteUser(user.id, user.firstname + ' ' + user.lastname)"
                          [disabled]="processing[user.id]"
                          class="text-red-500 hover:text-red-600 disabled:opacity-50"
                          title="Supprimer">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal de confirmation de suppression utilisateur -->
      <div *ngIf="showDeleteUserConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <i class="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
          </div>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{{ userToDelete?.name }}</strong> ? Cette action est irréversible.
          </p>
          <div class="flex gap-4">
            <button 
              (click)="cancelDeleteUser()"
              class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button 
              (click)="deleteUser()"
              [disabled]="deletingUser"
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50">
              <span *ngIf="!deletingUser">
                <i class="fa-solid fa-trash mr-2"></i>
                Supprimer
              </span>
              <span *ngIf="deletingUser">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Suppression...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal d'envoi d'email -->
      <div *ngIf="showEmailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-cvac-blue">Envoyer un email</h3>
            <button 
              (click)="closeEmailModal()"
              class="text-gray-400 hover:text-gray-600">
              <i class="fa-solid fa-times text-xl"></i>
            </button>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Destinataires sélectionnés : {{ selectedUsers.length }}
            </label>
            <div *ngIf="selectedUsers.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm">
              <i class="fa-solid fa-exclamation-triangle mr-2"></i>
              Veuillez sélectionner au moins un utilisateur dans le tableau
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Sujet <span class="text-red-500">*</span>
            </label>
            <input 
              type="text"
              [(ngModel)]="emailSubject"
              placeholder="Sujet de l'email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
          </div>

          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Message <span class="text-red-500">*</span>
            </label>
            <textarea 
              [(ngModel)]="emailMessage"
              rows="8"
              placeholder="Votre message sera personnalisé avec le prénom de chaque destinataire..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Le message commencera automatiquement par "Bonjour [Prénom],"
            </p>
          </div>

          <div class="flex gap-4">
            <button 
              (click)="closeEmailModal()"
              class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button 
              (click)="sendEmailToSelectedUsers()"
              [disabled]="selectedUsers.length === 0 || !emailSubject || !emailMessage || sendingEmail"
              class="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!sendingEmail">
                <i class="fa-solid fa-paper-plane mr-2"></i>
                Envoyer ({{ selectedUsers.length }})
              </span>
              <span *ngIf="sendingEmail">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Envoi en cours...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de confirmation de suppression -->
      <div *ngIf="showDeleteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <i class="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
          </div>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer l'association <strong>{{ associationToDelete?.name }}</strong> ? Cette action est irréversible.
          </p>
          <div class="flex gap-4">
            <button 
              (click)="cancelDeleteAssociation()"
              class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button 
              (click)="deleteAssociation()"
              [disabled]="deletingAssociation"
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50">
              <span *ngIf="!deletingAssociation">
                <i class="fa-solid fa-trash mr-2"></i>
                Supprimer
              </span>
              <span *ngIf="deletingAssociation">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Suppression...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de rejet -->
      <div *ngIf="showRejectReasonModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h3 class="text-xl font-bold text-cvac-blue mb-4">Raison du rejet</h3>
          <textarea 
            [(ngModel)]="rejectionReason"
            placeholder="Expliquez pourquoi vous rejetez cette demande..."
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent mb-4"></textarea>
          <div class="flex gap-4">
            <button 
              (click)="cancelReject()"
              class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button 
              (click)="confirmReject()"
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors">
              Confirmer le rejet
            </button>
          </div>
        </div>
      </div>

      <!-- Statistiques avancées -->
      <section class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-cvac-blue">
                <i class="fa-solid fa-chart-line mr-2"></i>
                Statistiques avancées
              </h2>
              <button 
                (click)="loadAdvancedStats()"
                class="text-cvac-blue hover:text-cvac-light-blue">
                <i class="fa-solid fa-refresh mr-2"></i>
                Actualiser
              </button>
            </div>

            <div *ngIf="loadingAdvancedStats" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
            </div>

            <div *ngIf="!loadingAdvancedStats && advancedStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Graphiques et statistiques détaillées -->
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <h3 class="font-bold text-cvac-blue mb-4">Répartition par statut</h3>
                <div class="space-y-2">
                  <div *ngFor="let stat of advancedStats?.users_by_status" class="flex justify-between">
                    <span>{{ stat.status || 'Sans statut' }}</span>
                    <span class="font-bold">{{ stat.count }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <h3 class="font-bold text-cvac-blue mb-4">Associations par catégorie</h3>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <div *ngFor="let cat of advancedStats?.associations_by_category" class="flex justify-between">
                    <span>{{ cat.category }}</span>
                    <span class="font-bold">{{ cat.count }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <h3 class="font-bold text-cvac-blue mb-4">Évolution mensuelle</h3>
                <div class="text-sm space-y-1">
                  <div *ngFor="let month of (advancedStats?.users_by_month || []).slice(-6)" class="flex justify-between">
                    <span>{{ formatMonth(month.month) }}</span>
                    <span class="font-bold">{{ month.count }} inscrits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modération des actualités -->
      <section class="py-12 bg-cvac-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-cvac-blue">
                <i class="fa-solid fa-newspaper mr-2"></i>
                Modération des actualités
              </h2>
              <div class="flex gap-4">
                <button 
                  (click)="exportAssociationsCSV()"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  <i class="fa-solid fa-download mr-2"></i>
                  Export CSV
                </button>
                <button 
                  (click)="loadAllNews()"
                  class="text-cvac-blue hover:text-cvac-light-blue">
                  <i class="fa-solid fa-refresh mr-2"></i>
                  Actualiser
                </button>
              </div>
            </div>

            <!-- Actualités en attente -->
            <div *ngIf="pendingNews.length > 0" class="mb-8">
              <h3 class="text-lg font-bold text-cvac-blue mb-4">En attente de validation</h3>
              <div class="space-y-4">
                <div 
                  *ngFor="let news of pendingNews" 
                  class="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex-1">
                      <h4 class="font-bold text-cvac-blue mb-1">{{ news.title }}</h4>
                      <p class="text-sm text-gray-600 line-clamp-2">{{ news.excerpt || news.content }}</p>
                      <div class="mt-2 text-xs text-gray-500">
                        <span *ngIf="news.firstname">Par {{ news.firstname }} {{ news.lastname }}</span>
                        <span class="mx-2">•</span>
                        {{ formatDate(news.created_at) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button 
                      (click)="validateNews(news.id, true)"
                      [disabled]="processing[news.id]"
                      class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">
                      <i class="fa-solid fa-check mr-2"></i>
                      Valider
                    </button>
                    <button 
                      (click)="openRejectNewsModal(news.id, news.title)"
                      [disabled]="processing[news.id]"
                      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50">
                      <i class="fa-solid fa-times mr-2"></i>
                      Rejeter
                    </button>
                    <a 
                      [routerLink]="['/news', news.id]"
                      target="_blank"
                      class="bg-cvac-blue hover:bg-cvac-light-blue text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                      <i class="fa-solid fa-eye"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Toutes les actualités -->
            <div *ngIf="loadingAllNews" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
            </div>

            <div *ngIf="!loadingAllNews && allNews.length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Titre</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Auteur</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                    <th class="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    *ngFor="let news of allNews" 
                    class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4">
                      <div class="font-semibold text-cvac-blue">{{ news.title }}</div>
                      <div class="text-xs text-gray-500 line-clamp-1">{{ news.excerpt || news.content }}</div>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-600">
                      <div *ngIf="news.firstname">{{ news.firstname }} {{ news.lastname }}</div>
                      <div class="text-xs text-gray-400">{{ news.author_email }}</div>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-600">{{ formatDate(news.date || news.created_at) }}</td>
                    <td class="py-3 px-4">
                      <span 
                        class="px-2 py-1 rounded text-xs font-semibold"
                        [class.bg-yellow-100]="news.status === 'pending'"
                        [class.bg-green-100]="news.status === 'published'"
                        [class.bg-red-100]="news.status === 'rejected'"
                        [class.bg-gray-100]="!news.status || news.status === 'draft'">
                        {{ getNewsStatusLabel(news.status) }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center justify-center gap-2">
                        <button 
                          *ngIf="news.status === 'pending'"
                          (click)="validateNews(news.id, true)"
                          [disabled]="processing[news.id]"
                          class="text-green-500 hover:text-green-600 disabled:opacity-50"
                          title="Valider">
                          <i class="fa-solid fa-check"></i>
                        </button>
                        <button 
                          (click)="confirmDeleteNews(news.id, news.title)"
                          [disabled]="processing[news.id]"
                          class="text-red-500 hover:text-red-600 disabled:opacity-50"
                          title="Supprimer">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Logs d'activité -->
      <section class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-cvac-blue">
                <i class="fa-solid fa-list-ul mr-2"></i>
                Logs d'activité
              </h2>
              <button 
                (click)="loadAdminLogs()"
                class="text-cvac-blue hover:text-cvac-light-blue">
                <i class="fa-solid fa-refresh mr-2"></i>
                Actualiser
              </button>
            </div>

            <div *ngIf="loadingLogs" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
            </div>

            <div *ngIf="!loadingLogs && adminLogs.length > 0" class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Admin</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Entité</th>
                    <th class="text-left py-3 px-4 font-semibold text-gray-700">Détails</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    *ngFor="let log of adminLogs" 
                    class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-4 text-sm text-gray-600">{{ formatDateTime(log.created_at) }}</td>
                    <td class="py-3 px-4 text-sm text-gray-600">
                      {{ log.firstname }} {{ log.lastname }}
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                        {{ log.action }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-600">
                      {{ log.entity_type }} 
                      <span *ngIf="log.entity_id">#{{ log.entity_id }}</span>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-600">{{ log.details || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Templates d'emails -->
      <section class="py-12 bg-cvac-cream">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-cvac-blue">
                <i class="fa-solid fa-envelope-open-text mr-2"></i>
                Templates d'emails
              </h2>
              <button 
                (click)="openTemplateModal()"
                class="bg-cvac-blue hover:bg-cvac-light-blue text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                <i class="fa-solid fa-plus mr-2"></i>
                Nouveau template
              </button>
            </div>

            <div *ngIf="loadingTemplates" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
            </div>

            <div *ngIf="!loadingTemplates && emailTemplates.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                *ngFor="let template of emailTemplates" 
                class="border border-gray-200 rounded-lg p-4 hover:border-cvac-blue transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-bold text-cvac-blue">{{ template.name }}</h3>
                  <div class="flex gap-2">
                    <button 
                      (click)="editTemplate(template)"
                      class="text-cvac-blue hover:text-cvac-light-blue">
                      <i class="fa-solid fa-edit"></i>
                    </button>
                    <button 
                      (click)="deleteTemplate(template.id)"
                      class="text-red-500 hover:text-red-600">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mb-1"><strong>Sujet:</strong> {{ template.subject }}</p>
                <p class="text-xs text-gray-500 line-clamp-2">{{ template.body }}</p>
                <button 
                  (click)="useTemplate(template)"
                  class="mt-2 text-xs text-cvac-blue hover:text-cvac-light-blue">
                  Utiliser ce template
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Historique des emails -->
      <section class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-cvac-blue">
                <i class="fa-solid fa-history mr-2"></i>
                Historique des emails
              </h2>
              <button 
                (click)="loadEmailHistory()"
                class="text-cvac-blue hover:text-cvac-light-blue">
                <i class="fa-solid fa-refresh mr-2"></i>
                Actualiser
              </button>
            </div>

            <div *ngIf="loadingEmailHistory" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cvac-blue"></div>
            </div>

            <div *ngIf="!loadingEmailHistory && emailHistory.length > 0" class="space-y-4">
              <div 
                *ngFor="let email of emailHistory" 
                class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-bold text-cvac-blue">{{ email.subject }}</h3>
                    <p class="text-xs text-gray-500">{{ formatDateTime(email.created_at) }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm">
                      <span class="text-green-600">{{ email.sent_count }} envoyés</span>
                      <span *ngIf="email.failed_count > 0" class="text-red-600 ml-2">{{ email.failed_count }} échoués</span>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-gray-600 line-clamp-2">{{ email.body }}</p>
                <p class="text-xs text-gray-400 mt-2">Destinataires: {{ email.recipients }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal template email -->
      <div *ngIf="showTemplateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-cvac-blue">{{ editingTemplate ? 'Modifier' : 'Nouveau' }} template</h3>
            <button 
              (click)="closeTemplateModal()"
              class="text-gray-400 hover:text-gray-600">
              <i class="fa-solid fa-times text-xl"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nom du template</label>
              <input 
                type="text"
                [(ngModel)]="currentTemplate.name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Sujet</label>
              <input 
                type="text"
                [(ngModel)]="currentTemplate.subject"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Corps du message</label>
              <textarea 
                [(ngModel)]="currentTemplate.body"
                rows="8"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent"></textarea>
              <p class="text-xs text-gray-500 mt-1">
                Variables disponibles: {{ currentTemplate.variables || 'firstname, association_name, reason' }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Variables (séparées par des virgules)</label>
              <input 
                type="text"
                [(ngModel)]="currentTemplate.variables"
                placeholder="firstname, association_name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent">
            </div>
          </div>

          <div class="flex gap-4 mt-6">
            <button 
              (click)="closeTemplateModal()"
              class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button 
              (click)="saveTemplate()"
              [disabled]="savingTemplate"
              class="flex-1 px-4 py-2 bg-cvac-blue hover:bg-cvac-light-blue text-white rounded-lg font-semibold transition-colors disabled:opacity-50">
              <span *ngIf="!savingTemplate">Enregistrer</span>
              <span *ngIf="savingTemplate">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Enregistrement...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal rejet actualité -->
      <div *ngIf="showRejectNewsModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h3 class="text-xl font-bold text-cvac-blue mb-4">Rejeter l'actualité</h3>
          <p class="text-gray-600 mb-4">Actualité: <strong>{{ newsToReject?.title }}</strong></p>
          <textarea 
            [(ngModel)]="rejectionReason"
            placeholder="Raison du rejet..."
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cvac-blue focus:border-transparent mb-4"></textarea>
          <div class="flex gap-4">
            <button 
              (click)="closeRejectNewsModal()"
              class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button 
              (click)="confirmRejectNews()"
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors">
              Confirmer le rejet
            </button>
          </div>
        </div>
      </div>

      <!-- Modal suppression actualité -->
      <div *ngIf="showDeleteNewsConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <i class="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
          </div>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer l'actualité <strong>{{ newsToDelete?.title }}</strong> ?
          </p>
          <div class="flex gap-4">
            <button 
              (click)="cancelDeleteNews()"
              class="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button 
              (click)="deleteNews()"
              [disabled]="deletingNews"
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50">
              <span *ngIf="!deletingNews">Supprimer</span>
              <span *ngIf="deletingNews">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                Suppression...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages de succès/erreur -->
      <div *ngIf="message" class="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 border-l-4 z-50 max-w-md"
           [class.border-green-500]="messageType === 'success'"
           [class.border-red-500]="messageType === 'error'">
        <p [class.text-green-800]="messageType === 'success'" [class.text-red-800]="messageType === 'error'">
          {{ message }}
        </p>
      </div>
    </main>
  `
})
export class AdminComponent implements OnInit {
  stats: any = null;
  pendingAssociations: any[] = [];
  pendingUsers: any[] = [];
  allAssociations: any[] = [];
  filteredAssociations: any[] = [];
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  loadingAssociations = false;
  loadingUsers = false;
  loadingAllAssociations = false;
  loadingAllUsers = false;
  processing: { [key: number]: boolean } = {};
  showRejectReasonModal = false;
  rejectionReason = '';
  rejectTargetId: number | null = null;
  rejectTargetType: 'association' | 'user' | null = null;
  showDeleteConfirm = false;
  associationToDelete: { id: number; name: string } | null = null;
  deletingAssociation = false;
  showDeleteUserConfirm = false;
  userToDelete: { id: number; name: string } | null = null;
  deletingUser = false;
  selectedUsers: number[] = [];
  showEmailModal = false;
  emailSubject = '';
  emailMessage = '';
  sendingEmail = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  
  // Nouvelles fonctionnalités
  advancedStats: any = null;
  loadingAdvancedStats = false;
  pendingNews: any[] = [];
  allNews: any[] = [];
  loadingAllNews = false;
  adminLogs: any[] = [];
  loadingLogs = false;
  emailTemplates: any[] = [];
  loadingTemplates = false;
  emailHistory: any[] = [];
  loadingEmailHistory = false;
  showTemplateModal = false;
  editingTemplate: any = null;
  currentTemplate: any = { name: '', subject: '', body: '', variables: '' };
  savingTemplate = false;
  showRejectNewsModal = false;
  newsToReject: { id: number; title: string } | null = null;
  showDeleteNewsConfirm = false;
  newsToDelete: { id: number; title: string } | null = null;
  deletingNews = false;
  
  // Recherche et filtres
  searchAssociationsQuery = '';
  searchUsersQuery = '';
  filterAssociationStatus = '';
  filterUserStatus = '';
  filterUserRole = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Vérifier que l'utilisateur est admin
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      // Rediriger si pas admin (le guard devrait déjà gérer ça)
      return;
    }

    this.loadStats();
    this.loadPendingAssociations();
    this.loadPendingUsers();
    this.loadAllAssociations();
    this.loadAllUsers();
    this.loadAdvancedStats();
    this.loadPendingNews();
    this.loadAllNews();
    this.loadAdminLogs();
    this.loadEmailTemplates();
    this.loadEmailHistory();
  }

  loadStats() {
    this.adminService.getStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
      },
      error: () => {
        // Erreur silencieuse
      }
    });
  }

  loadPendingAssociations() {
    this.loadingAssociations = true;
    this.adminService.getPendingAssociations().subscribe({
      next: (response) => {
        if (response.success) {
          this.pendingAssociations = response.data || [];
        }
        this.loadingAssociations = false;
      },
      error: () => {
        this.loadingAssociations = false;
      }
    });
  }

  loadPendingUsers() {
    this.loadingUsers = true;
    this.adminService.getPendingUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.pendingUsers = response.data || [];
        }
        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
      }
    });
  }

  validateAssociation(id: number, approved: boolean, reason?: string) {
    this.processing[id] = true;
    this.adminService.validateAssociation(id, approved, reason).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage(approved ? 'Association validée avec succès' : 'Association rejetée', 'success');
          this.loadPendingAssociations();
          this.loadStats();
        }
        this.processing[id] = false;
      },
      error: () => {
        this.showMessage('Erreur lors de la validation', 'error');
        this.processing[id] = false;
      }
    });
  }

  validateUser(id: number, approved: boolean, reason?: string) {
    this.processing[id] = true;
    this.adminService.validateUser(id, approved, reason).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage(approved ? 'Utilisateur validé avec succès' : 'Utilisateur rejeté', 'success');
          this.loadPendingUsers();
          this.loadStats();
        }
        this.processing[id] = false;
      },
      error: () => {
        this.showMessage('Erreur lors de la validation', 'error');
        this.processing[id] = false;
      }
    });
  }

  showRejectModal(id: number, type: 'association' | 'user') {
    this.rejectTargetId = id;
    this.rejectTargetType = type;
    this.rejectionReason = '';
    this.showRejectReasonModal = true;
  }

  cancelReject() {
    this.showRejectReasonModal = false;
    this.rejectTargetId = null;
    this.rejectTargetType = null;
    this.rejectionReason = '';
  }

  confirmReject() {
    if (!this.rejectTargetId || !this.rejectTargetType) return;

    if (this.rejectTargetType === 'association') {
      this.validateAssociation(this.rejectTargetId, false, this.rejectionReason);
    } else {
      this.validateUser(this.rejectTargetId, false, this.rejectionReason);
    }

    this.cancelReject();
  }

  loadAllAssociations() {
    this.loadingAllAssociations = true;
    this.adminService.getAllAssociations().subscribe({
      next: (response) => {
        if (response.success) {
          this.allAssociations = response.data || [];
          this.filterAssociations();
        }
        this.loadingAllAssociations = false;
      },
      error: () => {
        this.loadingAllAssociations = false;
      }
    });
  }

  filterAssociations() {
    let filtered = [...this.allAssociations];

    if (this.searchAssociationsQuery.trim()) {
      const query = this.searchAssociationsQuery.toLowerCase();
      filtered = filtered.filter(asso =>
        (asso.name && asso.name.toLowerCase().includes(query)) ||
        (asso.description && asso.description.toLowerCase().includes(query)) ||
        (asso.city && asso.city.toLowerCase().includes(query)) ||
        (asso.creator_email && asso.creator_email.toLowerCase().includes(query))
      );
    }

    if (this.filterAssociationStatus) {
      filtered = filtered.filter(asso => (asso.status || 'pending') === this.filterAssociationStatus);
    }

    this.filteredAssociations = filtered;
  }

  changeAssociationStatus(id: number, event: any) {
    const newStatus = event.target.value as 'pending' | 'approved' | 'rejected';
    this.processing[id] = true;
    
    this.adminService.updateAssociationStatus(id, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Statut mis à jour avec succès', 'success');
          this.loadAllAssociations();
          this.loadPendingAssociations();
          this.loadStats();
        }
        this.processing[id] = false;
      },
      error: () => {
        this.showMessage('Erreur lors de la mise à jour du statut', 'error');
        this.processing[id] = false;
        // Recharger pour réinitialiser le select
        this.loadAllAssociations();
      }
    });
  }

  confirmDeleteAssociation(id: number, name: string) {
    this.associationToDelete = { id, name };
    this.showDeleteConfirm = true;
  }

  cancelDeleteAssociation() {
    this.showDeleteConfirm = false;
    this.associationToDelete = null;
  }

  deleteAssociation() {
    if (!this.associationToDelete) return;
    
    this.deletingAssociation = true;
    this.adminService.deleteAssociation(this.associationToDelete.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Association supprimée avec succès', 'success');
          this.loadAllAssociations();
          this.loadPendingAssociations();
          this.loadStats();
        }
        this.deletingAssociation = false;
        this.cancelDeleteAssociation();
      },
      error: () => {
        this.showMessage('Erreur lors de la suppression', 'error');
        this.deletingAssociation = false;
      }
    });
  }

  loadAllUsers() {
    this.loadingAllUsers = true;
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.allUsers = response.data || [];
          this.filterUsers();
        }
        this.loadingAllUsers = false;
      },
      error: () => {
        this.loadingAllUsers = false;
      }
    });
  }

  filterUsers() {
    let filtered = [...this.allUsers];

    if (this.searchUsersQuery.trim()) {
      const query = this.searchUsersQuery.toLowerCase();
      filtered = filtered.filter(user =>
        (user.firstname && user.firstname.toLowerCase().includes(query)) ||
        (user.lastname && user.lastname.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.association_name && user.association_name.toLowerCase().includes(query))
      );
    }

    if (this.filterUserStatus) {
      filtered = filtered.filter(user => (user.status || 'pending') === this.filterUserStatus);
    }

    if (this.filterUserRole) {
      filtered = filtered.filter(user => (user.role || 'user') === this.filterUserRole);
    }

    this.filteredUsers = filtered;
  }

  changeUserStatus(id: number, event: any) {
    const newStatus = event.target.value as 'pending' | 'active' | 'approved' | 'rejected';
    this.processing[id] = true;
    
    // Utiliser la méthode validateUser existante
    const approved = newStatus === 'active' || newStatus === 'approved';
    this.adminService.validateUser(id, approved).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Statut mis à jour avec succès', 'success');
          this.loadAllUsers();
          this.loadPendingUsers();
          this.loadStats();
        }
        this.processing[id] = false;
      },
      error: () => {
        this.showMessage('Erreur lors de la mise à jour du statut', 'error');
        this.processing[id] = false;
        this.loadAllUsers();
      }
    });
  }

  changeUserRole(id: number, event: any) {
    const newRole = event.target.value as 'user' | 'admin';
    this.processing[id] = true;
    
    this.adminService.updateUserRole(id, newRole).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Rôle mis à jour avec succès', 'success');
          this.loadAllUsers();
          this.loadStats();
        }
        this.processing[id] = false;
      },
      error: (error) => {
        this.showMessage(error.error?.message || 'Erreur lors de la mise à jour du rôle', 'error');
        this.processing[id] = false;
        this.loadAllUsers();
      }
    });
  }

  confirmDeleteUser(id: number, name: string) {
    this.userToDelete = { id, name };
    this.showDeleteUserConfirm = true;
  }

  cancelDeleteUser() {
    this.showDeleteUserConfirm = false;
    this.userToDelete = null;
  }

  deleteUser() {
    if (!this.userToDelete) return;
    
    this.deletingUser = true;
    this.adminService.deleteUser(this.userToDelete.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Utilisateur supprimé avec succès', 'success');
          this.loadAllUsers();
          this.loadPendingUsers();
          this.loadStats();
        }
        this.deletingUser = false;
        this.cancelDeleteUser();
      },
      error: (error) => {
        this.showMessage(error.error?.message || 'Erreur lors de la suppression', 'error');
        this.deletingUser = false;
      }
    });
  }

  toggleUserSelection(userId: number) {
    const index = this.selectedUsers.indexOf(userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(userId);
    }
  }

  toggleSelectAllUsers(event: any) {
    if (event.target.checked) {
      this.selectedUsers = this.filteredUsers.map(u => u.id);
    } else {
      this.selectedUsers = [];
    }
  }

  openEmailModal() {
    if (this.selectedUsers.length === 0) {
      this.showMessage('Veuillez sélectionner au moins un utilisateur', 'error');
      return;
    }
    this.showEmailModal = true;
  }

  closeEmailModal() {
    this.showEmailModal = false;
    this.emailSubject = '';
    this.emailMessage = '';
  }

  sendEmailToSelectedUsers() {
    if (this.selectedUsers.length === 0 || !this.emailSubject || !this.emailMessage) {
      this.showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }

    this.sendingEmail = true;
    this.adminService.sendEmailToUsers(this.selectedUsers, this.emailSubject, this.emailMessage).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage(`Emails envoyés : ${response.sent} réussis, ${response.failed} échoués`, 'success');
          this.closeEmailModal();
          this.selectedUsers = [];
        }
        this.sendingEmail = false;
      },
      error: () => {
        this.showMessage('Erreur lors de l\'envoi des emails', 'error');
        this.sendingEmail = false;
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatMonth(month: string): string {
    if (!month) return '';
    const [year, m] = month.split('-');
    const date = new Date(parseInt(year), parseInt(m) - 1);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  loadAdvancedStats() {
    this.loadingAdvancedStats = true;
    this.adminService.getAdvancedStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.advancedStats = response.data;
        }
        this.loadingAdvancedStats = false;
      },
      error: () => {
        this.loadingAdvancedStats = false;
      }
    });
  }

  loadPendingNews() {
    this.adminService.getPendingNews().subscribe({
      next: (response) => {
        if (response.success) {
          this.pendingNews = response.data || [];
        }
      },
      error: () => {}
    });
  }

  loadAllNews() {
    this.loadingAllNews = true;
    this.adminService.getAllNews().subscribe({
      next: (response) => {
        if (response.success) {
          this.allNews = response.data || [];
        }
        this.loadingAllNews = false;
      },
      error: () => {
        this.loadingAllNews = false;
      }
    });
  }

  validateNews(id: number, approved: boolean, reason?: string) {
    this.processing[id] = true;
    this.adminService.validateNews(id, approved, reason).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage(approved ? 'Actualité validée avec succès' : 'Actualité rejetée', 'success');
          this.loadPendingNews();
          this.loadAllNews();
        }
        this.processing[id] = false;
      },
      error: () => {
        this.showMessage('Erreur lors de la validation', 'error');
        this.processing[id] = false;
      }
    });
  }

  openRejectNewsModal(id: number, title: string) {
    this.newsToReject = { id, title };
    this.showRejectNewsModal = true;
    this.rejectionReason = '';
  }

  closeRejectNewsModal() {
    this.showRejectNewsModal = false;
    this.newsToReject = null;
    this.rejectionReason = '';
  }

  confirmRejectNews() {
    if (!this.newsToReject) return;
    this.validateNews(this.newsToReject.id, false, this.rejectionReason);
    this.closeRejectNewsModal();
  }

  confirmDeleteNews(id: number, title: string) {
    this.newsToDelete = { id, title };
    this.showDeleteNewsConfirm = true;
  }

  cancelDeleteNews() {
    this.showDeleteNewsConfirm = false;
    this.newsToDelete = null;
  }

  deleteNews() {
    if (!this.newsToDelete) return;
    this.deletingNews = true;
    this.adminService.deleteNews(this.newsToDelete.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Actualité supprimée avec succès', 'success');
          this.loadPendingNews();
          this.loadAllNews();
        }
        this.deletingNews = false;
        this.cancelDeleteNews();
      },
      error: () => {
        this.showMessage('Erreur lors de la suppression', 'error');
        this.deletingNews = false;
      }
    });
  }

  getNewsStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'draft': 'Brouillon',
      'pending': 'En attente',
      'published': 'Publiée',
      'rejected': 'Rejetée'
    };
    return labels[status] || 'Inconnu';
  }

  loadAdminLogs() {
    this.loadingLogs = true;
    this.adminService.getAdminLogs().subscribe({
      next: (response) => {
        if (response.success) {
          this.adminLogs = response.data || [];
        }
        this.loadingLogs = false;
      },
      error: () => {
        this.loadingLogs = false;
      }
    });
  }

  loadEmailTemplates() {
    this.loadingTemplates = true;
    this.adminService.getEmailTemplates().subscribe({
      next: (response) => {
        if (response.success) {
          this.emailTemplates = response.data || [];
        }
        this.loadingTemplates = false;
      },
      error: () => {
        this.loadingTemplates = false;
      }
    });
  }

  loadEmailHistory() {
    this.loadingEmailHistory = true;
    this.adminService.getEmailHistory().subscribe({
      next: (response) => {
        if (response.success) {
          this.emailHistory = response.data || [];
        }
        this.loadingEmailHistory = false;
      },
      error: () => {
        this.loadingEmailHistory = false;
      }
    });
  }

  openTemplateModal() {
    this.currentTemplate = { name: '', subject: '', body: '', variables: '' };
    this.editingTemplate = null;
    this.showTemplateModal = true;
  }

  editTemplate(template: any) {
    this.currentTemplate = { ...template };
    this.editingTemplate = template;
    this.showTemplateModal = true;
  }

  closeTemplateModal() {
    this.showTemplateModal = false;
    this.editingTemplate = null;
    this.currentTemplate = { name: '', subject: '', body: '', variables: '' };
  }

  saveTemplate() {
    if (!this.currentTemplate.name || !this.currentTemplate.subject || !this.currentTemplate.body) {
      this.showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }

    this.savingTemplate = true;
    const templateData = {
      id: this.editingTemplate?.id,
      name: this.currentTemplate.name,
      subject: this.currentTemplate.subject,
      body: this.currentTemplate.body,
      variables: this.currentTemplate.variables || ''
    };

    this.adminService.saveEmailTemplate(templateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.showMessage('Template sauvegardé avec succès', 'success');
          this.loadEmailTemplates();
          this.closeTemplateModal();
        }
        this.savingTemplate = false;
      },
      error: () => {
        this.showMessage('Erreur lors de la sauvegarde', 'error');
        this.savingTemplate = false;
      }
    });
  }

  deleteTemplate(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      this.adminService.deleteEmailTemplate(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.showMessage('Template supprimé avec succès', 'success');
            this.loadEmailTemplates();
          }
        },
        error: () => {
          this.showMessage('Erreur lors de la suppression', 'error');
        }
      });
    }
  }

  useTemplate(template: any) {
    this.emailSubject = template.subject;
    this.emailMessage = template.body;
    this.showEmailModal = true;
    this.closeTemplateModal();
  }

  exportUsersCSV() {
    this.adminService.exportUsersCSV().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showMessage('Export CSV réussi', 'success');
      },
      error: () => {
        this.showMessage('Erreur lors de l\'export', 'error');
      }
    });
  }

  exportAssociationsCSV() {
    this.adminService.exportAssociationsCSV().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `associations_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showMessage('Export CSV réussi', 'success');
      },
      error: () => {
        this.showMessage('Erreur lors de l\'export', 'error');
      }
    });
  }

  showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }
}

