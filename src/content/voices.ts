import { LETTERS } from './letters';
import { STORIES } from './stories';

/**
 * Alle replikker, appen kan sige. Den voksne kan indtale dem i forældreområdet.
 * Er en replik ikke indtalt, læser telefonens computerstemme teksten op (nødløsning).
 */
export type Speaker = 'knurhaar' | 'pip' | 'bog' | 'lyd' | 'ord' | 'tal';

export interface VoiceLine {
  id: string;
  speaker: Speaker;
  text: string;
  /** Det, computerstemmen skal sige, hvis det afviger fra teksten (fx bogstavlyde). */
  tts?: string;
}

const knurhaar = (id: string, text: string): VoiceLine => ({ id: `knurhaar-${id}`, speaker: 'knurhaar', text });
const pip = (id: string, text: string): VoiceLine => ({ id: `pip-${id}`, speaker: 'pip', text });

export const NUMBER_WORDS_DA = ['nul', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni', 'ti'];

export const VOICE_LINES: VoiceLine[] = [
  knurhaar('hej', 'Hej Mynthe! Velkommen om bord på Hvorfor.'),
  knurhaar('godt-arbejde', 'Godt arbejde i dag! Nu hviler vi os lidt.'),
  knurhaar('starter-med', 'Pip har fundet nogle ting om bord. Hvilken af dem starter med'),
  knurhaar('hvilket-tegn', 'Lyt godt efter. Hvilket tegn siger'),
  knurhaar('hvor-mange', 'Hvor mange ostebidder kiggede frem?'),
  knurhaar('laeg-i-kassen', 'Læg ostebidder i Pips ostekasse. Hvor mange skal der i?'),
  knurhaar('mangler', 'Ostekassen har ti huller. Hvor mange mangler der?'),
  knurhaar('ret-pip', 'Pip prøver at sige huskesætningen. Hvem siger den rigtigt?'),
  knurhaar('rigtigt', 'Ja, sådan!'),
  knurhaar('sig-sammen', 'Sig den sammen med mig.'),
  knurhaar('spoerg-voksen', 'Nu har en voksen et spørgsmål til dig.'),
  knurhaar('lyt-igen', 'Lyt igen.'),
  knurhaar('sover', 'Kaptajnen sover. Vi ses i morgen!'),
  pip('hej', 'Hej! Jeg bor i kaptajnens hat.'),
  pip('jubel', 'Hurra! Den skal på tavlen!'),
  pip('ups', 'Ups, så tog jeg også fejl. Vi prøver igen.'),
  pip('ost', 'Mmm, ost!'),
  ...LETTERS.map((l) => ({ id: `lyd-${l.id}`, speaker: 'lyd' as const, text: `Lyden ${l.id}`, tts: l.ttsHint })),
  ...LETTERS.flatMap((l) => l.words.map((w) => ({ id: `ord-${w.id}`, speaker: 'ord' as const, text: w.text }))),
  ...NUMBER_WORDS_DA.slice(1).map((t, i) => ({ id: `tal-${i + 1}`, speaker: 'tal' as const, text: t })),
  // Bogens huskesætninger: Knurhår siger den rigtigt, Pip siger den forkert (ordret fra historierne).
  ...STORIES.flatMap((st) => [
    { id: `bog-${st.nr}-knurhaar`, speaker: 'bog' as const, text: `Knurhår (historie ${st.nr}): ${st.huskesaetning}`, tts: st.huskesaetning },
    ...(st.pipForkert
      ? [{ id: `bog-${st.nr}-pip`, speaker: 'bog' as const, text: `Pip (historie ${st.nr}): ${st.pipForkert}`, tts: st.pipForkert }]
      : []),
  ]),
];

export const voiceById = new Map(VOICE_LINES.map((v) => [v.id, v]));

export const SPEAKER_LABEL: Record<Speaker, string> = {
  knurhaar: 'Kaptajn Knurhår',
  pip: 'Pip',
  bog: 'Bogens huskesætninger',
  lyd: 'Bogstavlyde',
  ord: 'Ord',
  tal: 'Tal',
};
