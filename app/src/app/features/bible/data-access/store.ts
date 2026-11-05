import { signalStore } from '@ngrx/signals';
import { withBibleHandlers, withBibleReducers } from './bible';
import { withBibleSearchHandlers, withBibleSearchReducers } from './search';

export const BibleStore = signalStore(
  { providedIn: 'root' },
  withBibleReducers(),
  withBibleHandlers(),
  withBibleSearchReducers(),
  withBibleSearchHandlers(),
);
