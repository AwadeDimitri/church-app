import { computed, inject } from '@angular/core';
import { signalStoreFeature, type, withProps } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import {
  injectInfiniteQuery,
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom, tap } from 'rxjs';

import {
  GetPrayerCategoriesGQL,
  GetPrayerRequestsGQL,
  GetPrayerStatsGQL,
  type Prayer_RequestsFilter,
} from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';
import { AuthService } from '@core/services/auth.service';

import { prayerListEvents } from './events';
import type { Prayer, PrayerCategory, PrayerListState } from './types';

const PAGE_SIZE = 10;
const CATEGORIES_STALE_TIME = 10 * 60 * 1000;
const PRAYERS_STALE_TIME = 30_000;
const STATS_STALE_TIME = 30_000;

const DEFAULT_STATS = {
  active: 0,
  answered: 0,
  total: 0,
  mine: 0,
  intercessors: 0,
};

export function withPrayerListHandlers() {
  return signalStoreFeature(
    { state: type<PrayerListState>() },

    withProps((store) => {
      const authService = inject(AuthService);
      const getPrayersGQL = inject(GetPrayerRequestsGQL);
      const getCategoriesGQL = inject(GetPrayerCategoriesGQL);
      const getStatsGQL = inject(GetPrayerStatsGQL);

      const variables = computed(() => ({
        scope: store.scope(),
        category: store.selectedCategory(),
      }));

      const categoriesQuery = injectQuery(() => ({
        queryKey: ['prayer-categories', 'list'],
        queryFn: async ({ signal }) => {
          const result = await firstValueFrom(
            getCategoriesGQL.fetch({ context: { fetchOptions: { signal } } }),
          );
          return unwrapNodes<PrayerCategory>(result.data?.categoriesCollection);
        },
        staleTime: CATEGORIES_STALE_TIME,
      }));

      const listQuery = injectInfiniteQuery(() => ({
        queryKey: ['prayers', 'list', variables()],
        initialPageParam: 0,
        enabled:
          !!authService.user() &&
          (variables().category === 'all' || categoriesQuery.isSuccess()),
        queryFn: async ({ pageParam, signal }) => {
          const userId = authService.user()!.id;
          const filter: Prayer_RequestsFilter = {};

          if (variables().scope === 'mine') {
            filter.author_id = { eq: userId };
          }

          const cat = variables().category;
          if (cat !== 'all') {
            const category = categoriesQuery.data()?.find(
              (c) => c.slug === cat,
            );
            if (category) {
              filter.category_id = { eq: category.id };
            }
          }

          const result = await firstValueFrom(
            getPrayersGQL.fetch({
              variables: {
                userId,
                limit: PAGE_SIZE,
                offset: pageParam,
                filter: Object.keys(filter).length > 0 ? filter : null,
              },
              context: { fetchOptions: { signal } },
            }),
          );
          return result.data?.prayer_requestsCollection ?? null;
        },
        getNextPageParam: (lastPage, allPages) => {
          const lastBatch = unwrapNodes<Prayer>(lastPage);
          if (lastBatch.length < PAGE_SIZE) return undefined;
          return allPages.reduce(
            (sum, page) => sum + unwrapNodes<Prayer>(page).length,
            0,
          );
        },
        staleTime: PRAYERS_STALE_TIME,
        placeholderData: keepPreviousData,
      }));

      const items = computed<Prayer[]>(() => {
        const pages = listQuery.data()?.pages ?? [];
        return pages.flatMap((page) => unwrapNodes<Prayer>(page));
      });

      const statsQuery = injectQuery(() => ({
        queryKey: [
          'prayers',
          'aggregate',
          { userId: authService.user()?.id ?? null },
        ],
        enabled: !!authService.user(),
        queryFn: async ({ signal }) => {
          const userId = authService.user()!.id;
          const result = await firstValueFrom(
            getStatsGQL.fetch({
              variables: { userId },
              context: { fetchOptions: { signal } },
            }),
          );
          const data = result.data;
          const active = data?.active?.totalCount ?? 0;
          const answered = data?.answered?.totalCount ?? 0;
          return {
            active,
            answered,
            total: active + answered,
            mine: data?.mine?.totalCount ?? 0,
            intercessors: data?.intercessors ?? 0,
          };
        },
        staleTime: STATS_STALE_TIME,
      }));

      const stats = computed(() => statsQuery.data() ?? DEFAULT_STATS);

      return {
        listQuery,
        categoriesQuery,
        statsQuery,
        variables,
        items,
        stats,
        categories: computed(() => categoriesQuery.data() ?? []),
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
        onLoadMore$: events.on(prayerListEvents.loadMoreRequested).pipe(
          tap(() => {
            if (store.hasMore() && !store.isFetchingNext()) {
              store.listQuery.fetchNextPage();
            }
          }),
        ),
        onRefresh$: events.on(prayerListEvents.refreshed).pipe(
          tap(() => store.listQuery.refetch()),
        ),
      };
    }),
  );
}
