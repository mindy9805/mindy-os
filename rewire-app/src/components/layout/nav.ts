/** 主要頁面導覽設定（側邊欄、手機抽屜與底部導覽共用） */
import { BookOpen, FlaskConical, CalendarCheck, NotebookPen, LayoutDashboard, Library, Home, Sparkles, Database, ShieldCheck, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  en: string;
  icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  { to: '/', label: '首頁', en: 'Overview', icon: Home },
  { to: '/daily', label: '每日心智練習', en: 'Daily Rewire', icon: Sparkles },
  { to: '/learn', label: '深度導讀', en: 'Learn', icon: BookOpen },
  { to: '/lab', label: '知識實驗室', en: 'Brain Lab', icon: FlaskConical },
  { to: '/challenge', label: '14 天練習', en: 'Challenge', icon: CalendarCheck },
  { to: '/pattern', label: '打破慣性', en: 'Break the Pattern', icon: ShieldCheck },
  { to: '/journal', label: '反思日誌', en: 'Journal', icon: NotebookPen },
  { to: '/dashboard', label: '學習儀表板', en: 'Dashboard', icon: LayoutDashboard },
  { to: '/references', label: '研究來源', en: 'References', icon: Library },
  { to: '/data', label: '資料與隱私', en: 'Data', icon: Database },
];

/** 手機底部導覽：最常用的五項 */
export const bottomNav: NavItem[] = [mainNav[0], mainNav[2], mainNav[3], mainNav[4], mainNav[6]];
