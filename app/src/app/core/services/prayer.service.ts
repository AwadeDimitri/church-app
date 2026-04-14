import { Injectable, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  GetPrayerRequestsGQL,
  GetPrayerStatsGQL,
  GetPrayerCategoriesGQL,
  CreatePrayerRequestGQL,
  LikePrayerGQL,
  UnlikePrayerGQL,
  type GetPrayerRequestsQuery,
  type GetPrayerCategoriesQuery,
} from '@core/graphql/generated';
import { AuthService } from '@core/services/auth.service';

type PrayerRequest = GetPrayerRequestsQuery['prayer_requests'][number];
type PrayerCategory = GetPrayerCategoriesQuery['categories'][number];

interface PrayerStats {
  active: number;
  answered: number;
  intercessors: number;
}

// Placeholder UUID utilisé tant que l'auth n'a pas résolu l'user ; aucune ligne ne match.
const EMPTY_UUID = '00000000-0000-0000-0000-000000000000';

@Injectable({ providedIn: 'root' })
export class PrayerService {
  private readonly authService = inject(AuthService);
  private readonly getPrayersGQL = inject(GetPrayerRequestsGQL);
  private readonly getStatsGQL = inject(GetPrayerStatsGQL);
  private readonly getCategoriesGQL = inject(GetPrayerCategoriesGQL);
  private readonly createPrayerGQL = inject(CreatePrayerRequestGQL);
  private readonly likePrayerGQL = inject(LikePrayerGQL);
  private readonly unlikePrayerGQL = inject(UnlikePrayerGQL);

  private readonly prayersQuery = this.getPrayersGQL.watch({
    variables: { userId: this.authService.user()?.id ?? EMPTY_UUID },
  });
  private readonly statsResult = this.getStatsGQL.watch().valueChanges;
  private readonly categoriesResult = this.getCategoriesGQL.watch().valueChanges;

  readonly prayers = toSignal(
    this.prayersQuery.valueChanges.pipe(
      map(r => (r.data?.prayer_requests as PrayerRequest[] | undefined) ?? []),
    ),
    { initialValue: [] as PrayerRequest[] },
  );

  readonly categories = toSignal(
    this.categoriesResult.pipe(map(r => (r.data?.categories as PrayerCategory[] | undefined) ?? [])),
    { initialValue: [] as PrayerCategory[] },
  );

  readonly stats = toSignal(
    this.statsResult.pipe(map((r): PrayerStats => ({
      active: r.data?.active?.aggregate?.count ?? 0,
      answered: r.data?.answered?.aggregate?.count ?? 0,
      intercessors: r.data?.intercessors?.aggregate?.count ?? 0,
    }))),
    { initialValue: { active: 0, answered: 0, intercessors: 0 } as PrayerStats },
  );

  readonly loading = toSignal(
    this.prayersQuery.valueChanges.pipe(map(r => r.loading)),
    { initialValue: true },
  );

  readonly error = toSignal(
    this.prayersQuery.valueChanges.pipe(map(r => r.error?.message ?? null)),
    { initialValue: null as string | null },
  );

  constructor() {
    // Refetch les prières avec le bon userId dès que l'auth se résout
    effect(() => {
      const user = this.authService.user();
      if (user?.id) {
        this.prayersQuery.refetch({ userId: user.id });
      }
    });
  }

  create(content: string, categoryId: string, isAnonymous: boolean) {
    return this.createPrayerGQL.mutate({
      variables: { content, category_id: categoryId, is_anonymous: isAnonymous },
      refetchQueries: ['GetPrayerRequests', 'GetPrayerStats'],
    });
  }

  like(prayerId: string) {
    const userId = this.authService.user()?.id ?? EMPTY_UUID;
    return this.likePrayerGQL.mutate({
      variables: { prayerId },
      optimisticResponse: {
        insert_prayer_likes_one: {
          __typename: 'prayer_likes',
          prayer_id: prayerId,
          user_id: userId,
        },
      },
      update: (cache) => {
        const prayerRef = cache.identify({ __typename: 'prayer_requests', id: prayerId });
        if (!prayerRef) return;
        cache.modify({
          id: prayerRef,
          fields: {
            likes_aggregate(existing: unknown) {
              const e = existing as { aggregate?: { count?: number } } | undefined;
              const current = e?.aggregate?.count ?? 0;
              return { ...(e ?? {}), aggregate: { ...(e?.aggregate ?? {}), count: current + 1 } };
            },
            'likes'(existing, { storeFieldName }) {
              if (storeFieldName.includes('my_likes') || storeFieldName.includes('user_id')) {
                return [{ __typename: 'prayer_likes', user_id: userId }];
              }
              return existing;
            },
          },
        });
      },
    });
  }

  unlike(prayerId: string) {
    return this.unlikePrayerGQL.mutate({
      variables: { prayerId },
      optimisticResponse: {
        delete_prayer_likes: {
          __typename: 'prayer_likes_mutation_response',
          affected_rows: 1,
        },
      },
      update: (cache) => {
        const prayerRef = cache.identify({ __typename: 'prayer_requests', id: prayerId });
        if (!prayerRef) return;
        cache.modify({
          id: prayerRef,
          fields: {
            likes_aggregate(existing: unknown) {
              const e = existing as { aggregate?: { count?: number } } | undefined;
              const current = e?.aggregate?.count ?? 0;
              return { ...(e ?? {}), aggregate: { ...(e?.aggregate ?? {}), count: Math.max(0, current - 1) } };
            },
            'likes'(existing, { storeFieldName }) {
              if (storeFieldName.includes('my_likes') || storeFieldName.includes('user_id')) {
                return [];
              }
              return existing;
            },
          },
        });
      },
    });
  }
}
