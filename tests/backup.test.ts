import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { applyAnswer, newProgress } from '../src/engine/mastery';
import { getAllProgress, saveProgress, saveSettings, DEFAULT_SETTINGS, getSettings } from '../src/storage/db';
import { exportBackup, importBackup, isBackup } from '../src/storage/backup';

describe('eksport → slet → import', () => {
  it('genskaber fremskridt og indstillinger', async () => {
    await saveSettings({ ...DEFAULT_SETTINGS, bedtimeLockFrom: '18:30' });
    await saveProgress(applyAnswer(newProgress('letter:m', 0), true, 0));
    const backup = JSON.parse(JSON.stringify(await exportBackup()));
    expect(isBackup(backup)).toBe(true);

    await importBackup({ ...backup, progress: [], sessions: [] }); // "slet"
    expect((await getAllProgress()).size).toBe(0);

    await importBackup(backup);
    const restored = await getAllProgress();
    expect(restored.get('letter:m')?.box).toBe(1);
    expect((await getSettings()).bedtimeLockFrom).toBe('18:30');
  });

  it('afviser filer, der ikke er en Mynthe-backup', () => {
    expect(isBackup({ foo: 1 })).toBe(false);
  });
});
