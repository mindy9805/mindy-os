// 統計單元測試：確認無資料時不會產生假成績、有資料時正確計算
import { describe, expect, it } from 'vitest';
import { createEmptyData } from '../store/storage';
import { chapterStats, counterChoiceStats, dailyStats, milestones, moodTrend, practiceFrequency } from './stats';

const today = new Date(2026, 10, 10);

describe('stats', () => {
  it('空資料全部為 0', () => {
    const d = createEmptyData();
    expect(chapterStats(d)).toEqual({ completed: 0, total: 9, quizDone: 0, quizAvg: 0 });
    expect(dailyStats(d, today).totalDays).toBe(0);
    expect(practiceFrequency(d, 14, today).total).toBe(0);
    expect(moodTrend(d, 14, today).hasData).toBe(false);
    expect(milestones(d).every((m) => !m.achieved)).toBe(true);
    expect(counterChoiceStats(d)).toEqual({ total: 0, byKind: { 自律: 0, 進步: 0, 自由: 0 }, latestAudit: undefined });
  });

  it('每日練習：天數、最近七天與最常選擇語句', () => {
    const d = createEmptyData();
    const base = { why: '', action: '', mood: 4, moodWords: '', createdAt: '', updatedAt: '' };
    d.dailyLogs = [
      { ...base, id: '1', date: '2026-11-10', completedReading: true, favoriteId: 5 },
      { ...base, id: '2', date: '2026-11-08', completedReading: true, favoriteId: 5, why: '有感' },
      { ...base, id: '3', date: '2026-11-01', completedReading: true, favoriteId: 2 },
      { ...base, id: '4', date: '2026-11-09', completedReading: false, favoriteId: 0 },
    ];
    const s = dailyStats(d, today);
    expect(s.totalDays).toBe(3);
    expect(s.week.filter((w) => w.done).map((w) => w.date)).toEqual(['2026-11-08', '2026-11-10']);
    expect(s.topId).toBe(5);
    expect(s.topCount).toBe(2);
    expect(s.latest?.id).toBe('2');
    expect(moodTrend(d, 14, today).hasData).toBe(true);
  });

  it('測驗平均分數', () => {
    const d = createEmptyData();
    d.quizzes.ch1 = { answers: {}, score: 3, total: 4, submittedAt: '' };
    d.quizzes.ch2 = { answers: {}, score: 4, total: 4, submittedAt: '' };
    expect(chapterStats(d).quizAvg).toBe(88);
  });

  it('反向選擇依類型統計並計入練習頻率', () => {
    const d = createEmptyData();
    d.counterChoices = [
      { id: 'a', date: '2026-11-10', habitId: 'convenience', choice: '自己煮飯', createdAt: '2026-11-10T01:00:00Z' },
      { id: 'b', date: '2026-11-09', habitId: 'shortterm', choice: '去運動', createdAt: '2026-11-09T01:00:00Z' },
      { id: 'c', date: '2026-11-09', habitId: 'unknown', choice: '?', createdAt: '2026-11-09T01:00:00Z' },
    ];
    const s = counterChoiceStats(d);
    expect(s.byKind).toEqual({ 自律: 1, 進步: 0, 自由: 1 });
    expect(practiceFrequency(d, 14, today).total).toBe(3);
  });
});
