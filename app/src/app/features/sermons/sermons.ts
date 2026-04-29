import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { CategoryFilter } from '@shared/components/category-filter/category-filter';
import { SermonCard } from '@shared/components/sermon-card/sermon-card';
import { PageHeader } from '@shared/components/page-header/page-header';
import { DurationPipe } from '@shared/pipes/duration.pipe';
import { SermonService } from '@core/services/sermon.service';
import { getYouTubeThumbnail } from '@core/utils/youtube.util';

@Component({
  selector: 'app-sermons',
  imports: [DatePipe, NzIconDirective, CategoryFilter, SermonCard, PageHeader, DurationPipe],
  templateUrl: './sermons.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Sermons {
  private readonly sermonService = inject(SermonService);
  private readonly router = inject(Router);

  readonly selectedCategory = signal('Tous');
  readonly searchQuery = signal('');

  readonly loading = this.sermonService.loading;
  readonly error = this.sermonService.error;
  readonly hasMore = this.sermonService.hasMore;
  readonly allSermons = this.sermonService.sermons;
  readonly activeSearch = this.sermonService.search;

  readonly hasFilter = computed(
    () => !!this.activeSearch() || this.selectedCategory() !== 'Tous',
  );

  constructor() {
    toObservable(this.searchQuery)
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(value => this.sermonService.setSearch(value));

    effect(() => {
      const name = this.selectedCategory();
      if (name === 'Tous') {
        this.sermonService.setCategoryId(null);
        return;
      }
      const cat = this.sermonService.categories().find(c => c.name === name);
      if (cat) this.sermonService.setCategoryId(cat.id);
    });
  }

  loadMore(): void {
    this.sermonService.loadMore();
  }

  readonly categories = computed(() =>
    ['Tous', ...this.sermonService.categories().map(c => c.name)]
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
