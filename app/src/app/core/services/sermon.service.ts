import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  GetSermonsGQL,
  GetSermonByIdGQL,
  GetSermonCategoriesGQL,
  type GetSermonsQuery,
  type GetSermonCategoriesQuery,
  type SermonsFilter,
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
  private readonly _search = signal('');
  private readonly _categoryId = signal<string | null>(null);

  readonly sermons = this._sermons.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly hasMore = this._hasMore.asReadonly();
  readonly error = this._error.asReadonly();
  readonly search = this._search.asReadonly();
  readonly categoryId = this._categoryId.asReadonly();

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

  setSearch(query: string): void {
    const next = query.trim();
    if (next === this._search()) return;
    this._search.set(next);
    this.resetAndReload();
  }

  setCategoryId(id: string | null): void {
    if (id === this._categoryId()) return;
    this._categoryId.set(id);
    this.resetAndReload();
  }

  private resetAndReload(): void {
    this._sermons.set([]);
    this._offset.set(0);
    this._hasMore.set(true);
    this._error.set(null);
    this.loadMore();
  }

  loadMore(): void {
    if (this._loading() || !this._hasMore()) return;
    this._loading.set(true);
    this._error.set(null);

    this.getSermonsGQL
      .fetch({
        variables: {
          limit: PAGE_SIZE,
          offset: this._offset(),
          filter: this.buildFilter(),
        },
      })
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

  private buildFilter(): SermonsFilter | undefined {
    const clauses: SermonsFilter[] = [];

    const query = this._search();
    if (query) {
      const pattern = `%${query}%`;
      clauses.push({
        or: [
          { title: { ilike: pattern } },
          { preacher_name: { ilike: pattern } },
        ],
      });
    }

    const categoryId = this._categoryId();
    if (categoryId) {
      clauses.push({ category_id: { eq: categoryId } });
    }

    if (clauses.length === 0) return undefined;
    if (clauses.length === 1) return clauses[0];
    return { and: clauses };
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
