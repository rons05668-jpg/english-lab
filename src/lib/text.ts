/**
 * 文本处理：分词渲染、词数统计、切句、文章展平、时间格式化。
 *
 * 词数口径（全站唯一规则）：
 *   一个"英文单词" = 以字母开头、后接字母/撇号/连字符的一段字符（见 countWords 的正则）。
 *   - 连字符复合词算 1 个词：state-of-the-art → 1，well-known → 1
 *   - 缩写算 1 个词：don't → 1
 *   - 纯数字（2026）、纯标点、纯符号不计词
 *   - 数字开头的混合串（3D / COVID-19）计 1 个词（以字母开头的那一段）
 *   渲染用的 tokenize 与统计用的 countWords 使用同一套"词"的边界规则，
 *   保证界面上看到的高亮单词数与阅读词数一致。
 */

import type { Article } from '../data/types';

export type TokenType = 'word' | 'space' | 'punct';

export interface Token {
  type: TokenType;
  text: string;
  start: number;
  end: number;
}

/** 构成单词主体的字符（字母 + 数字，数字只作为词内成分） */
const WORD_CHAR = /[A-Za-z0-9]/;
/** 可以出现在单词内部的连接符（直撇号 / 弯撇号 / 连字符） */
const WORD_JOINER = /['\u2019-]/;

/** 把一句英文切成可渲染的 token；单词保留内部连字符与撇号（don't / well-known） */
export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const n = text.length;
  let i = 0;

  while (i < n) {
    const ch = text[i];

    // 连续空白合成一个 space token，便于用 white-space: pre-wrap 原样还原
    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < n && /\s/.test(text[j])) j += 1;
      tokens.push({ type: 'space', text: text.slice(i, j), start: i, end: j });
      i = j;
      continue;
    }

    // 单词：字母/数字开头，内部允许撇号或连字符（且其后必须还是单词字符）
    if (WORD_CHAR.test(ch)) {
      let j = i + 1;
      while (j < n) {
        const c = text[j];
        if (WORD_CHAR.test(c)) {
          j += 1;
          continue;
        }
        if (WORD_JOINER.test(c) && j + 1 < n && WORD_CHAR.test(text[j + 1])) {
          j += 2;
          continue;
        }
        break;
      }
      tokens.push({ type: 'word', text: text.slice(i, j), start: i, end: j });
      i = j;
      continue;
    }

    // 其余一律标点，连续标点合并（如 ." / ,) ），不影响拼回原文
    let j = i + 1;
    while (j < n && !/\s/.test(text[j]) && !WORD_CHAR.test(text[j])) j += 1;
    tokens.push({ type: 'punct', text: text.slice(i, j), start: i, end: j });
    i = j;
  }

  return tokens;
}

/**
 * 英文单词计数：按 [A-Za-z][A-Za-z'-]* 计，纯数字与标点不计。
 * 连字符复合词（state-of-the-art）按 1 个词计——它是"一个词汇单位"，
 * 与 tokenize 的高亮单元保持一致；若按音节拆开会高估阅读量。
 */
