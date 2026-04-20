import { signalStoreFeature, withState } from '@ngrx/signals';
import { withReducer, on } from '@ngrx/signals/events';
import { registerApiEvents, registerPageEvents } from './events';

type RegisterState = {
  registerErrorMessage: string | null;
};

const initialState: RegisterState = {
  registerErrorMessage: null,
};

export function withRegisterReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(
        registerApiEvents.failed,
        (event): Partial<RegisterState> => ({
          registerErrorMessage: event.payload.message,
        }),
      ),
      on(
        registerPageEvents.signup,
        (): Partial<RegisterState> => ({
          registerErrorMessage: null,
        }),
      ),
    ),
  );
}
