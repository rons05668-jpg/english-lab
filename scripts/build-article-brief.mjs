/**
 * 生成文章轻量索引 brief.json
 *
 * 背景：44 篇文章的全文、题目、语法点合计约 400KB，全部打进一个 chunk。
 * 但首页 / 文章库 / 继续阅读只需要标题、字数、摘要、词表这类元数据。
 * 在 30KB/s 的低带宽下，让首页为用不到的全文买单要等十几秒。
 *
 * 本脚本抽出元数据供首屏使用，完整 Article 仍留在 level*.json 里按需加载。
 *
 * 用法：node scripts/build-article-brief.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'src/data/articles');
const OUT = path.join(DIR, 'brief.json');

const LEVELS = ['level1', 'level2', 'level3', 'level4'];

/** 与 src/data/articles/index.ts 的 articleWords 保持同一口径 */
function countWords(article) {
  const text = article.paragraphs.flatMap((p) => p.sentences.map((s) => s.en)).join(' ');
  return (text.match(/[A-Za-z][A-Za-z'-]*/g) || []).length;
}

const briefs = [];
for (const level of LEVELS) {
  const file = path.join(DIR, `${level}.json`);
  if (!fs.existsSync(file)) continue;
  const list = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const article of list) {
    const wordCount = countWords(article);
    briefs.push({
      id: article.id,
      title: article.title,
      titleZh: article.titleZh,
      level: article.level,
      category: article.category,
      ...(article.tags ? { tags: article.tags } : {}),
      wordCount,
      minutes: Math.max(1, Math.ceil(wordCount / 150)),
      /** 文章库搜索用：标题之外还能按重点词命中 */
      vocabWords: (article.keyVocab ?? []).map((v) => v.word),
      vocabCount: (article.keyVocab ?? []).length,
      /** 列表摘要：首段首句 */
      excerpt: article.paragraphs?.[0]?.sentences?.[0]?.en ?? '',
    });
  }
}

briefs.sort((a, b) => (a.level - b.level) || a.id.localeCompare(b.id));
fs.writeFileSync(OUT, JSON.stringify(briefs));

const bytes = fs.statSync(OUT).size;
console.log('文章数:', briefs.length);
console.log('brief.json 体积:', (bytes / 1024).toFixed(1) + 'KB');
console.log('各 level:', LEVELS.map((l) => {
  const n = briefs.filter((b) => b.id.startsWith(l.replace('level', 'l'))).length;
  return `${l}=${n}`;
}).join(' '));
