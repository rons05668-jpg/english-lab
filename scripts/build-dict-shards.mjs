/**
 * 生成按需加载的离线词典分片（public/dict/）
 *
 * 背景：原实现用 import.meta.glob 把 740 个 ECDICT 分片（26.3MB）打包成 JS chunk，
 * 每个 chunk 300–800KB。在低带宽下点一个词要下载数秒到数十秒，用户感知为"没有释义"。
 *
 * 本脚本做三件事：
 *   1. 瘦身：只保留「有音标的词条」或「文章正文出现过的词」，剔掉大量生僻专有名词
 *   2. 细分：按前两字符分组，超过 SPLIT_THRESHOLD 的组再按第三字符拆分，控制单片体积
 *   3. 产出 manifest.json 记录分片清单与拆分规则，供运行时定位
 *
 * 输出为普通静态 JSON（public/dict/），运行时用 fetch 读取，不再进入 JS 打包。
 *
 * 用法：node scripts/build-dict-shards.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'src/data/ecdict');
const OUT_DIR = path.join(ROOT, 'public/dict');
const ARTICLES_DIR = path.join(ROOT, 'src/data/articles');

/** 单个分片的目标上限（字节）。超过则按第三字符再拆。 */
const SPLIT_THRESHOLD = 60 * 1024;

/* ---------- 1. 收集文章词汇（这些词必须保留，无论有无音标） ---------- */
const articleWords = new Set();
for (const level of ['level1', 'level2', 'level3', 'level4']) {
  const file = path.join(ARTICLES_DIR, `${level}.json`);
  if (!fs.existsSync(file)) continue;
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const list = Array.isArray(raw) ? raw : raw.articles ?? Object.values(raw);
  for (const article of list) {
    for (const sentence of article.sentences ?? []) {
      for (const w of (sentence.en ?? '').toLowerCase().match(/[a-z][a-z'-]*/g) ?? []) articleWords.add(w);
    }
    for (const k of Object.keys(article.glossary ?? {})) articleWords.add(k.toLowerCase());
    for (const kv of article.keyVocab ?? []) if (kv.word) articleWords.add(String(kv.word).toLowerCase());
  }
}

/* ---------- 2. 读取并筛选词条（两阶段：先定词条，再定变形索引） ---------- */
const shardFiles = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.json'));

// 阶段一：确定保留哪些词条
const keptEntries = new Map(); // word -> row
for (const file of shardFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(SRC_DIR, file), 'utf8'));
  for (const [word, row] of Object.entries(data.entries ?? {})) {
    const hasPhonetic = Boolean(row[1] && String(row[1]).length);
    if (!hasPhonetic && !articleWords.has(word)) continue;
    keptEntries.set(word, row);
  }
}

// 阶段二：变形索引只要指向仍然保留的词条就保留（bicycles -> bicycle 这类必须留下）
const keptForms = new Map(); // form -> [lemma]
for (const file of shardFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(SRC_DIR, file), 'utf8'));
  for (const [form, lemmas] of Object.entries(data.forms ?? {})) {
    const reachable = lemmas.some((lemma) => keptEntries.has(lemma));
    if (!reachable && !articleWords.has(form)) continue;
    keptForms.set(form, lemmas);
  }
}

/* ---------- 3. 按前缀分组，递归细分直到低于阈值 ---------- */

/** 取前缀键：不足 n 字符用下划线补位，非字母替换为下划线 */
function prefix(word, n) {
  const padded = (word + '_____').slice(0, n);
  return padded.replace(/[^a-z]/g, '_');
}

const groups = new Map(); // key2 -> { entries, forms }
for (const [word, row] of keptEntries) {
  const k = prefix(word, 2);
  if (!groups.has(k)) groups.set(k, { entries: {}, forms: {} });
  groups.get(k).entries[word] = row;
}
for (const [form, lemmas] of keptForms) {
  const k = prefix(form, 2);
  if (!groups.has(k)) groups.set(k, { entries: {}, forms: {} });
  groups.get(k).forms[form] = lemmas;
}

const sizeOf = (obj) => Buffer.byteLength(JSON.stringify(obj), 'utf8');

/** Windows 保留设备名（con/prn/aux/nul/com1-9/lpt1-9）不能作为文件名，加下划线规避 */
const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
const safeName = (name) => (RESERVED.test(name) ? `${name}_` : name);

const shards = new Map(); // shardName -> data
const splitNames = new Set(); // 被进一步拆分的分片名

/**
 * 递归拆分：data 超过阈值就按下一个字符继续分桶。
 * 命名规则 ab -> aba -> abas ...，运行时按长度递增探测。
 */
function splitShard(name, data, depth) {
  if (sizeOf(data) <= SPLIT_THRESHOLD || depth >= 7) {
    shards.set(safeName(name), data);
    return;
  }
  const next = depth + 1;
  const buckets = new Map();
  const bucketOf = (key) => {
    const tail = key.length > depth ? prefix(key.slice(depth), 1) : '_';
    return name + tail;
  };
  for (const [word, row] of Object.entries(data.entries)) {
    const b = bucketOf(word);
    if (!buckets.has(b)) buckets.set(b, { entries: {}, forms: {} });
    buckets.get(b).entries[word] = row;
  }
  for (const [form, lemmas] of Object.entries(data.forms)) {
    const b = bucketOf(form);
    if (!buckets.has(b)) buckets.set(b, { entries: {}, forms: {} });
    buckets.get(b).forms[form] = lemmas;
  }
  // 只有一个桶说明无法再拆（前缀相同），直接落盘避免死循环
  if (buckets.size <= 1) {
    shards.set(safeName(name), data);
    return;
  }
  splitNames.add(name);
  for (const [bName, bData] of buckets) splitShard(bName, bData, next);
}

for (const [key2, data] of groups) splitShard(key2, data, 2);

/* ---------- 4. 写出 ---------- */
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

let totalBytes = 0;
const sizes = [];
for (const [name, data] of shards) {
  const json = JSON.stringify(data);
  fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), json);
  const bytes = Buffer.byteLength(json, 'utf8');
  totalBytes += bytes;
  sizes.push([name, bytes]);
}

const manifest = {
  version: 1,
  /** 被进一步拆分的分片名（供调试与诊断） */
  splitNames: [...splitNames].sort(),
  /** 所有分片名（不含 .json） */
  shards: [...shards.keys()].sort(),
};
fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest));

sizes.sort((a, b) => b[1] - a[1]);
console.log('词条数:', keptEntries.size.toLocaleString());
console.log('变形索引:', keptForms.size.toLocaleString());
console.log('分片数:', shards.size);
console.log('总体积:', (totalBytes / 1048576).toFixed(1) + 'MB');
console.log('最大分片:', sizes.slice(0, 5).map(([n, b]) => `${n}=${(b / 1024).toFixed(0)}KB`).join(' '));
console.log('超过阈值的分片:', sizes.filter(([, b]) => b > SPLIT_THRESHOLD).length);
console.log('被拆分过的分片数:', splitNames.size);
