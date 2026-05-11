import { computed, inject } from '@angular/core';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import {
  injectInfiniteQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom, tap } from 'rxjs';

import { GetUpcomingEventsGQL } from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';

import type { ChurchEvent } from '@features/events/util';

import { eventListEvents } from './events';

const PAGE_SIZE = 10;
const EVENTS_STALE_TIME = 30_000;

export function withEventListHandlers() {
  return signalStoreFeature(
    withProps(() => {
      const getEventsGQL = inject(GetUpcomingEventsGQL);

      const listQuery = injectInfiniteQuery(() => ({
        queryKey: ['events', 'upcoming'],
        initialPageParam: 0,
        queryFn: async ({ pageParam, signal }) => {
          const result = await firstValueFrom(
            getEventsGQL.fetch({
              variables: {
                now: new Date().toISOString(),
                limit: PAGE_SIZE,
                offset: pageParam,
              },
              context: { fetchOptions: { signal } },
            }),
          );
          return result.data?.eventsCollection ?? null;
        },
        getNextPageParam: (lastPage, allPages) => {
          const lastBatch = unwrapNodes<ChurchEvent>(lastPage);
          if (lastBatch.length < PAGE_SIZE) return undefined;
          return allPages.reduce(
            (sum, page) => sum + unwrapNodes<ChurchEvent>(page).length,
            0,
          );
        },
        staleTime: EVENTS_STALE_TIME,
        placeholderData: keepPreviousData,
      }));

      const items = computed<ChurchEvent[]>(() => {
        const pages = listQuery.data()?.pages ?? [];
        return pages.flatMap((page) => unwrapNodes<ChurchEvent>(page));
      });

      return {
        listQuery,
        items,
        hasMore: computed(() => listQuery.hasNextPage()),
        isPending: computed(() => listQuery.isPending()),
        isFetching: computed(() => listQuery.isFetching()),
        isFetchingNext: computed(() => listQuery.isFetchingNextPage()),
        error: computed(() => listQuery.error()),
      };
    }),

    withEffects((store) => {
      const events = inject(Events);
      return {
        onLoadMore$: events.on(eventListEvents.loadMoreRequested).pipe(
          tap(() => {
            if (store.hasMore() && !store.isFetchingNext()) {
              store.listQuery.fetchNextPage();
            }
          }),
        ),
        onRefresh$: events.on(eventListEvents.refreshed).pipe(
          tap(() => store.listQuery.refetch()),
        ),
      };
    }),
  );
}
