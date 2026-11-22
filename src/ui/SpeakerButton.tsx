import { audio } from '../audio/AudioEngine';

/** 🔊 Gentag instruktionen. Findes på alle skærme med en instruktion. */
export function SpeakerButton({ soundIds, label = 'Hør igen' }: { soundIds: string[]; label?: string }) {
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={label}
      onClick={() => {
        audio.stopAll();
        void audio.playSequence(soundIds);
      }}
    >
      <span aria-hidden>🔊</span>
    </button>
  );
}
