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
  GetSermonCategoriesGQL,
  GetSermonsGQL,
  type SermonsFilter,
} from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';

import type {
  Sermon,
  SermonCategory,
  SermonListState,
} from '@features/sermons/util';

import { sermonListEvents } from './events';

const PAGE_SIZE = 10;
const CATEGORIES_STALE_TIME = 10 * 60 * 1000;
const SERMONS_STALE_TIME = 30_000;

function buildFilter(
  search: string,
  categoryId: string | null,
): SermonsFilter | undefined {
  const clauses: SermonsFilter[] = [];

  if (search) {
    const pattern = `%${search}%`;
    clauses.push({
      or: [
        { title: { ilike: pattern } },
        { preacher_name: { ilike: pattern } },
      ],
    });
  }

  if (categoryId) {
    clauses.push({ category_id: { eq: categoryId } });
  }

  if (clauses.length === 0) return undefined;
  if (clauses.length === 1) return clauses[0];
  return { and: clauses };
}

export function withSermonListHandlers() {
  return signalStoreFeature(
    { state: type<SermonListState>() },

    withProps((store) => {
      const getSermonsGQL = inject(GetSermonsGQL);
      const getCategoriesGQL = inject(GetSermonCategoriesGQL);

      const variables = computed(() => ({
        search: store.search(),
        categoryId: store.categoryId(),
      }));

      const categoriesQuery = injectQuery(() => ({
        queryKey: ['sermon-categories', 'list'],
        queryFn: async ({ signal }) => {
          const result = await firstValueFrom(
            getCategoriesGQL.fetch({ context: { fetchOptions: { signal } } }),
          );
          return unwrapNodes<SermonCategory>(result.data?.categoriesCollection);
        },
        staleTime: CATEGORIES_STALE_TIME,
      }));

      const listQuery = injectInfiniteQuery(() => ({
        queryKey: ['sermons', 'list', variables()],
        initialPageParam: 0,
        queryFn: async ({ pageParam, signal }) => {
          const result = await firstValueFrom(
            getSermonsGQL.fetch({
              variables: {
                limit: PAGE_SIZE,
                offset: pageParam,
                filter: buildFilter(variables().search, variables().categoryId),
              },
              context: { fetchOptions: { signal } },
            }),
          );
          return result.data?.sermonsCollection ?? null;
        },
        getNextPageParam: (lastPage, allPages) => {
          const lastBatch = unwrapNodes<Sermon>(lastPage);
          if (lastBatch.length < PAGE_SIZE) return undefined;
          return allPages.reduce(
            (sum, page) => sum + unwrapNodes<Sermon>(page).length,
            0,
          );
        },
        staleTime: SERMONS_STALE_TIME,
        placeholderData: keepPreviousData,
      }));

      const items = computed<Sermon[]>(() => {
        const pages = listQuery.data()?.pages ?? [];
        return pages.flatMap((page) => unwrapNodes<Sermon>(page));
      });

      return {
        listQuery,
        categoriesQuery,
        variables,
        items,
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
        onLoadMore$: events.on(sermonListEvents.loadMoreRequested).pipe(
          tap(() => {
            if (store.hasMore() && !store.isFetchingNext()) {
              store.listQuery.fetchNextPage();
            }
          }),
        ),
        onRefresh$: events.on(sermonListEvents.refreshed).pipe(
          tap(() => store.listQuery.refetch()),
        ),
      };
    }),
  );
}
