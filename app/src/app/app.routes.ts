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
        path: 'donate',
        loadComponent: () => import('./features/donate/donate'),
      },
      {
        path: 'prayer',
        loadComponent: () => import('./features/prayer/prayer'),
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
