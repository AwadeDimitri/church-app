import { signalStoreFeature, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import type { SermonListState } from '@features/sermons/util';
import { sermonListEvents } from './events';

const initialState: SermonListState = {
  search: '',
  categoryId: null,
};

export function withSermonListReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(sermonListEvents.searchChanged, ({ payload }) => ({
        search: payload.query.trim(),
      })),
      on(sermonListEvents.categoryChanged, ({ payload }) => ({
        categoryId: payload.categoryId,
      })),
    ),
  );
}
