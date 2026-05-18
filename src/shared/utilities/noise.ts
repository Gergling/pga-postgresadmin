type BaseProps = {
  seeder: () => number;
};

const characterCategories = {
  vowel: {
    lower: 'aeiouy',
    upper: 'AEIOUY',
  },
  soft: {
    lower: 'cfhjlmnrsvwxz',
    upper: 'CFHJLMNRSVWXZ',
  },
  hard: {
    lower: 'bdgkpqt',
    upper: 'BDGKPQT',
  },
  number: '²³º¼½¾' + Array.from({ length: 10 }, (_, i) => i).join(''),
} as const;

// TODO: Diacritic probability should be maybe 0.01.
const diacritics = {
  a: 'àáâãäåąæ', e: 'æèéêë', i: 'ìíîï', o: 'ðòóôõö', u: 'ùúûü', y: 'ýÿ',
  A: 'ÀÁÂÃÄÅĀĂĄÆ', E: 'ÆÈÉÊË', I: 'ÌÍÎÏ', O: 'ÒÓÔÕÖ', U: 'ÙÚÛÜ', Y: 'ÝŸ',
  c: 'çćĉ', n: 'ñ', s: 'çćĉ',
  C: 'ÇĆĈ', N: 'Ñ', S: 'ÇĆĈ', B: 'ß', D: 'Ð',
};

// Words should commonly be a mean of 1 syllable with a STD of 1 or 2.

// Sentence length can vary depending on the medium:
// Social Media/Texting: Mean often drops to 6–10 words.
// Most professional writing, e.g. journalism or non-fiction aims for 17.5 words, STD 10.
// Scientific/Academic Writing: Mean often climbs to 25+ words.
// Legal Documents: Can have a mean exceeding 50 words with a very high standard deviation

// STD could scale.
// Distribution is right-skewed.

// Sentence length can be mean 4, STD 3, Manchester United Nil.

const PROBABILITIES = {
  syllableHasSoftCharacter: 0.05,
  syllableHasHardCharacter: 0.95,
  wordEndsWithConsonant: 0.1,
  wordIsProperNoun: 0.05,
  wordStartsWithVowel: 0.1,
  sentenceIsQuestion: 0.15,
};

type CharacterCategoryConfig = typeof characterCategories;
type CharacterPronunciation = keyof CharacterCategoryConfig;
type CharacterCase<
  T extends CharacterPronunciation
> = CharacterCategoryConfig[T] extends object ? keyof CharacterCategoryConfig[T] : never;
type CharacterCatagoryAll = {
  [K in CharacterPronunciation]: {
    pronunciation: K;
  } & (CharacterCase<K> extends never ? {
    wordCase?: never;
  } : {
    wordCase: CharacterCase<K>;
  });
};
type CharacterCatagory = CharacterCatagoryAll[keyof CharacterCatagoryAll];

const seederFactory = (seeder: () => number) => {
  const scale = (value: number, floor = false) => {
    const scaled = seeder() * value;
    return floor ? Math.floor(scaled) : scaled;
  };
  const p = (p: keyof typeof PROBABILITIES) => seeder() < PROBABILITIES[p];

  return { p, scale };
};

const getCharacters = ({
  pronunciation, wordCase
}: CharacterCatagory): string => {
  if (pronunciation === 'number') return characterCategories[pronunciation];
  return characterCategories[pronunciation][wordCase];
};

const genP = (seeder: () => number) => (
  p: keyof typeof PROBABILITIES
) => seeder() < PROBABILITIES[p];

const pickCharacter = (
  category: CharacterCatagory,
  { seeder }: BaseProps
) => {
  const characters = getCharacters(category);
  const index = Math.floor(seeder() * characters.length);
  return characters[index];
};

const START_WORD = 'word';
const START_SENTENCE = 'sentence';
type SyllableProps = BaseProps & { starts?: typeof START_WORD | typeof START_SENTENCE; };
const generateSyllable = ({ seeder, starts }: SyllableProps) => {
  const p = genP(seeder);
  const capitalise = starts === 'sentence' || (
    starts === 'word' && p('wordIsProperNoun')
  );
  const prefixVowel = capitalise && p('wordStartsWithVowel');
  const hardConsonant = p('syllableHasHardCharacter');
  const softConsonant = p('syllableHasSoftCharacter');
  const anotherSoftConsonant = p('syllableHasSoftCharacter');

  const characters: (
    Pick<CharacterCatagory, 'pronunciation'> & {
      condition: boolean; uc: boolean;
    }
  )[] = [
    { condition: prefixVowel, pronunciation: 'vowel', uc: true },
    {
      condition: hardConsonant, pronunciation: 'hard',
      uc: !prefixVowel && capitalise,
    },
    {
      condition: softConsonant, pronunciation: 'soft',
      uc: !prefixVowel && capitalise && !hardConsonant,
    },
    { condition: true, pronunciation: 'vowel', uc: false, },
    { condition: anotherSoftConsonant, pronunciation: 'soft', uc: false },
  ];
  return characters.reduce((acc, { condition, pronunciation, uc }) => {
    if (!condition) return acc;
    if (pronunciation === 'number') return acc + pickCharacter(
      { pronunciation }, { seeder }
    );
    return acc + pickCharacter({
      pronunciation, wordCase: uc ? 'upper' : 'lower',
    }, { seeder });
  }, '');
};

type WordProps = Omit<SyllableProps, 'starts'> & {
  starts?: Exclude<SyllableProps['starts'], 'word'>;
};
const generateWord = ({ seeder, ...props }: WordProps) => {
  const gen = seederFactory(seeder);
  const totalSyllables = gen.scale(7, true) + 1;
  const endWithConsonant = gen.p('wordEndsWithConsonant');
  const syllables = Array.from({ length: totalSyllables }, (_, i) => {
    const starts = (i === 0 ? (props.starts ?? 'word') : undefined);
    return generateSyllable({ seeder, starts });
  });
  return syllables.join('') + (endWithConsonant
    ? pickCharacter({
      pronunciation: gen.p('syllableHasHardCharacter') ? 'hard' : 'soft',
      wordCase: 'lower'
    }, { seeder }) : ''
  );
};

const MAXIMUM_SENTENCE_LENGTH = 20;

const generateSentence = ({ seeder }: BaseProps) => {
  // Decide the number of words. Possibly from 1 to 20.
  const gen = seederFactory(seeder);
  const totalWords = gen.scale(MAXIMUM_SENTENCE_LENGTH, true) + 1;
  const isQuestion = gen.p('sentenceIsQuestion');
  // const pHasComma = totalWords === 1 ? 0 : totalWords / (
  //   MAXIMUM_SENTENCE_LENGTH + 1
  // );
  // const hasComma = pHasComma > 0 && seeder() < pHasComma;
  const words = Array.from({ length: totalWords }, (_, i) => {
    const starts = i === 0 ? 'sentence' : undefined;
    return generateWord({ seeder, starts });
  });
  return words.join(' ') + (isQuestion ? '?' : '.');
  // Sentence may contain a comma. Could increase the probability up to the
  // sentence length + 1 (thus we can have a long sentence with no comma).
  // A single word sentence cannot have a comma.
  // Put the comma in the middle of the sentence.
};

const MAXIMUM_PARAGRAPH_LENGTH = 10;

export const generateParagraph = (props: BaseProps) => {
  const gen = seederFactory(props.seeder);
  const totalSentences = gen.scale(MAXIMUM_PARAGRAPH_LENGTH, true) + 1;
  const sentences = Array.from(
    { length: totalSentences }, () => generateSentence(props)
  );
  return sentences.join('\n');
};
