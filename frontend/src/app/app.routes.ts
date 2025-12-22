import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'missions-values',
    loadComponent: () => import('./pages/missions-values/missions-values.component').then(m => m.MissionsValuesComponent)
  },
  {
    path: 'members',
    loadComponent: () => import('./pages/members/members.component').then(m => m.MembersComponent)
  },
  {
    path: 'news',
    loadComponent: () => import('./pages/news/news.component').then(m => m.NewsComponent)
  },
  {
    path: 'news/new',
    loadComponent: () => import('./pages/news/news-form.component').then(m => m.NewsFormComponent)
  },
  {
    path: 'news/:id/edit',
    loadComponent: () => import('./pages/news/news-form.component').then(m => m.NewsFormComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'associations',
    loadComponent: () => import('./pages/associations/associations.component').then(m => m.AssociationsComponent)
  },
  {
    path: 'directory/register',
    loadComponent: () => import('./pages/directory/register/directory-register.component').then(m => m.DirectoryRegisterComponent),
    canActivate: [authGuard]
  },
  {
    path: 'directory/:id/edit',
    loadComponent: () => import('./pages/directory/edit/directory-edit.component').then(m => m.DirectoryEditComponent),
    canActivate: [authGuard]
  },
  {
    path: 'directory/:id',
    loadComponent: () => import('./pages/directory/detail/directory-detail.component').then(m => m.DirectoryDetailComponent)
  },
  {
    path: 'directory',
    loadComponent: () => import('./pages/directory/directory.component').then(m => m.DirectoryComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'legal',
    loadComponent: () => import('./pages/legal/legal.component').then(m => m.LegalComponent)
  },
  {
    path: 'resources',
    loadComponent: () => import('./pages/resources/resources.component').then(m => m.ResourcesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

