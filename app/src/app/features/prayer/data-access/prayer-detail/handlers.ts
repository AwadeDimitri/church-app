import { computed, inject } from '@angular/core';
import { GetPrayerRequestGQL } from '@core/graphql/generated';
import { AuthService } from '@core/services/auth.service';
import type { PrayerDetailState } from '@features/prayer/util';
import { signalStoreFeature, type, withProps } from '@ngrx/signals';
import {
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

export function withPrayerDetailHandlers() {
  return signalStoreFeature(
    { state: type<PrayerDetailState>() },
    withProps((store) => {
      const auth = inject(AuthService);
      const getPrayerGQL = inject(GetPrayerRequestGQL);

      const prayerQuery = injectQuery(() => ({
        queryKey: ['prayers', 'detail', store.currentPrayerId()],
        enabled: !!store.currentPrayerId() && !!auth.user(),
        queryFn: async ({ signal }) => {
          const result = await firstValueFrom(
            getPrayerGQL.fetch({
              variables: {
                id: store.currentPrayerId()!,
                userId: auth.user()!.id,
              },
              context: { fetchOptions: { signal } },
            }),
          );
          return (
            result.data?.prayer_requestsCollection?.edges?.[0]?.node ?? null
          );
        },
        placeholderData: keepPreviousData,
      }));

      return {
        prayer: computed(() => prayerQuery.data() ?? undefined),
      };
    }),
  );
}
