import { describe, expect, it } from 'vitest';
import {
  applyReview,
  describeNextReview,
  dueQueue,
  initialSrs,
  isDue,
  SRS_ALGORITHM_DOC,
} from './srs';
import type { MasteryStatus, ReviewGrade, SrsState } from '../data/types';

const DAY = 86_400_000;
const NOW = 1_700_000_000_000;

/** 按真实时间线连续施加若干评分，now 随 nextReviewAt 前移 */
function simulate(grades: ReviewGrade[], startNow = NOW) {
  let srs: SrsState = initialSrs();
  let masteryStatus: MasteryStatus = 'new';
  let now = startNow;
  let intervalDays = 0;
  let nextReviewAt = now;
  let masteredBy: 'srs' | undefined;

  for (const grade of grades) {
    const out = applyReview({ srs, masteryStatus }, grade, now);
    srs = out.srs;
    masteryStatus = out.masteryStatus;
    intervalDays = out.intervalDays;
    nextReviewAt = out.nextReviewAt;
    masteredBy = out.masteredBy;
    now = out.nextReviewAt;
  }

  return { srs, masteryStatus, intervalDays, nextReviewAt, masteredBy };
}

describe('initialSrs', () => {
  it('返回干净的新词状态', () => {
    const srs = initialSrs();
    expect(srs.reps).toBe(0);
    expect(srs.streak).toBe(0);
    expect(srs.ease).toBe(2.5);
    expect(srs.intervalDays).toBe(0);
    expect(srs.lapses).toBe(0);
  });

  it('每次调用返回新对象，互不影响', () => {
    const a = initialSrs();
    a.reps = 9;
    expect(initialSrs().reps).toBe(0);
  });
});

describe('good：正常回忆', () => {
  it('首次 good 间隔 1 天，并排在一天后', () => {
    const out = applyReview({ srs: initialSrs(), masteryStatus: 'new' }, 'good', NOW);
    expect(out.intervalDays).toBe(1);
    expect(out.nextReviewAt).toBe(NOW + DAY);
    expect(out.srs.reps).toBe(1);
    expect(out.srs.streak).toBe(1);
    expect(out.srs.ease).toBe(2.5);
    expect(out.masteryStatus).toBe('learning');
  });

  it('连续 good 的间隔按 ease 递增：1 → 3 → 8 → 20', () => {
    expect(simulate(['good']).intervalDays).toBe(1);
    expect(simulate(['good', 'good']).intervalDays).toBe(3); // round(1 * 2.5)
    expect(simulate(['good', 'good', 'good']).intervalDays).toBe(8); // round(3 * 2.5)
    expect(simulate(['good', 'good', 'good', 'good']).intervalDays).toBe(20); // round(8 * 2.5)
  });

  it('good 不改变 ease', () => {
    expect(simulate(['good', 'good', 'good']).srs.ease).toBe(2.5);
  });

  it('nextReviewAt 恒等于 now + intervalDays 天', () => {
    const out = applyReview({ srs: initialSrs(), masteryStatus: 'new' }, 'good', NOW);
    expect(out.nextReviewAt - NOW).toBe(out.intervalDays * DAY);
  });
});

describe('again：忘了', () => {
  it('间隔清零、10 分钟后重来、ease 下降、streak 归零、lapses +1', () => {
    const before: SrsState = { reps: 3, streak: 3, ease: 2.5, intervalDays: 8, lapses: 0 };
    const out = applyReview({ srs: before, masteryStatus: 'reviewing' }, 'again', NOW);

    expect(out.intervalDays).toBe(0);
    expect(out.nextReviewAt).toBe(NOW + 10 * 60 * 1000);
    expect(out.srs.ease).toBe(2.3);
    expect(out.srs.streak).toBe(0);
    expect(out.srs.lapses).toBe(1);
    expect(out.srs.reps).toBe(4);
    expect(out.dueLabel).toBe('10 分钟后');
  });

  it('再次 again 继续累加 lapses', () => {
    expect(simulate(['again', 'again', 'again']).srs.lapses).toBe(3);
  });

  it('again 会把已掌握的单词降级回复习中', () => {
    const mastered = simulate(['good', 'good', 'good', 'good', 'good']);
    expect(mastered.masteryStatus).toBe('mastered');

    const out = applyReview(
      { srs: mastered.srs, masteryStatus: mastered.masteryStatus },
      'again',
      NOW,
    );
    expect(out.masteryStatus).toBe('reviewing');
    expect(out.masteredBy).toBeUndefined();
  });
});

