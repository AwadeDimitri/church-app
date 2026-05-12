import { Routes } from '@angular/router';
import { memberGuard } from '@core/guards/member.guard';

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
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/feature/reset-password/reset-password'),
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
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home'),
      },
      {
        path: 'sermons',
        loadComponent: () =>
          import('./features/sermons/feature/sermon-list/sermon-list'),
      },
      {
        path: 'sermons/:id',
        loadComponent: () =>
          import('./features/sermons/feature/sermon-detail/sermon-detail'),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/events/feature/event-list/event-list'),
      },
      {
        path: 'donate',
        loadComponent: () => import('./features/donate/donate'),
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
        loadComponent: () =>
          import('./features/bible/bible-chapter/bible-chapter'),
      },
      {
        path: 'prayer',
        canActivate: [memberGuard],
        data: { reason: 'prayer' },
        loadComponent: () =>
          import('./features/prayer/feature/prayer-list/prayer-list'),
      },
      {
        path: 'prayer/new',
        canActivate: [memberGuard],
        data: { reason: 'prayer' },
        loadComponent: () =>
          import('./features/prayer/feature/prayer-new/prayer-new'),
      },
      {
        path: 'prayer/:id',
        canActivate: [memberGuard],
        data: { reason: 'prayer' },
        loadComponent: () =>
          import('./features/prayer/feature/prayer-detail/prayer-detail'),
      },
      {
        path: 'profile',
        canActivate: [memberGuard],
        data: { reason: 'profile' },
        loadComponent: () =>
          import('./features/profile/feature/profile/profile'),
      },
      {
        path: 'profile/edit',
        canActivate: [memberGuard],
        data: { reason: 'profile' },
        loadComponent: () =>
          import('./features/profile/feature/profile-edit/profile-edit'),
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
