/**
 * 本地持久化层。
 *
 * 设计要点：
 * 1. 版本化：所有数据带 `version`，`migrate()` 负责把任意历史形状收敛到当前 schema。
 * 2. 容错：任何字段都可能缺失或类型错误，一律补默认值而不是抛错；未知字段直接丢弃。
 * 3. 可降级：无 `localStorage`（node 测试、隐私模式）时自动退化为内存实现，接口行为一致。
 * 4. 可导出导入：`exportJSON` / `importJSON` 带 meta 头，便于跨设备迁移与备份。
 *
 * 该文件不依赖任何 React / DOM API，可被纯函数测试直接调用。
 */

import type {
  AppData,
  DictionarySense,
  Level,
  MasteryStatus,
  QuizAttempt,
  ReadingProgress,
  ReviewGrade,
  ReviewLog,
  SrsState,
  UserSettings,
  VocabularyEntry,
  VocabularyOccurrence,
} from '../data/types';

/* ------------------------------------------------------------------ */
/* 常量                                                                */
/* ------------------------------------------------------------------ */

export const DATA_KEY = 'english-lab:data';
export const SETTINGS_KEY = 'english-lab:settings';
export const CURRENT_VERSION = 1;

/** 导出文件的标识，导入时用于识别来源 */
const APP_ID = 'english-lab';

/** 浏览器 localStorage 的常见容量上限（5MB），用于计算使用率 */
const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  readingTheme: 'paper',
  fontScale: 1,
  lineHeight: 1.8,
  readingFont: 'serif',
  showVocabMarks: true,
  markStyle: 'underline',
  translationMode: 'tap',
  focusMode: false,
  speechRate: 1,
  speechVoice: 'us',
  autoAddOnClick: true,
  dailyGoal: 2,
  onlineDictionary: false,
};

const THEMES = ['light', 'dark', 'system'] as const;
const READING_THEMES = ['paper', 'plain', 'sepia', 'night'] as const;
const READING_FONTS = ['serif', 'sans'] as const;
const MARK_STYLES = ['underline', 'highlight', 'dot'] as const;
const TRANSLATION_MODES = ['hidden', 'tap', 'always'] as const;
const SPEECH_VOICES = ['uk', 'us'] as const;
const MASTERY_STATUSES: readonly MasteryStatus[] = ['new', 'learning', 'reviewing', 'mastered'];
const REVIEW_GRADES: readonly ReviewGrade[] = ['again', 'hard', 'good', 'easy'];

