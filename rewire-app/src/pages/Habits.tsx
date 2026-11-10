/**
 * 削弱習慣檢視（Habit Check-up）
 * 1. 習慣卡片：原文、科學視角、溫和提醒、反向練習、相關章節與每日語句；可直接記錄一次「反向選擇」。
 * 2. 自我檢視：為每個習慣評估本週頻率、選擇一個想調整的習慣，儲存並回顧歷次結果。
 * 3. 反向選擇紀錄：依「自律／進步／自由」統計實際做出的小選擇。
 * 4. 原文結尾與三個選擇。
 * 所有資料只存在瀏覽器 LocalStorage（habitAudits、counterChoices）。
 */
import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, BookOpen, Sparkles, Trash2, Plus, Library } from 'lucide-react';
import {
  auditScale,
  choiceMeta,
  weakeningHabits,
  weakeningMap,
  WEAKENING_CLOSING,
  WEAKENING_INTRO,
  WEAKENING_SCIENCE_NOTE,
  WEAKENING_TITLE,
  type ChoiceKind,
  type WeakeningHabit,
} from '../content/weakeningHabits';
import { chapterMap } from '../content/chapters';
import { affirmationMap } from '../content/dailyRewire';
import { getReferences } from '../content/references';
import { useStore } from '../store/AppStore';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/Confirm';
import { Card, EmptyState, SectionTitle, TextArea } from '../components/ui/basics';
import { nowIso, uid } from '../lib/id';
import { formatDate, toDateKey } from '../lib/date';
import { counterChoiceStats } from '../lib/stats';

/** 記錄一次反向選擇的小表單 */
function ChoiceForm({ habit, onDone }: { habit: WeakeningHabit; onDone?: () => void }) {
  const { upsert } = useStore();
  const toast = useToast();
  const id = useId();
  const [text, setText] = useState('');
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    upsert('counterChoices', { id: uid(), date: toDateKey(), habitId: habit.id, choice: text.trim(), createdAt: nowIso() });
    toast(`已記錄一次「${habit.kind}」的選擇 💪`);
    setText('');
    onDone?.();
  };
  return (
    <form onSubmit={save} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor={id} className="sr-only">今天我做了什麼反向選擇？</label>
      <input id={id} className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder={`例如：${habit.counters[0]}`} />
      <button className="btn-primary shrink-0" type="submit" disabled={!text.trim()}>
        <Plus className="h-4 w-4" aria-hidden />記錄這個選擇
      </button>
    </form>
  );
}

