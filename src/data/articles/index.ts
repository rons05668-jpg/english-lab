import type { Article, Level } from '../types';
import level1 from './level1.json';
import level2 from './level2.json';
import level3 from './level3.json';
import level4 from './level4.json';

/**
 * JSON 数据在构建期被静态打包，类型由 Article 断言。
 * 结构完整性由 scripts/validate-articles.mjs 在 CI/本地校验，运行时只做轻量兜底。
 */
const RAW: Article[][] = [
  level1 as unknown as Article[],
  level2 as unknown as Article[],
  level3 as unknown as Article[],
  level4 as unknown as Article[],
];

export const ARTICLES: Article[] = RAW.flat().filter((a) => a && Array.isArray(a.paragraphs));

export const ARTICLE_MAP: Map<string, Article> = new Map(ARTICLES.map((a) => [a.id, a]));

export function getArticle(id: string): Article | undefined {
  return ARTICLE_MAP.get(id);
}

export function articlesByLevel(level: Level): Article[] {
  return ARTICLES.filter((a) => a.level === level);
}

export { LEVELS } from './levels';

const wordCache = new Map<string, number>();
const minuteCache = new Map<string, number>();

/** 文章词数：按 [A-Za-z][A-Za-z'-]* 计数，与 text.countWords 口径一致 */
export function articleWords(article: Article): number {
  const hit = wordCache.get(article.id);
  if (hit !== undefined) return hit;
  const text = article.paragraphs
    .flatMap((p) => p.sentences.map((s) => s.en))
    .join(' ');
  const n = (text.match(/[A-Za-z][A-Za-z'-]*/g) || []).length;
  wordCache.set(article.id, n);
  return n;
}

/** 预估阅读时间：按 150 wpm 向上取整，最小 1 分钟 */
export function articleMinutes(article: Article): number {
  const hit = minuteCache.get(article.id);
  if (hit !== undefined) return hit;
  const m = Math.max(1, Math.ceil(articleWords(article) / 150));
  minuteCache.set(article.id, m);
  return m;
}

export function articleSentences(article: Article): { en: string; zh: string; paraIndex: number; sentIndex: number; globalIndex: number }[] {
  const out: { en: string; zh: string; paraIndex: number; sentIndex: number; globalIndex: number }[] = [];
  let g = 0;
  article.paragraphs.forEach((p, pi) => {
    p.sentences.forEach((s, si) => {
      out.push({ en: s.en, zh: s.zh, paraIndex: pi, sentIndex: si, globalIndex: g++ });
    });
  });
  return out;
}

export const CATEGORY_LIST: string[] = Array.from(new Set(ARTICLES.map((a) => a.category)));

export const TOTAL_WORDS = ARTICLES.reduce((n, a) => n + articleWords(a), 0);
