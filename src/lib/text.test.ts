import { describe, expect, it } from 'vitest';
import type { Article } from '../data/types';
import {
  articleSentenceCount,
  articleWordCount,
  countWords,
  excerpt,
  flattenSentences,
  formatMinutes,
  formatRelativeTime,
  readingMinutes,
  splitSentences,
  todayKey,
  tokenize,
  wordsUpTo,
} from './text';

/** 构造满足 Article 类型的最小文章（只填必需字段） */
function makeArticle(
  id: string,
  paragraphs: { en: string; zh: string }[][],
  level: 1 | 2 | 3 | 4 = 1,
): Article {
  return {
    id,
    title: `Title ${id}`,
    titleZh: `标题 ${id}`,
    level,
    category: '生活',
    paragraphs: paragraphs.map((sentences) => ({ sentences })),
    keyVocab: [],
    grammar: [],
    glossary: {},
    quiz: [],
    source: 'test',
    license: 'CC0',
  };
}

describe('tokenize', () => {
  const text = "He didn't well-known dogs.";
  const tokens = tokenize(text);

  it('词/空白/标点类型序列正确', () => {
    expect(tokens.map((t) => t.type)).toEqual([
      'word',
      'space',
      'word',
      'space',
      'word',
      'space',
      'word',
      'punct',
    ]);
  });

  it('单词保留内部撇号与连字符', () => {
    expect(tokens.map((t) => t.text)).toEqual([
      'He',
      ' ',
      "didn't",
      ' ',
      'well-known',
      ' ',
      'dogs',
      '.',
    ]);
  });

  it('start/end 偏移与原文一致', () => {
    expect(tokens[0]).toEqual({ type: 'word', text: 'He', start: 0, end: 2 });
    expect(tokens[2]).toEqual({ type: 'word', text: "didn't", start: 3, end: 9 });
    expect(tokens[4]).toEqual({ type: 'word', text: 'well-known', start: 10, end: 20 });
    expect(tokens[6]).toEqual({ type: 'word', text: 'dogs', start: 21, end: 25 });
    expect(tokens[7]).toEqual({ type: 'punct', text: '.', start: 25, end: 26 });
  });

  it('每个 token 的切片等于 text.slice(start, end)', () => {
    for (const token of tokens) {
      expect(token.text).toBe(text.slice(token.start, token.end));
    }
  });

  it('拼回原文完全相等', () => {
    expect(tokens.map((t) => t.text).join('')).toBe(text);
  });

  it('空串返回空数组', () => {
    expect(tokenize('')).toEqual([]);
  });

  it('纯标点不抛错且全是 punct', () => {
    const result = tokenize('…!!? —');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((t) => t.type === 'punct' || t.type === 'space')).toBe(true);
    expect(result.map((t) => t.text).join('')).toBe('…!!? —');
  });

  it('连续空格合并成一个 space token', () => {
    const result = tokenize('a   b');
    expect(result[1]).toEqual({ type: 'space', text: '   ', start: 1, end: 4 });
    expect(result.map((t) => t.text).join('')).toBe('a   b');
  });

  it('中文混排不抛错且可原样还原', () => {
    const mixed = '你好 world，OK!';
    const result = tokenize(mixed);
    expect(result.map((t) => t.text).join('')).toBe(mixed);
    expect(result.some((t) => t.type === 'word' && t.text === 'world')).toBe(true);
  });

  it('句末标点与引号合并为 punct', () => {
    const result = tokenize('"Stop."');
    expect(result.map((t) => t.type)).toEqual(['punct', 'word', 'punct']);
    expect(result[2].text).toBe('."');
  });
});

