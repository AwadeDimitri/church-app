import { signalStore } from '@ngrx/signals';
import {
  withIntercessionHandlers,
  withIntercessionReducers,
} from './intercessions';
import { withPrayerListHandlers, withPrayerListReducers } from './prayer-list';
import { withPrayerMutationHandlers } from './prayer-mutations';

export const PrayerStore = signalStore(
  { providedIn: 'root' },
  withPrayerListReducers(),
  withPrayerListHandlers(),
  withPrayerMutationHandlers(),
  withIntercessionReducers(),
  withIntercessionHandlers(),
);
