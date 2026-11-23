import { describe, expect, it } from 'vitest';
import { STORIES, TREASURE } from '../src/content/stories';
import { VOICE_LINES } from '../src/content/voices';

describe('bogens data', () => {
  it('har 12 historier med huskesætning, to morgenspørgsmål og en skat', () => {
    expect(STORIES).toHaveLength(12);
    for (const s of STORIES) {
      expect(s.huskesaetning.length).toBeGreaterThan(5);
      expect(s.morgenspoergsmaal.length).toBe(2);
      expect(TREASURE[s.nr]).toBeDefined();
    }
  });
  it('Pip er først med fra historie 2', () => {
    expect(STORIES[0].pipForkert).toBeNull();
    for (const s of STORIES.slice(1)) expect(s.pipForkert).toBeTruthy();
  });
  it('alle replik-id er unikke', () => {
    const ids = VOICE_LINES.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
