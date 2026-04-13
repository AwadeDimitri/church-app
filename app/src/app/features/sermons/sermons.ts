import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { CategoryFilter } from '@shared/components/category-filter/category-filter';
import { SermonCard } from '@shared/components/sermon-card/sermon-card';
import { SermonService } from '@core/services/sermon.service';

@Component({
  selector: 'app-sermons',
  imports: [DatePipe, NzIconDirective, CategoryFilter, SermonCard],
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
  readonly allSermons = this.sermonService.sermons;

  readonly categories = computed(() =>
    ['Tous', ...this.sermonService.categories().map(c => c.name)]
  );

  readonly sermons = computed(() => {
    const selected = this.selectedCategory();
    const query = this.searchQuery().toLowerCase();
    const all = this.allSermons();
    const featuredId = this.featured()?.id;

    return all.filter(s => {
      if (s.id === featuredId) return false;
      if (selected !== 'Tous' && s.category?.name !== selected) return false;
      if (query && !s.title.toLowerCase().includes(query) && !s.preacher_name.toLowerCase().includes(query)) return false;
      return true;
    });
  });

  readonly featured = computed(() => this.allSermons()[0] ?? null);

  openSermon(id: string) {
    this.router.navigate(['/sermons', id]);
  }
}
