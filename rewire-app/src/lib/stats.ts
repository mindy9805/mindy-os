/**
 * 統計計算：所有數字皆由使用者實際儲存的資料計算，沒有資料就回傳 0 或空陣列，
 * 絕不產生假的成績或紀錄。
 */
import type { AppData } from '../types';
import { isoToDateKey, lastNDays } from './date';
import { CHAPTER_IDS } from '../store/storage';

export function chapterStats(d: AppData) {
  const completed = CHAPTER_IDS.filter((id) => d.chapters[id]?.completed).length;
  const quizzes = CHAPTER_IDS.map((id) => d.quizzes[id]).filter(Boolean);
  const avg = quizzes.length ? Math.round((quizzes.reduce((s, q) => s + q!.score / q!.total, 0) / quizzes.length) * 100) : 0;
  return { completed, total: CHAPTER_IDS.length, quizDone: quizzes.length, quizAvg: avg };
}

export function challengeStats(d: AppData) {
  const done = Object.values(d.challenge).filter((c) => c.completed).length;
  return { done, total: 14 };
}

/** 每日心智練習統計 */
export function dailyStats(d: AppData, today = new Date()) {
  const completedLogs = d.dailyLogs.filter((l) => l.completedReading);
  const days = new Set(completedLogs.map((l) => l.date));
  const week = lastNDays(7, today).map((date) => ({ date, done: days.has(date) }));
  // 最常選擇的語句（依 favoriteId 次數）
  const counts: Record<number, number> = {};
  for (const l of d.dailyLogs) if (l.favoriteId) counts[l.favoriteId] = (counts[l.favoriteId] ?? 0) + 1;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const latest = [...d.dailyLogs].filter((l) => l.why || l.action).sort((a, b) => b.date.localeCompare(a.date))[0];
  return {
    totalDays: days.size,
    totalSessions: completedLogs.length,
    week,
    topId: top ? Number(top[0]) : 0,
    topCount: top ? top[1] : 0,
    counts,
    latest,
  };
}

/** 最近 n 天各類練習次數（習慣練習頻率圖） */
export function practiceFrequency(d: AppData, n = 14, today = new Date()) {
  const days = lastNDays(n, today);
  const empty = () => ({ 習慣紀錄: 0, 情緒命名: 0, 呼吸練習: 0, 每日語句: 0, 挑戰: 0 });
  const map: Record<string, ReturnType<typeof empty>> = Object.fromEntries(days.map((k) => [k, empty()]));
  const add = (iso: string | undefined, key: keyof ReturnType<typeof empty>) => {
    if (!iso) return;
    const k = iso.length === 10 ? iso : isoToDateKey(iso);
    if (map[k]) map[k][key] += 1;
  };
  d.habitLogs.forEach((h) => add(h.createdAt, '習慣紀錄'));
  d.emotionLogs.forEach((h) => add(h.createdAt, '情緒命名'));
  d.sessions.forEach((h) => add(h.createdAt, '呼吸練習'));
  d.dailyLogs.filter((l) => l.completedReading).forEach((l) => add(l.date, '每日語句'));
  Object.values(d.challenge).forEach((c) => c.completed && add(c.completedAt, '挑戰'));
  const rows = days.map((k) => ({ date: k, ...map[k] }));
  const total = rows.reduce((s, r) => s + r.習慣紀錄 + r.情緒命名 + r.呼吸練習 + r.每日語句 + r.挑戰, 0);
  return { rows, total };
}

/** 情緒趨勢：合併反思日誌與每日練習的心情分數（1–5），以及情緒命名強度 */
export function moodTrend(d: AppData, n = 14, today = new Date()) {
  const days = lastNDays(n, today);
  const rows = days.map((date) => {
    const moods = [...d.journal.filter((j) => j.date === date && j.mood > 0).map((j) => j.mood), ...d.dailyLogs.filter((l) => l.date === date && l.mood > 0).map((l) => l.mood)];
    const intens = d.emotionLogs.filter((e) => isoToDateKey(e.createdAt) === date).map((e) => e.intensity);
    return {
      date,
      心情: moods.length ? Math.round((moods.reduce((a, b) => a + b, 0) / moods.length) * 10) / 10 : null,
      情緒強度: intens.length ? Math.round((intens.reduce((a, b) => a + b, 0) / intens.length) * 10) / 10 : null,
    };
  });
  const hasData = rows.some((r) => r.心情 !== null || r.情緒強度 !== null);
  return { rows, hasData };
}

export interface Milestone {
  id: string;
  label: string;
  desc: string;
  achieved: boolean;
}

/** 學習里程碑：依實際資料判斷是否達成 */
export function milestones(d: AppData): Milestone[] {
  const c = chapterStats(d);
  const ch = challengeStats(d);
  const ds = dailyStats(d);
  return [
    { id: 'm1', label: '踏出第一步', desc: '完成第一個章節', achieved: c.completed >= 1 },
    { id: 'm2', label: '知識探索者', desc: '完成 5 個章節', achieved: c.completed >= 5 },
    { id: 'm3', label: '全書導讀完成', desc: '完成全部 9 個章節', achieved: c.completed >= 9 },
    { id: 'm4', label: '小試身手', desc: '完成第一份測驗', achieved: c.quizDone >= 1 },
    { id: 'm5', label: '挑戰啟程', desc: '完成 14 天挑戰的任 1 天', achieved: ch.done >= 1 },
    { id: 'm6', label: '一週的陪伴', desc: '完成 14 天挑戰的任 7 天', achieved: ch.done >= 7 },
    { id: 'm7', label: '14 天完成', desc: '完成全部 14 天挑戰', achieved: ch.done >= 14 },
    { id: 'm8', label: '每日心智練習', desc: '完成第一次 Daily Rewire', achieved: ds.totalDays >= 1 },
    { id: 'm9', label: '七天的練習', desc: '累計 7 天完成 Daily Rewire', achieved: ds.totalDays >= 7 },
    { id: 'm10', label: '行動設計師', desc: '建立第一份 If-Then 計畫', achieved: d.plans.length >= 1 },
    { id: 'm11', label: '自我覺察', desc: '寫下第一篇反思日誌', achieved: d.journal.length >= 1 },
    { id: 'm12', label: '習慣偵探', desc: '留下第一筆習慣紀錄', achieved: d.habitLogs.length >= 1 },
  ];
}
