import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import type {
  CreatePrayerRequestMutationVariables,
  LikePrayerMutationVariables,
  UnlikePrayerMutationVariables,
  MarkPrayerAsAnsweredMutationVariables,
} from '@core/graphql/generated';

export const prayerMutationEvents = eventGroup({
  source: 'PrayerMutations',
  events: {
    createRequested: type<CreatePrayerRequestMutationVariables>(),
    likeRequested: type<LikePrayerMutationVariables>(),
    unlikeRequested: type<UnlikePrayerMutationVariables>(),
    markAnsweredRequested: type<MarkPrayerAsAnsweredMutationVariables>(),
  },
});

export const prayerEntityEvents = eventGroup({
  source: 'PrayerEntity',
  events: {
    created: type<{ id: string }>(),
    liked: type<{ prayerId: string }>(),
    unliked: type<{ prayerId: string }>(),
    markedAnswered: type<{ id: string }>(),
  },
});
