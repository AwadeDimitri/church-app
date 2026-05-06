import { signalStoreFeature, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import type { SermonDetailState } from '@features/sermons/util';
import { sermonDetailEvents } from './events';

const initialState: SermonDetailState = {
  currentSermonId: null,
};

export function withSermonDetailReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(sermonDetailEvents.viewRequested, ({ payload }) => ({
        currentSermonId: payload.id,
      })),
    ),
  );
}
