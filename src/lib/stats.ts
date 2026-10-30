/**
 * 学习统计。所有指标都从 AppData + Article[] 现算，不做缓存，
 * 保证"同一个数字在首页、统计页、词汇页永远是同一口径"。
 *
 * 两个容易混淆的词数口径，本文件严格分开：
 *   口径 A（wordsReadActual）      = Σ progress.wordsRead，用户实际划过的句子词数累加，含未读完的文章。
 *   口径 B（wordsInCompletedArticles） = Σ articleWordCount(已读完的文章)，按全文词数计，不管用户是否逐句读完。
 * 两个数字不能相加、不能互相替代，UI 上必须标注清楚。
 */

import type { AppData, Article, Level, QuizAttempt } from '../data/types';
import { articleWordCount, readingMinutes, todayKey } from './text';

export interface DashboardStats {
  todayArticles: number;
  todayWordsRead: number;
  totalArticlesCompleted: number;
  totalArticlesStarted: number;
  wordsReadActual: number;
  wordsInCompletedArticles: number;
  completionRate: number;
  vocabTotal: number;
  vocabMastered: number;
  vocabLearning: number;
  dueToday: number;
  newWords: number;
  quizAccuracy: number;
  quizAttempts: number;
  quizQuestionTotal: number;
  streakDays: number;
  todayActive: boolean;
  minutesReadToday: number;
  dailyGoal: number;
  dailyGoalProgress: number;
  levelBreakdown: { level: Level; total: number; completed: number; ratio: number }[];
  categoryBreakdown: { category: string; total: number; completed: number }[];
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** 本地时区的日序号（UTC 天数折算，规避夏令时） */
function localDayNumber(ts: number): number {
  const d = new Date(ts);
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
}

/** 日序号 → 'YYYY-MM-DD' */
function dayKeyFromNumber(dayNumber: number): string {
  const d = new Date(dayNumber * 86_400_000);
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

function safeRatio(numerator: number, denominator: number): number {
  if (!denominator || denominator <= 0) return 0;
  const value = numerator / denominator;
  return Number.isFinite(value) ? value : 0;
}

/**
 * 连续学习天数。今天没学不算断（从昨天开始回溯），今天学了就 +1。
 */
export function streakFromActiveDays(activeDays: string[], now: number): number {
  if (activeDays.length === 0) return 0;
  const set = new Set(activeDays);
  const today = localDayNumber(now);
  let cursor = set.has(dayKeyFromNumber(today)) ? today : today - 1;
  let streak = 0;
  while (set.has(dayKeyFromNumber(cursor))) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}

/**
 * 按题型统计错误数。
 * 注意：QuizAttempt 只存了 wrongByType（错题数），没有"每种题型几道题"，
 * 因此该题型的 total 用"出现过该题型的那些答题记录的题目总数"近似，
 * accuracy = (total - wrong) / total。分母偏大 → 结果偏乐观，仅供趋势参考。
 */
export function accuracyByType(
  attempts: QuizAttempt[],
): { type: string; wrong: number; total: number; accuracy: number }[] {
  const order: string[] = [];
  const bucket: Record<string, { wrong: number; total: number }> = {};

  for (const attempt of attempts) {
    for (const type of Object.keys(attempt.wrongByType)) {
      if (!(type in bucket)) {
        bucket[type] = { wrong: 0, total: 0 };
        order.push(type);
      }
      bucket[type].wrong += attempt.wrongByType[type];
      bucket[type].total += attempt.total;
    }
  }

  return order.map((type) => {
    const rec = bucket[type];
    return {
      type,
      wrong: rec.wrong,
      total: rec.total,
      accuracy: safeRatio(rec.total - rec.wrong, rec.total),
    };
  });
}

/**
 * 热力图：以今天为最后一格，向前铺 weeks * 7 天。
 * 数据层只有"当天是否活跃"（activeDays），没有分钟数/词数，
 * 所以强度保守映射为 active ? 2 : 0，不编造 3/4 级。
 * 调用方可按返回首格的星期几决定表头（周一~周日）。
 */
export function heatmap(
  activeDays: string[],
  weeks: number,
  now: number,
): { date: string; level: 0 | 1 | 2 | 3 | 4; active: boolean }[] {
  const set = new Set(activeDays);
  const weekCount = Number.isFinite(weeks) ? Math.max(0, Math.floor(weeks)) : 0;
  const cells = weekCount * 7;
  const today = localDayNumber(now);
  const out: { date: string; level: 0 | 1 | 2 | 3 | 4; active: boolean }[] = [];

  for (let offset = cells - 1; offset >= 0; offset -= 1) {
    const date = dayKeyFromNumber(today - offset);
    const active = set.has(date);
    const level: 0 | 1 | 2 | 3 | 4 = active ? 2 : 0;
    out.push({ date, level, active });
  }
  return out;
}

/** 最近若干次（按天聚合）答题正确率趋势，按日期升序 */
export function recentQuizTrend(
  attempts: QuizAttempt[],
  limit = 10,
): { date: string; accuracy: number; total: number }[] {
  const bucket = new Map<string, { correct: number; total: number }>();

  for (const attempt of attempts) {
    const date = todayKey(attempt.submittedAt);
    const rec = bucket.get(date) ?? { correct: 0, total: 0 };
    rec.correct += attempt.correctCount;
    rec.total += attempt.total;
    bucket.set(date, rec);
  }

  const rows = Array.from(bucket.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([date, rec]) => ({
      date,
      accuracy: safeRatio(rec.correct, rec.total),
      total: rec.total,
    }));

  const max = Math.max(0, Math.floor(limit));
  return max === 0 ? [] : rows.slice(Math.max(0, rows.length - max));
}

/**
 * 统计只需要文章的 id / 分级 / 分类，不碰正文。
 * 用结构类型接收，让首屏可以直接传轻量索引（ArticleBrief），不必加载全文。
 */
export interface ArticleLike {
  id: string;
  level: Level;
  category: Article['category'];
  /** 预计算词数。轻量索引直接带上，完整 Article 则回退到遍历正文 */
  wordCount?: number;
}

export function computeDashboard(data: AppData, articles: ArticleLike[], now: number): DashboardStats {
  const today = todayKey(now);
  const byId = new Map<string, ArticleLike>();
  for (const article of articles) byId.set(article.id, article);

  const progressList = Object.values(data.progress);

  let totalArticlesCompleted = 0;
  let wordsReadActual = 0;
  let wordsInCompletedArticles = 0;
  let todayArticles = 0;
  let todayWordsRead = 0;

  for (const progress of progressList) {
    const article = byId.get(progress.articleId);
    const fullWords = article
      ? typeof article.wordCount === 'number'
        ? article.wordCount
        : articleWordCount(article as Article)
      : 0;
    const readWords = progress.wordsRead > 0 ? progress.wordsRead : 0;

    wordsReadActual += readWords;

    const completedToday =
      progress.completedAt !== undefined && todayKey(progress.completedAt) === today;

    if (progress.completedAt !== undefined) {
      totalArticlesCompleted += 1;
      // 文章缺失时退回实际阅读词数，避免静默记 0
      wordsInCompletedArticles += fullWords > 0 ? fullWords : readWords;
    }

    if (completedToday) {
      todayArticles += 1;
      // 今日完成的文章按全文词数计（用户可能直接标记完成，wordsRead 为 0）
      todayWordsRead += fullWords > 0 ? fullWords : readWords;
    } else if (todayKey(progress.updatedAt) === today) {
      // 未完成但有更新：只能取累计已读词数近似"今日新增"，数据层无逐日快照
      todayWordsRead += readWords;
    }
  }

  let vocabMastered = 0;
  let dueToday = 0;
  let newWords = 0;

  for (const entry of data.vocabEntries) {
    if (entry.masteryStatus === 'mastered') {
      vocabMastered += 1;
      continue;
    }
    if (entry.lastReviewedAt === undefined) newWords += 1;
    if (entry.nextReviewAt !== undefined && entry.nextReviewAt <= now) dueToday += 1;
  }

  let quizCorrect = 0;
  let quizQuestionTotal = 0;
  for (const attempt of data.quizAttempts) {
    quizCorrect += attempt.correctCount;
    quizQuestionTotal += attempt.total;
  }

  const levels: Level[] = [1, 2, 3, 4];
  const levelBreakdown = levels.map((level) => {
    const list = articles.filter((a) => a.level === level);
    const completed = list.filter((a) => data.progress[a.id]?.completedAt !== undefined).length;
    return { level, total: list.length, completed, ratio: safeRatio(completed, list.length) };
  });

  const categoryOrder: string[] = [];
  const categoryMap: Record<string, { total: number; completed: number }> = {};
  for (const article of articles) {
    if (!(article.category in categoryMap)) {
      categoryMap[article.category] = { total: 0, completed: 0 };
      categoryOrder.push(article.category);
    }
    const rec = categoryMap[article.category];
    rec.total += 1;
    if (data.progress[article.id]?.completedAt !== undefined) rec.completed += 1;
  }
  const categoryBreakdown = categoryOrder.map((category) => ({
    category,
    total: categoryMap[category].total,
    completed: categoryMap[category].completed,
  }));

  const vocabTotal = data.vocabEntries.length;
  const dailyGoal = data.settings.dailyGoal;
  const activeDays = data.activeDays;

  return {
    todayArticles,
    todayWordsRead,
    totalArticlesCompleted,
    totalArticlesStarted: progressList.length,
    wordsReadActual,
    wordsInCompletedArticles,
    completionRate: safeRatio(totalArticlesCompleted, articles.length),
    vocabTotal,
    vocabMastered,
    vocabLearning: Math.max(0, vocabTotal - vocabMastered),
    dueToday,
    newWords,
    quizAccuracy: safeRatio(quizCorrect, quizQuestionTotal),
    quizAttempts: data.quizAttempts.length,
    quizQuestionTotal,
    streakDays: streakFromActiveDays(activeDays, now),
    todayActive: activeDays.includes(today),
    minutesReadToday: todayWordsRead > 0 ? readingMinutes(todayWordsRead) : 0,
    dailyGoal,
    dailyGoalProgress: safeRatio(todayWordsRead, dailyGoal),
    levelBreakdown,
    categoryBreakdown,
  };
}

/** 指标口径说明（中文，可直接展示在问号提示里） */
export const METRIC_DEFINITIONS: Record<string, string> = {
  todayArticles: '今天读完的文章数：只统计完成时间落在今天的文章，昨天读完的不算。',
  todayWordsRead:
    '今天读了多少词：今天读完的文章按全文词数计；今天只是读了但没读完的文章，按已读句子累加的词数计。',
  totalArticlesCompleted: '历史累计读完的文章数，按每篇文章的完成时间统计，同一篇只算一次。',
  totalArticlesStarted: '打开过并留下阅读进度的文章数，包含还没读完的。',
  wordsReadActual:
    '实际阅读词数：把每篇文章"已读句子"的单词数累加起来，读一半就只算一半。这是你真正看过的词量。',
  wordsInCompletedArticles:
    '完成文章词数：只算已读完的文章，每篇按全文词数计入，不管中间是否跳读。它比实际阅读词数更"整"。',
  completionRate: '完成率 = 已读完文章数 ÷ 文章总数。',
  vocabTotal: '生词本里的单词总数，包括还没开始复习的新词。收藏 ≠ 已掌握。',
  vocabMastered: '标记为"已掌握"的单词数（用户手动标记或复习系统判定），不再进入复习队列。',
  vocabLearning: '生词本中尚未掌握的词数 = 生词总数 − 已掌握数。',
  dueToday: '今天到期需要复习的单词数：下次复习时间已到，且尚未掌握。',
  newWords: '生词本里还没复习过的新词数（收藏后一次都没复习）。',
  quizAccuracy: '答题正确率 = 所有已提交题目的正确题数 ÷ 总题数，跨文章累计，不按文章取平均。',
  quizAttempts: '已提交的答题记录条数（一次提交算一次，不是题数）。',
  quizQuestionTotal: '所有答题记录里的题目总数，作为正确率的分母。',
  streakDays: '连续学习天数：从今天往前数，每天都学过才连续；今天还没学不算断，从昨天开始数。',
  todayActive: '今天是否有学习记录（阅读、复习或答题任一）。',
  minutesReadToday: '今日阅读时长估算 = 今日阅读词数 ÷ 150 词/分钟，向上取整；没读则为 0。',
  dailyGoal: '每日词数目标，可在设置里调整。',
  dailyGoalProgress: '今日目标完成度 = 今日阅读词数 ÷ 每日目标，可以超过 100%。',
  levelBreakdown: '按难度（Level 1-4）分组的文章数与完成数，用于看自己在哪个难度卡住。',
  categoryBreakdown: '按主题分类的文章数与完成数，用于看阅读偏好。',
};