describe('hard / easy：偏难与偏易', () => {
  it('首次 hard 间隔 1 天，ease −0.15', () => {
    const out = applyReview({ srs: initialSrs(), masteryStatus: 'new' }, 'hard', NOW);
    expect(out.intervalDays).toBe(1);
    expect(out.srs.ease).toBe(2.35);
    expect(out.srs.streak).toBe(1);
  });

  it('hard 只放大 1.2 倍', () => {
    const before: SrsState = { reps: 2, streak: 2, ease: 2.5, intervalDays: 10, lapses: 0 };
    const out = applyReview({ srs: before, masteryStatus: 'reviewing' }, 'hard', NOW);
    expect(out.intervalDays).toBe(12); // round(10 * 1.2)
  });

  it('首次 easy 间隔 3 天，ease +0.15', () => {
    const out = applyReview({ srs: initialSrs(), masteryStatus: 'new' }, 'easy', NOW);
    expect(out.intervalDays).toBe(3);
    expect(out.srs.ease).toBe(2.65);
    expect(out.srs.streak).toBe(1);
  });

  it('easy 额外 1.3 倍加成', () => {
    const before: SrsState = { reps: 2, streak: 2, ease: 2.5, intervalDays: 10, lapses: 0 };
    const out = applyReview({ srs: before, masteryStatus: 'reviewing' }, 'easy', NOW);
    expect(out.intervalDays).toBe(33); // round(10 * 2.5 * 1.3) = round(32.5) = 33
  });
});

describe('边界与数值安全', () => {
  it('连续 20 次 again，ease 不低于 1.3', () => {
    const result = simulate(Array<ReviewGrade>(20).fill('again'));
    expect(result.srs.ease).toBe(1.3);
    expect(result.srs.lapses).toBe(20);
    expect(result.srs.streak).toBe(0);
  });

  it('连续 20 次 easy，ease 不高于 2.8', () => {
    const result = simulate(Array<ReviewGrade>(20).fill('easy'));
    expect(result.srs.ease).toBe(2.8);
    expect(result.srs.ease).toBeLessThanOrEqual(2.8);
  });

  it('间隔上限 365 天', () => {
    const result = simulate(Array<ReviewGrade>(12).fill('easy'));
    expect(result.intervalDays).toBe(365);
    expect(result.srs.intervalDays).toBe(365);
  });

  it('混合评分序列不产生 NaN / Infinity', () => {
    const sequence: ReviewGrade[] = [
      'good',
      'easy',
      'again',
      'hard',
      'good',
      'easy',
      'again',
      'again',
      'good',
      'hard',
    ];
    let srs: SrsState = initialSrs();
    let masteryStatus: MasteryStatus = 'new';
    let now = NOW;

    for (const grade of sequence) {
      const out = applyReview({ srs, masteryStatus }, grade, now);
      for (const value of [
        out.srs.reps,
        out.srs.streak,
        out.srs.ease,
        out.srs.intervalDays,
        out.srs.lapses,
        out.intervalDays,
        out.nextReviewAt,
      ]) {
        expect(Number.isFinite(value)).toBe(true);
      }
      expect(out.srs.ease).toBeGreaterThanOrEqual(1.3);
      expect(out.srs.ease).toBeLessThanOrEqual(2.8);
      expect(out.intervalDays).toBeGreaterThanOrEqual(0);
      expect(out.intervalDays).toBeLessThanOrEqual(365);
      expect(Number.isInteger(out.intervalDays)).toBe(true);

      srs = out.srs;
      masteryStatus = out.masteryStatus;
      now = out.nextReviewAt;
    }
  });

  it('ease 保留两位小数', () => {
    // 2.5 - 7 × 0.15 = 1.45，仍在区间内，不应被夹取
    const result = simulate(Array<ReviewGrade>(7).fill('hard'));
    expect(result.srs.ease).toBe(1.45);
    expect(Math.round(result.srs.ease * 100) / 100).toBe(result.srs.ease);
  });

  it('连续 hard 也会把 ease 夹在下界 1.3', () => {
    expect(simulate(Array<ReviewGrade>(12).fill('hard')).srs.ease).toBe(1.3);
  });
});

describe('掌握判定', () => {
  it('streak = 4 但间隔只有 20 天时还不算掌握', () => {
    const result = simulate(['good', 'good', 'good', 'good']);
    expect(result.srs.streak).toBe(4);
    expect(result.intervalDays).toBe(20);
    expect(result.masteryStatus).toBe('reviewing');
    expect(result.masteredBy).toBeUndefined();
  });

  it('streak ≥ 4 且间隔 ≥ 21 天时判定为 mastered', () => {
    const result = simulate(['good', 'good', 'good', 'good', 'good']);
    expect(result.srs.streak).toBe(5);
    expect(result.intervalDays).toBe(50);
    expect(result.masteryStatus).toBe('mastered');
    expect(result.masteredBy).toBe('srs');
  });

  it('首次复习后是 learning，第二次起是 reviewing', () => {
    expect(simulate(['hard']).masteryStatus).toBe('learning');
    expect(simulate(['hard', 'hard']).masteryStatus).toBe('reviewing');
  });
});

