import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { Dispatcher, Events, withEffects } from '@ngrx/signals/events';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom, tap } from 'rxjs';

import {
  CreatePrayerRequestGQL,
  LikePrayerGQL,
  MarkPrayerAsAnsweredGQL,
  UnlikePrayerGQL,
  type CreatePrayerRequestMutationVariables,
  type LikePrayerMutationVariables,
  type MarkPrayerAsAnsweredMutationVariables,
  type UnlikePrayerMutationVariables,
} from '@core/graphql/generated';

import { prayerEntityEvents, prayerMutationEvents } from './events';

const PRAYERS_KEY = ['prayers'] as const;

export function withPrayerMutationHandlers() {
  return signalStoreFeature(
    withProps(() => {
      const dispatcher = inject(Dispatcher);
      const queryClient = inject(QueryClient);
      const createGQL = inject(CreatePrayerRequestGQL);
      const likeGQL = inject(LikePrayerGQL);
      const unlikeGQL = inject(UnlikePrayerGQL);
      const markAnsweredGQL = inject(MarkPrayerAsAnsweredGQL);

      const createPrayerMutation = injectMutation(() => ({
        mutationFn: async (variables: CreatePrayerRequestMutationVariables) => {
          const result = await lastValueFrom(createGQL.mutate({ variables }));
          if (result.error) throw result.error;
          const id =
            result.data?.insertIntoprayer_requestsCollection?.records?.[0]?.id;
          if (!id) throw new Error('Prayer creation returned no id');
          return { id };
        },
        onSuccess: ({ id }) => {
          queryClient.invalidateQueries({ queryKey: PRAYERS_KEY });
          dispatcher.dispatch(prayerEntityEvents.created({ id }));
        },
      }));

      const likePrayerMutation = injectMutation(() => ({
        mutationFn: async (variables: LikePrayerMutationVariables) => {
          const result = await lastValueFrom(likeGQL.mutate({ variables }));
          if (result.error) throw result.error;
          return { prayerId: variables.prayerId };
        },
        onSuccess: ({ prayerId }) => {
          queryClient.invalidateQueries({ queryKey: PRAYERS_KEY });
          dispatcher.dispatch(prayerEntityEvents.liked({ prayerId }));
        },
      }));

      const unlikePrayerMutation = injectMutation(() => ({
        mutationFn: async (variables: UnlikePrayerMutationVariables) => {
          const result = await lastValueFrom(unlikeGQL.mutate({ variables }));
          if (result.error) throw result.error;
          return { prayerId: variables.prayerId };
        },
        onSuccess: ({ prayerId }) => {
          queryClient.invalidateQueries({ queryKey: PRAYERS_KEY });
          dispatcher.dispatch(prayerEntityEvents.unliked({ prayerId }));
        },
      }));

      const markAnsweredMutation = injectMutation(() => ({
        mutationFn: async (
          variables: MarkPrayerAsAnsweredMutationVariables,
        ) => {
          const result = await lastValueFrom(
            markAnsweredGQL.mutate({ variables }),
          );
          if (result.error) throw result.error;
          return { id: variables.id };
        },
        onSuccess: ({ id }) => {
          queryClient.invalidateQueries({ queryKey: PRAYERS_KEY });
          dispatcher.dispatch(prayerEntityEvents.markedAnswered({ id }));
        },
      }));

      return {
        createPrayerMutation,
        likePrayerMutation,
        unlikePrayerMutation,
        markAnsweredMutation,
        isCreating: computed(() => createPrayerMutation.isPending()),
        isLiking: computed(() => likePrayerMutation.isPending()),
        isUnliking: computed(() => unlikePrayerMutation.isPending()),
        isMarkingAnswered: computed(() => markAnsweredMutation.isPending()),
      };
    }),

    withEffects((store) => {
      const events = inject(Events);
      const router = inject(Router);
      return {
        onCreate$: events.on(prayerMutationEvents.createRequested).pipe(
          tap(({ payload }) => store.createPrayerMutation.mutate(payload)),
        ),
        onLike$: events.on(prayerMutationEvents.likeRequested).pipe(
          tap(({ payload }) => store.likePrayerMutation.mutate(payload)),
        ),
        onUnlike$: events.on(prayerMutationEvents.unlikeRequested).pipe(
          tap(({ payload }) => store.unlikePrayerMutation.mutate(payload)),
        ),
        onMarkAnswered$: events
          .on(prayerMutationEvents.markAnsweredRequested)
          .pipe(
            tap(({ payload }) =>
              store.markAnsweredMutation.mutate(payload),
            ),
          ),
        navigateOnCreated$: events.on(prayerEntityEvents.created).pipe(
          tap(() => router.navigate(['/prayer'])),
        ),
      };
    }),
  );
}
