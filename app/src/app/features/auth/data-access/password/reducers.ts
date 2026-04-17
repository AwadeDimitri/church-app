import { signalStoreFeature, withState } from '@ngrx/signals';
import { withReducer, on } from '@ngrx/signals/events';
import { passwordSignInApiEvents, passwordSignInPageEvents } from './events';

type PasswordState = {
  signInErrorMessage: string | null;
};

const initialState: PasswordState = {
  signInErrorMessage: null,
};

export function withPasswordReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(
        passwordSignInApiEvents.failed,
        (event): Partial<PasswordState> => ({
          signInErrorMessage: event.payload.message,
        }),
      ),
      on(
        passwordSignInPageEvents.signIn,
        (): Partial<PasswordState> => ({
          signInErrorMessage: null,
        }),
      ),
    ),
  );
}
