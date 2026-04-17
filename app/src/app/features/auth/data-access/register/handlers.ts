import { signalStoreFeature, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import { withEffects, Events, Dispatcher } from '@ngrx/signals/events';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { tap } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { sessionEvents } from '../session/events';
import type { SessionUser } from '../session/types';
import { passwordSignInApiEvents, passwordSignInPageEvents } from './events';

export function withRegisterHandlers() {
  return signalStoreFeature(
    withProps(() => {
      const authService = inject(AuthService);
      const dispatcher = inject(Dispatcher);

      const signInMutation = injectMutation(() => ({
        mutationFn: ({
          email,
          password,
          fullName,
        }: {
          email: string;
          password: string;
          fullName: string;
        }) => authService.signUp(email, password, fullName),
        onSuccess: (data) => {
          const user: SessionUser = {
            id: data.user!.id,
            email: data.user!.email!,
            fullName: data.user!.user_metadata?.['full_name'] ?? '',
          };
          dispatcher.dispatch(sessionEvents.signedIn({ user }));
        },
        onError: (err: Error) => {
          const message =
            err.message === 'Invalid login credentials'
              ? 'Email ou mot de passe incorrect'
              : 'Une erreur est survenue';
          dispatcher.dispatch(passwordSignInApiEvents.failed({ message }));
        },
      }));

      return { signInMutation };
    }),

    withEffects((store) => {
      const events = inject(Events);

      return {
        triggerSignInMutation$: events
          .on(passwordSignInPageEvents.signIn)
          .pipe(tap(({ payload }) => store.signInMutation.mutate(payload))),
      };
    }),
  );
}
