import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  GetBibleBooksGQL,
  GetBibleChapterGQL,
  type GetBibleBooksQuery,
  type GetBibleChapterQuery,
} from '@core/graphql/generated';

export type BibleBook = GetBibleBooksQuery['bible_books'][number];
export type BibleVerse = GetBibleChapterQuery['bible_verses'][number];

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
