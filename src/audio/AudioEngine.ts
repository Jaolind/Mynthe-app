import { Howl, Howler } from 'howler';

/**
 * Lydmotoren. iOS kræver, at lyd låses op af et tryk, før noget kan afspilles.
 * Derfor kaldes `unlock()` fra startskærmens "tryk på solen".
 *
 * `mode` er plan B: Hvis Web Audio driller på iOS, kan forælderen skifte til
 * HTML5-lyd i forældreområdet uden at ændre koden.
 */
export type AudioMode = 'webaudio' | 'html5';

export interface SoundDef {
  id: string;
  src: string; // sti relativt til base, fx "audio/test/do.wav", eller en blob-URL
}

type Listener = () => void;

class AudioEngine {
  private sounds = new Map<string, Howl>();
  private defs = new Map<string, SoundDef>();
  private mode: AudioMode = 'webaudio';
  private unlocked = false;
  private listeners = new Set<Listener>();
  lastError: string | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      // Når appen kommer tilbage fra baggrunden, kan iOS have suspenderet lyden.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void this.resume();
      });
    }
  }

  get isUnlocked() {
    return this.unlocked;
  }

  get currentMode() {
    return this.mode;
  }

  get contextState(): string {
    return Howler.ctx?.state ?? (this.mode === 'html5' ? 'html5' : 'ukendt');
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  setMode(mode: AudioMode) {
    if (mode === this.mode) return;
    this.mode = mode;
    // Genopret alle lyde i den nye tilstand.
    this.sounds.forEach((h) => h.unload());
    this.sounds.clear();
    this.preload([...this.defs.values()]);
    this.emit();
  }

  /** Skal kaldes direkte i en tryk-handler. */
  async unlock() {
    try {
      await this.resume();
      // En stille, kort lyd i selve tryk-handleren er det sikreste unlock på iOS.
      const ctx = Howler.ctx;
      if (ctx) {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(ctx.destination);
        src.start(0);
      }
      this.unlocked = true;
      this.lastError = null;
    } catch (e) {
      this.lastError = String(e);
    }
    this.emit();
  }

  async resume() {
    const ctx = Howler.ctx;
    if (ctx && ctx.state !== 'running') {
      await ctx.resume();
    }
  }

  preload(defs: SoundDef[]) {
    for (const def of defs) {
      this.defs.set(def.id, def);
      if (this.sounds.has(def.id)) continue;
      const howl = new Howl({
        src: [resolveSrc(def.src)],
        html5: this.mode === 'html5',
        preload: true,
        onloaderror: (_id, err) => {
          this.lastError = `Kunne ikke indlæse ${def.id}: ${String(err)}`;
          this.emit();
        },
        onplayerror: (_id, err) => {
          this.lastError = `Kunne ikke afspille ${def.id}: ${String(err)}`;
          this.emit();
          // Howler anbefaler at vente på næste unlock og prøve igen.
          howl.once('unlock', () => howl.play());
        },
      });
      this.sounds.set(def.id, howl);
    }
  }

  /** Afspiller en lyd og resolver, når den er færdig (eller straks ved fejl). */
  play(id: string): Promise<void> {
    const howl = this.sounds.get(id);
    if (!howl) {
      this.lastError = `Ukendt lyd: ${id}`;
      this.emit();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const soundId = howl.play();
      howl.once('end', () => resolve(), soundId);
      howl.once('playerror', () => resolve(), soundId);
    });
  }

  /** Afspiller flere lyde efter hinanden, fx instruktion → ord. */
  async playSequence(ids: string[]) {
    for (const id of ids) await this.play(id);
  }

  stopAll() {
    this.sounds.forEach((h) => h.stop());
  }
}

function resolveSrc(src: string) {
  if (/^(blob:|data:|https?:)/.test(src)) return src;
  return `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
}

export const audio = new AudioEngine();
