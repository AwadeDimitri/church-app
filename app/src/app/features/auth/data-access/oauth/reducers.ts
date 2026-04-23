import { signalStoreFeature, withState } from '@ngrx/signals';
import { withReducer, on } from '@ngrx/signals/events';
import { oauthSignInApiEvents, oauthSignInPageEvents } from './events';

type OauthState = {
  googleSignInErrorMessage: string | null;
};

const initialState: OauthState = {
  googleSignInErrorMessage: null,
};

export function withOauthReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(
        oauthSignInApiEvents.failed,
        (event): Partial<OauthState> => ({
          googleSignInErrorMessage: event.payload.message,
        }),
      ),
      on(
        oauthSignInPageEvents.signInWithGoogle,
        (): Partial<OauthState> => ({
          googleSignInErrorMessage: null,
        }),
      ),
    ),
  );
}
