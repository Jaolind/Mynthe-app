import { describe, expect, it } from 'vitest';
import { isBedtime } from '../src/engine/session';

const at = (h: number, m = 0) => new Date(2026, 10, 22, h, m);

describe('isBedtime', () => {
  it('sover fra 19:00 til 06:00', () => {
    expect(isBedtime(at(18, 59), '19:00')).toBe(false);
    expect(isBedtime(at(19, 0), '19:00')).toBe(true);
    expect(isBedtime(at(23, 30), '19:00')).toBe(true);
    expect(isBedtime(at(3), '19:00')).toBe(true);
    expect(isBedtime(at(6), '19:00')).toBe(false);
    expect(isBedtime(at(12), '19:00')).toBe(false);
  });
});
