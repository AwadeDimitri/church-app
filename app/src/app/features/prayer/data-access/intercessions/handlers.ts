import { computed, inject } from '@angular/core';
import { signalStoreFeature, type, withProps } from '@ngrx/signals';
import { Dispatcher, Events, withEffects } from '@ngrx/signals/events';
import {
  injectInfiniteQuery,
  injectMutation,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom, lastValueFrom, tap } from 'rxjs';

import {
  CreatePrayerIntercessionGQL,
  DeletePrayerIntercessionGQL,
  GetPrayerIntercessionsGQL,
  LikeIntercessionGQL,
  UnlikeIntercessionGQL,
  type CreatePrayerIntercessionMutationVariables,
  type DeletePrayerIntercessionMutationVariables,
  type LikeIntercessionMutationVariables,
  type UnlikeIntercessionMutationVariables,
} from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';
import { AuthService } from '@core/services/auth.service';
import type { Intercession } from '@features/prayer/util';

import { intercessionEntityEvents, intercessionMutationEvents } from './events';

type IntercessionStoreState = { currentPrayerId: string | null };

const STALE_TIME = 30_000;

export function withIntercessionHandlers() {
  return signalStoreFeature(
    { state: type<IntercessionStoreState>() },

    withProps((store) => {
      const auth = inject(AuthService);
      const queryClient = inject(QueryClient);
      const dispatcher = inject(Dispatcher);
      const listGQL = inject(GetPrayerIntercessionsGQL);
      const createGQL = inject(CreatePrayerIntercessionGQL);
      const deleteGQL = inject(DeletePrayerIntercessionGQL);
      const likeGQL = inject(LikeIntercessionGQL);
      const unlikeGQL = inject(UnlikeIntercessionGQL);

      const intercessionListQuery = injectInfiniteQuery(() => ({
        queryKey: ['intercessions', 'list', store.currentPrayerId()],
        enabled: !!store.currentPrayerId() && !!auth.user(),
        initialPageParam: null as string | null,
        queryFn: async ({ signal, pageParam }) => {
          const prayerId = store.currentPrayerId()!;
          const userId = auth.user()!.id;
          const result = await firstValueFrom(
            listGQL.fetch({
              variables: {
                prayerId,
                userId,
                after: pageParam ?? undefined,
              },
              context: { fetchOptions: { signal } },
            }),
          );
          return result.data?.prayer_intercessionsCollection ?? null;
        },
        getNextPageParam: (lastPage): string | undefined =>
          lastPage?.pageInfo?.hasNextPage
            ? (lastPage.pageInfo.endCursor ?? undefined)
            : undefined,
        staleTime: STALE_TIME,
      }));

      const intercessions = computed<Intercession[]>(
        () =>
          intercessionListQuery
            .data()
            ?.pages.flatMap((p) => unwrapNodes<Intercession>(p)) ?? [],
      );

      const intercessionsCount = computed(
        () => intercessionListQuery.data()?.pages[0]?.totalCount ?? 0,
      );

      const intercessionsLoading = computed(
        () => !!store.currentPrayerId() && intercessionListQuery.isLoading(),
      );

      const hasMoreIntercessions = computed(() =>
        intercessionListQuery.hasNextPage(),
      );

      const isLoadingMoreIntercessions = computed(() =>
        intercessionListQuery.isFetchingNextPage(),
      );

      const loadMoreIntercessions = () => {
        if (
          intercessionListQuery.hasNextPage() &&
          !intercessionListQuery.isFetchingNextPage()
        ) {
          intercessionListQuery.fetchNextPage();
        }
      };

      const invalidateList = () => {
        const prayerId = store.currentPrayerId();
        if (prayerId) {
          queryClient.invalidateQueries({
            queryKey: ['intercessions', 'list', prayerId],
          });
        }
      };

      const createIntercessionMutation = injectMutation(() => ({
        mutationFn: async (
          variables: CreatePrayerIntercessionMutationVariables,
        ) => {
          const result = await lastValueFrom(createGQL.mutate({ variables }));
          if (result.error) throw result.error;
          return { prayerId: variables.prayer_id };
        },
        onSuccess: ({ prayerId }) => {
          invalidateList();
          dispatcher.dispatch(intercessionEntityEvents.created({ prayerId }));
        },
      }));

      const likeIntercessionMutation = injectMutation(() => ({
        mutationFn: async (variables: LikeIntercessionMutationVariables) => {
          const result = await lastValueFrom(likeGQL.mutate({ variables }));
          if (result.error) throw result.error;
          return { id: variables.intercessionId };
        },
        onSuccess: ({ id }) => {
          invalidateList();
          dispatcher.dispatch(intercessionEntityEvents.liked({ id }));
        },
      }));

      const unlikeIntercessionMutation = injectMutation(() => ({
        mutationFn: async (variables: UnlikeIntercessionMutationVariables) => {
          const result = await lastValueFrom(unlikeGQL.mutate({ variables }));
          if (result.error) throw result.error;
          return { id: variables.intercessionId };
        },
        onSuccess: ({ id }) => {
          invalidateList();
          dispatcher.dispatch(intercessionEntityEvents.unliked({ id }));
        },
      }));

      const deleteIntercessionMutation = injectMutation(() => ({
        mutationFn: async (
          variables: DeletePrayerIntercessionMutationVariables,
        ) => {
          const result = await lastValueFrom(deleteGQL.mutate({ variables }));
          if (result.error) throw result.error;
          return { id: variables.id };
        },
        onSuccess: ({ id }) => {
          invalidateList();
          dispatcher.dispatch(intercessionEntityEvents.deleted({ id }));
        },
      }));

      return {
        intercessionListQuery,
        intercessions,
        intercessionsCount,
        intercessionsLoading,
        hasMoreIntercessions,
        isLoadingMoreIntercessions,
        loadMoreIntercessions,
        createIntercessionMutation,
        likeIntercessionMutation,
        unlikeIntercessionMutation,
        deleteIntercessionMutation,
        isCreatingIntercession: computed(() =>
          createIntercessionMutation.isPending(),
        ),
      };
    }),

    withEffects((store) => {
      const events = inject(Events);
      return {
        onCreateIntercession$: events
          .on(intercessionMutationEvents.createRequested)
          .pipe(
            tap(({ payload }) =>
              store.createIntercessionMutation.mutate(payload),
            ),
          ),
        onLikeIntercession$: events
          .on(intercessionMutationEvents.likeRequested)
          .pipe(
            tap(({ payload }) =>
              store.likeIntercessionMutation.mutate(payload),
            ),
          ),
        onUnlikeIntercession$: events
          .on(intercessionMutationEvents.unlikeRequested)
          .pipe(
            tap(({ payload }) =>
              store.unlikeIntercessionMutation.mutate(payload),
            ),
          ),
        onDeleteIntercession$: events
          .on(intercessionMutationEvents.deleteRequested)
          .pipe(
            tap(({ payload }) =>
              store.deleteIntercessionMutation.mutate(payload),
            ),
          ),
      };
    }),
  );
}
