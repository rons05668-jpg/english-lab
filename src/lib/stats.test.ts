import { describe, expect, it } from 'vitest';
import type {
  AppData,
  Article,
  Category,
  Level,
  QuizAttempt,
  UserSettings,
  VocabularyEntry,
} from '../data/types';
import { todayKey } from './text';
import {
  METRIC_DEFINITIONS,
  accuracyByType,
  computeDashboard,
  heatmap,
  recentQuizTrend,
  streakFromActiveDays,
} from './stats';

const NOW = new Date(2026, 9, 28, 12, 0, 0).getTime();
const DAY = 86_400_000;
const TODAY = todayKey(NOW);
const YESTERDAY = todayKey(NOW - DAY);
const TWO_DAYS_AGO = todayKey(NOW - 2 * DAY);

function makeArticle(
  id: string,
  level: Level,
  category: Category,
  sentences: string[],
): Article {
  return {
    id,
    title: `Title ${id}`,
    titleZh: `标题 ${id}`,
    level,
    category,
    paragraphs: [{ sentences: sentences.map((en) => ({ en, zh: '' })) }],
    keyVocab: [],
    grammar: [],
    glossary: {},
    quiz: [],
    source: 'test',
    license: 'CC0',
  };
}

function makeVocab(
  id: string,
  masteryStatus: VocabularyEntry['masteryStatus'],
  extra: Partial<VocabularyEntry> = {},
): VocabularyEntry {
  return {
    id,
    lemma: id,
    partOfSpeech: 'n.',
    phonetics: {},
    definitions: [],
    masteryStatus,
    createdAt: NOW - 5 * DAY,
    updatedAt: NOW - DAY,
    srs: { reps: 0, streak: 0, ease: 2.5, intervalDays: 0, lapses: 0 },
    ...extra,
  };
}

function makeSettings(dailyGoal: number): UserSettings {
  return {
    theme: 'system',
    readingTheme: 'paper',
    fontScale: 1,
    lineHeight: 1.7,
    readingFont: 'serif',
    showVocabMarks: true,
    markStyle: 'underline',
    translationMode: 'tap',
    focusMode: false,
    speechRate: 1,
    speechVoice: 'us',
    autoAddOnClick: true,
    dailyGoal,
    onlineDictionary: false,
  };
}

function makeData(overrides: Partial<AppData> = {}): AppData {
  return {
    version: 1,
    vocabEntries: [],
    occurrences: [],
    reviews: [],
    quizAttempts: [],
    progress: {},
    favorites: [],
    recent: [],
    settings: makeSettings(300),
    activeDays: [],
    ...overrides,
  };
}

const ARTICLES: Article[] = [
  makeArticle('a1', 1, '生活', ['One two three four five.', 'Six seven eight nine.']), // 9 词
  makeArticle('a2', 2, '科技', ['Alpha beta gamma.', 'Delta epsilon.', 'Zeta eta theta iota.']), // 9 词
  makeArticle('a3', 1, '生活', ['Solo sentence here.']), // 3 词
  makeArticle('a4', 4, '教育', ['Unread article text.']), // 3 词
];

