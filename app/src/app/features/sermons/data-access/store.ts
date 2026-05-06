import { signalStore } from '@ngrx/signals';
import {
  withSermonDetailHandlers,
  withSermonDetailReducers,
} from './sermon-detail';
import {
  withSermonListHandlers,
  withSermonListReducers,
} from './sermon-list';

export const SermonStore = signalStore(
  { providedIn: 'root' },
  withSermonListReducers(),
  withSermonListHandlers(),
  withSermonDetailReducers(),
  withSermonDetailHandlers(),
);
