import { useEffect, useMemo, useRef, useState } from 'react';
import { Art } from '../art/Art';
import { audio } from '../audio/AudioEngine';
import { say, sayAll, speak, stopVoice } from '../audio/voice';
import { STORIES, TREASURE, type Story } from '../content/stories';
import { applyAnswer, newProgress } from '../engine/mastery';
import type { ItemId } from '../engine/types';
import { getAllProgress, getStoriesRead, logSession, saveProgress } from '../storage/db';
import { HomeButton } from '../ui/HomeButton';
import { BigButton } from '../ui/BigButton';
import { pickN } from './choices';
import { EndScreen } from './EndScreen';
import { PipReaction } from './Feedback';

/**
 * Skattekisten (Bogen). Én skat pr. historie, som den voksne har markeret som læst.
 * Tryk på en skat: "Ret Pip" (huskesætningen) → morgenspørgsmålene med en voksen.
 * Ulæste historier vises som lukkede pladser uden titel (ingen spoilers).
 */
export function SkatteStation({ onHome }: { onHome: () => void }) {
  const [read, setRead] = useState<Set<number> | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [step, setStep] = useState<'pip' | 'q0' | 'q1' | 'leg' | 'end'>('pip');

  useEffect(() => void getStoriesRead().then(setRead), []);

  if (!read) return <div className="screen" />;

  if (!story) {
    return (
      <div className="screen chest">
        <HomeButton onHome={onHome} />
        <Art id="skattekiste-aaben" className="chest__art" />
        {read.size === 0 && <p className="big-text small-text">Skattekisten er tom. Læs en historie først!</p>}
        <div className="treasures">
          {STORIES.map((s) =>
            read.has(s.nr) ? (
              <button
                key={s.nr}
                type="button"
                className="treasure"
                aria-label={TREASURE[s.nr].navn}
                onClick={() => {
                  setStory(s);
                  setStep('pip');
                }}
              >
                {TREASURE[s.nr].emoji}
              </button>
            ) : (
              <span key={s.nr} className="treasure treasure--locked" aria-hidden>
                ?
              </span>
            ),
          )}
        </div>
      </div>
    );
  }

  const back = () => {
    stopVoice();
    setStory(null);
  };
  if (step === 'end') return <EndScreen onHome={back} />;
  if (step === 'pip') return <RetPip key={story.nr} story={story} onHome={back} onDone={() => setStep('q0')} />;
  if (step === 'q0' || step === 'q1') {
    const i = step === 'q0' ? 0 : 1;
    const q = story.morgenspoergsmaal[i];
    if (!q) return <Leg story={story} onHome={back} onNext={() => setStep('end')} />;
    return <Question key={step} q={q} onHome={back} onNext={() => setStep(i === 0 ? 'q1' : 'leg')} />;
  }
  return <Leg story={story} onHome={back} onNext={() => setStep('end')} />;
}

