/**
 * Alle sætninger og ord, der skal laves som lydfiler med dansk TTS.
 * `npm run tts` læser denne liste og skriver MP3-filer til public/audio/<mappe>/<id>.mp3.
 * Bogstav-LYDE (/m/, /s/ …) er IKKE med her: dem indtaler forælderen selv.
 */
export interface Phrase {
  id: string;
  folder: 'instruktioner' | 'ord';
  text: string;
}

export const PHRASES: Phrase[] = [
  { id: 'velkommen', folder: 'instruktioner', text: 'Hej Mynthe! Skal vi lege med lyde eller med tal?' },
  { id: 'hent-en-voksen', folder: 'instruktioner', text: 'Det her er for voksne. Hent en voksen.' },
  { id: 'godt-arbejde', folder: 'instruktioner', text: 'Godt arbejde i dag!' },
  { id: 'lyt-igen', folder: 'instruktioner', text: 'Lyt igen.' },
  { id: 'sover', folder: 'instruktioner', text: 'Nu sover spillet. Vi ses i morgen!' },
  // Ord til fase 1 (L1–L3)
  ...['is', 'os', 'mus', 'sol', 'ris', 'fil', 'ni', 'nu', 'mor', 'far', 'sø', 'mål'].map((w) => ({
    id: w,
    folder: 'ord' as const,
    text: w,
  })),
];
