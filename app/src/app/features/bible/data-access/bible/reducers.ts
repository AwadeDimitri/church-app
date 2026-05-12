import { signalStoreFeature, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';

import type { BibleState, LastReading } from '@features/bible/util';

import { bibleEvents } from './events';

const LS_KEY = 'bible:last-reading';

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

const initialState: BibleState = {
  books: [],
  verses: [],
  loading: true,
  error: null,
  lastReading: readLastReading(),
};

export function withBibleReducers() {
  return signalStoreFeature(
    withState(initialState),
    withReducer(
      on(bibleEvents.bundleLoaded, ({ payload }) => ({
        books: payload.books,
        verses: payload.verses,
        loading: false,
        error: null,
      })),
      on(bibleEvents.bundleFailed, ({ payload }) => ({
        loading: false,
        error: payload.message,
      })),
      on(bibleEvents.lastReadingSet, ({ payload }) => ({
        lastReading: payload,
      })),
    ),
  );
}
