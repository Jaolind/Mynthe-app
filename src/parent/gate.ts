export const NUMBER_WORDS = ['', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni'] as const;

export interface GateChallenge {
  digits: number[];
  words: string[];
}

/** Tre forskellige tal fra 1-9, vist som danske talord. */
export function makeGateChallenge(rng: () => number = Math.random, length = 3): GateChallenge {
  const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const digits: number[] = [];
  while (digits.length < length) {
    const i = Math.floor(rng() * pool.length);
    digits.push(pool.splice(i, 1)[0]);
  }
  return { digits, words: digits.map((d) => NUMBER_WORDS[d]) };
}
