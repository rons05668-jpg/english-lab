import type { Category, Level } from '../types';
import raw from './brief.json';

/**
 * 文章轻量索引
 *
 * 只含列表与首页需要的元数据（标题、字数、摘要、词表），不含全文、题目、语法点。
 * 完整 Article 仍在 level*.json 里，只有阅读器与测验页需要时才会加载。
 *
 * 单独成模块是为了让首页可以只引用它，从而不把 400KB 的全文数据带进首屏。
 */
export interface ArticleBrief {
  id: string;
  title: string;
  titleZh: string;
  level: Level;
  category: Category;
  tags?: string[];
  /** 按 [A-Za-z][A-Za-z'-]* 计数，与 articleWords 同口径 */
  wordCount: number;
  /** 按 150 wpm 估算，最小 1 分钟 */
  minutes: number;
  /** 重点词，供文章库搜索命中 */
  vocabWords: string[];
  vocabCount: number;
  /** 首段首句，作列表摘要 */
  excerpt: string;
}

export const ARTICLE_BRIEF: ArticleBrief[] = raw as ArticleBrief[];

export { LEVELS } from './levels';

export const BRIEF_BY_ID: Map<string, ArticleBrief> = new Map(ARTICLE_BRIEF.map((a) => [a.id, a]));

export function getBrief(id: string): ArticleBrief | undefined {
  return BRIEF_BY_ID.get(id);
}

export function briefsByLevel(level: Level): ArticleBrief[] {
  return ARTICLE_BRIEF.filter((a) => a.level === level);
}

export const BRIEF_CATEGORIES: string[] = Array.from(new Set(ARTICLE_BRIEF.map((a) => a.category))).sort();

export const BRIEF_TOTAL_WORDS: number = ARTICLE_BRIEF.reduce((n, a) => n + a.wordCount, 0);
