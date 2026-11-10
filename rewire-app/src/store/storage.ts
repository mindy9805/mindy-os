/**
 * LocalStorage 資料層
 * - 所有個人資料存於單一鍵 STORAGE_KEY，並帶有 version 以便未來升級資料格式。
 * - 讀取時一律經過 normalize()：缺少的欄位自動補上預設值、型別不符的欄位會被捨棄，
 *   避免舊資料或手動修改造成網站當機。
 * - 匯入備份時使用 validateBackup()，格式錯誤會回傳清楚的中文錯誤訊息。
 */
import type { AppData, ChapterId, CollectionKey, PatternChallengeState, PatternHabitId, Settings } from '../types';

export const STORAGE_KEY = 'rewire:v1';

export const CHAPTER_IDS: ChapterId[] = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'ch9'];

export const COLLECTION_KEYS: CollectionKey[] = [
  'notes',
  'journal',
  'habitLogs',
  'emotionLogs',
  'sleepLogs',
  'plans',
  'rehearsals',
  'smallSteps',
  'sessions',
  'identityRewrites',
  'selfTalk',
  'dailyLogs',
  'habitAudits',
  'counterChoices',
  'patternAssessments',
  'patternEntries',
  'microCommitments',
  'commitmentLogs',
  'workshops',
];

export const PATTERN_IDS: PatternHabitId[] = ['approval', 'convenience', 'impress', 'solitude', 'promises', 'environment', 'shortterm'];

export const emptyPatternChallenge = (): PatternChallengeState => ({ activeHabitId: '', status: 'none', level: 'standard', progress: {} });

export const defaultSettings: Settings = {
  theme: 'system',
  fontScale: 'md',
  rightPanelOpen: true,
  storageNoticeDismissed: false,
};

/** 建立一份全新的空白資料（不含任何假資料） */
export function createEmptyData(): AppData {
  return {
    version: 1,
    settings: { ...defaultSettings },
    chapters: {},
    quizzes: {},
    notes: [],
    journal: [],
    habitLogs: [],
    emotionLogs: [],
    sleepLogs: [],
    plans: [],
    rehearsals: [],
    smallSteps: [],
    sessions: [],
    identityRewrites: [],
    selfTalk: [],
    challenge: {},
    dailyLogs: [],
    dailyFavorites: [],
    habitAudits: [],
    counterChoices: [],
    patternFocus: [],
    patternAssessments: [],
    patternEntries: [],
    microCommitments: [],
    commitmentLogs: [],
    workshops: [],
    patternChallenge: emptyPatternChallenge(),
    neuralReps: 0,
  };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** 陣列中只保留「物件且有字串 id」的項目 */
function cleanArray(v: unknown): Record<string, unknown>[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => isObj(x) && typeof x.id === 'string') as Record<string, unknown>[];
}

