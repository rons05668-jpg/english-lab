import { beforeEach, describe, expect, it } from 'vitest';

import type { AppData, DictionarySense, ReadingProgress } from '../data/types';
import {
  CURRENT_VERSION,
  DATA_KEY,
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  __setStorageForTests,
  clearAll,
  createEmptyData,
  exportJSON,
  importJSON,
  loadData,
  loadSettings,
  migrate,
  saveData,
  saveSettings,
  storageUsage,
} from './storage';
import {
  NEW_SRS,
  addWord,
  deleteEntry,
  findEntryByLemma,
  makeId,
  markCompleted,
  markMastered,
  occurrencesOf,
  pushRecent,
  recordActiveDay,
  recordQuizAttempt,
  recordReview,
  reviewsOf,
  saveProgress,
  toggleFavorite,
  unmarkMastered,
  updateEntry,
  updateSettings,
  type AddWordInput,
} from './db';

/* ------------------------------------------------------------------ */
/* 测试工具                                                            */
/* ------------------------------------------------------------------ */

const SENSE: DictionarySense = { pos: 'v.', definition: '维持；保持' };

function makeInput(overrides: Partial<AddWordInput> = {}): AddWordInput {
  return {
    surface: 'maintained',
    lemma: 'maintain',
    pos: 'v.',
    phonetics: { uk: '/meɪnˈteɪn/', us: '/meɪnˈteɪn/' },
    definitions: [SENSE],
    contextualMeaning: '维持',
    sentence: 'She maintained a steady pace throughout the race.',
    articleId: 'a1',
    articleTitle: 'A Steady Pace',
    now: 1_700_000_000_000,
    ...overrides,
  };
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function snapshot(data: AppData): string {
  return JSON.stringify(data);
}

function makeFakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => {
      map.clear();
    },
    getItem: (key: string) => (map.has(key) ? (map.get(key) as string) : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  } as unknown as Storage;
}

const NOW = 1_700_000_000_000;

/* ------------------------------------------------------------------ */
/* storage: 空数据与默认设置                                            */
/* ------------------------------------------------------------------ */

