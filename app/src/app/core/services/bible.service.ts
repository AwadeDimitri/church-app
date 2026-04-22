import { Injectable, computed, inject, signal } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { SupabaseService } from '@core/services/supabase.service';

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

export interface DailyVerse {
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

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
  private readonly supabase = inject(SupabaseService).client;

  private readonly _books = signal<BibleBook[]>([]);
  private readonly _dailyVerse = signal<DailyVerse | null>(null);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);
  private readonly _lastReading = signal<LastReading | null>(readLastReading());

  readonly books = this._books.asReadonly();
  readonly dailyVerse = this._dailyVerse.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly lastReading = this._lastReading.asReadonly();

  readonly dailyVerseDisplay = computed<DailyVerseDisplay | null>(() => {
    const verse = this._dailyVerse();
    if (!verse) return null;
    const book = this._books().find(b => b.id === verse.book_id);
    const reference = book
      ? `${book.name} ${verse.chapter}:${verse.verse}`
      : `${verse.chapter}:${verse.verse}`;
    return { text: verse.text, reference };
  });

  constructor() {
    this.loadBooks();
    this.loadDailyVerse();
  }

  private async loadBooks(): Promise<void> {
    const { data, error } = await this.supabase
      .from('bible_books')
      .select('id, testament, position, name, slug, chapter_count')
      .order('id');

    if (error) {
      this._error.set(error.message);
    } else {
      this._books.set((data ?? []) as BibleBook[]);
    }
    this._loading.set(false);
  }

  private async loadDailyVerse(): Promise<void> {
    const { count } = await this.supabase
      .from('bible_verses')
      .select('*', { count: 'exact', head: true });

    if (!count) return;

    const offset = daysSinceEpochUTC() % count;
    const { data } = await this.supabase
      .from('bible_verses')
      .select('book_id, chapter, verse, text')
      .order('book_id')
      .order('chapter')
      .order('verse')
      .range(offset, offset);

    const verse = (data?.[0] as DailyVerse | undefined) ?? null;
    this._dailyVerse.set(verse);
  }

  getChapter(bookId: number, chapter: number): Observable<BibleVerse[]> {
    return from(
      this.supabase
        .from('bible_verses')
        .select('verse, text')
        .eq('book_id', bookId)
        .eq('chapter', chapter)
        .order('verse'),
    ).pipe(map(r => (r.data ?? []) as BibleVerse[]));
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