function buildFullData(): AppData {
  return makeData({
    progress: {
      a1: {
        articleId: 'a1',
        sentenceIndex: 1,
        ratio: 1,
        wordsRead: 9,
        startedAt: NOW - 3 * DAY,
        updatedAt: NOW - 3_600_000,
        completedAt: NOW - 3_600_000,
      },
      a2: {
        articleId: 'a2',
        sentenceIndex: 2,
        ratio: 1,
        wordsRead: 9,
        startedAt: NOW - 5 * DAY,
        updatedAt: NOW - DAY,
        completedAt: NOW - DAY,
      },
      a3: {
        articleId: 'a3',
        sentenceIndex: 0,
        ratio: 1,
        wordsRead: 3,
        startedAt: NOW - 2 * 3_600_000,
        updatedAt: NOW - 2 * 3_600_000,
        completedAt: NOW - 2 * 3_600_000,
      },
      a4: {
        articleId: 'a4',
        sentenceIndex: 0,
        ratio: 0.4,
        wordsRead: 1,
        startedAt: NOW - 7_200_000,
        updatedAt: NOW - 7_200_000,
      },
    },
    vocabEntries: [
      makeVocab('v1', 'mastered', { lastReviewedAt: NOW - DAY, nextReviewAt: NOW - DAY }),
      makeVocab('v2', 'mastered'),
      makeVocab('v3', 'learning', { lastReviewedAt: NOW - 2 * DAY, nextReviewAt: NOW - 1_000 }),
      makeVocab('v4', 'new'),
      makeVocab('v5', 'reviewing', { lastReviewedAt: NOW - DAY, nextReviewAt: NOW + DAY }),
    ],
    quizAttempts: [
      {
        id: 'q1',
        articleId: 'a1',
        articleTitle: 'Title a1',
        level: 1,
        answers: { q1: 0, q2: 1 },
        correctCount: 3,
        total: 4,
        wrongByType: { 细节理解: 1 },
        submittedAt: NOW - 3_600_000,
      },
    ],
    activeDays: [TWO_DAYS_AGO, YESTERDAY, TODAY],
  });
}

describe('computeDashboard — 空数据', () => {
  const stats = computeDashboard(makeData(), [], NOW);

  it('计数全为 0', () => {
    expect(stats.todayArticles).toBe(0);
    expect(stats.todayWordsRead).toBe(0);
    expect(stats.totalArticlesCompleted).toBe(0);
    expect(stats.totalArticlesStarted).toBe(0);
    expect(stats.wordsReadActual).toBe(0);
    expect(stats.wordsInCompletedArticles).toBe(0);
    expect(stats.vocabTotal).toBe(0);
    expect(stats.dueToday).toBe(0);
    expect(stats.newWords).toBe(0);
    expect(stats.quizAttempts).toBe(0);
    expect(stats.streakDays).toBe(0);
  });

  it('比率为 0 而不是 NaN', () => {
    expect(stats.completionRate).toBe(0);
    expect(stats.quizAccuracy).toBe(0);
    expect(stats.dailyGoalProgress).toBe(0);
    expect(stats.minutesReadToday).toBe(0);
    expect(stats.todayActive).toBe(false);
    expect(Number.isNaN(stats.completionRate)).toBe(false);
    expect(Number.isNaN(stats.quizAccuracy)).toBe(false);
  });

  it('分组仍返回固定结构', () => {
    expect(stats.levelBreakdown.map((l) => l.level)).toEqual([1, 2, 3, 4]);
    expect(stats.levelBreakdown.every((l) => l.total === 0 && l.ratio === 0)).toBe(true);
    expect(stats.categoryBreakdown).toEqual([]);
    expect(stats.dailyGoal).toBe(300);
  });
});

