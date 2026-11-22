import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ItemId, ItemProgress } from '../engine/types';
import type { AudioMode } from '../audio/AudioEngine';

export interface Settings {
  bedtimeLockFrom: string; // "19:00"
  sessionMinutes: number; // 10
  useParentVoice: boolean;
  audioMode: AudioMode;
}

export const DEFAULT_SETTINGS: Settings = {
  bedtimeLockFrom: '19:00',
  sessionMinutes: 10,
  useParentVoice: true,
  audioMode: 'webaudio',
};

export interface SessionLog {
  id: string;
  startedAt: number;
  endedAt: number;
  activity: string;
  items: number;
}

/** Forælderens optagelser bliver på enheden og sendes aldrig nogen steder hen. */
export interface Recording {
  letter: string;
  blob: Blob;
  recordedAt: number;
}

interface MyntheDB extends DBSchema {
  progress: { key: ItemId; value: ItemProgress };
  sessions: { key: string; value: SessionLog; indexes: { byStart: number } };
  settings: { key: 'settings'; value: Settings };
  recordings: { key: string; value: Recording };
}

let dbPromise: Promise<IDBPDatabase<MyntheDB>> | null = null;

export function db() {
  dbPromise ??= openDB<MyntheDB>('mynthe', 1, {
    upgrade(d) {
      d.createObjectStore('progress', { keyPath: 'id' });
      const s = d.createObjectStore('sessions', { keyPath: 'id' });
      s.createIndex('byStart', 'startedAt');
      d.createObjectStore('settings');
      d.createObjectStore('recordings', { keyPath: 'letter' });
    },
  });
  return dbPromise;
}

export async function getSettings(): Promise<Settings> {
  const s = await (await db()).get('settings', 'settings');
  return { ...DEFAULT_SETTINGS, ...s };
}

export async function saveSettings(s: Settings) {
  await (await db()).put('settings', s, 'settings');
}

export async function getAllProgress(): Promise<Map<ItemId, ItemProgress>> {
  const all = await (await db()).getAll('progress');
  return new Map(all.map((p) => [p.id, p]));
}

export async function saveProgress(p: ItemProgress) {
  await (await db()).put('progress', p);
}

export async function logSession(s: SessionLog) {
  await (await db()).put('sessions', s);
}

/** Beder browseren om ikke at slette data under pladspres (vigtigt på iOS). */
export async function requestPersistence(): Promise<boolean | null> {
  if (!navigator.storage?.persist) return null;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}

export async function isPersisted(): Promise<boolean | null> {
  if (!navigator.storage?.persisted) return null;
  return navigator.storage.persisted();
}
