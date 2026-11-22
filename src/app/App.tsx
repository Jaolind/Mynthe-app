import { useEffect, useState } from 'react';
import { audio } from '../audio/AudioEngine';
import { TEST_SOUNDS } from '../audio/sounds';
import { isBedtime } from '../engine/session';
import { getSettings, requestPersistence, type Settings } from '../storage/db';
import { ParentGate } from '../parent/ParentGate';
import { ParentScreen } from '../parent/ParentScreen';
import { BigButton } from '../ui/BigButton';
import { HomeButton } from '../ui/HomeButton';

type Screen = 'start' | 'home' | 'lyde' | 'tal' | 'gate' | 'parent';

export function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    void getSettings().then((s) => {
      setSettings(s);
      audio.setMode(s.audioMode);
      audio.preload(TEST_SOUNDS);
    });
    void requestPersistence();
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Genindlæs indstillinger, når man forlader forældreområdet.
  useEffect(() => {
    if (screen === 'home') void getSettings().then(setSettings);
  }, [screen]);

  const sleeping = settings && screen !== 'gate' && screen !== 'parent' && isBedtime(now, settings.bedtimeLockFrom);
  const goHome = () => {
    audio.stopAll();
    setScreen('home');
  };

  if (sleeping) {
    return (
      <div className="screen sleep">
        <div className="moon" aria-hidden>🌙</div>
        <p className="big-text">Nu sover spillet. Vi ses i morgen!</p>
        <button type="button" className="parent-corner" aria-label="For voksne" onClick={() => setScreen('gate')}>
          ⚙︎
        </button>
      </div>
    );
  }

  switch (screen) {
    case 'start':
      return (
        <div className="screen start">
          <button
            type="button"
            className="sun"
            aria-label="Tryk på solen for at starte"
            onClick={async () => {
              await audio.unlock();
              void audio.play('test-melodi');
              setScreen('home');
            }}
          >
            ☀️
          </button>
          <p className="big-text">Tryk på solen</p>
        </div>
      );
    case 'home':
      return (
        <div className="screen home">
          <div className="tracks">
            <BigButton tone="sun" size="xl" aria-label="Lyde" onClick={() => setScreen('lyde')}>
              <span className="track-icon">🔤</span>
            </BigButton>
            <BigButton tone="sea" size="xl" aria-label="Tal" onClick={() => setScreen('tal')}>
              <span className="track-icon">🔢</span>
            </BigButton>
          </div>
          <button type="button" className="parent-corner" aria-label="For voksne" onClick={() => setScreen('gate')}>
            ⚙︎
          </button>
        </div>
      );
    case 'lyde':
    case 'tal':
      return (
        <div className="screen coming">
          <HomeButton onHome={goHome} />
          <div className="track-icon huge">{screen === 'lyde' ? '🔤' : '🔢'}</div>
          <p className="big-text">Kommer snart!</p>
          <div className="row">
            <BigButton tone="leaf" size="md" aria-label="Spil en lyd" onClick={() => void audio.play('test-2')}>
              🎵
            </BigButton>
          </div>
        </div>
      );
    case 'gate':
      return <ParentGate onPass={() => setScreen('parent')} onCancel={goHome} />;
    case 'parent':
      return <ParentScreen onHome={goHome} />;
  }
}