/** 單一習慣卡片 */
function HabitCard({ h, index }: { h: WeakeningHabit; index: number }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const aff = affirmationMap[h.affirmationId];
  return (
    <article id={`h-${h.id}`} className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="font-display text-3xl italic text-sage">{index + 1}</span>
          <div className="min-w-0 flex-1">
            <span className="chip">{choiceMeta[h.kind].slogan}</span>
            <h3 className="mt-1 font-serif text-xl font-bold">{h.title}</h3>
          </div>
        </div>
        <blockquote className="mt-3 space-y-0.5 border-l-2 border-apricot pl-4 text-sm leading-relaxed">
          {h.lines.map((l) => <p key={l}>{l}</p>)}
        </blockquote>
        <button className="btn-ghost btn-sm mt-3" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panel}>
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
          {open ? '收合' : '科學視角與反向練習'}
        </button>
      </div>
      {open && (
        <div id={panel} className="space-y-4 border-t border-line p-5 text-sm leading-relaxed motion-safe:animate-fade-up">
          <div>
            <p className="font-medium text-accent">科學視角</p>
            <p className="mt-1">{h.science}</p>
          </div>
          <p className="rounded-xl bg-soft/70 px-3 py-2">🌱 溫和提醒：{h.gentle}</p>
          <div>
            <p className="font-medium text-accent">反向練習（選一個就好）</p>
            <ul className="mt-1 space-y-1">
              {h.counters.map((c) => <li key={c}>・{c}</li>)}
            </ul>
          </div>
          <ChoiceForm habit={h} />
          <div className="flex flex-wrap gap-1.5">
            {h.chapterIds.map((id) => (
              <Link key={id} to={`/learn/${id}`} className="chip hover:bg-sage/40">
                <BookOpen className="mr-1 h-3 w-3" aria-hidden />第 {chapterMap[id].number} 章 {chapterMap[id].title}
              </Link>
            ))}
            <Link to="/daily" className="chip hover:bg-sage/40">
              <Sparkles className="mr-1 h-3 w-3" aria-hidden />每日語句：{aff.text}
            </Link>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-muted"><Library className="h-3.5 w-3.5" aria-hidden />研究來源</p>
            <ul className="mt-1 space-y-1 text-xs text-muted">
              {getReferences(h.referenceIds).map((r) => (
                <li key={r.id}>
                  {r.authors.split(',')[0]} 等（{r.year}）. <i>{r.title}</i>.{' '}
                  {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-accent underline">DOI</a>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

/** 自我檢視表單與歷史 */
function AuditSection() {
  const { data, upsert, remove } = useStore();
  const toast = useToast();
  const confirm = useConfirm();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [focusId, setFocusId] = useState('');
  const [note, setNote] = useState('');
  const complete = weakeningHabits.every((h) => ratings[h.id] !== undefined);
  const max = weakeningHabits.length * 3;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete) return;
    upsert('habitAudits', { id: uid(), date: toDateKey(), ratings, focusId, note: note.trim(), createdAt: nowIso() });
    toast('已儲存這次的自我檢視');
    setRatings({});
    setFocusId('');
    setNote('');
  };
  const sum = (r: Record<string, number>) => weakeningHabits.reduce((s, h) => s + (r[h.id] ?? 0), 0);
  const audits = [...data.habitAudits].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <section aria-labelledby="audit-h">
      <h2 id="audit-h" className="text-xl font-bold">本週自我檢視</h2>
      <p className="mt-1 text-sm text-muted">誠實就好，沒有標準答案。分數只是幫助你看見模式，不是評分你這個人。</p>
      <form onSubmit={save} className="mt-4 space-y-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        {weakeningHabits.map((h, i) => (
          <fieldset key={h.id} className="border-b border-line pb-3 last:border-0">
            <legend className="text-sm font-medium">{i + 1}. {h.title}：這週出現的頻率？</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {auditScale.map((s) => (
                <button key={s.v} type="button" aria-pressed={ratings[h.id] === s.v} onClick={() => setRatings((r) => ({ ...r, [h.id]: s.v }))}
                  className={ratings[h.id] === s.v ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}>
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
        <div>
          <label htmlFor="audit-focus" className="field-label">這週想先調整哪一個？（只選一個就好）</label>
          <select id="audit-focus" className="field" value={focusId} onChange={(e) => setFocusId(e.target.value)}>
            <option value="">暫時不選</option>
            {weakeningHabits.map((h) => <option key={h.id} value={h.id}>{h.title}</option>)}
          </select>
        </div>
        <TextArea label="備註（選填）：我注意到了什麼？" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        <button className="btn-primary" type="submit" disabled={!complete}>儲存自我檢視</button>
        {!complete && <p className="text-xs text-muted">請為每個習慣選擇一個頻率（已選 {Object.keys(ratings).length}/{weakeningHabits.length}）。</p>}
      </form>

      {audits.length > 0 && (
        <ul className="mt-4 space-y-3">
          {audits.map((a) => (
            <li key={a.id} className="rounded-2xl border border-line bg-surface p-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="font-medium">{formatDate(a.date)} · 合計 {sum(a.ratings)}/{max}</p>
                  {a.focusId && weakeningMap[a.focusId] && <p className="mt-1">本週專注：<Link className="text-accent underline" to={`/habits#h-${a.focusId}`}>{weakeningMap[a.focusId].title}</Link></p>}
                  {a.note && <p className="mt-1 text-muted">{a.note}</p>}
                </div>
                <button className="icon-btn" aria-label={`刪除 ${a.date} 的自我檢視`} onClick={async () => { if (await confirm({ title: '刪除這次自我檢視？', confirmText: '刪除', danger: true })) { remove('habitAudits', a.id); toast('已刪除'); } }}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {weakeningHabits.map((h) => (
                  <li key={h.id} className="flex items-center gap-2 text-xs">
                    <span className="w-36 shrink-0 truncate">{h.title}</span>
                    <span className="h-1.5 flex-1 rounded-full bg-soft" aria-hidden>
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${((a.ratings[h.id] ?? 0) / 3) * 100}%` }} />
                    </span>
                    <span className="w-14 text-right text-muted">{auditScale[a.ratings[h.id] ?? 0]?.label}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** 反向選擇紀錄 */
function ChoicesSection() {
  const { data, remove } = useStore();
  const toast = useToast();
  const confirm = useConfirm();
  const [habitId, setHabitId] = useState(weakeningHabits[0].id);
  const stats = counterChoiceStats(data);
  const list = [...data.counterChoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <section aria-labelledby="choices-h">
      <h2 id="choices-h" className="text-xl font-bold">我的反向選擇</h2>
      <p className="mt-1 text-sm text-muted">每一個自律的選擇，都在練習一條新的小徑。這裡只記錄你實際做到的事。</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {(Object.keys(choiceMeta) as ChoiceKind[]).map((k) => (
          <div key={k} className="rounded-2xl bg-soft/60 p-3 text-center">
            <p className="text-xs text-muted">選{k}</p>
            <p className="font-display text-2xl font-bold">{stats.byKind[k]}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 rounded-2xl border border-line bg-surface p-4">
        <label htmlFor="choice-habit" className="field-label">針對哪一個習慣？</label>
        <select id="choice-habit" className="field" value={habitId} onChange={(e) => setHabitId(e.target.value)}>
          {weakeningHabits.map((h) => <option key={h.id} value={h.id}>{h.title}（{choiceMeta[h.kind].slogan}）</option>)}
        </select>
        <ChoiceForm habit={weakeningMap[habitId]} />
      </div>
      {list.length === 0 ? (
        <div className="mt-4"><EmptyState title="還沒有反向選擇紀錄" desc="今天做到一個小小的反向選擇了嗎？記下來，讓努力被看見。" /></div>
      ) : (
        <ul className="mt-4 space-y-2">
          {list.slice(0, 30).map((c) => {
            const h = weakeningMap[c.habitId];
            return (
              <li key={c.id} className="flex items-start gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                <div className="flex-1">
                  <p>{c.choice}</p>
                  <p className="text-xs text-muted">{formatDate(c.date)}{h && ` · ${h.title} · 選${h.kind}`}</p>
                </div>
                <button className="icon-btn h-8 w-8" aria-label="刪除這個選擇紀錄" onClick={async () => { if (await confirm({ title: '刪除這筆紀錄？', confirmText: '刪除', danger: true })) { remove('counterChoices', c.id); toast('已刪除'); } }}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** 原文結尾：三個選擇 */
export function ClosingManifesto() {
  return (
    <section aria-label="三個選擇" className="rounded-3xl bg-forest px-6 py-8 text-[#FAF8F4] sm:px-10">
      <div className="space-y-1 font-serif text-lg leading-relaxed">
        {WEAKENING_CLOSING.lines.map((l) => <p key={l}>{l}</p>)}
      </div>
      <div className="mt-5 space-y-0.5 text-[#E8CCB2]">
        {WEAKENING_CLOSING.respect.map((l) => <p key={l} className="font-serif text-xl font-bold">{l}</p>)}
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {WEAKENING_CLOSING.choices.map((c, i) => (
          <li key={c} className="rounded-2xl bg-white/10 p-4">
            <p className="font-serif text-lg font-bold">{c}</p>
            <p className="mt-1 text-xs text-[#E9EEE7]">{Object.values(choiceMeta)[i].desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Habits() {
  return (
    <div className="space-y-10 motion-safe:animate-fade-up">
      <SectionTitle
        eyebrow="Habit Check-up"
        title={WEAKENING_TITLE}
        desc={<>{WEAKENING_INTRO.map((l) => <span key={l} className="block">{l}</span>)}</>}
      />
      <Card className="bg-soft/50">
        <p className="text-sm leading-relaxed">{WEAKENING_SCIENCE_NOTE}</p>
        <p className="mt-2 text-xs text-muted">以下每一項的引文是觀點分享，「科學視角」則整理相關研究與限制，幫助你區分哪些有證據支持、哪些是簡化的說法。</p>
      </Card>

      <section aria-labelledby="list-h">
        <h2 id="list-h" className="mb-4 text-xl font-bold">{weakeningHabits.length} 個值得留意的習慣</h2>
        <div className="space-y-4">
          {weakeningHabits.map((h, i) => <HabitCard key={h.id} h={h} index={i} />)}
        </div>
      </section>

      <ClosingManifesto />
      <AuditSection />
      <ChoicesSection />
    </div>
  );
}
