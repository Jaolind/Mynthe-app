import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { audio, type AudioMode } from '../audio/AudioEngine';
import { TEST_SOUNDS } from '../audio/sounds';
import { getSettings, isPersisted, requestPersistence, saveSettings, type Settings } from '../storage/db';
import { downloadJson, exportBackup, importBackup, isBackup } from '../storage/backup';
import { HomeButton } from '../ui/HomeButton';
import { Recorder } from './Recorder';
import { StoriesRead } from './StoriesRead';

/**
 * Forældreområdet. I fase 0 er det primært en "lydtest" til at afgøre,
 * om PWA'en virker pålideligt på familiens telefon (se BYGGEPLAN, fase 0).
 */
export function ParentScreen({ onHome }: { onHome: () => void }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  useSyncExternalStore(
    (cb) => audio.subscribe(cb),
    () => `${audio.currentMode}|${audio.contextState}|${audio.lastError}`,
  );

  useEffect(() => {
    void getSettings().then(setSettings);
    void isPersisted().then(setPersisted);
  }, []);

  const note = (s: string) => setLog((l) => [`${new Date().toLocaleTimeString('da-DK')} ${s}`, ...l].slice(0, 12));

  const update = async (patch: Partial<Settings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  };

  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  return (
    <div className="screen parent">
      <HomeButton onHome={onHome} />
      <h1>Forældreområde</h1>

      <section className="card">
        <h2>Historier læst for Mynthe</h2>
        <StoriesRead />
      </section>

      <section className="card">
        <h2>Stemmer</h2>
        <Recorder />
      </section>

      <section className="card">
        <h2>Lydtest</h2>
        <p className="muted">
          Test fra hjemmeskærmsikonet, i flytilstand og med lydløs-knappen både til og fra.
        </p>
        <div className="row">
          {TEST_SOUNDS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="small-btn"
              onClick={async () => {
                const t0 = performance.now();
                await audio.play(s.id);
                note(`${s.id} spillet (${Math.round(performance.now() - t0)} ms)`);
              }}
            >
              ▶ {s.id.replace('test-', '')}
            </button>
          ))}
        </div>
        <label className="row">
          Lydmotor:
          <select
            value={audio.currentMode}
            onChange={async (e) => {
              const mode = e.target.value as AudioMode;
              audio.setMode(mode);
              await update({ audioMode: mode });
              note(`Skiftede til ${mode}`);
            }}
          >
            <option value="webaudio">Web Audio (standard)</option>
            <option value="html5">HTML5-lyd (plan B)</option>
          </select>
        </label>
        <dl className="diag">
          <dt>Startet fra hjemmeskærm</dt>
          <dd>{standalone ? '✅ ja' : '⚠️ nej, åbn fra ikonet'}</dd>
          <dt>Online</dt>
          <dd>{navigator.onLine ? 'ja' : 'nej (offline)'}</dd>
          <dt>Lydkontekst</dt>
          <dd>{audio.contextState}</dd>
          <dt>Varig lagring</dt>
          <dd>
            {persisted === null ? 'ukendt' : persisted ? '✅ ja' : '⚠️ nej'}{' '}
            {!persisted && (
              <button type="button" className="link-btn" onClick={async () => setPersisted(await requestPersistence())}>
                bed om det
              </button>
            )}
          </dd>
          {audio.lastError && (
            <>
              <dt>Seneste fejl</dt>
              <dd className="error">{audio.lastError}</dd>
            </>
          )}
        </dl>
        {log.length > 0 && (
          <ul className="log">
            {log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        )}
      </section>

      {settings && (
        <section className="card">
          <h2>Rytme</h2>
          <label className="row">
            Appen sover fra kl.
            <input
              type="time"
              value={settings.bedtimeLockFrom}
              onChange={(e) => void update({ bedtimeLockFrom: e.target.value })}
            />
          </label>
          <label className="row">
            Sessionslængde (min.)
            <input
              type="number"
              min={3}
              max={20}
              value={settings.sessionMinutes}
              onChange={(e) => void update({ sessionMinutes: Number(e.target.value) })}
            />
          </label>
        </section>
      )}

      <section className="card">
        <h2>Data</h2>
        <p className="muted">Alt gemmes kun på denne telefon. Tag en sikkerhedskopi en gang imellem.</p>
        <div className="row">
          <button
            type="button"
            className="small-btn"
            onClick={async () => {
              downloadJson(await exportBackup(), `mynthe-backup-${new Date().toISOString().slice(0, 10)}.json`);
              note('Eksporteret');
            }}
          >
            Eksportér
          </button>
          <button type="button" className="small-btn" onClick={() => fileRef.current?.click()}>
            Importér
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const data = JSON.parse(await file.text());
                if (!isBackup(data)) throw new Error('Ikke en Mynthe-backup');
                await importBackup(data);
                setSettings(await getSettings());
                note('Importeret');
              } catch (err) {
                note(`Import fejlede: ${String(err)}`);
              }
              e.target.value = '';
            }}
          />
        </div>
      </section>
      <p className="muted small">Version {__APP_VERSION__}</p>
    </div>
  );
}
