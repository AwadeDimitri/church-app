import { Injectable, inject, signal } from '@angular/core';
import {
  GetUpcomingEventsGQL,
  type GetUpcomingEventsQuery,
} from '@core/graphql/generated';
import { unwrapNodes } from '@core/graphql/unwrap';

type ChurchEvent = NonNullable<
  NonNullable<GetUpcomingEventsQuery['eventsCollection']>['edges'][number]
>['node'];

const PAGE_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly getUpcomingGQL = inject(GetUpcomingEventsGQL);

  private readonly _events = signal<ChurchEvent[]>([]);
  private readonly _loading = signal(false);
  private readonly _hasMore = signal(true);
  private readonly _error = signal<string | null>(null);
  private readonly _offset = signal(0);

  readonly events = this._events.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly hasMore = this._hasMore.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    this.loadMore();
  }

  loadMore(): void {
    if (this._loading() || !this._hasMore()) return;
    this._loading.set(true);
    this._error.set(null);

    this.getUpcomingGQL
      .fetch({
        variables: {
          now: new Date().toISOString(),
          limit: PAGE_SIZE,
          offset: this._offset(),
        },
      })
      .subscribe({
        next: r => {
          const batch = unwrapNodes<ChurchEvent>(r.data?.eventsCollection);
          this._events.update(list => [...list, ...batch]);
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
    this._events.set([]);
    this._offset.set(0);
    this._hasMore.set(true);
    this._error.set(null);
    this.loadMore();
  }
}
