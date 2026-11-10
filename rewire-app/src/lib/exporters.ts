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
import { patternHabits, patternMap } from '../content/breakPattern';
import { scoreAssessment } from './pattern';

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

/** Break the Pattern：評估、行動實驗、工具紀錄、微承諾、工作坊、14 天打破慣性挑戰 */
export function patternToMarkdown(d: AppData): string {
  const L = ['# Break the Pattern｜打破慣性 紀錄', ''];
  if (d.patternFocus.length) L.push(`目前想調整的習慣：${d.patternFocus.map((id) => patternMap[id].short).join('、')}`, '');
  if (d.patternAssessments.length) {
    L.push('## 七大習慣自我覺察評估（自我回報頻率 1–5，非診斷）', '');
    [...d.patternAssessments].sort((a, b) => b.date.localeCompare(a.date)).forEach((a) => {
      L.push(`### ${formatDate(a.date)}`, ...scoreAssessment(a.answers).map((s) => `- ${s.short}：${s.avg}（${s.label}）`));
      if (a.priorityIds.length) L.push(`- 優先改善：${a.priorityIds.map((id) => patternMap[id].short).join('、')}`);
      L.push('');
    });
  }
  if (d.counterChoices.length) {
    L.push('## 行動實驗與反向選擇', '');
    [...d.counterChoices].sort((a, b) => b.date.localeCompare(a.date)).forEach((c) => L.push(`- ${formatDate(c.date)}｜${patternMap[c.habitId as keyof typeof patternMap]?.short ?? ''}：${c.choice}`));
    L.push('');
  }
  if (d.patternEntries.length) {
    L.push('## 互動工具紀錄', '');
    for (const e of d.patternEntries) {
      const t = formatDateTime(e.createdAt);
      if (e.kind === 'validation') L.push(`- ${t}｜認可依賴覺察：${e.decision}（原本想做：${e.wanted || '—'}；兼顧方式：${e.balance || '—'}）`);
      if (e.kind === 'comfort') L.push(`- ${t}｜舒適圈探索：${e.task}（${e.steps.filter((s) => s.done).length}/${e.steps.length} 步完成）`);
      if (e.kind === 'spending') L.push(`- ${t}｜消費檢視：${e.item}（${e.price} 元，冷靜期至 ${e.coolUntil}）`);
      if (e.kind === 'quiet') L.push(`- ${t}｜安靜 ${Math.round(e.seconds / 60)} 分鐘：${[e.thoughts, e.feelings, e.need].filter(Boolean).join('／')}`);
      if (e.kind === 'environment') L.push(`- ${t}｜環境盤點：${e.label}${e.note ? `（${e.note}）` : ''}`);
      if (e.kind === 'choice') L.push(`- ${t}｜選擇比較：${e.want} → 折衷：${e.compromise || '—'}；下一次：${e.next || '—'}`);
    }
    L.push('');
  }
  if (d.microCommitments.length) {
    L.push('## 微承諾', '');
    d.microCommitments.forEach((m) => {
      const logs = d.commitmentLogs.filter((l) => l.commitmentId === m.id);
      L.push(`- ${m.text}${m.active ? '' : '（已暫停）'}：完成 ${logs.filter((l) => l.status === 'done').length} 次、中斷 ${logs.filter((l) => l.status === 'missed').length} 次`);
    });
    L.push('');
  }
  if (d.workshops.length) {
    L.push('## 習慣改變工作坊', '');
    d.workshops.forEach((w) => L.push(`### ${patternMap[w.habitId].title}`, `- 模式：${w.pattern || '—'}`, `- 觸發：${[w.time, w.emotion, w.cue].filter(Boolean).join('、') || '—'}`, `- 替代行動：${w.alternative || '—'}`, `- If-Then：如果${w.ifSituation || '……'}，我就${w.ifAction || '……'}`, `- 回顧：${w.reviewNote || '—'}`, ''));
  }
  const pc = d.patternChallenge;
  for (const h of patternHabits) {
    const days = pc.progress[h.id];
    if (!days || !Object.keys(days).length) continue;
    L.push(`## 14 天打破慣性挑戰：${h.short}`, '');
    Object.entries(days).sort((a, b) => Number(a[0]) - Number(b[0])).forEach(([k, r]) => L.push(`- Day ${k} ${r.completed ? '✅' : '⬜'}${r.reflection ? `｜反思：${r.reflection.replace(/\n/g, ' ')}` : ''}${r.note ? `｜紀錄：${r.note.replace(/\n/g, ' ')}` : ''}`));
    L.push('');
  }
  if (L.length <= 2) L.push('（目前沒有紀錄）');
  return L.join('\n');
}

export function allToMarkdown(d: AppData): string {
  return [notesToMarkdown(d), journalToMarkdown(d), challengeToMarkdown(d), dailyToMarkdown(d), patternToMarkdown(d)].join('\n\n---\n\n');
}

export const stamp = () => new Date().toISOString().slice(0, 10);
