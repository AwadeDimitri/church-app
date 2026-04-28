import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const memberGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const reason = route.data['reason'] as string | undefined;
  return router.createUrlTree(['/login'], {
    queryParams: {
      ...(reason ? { reason } : {}),
      redirect: state.url,
    },
  });
};
