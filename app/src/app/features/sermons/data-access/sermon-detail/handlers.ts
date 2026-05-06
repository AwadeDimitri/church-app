import { computed, inject } from '@angular/core';
import { signalStoreFeature, type, withProps } from '@ngrx/signals';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { GetSermonByIdGQL } from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';

import type { Sermon, SermonDetailState } from '@features/sermons/util';

export function withSermonDetailHandlers() {
  return signalStoreFeature(
    { state: type<SermonDetailState>() },
    withProps((store) => {
      const getSermonGQL = inject(GetSermonByIdGQL);

      const sermonQuery = injectQuery(() => ({
        queryKey: ['sermons', 'detail', store.currentSermonId()],
        enabled: !!store.currentSermonId(),
        queryFn: async ({ signal }) => {
          const result = await firstValueFrom(
            getSermonGQL.fetch({
              variables: { id: store.currentSermonId()! },
              context: { fetchOptions: { signal } },
            }),
          );
          return (
            unwrapNodes<Sermon>(result.data?.sermonsCollection)[0] ?? null
          );
        },
        placeholderData: keepPreviousData,
      }));

      return {
        sermonQuery,
        sermon: computed(() => sermonQuery.data() ?? null),
        isPending: computed(() => sermonQuery.isPending()),
        error: computed(() => sermonQuery.error()),
      };
    }),
  );
}
