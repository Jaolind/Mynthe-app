/**
 * Alle illustrationer i appen. Filerne laves i ChatGPT (se docs/BILLEDPROMPTS.md),
 * lægges i art-src/ og konverteres med `npm run art` til public/art/<id>.webp.
 * Mangler en fil, viser appen en pladsholder, så appen altid virker.
 */
export const ART = {
  'bg-daek-dag': { fallback: 'deck-day' },
  'bg-daek-nat': { fallback: 'deck-night' },
  taage: { fallback: 'fog' },
  'knurhaar-hilser': { fallback: '🐱' },
  'knurhaar-nysgerrig': { fallback: '🐱' },
  'knurhaar-glad': { fallback: '😸' },
  'knurhaar-lytter': { fallback: '🐱' },
  'knurhaar-sover': { fallback: '😴' },
  'pip-kigger': { fallback: '🐭' },
  'pip-jubler': { fallback: '🐭' },
  'pip-ups': { fallback: '🐭' },
  'pip-skriver': { fallback: '🐭' },
  lertavle: { fallback: '🟫' },
  ostekasse: { fallback: '🧀' },
  ostebid: { fallback: '🧀' },
  'skattekiste-lukket': { fallback: '🧰' },
  'skattekiste-aaben': { fallback: '🧰' },
  'kompas-hus': { fallback: '🧭' },
  'kompas-naal': { fallback: '' },
} as const;

export type ArtId = keyof typeof ART;

export function artUrl(id: ArtId) {
  return `${import.meta.env.BASE_URL}art/${id}.webp`;
}
