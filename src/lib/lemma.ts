/**
 * 词形还原引擎（lemmatization）
 *
 * 目标：把 studies / studied / studying 归到 study，同时**不把不同词性或
 * 同形异义词错误合并**（leaves → leaf / leave 必须保留两个候选）。
 *
 * 判定顺序：
 *   1. 不规则动词表 → 2. 不规则名词表 → 3. 单复数同形表
 *   4. 已知词表（本身就是原形）→ 5. 规则派生（候选必须存在于已知词表）
 *   6. 全部失败 → unknown
 *
 * 纯函数、无副作用、零依赖。唯一的模块级状态是 setKnownWords 注入的词表。
 */
import { INVARIANT, IRREGULAR_NOUNS, IRREGULAR_VERBS } from '../data/irregular';

export interface LemmaResult {
  /** 归一化后的原词形 */
  surface: string;
  /** 判定出的原形 */
  lemma: string;
  /** 所有可能的原形（含 lemma 本身），按优先级排序 */
  candidates: string[];
  /** 是否唯一确定 */
  confident: boolean;
  /** 命中规则名，便于调试与测试断言 */
  rule: string;
}

/** 候选优先级：数值越小越优先。不规则名词 > 规则动词变形 > 其他（形容词/副词派生）。 */
const PRIORITY_NOUN = 1;
const PRIORITY_VERB = 2;
const PRIORITY_OTHER = 3;

const VOWELS: Set<string> = new Set(['a', 'e', 'i', 'o', 'u']);

/** 已知词表：词典键 + 文章 glossary 键，由 setKnownWords 覆盖写入。 */
let knownWords: Set<string> = new Set<string>();

interface Candidate {
  word: string;
  rule: string;
  priority: number;
}

/** 去掉首尾的非字母数字（保留词内连字符与撇号），用于处理 “Study.” 这类标点。 */
const EDGE_PUNCTUATION = /^[^a-z0-9']+|[^a-z0-9']+$/g;
/** 弯引号 / 修饰字母撇号统一成 ASCII 撇号。 */
const CURLY_APOSTROPHE = /[\u2018\u2019\u02BC\u2032\u00B4]/g;

/**
 * 归一化：小写、去首尾标点、弯引号转直引号、去所有格 's。
 * 输入非法或纯标点时返回空字符串。
 */
export function normalizeWord(raw: string): string {
  if (typeof raw !== 'string' || raw.length === 0) return '';
  let word = raw.normalize('NFKC').toLowerCase().replace(CURLY_APOSTROPHE, "'");
  word = word.trim().replace(EDGE_PUNCTUATION, '');
  // 所有格：students' / student's 都归到 students / student
  word = word.replace(/'s$/, '').replace(/'+$/, '');
  return word;
}

/** 覆盖式注入已知词表（可重复调用）。 */
export function setKnownWords(words: Iterable<string>): void {
  const next = new Set<string>();
  for (const word of words) {
    const normalized = normalizeWord(word);
    if (normalized) next.add(normalized);
  }
  knownWords = next;
}

export function isKnown(word: string): boolean {
  const normalized = normalizeWord(word);
  return normalized.length > 0 && knownWords.has(normalized);
}

function isConsonant(char: string): boolean {
  return char.length === 1 && /[a-z]/.test(char) && !VOWELS.has(char);
}

/** 末尾是否为双写辅音（runn / stopp / bigg），用于还原 running / stopped / bigger。 */
function endsWithDoubleConsonant(stem: string): boolean {
  if (stem.length < 2) return false;
  const last = stem.charAt(stem.length - 1);
  const prev = stem.charAt(stem.length - 2);
  return last === prev && isConsonant(last);
}

/**
 * 规则派生：产出所有**在已知词表中存在**的候选，按优先级排序。
 * 派生后缀（-ness / -ment / -tion / -ity）故意不处理：它们是独立词条。
 */
