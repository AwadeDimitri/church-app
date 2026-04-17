import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import type { SessionUser } from './types';

export const sessionEvents = eventGroup({
  source: 'Session',
  events: {
    signedIn: type<{ user: SessionUser }>(),
    signedOut: type<void>(),
  },
});
