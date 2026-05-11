import { signalStore } from '@ngrx/signals';
import { withEventListHandlers } from './event-list';

export const EventStore = signalStore(
  { providedIn: 'root' },
  withEventListHandlers(),
);
