import { computed, inject } from '@angular/core';
import {
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { Dispatcher, Events, withEffects } from '@ngrx/signals/events';
import { tap } from 'rxjs';

import type {
  BibleState,
  BibleVerse,
  DailyVerse,
  DailyVerseDisplay,
} from '@features/bible/util';

import { bibleEvents } from './events';

const LS_KEY = 'bible:last-reading';
const BUNDLE_URL = '/bible.json';

function daysSinceEpochUTC(now: number = Date.now()): number {
  return Math.floor(now / 86_400_000);
}

export function withBibleHandlers() {
  return signalStoreFeature(
    { state: type<BibleState>() },

    withProps((store) => {
      const versesByChapter = computed<Map<string, BibleVerse[]>>(() => {
        const map = new Map<string, BibleVerse[]>();
        for (const v of store.verses()) {
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

      const dailyVerse = computed<DailyVerse | null>(() => {
        const verses = store.verses();
        if (verses.length === 0) return null;
        return verses[daysSinceEpochUTC() % verses.length];
      });

      const dailyVerseDisplay = computed<DailyVerseDisplay | null>(() => {
        const verse = dailyVerse();
        if (!verse) return null;
        const book = store.books().find((b) => b.id === verse.book_id);
        const reference = book
          ? `${book.name} ${verse.chapter}:${verse.verse}`
          : `${verse.chapter}:${verse.verse}`;
        const route = book
          ? (['/bible', book.slug, verse.chapter] as const)
          : null;
        return { text: verse.text, reference, route };
      });

      return {
        versesByChapter,
        dailyVerse,
        dailyVerseDisplay,
      };
    }),

    withMethods((store) => ({
      getChapter(bookId: number, chapter: number): BibleVerse[] {
        return store.versesByChapter().get(`${bookId}.${chapter}`) ?? [];
      },
    })),

    withHooks({
      async onInit(store) {
        const dispatcher = inject(Dispatcher);
        try {
          const res = await fetch(BUNDLE_URL);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = (await res.json()) as {
            books: BibleState['books'];
            verses: BibleState['verses'];
          };
          dispatcher.dispatch(
            bibleEvents.bundleLoaded({
              books: data.books,
              verses: data.verses,
            }),
          );
        } catch (err) {
          dispatcher.dispatch(
            bibleEvents.bundleFailed({
              message:
                err instanceof Error ? err.message : 'Erreur de chargement',
            }),
          );
        }
      },
    }),

    withEffects(() => {
      const events = inject(Events);
      return {
        persistLastReading$: events.on(bibleEvents.lastReadingSet).pipe(
          tap(({ payload }) => {
            try {
              localStorage.setItem(LS_KEY, JSON.stringify(payload));
            } catch {
              // storage indisponible (mode privé, SSR, quota plein)
            }
          }),
        ),
      };
    }),
  );
}
