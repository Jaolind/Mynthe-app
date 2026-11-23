import { describe, expect, it } from 'vitest';
import { letterChoices, onsetChoices } from '../src/activities/choices';
import { LETTERS, letterById } from '../src/content/letters';

describe('svarmuligheder', () => {
  it('bogstaver: altid målet med, ingen dubletter, rigtigt antal', () => {
    for (const l of LETTERS) {
      for (const n of [2, 3, 4]) {
        const c = letterChoices(l.id, n, ['m', 's']);
        expect(c).toHaveLength(n);
        expect(new Set(c).size).toBe(n);
        expect(c).toContain(l.id);
      }
    }
  });

  it('forlyd: kun ét ord starter med målbogstavets ord-gruppe', () => {
    for (const l of LETTERS) {
      for (let i = 0; i < 20; i++) {
        const { answer, options } = onsetChoices(l.id, 4);
        expect(options).toContainEqual(answer);
        const fromTarget = options.filter((o) => letterById(l.id).words.some((w) => w.id === o.id));
        expect(fromTarget).toHaveLength(1);
        expect(new Set(options.map((o) => o.id)).size).toBe(4);
      }
    }
  });

  it('ingen ord står under to forskellige bogstaver, og alle ord starter med deres bogstav', () => {
    const all = LETTERS.flatMap((l) => l.words.map((w) => w.id));
    expect(new Set(all).size).toBe(all.length);
    for (const l of LETTERS) for (const w of l.words) expect(w.text.startsWith(l.id)).toBe(true);
  });
});
