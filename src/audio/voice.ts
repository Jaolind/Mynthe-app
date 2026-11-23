import { Howler } from 'howler';
import { voiceById } from '../content/voices';
import { getRecording } from '../storage/db';

/**
 * Stemmer: afspiller den voksnes optagelse, hvis den findes.
 * Ellers læser telefonens computerstemme teksten op på dansk (nødløsning).
 */
const buffers = new Map<string, AudioBuffer | null>();
let current: { stop: () => void } | null = null;
let generation = 0;

export function invalidateVoice(id: string) {
  buffers.delete(id);
}

async function loadBuffer(id: string): Promise<AudioBuffer | null> {
  if (buffers.has(id)) return buffers.get(id)!;
  const rec = await getRecording(id).catch(() => undefined);
  const ctx = Howler.ctx;
  if (!rec || !ctx) {
    buffers.set(id, null);
    return null;
  }
  try {
    const buf = await ctx.decodeAudioData(await rec.blob.arrayBuffer());
    buffers.set(id, buf);
    return buf;
  } catch {
    buffers.set(id, null);
    return null;
  }
}

export function stopVoice() {
  generation++;
  current?.stop();
  current = null;
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
}

/** Siger én replik. Resolver, når den er færdig. */
export async function say(id: string): Promise<void> {
  const gen = generation;
  const buf = await loadBuffer(id);
  if (gen !== generation) return;
  if (buf && Howler.ctx) return playBuffer(buf);
  const line = voiceById.get(id);
  return speak(line?.tts ?? line?.text ?? id);
}

/** Siger flere replikker efter hinanden. Stopper, hvis stopVoice() kaldes undervejs. */
export async function sayAll(ids: string[]) {
  const gen = ++generation;
  for (const id of ids) {
    if (gen !== generation) return;
    await say(id);
  }
}

function playBuffer(buf: AudioBuffer): Promise<void> {
  const ctx = Howler.ctx!;
  return new Promise((resolve) => {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(Howler.masterGain ?? ctx.destination);
    src.onended = () => resolve();
    current = {
      stop: () => {
        try {
          src.stop();
        } catch {
          /* allerede stoppet */
        }
        resolve();
      },
    };
    src.start();
  });
}

/** Dansk computerstemme via Web Speech API. Bruges kun, når intet er indtalt. */
export function speak(text: string): Promise<void> {
  if (typeof speechSynthesis === 'undefined') return Promise.resolve();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'da-DK';
    u.rate = 0.9;
    const da = speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith('da'));
    if (da) u.voice = da;
    const done = () => resolve();
    u.onend = done;
    u.onerror = done;
    // Sikkerhedsnet: nogle browsere sender aldrig "end".
    setTimeout(done, 400 + text.length * 120);
    speechSynthesis.speak(u);
  });
}

/** Skal kaldes i et tryk (startskærmen), så iOS tillader tale senere. */
export function unlockSpeech() {
  if (typeof speechSynthesis === 'undefined') return;
  const u = new SpeechSynthesisUtterance(' ');
  u.volume = 0;
  speechSynthesis.speak(u);
}
