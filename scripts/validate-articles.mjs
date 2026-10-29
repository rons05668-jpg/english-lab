#!/usr/bin/env node
/**
 * 文章数据校验器（内容契约的唯一执行者）
 *
 *   node scripts/validate-articles.mjs            校验全部文章
 *   node scripts/validate-articles.mjs level1.json 只校验一个文件
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'src/data/articles');

const CATEGORIES = ['生活', '教育', '科技', '经济', '商业', '心理', '社会', '环境', '文化', '历史', '健康与运动', '科学'];
const QUIZ_TYPES = ['主旨大意', '细节理解', '词义推断', '作者观点', '逻辑推断'];
const LEVEL_RANGE = { 1: [90, 175], 2: [140, 275], 3: [230, 430], 4: [280, 480] };
const FILE_LEVEL = { 'level1.json': 1, 'level2.json': 2, 'level3.json': 3, 'level4.json': 4 };
const dictionaryDir = join(ROOT, 'src/data/ecdict');
const inflections = Object.assign({}, ...readdirSync(dictionaryDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(join(dictionaryDir, file), 'utf8')).forms));

const errors = [];
const warns = [];
const seenIds = new Map();

const err = (f, i, m) => errors.push(`[${f}${i !== undefined ? ` #${i}` : ''}] ${m}`);
const warn = (f, i, m) => warns.push(`[${f}${i !== undefined ? ` #${i}` : ''}] ${m}`);

const norm = (s) => String(s).toLowerCase().replace(/[^a-z' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const stem = (w) => w.replace(/(ies|es|s|ed|ing|ly)$/,'');

function articleText(a) {
  return a.paragraphs.flatMap((p) => p.sentences.map((s) => s.en)).join(' ');
}

function containsSentence(text, target) {
  return norm(text).includes(norm(target));
}

function wordCount(a) {
  const text = articleText(a);
  return (text.match(/[A-Za-z][A-Za-z'-]*/g) || []).length;
}

