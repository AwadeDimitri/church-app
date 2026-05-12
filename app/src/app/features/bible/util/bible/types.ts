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

export interface BibleVerseRow {
  book_id: number;
  chapter: number;
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
  readonly route: readonly [string, string, number] | null;
}

export interface LastReading {
  readonly bookSlug: string;
  readonly bookName: string;
  readonly chapter: number;
}

export type BibleState = {
  books: BibleBook[];
  verses: BibleVerseRow[];
  loading: boolean;
  error: string | null;
  lastReading: LastReading | null;
};