describe('computeDashboard — 完整数据', () => {
  const data = buildFullData();
  const stats = computeDashboard(data, ARTICLES, NOW);

  it('今日完成文章数只算今天完成的', () => {
    expect(stats.todayArticles).toBe(2);
  });

  it('累计完成/开始文章数', () => {
    expect(stats.totalArticlesCompleted).toBe(3);
    expect(stats.totalArticlesStarted).toBe(4);
  });

  it('口径 A：实际阅读词数 = Σ progress.wordsRead', () => {
    expect(stats.wordsReadActual).toBe(22);
  });

  it('口径 B：完成文章词数 = Σ articleWordCount(已完成)', () => {
    expect(stats.wordsInCompletedArticles).toBe(21);
  });

  it('两个词数口径互不相等且不混用', () => {
    expect(stats.wordsReadActual).not.toBe(stats.wordsInCompletedArticles);
  });

  it('今日阅读词数 = 今日完成全文词数 + 今日未完成已读词数', () => {
    expect(stats.todayWordsRead).toBe(9 + 3 + 1);
  });

  it('完成率 = 已完成 / 文章总数', () => {
    expect(stats.completionRate).toBeCloseTo(0.75, 10);
  });

  it('词汇指标：总数 / 已掌握 / 未掌握 / 待复习 / 新词', () => {
    expect(stats.vocabTotal).toBe(5);
    expect(stats.vocabMastered).toBe(2);
    expect(stats.vocabLearning).toBe(3);
    expect(stats.dueToday).toBe(1);
    expect(stats.newWords).toBe(1);
  });

  it('答题指标按题目累计', () => {
    expect(stats.quizAttempts).toBe(1);
    expect(stats.quizQuestionTotal).toBe(4);
    expect(stats.quizAccuracy).toBeCloseTo(0.75, 10);
  });

  it('连续天数与今日活跃', () => {
    expect(stats.streakDays).toBe(3);
    expect(stats.todayActive).toBe(true);
  });

  it('今日时长与目标进度', () => {
    expect(stats.minutesReadToday).toBe(1);
    expect(stats.dailyGoal).toBe(300);
    expect(stats.dailyGoalProgress).toBeCloseTo(13 / 300, 10);
  });

  it('按难度分组', () => {
    expect(stats.levelBreakdown).toEqual([
      { level: 1, total: 2, completed: 2, ratio: 1 },
      { level: 2, total: 1, completed: 1, ratio: 1 },
      { level: 3, total: 0, completed: 0, ratio: 0 },
      { level: 4, total: 1, completed: 0, ratio: 0 },
    ]);
  });

  it('按主题分组', () => {
    expect(stats.categoryBreakdown).toEqual([
      { category: '生活', total: 2, completed: 2 },
      { category: '科技', total: 1, completed: 1 },
      { category: '教育', total: 1, completed: 0 },
    ]);
  });

  it('所有数值字段都不是 NaN', () => {
    const values = [
      stats.todayArticles,
      stats.todayWordsRead,
      stats.totalArticlesCompleted,
      stats.totalArticlesStarted,
      stats.wordsReadActual,
      stats.wordsInCompletedArticles,
      stats.completionRate,
      stats.vocabTotal,
      stats.vocabMastered,
      stats.vocabLearning,
      stats.dueToday,
      stats.newWords,
      stats.quizAccuracy,
      stats.quizAttempts,
      stats.quizQuestionTotal,
      stats.streakDays,
      stats.minutesReadToday,
      stats.dailyGoal,
      stats.dailyGoalProgress,
    ];
    expect(values.every((v) => Number.isFinite(v))).toBe(true);
  });
});

describe('computeDashboard — 目标为 0', () => {
  it('dailyGoal 为 0 时进度为 0 不产生 Infinity', () => {
    const stats = computeDashboard(makeData({ settings: makeSettings(0) }), [], NOW);
    expect(stats.dailyGoalProgress).toBe(0);
    expect(Number.isFinite(stats.dailyGoalProgress)).toBe(true);
  });
});

describe('streakFromActiveDays', () => {
  it('连续 3 天 = 3', () => {
    expect(streakFromActiveDays([TWO_DAYS_AGO, YESTERDAY, TODAY], NOW)).toBe(3);
  });

  it('中间断 1 天 = 1', () => {
    expect(streakFromActiveDays([TWO_DAYS_AGO, TODAY], NOW)).toBe(1);
  });

  it('今天未学但昨天学了仍计入', () => {
    expect(streakFromActiveDays([TWO_DAYS_AGO, YESTERDAY], NOW)).toBe(2);
  });

  it('完全没记录为 0', () => {
    expect(streakFromActiveDays([], NOW)).toBe(0);
  });

  it('只有很久以前学过为 0', () => {
    expect(streakFromActiveDays([todayKey(NOW - 10 * DAY)], NOW)).toBe(0);
  });
});

