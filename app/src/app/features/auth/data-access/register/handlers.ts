import { signalStoreFeature, withProps } from '@ngrx/signals';
import { inject } from '@angular/core';
import { withEffects, Events, Dispatcher } from '@ngrx/signals/events';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { tap } from 'rxjs';
import { AuthError } from '@supabase/supabase-js';
import { AuthService } from '@core/services/auth.service';
import { sessionEvents } from '../session/events';
import type { SessionUser } from '../session/types';
import { registerApiEvents, registerPageEvents } from './events';

const SIGNUP_ERROR_MESSAGES: Record<string, string> = {
  user_already_exists: 'Cet email est déjà utilisé',
  weak_password: 'Mot de passe trop faible',
  email_address_invalid: "L'email n'est pas valide",
  over_email_send_rate_limit: 'Trop de tentatives, réessayez plus tard',
  signup_disabled: 'Les inscriptions sont désactivées',
};

const EMAIL_ALREADY_USED_MESSAGE = 'Cet email est déjà utilisé';
const GENERIC_ERROR_MESSAGE = 'Une erreur est survenue';

export function withRegisterHandlers() {
  return signalStoreFeature(
    withProps(() => {
      const authService = inject(AuthService);
      const dispatcher = inject(Dispatcher);

      const signUpMutation = injectMutation(() => ({
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
          if (data.user && data.user.identities?.length === 0) {
            dispatcher.dispatch(
              registerApiEvents.failed({ message: EMAIL_ALREADY_USED_MESSAGE }),
            );
            return;
          }

          const user: SessionUser = {
            id: data.user!.id,
            email: data.user!.email!,
            fullName: data.user!.user_metadata?.['full_name'] ?? '',
          };
          dispatcher.dispatch(sessionEvents.signedIn({ user }));
        },
        onError: (err: Error) => {
          const code = err instanceof AuthError ? err.code : undefined;
          const message =
            (code && SIGNUP_ERROR_MESSAGES[code]) ?? GENERIC_ERROR_MESSAGE;
          dispatcher.dispatch(registerApiEvents.failed({ message }));
        },
      }));

      return { signUpMutation };
    }),

    withEffects((store) => {
      const events = inject(Events);

      return {
        triggerSignUpMutation$: events
          .on(registerPageEvents.signup)
          .pipe(tap(({ payload }) => store.signUpMutation.mutate(payload))),
      };
    }),
  );
}
