/**
 * 全站共用型別定義
 * - 「內容型別」：章節、測驗、研究來源等靜態學習內容（存放於 src/content）。
 * - 「使用者資料型別」：所有存在 LocalStorage 的個人紀錄（由 src/store 管理）。
 */

/* ========== 內容型別 ========== */

/** 章節編號 */
export type ChapterId = 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | 'ch6' | 'ch7' | 'ch8' | 'ch9';

/** 章節內嵌的互動元件種類（對應 components/interactive 與 tools） */
export type InteractiveKind =
  | 'neural-path'
  | 'cognitive-filter'
  | 'identity-rewriter'
  | 'self-talk'
  | 'habit-detective'
  | 'habit-curve'
  | 'tools'
  | 'if-then'
  | 'evidence';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  /** 正確選項索引（從 0 開始） */
  answer: number;
  /** 作答後顯示的解析 */
  explanation: string;
}

export interface ChapterSection {
  id: string;
  heading: string;
  paragraphs: string[];
  /** 選填：額外提醒或比喻框 */
  callout?: { label: string; text: string };
}

export interface Chapter {
  id: ChapterId;
  number: number;
  title: string;
  enTitle: string;
  subtitle: string;
  /** 預估閱讀分鐘數 */
  minutes: number;
  objectives: string[];
  coreConcepts: { term: string; definition: string }[];
  sections: ChapterSection[];
  cases: { title: string; story: string; insight: string }[];
  /** 示意圖說明文字（圖本身由 diagrams 元件繪製） */
  diagramCaption: string;
  applications: string[];
  reflection: string;
  quiz: QuizQuestion[];
  summary: string[];
  referenceIds: string[];
  interactive: InteractiveKind;
  /** 對應的每日心智語句編號（1–7） */
  affirmationIds: number[];
}

export interface Reference {
  id: string;
  authors: string;
  year: string;
  title: string;
  source: string;
  doi?: string;
  url?: string;
  /** 資料是否已核對（無法完整確認者標示「待查證」） */
  verified: boolean;
  note?: string;
  /** 若有科學證據檢視卡內容 */
  evidence?: EvidenceCard;
}

export interface EvidenceCard {
  topic: string;
  design: string;
  findings: string;
  sampleLimits: string;
  reasonable: string;
  oversimplified: string;
}

export interface Affirmation {
  id: number;
  theme: string;
  text: string;
  meaning: string;
  reflection: string;
  action: string;
  note?: string;
  /** 對應學習主題說明 */
  topics: string;
  chapterIds: ChapterId[];
}

export interface ChallengeDay {
  day: number;
  theme: string;
  knowledge: string;
  action: string;
  reflection: string;
  affirmationId: number;
  /** 相關章節，提供「延伸閱讀」入口 */
  chapterId: ChapterId;
}

/* ========== 使用者資料型別 ========== */

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontScale = 'sm' | 'md' | 'lg' | 'xl';

export interface Settings {
  theme: ThemeMode;
  fontScale: FontScale;
  rightPanelOpen: boolean;
  /** 是否已關閉首次本地儲存提示 */
  storageNoticeDismissed: boolean;
}

export interface ChapterProgress {
  completed: boolean;
  completedAt?: string;
  lastVisitedAt?: string;
}

export interface QuizResult {
  answers: Record<string, number>;
  score: number;
  total: number;
  submittedAt: string;
}

/** 章節筆記：收藏重點或個人反思 */
export interface Note {
  id: string;
  chapterId: ChapterId | 'general';
  kind: 'highlight' | 'reflection';
  /** 收藏重點的來源段落標題 */
  source?: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  /** 情緒分數 1（很低落）～5（很好） */
  mood: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  behavior: string;
  time: string;
  place: string;
  emotion: string;
  cue: string;
  need: string;
  reward: string;
  cost: string;
  alternative: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmotionLog {
  id: string;
  core: string;
  word: string;
  intensity: number; // 1–10
  note: string;
  createdAt: string;
}

export interface SleepLog {
  id: string;
  date: string;
  bedtime: string; // HH:mm
  waketime: string; // HH:mm
  hours: number;
  quality: number; // 1–5
  note: string;
  createdAt: string;
}

export interface IfThenPlan {
  id: string;
  goal: string;
  situation: string;
  action: string;
  obstacle: string;
  backup: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rehearsal {
  id: string;
  scenario: string;
  ideal: string;
  obstacles: string;
  strategy: string;
  firstAction: string;
  createdAt: string;
}

export interface SmallStepPlan {
  id: string;
  goal: string;
  steps: { id: string; text: string; done: boolean }[];
  createdAt: string;
}

export interface PracticeSession {
  id: string;
  tool: 'sigh';
  seconds: number;
  createdAt: string;
}

export interface IdentityRewrite {
  id: string;
  original: string;
  rewritten: string;
  createdAt: string;
}

export interface SelfTalkRecord {
  id: string;
  thought: string;
  absolutes: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balanced: string;
  nextStep: string;
  createdAt: string;
}

export interface ChallengeDayRecord {
  completed: boolean;
  completedAt?: string;
  note: string;
  /** 今日心智語句的反思（與 Daily Rewire 紀錄分開儲存） */
  affirmationReflection: string;
  microActionDone: boolean;
  feeling: string;
  updatedAt?: string;
}

/** 每日心智練習（Daily Rewire）一天一筆 */
export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  completedReading: boolean;
  /** 今天最有感觸的語句編號（1–7），0 代表尚未選擇 */
  favoriteId: number;
  why: string;
  action: string;
  mood: number; // 1–5，0 代表未填
  moodWords: string;
  createdAt: string;
  updatedAt: string;
}

/** 削弱習慣自我檢視：每次檢視的頻率評分（0 從不 ～ 3 幾乎每天） */
export interface HabitAudit {
  id: string;
  date: string; // YYYY-MM-DD
  ratings: Record<string, number>;
  focusId: string; // 本週想調整的習慣 id，'' 代表未選
  note: string;
  createdAt: string;
}

/** 反向選擇紀錄：一次「選自律、選進步、選自由」的具體小選擇 */
export interface CounterChoice {
  id: string;
  date: string; // YYYY-MM-DD
  habitId: string;
  choice: string;
  createdAt: string;
}

export interface AppData {
  version: 1;
  settings: Settings;
  chapters: Partial<Record<ChapterId, ChapterProgress>>;
  quizzes: Partial<Record<ChapterId, QuizResult>>;
  notes: Note[];
  journal: JournalEntry[];
  habitLogs: HabitLog[];
  emotionLogs: EmotionLog[];
  sleepLogs: SleepLog[];
  plans: IfThenPlan[];
  rehearsals: Rehearsal[];
  smallSteps: SmallStepPlan[];
  sessions: PracticeSession[];
  identityRewrites: IdentityRewrite[];
  selfTalk: SelfTalkRecord[];
  challenge: Record<string, ChallengeDayRecord>;
  dailyLogs: DailyLog[];
  dailyFavorites: number[];
  habitAudits: HabitAudit[];
  counterChoices: CounterChoice[];
  /** 神經道路模擬器累積次數（概念示意） */
  neuralReps: number;
}

/** 所有「陣列型」集合的鍵，供通用新增／更新／刪除使用 */
export type CollectionKey =
  | 'notes'
  | 'journal'
  | 'habitLogs'
  | 'emotionLogs'
  | 'sleepLogs'
  | 'plans'
  | 'rehearsals'
  | 'smallSteps'
  | 'sessions'
  | 'identityRewrites'
  | 'selfTalk'
  | 'dailyLogs'
  | 'habitAudits'
  | 'counterChoices';