describe('accuracyByType', () => {
  const attempts: QuizAttempt[] = [
    {
      id: 'q1',
      articleId: 'a1',
      articleTitle: 'T1',
      level: 1,
      answers: {},
      correctCount: 1,
      total: 4,
      wrongByType: { 细节理解: 1, 主旨大意: 2 },
      submittedAt: NOW - DAY,
    },
    {
      id: 'q2',
      articleId: 'a2',
      articleTitle: 'T2',
      level: 2,
      answers: {},
      correctCount: 2,
      total: 3,
      wrongByType: { 细节理解: 1 },
      submittedAt: NOW,
    },
  ];

  it('按题型汇总错误数与题目总数', () => {
    const rows = accuracyByType(attempts);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      type: '细节理解',
      wrong: 2,
      total: 7,
      accuracy: (7 - 2) / 7,
    });
    expect(rows[1]).toEqual({ type: '主旨大意', wrong: 2, total: 4, accuracy: 0.5 });
  });

  it('空输入返回空数组', () => {
    expect(accuracyByType([])).toEqual([]);
  });
});

describe('heatmap', () => {
  it('长度 = weeks * 7，最后一格是今天', () => {
    const cells = heatmap([TODAY], 4, NOW);
    expect(cells).toHaveLength(28);
    expect(cells[cells.length - 1].date).toBe(TODAY);
    expect(cells[cells.length - 1].active).toBe(true);
  });

  it('首格日期为今天往前 27 天', () => {
    const cells = heatmap([], 4, NOW);
    expect(cells[0].date).toBe(todayKey(NOW - 27 * DAY));
  });

  it('强度保守映射：活跃 2，未活跃 0', () => {
    const cells = heatmap([YESTERDAY], 2, NOW);
    const levels = new Set(cells.map((c) => c.level));
    expect(Array.from(levels).sort()).toEqual([0, 2]);
    expect(cells.filter((c) => c.active)).toHaveLength(1);
  });

  it('weeks 为 0 返回空数组', () => {
    expect(heatmap([TODAY], 0, NOW)).toEqual([]);
  });
});

describe('recentQuizTrend', () => {
  it('同一天的多条记录合并为一行', () => {
    const attempts: QuizAttempt[] = [
      {
        id: 'q1',
        articleId: 'a1',
        articleTitle: 'T1',
        level: 1,
        answers: {},
        correctCount: 3,
        total: 4,
        wrongByType: {},
        submittedAt: NOW - 3_600_000,
      },
      {
        id: 'q2',
        articleId: 'a1',
        articleTitle: 'T1',
        level: 1,
        answers: {},
        correctCount: 1,
        total: 4,
        wrongByType: {},
        submittedAt: NOW - 1_800_000,
      },
    ];
    const rows = recentQuizTrend(attempts);
    expect(rows).toHaveLength(1);
    expect(rows[0].date).toBe(TODAY);
    expect(rows[0].total).toBe(8);
    expect(rows[0].accuracy).toBeCloseTo(0.5, 10);
  });

  it('按日期升序并遵守 limit', () => {
    const base = {
      articleId: 'a1',
      articleTitle: 'T1',
      level: 1 as Level,
      answers: {},
      wrongByType: {},
    };
    const attempts: QuizAttempt[] = [
      { ...base, id: 'q1', correctCount: 1, total: 2, submittedAt: NOW - 2 * DAY },
      { ...base, id: 'q2', correctCount: 2, total: 2, submittedAt: NOW - DAY },
      { ...base, id: 'q3', correctCount: 0, total: 2, submittedAt: NOW },
    ];
    const rows = recentQuizTrend(attempts, 2);
    expect(rows.map((r) => r.date)).toEqual([YESTERDAY, TODAY]);
    expect(rows[1].accuracy).toBe(0);
  });
});

describe('METRIC_DEFINITIONS', () => {
  it('覆盖关键指标且文案非空', () => {
    const keys = [
      'todayArticles',
      'wordsReadActual',
      'wordsInCompletedArticles',
      'vocabTotal',
      'vocabMastered',
      'dueToday',
      'quizAccuracy',
      'streakDays',
      'completionRate',
    ];
    for (const key of keys) {
      expect(typeof METRIC_DEFINITIONS[key]).toBe('string');
      expect(METRIC_DEFINITIONS[key].length).toBeGreaterThan(10);
    }
  });

  it('两个词数口径的说明不相同', () => {
    expect(METRIC_DEFINITIONS.wordsReadActual).not.toBe(
      METRIC_DEFINITIONS.wordsInCompletedArticles,
    );
  });
});
