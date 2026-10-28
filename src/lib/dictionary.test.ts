import { describe, expect, it } from 'vitest';
import { lookupWord } from './dict';
import { loadOfflineDictionary, lookupOffline } from './offline-dictionary';
import metadata from '../data/ecdict-meta.json';
import { ARTICLES, articleWords } from '../data/articles';

describe('扩充词典与文章', () => {
  it('实际词库数量与来源清单一致，音标或释义缺失不会被编造', async () => {
    const data = await loadOfflineDictionary();
    expect(Object.keys(data.entries)).toHaveLength(metadata.entries);
    expect(metadata.entries).toBeGreaterThan(35000);
    expect(Object.values(data.entries).every((row) => /[\u4e00-\u9fff]/.test(row[0]))).toBe(true);
  });
  it('原核心词典之外的词也可离线查询中文义项', async () => {
    const result = await lookupOffline(['photosynthesis']);
    expect(result?.senses.map((sense) => sense.definition).join('')).toContain('光合');
  });
  it('词形索引能找回未独立收录的复数形式', async () => {
    const result = await lookupOffline(['bicycles']);
    expect(result?.lemma).toBe('bicycle');
  });
  it('不存在的词不会返回虚构释义', async () => {
    const result = await lookupWord('zzenglishlabunknownzz', { online: false });
    expect(result.pending).toBe(true);
    expect(result.senses).toEqual([]);
  });
  it('其他文章的标注不能冒充当前句子的语境义', async () => {
    const result = await lookupWord('rush', { articleId: 'l4-09', sentence: 'There is no rush.' });
    expect(result.contextual?.basis).not.toBe('article-glossary');
  });
  it('新增十二篇独立文章，每篇保留译文、解析、三种题型和不同答案位置', () => {
    expect(ARTICLES).toHaveLength(42);
    const added = ARTICLES.filter((a) => a.tags?.includes('扩充阅读'));
    expect(added).toHaveLength(12);
    expect(new Set(added.map((a) => a.title)).size).toBe(12);
    for (const article of added) {
      expect(articleWords(article)).toBeGreaterThanOrEqual(({ 1: 120, 2: 150, 3: 250, 4: 350 })[article.level]);
      expect(new Set(article.quiz.map((q) => q.type)).size).toBe(3);
      expect(new Set(article.quiz.map((q) => q.answer)).size).toBe(3);
    }
  });
});
