import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  GetSermonsGQL,
  GetSermonByIdGQL,
  GetSermonCategoriesGQL,
  type GetSermonsQuery,
  type GetSermonCategoriesQuery,
} from '@core/graphql/generated';

type Sermon = GetSermonsQuery['sermons'][number];
type Category = GetSermonCategoriesQuery['categories'][number];

@Injectable({ providedIn: 'root' })
export class SermonService {
  private readonly getSermonsGQL = inject(GetSermonsGQL);
  private readonly getSermonByIdGQL = inject(GetSermonByIdGQL);
  private readonly getCategoriesGQL = inject(GetSermonCategoriesGQL);

  private readonly sermonsResult = this.getSermonsGQL.watch().valueChanges;
  private readonly categoriesResult = this.getCategoriesGQL.watch().valueChanges;

  readonly sermons = toSignal(
    this.sermonsResult.pipe(map(r => (r.data?.sermons as Sermon[] | undefined) ?? [])),
    { initialValue: [] as Sermon[] },
  );

  readonly categories = toSignal(
    this.categoriesResult.pipe(map(r => (r.data?.categories as Category[] | undefined) ?? [])),
    { initialValue: [] as Category[] },
  );

  readonly loading = toSignal(
    this.sermonsResult.pipe(map(r => r.loading)),
    { initialValue: true },
  );

  readonly error = toSignal(
    this.sermonsResult.pipe(map(r => r.error?.message ?? null)),
    { initialValue: null as string | null },
  );

  getById(id: string) {
    return this.getSermonByIdGQL
      .watch({ variables: { id } })
      .valueChanges.pipe(map(r => r.data?.sermons_by_pk ?? null));
  }
}
