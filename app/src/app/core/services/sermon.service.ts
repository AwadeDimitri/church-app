import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  GetSermonsGQL,
  GetSermonByIdGQL,
  GetSermonCategoriesGQL,
  type GetSermonsQuery,
  type GetSermonCategoriesQuery,
} from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';

type Sermon = NonNullable<
  NonNullable<GetSermonsQuery['sermonsCollection']>['edges'][number]
>['node'];

type Category = NonNullable<
  NonNullable<GetSermonCategoriesQuery['categoriesCollection']>['edges'][number]
>['node'];

const PAGE_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class SermonService {
  private readonly getSermonsGQL = inject(GetSermonsGQL);
  private readonly getSermonByIdGQL = inject(GetSermonByIdGQL);
  private readonly getCategoriesGQL = inject(GetSermonCategoriesGQL);

  private readonly _sermons = signal<Sermon[]>([]);
  private readonly _loading = signal(false);
  private readonly _hasMore = signal(true);
  private readonly _error = signal<string | null>(null);
  private readonly _offset = signal(0);

  readonly sermons = this._sermons.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly hasMore = this._hasMore.asReadonly();
  readonly error = this._error.asReadonly();

  private readonly categoriesResult = this.getCategoriesGQL.watch().valueChanges;
  readonly categories = toSignal(
    this.categoriesResult.pipe(
      map(r => unwrapNodes<Category>(r.data?.categoriesCollection)),
    ),
    { initialValue: [] as Category[] },
  );

  constructor() {
    this.loadMore();
  }

  loadMore(): void {
    if (this._loading() || !this._hasMore()) return;
    this._loading.set(true);
    this._error.set(null);

    this.getSermonsGQL
      .fetch({ variables: { limit: PAGE_SIZE, offset: this._offset() } })
      .subscribe({
        next: r => {
          const batch = unwrapNodes<Sermon>(r.data?.sermonsCollection);
          this._sermons.update(list => [...list, ...batch]);
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
    this._sermons.set([]);
    this._offset.set(0);
    this._hasMore.set(true);
    this.loadMore();
  }

  getById(id: string) {
    return this.getSermonByIdGQL
      .watch({ variables: { id } })
      .valueChanges.pipe(
        map(
          (r): Sermon | null =>
            unwrapNodes<Sermon>(r.data?.sermonsCollection)[0] ?? null,
        ),
      );
  }
}
