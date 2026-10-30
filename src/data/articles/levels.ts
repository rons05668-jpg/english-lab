import type { Level } from '../types';

/**
 * 难度分级的展示文案。
 * 单独成模块，让只读元数据的页面（首页、文章库）不必引入完整文章数据。
 */
export const LEVELS: { level: Level; name: string; desc: string; range: string }[] = [
  { level: 1, name: '基础阅读', desc: '高频生活词汇与简单句，先把阅读习惯建立起来', range: '100–150 词' },
  { level: 2, name: '四级基础', desc: '四级高频词与常见从句，打牢句子结构', range: '150–250 词' },
  { level: 3, name: '四级进阶', desc: '复杂句法与观点论证，开始做词义推断', range: '250–400 词' },
  { level: 4, name: '考研过渡', desc: '接近英语二风格，训练长难句与作者态度', range: '350–450 词' },
];
