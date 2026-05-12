import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

import type {
  BibleBook,
  BibleVerseRow,
  LastReading,
} from '@features/bible/util';

export const bibleEvents = eventGroup({
  source: 'Bible',
  events: {
    bundleLoaded: type<{ books: BibleBook[]; verses: BibleVerseRow[] }>(),
    bundleFailed: type<{ message: string }>(),
    lastReadingSet: type<LastReading>(),
  },
});