function collectCandidates(surface: string): Candidate[] {
  const out: Candidate[] = [];
  const seen = new Set<string>();

  const push = (candidate: string, rule: string, priority: number): void => {
    if (candidate.length === 0 || candidate === surface || seen.has(candidate)) return;
    if (!knownWords.has(candidate)) return;
    seen.add(candidate);
    out.push({ word: candidate, rule, priority });
  };

  // -ies → -y（studies → study, carries → carry）
  if (surface.endsWith('ies')) {
    push(surface.slice(0, -3) + 'y', 'ies-to-y', PRIORITY_VERB);
  }

  // -ied → -y（studied → study, tried → try）
  if (surface.endsWith('ied')) {
    push(surface.slice(0, -3) + 'y', 'ied-to-y', PRIORITY_VERB);
  }

  // -ves → -f / -fe（leaf, knife）或 -ve（leave, live）—— 名词优先
  if (surface.endsWith('ves')) {
    const stem = surface.slice(0, -3);
    push(stem + 'f', 'ves-to-f', PRIORITY_NOUN);
    push(stem + 'fe', 'ves-to-fe', PRIORITY_NOUN);
    push(stem + 've', 'ves-to-ve', PRIORITY_VERB);
  }

  // -es → 去 es（watches → watch, glasses → glass）
  if (surface.endsWith('es') && surface.length > 2) {
    push(surface.slice(0, -2), 'es-drop-es', PRIORITY_VERB);
    // -es 之后的 s 规则（leaves → leave, uses → use）
    push(surface.slice(0, -1), 'es-drop-s', PRIORITY_VERB);
  }

  // -s → 去 s（books → book）；-ss 结尾不动（class 保持不变）
  if (surface.endsWith('s') && !surface.endsWith('ss') && surface.length > 2) {
    push(surface.slice(0, -1), 's-drop', PRIORITY_VERB);
  }

  // -ing → 去 ing / 双写还原 / 补 e / -ying → -ie
  if (surface.endsWith('ing') && surface.length > 4) {
    const stem = surface.slice(0, -3);
    push(stem, 'ing-drop', PRIORITY_VERB);
    if (endsWithDoubleConsonant(stem)) push(stem.slice(0, -1), 'ing-undouble', PRIORITY_VERB);
    push(stem + 'e', 'ing-add-e', PRIORITY_VERB);
    if (surface.endsWith('ying')) push(surface.slice(0, -4) + 'ie', 'ying-to-ie', PRIORITY_VERB);
  }

  // -ed → 去 ed / 双写还原 / 补 e / -ied → -y
  if (surface.endsWith('ed') && surface.length > 3) {
    const stem = surface.slice(0, -2);
    push(stem, 'ed-drop', PRIORITY_VERB);
    if (endsWithDoubleConsonant(stem)) push(stem.slice(0, -1), 'ed-undouble', PRIORITY_VERB);
    push(stem + 'e', 'ed-add-e', PRIORITY_VERB);
    if (stem.endsWith('i')) push(stem.slice(0, -1) + 'y', 'ed-ied-to-y', PRIORITY_VERB);
  }

  // -er / -est → 去后缀（bigger → big, biggest → big, faster → fast）
  for (const suffix of ['er', 'est'] as const) {
    if (!surface.endsWith(suffix) || surface.length <= suffix.length + 2) continue;
    const stem = surface.slice(0, -suffix.length);
    push(stem, suffix + '-drop', PRIORITY_OTHER);
    if (endsWithDoubleConsonant(stem)) push(stem.slice(0, -1), suffix + '-undouble', PRIORITY_OTHER);
    push(stem + 'e', suffix + '-add-e', PRIORITY_OTHER);
  }

  // -ly → 去 ly（quickly → quick）；-ily → -y（happily → happy）
  if (surface.endsWith('ly') && surface.length > 3) {
    push(surface.slice(0, -2), 'ly-drop', PRIORITY_OTHER);
    if (surface.endsWith('ily')) push(surface.slice(0, -3) + 'y', 'ily-to-y', PRIORITY_OTHER);
  }

  out.sort((a, b) => a.priority - b.priority);
  return out;
}

function single(surface: string, lemma: string, rule: string): LemmaResult {
  return { surface, lemma, candidates: [lemma], confident: true, rule };
}

/** 单词还原。任何输入都不会抛异常，且绝不返回空字符串（空输入除外）。 */
export function lemmatize(surface: string): LemmaResult {
  const word = normalizeWord(surface);
  if (word.length === 0) {
    return { surface: '', lemma: '', candidates: [], confident: false, rule: 'empty' };
  }

  const irregularVerb: string | undefined = IRREGULAR_VERBS[word];
  if (irregularVerb) return single(word, irregularVerb, 'irregular-verb');

  const irregularNoun: string | undefined = IRREGULAR_NOUNS[word];
  if (irregularNoun) return single(word, irregularNoun, 'irregular-noun');

  if (INVARIANT.has(word)) return single(word, word, 'invariant');

  if (knownWords.has(word)) return single(word, word, 'identity');

  const candidates = collectCandidates(word);
  if (candidates.length === 0) {
    return { surface: word, lemma: word, candidates: [word], confident: false, rule: 'unknown' };
  }
  if (candidates.length === 1) {
    const only = candidates[0];
    return single(word, only.word, only.rule);
  }
  return {
    surface: word,
    lemma: candidates[0].word,
    candidates: candidates.map((candidate) => candidate.word),
    confident: false,
    rule: 'ambiguous',
  };
}

/** 按非单词字符切分（保留词内撇号与连字符），键为归一化后的 surface。 */
const TOKEN_SEPARATOR = /[^a-z0-9'\u2018\u2019\u02BC-]+/i;

/** 整句还原：返回 surface → LemmaResult 的映射，同一词形只出现一次。 */
export function lemmatizeSentence(sentence: string): Map<string, LemmaResult> {
  const results = new Map<string, LemmaResult>();
  if (typeof sentence !== 'string' || sentence.length === 0) return results;

  for (const token of sentence.split(TOKEN_SEPARATOR)) {
    const surface = normalizeWord(token);
    if (surface.length === 0 || !/[a-z]/.test(surface)) continue;
    if (results.has(surface)) continue;
    results.set(surface, lemmatize(surface));
  }
  return results;
}
