import { signalStoreFeature, withState } from '@ngrx/signals';
import { withReducer, on } from '@ngrx/signals/events';
import type { IntercessionListState } from '@features/prayer/util';
import { intercessionListEvents } from './events';

const initialState: IntercessionListState = {
  currentPrayerId: null,
};

export function withIntercessionReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(intercessionListEvents.viewRequested, ({ payload }) => ({
        currentPrayerId: payload.prayerId,
      })),
      on(intercessionListEvents.cleared, () => ({ currentPrayerId: null })),
    ),
  );
}