describe('countWords', () => {
  it('常规句子按词计数', () => {
    expect(countWords("He didn't well-known dogs.")).toBe(4);
  });

  it('连字符复合词计 1 个词', () => {
    expect(countWords('state-of-the-art')).toBe(1);
    expect(countWords('a well-known fact')).toBe(3);
  });

  it('纯数字与标点不计词', () => {
    expect(countWords('2026 — 10:30')).toBe(0);
    expect(countWords('!!!')).toBe(0);
  });

  it('数字与字母混排只计字母段', () => {
    expect(countWords('has 3 dogs')).toBe(2);
    expect(countWords('3D')).toBe(1);
  });

  it('空串为 0', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });

  it('弯撇号与直撇号计数一致', () => {
    expect(countWords('don\u2019t stop')).toBe(2);
  });

  it('与 tokenize 的 word token 数一致', () => {
    const text = 'The quick brown fox jumps over the lazy dog.';
    const wordTokens = tokenize(text).filter((t) => t.type === 'word').length;
    expect(countWords(text)).toBe(wordTokens);
  });
});

describe('readingMinutes', () => {
  it('默认 150 wpm 向上取整', () => {
    expect(readingMinutes(150)).toBe(1);
    expect(readingMinutes(151)).toBe(2);
    expect(readingMinutes(300)).toBe(2);
  });

  it('最小 1 分钟', () => {
    expect(readingMinutes(0)).toBe(1);
    expect(readingMinutes(3)).toBe(1);
  });

  it('自定义 wpm 生效，非法 wpm 回落 150', () => {
    expect(readingMinutes(300, 300)).toBe(1);
    expect(readingMinutes(300, 0)).toBe(2);
  });
});

describe('splitSentences', () => {
  it('缩写 Mr. 不误切', () => {
    expect(splitSentences('Mr. Smith went home. He was tired!')).toEqual([
      'Mr. Smith went home.',
      'He was tired!',
    ]);
  });

  it('Dr. 不误切', () => {
    expect(splitSentences('Dr. Lee is here. Please wait.')).toEqual([
      'Dr. Lee is here.',
      'Please wait.',
    ]);
  });

  it('e.g. 与 i.e. 不误切', () => {
    expect(splitSentences('Use e.g. apples and pears. Then stop.')).toEqual([
      'Use e.g. apples and pears.',
      'Then stop.',
    ]);
    expect(splitSentences('It is i.e. the same thing. Really.')).toEqual([
      'It is i.e. the same thing.',
      'Really.',
    ]);
  });

  it('U.S. 不误切', () => {
    expect(splitSentences('The U.S. Army is large. It is.')).toEqual([
      'The U.S. Army is large.',
      'It is.',
    ]);
  });

  it('引号结尾正确处理', () => {
    expect(splitSentences('He said "Stop." Then he left.')).toEqual([
      'He said "Stop."',
      'Then he left.',
    ]);
    expect(splitSentences('"Stop."')).toEqual(['"Stop."']);
  });

  it('问号感叹号也切句', () => {
    expect(splitSentences('Really? Yes! Fine.')).toEqual(['Really?', 'Yes!', 'Fine.']);
  });

  it('无标点文本整体一句，空串返回空数组', () => {
    expect(splitSentences('No punctuation here')).toEqual(['No punctuation here']);
    expect(splitSentences('')).toEqual([]);
  });

  it('人名首字母缩写不误切', () => {
    expect(splitSentences('J. K. Rowling wrote it. We read it.')).toEqual([
      'J. K. Rowling wrote it.',
      'We read it.',
    ]);
  });
});

