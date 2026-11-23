/**
 * De første bogstavlyde i den rækkefølge, de introduceres.
 * Stabile konsonanter og de første vokaler blandes, så der hurtigt kan bygges ord.
 * Ordene bruges til forlyd ("Hvad starter med /s/?") og vises som billeder (emoji som pladsholder).
 * Forlyden er valgt, så ordet tydeligt starter med bogstavets lyd.
 */
export interface Word {
  id: string; // fx "sol"
  text: string; // det, der siges
  emoji: string;
}

export interface Letter {
  id: string; // "m"
  /** Hvad computerstemmen siger, indtil lyden er indtalt. Det er en nødløsning. */
  ttsHint: string;
  words: Word[];
}

export const LETTERS: Letter[] = [
  { id: 'm', ttsHint: 'mmm', words: [w('mus', '🐭'), w('måne', '🌙'), w('mælk', '🥛'), w('mad', '🍽️')] },
  { id: 's', ttsHint: 'sss', words: [w('sol', '☀️'), w('sko', '👟'), w('sæl', '🦭'), w('seng', '🛏️')] },
  { id: 'a', ttsHint: 'a', words: [w('abe', '🐒'), w('and', '🦆'), w('agurk', '🥒'), w('appelsin', '🍊')] },
  { id: 'l', ttsHint: 'lll', words: [w('løve', '🦁'), w('lys', '🕯️'), w('lam', '🐑'), w('lampe', '💡')] },
  { id: 'i', ttsHint: 'i', words: [w('is', '🍦'), w('iglo', '🛖'), w('ild', '🔥')] },
  { id: 'r', ttsHint: 'rrr', words: [w('ræv', '🦊'), w('ris', '🍚'), w('regn', '🌧️'), w('robot', '🤖')] },
  { id: 'o', ttsHint: 'o', words: [w('ost', '🧀'), w('orm', '🪱'), w('okse', '🐂')] },
  { id: 'f', ttsHint: 'fff', words: [w('fisk', '🐟'), w('fugl', '🐦'), w('frø', '🐸'), w('fod', '🦶')] },
  { id: 'u', ttsHint: 'u', words: [w('ugle', '🦉'), w('ur', '⌚'), w('ulv', '🐺')] },
  { id: 'n', ttsHint: 'nnn', words: [w('næse', '👃'), w('nød', '🌰'), w('nål', '🪡'), w('net', '🥅')] },
];

function w(text: string, emoji: string): Word {
  return { id: text, text, emoji };
}

export const LETTER_IDS = LETTERS.map((l) => l.id);
export const letterById = (id: string) => LETTERS.find((l) => l.id === id)!;