describe('storage / createEmptyData', () => {
  it('返回结构完整的空数据', () => {
    const empty = createEmptyData();
    expect(empty.version).toBe(CURRENT_VERSION);
    expect(empty.vocabEntries).toEqual([]);
    expect(empty.occurrences).toEqual([]);
    expect(empty.reviews).toEqual([]);
    expect(empty.quizAttempts).toEqual([]);
    expect(empty.progress).toEqual({});
    expect(empty.favorites).toEqual([]);
    expect(empty.recent).toEqual([]);
    expect(empty.activeDays).toEqual([]);
    expect(empty.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('每次返回独立对象，避免共享引用', () => {
    const a = createEmptyData();
    const b = createEmptyData();
    a.favorites.push('x');
    expect(b.favorites).toEqual([]);
    expect(a.settings).not.toBe(b.settings);
  });

  it('DEFAULT_SETTINGS 字段齐全', () => {
    expect(Object.keys(DEFAULT_SETTINGS).sort()).toEqual(
      [
        'autoAddOnClick',
        'dailyGoal',
        'focusMode',
        'fontScale',
        'lineHeight',
        'markStyle',
        'onlineDictionary',
        'readingFont',
        'readingTheme',
        'showVocabMarks',
        'speechRate',
        'speechVoice',
        'theme',
        'translationMode',
      ].sort(),
    );
    expect(DEFAULT_SETTINGS.theme).toBe('system');
    expect(typeof DEFAULT_SETTINGS.dailyGoal).toBe('number');
  });
});

/* ------------------------------------------------------------------ */
/* storage: migrate 容错                                               */
/* ------------------------------------------------------------------ */

describe('storage / migrate', () => {
  it('null / undefined / 非对象 → 空数据', () => {
    expect(migrate(null)).toEqual(createEmptyData());
    expect(migrate(undefined)).toEqual(createEmptyData());
    expect(migrate(42)).toEqual(createEmptyData());
    expect(migrate('oops')).toEqual(createEmptyData());
  });

  it('{} → 补全所有字段', () => {
    const data = migrate({});
    expect(data.version).toBe(CURRENT_VERSION);
    expect(data.vocabEntries).toEqual([]);
    expect(data.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('数组字段类型错误 → 空数组', () => {
    const data = migrate({ vocabEntries: 'nope', occurrences: 1, favorites: {}, activeDays: null });
    expect(data.vocabEntries).toEqual([]);
    expect(data.occurrences).toEqual([]);
    expect(data.favorites).toEqual([]);
    expect(data.activeDays).toEqual([]);
  });

  it('数字字段 NaN / 字符串 → 默认值', () => {
    const data = migrate({
      vocabEntries: [
        {
          id: 'v1',
          lemma: 'Maintain',
          partOfSpeech: 'v.',
          definitions: [{ pos: 'v.', definition: '维持' }],
          createdAt: Number.NaN,
          updatedAt: 'yesterday',
          srs: { reps: 'x', streak: Number.NaN, ease: 99, intervalDays: -3, lapses: null },
        },
      ],
    });
    const entry = data.vocabEntries[0];
    expect(entry.lemma).toBe('maintain');
    expect(entry.createdAt).toBe(0);
    expect(entry.updatedAt).toBe(0);
    expect(entry.srs.reps).toBe(0);
    expect(entry.srs.streak).toBe(0);
    expect(entry.srs.ease).toBe(2.8);
    expect(entry.srs.intervalDays).toBe(0);
    expect(entry.srs.lapses).toBe(0);
    expect(entry.masteryStatus).toBe('new');
  });

  it('settings 缺字段 → 用 DEFAULT_SETTINGS 补齐', () => {
    const data = migrate({ settings: { theme: 'dark', dailyGoal: 25 } });
    expect(data.settings.theme).toBe('dark');
    expect(data.settings.dailyGoal).toBe(25);
    expect(data.settings.readingTheme).toBe(DEFAULT_SETTINGS.readingTheme);
    expect(data.settings.onlineDictionary).toBe(DEFAULT_SETTINGS.onlineDictionary);
  });

  it('settings 非法枚举值 → 回退默认', () => {
    const data = migrate({ settings: { theme: 'neon', markStyle: 'wave', speechVoice: 'au' } });
    expect(data.settings.theme).toBe(DEFAULT_SETTINGS.theme);
    expect(data.settings.markStyle).toBe(DEFAULT_SETTINGS.markStyle);
    expect(data.settings.speechVoice).toBe(DEFAULT_SETTINGS.speechVoice);
  });

  it('丢弃未知多余字段', () => {
    const data = migrate({ version: 1, hacker: true, vocabEntries: [], extra: { a: 1 } }) as AppData & {
      hacker?: boolean;
    };
    expect(data.hacker).toBeUndefined();
    expect('extra' in data).toBe(false);
  });

  it('版本号高于当前版本时仍尽力读取', () => {
    const data = migrate({
      version: 99,
      favorites: ['a1'],
      progress: { a1: { articleId: 'a1', sentenceIndex: 3, ratio: 0.5, wordsRead: 40, startedAt: 1, updatedAt: 2 } },
    });
    expect(data.version).toBe(CURRENT_VERSION);
    expect(data.favorites).toEqual(['a1']);
    expect(data.progress.a1.sentenceIndex).toBe(3);
  });

  it('词条缺 lemma 被丢弃，缺 id 自动补', () => {
    const data = migrate({
      vocabEntries: [{ lemma: '' }, { lemma: 'focus', definitions: [] }],
    });
    expect(data.vocabEntries).toHaveLength(1);
    expect(data.vocabEntries[0].lemma).toBe('focus');
    expect(data.vocabEntries[0].id.length).toBeGreaterThan(0);
  });

  it('favorites / recent 去重并丢弃非字符串', () => {
    const data = migrate({ favorites: ['a1', 'a1', 3, 'b2'], recent: ['x', null, 'x'] });
    expect(data.favorites).toEqual(['a1', 'b2']);
    expect(data.recent).toEqual(['x']);
  });
});

/* ------------------------------------------------------------------ */
/* storage: 导入导出                                                   */
/* ------------------------------------------------------------------ */

describe('storage / exportJSON & importJSON', () => {
  it('导出带 meta 头', () => {
    const parsed = JSON.parse(exportJSON(createEmptyData())) as {
      meta: { app: string; exportedAt: string; version: number };
      data: AppData;
    };
    expect(parsed.meta.app).toBe('english-lab');
    expect(parsed.meta.version).toBe(CURRENT_VERSION);
    expect(typeof parsed.meta.exportedAt).toBe('string');
    expect(parsed.data.version).toBe(CURRENT_VERSION);
  });

  it('导出 → 导入往返一致', () => {
    const data = addWord(createEmptyData(), makeInput()).data;
    const withProgress = saveProgress(data, {
      articleId: 'a1',
      sentenceIndex: 2,
      ratio: 0.4,
      wordsRead: 30,
      startedAt: NOW,
      updatedAt: NOW,
    });
    const text = exportJSON(withProgress);
    const result = importJSON(text);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.vocabEntries).toHaveLength(1);
    expect(result.data.vocabEntries[0].lemma).toBe('maintain');
    expect(result.data.occurrences).toHaveLength(1);
    expect(result.data.occurrences[0].sentence).toBe(makeInput().sentence);
    expect(result.data.progress.a1.wordsRead).toBe(30);
    expect(result.data).toEqual(migrate(withProgress));
  });

  it('非法 JSON → ok:false 且不抛错', () => {
    const result = importJSON('bad json');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.length).toBeGreaterThan(0);
  });

  it('空字符串与非对象根节点被拒绝', () => {
    expect(importJSON('   ').ok).toBe(false);
    expect(importJSON('[1,2,3]').ok).toBe(false);
    expect(importJSON('{}').ok).toBe(false);
  });

  it('其他 app 的备份被拒绝', () => {
    const result = importJSON(JSON.stringify({ meta: { app: 'other-app' }, data: { favorites: [] } }));
    expect(result.ok).toBe(false);
  });

  it('接受裸 AppData（无 meta 包裹）', () => {
    const result = importJSON(JSON.stringify({ version: 1, favorites: ['a9'] }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.favorites).toEqual(['a9']);
  });
});

/* ------------------------------------------------------------------ */
/* storage: 读写与降级                                                 */
/* ------------------------------------------------------------------ */

describe('storage / 读写', () => {
  beforeEach(() => {
    __setStorageForTests(null);
  });

  it('无 localStorage 时降级为内存实现，保存后可读回', () => {
    const data = addWord(createEmptyData(), makeInput()).data;
    expect(saveData(data)).toBe(true);
    expect(loadData().vocabEntries).toHaveLength(1);
    expect(loadData().vocabEntries[0].lemma).toBe('maintain');
  });

  it('未保存过时返回空数据', () => {
    expect(loadData()).toEqual(createEmptyData());
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('损坏的原始字符串 → 空数据，不抛错', () => {
    const fake = makeFakeStorage();
    fake.setItem(DATA_KEY, '{"vocabEntries": ');
    __setStorageForTests(fake);
    expect(loadData()).toEqual(createEmptyData());
  });

  it('写入失败（配额满）返回 false', () => {
    const broken = {
      ...makeFakeStorage(),
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    } as unknown as Storage;
    __setStorageForTests(broken);
    expect(saveData(createEmptyData())).toBe(false);
    expect(saveSettings(DEFAULT_SETTINGS)).toBe(false);
  });

  it('设置可单独存取并做校验', () => {
    expect(saveSettings({ ...DEFAULT_SETTINGS, theme: 'dark', dailyGoal: 20 })).toBe(true);
    const loaded = loadSettings();
    expect(loaded.theme).toBe('dark');
    expect(loaded.dailyGoal).toBe(20);
    expect(loaded.markStyle).toBe(DEFAULT_SETTINGS.markStyle);
  });

  it('clearAll 清空数据与设置', () => {
    saveData(addWord(createEmptyData(), makeInput()).data);
    saveSettings({ ...DEFAULT_SETTINGS, theme: 'dark' });
    clearAll();
    expect(loadData()).toEqual(createEmptyData());
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('storageUsage 反映写入字节数', () => {
    const before = storageUsage();
    expect(before.bytes).toBe(0);
    saveData(addWord(createEmptyData(), makeInput()).data);
    const after = storageUsage();
    expect(after.bytes).toBeGreaterThan(0);
    expect(after.limitBytes).toBeGreaterThan(after.bytes);
    expect(after.ratio).toBeGreaterThan(0);
    expect(after.ratio).toBeLessThanOrEqual(1);
  });

  it('SETTINGS_KEY 与 DATA_KEY 不互相覆盖', () => {
    saveSettings({ ...DEFAULT_SETTINGS, theme: 'dark' });
    saveData(createEmptyData());
    expect(loadSettings().theme).toBe('dark');
    expect(loadData().settings.theme).toBe(DEFAULT_SETTINGS.theme);
    expect(SETTINGS_KEY).not.toBe(DATA_KEY);
  });
});

/* ------------------------------------------------------------------ */
/* db: addWord 幂等与去重                                              */
/* ------------------------------------------------------------------ */

describe('db / addWord', () => {
  it('首次添加创建词条', () => {
    const empty = createEmptyData();
    const result = addWord(empty, makeInput());
    expect(result.created).toBe(true);
    expect(result.occurrenceAdded).toBe(true);
    expect(result.data.vocabEntries).toHaveLength(1);
    expect(result.data.occurrences).toHaveLength(1);
    expect(result.entry.lemma).toBe('maintain');
    expect(result.entry.masteryStatus).toBe('new');
    expect(result.entry.srs).toEqual(NEW_SRS);
    expect(result.entry.nextReviewAt).toBeUndefined();
    expect(result.entry.createdAt).toBe(NOW);
    expect(result.entry.updatedAt).toBe(NOW);
    expect(result.entry.id.startsWith('v_')).toBe(true);
    expect(result.data.occurrences[0].id.startsWith('o_')).toBe(true);
  });

  it('同一 lemma 再次添加复用词条', () => {
    const first = addWord(createEmptyData(), makeInput());
    const second = addWord(first.data, makeInput({ sentence: 'They maintain the garden every week.', surface: 'maintain' }));
    expect(second.created).toBe(false);
    expect(second.data.vocabEntries).toHaveLength(1);
    expect(second.entry.id).toBe(first.entry.id);
  });

  it('lemma 大小写与空格归一后视为同一词条', () => {
    const first = addWord(createEmptyData(), makeInput());
    const second = addWord(first.data, makeInput({ lemma: '  Maintain ', surface: 'MAINTAINED' }));
    expect(second.created).toBe(false);
    expect(second.data.vocabEntries).toHaveLength(1);
  });

  it('同文章同句重复添加不新增上下文', () => {
    const first = addWord(createEmptyData(), makeInput());
    const second = addWord(first.data, makeInput());
    expect(second.created).toBe(false);
    expect(second.occurrenceAdded).toBe(false);
    expect(second.data.occurrences).toHaveLength(1);
  });

  it('句子仅空白差异也视为重复', () => {
    const first = addWord(createEmptyData(), makeInput());
    const second = addWord(first.data, makeInput({ sentence: '  She maintained a steady   pace throughout the race. ' }));
    expect(second.occurrenceAdded).toBe(false);
    expect(second.data.occurrences).toHaveLength(1);
  });

  it('同文章不同句新增上下文', () => {
    const first = addWord(createEmptyData(), makeInput());
    const second = addWord(first.data, makeInput({ sentence: 'Good habits maintain momentum.' }));
    expect(second.created).toBe(false);
    expect(second.occurrenceAdded).toBe(true);
    expect(second.data.occurrences).toHaveLength(2);
    expect(occurrencesOf(second.data, first.entry.id)).toHaveLength(2);
  });

  it('同句不同文章也新增上下文', () => {
    const first = addWord(createEmptyData(), makeInput());
    const second = addWord(first.data, makeInput({ articleId: 'a2', articleTitle: 'Another' }));
    expect(second.occurrenceAdded).toBe(true);
    expect(second.data.occurrences).toHaveLength(2);
  });

  it('pendingGloss 词条被新释义补全', () => {
    const pending = addWord(
      createEmptyData(),
      makeInput({ definitions: [], contextualMeaning: undefined, pendingGloss: true }),
    );
    expect(pending.entry.definitions).toEqual([]);
    expect(pending.entry.pendingGloss).toBe(true);

    const filled = addWord(pending.data, makeInput());
    expect(filled.created).toBe(false);
    expect(filled.entry.definitions).toHaveLength(1);
    expect(filled.entry.definitions[0].definition).toBe('维持；保持');
    expect('pendingGloss' in filled.entry).toBe(false);
    expect(filled.entry.updatedAt).toBe(NOW);
  });

  it('已有高质量释义不被低质量数据覆盖', () => {
    const first = addWord(createEmptyData(), makeInput());
    const second = addWord(first.data, makeInput({ definitions: [{ pos: 'v.', definition: '?' }] }));
    expect(second.entry.definitions).toHaveLength(1);
    expect(second.entry.definitions[0].definition).toBe('维持；保持');
  });

  it('空 definitions 的新词条标记 pendingGloss', () => {
    const result = addWord(createEmptyData(), makeInput({ definitions: [] }));
    expect(result.entry.pendingGloss).toBe(true);
  });

  it('addWord 不修改入参', () => {
    const data = deepFreeze(addWord(createEmptyData(), makeInput()).data);
    const before = snapshot(data);
    addWord(data, makeInput({ sentence: 'A brand new sentence appears here.' }));
    expect(snapshot(data)).toBe(before);
    expect(data.occurrences).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------ */
/* db: 词条修改与级联删除                                              */
/* ------------------------------------------------------------------ */

describe('db / 词条修改', () => {
  function seed(): { data: AppData; entryId: string } {
    const first = addWord(createEmptyData(), makeInput());
    const withTwo = addWord(first.data, makeInput({ sentence: 'Consistent effort maintains progress.' })).data;
    const reviewed = recordReview(withTwo, {
      entryId: first.entry.id,
      lemma: 'maintain',
      grade: 'good',
      prevIntervalDays: 0,
      nextIntervalDays: 2,
      masteryStatus: 'learning',
      nextReviewAt: NOW + 86_400_000,
      now: NOW,
    });
    return { data: reviewed, entryId: first.entry.id };
  }

  it('updateEntry 修改字段并刷新 updatedAt', () => {
    const { data, entryId } = seed();
    const next = updateEntry(data, entryId, { contextualMeaning: '保持（节奏）' }, NOW + 1000);
    const entry = next.vocabEntries[0];
    expect(entry.contextualMeaning).toBe('保持（节奏）');
    expect(entry.updatedAt).toBe(NOW + 1000);
    expect(entry.createdAt).toBe(NOW);
  });

  it('updateEntry 不存在的 id 返回原 data', () => {
    const { data } = seed();
    expect(updateEntry(data, 'missing', { contextualMeaning: 'x' }, NOW)).toBe(data);
  });

  it('updateEntry 不允许篡改 id 与 createdAt', () => {
    const { data, entryId } = seed();
    const next = updateEntry(data, entryId, { id: 'hacked', createdAt: 1 }, NOW + 5);
    expect(next.vocabEntries[0].id).toBe(entryId);
    expect(next.vocabEntries[0].createdAt).toBe(NOW);
  });

  it('markMastered 记录来源为 user', () => {
    const { data, entryId } = seed();
    const next = markMastered(data, entryId, 'user', NOW + 10);
    const entry = next.vocabEntries[0];
    expect(entry.masteryStatus).toBe('mastered');
    expect(entry.masteredBy).toBe('user');
  });

  it('unmarkMastered 清空 masteredBy 并重新安排复习', () => {
    const { data, entryId } = seed();
    const mastered = markMastered(data, entryId, 'srs', NOW + 10);
    const back = unmarkMastered(mastered, entryId, NOW + 20);
    const entry = back.vocabEntries[0];
    expect(entry.masteryStatus).toBe('learning');
    expect('masteredBy' in entry).toBe(false);
    expect(entry.nextReviewAt).toBe(NOW + 20);
  });

  it('deleteEntry 级联删除 occurrences 与 reviews', () => {
    const { data, entryId } = seed();
    expect(occurrencesOf(data, entryId)).toHaveLength(2);
    expect(reviewsOf(data, entryId)).toHaveLength(1);

    const next = deleteEntry(data, entryId);
    expect(next.vocabEntries).toHaveLength(0);
    expect(next.occurrences).toHaveLength(0);
    expect(next.reviews).toHaveLength(0);
    expect(findEntryByLemma(next, 'maintain')).toBeUndefined();
  });

  it('deleteEntry 不存在的 id 安全返回', () => {
    const { data } = seed();
    const next = deleteEntry(data, 'nope');
    expect(next.vocabEntries).toHaveLength(1);
    expect(next.occurrences).toHaveLength(2);
  });

  it('deleteEntry 不修改入参', () => {
    const { data, entryId } = seed();
    const frozen = deepFreeze(data);
    const before = snapshot(frozen);
    deleteEntry(frozen, entryId);
    expect(snapshot(frozen)).toBe(before);
  });
});

/* ------------------------------------------------------------------ */
/* db: 复习与测验                                                      */
/* ------------------------------------------------------------------ */

describe('db / recordReview', () => {
  it('追加日志并更新词条复习状态', () => {
    const first = addWord(createEmptyData(), makeInput());
    const next = recordReview(first.data, {
      entryId: first.entry.id,
      lemma: 'maintain',
      grade: 'good',
      prevIntervalDays: 0,
      nextIntervalDays: 3,
      masteryStatus: 'reviewing',
      nextReviewAt: NOW + 3 * 86_400_000,
      now: NOW + 500,
    });

    expect(next.reviews).toHaveLength(1);
    const log = next.reviews[0];
    expect(log.grade).toBe('good');
    expect(log.nextIntervalDays).toBe(3);
    expect(log.reviewedAt).toBe(NOW + 500);
    expect(log.lemma).toBe('maintain');
    expect(log.id.startsWith('r_')).toBe(true);

    const entry = next.vocabEntries[0];
    expect(entry.lastReviewedAt).toBe(NOW + 500);
    expect(entry.nextReviewAt).toBe(NOW + 3 * 86_400_000);
    expect(entry.masteryStatus).toBe('reviewing');
    expect(entry.srs.intervalDays).toBe(3);
    expect(reviewsOf(next, first.entry.id)).toHaveLength(1);
  });

  it('masteredBy 由 SRS 判定时写入', () => {
    const first = addWord(createEmptyData(), makeInput());
    const next = recordReview(first.data, {
      entryId: first.entry.id,
      lemma: 'maintain',
      grade: 'easy',
      prevIntervalDays: 10,
      nextIntervalDays: 30,
      masteryStatus: 'mastered',
      masteredBy: 'srs',
      nextReviewAt: NOW + 30 * 86_400_000,
      now: NOW,
    });
    expect(next.vocabEntries[0].masteredBy).toBe('srs');
  });

  it('不存在的词条 id 返回原 data', () => {
    const first = addWord(createEmptyData(), makeInput());
    const next = recordReview(first.data, {
      entryId: 'missing',
      lemma: 'x',
      grade: 'again',
      prevIntervalDays: 1,
      nextIntervalDays: 0,
      masteryStatus: 'learning',
      nextReviewAt: NOW,
      now: NOW,
    });
    expect(next).toBe(first.data);
    expect(next.reviews).toHaveLength(0);
  });
});

describe('db / recordQuizAttempt', () => {
  it('追加测验记录', () => {
    const next = recordQuizAttempt(createEmptyData(), {
      id: makeId('q'),
      articleId: 'a1',
      articleTitle: 'A Steady Pace',
      level: 2,
      answers: { q1: 0, q2: 3 },
      correctCount: 1,
      total: 2,
      wrongByType: { 细节理解: 1 },
      submittedAt: NOW,
    });
    expect(next.quizAttempts).toHaveLength(1);
    expect(next.quizAttempts[0].correctCount).toBe(1);
    expect(next.quizAttempts[0].wrongByType['细节理解']).toBe(1);
  });
});

/* ------------------------------------------------------------------ */
/* db: 阅读进度 / 收藏 / 最近 / 活跃日                                 */
/* ------------------------------------------------------------------ */

describe('db / 阅读进度', () => {
  function progress(overrides: Partial<ReadingProgress> = {}): ReadingProgress {
    return {
      articleId: 'a1',
      sentenceIndex: 1,
      ratio: 0.2,
      wordsRead: 20,
      startedAt: NOW,
      updatedAt: NOW,
      ...overrides,
    };
  }

  it('saveProgress 同文章覆盖并保留更早的 startedAt', () => {
    const first = saveProgress(createEmptyData(), progress());
    const second = saveProgress(first, progress({ startedAt: NOW + 5000, updatedAt: NOW + 5000, sentenceIndex: 4, wordsRead: 60 }));
    const saved = second.progress.a1;
    expect(saved.startedAt).toBe(NOW);
    expect(saved.updatedAt).toBe(NOW + 5000);
    expect(saved.sentenceIndex).toBe(4);
    expect(saved.wordsRead).toBe(60);
    expect(Object.keys(second.progress)).toHaveLength(1);
  });

  it('saveProgress 保留已有 completedAt', () => {
    const first = saveProgress(createEmptyData(), progress({ completedAt: NOW + 10, ratio: 1 }));
    const second = saveProgress(first, progress({ sentenceIndex: 2 }));
    expect(second.progress.a1.completedAt).toBe(NOW + 10);
  });

  it('markCompleted 写入 completedAt、ratio=1 且 wordsRead 取最大', () => {
    const first = saveProgress(createEmptyData(), progress({ wordsRead: 80 }));
    const next = markCompleted(first, 'a1', 50, NOW + 9000);
    const saved = next.progress.a1;
    expect(saved.completedAt).toBe(NOW + 9000);
    expect(saved.ratio).toBe(1);
    expect(saved.wordsRead).toBe(80);
    expect(saved.startedAt).toBe(NOW);
  });

  it('markCompleted 对未开始的文章也能创建记录', () => {
    const next = markCompleted(createEmptyData(), 'a7', 120, NOW);
    expect(next.progress.a7.completedAt).toBe(NOW);
    expect(next.progress.a7.wordsRead).toBe(120);
    expect(next.progress.a7.startedAt).toBe(NOW);
  });
});

describe('db / 收藏与最近阅读', () => {
  it('toggleFavorite 添加与移除', () => {
    const added = toggleFavorite(createEmptyData(), 'a1');
    expect(added.favorites).toEqual(['a1']);
    const removed = toggleFavorite(added, 'a1');
    expect(removed.favorites).toEqual([]);
  });

  it('pushRecent 去重、置顶并按 limit 截断', () => {
    let data = createEmptyData();
    data = pushRecent(data, 'a1');
    data = pushRecent(data, 'a2');
    data = pushRecent(data, 'a3');
    expect(data.recent).toEqual(['a3', 'a2', 'a1']);

    data = pushRecent(data, 'a1');
    expect(data.recent).toEqual(['a1', 'a3', 'a2']);

    data = pushRecent(data, 'a4', 3);
    expect(data.recent).toEqual(['a4', 'a1', 'a3']);
    expect(data.recent).toHaveLength(3);
  });

  it('pushRecent 默认 limit 为 10', () => {
    let data = createEmptyData();
    for (let i = 0; i < 15; i += 1) data = pushRecent(data, `a${i}`);
    expect(data.recent).toHaveLength(10);
    expect(data.recent[0]).toBe('a14');
  });
});

describe('db / recordActiveDay', () => {
  it('去重写入活跃日', () => {
    const first = recordActiveDay(createEmptyData(), '2026-10-28');
    expect(first.activeDays).toEqual(['2026-10-28']);

    const second = recordActiveDay(first, '2026-10-28');
    expect(second.activeDays).toHaveLength(1);

    const third = recordActiveDay(second, '2026-10-29');
    expect(third.activeDays).toEqual(['2026-10-28', '2026-10-29']);
  });

  it('空字符串被忽略', () => {
    const data = recordActiveDay(createEmptyData(), '   ');
    expect(data.activeDays).toEqual([]);
  });
});

describe('db / updateSettings', () => {
  it('合并局部设置', () => {
    const next = updateSettings(createEmptyData(), { theme: 'dark', dailyGoal: 30 });
    expect(next.settings.theme).toBe('dark');
    expect(next.settings.dailyGoal).toBe(30);
    expect(next.settings.readingFont).toBe(DEFAULT_SETTINGS.readingFont);
  });

  it('undefined 不覆盖已有值', () => {
    const next = updateSettings(createEmptyData(), { theme: undefined });
    expect(next.settings.theme).toBe(DEFAULT_SETTINGS.theme);
  });
});

/* ------------------------------------------------------------------ */
/* db: 查询与纯函数性                                                  */
/* ------------------------------------------------------------------ */

describe('db / 查询', () => {
  it('findEntryByLemma 大小写不敏感', () => {
    const data = addWord(createEmptyData(), makeInput()).data;
    expect(findEntryByLemma(data, 'MAINTAIN')?.lemma).toBe('maintain');
    expect(findEntryByLemma(data, 'absent')).toBeUndefined();
    expect(findEntryByLemma(data, '')).toBeUndefined();
  });

  it('对空数据与空 id 安全', () => {
    const empty = createEmptyData();
    expect(occurrencesOf(empty, '')).toEqual([]);
    expect(reviewsOf(empty, 'missing')).toEqual([]);
    expect(findEntryByLemma(empty, 'x')).toBeUndefined();
    expect(deleteEntry(empty, 'x').vocabEntries).toEqual([]);
    expect(pushRecent(empty, '')).toBe(empty);
  });
});

describe('db / 纯函数性', () => {
  it('主要写操作都不修改原对象', () => {
    const base = addWord(createEmptyData(), makeInput());
    const data = deepFreeze(base.data);
    const before = snapshot(data);

    markMastered(data, base.entry.id, 'user', NOW + 1);
    unmarkMastered(data, base.entry.id, NOW + 2);
    updateEntry(data, base.entry.id, { contextualMeaning: 'x' }, NOW + 3);
    recordActiveDay(data, '2026-10-28');
    toggleFavorite(data, 'a1');
    pushRecent(data, 'a1');
    markCompleted(data, 'a1', 10, NOW + 4);
    saveProgress(data, {
      articleId: 'a2',
      sentenceIndex: 0,
      ratio: 0,
      wordsRead: 0,
      startedAt: NOW,
      updatedAt: NOW,
    });
    updateSettings(data, { theme: 'dark' });

    expect(snapshot(data)).toBe(before);
    expect(data.vocabEntries[0].masteryStatus).toBe('new');
    expect(data.favorites).toEqual([]);
    expect(data.recent).toEqual([]);
  });

  it('makeId 生成不重复且带前缀的 id', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 200; i += 1) ids.add(makeId('v'));
    expect(ids.size).toBe(200);
    for (const id of ids) expect(id.startsWith('v_')).toBe(true);
  });
});
