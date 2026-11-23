import data from './stories.json';

/**
 * Bog 1 (historie 1-12), hentet fra historiefilerne i Drive-mappen "Mynthes godnathistoriebog".
 * Drive er kilden til sandhed: ændres en huskesætning dér, opdateres stories.json.
 * Historie 3-12 er "Tjekket", men endnu ikke godkendt af Janus (23. nov. 2026), så teksten kan ændre sig.
 */
export interface Story {
  nr: number;
  title: string;
  friend: string;
  huskesaetning: string;
  pipForkert: string | null;
  skat: { ting: string; til: string | null } | null;
  morgenspoergsmaal: { spoergsmaal: string; svar: string | null }[];
  leg: string;
  kernebegreb: string;
}

export const STORIES = data as Story[];

/**
 * Skattene om bord (fra 03 Verdensbibel, "Ting om bord"). Emoji er pladsholdere til illustrationer.
 * Historie 3 har ingen gave i teksten, men Verdensbiblen nævner mønten, Pip fandt mellem to planker.
 */
export const TREASURE: Record<number, { emoji: string; navn: string }> = {
  1: { emoji: '🍎', navn: 'Newtons sidste æble' },
  2: { emoji: '👑', navn: 'Et stykke af papirkronen' },
  3: { emoji: '🪙', navn: 'Den blanke mønt' },
  4: { emoji: '🟫', navn: 'Lertavlen fra Kushim' },
  5: { emoji: '🪨', navn: 'Stenen fra Åse' },
  6: { emoji: '✨', navn: 'Sandkornet fra Demokrit' },
  7: { emoji: '🖌️', navn: 'Penslen fra Hussein' },
  8: { emoji: '🎶', navn: 'Fløjten fra Peder' },
  9: { emoji: '🍌', navn: 'Bananen fra Valentina' },
  10: { emoji: '🌰', navn: 'Frøet fra Darwin' },
  11: { emoji: '🕯️', navn: 'Lyset fra Anna' },
  12: { emoji: '🏳️', navn: 'Flaget fra Lucie' },
};

export const storyByNr = (nr: number) => STORIES.find((s) => s.nr === nr)!;
