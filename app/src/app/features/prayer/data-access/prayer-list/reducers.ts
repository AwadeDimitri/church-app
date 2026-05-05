import { signalStoreFeature, withState } from '@ngrx/signals';
import { withReducer, on } from '@ngrx/signals/events';
import type { PrayerListState } from '@features/prayer/util';
import { prayerListEvents } from './events';

const initialState: PrayerListState = {
  scope: 'all',
  selectedCategory: 'all',
};

export function withPrayerListReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(prayerListEvents.scopeChanged, ({ payload }) => ({ scope: payload.scope })),
      on(prayerListEvents.categoryChanged, ({ payload }) => ({ selectedCategory: payload.category })),
    ),
  );
}