/* ------------------------------------------------------------------ */
/* 基础类型守卫与取值工具                                               */
/* ------------------------------------------------------------------ */

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asInt(value: unknown, fallback: number, min = 0): number {
  const rounded = Math.round(asNumber(value, fallback));
  return rounded < min ? min : rounded;
}

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/** 字符串数组：丢弃非字符串与空串，按首次出现顺序去重 */
function uniqueStrings(value: unknown): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of asArray(value)) {
    if (typeof item !== 'string') continue;
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

function numberRecord(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (typeof raw === 'number' && Number.isFinite(raw)) out[key] = raw;
  }
  return out;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/* ------------------------------------------------------------------ */
/* 各子结构校验                                                        */
/* ------------------------------------------------------------------ */

function sanitizeSrs(value: unknown): SrsState {
  const raw = isRecord(value) ? value : {};
  return {
    reps: asInt(raw.reps, 0),
    streak: asInt(raw.streak, 0),
    ease: clamp(asNumber(raw.ease, 2.5), 1.3, 2.8),
    intervalDays: Math.max(0, asNumber(raw.intervalDays, 0)),
    lapses: asInt(raw.lapses, 0),
  };
}

function sanitizePhonetics(value: unknown): { uk?: string; us?: string } {
  const raw = isRecord(value) ? value : {};
  const out: { uk?: string; us?: string } = {};
  const uk = asString(raw.uk).trim();
  const us = asString(raw.us).trim();
  if (uk) out.uk = uk;
  if (us) out.us = us;
  return out;
}

function sanitizeSense(value: unknown): DictionarySense | null {
  if (!isRecord(value)) return null;
  const definition = asString(value.definition).trim();
  if (!definition) return null;
  const sense: DictionarySense = { pos: asString(value.pos).trim(), definition };
  const example = asString(value.example).trim();
  if (example) sense.example = example;
  const note = asString(value.note).trim();
  if (note) sense.note = note;
  return sense;
}

function sanitizeEntry(value: unknown, index: number): VocabularyEntry | null {
  if (!isRecord(value)) return null;
  const lemma = asString(value.lemma).trim().toLowerCase();
  if (!lemma) return null;

  const definitions = asArray(value.definitions)
    .map(sanitizeSense)
    .filter((sense): sense is DictionarySense => sense !== null);

  const entry: VocabularyEntry = {
    id: asNonEmptyString(value.id) ?? `v_recovered_${index}`,
    lemma,
    partOfSpeech: asString(value.partOfSpeech).trim(),
    phonetics: sanitizePhonetics(value.phonetics),
    definitions,
    masteryStatus: asEnum(value.masteryStatus, MASTERY_STATUSES, 'new'),
    createdAt: asNumber(value.createdAt, 0),
    updatedAt: asNumber(value.updatedAt, 0),
    srs: sanitizeSrs(value.srs),
  };

  const contextualMeaning = asString(value.contextualMeaning).trim();
  if (contextualMeaning) entry.contextualMeaning = contextualMeaning;

  if (value.masteredBy === 'user' || value.masteredBy === 'srs') {
    entry.masteredBy = value.masteredBy;
  }

  const lastReviewedAt = optionalNumber(value.lastReviewedAt);
  if (lastReviewedAt !== undefined) entry.lastReviewedAt = lastReviewedAt;
  const nextReviewAt = optionalNumber(value.nextReviewAt);
  if (nextReviewAt !== undefined) entry.nextReviewAt = nextReviewAt;
  if (value.pendingGloss === true) entry.pendingGloss = true;

  return entry;
}

function sanitizeOccurrence(value: unknown, index: number): VocabularyOccurrence | null {
  if (!isRecord(value)) return null;
  const vocabularyEntryId = asNonEmptyString(value.vocabularyEntryId);
  const articleId = asNonEmptyString(value.articleId);
  if (!vocabularyEntryId || !articleId) return null;

  const occurrence: VocabularyOccurrence = {
    id: asNonEmptyString(value.id) ?? `o_recovered_${index}`,
    vocabularyEntryId,
    articleId,
    articleTitle: asString(value.articleTitle),
    surfaceForm: asString(value.surfaceForm),
    sentence: asString(value.sentence),
    encounteredAt: asNumber(value.encounteredAt, 0),
  };
  const contextualMeaning = asString(value.contextualMeaning).trim();
  if (contextualMeaning) occurrence.contextualMeaning = contextualMeaning;
  return occurrence;
}

function sanitizeReview(value: unknown, index: number): ReviewLog | null {
  if (!isRecord(value)) return null;
  const vocabularyEntryId = asNonEmptyString(value.vocabularyEntryId);
  if (!vocabularyEntryId) return null;
  return {
    id: asNonEmptyString(value.id) ?? `r_recovered_${index}`,
    vocabularyEntryId,
    lemma: asString(value.lemma).trim().toLowerCase(),
    grade: asEnum(value.grade, REVIEW_GRADES, 'good'),
    prevIntervalDays: Math.max(0, asNumber(value.prevIntervalDays, 0)),
    nextIntervalDays: Math.max(0, asNumber(value.nextIntervalDays, 0)),
    reviewedAt: asNumber(value.reviewedAt, 0),
  };
}

function sanitizeLevel(value: unknown): Level {
  const level = asNumber(value, 1);
  return level === 1 || level === 2 || level === 3 || level === 4 ? level : 1;
}

function sanitizeAttempt(value: unknown, index: number): QuizAttempt | null {
  if (!isRecord(value)) return null;
  const articleId = asNonEmptyString(value.articleId);
  if (!articleId) return null;
  return {
    id: asNonEmptyString(value.id) ?? `q_recovered_${index}`,
    articleId,
    articleTitle: asString(value.articleTitle),
    level: sanitizeLevel(value.level),
    answers: numberRecord(value.answers),
    correctCount: asInt(value.correctCount, 0),
    total: asInt(value.total, 0),
    wrongByType: numberRecord(value.wrongByType),
    submittedAt: asNumber(value.submittedAt, 0),
  };
}

function sanitizeProgress(value: unknown): ReadingProgress | null {
  if (!isRecord(value)) return null;
  const articleId = asNonEmptyString(value.articleId);
  if (!articleId) return null;
  const progress: ReadingProgress = {
    articleId,
    sentenceIndex: asInt(value.sentenceIndex, 0),
    ratio: clamp(asNumber(value.ratio, 0), 0, 1),
    wordsRead: asInt(value.wordsRead, 0),
    startedAt: asNumber(value.startedAt, 0),
    updatedAt: asNumber(value.updatedAt, 0),
  };
  const completedAt = optionalNumber(value.completedAt);
  if (completedAt !== undefined) progress.completedAt = completedAt;
  return progress;
}

function sanitizeProgressMap(value: unknown): Record<string, ReadingProgress> {
  if (!isRecord(value)) return {};
  const out: Record<string, ReadingProgress> = {};
  for (const item of Object.values(value)) {
    const progress = sanitizeProgress(item);
    if (progress) out[progress.articleId] = progress;
  }
  return out;
}

function sanitizeSettings(value: unknown): UserSettings {
  const raw = isRecord(value) ? value : {};
  return {
    theme: asEnum(raw.theme, THEMES, DEFAULT_SETTINGS.theme),
    readingTheme: asEnum(raw.readingTheme, READING_THEMES, DEFAULT_SETTINGS.readingTheme),
    fontScale: clamp(asNumber(raw.fontScale, DEFAULT_SETTINGS.fontScale), 0.75, 2),
    lineHeight: clamp(asNumber(raw.lineHeight, DEFAULT_SETTINGS.lineHeight), 1.2, 2.6),
    readingFont: asEnum(raw.readingFont, READING_FONTS, DEFAULT_SETTINGS.readingFont),
    showVocabMarks: asBool(raw.showVocabMarks, DEFAULT_SETTINGS.showVocabMarks),
    markStyle: asEnum(raw.markStyle, MARK_STYLES, DEFAULT_SETTINGS.markStyle),
    translationMode: asEnum(raw.translationMode, TRANSLATION_MODES, DEFAULT_SETTINGS.translationMode),
    focusMode: asBool(raw.focusMode, DEFAULT_SETTINGS.focusMode),
    speechRate: clamp(asNumber(raw.speechRate, DEFAULT_SETTINGS.speechRate), 0.5, 2),
    speechVoice: asEnum(raw.speechVoice, SPEECH_VOICES, DEFAULT_SETTINGS.speechVoice),
    autoAddOnClick: asBool(raw.autoAddOnClick, DEFAULT_SETTINGS.autoAddOnClick),
    dailyGoal: clamp(asInt(raw.dailyGoal, DEFAULT_SETTINGS.dailyGoal), 0, 500),
    onlineDictionary: asBool(raw.onlineDictionary, DEFAULT_SETTINGS.onlineDictionary),
  };
}

/* ------------------------------------------------------------------ */
/* 空数据 / 迁移                                                       */
/* ------------------------------------------------------------------ */

export function createEmptyData(): AppData {
  return {
    version: CURRENT_VERSION,
    vocabEntries: [],
    occurrences: [],
    reviews: [],
    quizAttempts: [],
    progress: {},
    favorites: [],
    recent: [],
    settings: { ...DEFAULT_SETTINGS },
    activeDays: [],
  };
}

/**
 * 把任意来源的数据（localStorage 原文、导入文件、旧版本结构）收敛成当前 schema。
 * 永远返回一个完整可用的 AppData，不抛错。
 */
export function migrate(raw: unknown): AppData {
  const empty = createEmptyData();
  if (!isRecord(raw)) return empty;

  // 版本高于当前时仍然尽力读取（只保留本版本认识的字段），随后归一为 CURRENT_VERSION。
  const vocabEntries: VocabularyEntry[] = [];
  const seenEntryIds = new Set<string>();
  asArray(raw.vocabEntries).forEach((item, index) => {
    const entry = sanitizeEntry(item, index);
    if (!entry || seenEntryIds.has(entry.id)) return;
    seenEntryIds.add(entry.id);
    vocabEntries.push(entry);
  });

  const occurrences: VocabularyOccurrence[] = [];
  const seenOccurrenceIds = new Set<string>();
  asArray(raw.occurrences).forEach((item, index) => {
    const occurrence = sanitizeOccurrence(item, index);
    if (!occurrence || seenOccurrenceIds.has(occurrence.id)) return;
    seenOccurrenceIds.add(occurrence.id);
    occurrences.push(occurrence);
  });

  const reviews: ReviewLog[] = [];
  const seenReviewIds = new Set<string>();
  asArray(raw.reviews).forEach((item, index) => {
    const review = sanitizeReview(item, index);
    if (!review || seenReviewIds.has(review.id)) return;
    seenReviewIds.add(review.id);
    reviews.push(review);
  });

  const quizAttempts: QuizAttempt[] = [];
  const seenAttemptIds = new Set<string>();
  asArray(raw.quizAttempts).forEach((item, index) => {
    const attempt = sanitizeAttempt(item, index);
    if (!attempt || seenAttemptIds.has(attempt.id)) return;
    seenAttemptIds.add(attempt.id);
    quizAttempts.push(attempt);
  });

  return {
    version: CURRENT_VERSION,
    vocabEntries,
    occurrences,
    reviews,
    quizAttempts,
    progress: sanitizeProgressMap(raw.progress),
    favorites: uniqueStrings(raw.favorites),
    recent: uniqueStrings(raw.recent),
    settings: sanitizeSettings(raw.settings),
    activeDays: uniqueStrings(raw.activeDays),
  };
}

/* ------------------------------------------------------------------ */
/* Storage 适配（localStorage → 内存降级）                              */
/* ------------------------------------------------------------------ */

class MemoryStorage implements Storage {
  private readonly map = new Map<string, string>();

  get length(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
  }

  getItem(key: string): string | null {
    const value = this.map.get(key);
    return value === undefined ? null : value;
  }

  key(index: number): string | null {
    const keys = Array.from(this.map.keys());
    return index >= 0 && index < keys.length ? keys[index] : null;
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }

  setItem(key: string, value: string): void {
    this.map.set(key, String(value));
  }
}

let memoryStore: MemoryStorage | null = null;
let overrideActive = false;
let overrideStorage: Storage | null = null;
let detectedStorage: Storage | null | undefined;

function getMemoryStore(): MemoryStorage {
  if (!memoryStore) memoryStore = new MemoryStorage();
  return memoryStore;
}

function detectStorage(): Storage | null {
  try {
    const candidate = (globalThis as { localStorage?: Storage }).localStorage;
    if (!candidate) return null;
    // 隐私模式下 setItem 会抛错，用探针确认可用性
    const probeKey = '__english_lab_probe__';
    candidate.setItem(probeKey, '1');
    candidate.removeItem(probeKey);
    return candidate;
  } catch {
    return null;
  }
}

function getStore(): Storage {
  if (overrideActive) return overrideStorage ?? getMemoryStore();
  if (detectedStorage === undefined) detectedStorage = detectStorage();
  return detectedStorage ?? getMemoryStore();
}

/** 测试注入：传入 null 表示“模拟无 localStorage”，并清空内存态以得到干净环境。 */
export function __setStorageForTests(storage: Storage | null): void {
  overrideActive = true;
  overrideStorage = storage;
  detectedStorage = undefined;
  getMemoryStore().clear();
}

/* ------------------------------------------------------------------ */
/* 读写                                                                */
/* ------------------------------------------------------------------ */

export function loadData(): AppData {
  try {
    const raw = getStore().getItem(DATA_KEY);
    if (!raw) return createEmptyData();
    return migrate(JSON.parse(raw) as unknown);
  } catch {
    return createEmptyData();
  }
}

export function saveData(data: AppData): boolean {
  try {
    getStore().setItem(DATA_KEY, JSON.stringify(data));
    return true;
  } catch {
    // QuotaExceededError / 循环引用 / 存储被禁用
    return false;
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = getStore().getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return sanitizeSettings(JSON.parse(raw) as unknown);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: UserSettings): boolean {
  try {
    getStore().setItem(SETTINGS_KEY, JSON.stringify(sanitizeSettings(settings)));
    return true;
  } catch {
    return false;
  }
}

export function clearAll(): void {
  try {
    getStore().removeItem(DATA_KEY);
  } catch {
    /* 忽略：存储不可用时无需清理 */
  }
  try {
    getStore().removeItem(SETTINGS_KEY);
  } catch {
    /* 同上 */
  }
}

function byteLength(text: string | null): number {
  if (!text) return 0;
  let bytes = 0;
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 0x80) bytes += 1;
    else if (code < 0x800) bytes += 2;
    else if (code < 0x10000) bytes += 3;
    else bytes += 4;
  }
  return bytes;
}

