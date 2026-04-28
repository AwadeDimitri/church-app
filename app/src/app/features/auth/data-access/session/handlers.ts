import { signalStoreFeature } from '@ngrx/signals';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { withEffects, Events, Dispatcher } from '@ngrx/signals/events';
import { Router } from '@angular/router';
import { combineLatest, distinctUntilChanged, filter, map, tap } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { sessionEvents } from './events';
import type { SessionUser } from './types';

const isInternalUrl = (url: string): boolean =>
  url.startsWith('/') && !url.startsWith('//');

export function withSessionHandlers() {
  return signalStoreFeature(
    withEffects(() => {
      const events = inject(Events);
      const router = inject(Router);
      const authService = inject(AuthService);
      const dispatcher = inject(Dispatcher);

      const user$ = toObservable(authService.user);
      const loading$ = toObservable(authService.loading);

      return {
        bootstrapSession$: combineLatest([user$, loading$]).pipe(
          filter(([, loading]) => !loading),
          map(([user]): SessionUser | null =>
            user
              ? {
                  id: user.id,
                  email: user.email ?? '',
                  fullName:
                    (user.user_metadata?.['full_name'] as string) ?? '',
                }
              : null,
          ),
          distinctUntilChanged((a, b) => a?.id === b?.id),
          tap((user) =>
            dispatcher.dispatch(sessionEvents.bootstrapped({ user })),
          ),
        ),

        navigateOnSignedIn$: events.on(sessionEvents.signedIn).pipe(
          tap(() => {
            const redirect =
              router.routerState.snapshot.root.queryParamMap.get('redirect');
            const target =
              redirect && isInternalUrl(redirect) ? redirect : '/home';
            router.navigateByUrl(target);
          }),
        ),

        navigateOnSignedOut$: events
          .on(sessionEvents.signedOut)
          .pipe(tap(() => router.navigate(['/login']))),
      };
    }),
  );
}
