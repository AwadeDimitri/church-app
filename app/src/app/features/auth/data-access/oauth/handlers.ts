import { signalStoreFeature, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import { withEffects, Events, Dispatcher } from '@ngrx/signals/events';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { tap } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { oauthSignInApiEvents, oauthSignInPageEvents } from './events';

export function withOauthHandlers() {
  return signalStoreFeature(
    withProps(() => {
      const authService = inject(AuthService);
      const dispatcher = inject(Dispatcher);

      const googleSignInMutation = injectMutation(() => ({
        mutationFn: () => authService.signInWithGoogle(),
        onError: (err: Error) => {
          const message =
            err.message || 'Impossible de lancer la connexion Google';
          dispatcher.dispatch(oauthSignInApiEvents.failed({ message }));
        },
      }));

      return { googleSignInMutation };
    }),

    withEffects((store) => {
      const events = inject(Events);

      return {
        triggerGoogleSignInMutation$: events
          .on(oauthSignInPageEvents.signInWithGoogle)
          .pipe(tap(() => store.googleSignInMutation.mutate())),
      };
    }),
  );
}
