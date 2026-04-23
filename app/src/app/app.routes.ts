import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    loadComponent: () => import('@shared/layouts/auth-layout/auth-layout'),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/feature/login/login'),
      },
      {
        path: 'signup',
        loadComponent: () => import('./features/auth/feature/signup/signup'),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/feature/forgot-password/forgot-password'),
      },
      {
        path: 'auth/callback',
        loadComponent: () =>
          import('./features/auth/feature/auth-callback/auth-callback'),
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('@shared/layouts/app-layout/app-layout'),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home'),
      },
      {
        path: 'sermons',
        loadComponent: () => import('./features/sermons/sermons'),
      },
      {
        path: 'sermons/:id',
        loadComponent: () =>
          import('./features/sermons/sermon-detail/sermon-detail'),
      },
      {
        path: 'events',
        loadComponent: () => import('./features/events/events'),
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
        path: 'prayer/new',
        loadComponent: () =>
          import('./features/prayer/prayer-new/prayer-new'),
      },
      {
        path: 'prayer/:id',
        loadComponent: () =>
          import('./features/prayer/prayer-detail/prayer-detail'),
      },
      {
        path: 'bible',
        loadComponent: () => import('./features/bible/bible'),
      },
      {
        path: 'bible/:bookSlug',
        loadComponent: () => import('./features/bible/bible-book/bible-book'),
      },
      {
        path: 'bible/:bookSlug/:chapter',
        loadComponent: () => import('./features/bible/bible-chapter/bible-chapter'),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
