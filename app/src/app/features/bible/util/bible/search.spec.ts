import {
  buildSearchIndex,
  foldText,
  highlightParts,
  matchReferences,
  parseSearchTerms,
  searchVerseIndexes,
} from './search';
import type { BibleBook, BibleVerse, BibleVerseRow } from './types';

const book = (id: number, name: string, slug: string, chapter_count: number): BibleBook => ({
  id,
  testament: id < 40 ? 1 : 2,
  position: id,
  name,
  slug,
  chapter_count,
});

const BOOKS: BibleBook[] = [
  book(19, 'Psaumes', 'psaumes', 150),
  book(43, 'Jean', 'jean', 21),
  book(46, '1 Corinthiens', '1-corinthiens', 16),
  book(62, '1 Jean', '1-jean', 5),
];

const VERSES: BibleVerseRow[] = [
  { book_id: 19, chapter: 23, verse: 1, text: "Cantique de David. L'Éternel est mon berger: je ne manquerai de rien." },
  { book_id: 19, chapter: 51, verse: 12, text: 'O Dieu! crée en moi un cœur pur, Renouvelle en moi un esprit bien disposé.' },
  { book_id: 43, chapter: 3, verse: 16, text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique." },
  { book_id: 43, chapter: 10, verse: 11, text: 'Je suis le bon berger. Le bon berger donne sa vie pour ses brebis.' },
  { book_id: 62, chapter: 3, verse: 16, text: "Nous avons connu l'amour, en ce qu'il a donné sa vie pour nous." },
];

const getChapter = (bookId: number, chapter: number): BibleVerse[] =>
  VERSES.filter((v) => v.book_id === bookId && v.chapter === chapter);

const search = (query: string): number[] =>
  searchVerseIndexes(buildSearchIndex(VERSES), parseSearchTerms(query));

const labels = (query: string): string[] =>
  matchReferences(query, BOOKS, getChapter).map((match) => match.label);

describe('recherche dans la Bible', () => {
  describe('foldText', () => {
    it('retire accents, ligatures, majuscules et ponctuation', () => {
      expect(foldText("L'Éternel, cœur")).toBe('l eternel  coeur');
    });
  });

  describe('parseSearchTerms', () => {
    it('ignore les termes trop courts et les doublons', () => {
      expect(parseSearchTerms('Le  le a berger')).toEqual(['le', 'berger']);
    });
  });

  describe('searchVerseIndexes', () => {
    it('trouve un mot, dans l’ordre de la Bible', () => {
      expect(search('berger')).toEqual([0, 3]);
    });

    it('exige tous les termes', () => {
      expect(search('eternel berger')).toEqual([0]);
    });

    it('ignore accents et ligatures', () => {
      expect(search('coeur')).toEqual([1]);
      expect(search('ÉTERNEL')).toEqual([0]);
    });

    it('cherche en début de mot seulement', () => {
      expect(search('berg')).toEqual([0, 3]);
      expect(search('erger')).toEqual([]);
    });

    it('place d’abord les versets où le mot est entier', () => {
      const index = buildSearchIndex([
        { book_id: 1, chapter: 1, verse: 1, text: 'Ils ne purent répondre.' },
        { book_id: 1, chapter: 1, verse: 2, text: 'Un cœur pur.' },
        { book_id: 1, chapter: 1, verse: 3, text: 'La purification.' },
        { book_id: 1, chapter: 1, verse: 4, text: 'Heureux ceux qui ont le cœur pur!' },
      ]);
      expect(searchVerseIndexes(index, ['pur'])).toEqual([1, 3, 0, 2]);
      expect(searchVerseIndexes(index, ['coeur', 'pur'])).toEqual([1, 3]);
    });

    it('ne renvoie rien sans terme exploitable', () => {
      expect(search('')).toEqual([]);
      expect(search('a')).toEqual([]);
    });
  });

  describe('highlightParts', () => {
    it('marque les mots trouvés sans altérer le texte', () => {
      const text = VERSES[0].text;
      const parts = highlightParts(text, ['eternel', 'berg']);
      expect(parts.map((part) => part.text).join('')).toBe(text);
      expect(parts.filter((part) => part.hit).map((part) => part.text)).toEqual([
        'Éternel',
        'berger',
      ]);
    });
  });

  describe('matchReferences', () => {
    it('reconnaît une référence complète, quel que soit le séparateur', () => {
      expect(labels('Jean 3:16')).toEqual(['Jean 3:16', '1 Jean 3:16']);
      expect(labels('jean 3 16')).toEqual(['Jean 3:16', '1 Jean 3:16']);
      expect(labels('jean3.16')).toEqual(['Jean 3:16', '1 Jean 3:16']);
    });

    it('ouvre le premier verset d’une plage', () => {
      expect(labels('Jean 3:16-18')).toEqual(['Jean 3:16', '1 Jean 3:16']);
    });

    it('reconnaît les abréviations et les livres numérotés', () => {
      expect(labels('jn 3 16')).toEqual(['Jean 3:16', '1 Jean 3:16']);
      expect(labels('1 jn 3:16')).toEqual(['1 Jean 3:16']);
      expect(labels('1cor')).toEqual(['1 Corinthiens']);
      expect(labels('ps 23')).toEqual(['Psaumes 23']);
    });

    it('propose les livres pour un nom seul', () => {
      expect(labels('jean')).toEqual(['Jean', '1 Jean']);
    });

    it('écarte les chapitres et versets inexistants', () => {
      expect(labels('jean 99')).toEqual([]);
      expect(labels('jean 3 99')).toEqual([]);
    });

    it('ignore une saisie qui n’est pas une référence', () => {
      expect(labels('dieu est amour')).toEqual([]);
      expect(labels('3')).toEqual([]);
    });
  });
});
