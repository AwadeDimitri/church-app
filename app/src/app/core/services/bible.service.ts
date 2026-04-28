import { Injectable, computed, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface BibleBook {
  id: number;
  testament: number;
  position: number;
  name: string;
  slug: string;
  chapter_count: number;
}

export interface BibleVerse {
  verse: number;
  text: string;
}

interface BibleVerseRow {
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleData {
  books: BibleBook[];
  verses: BibleVerseRow[];
}

export interface DailyVerse {
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface DailyVerseDisplay {
  readonly text: string;
  readonly reference: string;
  readonly route: readonly [string, string, number] | null;
}

export interface LastReading {
  readonly bookSlug: string;
  readonly bookName: string;
  readonly chapter: number;
}

const LS_KEY = 'bible:last-reading';
const BUNDLE_URL = '/bible.json';

@Injectable({ providedIn: 'root' })
export class BibleService {
  private readonly _books = signal<BibleBook[]>([]);
  private readonly _verses = signal<BibleVerseRow[]>([]);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);
  private readonly _lastReading = signal<LastReading | null>(readLastReading());

  readonly books = this._books.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly lastReading = this._lastReading.asReadonly();

  private readonly versesByChapter = computed<Map<string, BibleVerse[]>>(() => {
    const map = new Map<string, BibleVerse[]>();
    for (const v of this._verses()) {
      const key = `${v.book_id}.${v.chapter}`;
      let chapter = map.get(key);
      if (!chapter) {
        chapter = [];
        map.set(key, chapter);
      }
      chapter.push({ verse: v.verse, text: v.text });
    }
    return map;
  });

  readonly dailyVerse = computed<DailyVerse | null>(() => {
    const verses = this._verses();
    if (verses.length === 0) return null;
    return verses[daysSinceEpochUTC() % verses.length];
  });

  readonly dailyVerseDisplay = computed<DailyVerseDisplay | null>(() => {
    const verse = this.dailyVerse();
    if (!verse) return null;
    const book = this._books().find((b) => b.id === verse.book_id);
    const reference = book
      ? `${book.name} ${verse.chapter}:${verse.verse}`
      : `${verse.chapter}:${verse.verse}`;
    const route = book
      ? (['/bible', book.slug, verse.chapter] as const)
      : null;
    return { text: verse.text, reference, route };
  });

  constructor() {
    this.loadBundle();
  }

  private async loadBundle(): Promise<void> {
    try {
      const res = await fetch(BUNDLE_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as BibleData;
      this._books.set(data.books);
      this._verses.set(data.verses);
    } catch (err) {
      this._error.set(
        err instanceof Error ? err.message : 'Erreur de chargement',
      );
    } finally {
      this._loading.set(false);
    }
  }

  getChapter(bookId: number, chapter: number): Observable<BibleVerse[]> {
    return of(this.versesByChapter().get(`${bookId}.${chapter}`) ?? []);
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
