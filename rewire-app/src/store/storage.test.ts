// 資料層單元測試：確認容錯讀取、匯入驗證與不會產生假資料
import { describe, expect, it } from 'vitest';
import { createBackup, createEmptyData, loadData, normalize, saveData, STORAGE_KEY, validateBackup } from './storage';

describe('normalize', () => {
  it('非物件輸入回傳空白資料', () => {
    expect(normalize(null)).toEqual(createEmptyData());
    expect(normalize('abc')).toEqual(createEmptyData());
  });

  it('補上缺少欄位並移除無效項目', () => {
    const d = normalize({ notes: [{ id: 'a', content: 'x' }, { content: '沒有 id' }, 'bad'], settings: { theme: 'neon' } });
    expect(d.notes).toHaveLength(1);
    expect(d.notes[0].tags).toEqual([]);
    expect(d.settings.theme).toBe('system');
    expect(d.journal).toEqual([]);
  });

  it('挑戰只接受 1–14 天', () => {
    const d = normalize({ challenge: { '1': { completed: true }, '15': { completed: true }, x: {} } });
    expect(Object.keys(d.challenge)).toEqual(['1']);
    expect(d.challenge['1'].note).toBe('');
  });

  it('每日收藏只保留 1–7 且不重複', () => {
    expect(normalize({ dailyFavorites: [1, 1, 8, 3, 'x'] }).dailyFavorites).toEqual([1, 3]);
  });
});

describe('validateBackup', () => {
  it('接受本網站匯出的備份', () => {
    const data = createEmptyData();
    data.journal.push({ id: 'j1', date: '2026-11-10', title: 't', content: 'c', mood: 3, tags: [], createdAt: '', updatedAt: '' });
    const r = validateBackup(JSON.stringify(createBackup(data)));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.journal).toHaveLength(1);
  });

  it('拒絕非 JSON、非 Rewire 格式與錯誤版本', () => {
    expect(validateBackup('{').ok).toBe(false);
    expect(validateBackup(JSON.stringify({ foo: 1 })).ok).toBe(false);
    expect(validateBackup(JSON.stringify({ app: 'rewire', data: { version: 2 } })).ok).toBe(false);
    expect(validateBackup(JSON.stringify({ app: 'rewire', data: { version: 1, notes: {} } })).ok).toBe(false);
  });
});

describe('load / save', () => {
  it('寫入後可讀回', () => {
    const mem = new Map<string, string>();
    const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    const d = createEmptyData();
    d.neuralReps = 5;
    expect(saveData(d, storage)).toBe(true);
    expect(mem.has(STORAGE_KEY)).toBe(true);
    expect(loadData(storage).neuralReps).toBe(5);
  });

  it('損毀資料回傳空白資料而不是拋出錯誤', () => {
    expect(loadData({ getItem: () => '{broken' })).toEqual(createEmptyData());
  });
});
