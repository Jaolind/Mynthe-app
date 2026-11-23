import { useEffect, useRef, useState } from 'react';
import { Art, Backdrop } from '../art/Art';
import { audio } from '../audio/AudioEngine';
import { TEST_SOUNDS } from '../audio/sounds';
import { isBedtime } from '../engine/session';
import { getSettings, requestPersistence, type Settings } from '../storage/db';
import { ParentGate } from '../parent/ParentGate';
import { ParentScreen } from '../parent/ParentScreen';
import { LydeStation } from '../activities/LydeStation';
import { SkatteStation } from '../activities/SkatteStation';
import { TalStation } from '../activities/TalStation';
import { stopVoice, unlockSpeech } from '../audio/voice';
import { DeckScreen, type Station } from './DeckScreen';
import { Fog } from './Fog';

type Screen = 'start' | 'home' | Station | 'gate' | 'parent';

const FOG_MS = 700;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [fog, setFog] = useState(false);
  const fogTimer = useRef<number | undefined>(undefined);

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

  useEffect(() => {
    if (screen === 'home') void getSettings().then(setSettings);
  }, [screen]);

  /** Skift sted gennem tidstågen: tågen glider ind, skærmen skifter, tågen glider væk. */
  const sailTo = (next: Screen) => {
    audio.stopAll();
    stopVoice();
    if (prefersReducedMotion()) return setScreen(next);
    setFog(true);
    clearTimeout(fogTimer.current);
    fogTimer.current = window.setTimeout(() => {
      setScreen(next);
      fogTimer.current = window.setTimeout(() => setFog(false), 60);
    }, FOG_MS);
  };
  const goHome = () => sailTo('home');

  const sleeping = settings && screen !== 'gate' && screen !== 'parent' && isBedtime(now, settings.bedtimeLockFrom);

  return (
    <>
      {sleeping ? (
        <div className="stage sleep">
          <Backdrop id="bg-daek-nat" />
          <Art id="knurhaar-sover" className="sleep__cat" />
          <p className="big-text sleep__text">Kaptajnen sover. Vi ses i morgen!</p>
          <button type="button" className="parent-corner" aria-label="For voksne" onClick={() => setScreen('gate')}>
            ⚙︎
          </button>
        </div>
      ) : (
        renderScreen()
      )}
      <Fog active={fog} />
    </>
  );

  function renderScreen() {
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
                unlockSpeech();
                void audio.play('test-melodi');
                sailTo('home');
              }}
            >
              ☀️
            </button>
            <p className="big-text">Tryk på solen</p>
          </div>
        );
      case 'home':
        return <DeckScreen onGo={sailTo} onParent={() => setScreen('gate')} />;
      case 'lyde':
        return <LydeStation onHome={goHome} />;
      case 'tal':
        return <TalStation onHome={goHome} />;
      case 'bog':
        return <SkatteStation onHome={goHome} />;
      case 'gate':
        return <ParentGate onPass={() => setScreen('parent')} onCancel={() => setScreen('home')} />;
      case 'parent':
        return <ParentScreen onHome={() => setScreen('home')} />;
    }
  }
}
