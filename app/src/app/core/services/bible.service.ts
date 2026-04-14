import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';
import {
  GetBibleBooksGQL,
  GetBibleChapterGQL,
  GetBibleVersesCountGQL,
  GetDailyVerseGQL,
  type GetBibleBooksQuery,
  type GetBibleChapterQuery,
  type GetDailyVerseQuery,
} from '@core/graphql/generated';

export type BibleBook = GetBibleBooksQuery['bible_books'][number];
export type BibleVerse = GetBibleChapterQuery['bible_verses'][number];
export type DailyVerse = GetDailyVerseQuery['bible_verses'][number];

export interface DailyVerseDisplay {
  readonly text: string;
  readonly reference: string;
}

export interface LastReading {
  readonly bookSlug: string;
  readonly bookName: string;
  readonly chapter: number;
}

const LS_KEY = 'bible:last-reading';

@Injectable({ providedIn: 'root' })
export class BibleService {
  private readonly booksGQL = inject(GetBibleBooksGQL);
  private readonly chapterGQL = inject(GetBibleChapterGQL);
  private readonly versesCountGQL = inject(GetBibleVersesCountGQL);
  private readonly dailyVerseGQL = inject(GetDailyVerseGQL);

  private readonly booksResult = this.booksGQL.watch().valueChanges;

  readonly books = toSignal(
    this.booksResult.pipe(map(r => (r.data?.bible_books as BibleBook[] | undefined) ?? [])),
    { initialValue: [] as BibleBook[] },
  );

  readonly loading = toSignal(
    this.booksResult.pipe(map(r => r.loading)),
    { initialValue: true },
  );

  readonly error = toSignal(
    this.booksResult.pipe(map(r => r.error?.message ?? null)),
    { initialValue: null as string | null },
  );

  private readonly _lastReading = signal<LastReading | null>(readLastReading());
  readonly lastReading = this._lastReading.asReadonly();

  readonly dailyVerse = toSignal(
    this.versesCountGQL.fetch().pipe(
      map(r => r.data?.bible_verses_aggregate?.aggregate?.count ?? 0),
      filter((count): count is number => count > 0),
      switchMap(count =>
        this.dailyVerseGQL
          .fetch({ variables: { offset: daysSinceEpochUTC() % count } })
          .pipe(map(r => (r.data?.bible_verses?.[0] as DailyVerse | undefined) ?? null)),
      ),
    ),
    { initialValue: null as DailyVerse | null },
  );

  readonly dailyVerseDisplay = computed<DailyVerseDisplay | null>(() => {
    const verse = this.dailyVerse();
    if (!verse) return null;
    const book = this.books().find(b => b.id === verse.book_id);
    const reference = book
      ? `${book.name} ${verse.chapter}:${verse.verse}`
      : `${verse.chapter}:${verse.verse}`;
    return { text: verse.text, reference };
  });

  getChapter(bookId: number, chapter: number) {
    return this.chapterGQL
      .watch({ variables: { bookId, chapter } })
      .valueChanges.pipe(map(r => (r.data?.bible_verses as BibleVerse[] | undefined) ?? []));
  }

  setLastReading(reading: LastReading): void {
    this._lastReading.set(reading);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(reading));
    } catch {
      // storage indisponible (mode privé, SSR, quota plein)
    }
  }
}

function daysSinceEpochUTC(now: number = Date.now()): number {
  return Math.floor(now / 86_400_000);
}

function readLastReading(): LastReading | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LastReading>;
    if (
      typeof parsed?.bookSlug === 'string' &&
      typeof parsed?.bookName === 'string' &&
      typeof parsed?.chapter === 'number' &&
      parsed.chapter > 0
    ) {
      return parsed as LastReading;
    }
    return null;
  } catch {
    return null;
  }
}
