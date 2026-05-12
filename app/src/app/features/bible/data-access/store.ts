import { signalStore } from '@ngrx/signals';
import { withBibleHandlers, withBibleReducers } from './bible';

export const BibleStore = signalStore(
  { providedIn: 'root' },
  withBibleReducers(),
  withBibleHandlers(),
);
