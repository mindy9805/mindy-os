/**
 * 匯出工具：將個人資料轉為 Markdown（筆記、日誌、挑戰、每日練習）或 JSON。
 * 所有匯出都在瀏覽器內完成，不會上傳到任何伺服器。
 */
import type { AppData } from '../types';
import { chapterLabel } from '../content/chapters';
import { challengeDays } from '../content/challenge';
import { affirmationMap } from '../content/dailyRewire';
import { formatDate, formatDateTime } from './date';
import { MOODS } from '../components/ui/basics';
import { auditScale, weakeningHabits, weakeningMap } from '../content/weakeningHabits';

const moodText = (m: number) => MOODS.find((x) => x.v === m)?.label ?? '未填';

export function notesToMarkdown(d: AppData, notes = d.notes): string {
  const lines = ['# Rewire 學習筆記', '', `匯出時間：${formatDateTime(new Date().toISOString())}`, ''];
  const groups = new Map<string, typeof notes>();
  notes.forEach((n) => groups.set(n.chapterId, [...(groups.get(n.chapterId) ?? []), n]));
  for (const [ch, list] of groups) {
    lines.push(`## ${chapterLabel(ch as never)}`, '');
    for (const n of list) {
      lines.push(`### ${n.kind === 'highlight' ? '📌 收藏重點' : '✏️ 個人反思'}${n.source ? `：${n.source}` : ''}`);
      lines.push('', n.content, '');
      if (n.tags.length) lines.push(`標籤：${n.tags.map((t) => `#${t}`).join(' ')}`, '');
      lines.push(`_${formatDateTime(n.updatedAt)}_`, '');
    }
  }
  if (!notes.length) lines.push('（目前沒有筆記）');
  return lines.join('\n');
}

export function journalToMarkdown(d: AppData): string {
  const lines = ['# Rewire 反思日誌', ''];
  [...d.journal].sort((a, b) => b.date.localeCompare(a.date)).forEach((j) => {
    lines.push(`## ${formatDate(j.date)}｜${j.title || '未命名'}`, '', `心情：${moodText(j.mood)}`, '', j.content, '');
    if (j.tags.length) lines.push(`標籤：${j.tags.map((t) => `#${t}`).join(' ')}`, '');
  });
  if (!d.journal.length) lines.push('（目前沒有日誌）');
  return lines.join('\n');
}

export function challengeToMarkdown(d: AppData): string {
  const done = Object.values(d.challenge).filter((c) => c.completed).length;
  const lines = ['# Rewire 14 天神經可塑性練習紀錄', '', `完成進度：${done}/14 天`, ''];
  for (const day of challengeDays) {
    const r = d.challenge[String(day.day)];
    lines.push(`## Day ${day.day}：${day.theme} ${r?.completed ? '✅' : '⬜'}`, '');
    lines.push(`- 今日心智語句：${affirmationMap[day.affirmationId].text}`);
    if (r?.note) lines.push(`- 我的紀錄：${r.note.replace(/\n/g, ' ')}`);
    if (r?.affirmationReflection) lines.push(`- 語句反思：${r.affirmationReflection.replace(/\n/g, ' ')}`);
    if (r?.microActionDone) lines.push('- 已完成微小行動');
    if (r?.feeling) lines.push(`- 感受：${r.feeling}`);
    lines.push('');
  }
  return lines.join('\n');
}

export function dailyToMarkdown(d: AppData): string {
  const lines = ['# Daily Rewire 每日心智練習紀錄', ''];
  [...d.dailyLogs].sort((a, b) => b.date.localeCompare(a.date)).forEach((l) => {
    lines.push(`## ${formatDate(l.date)} ${l.completedReading ? '✅ 已完成朗讀' : ''}`, '');
    if (l.favoriteId) lines.push(`- 最有感觸：${affirmationMap[l.favoriteId]?.text}`);
    if (l.why) lines.push(`- 為什麼：${l.why.replace(/\n/g, ' ')}`);
    if (l.action) lines.push(`- 小行動：${l.action}`);
    if (l.mood) lines.push(`- 情緒：${moodText(l.mood)}${l.moodWords ? `（${l.moodWords}）` : ''}`);
    lines.push('');
  });
  if (!d.dailyLogs.length) lines.push('（目前沒有紀錄）');
  return lines.join('\n');
}

export function habitsToMarkdown(d: AppData): string {
  const lines = ['# 削弱習慣自我檢視與反向選擇', ''];
  [...d.habitAudits].sort((a, b) => b.date.localeCompare(a.date)).forEach((a) => {
    lines.push(`## ${formatDate(a.date)} 自我檢視`, '');
    weakeningHabits.forEach((h) => lines.push(`- ${h.title}：${auditScale[a.ratings[h.id] ?? 0]?.label}`));
    if (a.focusId && weakeningMap[a.focusId]) lines.push(`- 本週專注：${weakeningMap[a.focusId].title}`);
    if (a.note) lines.push(`- 備註：${a.note.replace(/\n/g, ' ')}`);
    lines.push('');
  });
  if (d.counterChoices.length) {
    lines.push('## 反向選擇紀錄', '');
    [...d.counterChoices].sort((a, b) => b.date.localeCompare(a.date)).forEach((c) => {
      const h = weakeningMap[c.habitId];
      lines.push(`- ${formatDate(c.date)}｜${h ? `選${h.kind}（${h.title}）` : ''}：${c.choice}`);
    });
  }
  if (!d.habitAudits.length && !d.counterChoices.length) lines.push('（目前沒有紀錄）');
  return lines.join('\n');
}

export function allToMarkdown(d: AppData): string {
  return [notesToMarkdown(d), journalToMarkdown(d), challengeToMarkdown(d), dailyToMarkdown(d), habitsToMarkdown(d)].join('\n\n---\n\n');
}

export const stamp = () => new Date().toISOString().slice(0, 10);
