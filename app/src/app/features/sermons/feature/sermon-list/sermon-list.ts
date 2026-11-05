import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Dispatcher } from '@ngrx/signals/events';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { CategoryFilter } from '@shared/components/category-filter/category-filter';
import { SermonCard } from '@shared/components/sermon-card/sermon-card';
import { PageHeader } from '@shared/components/page-header/page-header';
import { Button } from '@shared/components/button/button';
import { OfflineNotice } from '@shared/components/offline-notice/offline-notice';
import { PullToRefresh } from '@shared/components/pull-to-refresh/pull-to-refresh';
import { DurationPipe } from '@shared/pipes/duration.pipe';
import { SermonStore, sermonListEvents } from '@features/sermons/data-access';
import { getYouTubeThumbnail } from '@core/utils/youtube.util';

@Component({
  selector: 'app-sermon-list',
  imports: [DatePipe, NzIconDirective, CategoryFilter, SermonCard, PageHeader, Button, OfflineNotice, PullToRefresh, DurationPipe],
  templateUrl: './sermon-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SermonList {
  private readonly store = inject(SermonStore);
  private readonly dispatcher = inject(Dispatcher);
  private readonly router = inject(Router);

  readonly selectedCategory = signal('Tous');
  readonly searchQuery = signal('');

  readonly loading = this.store.isPending;
  readonly offline = this.store.isWaitingForNetwork;
  readonly loadingMore = this.store.isFetchingNext;
  readonly hasMore = this.store.hasMore;
  readonly allSermons = this.store.items;
  readonly activeSearch = this.store.search;

  // Un contenu déjà affiché n'est pas remplacé par l'erreur d'un rafraîchissement raté.
  readonly error = computed(() => {
    const e = this.store.error();
    if (!e || this.allSermons().length > 0) return null;
    return e.message ?? 'Erreur de chargement';
  });

  readonly hasFilter = computed(
    () => !!this.activeSearch() || this.selectedCategory() !== 'Tous',
  );

  readonly pullRefreshing = signal(false);

  constructor() {
    toObservable(this.searchQuery)
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(value =>
        this.dispatcher.dispatch(sermonListEvents.searchChanged({ query: value })),
      );

    effect(() => {
      const name = this.selectedCategory();
      if (name === 'Tous') {
        this.dispatcher.dispatch(sermonListEvents.categoryChanged({ categoryId: null }));
        return;
      }
      const cat = this.store.categories().find(c => c.name === name);
      if (cat) {
        this.dispatcher.dispatch(sermonListEvents.categoryChanged({ categoryId: cat.id }));
      }
    });

    effect(() => {
      if (this.pullRefreshing() && !this.store.isFetching()) {
        this.pullRefreshing.set(false);
      }
    });
  }

  loadMore(): void {
    this.dispatcher.dispatch(sermonListEvents.loadMoreRequested());
  }

  onPullRefresh(): void {
    this.pullRefreshing.set(true);
    this.dispatcher.dispatch(sermonListEvents.refreshed());
  }

  readonly categories = computed(() =>
    ['Tous', ...this.store.categories().map(c => c.name)]
  );

  readonly sermons = computed(() => {
    const all = this.allSermons();
    const featuredId = this.featured()?.id;
    return all.filter(s => s.id !== featuredId);
  });

  readonly featured = computed(() =>
    this.hasFilter() ? null : (this.allSermons()[0] ?? null),
  );

  openSermon(id: string) {
    this.router.navigate(['/sermons', id]);
  }

  protected readonly getThumbnail = getYouTubeThumbnail;
}
