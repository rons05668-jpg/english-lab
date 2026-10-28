/**
 * 间隔复习（SRS）算法 —— SM-2 变体，可解释、确定性、可单元测试。
 *
 * 设计要点：
 * - 纯函数：输入 (state, grade, now) 决定输出，不含随机数、不读系统时间。
 * - 所有派生值取整后写回，避免浮点漂移导致 UI 显示 "1.9999999 天"。
 * - 掌握（mastered）由「连续成功次数 + 实际间隔」共同决定，而不是点击次数。
 */

import type { MasteryStatus, ReviewGrade, SrsState } from '../data/types';

/** 难度因子下界 */
const MIN_EASE = 1.3;
/** 难度因子上界 */
const MAX_EASE = 2.8;
/** 间隔上限（天），防止长期不复习后一次跳到几十年 */
const MAX_INTERVAL_DAYS = 365;
/** 一天的毫秒数 */
const DAY_MS = 86_400_000;
/** `again` 后的重来延迟：10 分钟 */
const AGAIN_DELAY_MS = 10 * 60 * 1000;
/** 掌握所需的最少连续成功次数 */
const MASTERY_MIN_STREAK = 4;
/** 掌握所需的最短间隔（天） */
const MASTERY_MIN_INTERVAL_DAYS = 21;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 保留两位小数，消除 2.4999999999 这类浮点尾巴 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** 新建词汇条目时的初始复习状态 */
export function initialSrs(): SrsState {
  return { reps: 0, streak: 0, ease: 2.5, intervalDays: 0, lapses: 0 };
}

export interface ReviewOutcome {
  srs: SrsState;
  masteryStatus: MasteryStatus;
  masteredBy?: 'srs';
  intervalDays: number;
  /** 毫秒时间戳 */
  nextReviewAt: number;
  /** 人类可读，如 "10 分钟后" / "3 天后" */
  dueLabel: string;
}

/**
 * 应用一次复习评分，返回新的 SRS 状态与掌握状态。
 *
 * 间隔计算一律使用「本次更新前」的 ease，保证同样的历史输入必然得到同样的输出，
 * 也避免 easy 因 ease 提升而自我加速、hard 因 ease 下降而自我减速的双重作用。
 */
export function applyReview(
  current: { srs: SrsState; masteryStatus: MasteryStatus },
  grade: ReviewGrade,
  now: number,
): ReviewOutcome {
  const prev = current.srs;
  const easeBefore = round2(clamp(prev.ease, MIN_EASE, MAX_EASE));
  const prevInterval = Math.max(0, Math.round(prev.intervalDays));

  const reps = prev.reps + 1;
  let streak = prev.streak;
  let lapses = prev.lapses;
  let ease = easeBefore;
  let intervalDays = 0;

  switch (grade) {
    case 'again': {
      // 完全遗忘：间隔清零，10 分钟后重来
      intervalDays = 0;
      ease = round2(clamp(easeBefore - 0.2, MIN_EASE, MAX_EASE));
      streak = 0;
      lapses = prev.lapses + 1;
      break;
    }
    case 'hard': {
      // 想起来了但很吃力：只小幅推进，并降低 ease
      intervalDays = prevInterval <= 0 ? 1 : Math.max(1, Math.round(prevInterval * 1.2));
      ease = round2(clamp(easeBefore - 0.15, MIN_EASE, MAX_EASE));
      streak = prev.streak + 1;
      break;
    }
    case 'good': {
      // 正常回忆：按 ease 正常放大间隔
      intervalDays = prevInterval <= 0 ? 1 : Math.max(1, Math.round(prevInterval * easeBefore));
      streak = prev.streak + 1;
      break;
    }
    case 'easy': {
      // 毫不费力：额外 30% 加成，并提高 ease
      intervalDays =
        prevInterval <= 0 ? 3 : Math.max(2, Math.round(prevInterval * easeBefore * 1.3));
      ease = round2(clamp(easeBefore + 0.15, MIN_EASE, MAX_EASE));
      streak = prev.streak + 1;
      break;
    }
  }

  intervalDays = clamp(Math.round(intervalDays), 0, MAX_INTERVAL_DAYS);

  const nextReviewAt = grade === 'again' ? now + AGAIN_DELAY_MS : now + intervalDays * DAY_MS;

  // 掌握门槛：连续 4 次成功 且 间隔已拉到 21 天以上。
  // 单看点击次数会让「反复重看」也变成掌握，单看间隔则会让一次 easy 蒙对就毕业。
  const mastered = streak >= MASTERY_MIN_STREAK && intervalDays >= MASTERY_MIN_INTERVAL_DAYS;
  const masteryStatus: MasteryStatus = mastered
    ? 'mastered'
    : reps < 2
      ? 'learning'
      : 'reviewing';

  const srs: SrsState = {
    reps,
    streak,
    ease,
    intervalDays,
    lapses,
  };

  return {
    srs,
    masteryStatus,
    ...(mastered ? { masteredBy: 'srs' as const } : {}),
    intervalDays,
    nextReviewAt,
    dueLabel: describeNextReview(intervalDays),
  };
}