/** 將任意輸入整理成合法的 AppData（容錯讀取） */
export function normalize(input: unknown): AppData {
  const base = createEmptyData();
  if (!isObj(input)) return base;

  const s = isObj(input.settings) ? input.settings : {};
  base.settings = {
    theme: s.theme === 'light' || s.theme === 'dark' || s.theme === 'system' ? s.theme : defaultSettings.theme,
    fontScale: ['sm', 'md', 'lg', 'xl'].includes(s.fontScale as string)
      ? (s.fontScale as Settings['fontScale'])
      : defaultSettings.fontScale,
    rightPanelOpen: typeof s.rightPanelOpen === 'boolean' ? s.rightPanelOpen : true,
    storageNoticeDismissed: s.storageNoticeDismissed === true,
  };

  if (isObj(input.chapters)) {
    for (const id of CHAPTER_IDS) {
      const c = input.chapters[id];
      if (isObj(c)) base.chapters[id] = { ...c, completed: c.completed === true } as AppData['chapters'][ChapterId];
    }
  }
  if (isObj(input.quizzes)) {
    for (const id of CHAPTER_IDS) {
      const q = input.quizzes[id];
      if (isObj(q) && typeof q.score === 'number' && typeof q.total === 'number' && isObj(q.answers)) {
        base.quizzes[id] = q as unknown as AppData['quizzes'][ChapterId];
      }
    }
  }
  for (const key of COLLECTION_KEYS) {
    (base as unknown as Record<string, unknown>)[key] = cleanArray(input[key]);
  }
  // 標籤欄位一律確保為字串陣列
  base.notes = base.notes.map((n) => ({ ...n, tags: Array.isArray(n.tags) ? n.tags.filter((t) => typeof t === 'string') : [] }));
  base.habitAudits = base.habitAudits.map((a) => ({ ...a, ratings: isObj(a.ratings) ? a.ratings : {}, focusId: typeof a.focusId === 'string' ? a.focusId : '' }));
  base.dailyLogs = base.dailyLogs.map((l) => ({ ...l, practiceId: Number.isInteger(l.practiceId) && l.practiceId! >= 0 && l.practiceId! <= 7 ? l.practiceId : 0 }));
  base.journal = base.journal.map((n) => ({ ...n, tags: Array.isArray(n.tags) ? n.tags.filter((t) => typeof t === 'string') : [] }));

  if (isObj(input.challenge)) {
    for (const [k, v] of Object.entries(input.challenge)) {
      const day = Number(k);
      if (Number.isInteger(day) && day >= 1 && day <= 14 && isObj(v)) {
        base.challenge[k] = {
          completed: v.completed === true,
          completedAt: typeof v.completedAt === 'string' ? v.completedAt : undefined,
          note: typeof v.note === 'string' ? v.note : '',
          affirmationReflection: typeof v.affirmationReflection === 'string' ? v.affirmationReflection : '',
          microActionDone: v.microActionDone === true,
          feeling: typeof v.feeling === 'string' ? v.feeling : '',
          updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : undefined,
        };
      }
    }
  }
  if (Array.isArray(input.dailyFavorites)) {
    base.dailyFavorites = [...new Set(input.dailyFavorites.filter((n) => Number.isInteger(n) && n >= 1 && n <= 7))] as number[];
  }
  // Break the Pattern：焦點習慣與 14 天打破慣性挑戰
  if (Array.isArray(input.patternFocus)) {
    base.patternFocus = [...new Set(input.patternFocus.filter((x): x is PatternHabitId => PATTERN_IDS.includes(x as PatternHabitId)))].slice(0, 3);
  }
  base.patternEntries = base.patternEntries.filter((e) => ['validation', 'comfort', 'spending', 'quiet', 'environment', 'choice'].includes((e as { kind?: string }).kind ?? ''));
  if (isObj(input.patternChallenge)) {
    const pc = input.patternChallenge;
    const progress: PatternChallengeState['progress'] = {};
    if (isObj(pc.progress)) {
      for (const id of PATTERN_IDS) {
        const days = pc.progress[id];
        if (!isObj(days)) continue;
        const clean: Record<string, NonNullable<PatternChallengeState['progress'][PatternHabitId]>[string]> = {};
        for (const [k, v] of Object.entries(days)) {
          const n = Number(k);
          if (!Number.isInteger(n) || n < 1 || n > 14 || !isObj(v)) continue;
          clean[k] = {
            completed: v.completed === true,
            completedAt: typeof v.completedAt === 'string' ? v.completedAt : undefined,
            note: typeof v.note === 'string' ? v.note : '',
            reflection: typeof v.reflection === 'string' ? v.reflection : '',
            oldPattern: ['none', 'once', 'many'].includes(v.oldPattern as string) ? (v.oldPattern as 'none' | 'once' | 'many') : '',
            usedAlternative: v.usedAlternative === true,
            updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : undefined,
          };
        }
        progress[id] = clean;
      }
    }
    base.patternChallenge = {
      activeHabitId: PATTERN_IDS.includes(pc.activeHabitId as PatternHabitId) ? (pc.activeHabitId as PatternHabitId) : '',
      status: pc.status === 'active' || pc.status === 'paused' ? pc.status : 'none',
      level: pc.level === 'gentle' ? 'gentle' : 'standard',
      progress,
    };
  }
  if (typeof input.neuralReps === 'number' && input.neuralReps >= 0) base.neuralReps = Math.floor(input.neuralReps);
  return base;
}

/** 從 LocalStorage 讀取；無資料或無法讀取時回傳空白資料 */
export function loadData(storage: Pick<Storage, 'getItem'> | undefined = safeStorage()): AppData {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    return raw ? normalize(JSON.parse(raw)) : createEmptyData();
  } catch {
    return createEmptyData();
  }
}

/** 寫入 LocalStorage；失敗（例如容量已滿或無痕模式限制）時回傳 false */
export function saveData(data: AppData, storage: Pick<Storage, 'setItem'> | undefined = safeStorage()): boolean {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(data));
    return !!storage;
  } catch {
    return false;
  }
}

function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : undefined;
  } catch {
    return undefined;
  }
}

/** 匯出備份檔的外層格式 */
export interface BackupFile {
  app: 'rewire';
  exportedAt: string;
  data: AppData;
}

export function createBackup(data: AppData): BackupFile {
  return { app: 'rewire', exportedAt: new Date().toISOString(), data };
}

export type ValidationResult = { ok: true; data: AppData; summary: string } | { ok: false; error: string };

/**
 * 驗證匯入的備份 JSON。
 * 規則：必須是本網站匯出的格式（app: 'rewire'、data.version === 1），且主要集合必須是陣列。
 */
export function validateBackup(text: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: '檔案不是有效的 JSON 格式，請確認選擇的是 Rewire 匯出的備份檔。' };
  }
  if (!isObj(parsed) || parsed.app !== 'rewire' || !isObj(parsed.data)) {
    return { ok: false, error: '找不到 Rewire 備份標記（app: "rewire"），這可能不是本網站的備份檔。' };
  }
  const d = parsed.data;
  if (d.version !== 1) {
    return { ok: false, error: `不支援的資料版本：${String(d.version)}。目前僅支援版本 1。` };
  }
  for (const key of COLLECTION_KEYS) {
    if (d[key] !== undefined && !Array.isArray(d[key])) {
      return { ok: false, error: `欄位「${key}」格式錯誤（應為清單）。` };
    }
  }
  const data = normalize(d);
  const count = COLLECTION_KEYS.reduce((sum, k) => sum + (data[k] as unknown[]).length, 0);
  const done = Object.values(data.challenge).filter((c) => c.completed).length;
  return { ok: true, data, summary: `共 ${count} 筆紀錄、14 天挑戰完成 ${done} 天。` };
}
