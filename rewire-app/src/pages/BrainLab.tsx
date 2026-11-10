/** 互動式知識實驗室：集中所有模擬器與七大工具，可用 /lab/:toolId 深層連結 */
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SectionTitle } from '../components/ui/basics';
import InteractiveBlock, { INTERACTIVE_META } from '../components/interactive/InteractiveBlock';
import ToolCards, { TOOLS } from '../components/tools/ToolCards';
import { chapters } from '../content/chapters';
import type { InteractiveKind } from '../types';

const LABS: InteractiveKind[] = ['neural-path', 'cognitive-filter', 'identity-rewriter', 'self-talk', 'habit-detective', 'habit-curve', 'if-then', 'evidence'];

export default function BrainLab() {
  const { toolId } = useParams();
  const lab = LABS.find((l) => l === toolId);
  const tool = TOOLS.find((t) => t.id === toolId);

  if (lab) {
    const ch = chapters.find((c) => c.interactive === lab);
    return (
      <div className="motion-safe:animate-fade-up">
        <Link to="/lab" className="btn-ghost btn-sm mb-4"><ArrowLeft className="h-4 w-4" aria-hidden />回到實驗室</Link>
        <SectionTitle eyebrow="Brain Lab" title={INTERACTIVE_META[lab].title} desc={<>{INTERACTIVE_META[lab].desc}{ch && <> 延伸閱讀：<Link className="text-accent underline" to={`/learn/${ch.id}`}>第 {ch.number} 章 {ch.title}</Link></>}</>} />
        <InteractiveBlock kind={lab} />
      </div>
    );
  }

  return (
    <div className="motion-safe:animate-fade-up">
      <SectionTitle eyebrow="Brain Lab" title="互動式知識實驗室" desc="把章節裡的概念變成可以動手操作的實驗與練習。所有紀錄只儲存在你的瀏覽器中。" />
      <h2 className="mb-3 text-xl font-bold">概念模擬與練習</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {LABS.map((l) => {
          const ch = chapters.find((c) => c.interactive === l);
          return (
            <Link key={l} to={`/lab/${l}`} className="card-hover rounded-2xl border border-line bg-surface p-5">
              {ch && <span className="chip">第 {ch.number} 章</span>}
              <p className="mt-2 font-serif text-lg font-bold">{INTERACTIVE_META[l].title}</p>
              <p className="mt-1 text-sm text-muted">{INTERACTIVE_META[l].desc}</p>
            </Link>
          );
        })}
      </div>
      <Link to="/habits" className="card-hover mt-3 block rounded-2xl border border-accent/40 bg-soft/50 p-5">
        <span className="chip">選自律・選進步・選自由</span>
        <p className="mt-2 font-serif text-lg font-bold">削弱習慣自我檢視</p>
        <p className="mt-1 text-sm text-muted">檢視不知不覺中削弱紀律與信心的習慣，並記錄每一個反向選擇。</p>
      </Link>
      <h2 className="mb-3 mt-12 text-xl font-bold">七個神經可塑性實踐工具</h2>
      <ToolCards initial={tool?.id} />
    </div>
  );
}