export function countWords(text: string): number {
  if (!text) return 0;
  // 弯撇号先归一化，避免 don’t 被拆成 don + t
  const normalized = text.replace(/[\u2018\u2019]/g, "'");
  const matched = normalized.match(/[A-Za-z][A-Za-z'-]*/g);
  return matched ? matched.length : 0;
}

/** 预估阅读时间（分钟），默认 150 wpm，向上取整，最小 1 */
export function readingMinutes(words: number, wpm = 150): number {
  const speed = wpm > 0 ? wpm : 150;
  if (!Number.isFinite(words) || words <= 0) return 1;
  return Math.max(1, Math.ceil(words / speed));
}

/** 句末缩写：这些点不是句号 */
const ABBREVIATIONS = new Set([
  'mr',
  'mrs',
  'ms',
  'dr',
  'prof',
  'sr',
  'jr',
  'st',
  'mt',
  'vs',
  'fig',
  'no',
  'inc',
  'ltd',
  'co',
  'e.g',
  'i.e',
  'u.s',
  'u.k',
  'a.m',
  'p.m',
  'jan',
  'feb',
  'mar',
  'apr',
  'jun',
  'jul',
  'aug',
  'sep',
  'sept',
  'oct',
  'nov',
  'dec',
]);

/** 句末引号 / 右括号，允许跟在标点之后仍属于同一句 */
const CLOSERS = /["'\u201d\u2019)\]]/;

/** 取句号前面那一段"词"（允许中间带点，用于 e.g. / U.S.） */
function wordBeforeDot(text: string, dotIndex: number): string {
  let i = dotIndex;
  while (i > 0 && /[A-Za-z.]/.test(text[i - 1])) i -= 1;
  return text.slice(i, dotIndex);
}

/**
 * 按 . ! ? 切句，正确处理 Mr. Dr. e.g. i.e. U.S. 等缩写与引号结尾。
 * 判定规则：标点后必须跟空白或到达文末才可能是句末；句号还要排除缩写与单个大写首字母（J. K. Rowling）。
 */
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  if (!text) return out;

  let start = 0;
  const re = /[.!?]+/g;
  let match: RegExpExecArray | null = re.exec(text);

  while (match !== null) {
    const punctStart = match.index;
    let end = punctStart + match[0].length;
    while (end < text.length && CLOSERS.test(text[end])) end += 1;

    let boundary = false;
    if (end >= text.length) {
      boundary = true;
    } else if (/\s/.test(text[end])) {
      const isSingleDot = match[0] === '.';
      if (!isSingleDot) {
        boundary = true;
      } else {
        const word = wordBeforeDot(text, punctStart);
        const lower = word.toLowerCase();
        const isInitial = word.length === 1 && /[A-Z]/.test(word);
        boundary = !isInitial && !ABBREVIATIONS.has(lower);
      }
    }

    if (boundary) {
      const piece = text.slice(start, end).trim();
      if (piece) out.push(piece);
      start = end;
      re.lastIndex = end;
    }

    match = re.exec(text);
  }

  const tail = text.slice(start).trim();
  if (tail) out.push(tail);
  return out;
}

export interface FlatSentence {
  en: string;
  zh: string;
  paraIndex: number;
  sentIndex: number;
  globalIndex: number;
}

/** 展平文章句子，globalIndex 从 0 连续递增（阅读进度与词数统计共用此口径） */
export function flattenSentences(article: Article): FlatSentence[] {
  const flat: FlatSentence[] = [];
  let globalIndex = 0;
  article.paragraphs.forEach((paragraph, paraIndex) => {
    paragraph.sentences.forEach((sentence, sentIndex) => {
      flat.push({
        en: sentence.en,
        zh: sentence.zh,
        paraIndex,
        sentIndex,
        globalIndex,
      });
      globalIndex += 1;
    });
  });
  return flat;
}

/** 全文词数（按句子累加，与阅读进度的 wordsRead 同一口径） */
export function articleWordCount(article: Article): number {
  let total = 0;
  for (const paragraph of article.paragraphs) {
    for (const sentence of paragraph.sentences) {
      total += countWords(sentence.en);
    }
  }
  return total;
}

/** 全文句子数 */
export function articleSentenceCount(article: Article): number {
  let total = 0;
  for (const paragraph of article.paragraphs) total += paragraph.sentences.length;
  return total;
}

/**
 * 已读句子对应的累计词数（用于"实际阅读词数"口径）。
 * sentenceIndex 为"最后一句已读句"的全局下标；越界自动收敛，负数返回 0。
 */
export function wordsUpTo(flat: FlatSentence[], sentenceIndex: number): number {
  if (sentenceIndex < 0 || flat.length === 0) return 0;
  const last = Math.min(sentenceIndex, flat.length - 1);
  let total = 0;
  for (let i = 0; i <= last; i += 1) total += countWords(flat[i].en);
  return total;
}

/** 截断文本用于卡片摘要，尽量在词边界断开 */
export function excerpt(text: string, maxLen: number): string {
  if (maxLen <= 0) return '';
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  const cut = trimmed.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  const body = lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${body.trimEnd()}…`;
}

/** "约 3 分钟" */
export function formatMinutes(min: number): string {
  const value = Number.isFinite(min) ? Math.max(0, Math.round(min)) : 0;
  return `约 ${value} 分钟`;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** 本地时区的日序号（按年月日折算成 UTC 天数，规避夏令时） */
function localDayNumber(ts: number): number {
  const d = new Date(ts);
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
}

/** 本地时区 YYYY-MM-DD */
export function todayKey(now: number): string {
  const d = new Date(now);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** "刚刚" / "5 分钟前" / "昨天" / "3 天前" / "2026-10-01" */
export function formatRelativeTime(ts: number, now: number): string {
  const diff = now - ts;
  if (!Number.isFinite(diff) || diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;

  const dayGap = localDayNumber(now) - localDayNumber(ts);
  if (dayGap <= 0) return `${Math.floor(diff / 3_600_000)} 小时前`;
  if (dayGap === 1) return '昨天';
  if (dayGap < 7) return `${dayGap} 天前`;
  return todayKey(ts);
}