describe('flattenSentences / 词数', () => {
  const article = makeArticle('a1', [
    [
      { en: 'First sentence here.', zh: '第一句。' },
      { en: 'Second one.', zh: '第二句。' },
    ],
    [{ en: 'Third sentence is longer.', zh: '第三句。' }],
  ]);

  it('globalIndex 连续递增', () => {
    const flat = flattenSentences(article);
    expect(flat.map((s) => s.globalIndex)).toEqual([0, 1, 2]);
  });

  it('段落与段内序号正确', () => {
    const flat = flattenSentences(article);
    expect(flat.map((s) => s.paraIndex)).toEqual([0, 0, 1]);
    expect(flat.map((s) => s.sentIndex)).toEqual([0, 1, 0]);
    expect(flat[2].en).toBe('Third sentence is longer.');
    expect(flat[0].zh).toBe('第一句。');
  });

  it('articleWordCount 与逐句累加一致', () => {
    expect(articleWordCount(article)).toBe(3 + 2 + 4);
  });

  it('articleSentenceCount 正确', () => {
    expect(articleSentenceCount(article)).toBe(3);
  });

  it('空文章词数句数为 0', () => {
    const empty = makeArticle('a2', []);
    expect(articleWordCount(empty)).toBe(0);
    expect(articleSentenceCount(empty)).toBe(0);
  });
});

describe('wordsUpTo', () => {
  const article = makeArticle('a3', [
    [
      { en: 'one two three', zh: '' },
      { en: 'four five', zh: '' },
      { en: 'six', zh: '' },
    ],
  ]);
  const flat = flattenSentences(article);

  it('负数为 0', () => {
    expect(wordsUpTo(flat, -1)).toBe(0);
  });

  it('第 0 句只算第一句', () => {
    expect(wordsUpTo(flat, 0)).toBe(3);
  });

  it('累计到第 1 句', () => {
    expect(wordsUpTo(flat, 1)).toBe(5);
  });

  it('越界收敛到全文词数', () => {
    expect(wordsUpTo(flat, 99)).toBe(6);
  });

  it('空数组安全', () => {
    expect(wordsUpTo([], 3)).toBe(0);
  });
});

describe('excerpt / formatMinutes', () => {
  it('短文本原样返回', () => {
    expect(excerpt('short text', 40)).toBe('short text');
  });

  it('长文本截断并加省略号', () => {
    const result = excerpt('The quick brown fox jumps over the lazy dog', 20);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(21);
  });

  it('maxLen <= 0 返回空串', () => {
    expect(excerpt('abc', 0)).toBe('');
  });

  it('格式化分钟', () => {
    expect(formatMinutes(3)).toBe('约 3 分钟');
    expect(formatMinutes(0)).toBe('约 0 分钟');
  });
});

describe('todayKey', () => {
  it('本地时区日期正确', () => {
    expect(todayKey(new Date(2026, 9, 28, 15, 30).getTime())).toBe('2026-10-28');
  });

  it('深夜与凌晨仍属同一天', () => {
    expect(todayKey(new Date(2026, 0, 1, 0, 5).getTime())).toBe('2026-01-01');
    expect(todayKey(new Date(2026, 0, 1, 23, 55).getTime())).toBe('2026-01-01');
  });

  it('月份与日期补零', () => {
    expect(todayKey(new Date(2026, 2, 5, 12, 0).getTime())).toBe('2026-03-05');
  });
});

describe('formatRelativeTime', () => {
  const now = new Date(2026, 9, 28, 12, 0, 0).getTime();

  it('刚刚', () => {
    expect(formatRelativeTime(now - 30_000, now)).toBe('刚刚');
  });

  it('分钟前', () => {
    expect(formatRelativeTime(now - 5 * 60_000, now)).toBe('5 分钟前');
  });

  it('小时前', () => {
    expect(formatRelativeTime(now - 3 * 3_600_000, now)).toBe('3 小时前');
  });

  it('昨天', () => {
    expect(formatRelativeTime(new Date(2026, 9, 27, 20, 0).getTime(), now)).toBe('昨天');
  });

  it('天前', () => {
    expect(formatRelativeTime(new Date(2026, 9, 25, 20, 0).getTime(), now)).toBe('3 天前');
  });

  it('超过一周显示日期', () => {
    expect(formatRelativeTime(new Date(2026, 9, 1, 20, 0).getTime(), now)).toBe('2026-10-01');
  });
});