function validateArticle(a, file, idx) {
  const L = FILE_LEVEL[file];
  const tag = `${file} #${idx}`;

  if (!a || typeof a !== 'object') return err(file, idx, '不是对象');
  for (const k of ['id', 'title', 'titleZh', 'category', 'source', 'license']) {
    if (typeof a[k] !== 'string' || !a[k].trim()) err(file, idx, `字段 ${k} 缺失或为空`);
  }
  if (a.level !== L) err(file, idx, `level 必须为 ${L}，实际 ${a.level}`);
  if (!CATEGORIES.includes(a.category)) err(file, idx, `category 非法：${a.category}`);
  if (!/^l[1-4]-\d{2,}$/.test(a.id || '')) err(file, idx, `id 格式应为 l{level}-NN，实际 ${a.id}`);
  if (a.id && !a.id.startsWith(`l${L}-`)) err(file, idx, `id 前缀与 level 不一致：${a.id}`);
  if (a.id) {
    if (seenIds.has(a.id)) err(file, idx, `id 重复：${a.id}（已在 ${seenIds.get(a.id)} 出现）`);
    else seenIds.set(a.id, tag);
  }
  if (!a.titleZh || !/[\u4e00-\u9fa5]/.test(a.titleZh)) err(file, idx, 'titleZh 需要中文标题');
  if (/TODO|Lorem|placeholder|待补充内容/i.test(JSON.stringify(a))) err(file, idx, '包含占位文本');

  // 正文
  if (!Array.isArray(a.paragraphs) || a.paragraphs.length < 2) return err(file, idx, 'paragraphs 至少 2 段');
  let sentenceCount = 0;
  for (const [pi, p] of a.paragraphs.entries()) {
    if (!Array.isArray(p.sentences) || p.sentences.length === 0) err(file, idx, `第 ${pi + 1} 段没有句子`);
    for (const [si, s] of (p.sentences || []).entries()) {
      sentenceCount++;
      if (typeof s.en !== 'string' || s.en.trim().length < 3) err(file, idx, `段${pi + 1}句${si + 1} 英文为空`);
      if (typeof s.zh !== 'string' || !/[\u4e00-\u9fa5]/.test(s.zh)) err(file, idx, `段${pi + 1}句${si + 1} 缺少中文译文`);
      if (/[A-Za-z]{4,}/.test(s.zh || '') && !/^[A-Za-z]/.test(s.en || '')) {
        /* 允许译文里保留专有名词，不报错 */
      }
      if (/\s{2,}/.test(s.en || '')) warn(file, idx, `段${pi + 1}句${si + 1} 含连续空格`);
      if (!/[.!?"']$/.test((s.en || '').trim())) warn(file, idx, `段${pi + 1}句${si + 1} 未以标点结尾`);
    }
  }
  if (sentenceCount < 5) err(file, idx, `句子过少（${sentenceCount}）`);

  const wc = wordCount(a);
  const [lo, hi] = LEVEL_RANGE[L];
  if (wc < lo || wc > hi) err(file, idx, `词数 ${wc} 超出 Level ${L} 区间 ${lo}-${hi}`);

  const text = articleText(a);

  // 重点词汇
  if (!Array.isArray(a.keyVocab) || a.keyVocab.length < 3) err(file, idx, 'keyVocab 至少 3 条');
  for (const v of a.keyVocab || []) {
    for (const k of ['word', 'pos', 'gloss']) if (!v[k]) err(file, idx, `keyVocab 缺少 ${k}`);
    if (v.word && !norm(text).includes(norm(v.word).split(' ')[0].slice(0, Math.max(3, norm(v.word).length - 2)))) {
      warn(file, idx, `keyVocab "${v.word}" 未在正文中出现`);
    }
  }

  // 语法点
  if (!Array.isArray(a.grammar) || a.grammar.length < 2) err(file, idx, 'grammar 至少 2 条');
  for (const [gi, g] of (a.grammar || []).entries()) {
    for (const k of ['en', 'main', 'subject', 'predicate', 'object', 'modifiers', 'logic', 'zh']) {
      if (typeof g[k] !== 'string' || !g[k].trim()) err(file, idx, `grammar[${gi}] 缺少 ${k}`);
    }
    if (g.en && !containsSentence(text, g.en)) err(file, idx, `grammar[${gi}] 的 en 未逐字出现在正文：${g.en.slice(0, 60)}`);
  }

  // 词汇表
  if (!a.glossary || typeof a.glossary !== 'object' || Object.keys(a.glossary).length < 25) {
    err(file, idx, 'glossary 至少 25 条');
  }
  for (const [k, v] of Object.entries(a.glossary || {})) {
    if (k !== k.toLowerCase()) err(file, idx, `glossary 键必须小写：${k}`);
    if (typeof v !== 'string' || !/[\u4e00-\u9fa5]/.test(v)) err(file, idx, `glossary["${k}"] 缺少中文释义`);
    if (/\s/.test(k)) err(file, idx, `glossary 键不应包含空格（词组除外请用单个空格并确保是固定搭配）：${k}`);
    const inflectedMatch = norm(text).split(' ').some((word) => (inflections[word] || []).includes(k));
    if (k.split(' ').length === 1 && k.length > 2 && !norm(text).includes(stem(k)) && !inflectedMatch) {
      warn(file, idx, `glossary 键 "${k}" 疑似未在正文出现`);
    }
  }

  // 题目
  if (!Array.isArray(a.quiz) || a.quiz.length < 3 || a.quiz.length > 5) err(file, idx, 'quiz 需 3-5 题');
  const types = new Set();
  for (const [qi, q] of (a.quiz || []).entries()) {
    types.add(q.type);
    if (!QUIZ_TYPES.includes(q.type)) err(file, idx, `quiz[${qi}] type 非法：${q.type}`);
    if (!q.id) err(file, idx, `quiz[${qi}] 缺少 id`);
    if (!q.question || !/\?$/.test(q.question.trim())) err(file, idx, `quiz[${qi}] 题干应以问号结尾`);
    if (!Array.isArray(q.options) || q.options.length !== 4) err(file, idx, `quiz[${qi}] 必须 4 个选项`);
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3) err(file, idx, `quiz[${qi}] answer 必须是 0-3`);
    if (!q.evidence || !containsSentence(text, q.evidence)) err(file, idx, `quiz[${qi}] evidence 未逐字出现在正文：${String(q.evidence).slice(0, 60)}`);
    if (!q.explain || q.explain.length < 10) err(file, idx, `quiz[${qi}] explain 过短`);
    if (!Array.isArray(q.whyWrong) || q.whyWrong.length !== 3) err(file, idx, `quiz[${qi}] whyWrong 需要 3 条（对应 3 个错误项）`);
    (q.whyWrong || []).forEach((w, wi) => {
      if (typeof w !== 'string' || w.length < 6) err(file, idx, `quiz[${qi}] whyWrong[${wi}] 过短`);
    });
    if (new Set(q.options || []).size !== (q.options || []).length) err(file, idx, `quiz[${qi}] 选项重复`);
  }
  if (types.size < 3) err(file, idx, `题型过于单一（${[...types].join('/')}），至少覆盖 3 种`);
}

function main() {
  const only = process.argv[2];
  const files = existsSync(DIR)
    ? readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()
    : [];
  if (!files.length) {
    console.error('未找到任何文章 JSON');
    process.exit(1);
  }
  const targets = only ? files.filter((f) => f === only) : files;

  for (const file of targets) {
    let data;
    try {
      data = JSON.parse(readFileSync(join(DIR, file), 'utf8'));
    } catch (e) {
      err(file, undefined, `JSON 解析失败：${e.message}`);
      continue;
    }
    if (!Array.isArray(data)) {
      err(file, undefined, '顶层必须是数组');
      continue;
    }
    data.forEach((a, i) => validateArticle(a, file, i));
  }

  const total = targets.reduce((n, f) => {
    try {
      return n + JSON.parse(readFileSync(join(DIR, f), 'utf8')).length;
    } catch {
      return n;
    }
  }, 0);

  if (warns.length) {
    console.log(`\n⚠️  警告 ${warns.length} 条`);
    warns.slice(0, 40).forEach((w) => console.log('   ' + w));
    if (warns.length > 40) console.log(`   ... 另有 ${warns.length - 40} 条`);
  }
  if (errors.length) {
    console.error(`\n❌ 错误 ${errors.length} 条`);
    errors.slice(0, 80).forEach((e) => console.error('   ' + e));
    if (errors.length > 80) console.error(`   ... 另有 ${errors.length - 80} 条`);
    process.exit(1);
  }
  console.log(`\n✅ 校验通过：${targets.join(', ')}，共 ${total} 篇`);
}

main();
