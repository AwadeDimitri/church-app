import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  GetPrayerRequestsGQL,
  GetPrayerStatsGQL,
  CreatePrayerRequestGQL,
  IncrementPrayerCountGQL,
  type GetPrayerRequestsQuery,
} from '@core/graphql/generated';

type PrayerRequest = GetPrayerRequestsQuery['prayer_requests'][number];

interface PrayerStats {
  active: number;
  answered: number;
  totalPrayers: number;
}

@Injectable({ providedIn: 'root' })
export class PrayerService {
  private readonly getPrayersGQL = inject(GetPrayerRequestsGQL);
  private readonly getStatsGQL = inject(GetPrayerStatsGQL);
  private readonly createPrayerGQL = inject(CreatePrayerRequestGQL);
  private readonly incrementCountGQL = inject(IncrementPrayerCountGQL);

  private readonly prayersResult = this.getPrayersGQL.watch().valueChanges;
  private readonly statsResult = this.getStatsGQL.watch().valueChanges;

  readonly prayers = toSignal(
    this.prayersResult.pipe(map(r => (r.data?.prayer_requests as PrayerRequest[] | undefined) ?? [])),
    { initialValue: [] as PrayerRequest[] },
  );

  readonly stats = toSignal(
    this.statsResult.pipe(map((r): PrayerStats => ({
      active: r.data?.active?.aggregate?.count ?? 0,
      answered: r.data?.answered?.aggregate?.count ?? 0,
      totalPrayers: r.data?.total_prayers?.aggregate?.sum?.prayer_count ?? 0,
    }))),
    { initialValue: { active: 0, answered: 0, totalPrayers: 0 } as PrayerStats },
  );

  readonly loading = toSignal(
    this.prayersResult.pipe(map(r => r.loading)),
    { initialValue: true },
  );

  readonly error = toSignal(
    this.prayersResult.pipe(map(r => r.error?.message ?? null)),
    { initialValue: null as string | null },
  );

  create(content: string, category: string, authorId: string, isAnonymous: boolean) {
    return this.createPrayerGQL.mutate({
      variables: {
        content,
        category,
        author_id: authorId,
        is_anonymous: isAnonymous,
      },
    });
  }

  pray(id: string) {
    return this.incrementCountGQL.mutate({ variables: { id } });
  }
}
