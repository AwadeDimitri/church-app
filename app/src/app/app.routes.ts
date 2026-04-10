import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home'),
  },
  {
    path: 'sermons',
    loadComponent: () => import('./features/sermons/sermons'),
  },
  {
    path: 'donate',
    loadComponent: () => import('./features/donate/donate'),
  },
  {
    path: 'prayer',
    loadComponent: () => import('./features/prayer/prayer'),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile'),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
