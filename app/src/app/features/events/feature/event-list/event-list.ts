import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { EventStore, eventListEvents } from '@features/events/data-access';
import { PageHeader } from '@shared/components/page-header/page-header';
import { Button } from '@shared/components/button/button';
import { PullToRefresh } from '@shared/components/pull-to-refresh/pull-to-refresh';

const DAY_FMT = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });
const DAY_NUM_FMT = new Intl.DateTimeFormat('fr-FR', { day: '2-digit' });
const MONTH_FMT = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
const TIME_FMT = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
const FULL_DATE_FMT = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

@Component({
  selector: 'app-event-list',
  imports: [NzIconDirective, PageHeader, Button, PullToRefresh],
  templateUrl: './event-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EventList {
  private readonly store = inject(EventStore);
  private readonly dispatcher = inject(Dispatcher);

  readonly loading = this.store.isPending;
  readonly loadingMore = this.store.isFetchingNext;
  readonly hasMore = this.store.hasMore;

  readonly error = computed(() => {
    const e = this.store.error();
    return e ? (e.message ?? 'Erreur de chargement') : null;
  });

  readonly pullRefreshing = signal(false);

  constructor() {
    effect(() => {
      if (this.pullRefreshing() && !this.store.isFetching()) {
        this.pullRefreshing.set(false);
      }
    });
  }

  readonly events = computed(() =>
    this.store.items().map(e => {
      const start = new Date(e.starts_at);
      const end = e.ends_at ? new Date(e.ends_at) : null;
      return {
        id: e.id,
        title: e.title,
        description: e.description ?? '',
        location: e.location ?? '',
        coverUrl: e.cover_url || null,
        day: DAY_FMT.format(start).replace('.', '').toUpperCase().slice(0, 3),
        dayNumber: DAY_NUM_FMT.format(start),
        month: MONTH_FMT.format(start).replace('.', '').toUpperCase(),
        fullDate: this.capitalize(FULL_DATE_FMT.format(start)),
        timeRange: end
          ? `${TIME_FMT.format(start)} – ${TIME_FMT.format(end)}`
          : TIME_FMT.format(start),
      };
    }),
  );

  loadMore(): void {
    this.dispatcher.dispatch(eventListEvents.loadMoreRequested());
  }

  onPullRefresh(): void {
    this.pullRefreshing.set(true);
    this.dispatcher.dispatch(eventListEvents.refreshed());
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