/** 该条目此刻是否该复习 */
export function isDue(
  entry: { nextReviewAt?: number; masteryStatus: MasteryStatus },
  now: number,
): boolean {
  if (entry.nextReviewAt === undefined) return true;
  return entry.nextReviewAt <= now;
}

/**
 * 待复习队列：筛出到期或从未排期的条目，按下次复习时间升序。
 * 从未排期的（新词）排在最前，因为它们本质上是「立刻可学」。
 */
export function dueQueue<
  T extends { nextReviewAt?: number; masteryStatus: MasteryStatus; createdAt: number },
>(entries: T[], now: number): T[] {
  return entries
    .filter((entry) => isDue(entry, now))
    .slice()
    .sort((a, b) => {
      const aKey = a.nextReviewAt ?? Number.NEGATIVE_INFINITY;
      const bKey = b.nextReviewAt ?? Number.NEGATIVE_INFINITY;
      if (aKey !== bKey) return aKey - bKey;
      return a.createdAt - b.createdAt;
    });
}

/** 把间隔天数翻译成一句人话 */
export function describeNextReview(intervalDays: number): string {
  if (!Number.isFinite(intervalDays) || intervalDays <= 0) return '10 分钟后';
  if (intervalDays < 1) {
    const hours = Math.max(1, Math.round(intervalDays * 24));
    return `${hours} 小时后`;
  }
  if (intervalDays < 2) return '明天';
  if (intervalDays < 30) return `${Math.round(intervalDays)} 天后`;
  return `${Math.round(intervalDays / 30)} 个月后`;
}

/** 「算法说明」面板用的中文文案 */
export const SRS_ALGORITHM_DOC: {
  name: string;
  summary: string;
  grades: { grade: string; label: string; effect: string }[];
  masteryRule: string;
  notes: string[];
} = {
  name: 'English Lab 间隔复习（SM-2 变体）',
  summary:
    '每个单词记一份记忆档案：连续想起来的次数（streak）、难度因子（ease，1.3–2.8）和下次间隔（intervalDays）。系统用它们推算「下次什么时候该再见这个词」，而不是用你点开过多少次来决定。',
  grades: [
    {
      grade: 'again',
      label: '忘了',
      effect:
        '间隔立刻清零，10 分钟后原样再来一遍；难度因子 −0.20，连续正确次数归零，遗忘次数 +1。它不会把单词打回「新词」，历史记录都还在。',
    },
    {
      grade: 'hard',
      label: '勉强想起',
      effect:
        '间隔只放大 1.2 倍（首次为 1 天）；难度因子 −0.15，说明这个词对你偏难，以后推进会更慢。连续正确次数 +1。',
    },
    {
      grade: 'good',
      label: '想起来了',
      effect:
        '间隔乘以当前难度因子（首次为 1 天，之后约 1 → 3 → 8 → 20 天）；难度因子不变。这是最常用的评分，也是最稳的节奏。',
    },
    {
      grade: 'easy',
      label: '太简单',
      effect:
        '间隔乘以难度因子再额外 ×1.3（首次直接 3 天）；难度因子 +0.15，以后越推越快。请只在真正「秒答」时使用。',
    },
  ],
  masteryRule:
    '连续 4 次顺利回忆（streak ≥ 4）且当前间隔已达到 21 天以上，才判定为「已掌握」。间隔 21 天意味着这个词已经跨过了最容易遗忘的窗口；只满足其中一个条件都不算。',
  notes: [
    '为什么不是点击次数：反复点开同一个词却每次都忘，点击次数很高但记忆并不牢。算法看的是「隔了多久还能想起来」，所以时间间隔才是真正的证据。',
    '间隔上限 365 天：即使长期复习顺利，也不会一次排到几年之后，避免一个手滑就永久失联。',
    '难度因子被夹在 1.3–2.8 之间：太低会让复习变成刷屏，太高会让间隔虚高。',
    '忘了不算清零重来：again 只清空当前间隔和连续次数，难度因子与历史复习次数保留，所以老词重学比新词更快回到长间隔。',
    '全部计算是确定性的：同样的状态 + 同样的评分 + 同样的时间，必然得到同样的结果，方便测试与复盘。',
  ],
};
