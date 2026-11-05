import { computed } from '@angular/core';
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

const sameTerms = (a: readonly string[], b: readonly string[]): boolean =>
  a.length === b.length && a.every((term, i) => term === b[i]);

export function withBibleSearchHandlers() {
  return signalStoreFeature(
    {
      state: type<BibleState & BibleSearchState>(),
      methods: type<{
        getChapter(bookId: number, chapter: number): BibleVerse[];
      }>(),
    },

    withProps((store) => {
      // Construit à la première recherche seulement, puis gardé en mémoire.
      const searchIndex = computed(() => buildSearchIndex(store.verses()));
      // Une saisie qui ne change pas les termes (« amour » puis « amour d »)
      // ne relance pas la recherche.
      const searchTerms = computed(() => parseSearchTerms(store.searchQuery()), {
        equal: sameTerms,
      });
      const searchMatches = computed(() => {
        const terms = searchTerms();
        return terms.length > 0 ? searchVerseIndexes(searchIndex(), terms) : [];
      });

      return {
        _searchTerms: searchTerms,
        _searchMatches: searchMatches,
        searchTotal: computed(() => searchMatches().length),
        searchReferences: computed(() =>
          matchReferences(store.searchQuery(), store.books(), store.getChapter),
        ),
      };
    }),

    withMethods((store) => ({
      /** Les `limit` premiers versets trouvés : mots exacts d'abord, puis ordre de la Bible. */
      searchHits(limit: number): BibleSearchHit[] {
        const verses = store.verses();
        const terms = store._searchTerms();
        const books = new Map(store.books().map((book) => [book.id, book]));
        return store
          ._searchMatches()
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