describe('describeNextReview', () => {
  it('小于一天按小时表达', () => {
    expect(describeNextReview(0.25)).toBe('6 小时后');
    expect(describeNextReview(0.5)).toBe('12 小时后');
  });

  it('间隔为 0 时对应 again 的 10 分钟', () => {
    expect(describeNextReview(0)).toBe('10 分钟后');
  });

  it('一天说「明天」', () => {
    expect(describeNextReview(1)).toBe('明天');
  });

  it('不足 30 天按天表达', () => {
    expect(describeNextReview(3)).toBe('3 天后');
    expect(describeNextReview(29)).toBe('29 天后');
  });

  it('30 天以上按月表达', () => {
    expect(describeNextReview(30)).toBe('1 个月后');
    expect(describeNextReview(60)).toBe('2 个月后');
    expect(describeNextReview(365)).toBe('12 个月后');
  });
});

describe('isDue / dueQueue', () => {
  const entries = [
    {
      id: 'a',
      nextReviewAt: NOW + 1000,
      masteryStatus: 'reviewing' as MasteryStatus,
      createdAt: 10,
    },
    { id: 'b', masteryStatus: 'new' as MasteryStatus, createdAt: 20 },
    {
      id: 'c',
      nextReviewAt: NOW - 1000,
      masteryStatus: 'reviewing' as MasteryStatus,
      createdAt: 30,
    },
    {
      id: 'd',
      nextReviewAt: NOW + 500,
      masteryStatus: 'learning' as MasteryStatus,
      createdAt: 40,
    },
    {
      id: 'e',
      nextReviewAt: NOW - 1000,
      masteryStatus: 'learning' as MasteryStatus,
      createdAt: 5,
    },
  ];

  it('isDue 认未排期与已到期', () => {
    expect(isDue({ masteryStatus: 'new' }, NOW)).toBe(true);
    expect(isDue({ nextReviewAt: NOW - 1, masteryStatus: 'reviewing' }, NOW)).toBe(true);
    expect(isDue({ nextReviewAt: NOW, masteryStatus: 'reviewing' }, NOW)).toBe(true);
    expect(isDue({ nextReviewAt: NOW + 1, masteryStatus: 'reviewing' }, NOW)).toBe(false);
  });

  it('dueQueue 只保留到期或未排期的条目', () => {
    const queue = dueQueue(entries, NOW);
    expect(queue.map((entry) => entry.id)).toEqual(['b', 'e', 'c']);
  });

  it('dueQueue 按 nextReviewAt 升序，未排期排最前，同刻按 createdAt 升序', () => {
    const queue = dueQueue(entries, NOW);
    expect(queue).toHaveLength(3);
    expect(queue[0]?.id).toBe('b');
    // e 与 c 同一时刻，createdAt 更小的 e 在前
    expect(queue[1]?.id).toBe('e');
    expect(queue[2]?.id).toBe('c');
  });

  it('dueQueue 不修改原数组', () => {
    const before = entries.map((entry) => entry.id);
    dueQueue(entries, NOW);
    expect(entries.map((entry) => entry.id)).toEqual(before);
  });

  it('没有到期条目时返回空数组', () => {
    expect(dueQueue([entries[0]!], NOW)).toEqual([]);
  });
});

describe('确定性', () => {
  it('同一输入两次调用结果完全一致', () => {
    const before: SrsState = { reps: 5, streak: 2, ease: 2.15, intervalDays: 9, lapses: 1 };
    const first = applyReview({ srs: before, masteryStatus: 'reviewing' }, 'good', NOW);
    const second = applyReview({ srs: before, masteryStatus: 'reviewing' }, 'good', NOW);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  it('整条序列重跑一遍得到同样的最终状态', () => {
    const sequence: ReviewGrade[] = ['good', 'easy', 'hard', 'again', 'good', 'good'];
    const a = simulate(sequence);
    const b = simulate(sequence);
    expect(a.srs).toEqual(b.srs);
    expect(a.masteryStatus).toBe(b.masteryStatus);
    expect(a.nextReviewAt).toBe(b.nextReviewAt);
  });

  it('传入状态不被就地修改', () => {
    const before: SrsState = { reps: 1, streak: 1, ease: 2.5, intervalDays: 1, lapses: 0 };
    const snapshot = { ...before };
    applyReview({ srs: before, masteryStatus: 'learning' }, 'again', NOW);
    expect(before).toEqual(snapshot);
  });
});

describe('SRS_ALGORITHM_DOC', () => {
  it('四种评分都有中文说明', () => {
    expect(SRS_ALGORITHM_DOC.grades.map((item) => item.grade)).toEqual([
      'again',
      'hard',
      'good',
      'easy',
    ]);
    expect(SRS_ALGORITHM_DOC.grades.every((item) => item.label.length > 0)).toBe(true);
    expect(SRS_ALGORITHM_DOC.grades.every((item) => item.effect.length > 10)).toBe(true);
  });

  it('说清了掌握门槛与「不是点击次数」', () => {
    expect(SRS_ALGORITHM_DOC.masteryRule).toContain('21 天');
    expect(SRS_ALGORITHM_DOC.notes.some((note) => note.includes('点击次数'))).toBe(true);
    expect(SRS_ALGORITHM_DOC.notes.length).toBeGreaterThanOrEqual(3);
  });
});
