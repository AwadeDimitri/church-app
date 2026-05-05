import { eventGroup } from '@ngrx/signals/events';
import { type } from '@ngrx/signals';
import type {
  CreatePrayerIntercessionMutationVariables,
  DeletePrayerIntercessionMutationVariables,
  LikeIntercessionMutationVariables,
  UnlikeIntercessionMutationVariables,
} from '@core/graphql/generated';

export const intercessionListEvents = eventGroup({
  source: 'IntercessionList',
  events: {
    viewRequested: type<{ prayerId: string }>(),
    cleared: type<void>(),
  },
});

export const intercessionMutationEvents = eventGroup({
  source: 'IntercessionMutations',
  events: {
    createRequested: type<CreatePrayerIntercessionMutationVariables>(),
    likeRequested: type<LikeIntercessionMutationVariables>(),
    unlikeRequested: type<UnlikeIntercessionMutationVariables>(),
    deleteRequested: type<DeletePrayerIntercessionMutationVariables>(),
  },
});

export const intercessionEntityEvents = eventGroup({
  source: 'IntercessionEntity',
  events: {
    created: type<{ prayerId: string }>(),
    liked: type<{ id: string }>(),
    unliked: type<{ id: string }>(),
    deleted: type<{ id: string }>(),
  },
});
