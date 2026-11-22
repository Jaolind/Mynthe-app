import { describe, expect, it } from 'vitest';
import { applyAnswer, newProgress } from '../src/engine/mastery';
import { nextChoiceCount, planSession } from '../src/engine/scheduler';
import type { ItemId, ItemProgress } from '../src/engine/types';

const NOW = 1_700_000_000_000;
const DAY = 86_400_000;
const curriculum: ItemId[] = ['letter:m', 'letter:s', 'letter:l', 'letter:r'];
const seeded = () => {
  let s = 42;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
};

describe('planSession', () => {
  it('starter med det første item, når intet er introduceret', () => {
    const plan = planSession({ curriculum, progress: new Map(), now: NOW, count: 4, rng: seeded() });
    expect(plan).toEqual(['letter:m', 'letter:m', 'letter:m', 'letter:m']);
  });

  it('introducerer højst ét nyt item og prioriterer items, der skal gentages', () => {
    const progress = new Map<ItemId, ItemProgress>();
    let m = newProgress('letter:m', NOW - 2 * DAY);
    m = applyAnswer(applyAnswer(m, true, NOW - 2 * DAY), true, NOW - 2 * DAY); // boks 2, due efter 1 dag
    progress.set('letter:m', m);

    const plan = planSession({ curriculum, progress, now: NOW, count: 6, rng: seeded() });
    const newOnes = new Set(plan.filter((id) => id !== 'letter:m'));
    expect(newOnes).toEqual(new Set(['letter:s']));
    expect(plan.filter((id) => id === 'letter:s')).toHaveLength(2);
    expect(plan).toContain('letter:m');
  });

  it('venter med nyt indhold, når det eksisterende ikke sidder', () => {
    const progress = new Map<ItemId, ItemProgress>();
    progress.set('letter:m', applyAnswer(newProgress('letter:m', NOW), false, NOW)); // boks 1
    const plan = planSession({ curriculum, progress, now: NOW, count: 4, rng: seeded() });
    expect(plan.every((id) => id === 'letter:m')).toBe(true);
  });
});

describe('nextChoiceCount', () => {
  it('går op efter tre rigtige og ned efter to forkerte', () => {
    expect(nextChoiceCount(2, [true, true, true])).toBe(3);
    expect(nextChoiceCount(4, [true, true, true])).toBe(4);
    expect(nextChoiceCount(3, [true, false, false])).toBe(2);
    expect(nextChoiceCount(2, [false, false])).toBe(2);
    expect(nextChoiceCount(3, [true, false])).toBe(3);
  });
});
