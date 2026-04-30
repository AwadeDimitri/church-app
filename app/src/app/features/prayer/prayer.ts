import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Button } from '@shared/components/button/button';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { CategoryFilter } from '@shared/components/category-filter/category-filter';
import { PrayerCard } from '@shared/components/prayer-card/prayer-card';
import { PageHeader } from '@shared/components/page-header/page-header';
import { PullToRefresh } from '@shared/components/pull-to-refresh/pull-to-refresh';
import { PrayerService } from '@core/services/prayer.service';

// Mapping clé couleur DB -> classes Tailwind (palette de theming, pas de donnée)
const PALETTE: Record<string, { bg: string; text: string }> = {
  red:    { bg: 'bg-church-red-light',  text: 'text-church-red' },
  blue:   { bg: 'bg-church-blue-light', text: 'text-church-blue' },
  green:  { bg: 'bg-church-green/10',   text: 'text-church-green' },
  gold:   { bg: 'bg-church-gold-light', text: 'text-church-gold' },
  purple: { bg: 'bg-church-blue-light', text: 'text-church-blue' },
  gray:   { bg: 'bg-church-text/5',     text: 'text-church-text-secondary' },
};
const FALLBACK_COLOR = PALETTE['gray']!;

const AVATAR_COLORS: Array<'blue' | 'red' | 'green' | 'gold'> = [
  'blue', 'red', 'green', 'gold',
];

@Component({
  selector: 'app-prayer',
  imports: [DatePipe, RouterLink, NzIconDirective, Button, StatCard, CategoryFilter, PrayerCard, PageHeader, PullToRefresh],
  templateUrl: './prayer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Prayer {
  private readonly prayerService = inject(PrayerService);
  private readonly router = inject(Router);

  readonly serviceCategories = this.prayerService.categories;

  // "Toutes" = concept UX (filtre désactivé), préfixé côté client
  readonly filterCategories = computed(() =>
    ['Toutes', ...this.serviceCategories().map(c => c.name)],
  );
  readonly selectedCategory = signal('Toutes');

  readonly loading = this.prayerService.loading;
  readonly error = this.prayerService.error;
  readonly hasMore = this.prayerService.hasMore;
  readonly allPrayers = this.prayerService.prayers;
  readonly stats = this.prayerService.stats;
  readonly scope = this.prayerService.scope;

  readonly pullRefreshing = signal(false);

  constructor() {
    // Clear pull-refresh state quand le service termine son fetch
    effect(() => {
      if (this.pullRefreshing() && !this.prayerService.loading()) {
        this.pullRefreshing.set(false);
      }
    });
  }

  loadMore(): void {
    this.prayerService.loadMore();
  }

  setScope(scope: 'all' | 'mine'): void {
    this.prayerService.setScope(scope);
  }

  onPullRefresh(): void {
    this.pullRefreshing.set(true);
    this.prayerService.refresh();
  }

  goToNew(): void {
    this.router.navigate(['/prayer/new']);
  }

  readonly prayers = computed(() => {
    const selected = this.selectedCategory();
    const all = this.prayerService.prayers();

    if (selected === 'Toutes') return all;
    return all.filter(p => p.category?.name === selected);
  });

  getAuthorName(prayer: { is_anonymous: boolean; author?: { full_name: string } | null }): string {
    return prayer.is_anonymous ? 'Anonyme' : (prayer.author?.full_name ?? 'Membre');
  }

  getCategoryColor(colorKey: string) {
    return PALETTE[colorKey] ?? FALLBACK_COLOR;
  }

  getAvatarColor(index: number): 'blue' | 'red' | 'green' | 'gold' {
    return AVATAR_COLORS[index % AVATAR_COLORS.length] ?? 'blue';
  }
}
