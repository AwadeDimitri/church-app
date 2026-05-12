import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

import type { UsersUpdateInput } from '@core/graphql/generated';

export const profileEvents = eventGroup({
  source: 'Profile',
  events: {
    refreshed: type<void>(),
    updateRequested: type<UsersUpdateInput>(),
  },
});

export const profileEntityEvents = eventGroup({
  source: 'ProfileEntity',
  events: {
    updated: type<void>(),
  },
});
