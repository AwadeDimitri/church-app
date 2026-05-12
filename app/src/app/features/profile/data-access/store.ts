import { signalStore } from '@ngrx/signals';
import { withProfileHandlers } from './profile';

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withProfileHandlers(),
);
