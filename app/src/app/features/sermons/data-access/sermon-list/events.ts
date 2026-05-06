import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const sermonListEvents = eventGroup({
  source: 'SermonList',
  events: {
    searchChanged: type<{ query: string }>(),
    categoryChanged: type<{ categoryId: string | null }>(),
    loadMoreRequested: type<void>(),
    refreshed: type<void>(),
  },
});
