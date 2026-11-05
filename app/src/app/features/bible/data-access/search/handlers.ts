import { computed, type Signal } from '@angular/core';
import {
  signalStoreFeature,
  type,
  withMethods,
  withProps,
} from '@ngrx/signals';

import {
  buildSearchIndex,
  highlightParts,
  matchReferences,
  parseSearchTerms,
  searchVerseIndexes,
  type BibleSearchHit,
  type BibleSearchState,
  type BibleState,
  type BibleVerse,
} from '@features/bible/util';

export function withBibleSearchHandlers() {
  return signalStoreFeature(
    {
      state: type<BibleState & BibleSearchState>(),
      props: type<{ versesByChapter: Signal<Map<string, BibleVerse[]>> }>(),
    },

    withProps((store) => {
      // Construit à la première recherche seulement, puis gardé en mémoire.
      const searchIndex = computed(() => buildSearchIndex(store.verses()));
      const searchTerms = computed(() => parseSearchTerms(store.searchQuery()));
      const searchMatches = computed(() => {
        const terms = searchTerms();
        return terms.length > 0 ? searchVerseIndexes(searchIndex(), terms) : [];
      });

      return {
        searchTerms,
        searchMatches,
        searchTotal: computed(() => searchMatches().length),
        searchReferences: computed(() =>
          matchReferences(
            store.searchQuery(),
            store.books(),
            (bookId, chapter) =>
              store.versesByChapter().get(`${bookId}.${chapter}`) ?? [],
          ),
        ),
      };
    }),

    withMethods((store) => ({
      /** Les `limit` premiers versets trouvés, dans l'ordre de la Bible. */
      searchHits(limit: number): BibleSearchHit[] {
        const verses = store.verses();
        const terms = store.searchTerms();
        const books = new Map(store.books().map((book) => [book.id, book]));
        return store
          .searchMatches()
          .slice(0, limit)
          .flatMap((index) => {
            const row = verses[index];
            const book = books.get(row.book_id);
            if (!book) return [];
            return {
              reference: `${book.name} ${row.chapter}:${row.verse}`,
              slug: book.slug,
              chapter: row.chapter,
              verse: row.verse,
              parts: highlightParts(row.text, terms),
            };
          });
      },
    })),
  );
}
