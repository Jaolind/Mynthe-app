import { describe, expect, it } from 'vitest';
import { makeGateChallenge, NUMBER_WORDS } from '../src/parent/gate';

describe('forældrelås', () => {
  it('laver tre forskellige tal 1-9 med matchende talord', () => {
    for (let i = 0; i < 200; i++) {
      const c = makeGateChallenge();
      expect(c.digits).toHaveLength(3);
      expect(new Set(c.digits).size).toBe(3);
      c.digits.forEach((d, j) => {
        expect(d).toBeGreaterThanOrEqual(1);
        expect(d).toBeLessThanOrEqual(9);
        expect(c.words[j]).toBe(NUMBER_WORDS[d]);
      });
    }
  });
});
