import fs from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { lookupWord } from './dict';
import { lookupOffline, resolveShardName } from './offline-dictionary';
import { ARTICLES, articleWords } from '../data/articles';

const DICT_DIR = path.resolve(import.meta.dirname, '../../public/dict');

/** 用真实分片文件替换 fetch，让查询链路在测试里跑通 */
beforeAll(() => {
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);
    const rel = url.replace(/^.*\/dict\//, '');
    const file = path.join(DICT_DIR, rel);
    if (!fs.existsSync(file)) return new Response('not found', { status: 404 });
    return new Response(fs.readFileSync(file), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;
});

describe('离线词典分片', () => {
  it('分片清单完整，且单片体积受控（避免点词要下载数百 KB）', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(DICT_DIR, 'manifest.json'), 'utf8')) as {
      shards: string[];
    };
    expect(manifest.shards.length).toBeGreaterThan(1000);

    let total = 0;
    let max = 0;
    for (const name of manifest.shards) {
      const size = fs.statSync(path.join(DICT_DIR, `${name}.json`)).size;
      total += size;
      max = Math.max(max, size);
    }
    // 单片上限 60KB 是生成脚本的硬约束，这里防止回退
    expect(max).toBeLessThanOrEqual(64 * 1024);
    expect(total).toBeLessThan(20 * 1024 * 1024);
  });

  it('分片名按前缀分层解析：长前缀优先，取不到则回退到短前缀', () => {
    const shards = new Set(['ab', 'co', 'con', 'cons']);
    expect(resolveShardName('constant', shards)).toBe('cons');
    expect(resolveShardName('contract', shards)).toBe('con');
    expect(resolveShardName('coconut', shards)).toBe('co');
    expect(resolveShardName('abstract', shards)).toBe('ab');
    expect(resolveShardName('zzzz', shards)).toBeNull();
    // Windows 保留设备名的分片在生成时带尾部下划线
    expect(resolveShardName('auxiliary', new Set(['au', 'aux_']))).toBe('aux_');
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
});

describe('扩充文章', () => {
  it('新增十二篇独立文章，每篇保留译文、解析、三种题型和不同答案位置', () => {
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
