import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const sermonDetailEvents = eventGroup({
  source: 'SermonDetail',
  events: {
    viewRequested: type<{ id: string }>(),
  },
});
