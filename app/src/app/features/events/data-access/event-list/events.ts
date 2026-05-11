import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const eventListEvents = eventGroup({
  source: 'EventList',
  events: {
    loadMoreRequested: type<void>(),
    refreshed: type<void>(),
  },
});
