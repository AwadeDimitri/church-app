import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import type { SessionUser } from './types';

export const sessionEvents = eventGroup({
  source: 'Session',
  events: {
    bootstrapped: type<{ user: SessionUser | null }>(),
    signedIn: type<{ user: SessionUser }>(),
    signedOut: type<void>(),
  },
});
