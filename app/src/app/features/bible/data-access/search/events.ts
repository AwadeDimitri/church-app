import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const bibleSearchEvents = eventGroup({
  source: 'Bible Search',
  events: {
    queryChanged: type<{ query: string }>(),
  },
});
