import type { ReactNode } from 'react';
import { stopVoice } from '../audio/voice';
import { HomeButton } from '../ui/HomeButton';

/** Fælles ramme om en leg: hjem-knap, "hør igen" og stille prikker for, hvor langt man er. */
export function ActivityShell({
  children,
  onHome,
  onRepeat,
  total,
  index,
  className = '',
}: {
  children: ReactNode;
  onHome: () => void;
  onRepeat?: () => void;
  total: number;
  index: number;
  className?: string;
}) {
  return (
    <div className={`screen activity ${className}`}>
      <HomeButton
        onHome={() => {
          stopVoice();
          onHome();
        }}
      />
      {onRepeat && (
        <button type="button" className="icon-btn repeat-btn" aria-label="Hør igen" onClick={onRepeat}>
          <span aria-hidden>🔊</span>
        </button>
      )}
      <div className="progress-dots" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < index ? 'dot dot--on' : i === index ? 'dot dot--now' : 'dot'} />
        ))}
      </div>
      {children}
    </div>
  );
}
