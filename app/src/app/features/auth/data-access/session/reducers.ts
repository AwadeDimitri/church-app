import { signalStoreFeature, withState } from '@ngrx/signals';
import { withReducer, on } from '@ngrx/signals/events';
import { sessionEvents } from './events';
import type { SessionStatus, SessionUser } from './types';

type SessionState = {
  sessionStatus: SessionStatus;
  user: SessionUser | null;
};

const initialState: SessionState = {
  sessionStatus: 'pending',
  user: null,
};

export function withSessionReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(
        sessionEvents.signedIn,
        (event): Partial<SessionState> => ({
          sessionStatus: 'authenticated',
          user: event.payload.user,
        }),
      ),
      on(
        sessionEvents.signedOut,
        (): Partial<SessionState> => ({
          sessionStatus: 'unauthenticated',
          user: null,
        }),
      ),
    ),
  );
}
