import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { Dispatcher, Events, withEffects } from '@ngrx/signals/events';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom, lastValueFrom, tap } from 'rxjs';

import {
  GetProfileGQL,
  UpdateProfileGQL,
  type UsersUpdateInput,
} from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';
import { AuthService } from '@core/services/auth.service';

import type { ProfileStats, ProfileUser } from '@features/profile/util';

import { profileEntityEvents, profileEvents } from './events';

const EMPTY_STATS: ProfileStats = { sermons: 0, prayers: 0, donations: 0 };

export function withProfileHandlers() {
  return signalStoreFeature(
    withProps(() => {
      const authService = inject(AuthService);
      const dispatcher = inject(Dispatcher);
      const queryClient = inject(QueryClient);
      const getProfileGQL = inject(GetProfileGQL);
      const updateProfileGQL = inject(UpdateProfileGQL);

      const userId = computed(() => authService.user()?.id ?? null);
      const profileKey = (id: string) => ['profile', id] as const;

      const profileQuery = injectQuery(() => ({
        queryKey: ['profile', userId()],
        enabled: !!userId(),
        queryFn: async ({ signal }) => {
          const id = userId()!;
          const result = await firstValueFrom(
            getProfileGQL.fetch({
              variables: { userId: id },
              context: { fetchOptions: { signal } },
            }),
          );
          return {
            user:
              unwrapNodes<ProfileUser>(result.data?.usersCollection)[0] ?? null,
            stats: {
              sermons: result.data?.sermons_count?.totalCount ?? 0,
              prayers: result.data?.user_prayers_count?.totalCount ?? 0,
              donations: 0,
            } satisfies ProfileStats,
          };
        },
      }));

      const updateProfileMutation = injectMutation(() => ({
        mutationFn: async (set: UsersUpdateInput) => {
          const id = userId();
          if (!id) throw new Error('Not authenticated');
          const result = await lastValueFrom(
            updateProfileGQL.mutate({ variables: { userId: id, set } }),
          );
          if (result.error) throw result.error;
          return { id };
        },
        onSuccess: ({ id }) => {
          queryClient.invalidateQueries({ queryKey: profileKey(id) });
          dispatcher.dispatch(profileEntityEvents.updated());
        },
      }));

      return {
        profileQuery,
        updateProfileMutation,
        userId,
        user: computed(() => profileQuery.data()?.user ?? null),
        stats: computed(() => profileQuery.data()?.stats ?? EMPTY_STATS),
        isPending: computed(() => profileQuery.isPending()),
        loading: computed(() => profileQuery.isFetching()),
        error: computed(() => profileQuery.error()),
        isUpdating: computed(() => updateProfileMutation.isPending()),
        updateError: computed(() => updateProfileMutation.error()),
      };
    }),

    withEffects((store) => {
      const events = inject(Events);
      const router = inject(Router);
      return {
        onRefresh$: events.on(profileEvents.refreshed).pipe(
          tap(() => store.profileQuery.refetch()),
        ),
        onUpdate$: events.on(profileEvents.updateRequested).pipe(
          tap(({ payload }) => store.updateProfileMutation.mutate(payload)),
        ),
        navigateOnUpdated$: events.on(profileEntityEvents.updated).pipe(
          tap(() => router.navigateByUrl('/profile')),
        ),
      };
    }),
  );
}
