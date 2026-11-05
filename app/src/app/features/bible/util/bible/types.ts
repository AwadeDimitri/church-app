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
  readonly verse: number;
}

/** Destination proposée quand la recherche ressemble à une référence (« Jean 3:16 »). */
export interface BibleReferenceMatch {
  readonly label: string;
  readonly detail: string;
  readonly slug: string;
  readonly chapter: number | null;
  readonly verse: number | null;
}

/** Fragment d'un verset ; `hit` marque un mot trouvé par la recherche. */
export interface HighlightPart {
  text: string;
  readonly hit: boolean;
}

export interface BibleSearchHit {
  readonly reference: string;
  readonly slug: string;
  readonly chapter: number;
  readonly verse: number;
  readonly parts: HighlightPart[];
}

export type BibleSearchState = {
  searchQuery: string;
};

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
