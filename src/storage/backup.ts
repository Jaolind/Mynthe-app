import { db, DEFAULT_SETTINGS, type SessionLog, type Settings } from './db';
import type { ItemProgress } from '../engine/types';

export interface Backup {
  app: 'mynthe';
  version: 1;
  exportedAt: string;
  settings: Settings;
  progress: ItemProgress[];
  sessions: SessionLog[];
}

/** Eksport af fremskridt og indstillinger som JSON (optagelser er ikke med). */
export async function exportBackup(): Promise<Backup> {
  const d = await db();
  return {
    app: 'mynthe',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: { ...DEFAULT_SETTINGS, ...(await d.get('settings', 'settings')) },
    progress: await d.getAll('progress'),
    sessions: await d.getAll('sessions'),
  };
}

export function isBackup(x: unknown): x is Backup {
  const b = x as Backup;
  return !!b && b.app === 'mynthe' && b.version === 1 && Array.isArray(b.progress) && Array.isArray(b.sessions);
}

export async function importBackup(b: Backup) {
  const d = await db();
  const tx = d.transaction(['progress', 'sessions', 'settings'], 'readwrite');
  await tx.objectStore('progress').clear();
  await tx.objectStore('sessions').clear();
  for (const p of b.progress) await tx.objectStore('progress').put(p);
  for (const s of b.sessions) await tx.objectStore('sessions').put(s);
  await tx.objectStore('settings').put({ ...DEFAULT_SETTINGS, ...b.settings }, 'settings');
  await tx.done;
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
