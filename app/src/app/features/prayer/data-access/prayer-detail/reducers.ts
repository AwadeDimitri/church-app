import { signalStoreFeature, withState } from '@ngrx/signals';
import type { PrayerDetailState } from '@features/prayer/util';
import { on, withReducer } from '@ngrx/signals/events';
import { prayerDetailEvents } from './events';

const initialState: PrayerDetailState = {
  currentPrayerId: null,
};

export function withPrayerDetailReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(prayerDetailEvents.viewRequested, ({ payload }) => ({
        currentPrayerId: payload.id,
      })),
    ),
  );
}
