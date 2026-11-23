import { LETTERS, letterById, type Word } from '../content/letters';

/**
 * Vælger svarmuligheder. Distraktorer tages fra bogstaver, der allerede er introduceret,
 * og ellers fra de næste i rækkefølgen, så barnet ikke møder helt fremmede tegn.
 */
export function letterChoices(target: string, count: number, known: string[], rng = Math.random): string[] {
  const pool = [...new Set([...known, ...LETTERS.map((l) => l.id)])].filter((id) => id !== target);
  const preferred = pool.filter((id) => known.includes(id));
  const rest = pool.filter((id) => !known.includes(id));
  const picks = [...pickN(preferred, count - 1, rng)];
  if (picks.length < count - 1) picks.push(...rest.slice(0, count - 1 - picks.length));
  return pickN([target, ...picks], count, rng);
}

/** Ét ord, der starter med målbogstavet, og distraktor-ord fra andre bogstaver. */
export function onsetChoices(target: string, count: number, rng = Math.random): { answer: Word; options: Word[] } {
  const answer = pickN(letterById(target).words, 1, rng)[0];
  const others = LETTERS.filter((l) => l.id !== target).flatMap((l) => l.words);
  const distractors = pickN(others, count - 1, rng);
  return { answer, options: pickN([answer, ...distractors], count, rng) };
}

export function pickN<T>(xs: T[], n: number, rng = Math.random): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
