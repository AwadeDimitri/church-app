import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import type { PrayerCategoryFilter, PrayerScope } from './types';

export const prayerListEvents = eventGroup({
  source: 'PrayerList',
  events: {
    scopeChanged: type<{ scope: PrayerScope }>(),
    categoryChanged: type<{ category: PrayerCategoryFilter }>(),
    loadMoreRequested: type<void>(),
    refreshed: type<void>(),
  },
});
