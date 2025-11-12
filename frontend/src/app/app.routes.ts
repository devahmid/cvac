import { Routes } from '@angular/router';

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
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'associations',
    loadComponent: () => import('./pages/associations/associations.component').then(m => m.AssociationsComponent)
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

