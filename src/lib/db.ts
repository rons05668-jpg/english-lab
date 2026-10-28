/**
 * 数据仓库层：对 AppData 的全部变更操作。
 *
 * 约束（会被测试逐条校验）：
 * - 纯函数：返回全新对象，绝不修改入参；无副作用、无 I/O。
 * - 幂等：同一输入重复调用不会产生重复数据。
 * - 安全：对 undefined / 空数组 / 不存在的 id 一律返回原 data 或合理默认，不抛错。
 * - 不含 SRS 算法：复习间隔由调用方计算后传入，本层只负责落库。
 */

import type {
  AppData,
  DictionarySense,
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
/* 常量与工具                                                          */
/* ------------------------------------------------------------------ */

/** 新词条的初始 SM-2 状态，须与 srs.initialSrs 保持一致 */
export const NEW_SRS: SrsState = Object.freeze({
  reps: 0,
  streak: 0,
  ease: 2.5,
  intervalDays: 0,
  lapses: 0,
});

/** 默认“最近阅读”保留条数 */
const DEFAULT_RECENT_LIMIT = 10;

let idCounter = 0;

/** 生成稳定唯一的 id：`${prefix}_${时间戳36进制}_${自增+随机}` */
export function makeId(prefix: string): string {
  idCounter = (idCounter + 1) % 1_679_616; // 36^4，保证自增段不会过长
  const stamp = Date.now().toString(36);
  const seq = idCounter.toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${stamp}_${seq}${rand}`;
}

function arr<T>(value: readonly T[] | undefined | null): readonly T[] {
  return Array.isArray(value) ? value : [];
}

function normalizeLemma(value: string | undefined | null): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

/** 句子归一化：折叠空白并去首尾空格，用于上下文去重键 */
function normalizeSentence(value: string | undefined | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function withoutKey<T extends object, K extends keyof T>(target: T, key: K): T {
  const copy = { ...target };
  delete copy[key];
  return copy;
}

function replaceEntry(list: readonly VocabularyEntry[], next: VocabularyEntry): VocabularyEntry[] {
  return list.map((item) => (item.id === next.id ? next : item));
}

/* ------------------------------------------------------------------ */
/* 入参 / 出参类型                                                     */
/* ------------------------------------------------------------------ */

export interface AddWordInput {
  surface: string;
  lemma: string;
  pos: string;
  phonetics: { uk?: string; us?: string };
  definitions: DictionarySense[];
  contextualMeaning?: string;
  pendingGloss?: boolean;
  sentence: string;
  articleId: string;
  articleTitle: string;
  now: number;
}

export interface AddWordResult {
  data: AppData;
  entry: VocabularyEntry;
  /** 是否新建了词条（同一 lemma 复用则为 false） */
  created: boolean;
  /** 是否新增了上下文记录（同词条+同文章+同句视为重复） */
  occurrenceAdded: boolean;
}

/* ------------------------------------------------------------------ */
/* 词汇：新增                                                          */
/* ------------------------------------------------------------------ */

/** 上下文记录去重键：(词条, 文章, 归一化句子) */
function occurrenceKey(entryId: string, articleId: string, sentence: string): string {
  return `${entryId}\u0000${articleId}\u0000${normalizeSentence(sentence)}`;
}

function buildPhonetics(
  prev: { uk?: string; us?: string } | undefined,
  next: { uk?: string; us?: string } | undefined,
): { uk?: string; us?: string } {
  const out: { uk?: string; us?: string } = {};
  const uk = prev?.uk ?? next?.uk;
  const us = prev?.us ?? next?.us;
  if (uk) out.uk = uk;
  if (us) out.us = us;
  return out;
}

/**
 * 添加单词（幂等）。
 *
 * 1. 按 lemma 复用已有词条，不新建；
 * 2. 上下文记录按 (entryId, articleId, 归一化句子) 去重；
 * 3. 同词条同文章不同句子允许新增；
 * 4. 仅在原词条无释义 / 待补释义时才用新数据补全，避免低质量数据覆盖高质量数据。
 */
export function addWord(data: AppData, input: AddWordInput): AddWordResult {
  const lemma = normalizeLemma(input.lemma) || normalizeLemma(input.surface);
  const now = typeof input.now === 'number' && Number.isFinite(input.now) ? input.now : Date.now();
  const definitions = Array.isArray(input.definitions) ? input.definitions.slice() : [];
  const incomingMeaning = typeof input.contextualMeaning === 'string' ? input.contextualMeaning.trim() : '';

  const existing = findEntryByLemma(data, lemma);
  const created = existing === undefined;

  let entry: VocabularyEntry;
  let entryChanged = false;

  if (existing) {
    entry = existing;
    const needsGloss = entry.definitions.length === 0 || entry.pendingGloss === true;
    if (needsGloss && definitions.length > 0) {
      entry = {
        ...entry,
        definitions,
        partOfSpeech: entry.partOfSpeech || input.pos,
      };
      entry = withoutKey(entry, 'pendingGloss');
      entryChanged = true;
    }

    if (incomingMeaning && !entry.contextualMeaning) {
      entry = { ...entry, contextualMeaning: incomingMeaning };
      entryChanged = true;
    }

    const mergedPhonetics = buildPhonetics(entry.phonetics, input.phonetics);
    if (mergedPhonetics.uk !== entry.phonetics.uk || mergedPhonetics.us !== entry.phonetics.us) {
      entry = { ...entry, phonetics: mergedPhonetics };
      entryChanged = true;
    }
  } else {
    const nextEntry: VocabularyEntry = {
      id: makeId('v'),
      lemma,
      partOfSpeech: typeof input.pos === 'string' ? input.pos : '',
      phonetics: buildPhonetics(undefined, input.phonetics),
      definitions,
      masteryStatus: 'new',
      createdAt: now,
      updatedAt: now,
      srs: { ...NEW_SRS },
    };
    if (incomingMeaning) nextEntry.contextualMeaning = incomingMeaning;
    const pending = input.pendingGloss ?? definitions.length === 0;
    if (pending) nextEntry.pendingGloss = true;
    entry = nextEntry;
  }

  // 上下文记录去重
  const key = occurrenceKey(entry.id, input.articleId, input.sentence);
  const occurrenceAdded = !arr(data.occurrences).some(
    (item) => occurrenceKey(item.vocabularyEntryId, item.articleId, item.sentence) === key,
  );

  let occurrences: VocabularyOccurrence[] = arr(data.occurrences).slice();
  if (occurrenceAdded) {
    const occurrence: VocabularyOccurrence = {
      id: makeId('o'),
      vocabularyEntryId: entry.id,
      articleId: input.articleId,
      articleTitle: input.articleTitle,
      surfaceForm: input.surface,
      sentence: input.sentence,
      encounteredAt: now,
    };
    if (incomingMeaning) occurrence.contextualMeaning = incomingMeaning;
    occurrences = [...occurrences, occurrence];
  }

  if (entryChanged) {
    entry = { ...entry, updatedAt: now };
  }

  const vocabEntries = created ? [...arr(data.vocabEntries), entry] : replaceEntry(arr(data.vocabEntries), entry);

  const nextData: AppData = { ...data, vocabEntries, occurrences };
  return { data: nextData, entry, created, occurrenceAdded };
}

/* ------------------------------------------------------------------ */
/* 词汇：修改                                                          */
/* ------------------------------------------------------------------ */

export function updateEntry(
  data: AppData,
  entryId: string,
  patch: Partial<VocabularyEntry>,
  now: number,
): AppData {
  const list = arr(data.vocabEntries);
  const prev = list.find((item) => item.id === entryId);
  if (!prev) return data;

  const safePatch: Partial<VocabularyEntry> = { ...patch };
  delete safePatch.id;
  delete safePatch.createdAt;
  if (typeof safePatch.lemma === 'string') {
    const lemma = normalizeLemma(safePatch.lemma);
    if (lemma) safePatch.lemma = lemma;
    else delete safePatch.lemma;
  }

  const next: VocabularyEntry = {
    ...prev,
    ...safePatch,
    id: prev.id,
    createdAt: prev.createdAt,
    updatedAt: typeof now === 'number' && Number.isFinite(now) ? now : prev.updatedAt,
  };

  return { ...data, vocabEntries: replaceEntry(list, next) };
}

export function markMastered(data: AppData, entryId: string, by: 'user' | 'srs', now: number): AppData {
  const prev = arr(data.vocabEntries).find((item) => item.id === entryId);
  if (!prev) return data;
  const next: VocabularyEntry = {
    ...prev,
    masteryStatus: 'mastered',
    masteredBy: by,
    updatedAt: now,
  };
  return { ...data, vocabEntries: replaceEntry(arr(data.vocabEntries), next) };
}

/** 取消掌握：清掉 masteredBy 并立即回到复习队列 */
export function unmarkMastered(data: AppData, entryId: string, now: number): AppData {
  const prev = arr(data.vocabEntries).find((item) => item.id === entryId);
  if (!prev) return data;

  let next: VocabularyEntry = {
    ...prev,
    masteryStatus: 'learning',
    nextReviewAt: now,
    updatedAt: now,
  };
  next = withoutKey(next, 'masteredBy');

  return { ...data, vocabEntries: replaceEntry(arr(data.vocabEntries), next) };
}

/** 删除词条，并级联清理其上下文记录与复习日志 */
export function deleteEntry(data: AppData, entryId: string): AppData {
  return {
    ...data,
    vocabEntries: arr(data.vocabEntries).filter((item) => item.id !== entryId),
    occurrences: arr(data.occurrences).filter((item) => item.vocabularyEntryId !== entryId),
    reviews: arr(data.reviews).filter((item) => item.vocabularyEntryId !== entryId),
  };
}

/* ------------------------------------------------------------------ */
/* 复习与测验                                                          */
/* ------------------------------------------------------------------ */

export function recordReview(
  data: AppData,
  params: {
    entryId: string;
    lemma: string;
    grade: ReviewGrade;
    prevIntervalDays: number;
    nextIntervalDays: number;
    masteryStatus: MasteryStatus;
    masteredBy?: 'srs';
    nextReviewAt: number;
    now: number;
  },
): AppData {
  const list = arr(data.vocabEntries);
  const prev = list.find((item) => item.id === params.entryId);
  if (!prev) return data;

  const log: ReviewLog = {
    id: makeId('r'),
    vocabularyEntryId: prev.id,
    lemma: normalizeLemma(params.lemma) || prev.lemma,
    grade: params.grade,
    prevIntervalDays: Math.max(0, params.prevIntervalDays),
    nextIntervalDays: Math.max(0, params.nextIntervalDays),
    reviewedAt: params.now,
  };

  let next: VocabularyEntry = {
    ...prev,
    masteryStatus: params.masteryStatus,
    lastReviewedAt: params.now,
    nextReviewAt: params.nextReviewAt,
    updatedAt: params.now,
    srs: { ...prev.srs, intervalDays: Math.max(0, params.nextIntervalDays) },
  };
  if (params.masteredBy) next.masteredBy = params.masteredBy;

  return {
    ...data,
    vocabEntries: replaceEntry(list, next),
    reviews: [...arr(data.reviews), log],
  };
}

export function recordQuizAttempt(data: AppData, attempt: QuizAttempt): AppData {
  if (!attempt || typeof attempt.articleId !== 'string') return data;
  return { ...data, quizAttempts: [...arr(data.quizAttempts), attempt] };
}

/* ------------------------------------------------------------------ */
/* 阅读进度 / 收藏 / 最近                                              */
/* ------------------------------------------------------------------ */

export function saveProgress(data: AppData, progress: ReadingProgress): AppData {
  if (!progress || typeof progress.articleId !== 'string' || !progress.articleId) return data;

  const prev = data.progress ? data.progress[progress.articleId] : undefined;
  const merged: ReadingProgress = {
    ...progress,
    // 首次开始时间只保留更早的那个，避免回退覆盖
    startedAt: prev ? Math.min(prev.startedAt, progress.startedAt) : progress.startedAt,
    completedAt: progress.completedAt ?? prev?.completedAt,
  };

  return {
    ...data,
    progress: { ...(data.progress ?? {}), [progress.articleId]: merged },
  };
}

export function markCompleted(data: AppData, articleId: string, wordsRead: number, now: number): AppData {
  if (typeof articleId !== 'string' || !articleId) return data;

  const map = data.progress ?? {};
  const prev = map[articleId];
  const base: ReadingProgress = prev ?? {
    articleId,
    sentenceIndex: 0,
    ratio: 0,
    wordsRead: 0,
    startedAt: now,
    updatedAt: now,
  };

  const merged: ReadingProgress = {
    ...base,
    wordsRead: Math.max(base.wordsRead, Number.isFinite(wordsRead) ? wordsRead : 0),
    ratio: 1,
    completedAt: now,
    updatedAt: now,
  };

  return { ...data, progress: { ...map, [articleId]: merged } };
}

export function toggleFavorite(data: AppData, articleId: string): AppData {
  if (typeof articleId !== 'string' || !articleId) return data;
  const favorites = arr(data.favorites);
  const exists = favorites.includes(articleId);
  return {
    ...data,
    favorites: exists ? favorites.filter((id) => id !== articleId) : [articleId, ...favorites],
  };
}

export function pushRecent(data: AppData, articleId: string, limit = DEFAULT_RECENT_LIMIT): AppData {
  if (typeof articleId !== 'string' || !articleId) return data;
  const max = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : DEFAULT_RECENT_LIMIT;
  if (max === 0) return { ...data, recent: [] };

  const deduped = arr(data.recent).filter((id) => id !== articleId);
  return { ...data, recent: [articleId, ...deduped].slice(0, max) };
}

/** 记录活跃日（形如 '2026-10-28'），已存在则不重复写入 */
export function recordActiveDay(data: AppData, day: string): AppData {
  if (typeof day !== 'string') return data;
  const value = day.trim();
  if (!value) return data;
  const days = arr(data.activeDays);
  if (days.includes(value)) return data;
  return { ...data, activeDays: [...days, value] };
}

export function updateSettings(data: AppData, patch: Partial<UserSettings>): AppData {
  const base: UserSettings = data.settings ?? ({} as UserSettings);
  const clean: Partial<UserSettings> = {};
  for (const [key, value] of Object.entries(patch ?? {})) {
    if (value !== undefined) {
      (clean as Record<string, unknown>)[key] = value;
    }
  }
  return { ...data, settings: { ...base, ...clean } };
}

/* ------------------------------------------------------------------ */
/* 查询                                                                */
/* ------------------------------------------------------------------ */

export function findEntryByLemma(data: AppData, lemma: string): VocabularyEntry | undefined {
  const target = normalizeLemma(lemma);
  if (!target) return undefined;
  return arr(data.vocabEntries).find((item) => normalizeLemma(item.lemma) === target);
}

export function occurrencesOf(data: AppData, entryId: string): VocabularyOccurrence[] {
  if (!entryId) return [];
  return arr(data.occurrences).filter((item) => item.vocabularyEntryId === entryId);
}

export function reviewsOf(data: AppData, entryId: string): ReviewLog[] {
  if (!entryId) return [];
  return arr(data.reviews).filter((item) => item.vocabularyEntryId === entryId);
}
