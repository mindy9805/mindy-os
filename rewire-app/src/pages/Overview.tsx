/** 首頁 Overview：品牌主視覺、核心理念、Daily Rewire、學習路徑、章節卡片與進度 */
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, CalendarCheck, NotebookPen, CheckCircle2 } from 'lucide-react';
import { chapters } from '../content/chapters';
import { useStore } from '../store/AppStore';
import { chapterStats, challengeStats, dailyStats } from '../lib/stats';
import DailyRewireSection from '../components/daily/DailyRewireSection';
import { ProgressBar } from '../components/ui/basics';

const paths = [
  { to: '/learn', icon: BookOpen, title: '深度導讀', desc: '九個章節，從神經元到行為設計。' },
  { to: '/lab', icon: FlaskConical, title: '知識實驗室', desc: '模擬器、濾鏡實驗與七個實踐工具。' },
  { to: '/challenge', icon: CalendarCheck, title: '14 天練習', desc: '每天一個小行動，不強迫連續。' },
  { to: '/journal', icon: NotebookPen, title: '反思日誌', desc: '寫下感受，看見自己的變化。' },
];

export default function Overview() {
  const { data } = useStore();
  const cs = chapterStats(data);
  const ch = challengeStats(data);
  const ds = dailyStats(data);
  const lastVisited = chapters
    .map((c) => ({ c, t: data.chapters[c.id]?.lastVisitedAt }))
    .filter((x) => x.t)
    .sort((a, b) => b.t!.localeCompare(a.t!))[0]?.c;

  return (
    <div className="space-y-14 motion-safe:animate-fade-up">
      {/* 主視覺 */}
      <section className="relative overflow-hidden rounded-3xl bg-forest px-6 py-12 text-[#FAF8F4] sm:px-10 sm:py-16">
        <svg aria-hidden className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {[[80, 300], [220, 180], [380, 250], [520, 120], [680, 200], [740, 60], [300, 60]].map(([x, y], i, arr) => (
            <g key={i}>
              {i > 0 && <line x1={arr[i - 1][0]} y1={arr[i - 1][1]} x2={x} y2={y} stroke="#A8BBA3" strokeWidth="1.5" />}
              <circle cx={x} cy={y} r={i % 2 ? 5 : 8} fill={i % 2 ? '#E8CCB2' : '#A8BBA3'} className="motion-safe:animate-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
            </g>
          ))}
        </svg>
        <div className="relative max-w-2xl">
          <p className="font-display text-sm italic tracking-wider text-[#E8CCB2]">Rewire · Neuroplasticity Learning Lab</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl">Rewire｜重塑大腦的可能</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#E9EEE7]">理解神經可塑性，重新練習思考、情緒與行為。</p>
          <blockquote className="mt-6 border-l-2 border-[#E8CCB2] pl-4 font-serif leading-relaxed text-[#FAF8F4]/90">
            過去反覆練習的模式，塑造了今天的自動反應；今天開始建立的新經驗，也能逐漸影響未來的自己。
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={lastVisited ? `/learn/${lastVisited.id}` : '/learn/ch1'} className="btn bg-[#FAF8F4] text-[#36594B] hover:bg-[#E9EEE7]">
              {lastVisited ? `繼續閱讀：第 ${lastVisited.number} 章` : '從第 1 章開始'} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/daily/read" className="btn border border-[#FAF8F4]/50 text-[#FAF8F4] hover:bg-white/10">開始今日心智練習</Link>
          </div>
        </div>
      </section>

      {/* 學習進度（只顯示真實資料） */}
      <section aria-labelledby="progress-h" className="grid gap-4 rounded-3xl border border-line bg-surface p-5 sm:grid-cols-3 sm:p-6">
        <h2 id="progress-h" className="sr-only">我的學習進度</h2>
        <ProgressBar label="章節完成" value={cs.completed} max={cs.total} />
        <ProgressBar label="14 天挑戰" value={ch.done} max={ch.total} />
        <div className="text-sm">
          <p className="text-xs text-muted">Daily Rewire</p>
          <p className="mt-1">{ds.totalDays ? <>累計 <strong>{ds.totalDays}</strong> 天完成練習</> : '還沒有練習紀錄，今天試試看？'}</p>
        </div>
      </section>

      <DailyRewireSection />

      {/* 學習路徑 */}
      <section aria-labelledby="paths-h">
        <h2 id="paths-h" className="text-2xl font-bold">四種學習方式</h2>
        <p className="mt-1 text-muted">結合互動電子書、視覺化學習、個人反思與行為練習。</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map(({ to, icon: Icon, title, desc }) => (
            <Link key={to} to={to} className="card-hover rounded-2xl border border-line bg-surface p-5">
              <Icon className="h-6 w-6 text-accent" aria-hidden />
              <p className="mt-3 font-serif text-lg font-bold">{title}</p>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 章節卡片 */}
      <section aria-labelledby="chapters-h">
        <h2 id="chapters-h" className="text-2xl font-bold">九個章節</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chapters.map((c) => (
            <Link key={c.id} to={`/learn/${c.id}`} className="card-hover group relative rounded-2xl border border-line bg-surface p-5">
              <span className="font-display text-3xl italic text-sage">{String(c.number).padStart(2, '0')}</span>
              {data.chapters[c.id]?.completed && <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-accent" aria-label="已完成" />}
              <p className="mt-2 font-serif text-lg font-bold leading-snug">{c.title}</p>
              <p className="mt-1 text-sm text-muted">{c.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="rounded-2xl bg-soft/60 p-4 text-xs leading-relaxed text-muted">
        本站以 Nicole Vignola《Rewire》為學習主軸，所有內容為重新組織的原創解說，並對照原始研究標示證據與限制。本站練習適用於自我覺察與一般生活調適，不能取代專業心理或醫療協助；如有需要，請撥打 1925 安心專線（24 小時）。
      </p>
    </div>
  );
}
