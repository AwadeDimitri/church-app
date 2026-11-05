import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { PageHeader } from '@shared/components/page-header/page-header';
import { BibleStore, bibleEvents } from '@features/bible/data-access';

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
  private readonly store = inject(BibleStore);
  private readonly dispatcher = inject(Dispatcher);
  private readonly injector = inject(Injector);

  readonly bookSlug = input.required<string>();
  readonly chapter = input.required({ alias: 'chapter', transform: (v: string) => +v });
  /** Verset visé (`?v=16`) : il est mis en évidence et amené à l'écran. */
  readonly targetVerse = input(null, {
    alias: 'v',
    transform: (value: string | undefined): number | null => {
      const verse = Number(value);
      return Number.isInteger(verse) && verse > 0 ? verse : null;
    },
  });

  protected readonly targetVerseClass =
    'bg-church-gold-light rounded-lg -mx-2 px-2 py-1';

  readonly booksLoading = this.store.loading;
  readonly error = this.store.error;

  readonly book = computed(() =>
    this.store.books().find(b => b.slug === this.bookSlug()) ?? null,
  );

  readonly verses = computed(() => {
    const id = this.book()?.id;
    const ch = this.chapter();
    if (id == null || ch <= 0) return [];
    return this.store.getChapter(id, ch);
  });

  readonly prevNav = computed<ChapterNav | null>(() => {
    const book = this.book();
    const ch = this.chapter();
    if (!book) return null;
    if (ch > 1) return { slug: book.slug, chapter: ch - 1, bookName: book.name };
    const prev = this.store.books().find(b => b.position === book.position - 1);
    return prev ? { slug: prev.slug, chapter: prev.chapter_count, bookName: prev.name } : null;
  });

  readonly nextNav = computed<ChapterNav | null>(() => {
    const book = this.book();
    const ch = this.chapter();
    if (!book) return null;
    if (ch < book.chapter_count) return { slug: book.slug, chapter: ch + 1, bookName: book.name };
    const next = this.store.books().find(b => b.position === book.position + 1);
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
      const target = this.targetVerse();
      if (target === null || this.verses().length === 0) return;
      afterNextRender(
        () => {
          const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
          document.getElementById(`v${target}`)?.scrollIntoView({
            block: 'center',
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
        },
        { injector: this.injector },
      );
    });

    effect(() => {
      const book = this.book();
      const ch = this.chapter();
      if (book && ch > 0 && ch <= book.chapter_count) {
        this.dispatcher.dispatch(
          bibleEvents.lastReadingSet({
            bookSlug: book.slug,
            bookName: book.name,
            chapter: ch,
          }),
        );
      }
    });
  }
}
