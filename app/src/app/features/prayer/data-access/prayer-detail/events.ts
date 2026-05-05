import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const prayerDetailEvents = eventGroup({
  source: 'PrayerDetail',
  events: {
    viewRequested: type<{ id: string }>(),
  },
});
