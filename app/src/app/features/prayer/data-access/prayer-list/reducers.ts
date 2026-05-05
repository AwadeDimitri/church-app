import { signalStoreFeature, withState } from '@ngrx/signals';
import { withReducer, on } from '@ngrx/signals/events';
import { prayerListEvents } from './events';
import type { PrayerListState } from './types';

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
