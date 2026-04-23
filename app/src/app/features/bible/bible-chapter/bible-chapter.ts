import { Component, ChangeDetectionStrategy, inject, input, computed, effect } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { combineLatest, filter, switchMap } from 'rxjs';
import { PageHeader } from '@shared/components/page-header/page-header';
import { BibleService, type BibleVerse } from '@core/services/bible.service';

interface ChapterNav {
  readonly slug: string;
  readonly chapter: number;
  readonly bookName: string;
}

@Component({
  selector: 'app-bible-chapter',
  imports: [RouterLink, NzIconDirective, PageHeader],
  templateUrl: './bible-chapter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BibleChapter {
  private readonly bibleService = inject(BibleService);

  readonly bookSlug = input.required<string>();
  readonly chapter = input.required({ alias: 'chapter', transform: (v: string) => +v });

  readonly booksLoading = this.bibleService.loading;
  readonly error = this.bibleService.error;

  readonly book = computed(() =>
    this.bibleService.books().find(b => b.slug === this.bookSlug()) ?? null,
  );

  private readonly bookId = computed(() => this.book()?.id ?? null);

  readonly verses = toSignal(
    combineLatest([toObservable(this.bookId), toObservable(this.chapter)]).pipe(
      filter((pair): pair is [number, number] => pair[0] !== null && pair[1] > 0),
      switchMap(([id, ch]) => this.bibleService.getChapter(id, ch)),
    ),
    { initialValue: [] as BibleVerse[] },
  );

  readonly prevNav = computed<ChapterNav | null>(() => {
    const book = this.book();
    const ch = this.chapter();
    if (!book) return null;
    if (ch > 1) return { slug: book.slug, chapter: ch - 1, bookName: book.name };
    const prev = this.bibleService.books().find(b => b.position === book.position - 1);
    return prev ? { slug: prev.slug, chapter: prev.chapter_count, bookName: prev.name } : null;
  });

  readonly nextNav = computed<ChapterNav | null>(() => {
    const book = this.book();
    const ch = this.chapter();
    if (!book) return null;
    if (ch < book.chapter_count) return { slug: book.slug, chapter: ch + 1, bookName: book.name };
    const next = this.bibleService.books().find(b => b.position === book.position + 1);
    return next ? { slug: next.slug, chapter: 1, bookName: next.name } : null;
  });

  readonly headerTitle = computed(() => {
    const b = this.book();
    return b ? `${b.name} ${this.chapter()}` : 'Chapitre';
  });

  readonly headerSubtitle = computed(() => {
    const b = this.book();
    if (!b) return '';
    return b.testament === 1 ? 'Ancien Testament' : 'Nouveau Testament';
  });

  readonly notFound = computed(() => !this.booksLoading() && !this.book());

  constructor() {
    effect(() => {
      const book = this.book();
      const ch = this.chapter();
      if (book && ch > 0 && ch <= book.chapter_count) {
        this.bibleService.setLastReading({
          bookSlug: book.slug,
          bookName: book.name,
          chapter: ch,
        });
      }
    });
  }
}
