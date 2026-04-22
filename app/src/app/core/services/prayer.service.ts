import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
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
import { unwrapNodes } from '@core/graphql/unwrap';
import { AuthService } from '@core/services/auth.service';

type PrayerRequest = NonNullable<
  NonNullable<GetPrayerRequestsQuery['prayer_requestsCollection']>['edges'][number]
>['node'];

type PrayerCategory = NonNullable<
  NonNullable<GetPrayerCategoriesQuery['categoriesCollection']>['edges'][number]
>['node'];

interface PrayerStats {
  active: number;
  answered: number;
  intercessors: number;
}

const PAGE_SIZE = 10;
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

  private readonly _prayers = signal<PrayerRequest[]>([]);
  private readonly _loading = signal(false);
  private readonly _hasMore = signal(true);
  private readonly _error = signal<string | null>(null);
  private readonly _offset = signal(0);

  readonly prayers = this._prayers.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly hasMore = this._hasMore.asReadonly();
  readonly error = this._error.asReadonly();

  private readonly statsResult = this.getStatsGQL.watch().valueChanges;
  private readonly categoriesResult = this.getCategoriesGQL.watch().valueChanges;

  readonly categories = toSignal(
    this.categoriesResult.pipe(
      map(r => unwrapNodes<PrayerCategory>(r.data?.categoriesCollection)),
    ),
    { initialValue: [] as PrayerCategory[] },
  );

  readonly stats = toSignal(
    this.statsResult.pipe(
      map((r): PrayerStats => ({
        active: r.data?.active?.totalCount ?? 0,
        answered: r.data?.answered?.totalCount ?? 0,
        intercessors: r.data?.intercessors ?? 0,
      })),
    ),
    { initialValue: { active: 0, answered: 0, intercessors: 0 } as PrayerStats },
  );

  constructor() {
    this.loadMore();
  }

  loadMore(): void {
    if (this._loading() || !this._hasMore()) return;
    this._loading.set(true);
    this._error.set(null);

    const userId = this.authService.user()?.id ?? EMPTY_UUID;

    this.getPrayersGQL
      .fetch({ variables: { userId, limit: PAGE_SIZE, offset: this._offset() } })
      .subscribe({
        next: r => {
          const batch = unwrapNodes<PrayerRequest>(r.data?.prayer_requestsCollection);
          this._prayers.update(list => [...list, ...batch]);
          this._offset.update(o => o + batch.length);
          this._hasMore.set(batch.length === PAGE_SIZE);
          this._loading.set(false);
        },
        error: (err: Error) => {
          this._error.set(err.message ?? 'Erreur de chargement');
          this._loading.set(false);
        },
      });
  }

  refresh(): void {
    this._prayers.set([]);
    this._offset.set(0);
    this._hasMore.set(true);
    this.loadMore();
  }

  create(content: string, categoryId: string, isAnonymous: boolean) {
    return this.createPrayerGQL
      .mutate({
        variables: { content, category_id: categoryId, is_anonymous: isAnonymous },
        refetchQueries: ['GetPrayerStats'],
      })
      .pipe(tap(() => this.refresh()));
  }

  like(prayerId: string) {
    return this.likePrayerGQL
      .mutate({ variables: { prayerId } })
      .pipe(tap(() => this.refresh()));
  }

  unlike(prayerId: string) {
    return this.unlikePrayerGQL
      .mutate({ variables: { prayerId } })
      .pipe(tap(() => this.refresh()));
  }
}
