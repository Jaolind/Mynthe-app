// Genererer små WAV-testlyde til fase 0 (ingen afhængigheder).
import { mkdirSync, writeFileSync } from 'node:fs';

const RATE = 22050;
const out = new URL('../public/audio/test/', import.meta.url);
mkdirSync(out, { recursive: true });

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

// Blød tone med fade ind/ud (marimba-agtig).
function tone(freq, sec) {
  const n = Math.floor(RATE * sec);
  return Array.from({ length: n }, (_, i) => {
    const t = i / RATE;
    const env = Math.min(1, t / 0.01) * Math.exp(-3.5 * t);
    return 0.5 * env * (Math.sin(2 * Math.PI * freq * t) + 0.25 * Math.sin(4 * Math.PI * freq * t));
  });
}

const notes = { C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5 };
writeFileSync(new URL('tone-1.wav', out), wav(tone(notes.C5, 0.6)));
writeFileSync(new URL('tone-2.wav', out), wav(tone(notes.E5, 0.6)));
writeFileSync(new URL('tone-3.wav', out), wav(tone(notes.G5, 0.6)));
writeFileSync(
  new URL('melodi.wav', out),
  wav([...tone(notes.C5, 0.22), ...tone(notes.E5, 0.22), ...tone(notes.G5, 0.22), ...tone(notes.C6, 0.6)]),
);
console.log('Testlyde skrevet til public/audio/test/');
