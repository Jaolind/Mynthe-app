import { describe, expect, it } from 'vitest';
import { applyAnswer, INTERVALS, newProgress, readyForNewItem } from '../src/engine/mastery';

const NOW = 1_700_000_000_000;

describe('applyAnswer', () => {
  it('rykker én boks op ved rigtigt svar og sætter næste gentagelse', () => {
    const p = applyAnswer(newProgress('letter:m', NOW), true, NOW);
    expect(p.box).toBe(1);
    expect(p.attempts).toBe(1);
    expect(p.correct).toBe(1);
    expect(p.dueAt).toBe(NOW + INTERVALS[1]);
  });

  it('går aldrig over boks 4', () => {
    let p = newProgress('letter:m', NOW);
    for (let i = 0; i < 10; i++) p = applyAnswer(p, true, NOW);
    expect(p.box).toBe(4);
  });

  it('går ned ved forkert svar, men aldrig under 1', () => {
    let p = newProgress('letter:s', NOW);
    p = applyAnswer(p, true, NOW);
    p = applyAnswer(p, true, NOW);
    expect(p.box).toBe(2);
    p = applyAnswer(p, false, NOW);
    expect(p.box).toBe(1);
    p = applyAnswer(p, false, NOW);
    expect(p.box).toBe(1);
    expect(p.runInItem).toBe(0);
  });
});

describe('readyForNewItem', () => {
  it('åbner nyt indhold, når 80 % står i boks ≥ 2', () => {
    const mk = (box: 0 | 1 | 2 | 3 | 4) => ({ ...newProgress('letter:x', NOW), box });
    expect(readyForNewItem([])).toBe(true);
    expect(readyForNewItem([mk(2), mk(2), mk(2), mk(2), mk(1)])).toBe(true);
    expect(readyForNewItem([mk(2), mk(2), mk(2), mk(1), mk(1)])).toBe(false);
  });
});
