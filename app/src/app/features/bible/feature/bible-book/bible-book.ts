import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';
import { BibleStore } from '@features/bible/data-access';

@Component({
  selector: 'app-bible-book',
  imports: [RouterLink, NzIconDirective, PageHeader],
  templateUrl: './bible-book.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BibleBook {
  private readonly store = inject(BibleStore);

  readonly bookSlug = input.required<string>();

  readonly loading = this.store.loading;
  readonly error = this.store.error;

  readonly book = computed(() =>
    this.store.books().find(b => b.slug === this.bookSlug()) ?? null,
  );

  readonly chapters = computed(() => {
    const n = this.book()?.chapter_count ?? 0;
    return Array.from({ length: n }, (_, i) => i + 1);
  });

  readonly subtitle = computed(() => {
    const b = this.book();
    if (!b) return '';
    const testament = b.testament === 1 ? 'Ancien Testament' : 'Nouveau Testament';
    const chapters = `${b.chapter_count} ${b.chapter_count > 1 ? 'chapitres' : 'chapitre'}`;
    return `${testament} • ${chapters}`;
  });

  readonly notFound = computed(() => !this.loading() && !this.book());
}
