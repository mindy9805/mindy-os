/** 首次使用的本地儲存提示，以及儲存失敗警告 */
import { Link } from 'react-router-dom';
import { HardDrive, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/AppStore';

export default function StorageNotice() {
  const { data, update, storageError } = useStore();
  if (storageError) {
    return (
      <div role="alert" className="mb-5 flex gap-3 rounded-2xl border border-[#9B3D35]/40 bg-[#9B3D35]/10 p-4 text-sm">
        <AlertTriangle className="h-5 w-5 shrink-0 text-[#9B3D35]" aria-hidden />
        <p>目前無法寫入瀏覽器儲存空間（可能是無痕模式或儲存空間已滿），新的紀錄在關閉頁面後可能遺失。建議先到「<Link className="underline" to="/data">資料與隱私</Link>」匯出備份。</p>
      </div>
    );
  }
  if (data.settings.storageNoticeDismissed) return null;
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-line bg-soft/60 p-4 text-sm sm:flex-row sm:items-center">
      <HardDrive className="h-5 w-5 shrink-0 text-accent" aria-hidden />
      <p className="flex-1 leading-relaxed">
        你的筆記、情緒紀錄與練習內容<strong>只會儲存在這台裝置的瀏覽器</strong>，不會傳送到任何伺服器。清除網站資料、更換裝置或使用無痕模式，都可能讓紀錄遺失，建議定期到「<Link className="underline" to="/data">資料與隱私</Link>」匯出備份。
      </p>
      <button className="btn-secondary btn-sm self-start sm:self-center" onClick={() => update((p) => ({ ...p, settings: { ...p.settings, storageNoticeDismissed: true } }))}>
        我知道了
      </button>
    </div>
  );
}