export function storageUsage(): { bytes: number; limitBytes: number; ratio: number } {
  let bytes = 0;
  try {
    const store = getStore();
    bytes += byteLength(store.getItem(DATA_KEY));
    bytes += byteLength(store.getItem(SETTINGS_KEY));
  } catch {
    /* 存储不可读时按 0 计 */
  }
  const ratio = STORAGE_LIMIT_BYTES > 0 ? Math.min(1, bytes / STORAGE_LIMIT_BYTES) : 0;
  return { bytes, limitBytes: STORAGE_LIMIT_BYTES, ratio };
}

/* ------------------------------------------------------------------ */
/* 导入导出                                                            */
/* ------------------------------------------------------------------ */

export function exportJSON(data: AppData): string {
  const payload = {
    meta: {
      app: APP_ID,
      exportedAt: new Date().toISOString(),
      version: CURRENT_VERSION,
    },
    data: migrate(data),
  };
  return JSON.stringify(payload, null, 2);
}

const APP_DATA_KEYS = [
  'vocabEntries',
  'occurrences',
  'reviews',
  'quizAttempts',
  'progress',
  'favorites',
  'recent',
  'activeDays',
  'settings',
] as const;

function looksLikeAppData(value: UnknownRecord): boolean {
  if (typeof value.version === 'number') return true;
  return APP_DATA_KEYS.some((key) => key in value);
}

export function importJSON(text: string): { ok: true; data: AppData } | { ok: false; error: string } {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return { ok: false, error: '导入内容为空' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `JSON 解析失败：${detail}` };
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: 'JSON 根节点必须是对象' };
  }

  if (isRecord(parsed.meta) && typeof parsed.meta.app === 'string' && parsed.meta.app !== APP_ID) {
    return { ok: false, error: `不是 English Lab 的备份文件（app=${parsed.meta.app}）` };
  }

  const source = isRecord(parsed.data) ? parsed.data : parsed;
  if (!looksLikeAppData(source)) {
    return { ok: false, error: '缺少学习数据字段，无法识别为有效备份' };
  }

  return { ok: true, data: migrate(source) };
}
