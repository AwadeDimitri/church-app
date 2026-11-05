import { signalStoreFeature, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';

import type { BibleSearchState } from '@features/bible/util';

import { bibleSearchEvents } from './events';

const initialState: BibleSearchState = {
  searchQuery: '',
};

export function withBibleSearchReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(bibleSearchEvents.queryChanged, ({ payload }) => ({
        searchQuery: payload.query.trim(),
      })),
    ),
  );
}
