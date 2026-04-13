import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login'),
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup'),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home'),
    canActivate: [authGuard],
  },
  {
    path: 'sermons',
    loadComponent: () => import('./features/sermons/sermons'),
    canActivate: [authGuard],
  },
  {
    path: 'sermons/:id',
    loadComponent: () => import('./features/sermons/sermon-detail/sermon-detail'),
    canActivate: [authGuard],
  },
  {
    path: 'donate',
    loadComponent: () => import('./features/donate/donate'),
    canActivate: [authGuard],
  },
  {
    path: 'prayer',
    loadComponent: () => import('./features/prayer/prayer'),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile'),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
