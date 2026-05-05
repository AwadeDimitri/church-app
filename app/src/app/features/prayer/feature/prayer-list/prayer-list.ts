import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  effect,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { CategoryFilter } from '@shared/components/category-filter/category-filter';
import { PrayerCard } from '@shared/components/prayer-card/prayer-card';
import { PageHeader } from '@shared/components/page-header/page-header';
import { PullToRefresh } from '@shared/components/pull-to-refresh/pull-to-refresh';
import {
  avatarColorFor,
  type AvatarColor,
} from '@shared/components/avatar/avatar-colors';
import { PrayerStore, prayerListEvents } from '@features/prayer/data-access';
import {
  categoryColor,
  type CategoryColor,
  type PrayerScope,
} from '@features/prayer/util';

@Component({
  selector: 'app-prayer-list',
  imports: [DatePipe, RouterLink, NzIconDirective, Button, StatCard, CategoryFilter, PrayerCard, PageHeader, PullToRefresh],
  templateUrl: './prayer-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PrayerList {
  private readonly store = inject(PrayerStore);
  private readonly dispatcher = inject(Dispatcher);
  private readonly router = inject(Router);

  readonly prayers = this.store.items;
  readonly hasMore = this.store.hasMore;
  readonly isPending = this.store.isPending;
  readonly isFetchingNext = this.store.isFetchingNext;
  readonly error = this.store.error;
  readonly stats = this.store.stats;
  readonly scope = this.store.scope;

  readonly filterCategories = computed(() => {
    const cats = this.store.categories() ?? [];
    return ['Toutes', ...cats.map((c) => c.name)];
  });

  readonly selectedCategoryName = computed(() => {
    const slug = this.store.selectedCategory();
    if (slug === 'all') return 'Toutes';
    const cat = (this.store.categories() ?? []).find((c) => c.slug === slug);
    return cat?.name ?? 'Toutes';
  });

  readonly pullRefreshing = signal(false);

  constructor() {
    effect(() => {
      if (this.pullRefreshing() && !this.store.isFetching()) {
        this.pullRefreshing.set(false);
      }
    });
  }

  setScope(scope: PrayerScope): void {
    this.dispatcher.dispatch(prayerListEvents.scopeChanged({ scope }));
  }

  onCategorySelected(name: string): void {
    if (name === 'Toutes') {
      this.dispatcher.dispatch(prayerListEvents.categoryChanged({ category: 'all' }));
      return;
    }
    const cat = (this.store.categories() ?? []).find((c) => c.name === name);
    if (cat) {
      this.dispatcher.dispatch(prayerListEvents.categoryChanged({ category: cat.slug }));
    }
  }

  loadMore(): void {
    this.dispatcher.dispatch(prayerListEvents.loadMoreRequested());
  }

  onPullRefresh(): void {
    this.pullRefreshing.set(true);
    this.dispatcher.dispatch(prayerListEvents.refreshed());
  }

  goToNew(): void {
    this.router.navigate(['/prayer/new']);
  }

  getAuthorName(prayer: { is_anonymous: boolean; author?: { full_name: string } | null }): string {
    return prayer.is_anonymous ? 'Anonyme' : (prayer.author?.full_name ?? 'Membre');
  }

  getCategoryColor(colorKey: string | null | undefined): CategoryColor {
    return categoryColor(colorKey);
  }

  getAvatarColor(prayer: { is_anonymous: boolean; author?: { full_name: string } | null }): AvatarColor {
    return avatarColorFor(this.getAuthorName(prayer));
  }
}
