import type {
  BibleBook,
  BibleReferenceMatch,
  BibleVerse,
  BibleVerseRow,
  HighlightPart,
} from './types';

const MIN_TERM_LENGTH = 2;
const MAX_REFERENCES = 5;

const foldedChars = new Map<string, string>([
  ['œ', 'oe'],
  ['æ', 'ae'],
]);

function foldChar(char: string): string {
  let folded = foldedChars.get(char);
  if (folded === undefined) {
    const base = char.normalize('NFD')[0];
    folded = base >= 'a' && base <= 'z' ? base : ' ';
    foldedChars.set(char, folded);
  }
  return folded;
}

/**
 * Minuscules, sans accents ni ligatures ; ponctuation et apostrophes deviennent
 * des espaces. « L'Éternel » et « l eternel » donnent le même résultat.
 */
export function foldText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, foldChar);
}

/** Un texte replié par verset, entouré d'espaces pour chercher un début de mot ou un mot entier. */
export function buildSearchIndex(verses: readonly BibleVerseRow[]): string[] {
  return verses.map((verse) => ' ' + foldText(verse.text) + ' ');
}

export function parseSearchTerms(query: string): string[] {
  const terms = foldText(query)
    .split(' ')
    .filter((term) => term.length >= MIN_TERM_LENGTH);
  return [...new Set(terms)];
}

/**
 * Positions des versets contenant tous les termes, chacun en début de mot.
 * Ceux où chaque terme est un mot entier viennent d'abord (« pur » avant
 * « purent ») ; chaque groupe suit l'ordre de la Bible.
 */
export function searchVerseIndexes(
  index: readonly string[],
  terms: readonly string[],
): number[] {
  if (terms.length === 0) return [];
  const wordStarts = terms.map((term) => ' ' + term);
  const wholeWords = terms.map((term) => ' ' + term + ' ');
  const exact: number[] = [];
  const partial: number[] = [];
  for (let i = 0; i < index.length; i++) {
    const text = index[i];
    if (!wordStarts.every((needle) => text.includes(needle))) continue;
    if (wholeWords.every((needle) => text.includes(needle))) {
      exact.push(i);
    } else {
      partial.push(i);
    }
  }
  return exact.concat(partial);
}

/** Découpe un verset en fragments, en marquant les mots qui commencent par un terme cherché. */
export function highlightParts(
  text: string,
  terms: readonly string[],
): HighlightPart[] {
  const parts: HighlightPart[] = [];
  for (const token of text.match(/[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu) ?? []) {
    const folded = foldText(token);
    const hit = terms.some((term) => folded.startsWith(term));
    const last = parts.at(-1);
    if (last && last.hit === hit) {
      last.text += token;
    } else {
      parts.push({ text: token, hit });
    }
  }
  return parts;
}

/**
 * Abréviations usuelles qui ne sont pas un simple début du nom du livre
 * (« ps » ou « apo » n'ont pas besoin d'y figurer).
 */
const BOOK_ABBREVIATIONS: Record<string, string> = {
  gn: 'genese',
  lv: 'levitique',
  nb: 'nombres',
  dt: 'deuteronome',
  jg: 'juges',
  rt: 'ruth',
  jb: 'job',
  pv: 'proverbes',
  ct: 'cantique',
  is: 'esaie',
  isaie: 'esaie',
  jr: 'jeremie',
  lm: 'lamentations',
  dn: 'daniel',
  jl: 'joel',
  ml: 'malachie',
  mt: 'matthieu',
  mc: 'marc',
  lc: 'luc',
  jn: 'jean',
  rm: 'romains',
  phm: 'philemon',
  tm: 'timothee',
  tt: 'tite',
  hb: 'hebreux',
  jc: 'jacques',
  jd: 'jude',
};

// « 1 cor 13 4 » : numéro du livre, nom (ou début, ou abréviation), chapitre, verset.
// Un troisième nombre (« Jean 3:16-18 ») est accepté : la plage ouvre son premier verset.
const REFERENCE =
  /^([1-3])? ?([a-z][a-z ]*?) ?(?:(\d{1,3})(?: (\d{1,3})(?: \d{1,3})?)?)?$/;
const NUMBERED_BOOK = /^([1-3]) (.+)$/;

/**
 * Livres, chapitres ou versets désignés par une saisie du type « Jean 3:16 »,
 * « ps 23 » ou « 1 cor ». Les chapitres et versets inexistants sont écartés.
 */
export function matchReferences(
  query: string,
  books: readonly BibleBook[],
  getChapter: (bookId: number, chapter: number) => readonly BibleVerse[],
): BibleReferenceMatch[] {
  const parsed = REFERENCE.exec(foldText(query).replace(/ +/g, ' ').trim());
  if (!parsed) return [];
  const [, number, name, chapterText, verseText] = parsed;
  if (name.length < MIN_TERM_LENGTH) return [];
  const stem = BOOK_ABBREVIATIONS[name] ?? name;
  const chapter = chapterText ? Number(chapterText) : null;
  const verse = verseText ? Number(verseText) : null;

  const matches: BibleReferenceMatch[] = [];
  for (const book of books) {
    const folded = foldText(book.name).trim();
    const numbered = NUMBERED_BOOK.exec(folded);
    const bookNumber = numbered?.[1];
    const bookName = numbered?.[2] ?? folded;
    if (number && number !== bookNumber) continue;
    if (!bookName.startsWith(stem)) continue;

    if (chapter === null) {
      const count = book.chapter_count;
      matches.push({
        label: book.name,
        detail: `${count} ${count > 1 ? 'chapitres' : 'chapitre'}`,
        slug: book.slug,
        chapter: null,
        verse: null,
      });
    } else if (chapter >= 1 && chapter <= book.chapter_count) {
      const verses = getChapter(book.id, chapter);
      if (verse === null) {
        matches.push({
          label: `${book.name} ${chapter}`,
          detail: verses[0]?.text ?? '',
          slug: book.slug,
          chapter,
          verse: null,
        });
      } else {
        const found = verses.find((v) => v.verse === verse);
        if (found) {
          matches.push({
            label: `${book.name} ${chapter}:${verse}`,
            detail: found.text,
            slug: book.slug,
            chapter,
            verse,
          });
        }
      }
    }
    if (matches.length === MAX_REFERENCES) break;
  }
  return matches;
}