/** Ret Pip: Pip siger huskesætningen forkert. Hvem siger den rigtigt, Pip eller kaptajnen? */
function RetPip({ story, onHome, onDone }: { story: Story; onHome: () => void; onDone: () => void }) {
  const hasPip = !!story.pipForkert;
  const order = useMemo(() => pickN(['pip', 'knurhaar'] as const, 2), []);
  const [mood, setMood] = useState<'idle' | 'yes' | 'oops'>('idle');
  const [locked, setLocked] = useState(true);
  const firstTry = useRef(true);
  const startedAt = useRef(Date.now());

  const prompt = async () => {
    setLocked(true);
    if (hasPip) await sayAll(['knurhaar-ret-pip', `bog-${story.nr}-pip`, `bog-${story.nr}-knurhaar`]);
    else await sayAll([`bog-${story.nr}-knurhaar`, 'knurhaar-sig-sammen', `bog-${story.nr}-knurhaar`]);
    setLocked(false);
  };

  useEffect(() => {
    void prompt();
    return () => stopVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const record = async (ok: boolean) => {
    const id = `story:${story.nr}` as ItemId;
    const all = await getAllProgress();
    await saveProgress(applyAnswer(all.get(id) ?? newProgress(id, Date.now()), ok, Date.now()));
    await logSession({ id: `bog-${startedAt.current}`, startedAt: startedAt.current, endedAt: Date.now(), activity: `bog:${story.nr}`, items: 1 });
  };

  const choose = async (who: 'pip' | 'knurhaar') => {
    if (locked) return;
    setLocked(true);
    if (who === 'knurhaar') {
      setMood('yes');
      void audio.play('test-3');
      await sayAll(['knurhaar-rigtigt', `bog-${story.nr}-knurhaar`]);
      await record(firstTry.current);
      onDone();
    } else {
      firstTry.current = false;
      setMood('oops');
      await say('pip-ups');
      setMood('idle');
      await prompt();
    }
  };

  return (
    <div className="screen ret-pip">
      <HomeButton onHome={onHome} />
      <button type="button" className="icon-btn repeat-btn" aria-label="Hør igen" onClick={() => !locked && void prompt()}>
        <span aria-hidden>🔊</span>
      </button>
      <div className="treasure treasure--big" aria-hidden>
        {TREASURE[story.nr].emoji}
      </div>
      {hasPip ? (
        <div className="who">
          {order.map((who) => (
            <div key={who} className="who__col">
              <button
                type="button"
                className="who__hear"
                aria-label={who === 'pip' ? 'Hør Pip' : 'Hør kaptajnen'}
                onClick={() => {
                  if (locked) return;
                  stopVoice();
                  void say(`bog-${story.nr}-${who}`);
                }}
              >
                <Art id={who === 'pip' ? 'pip-ups' : 'knurhaar-nysgerrig'} />
                <span className="who__speaker" aria-hidden>
                  🔊
                </span>
              </button>
              <button
                type="button"
                className="who__pick"
                aria-label={who === 'pip' ? 'Pip siger det rigtigt' : 'Kaptajnen siger det rigtigt'}
                onClick={() => void choose(who)}
              >
                ✓
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
          <Art id="knurhaar-hilser" className="ret-pip__cat idle-bob" />
          <BigButton tone="leaf" size="md" aria-label="Videre" onClick={() => !locked && void record(true).then(onDone)}>
            ✓
          </BigButton>
        </>
      )}
      <PipReaction mood={mood} />
    </div>
  );
}

/** Morgenspørgsmål: for barnet og en voksen sammen. Svaret står kun til den voksne. */
function Question({ q, onHome, onNext }: { q: Story['morgenspoergsmaal'][number]; onHome: () => void; onNext: () => void }) {
  const [showAnswer, setShowAnswer] = useState(false);
  useEffect(() => {
    void say('knurhaar-spoerg-voksen').then(() => speak(q.spoergsmaal));
    return () => stopVoice();
  }, [q]);
  return (
    <div className="screen question">
      <HomeButton onHome={onHome} />
      <Art id="knurhaar-nysgerrig" className="question__cat" />
      <p className="question__text">{q.spoergsmaal}</p>
      <button
        type="button"
        className="small-btn"
        onClick={() => {
          stopVoice();
          void speak(q.spoergsmaal);
        }}
      >
        🔊 Læs op igen
      </button>
      {q.svar && (
        <button type="button" className="link-btn answer-toggle" onClick={() => setShowAnswer((v) => !v)}>
          {showAnswer ? q.svar : 'Svar til den voksne'}
        </button>
      )}
      <BigButton tone="leaf" size="md" aria-label="Videre" onClick={onNext}>
        →
      </BigButton>
    </div>
  );
}

/** Dagens leg fra bogen: et kort til den voksne. */
function Leg({ story, onHome, onNext }: { story: Story; onHome: () => void; onNext: () => void }) {
  return (
    <div className="screen question">
      <HomeButton onHome={onHome} />
      <p className="muted">Dagens leg (til den voksne)</p>
      <p className="question__text question__text--small">{story.leg}</p>
      <BigButton tone="leaf" size="md" aria-label="Færdig" onClick={onNext}>
        ✓
      </BigButton>
    </div>
  );
}

