/**
 * 词典服务层
 *
 * 数据来源优先级：
 *   1. 人工校订的核心词典（LEXICON / PHRASES）—— 音标、多义词、搭配、语义网络
 *   2. 文章自带 glossary —— 由内容作者为本文写的语境释义
 *   3. 可选的在线词典（默认关闭，用户手动开启）—— dictionaryapi.dev
 *
 * 原则：宁可显示"释义待补充"，也不编造音标与释义。
 */
import { LEXICON, PHRASES } from '../data/lexicon';
import { IRREGULAR_NOUNS, IRREGULAR_VERBS } from '../data/irregular';
import type { Article, DictionarySense, LexiconCollocation, LexiconEntry } from '../data/types';
import { ARTICLES } from '../data/articles';
import { lemmatize, normalizeWord, setKnownWords } from './lemma';
import { lookupOffline } from './offline-dictionary';

export type ContextBasis = 'article-glossary' | 'collocation' | 'pos-match' | 'none';

export interface LookupResult {
  surface: string;
  lemma: string;
  phonetic: { uk?: string; us?: string };
  pos: string;
  senses: DictionarySense[];
  contextual: { text: string; basis: ContextBasis; confidence: 'high' | 'medium' | 'low' } | null;
  collocations: LexiconCollocation[];
  family: string[];
  semanticNote?: string;
  synonyms: { word: string; distinction: string }[];
  source: 'lexicon' | 'glossary' | 'ecdict' | 'online' | 'none';
  /** 词典未收录，释义待补充 */
  pending: boolean;
  /** 词形存在多种还原可能（如 leaves → leaf / leave） */
  ambiguous: string[];
  /** 该词所在句子中匹配到的固定搭配 */
  phraseHits: string[];
}

interface GlossaryHit {
  pos: string;
  gloss: string;
  articleId: string;
  articleTitle: string;
}

/* ------------------------------ 索引构建 ------------------------------ */

const glossaryIndex = new Map<string, GlossaryHit[]>();

const BASIC_WORDS = [
  'the','a','an','and','or','but','if','because','so','that','this','these','those','there','here','of','to','in','on','at','by','for','with','from','about','as','into','over','after','before','between','under','through','during','without','within','up','down','out','off','again','then','than','when','while','where','who','whom','whose','which','what','how','why','all','any','both','each','few','more','most','other','some','such','no','not','only','own','same','too','very','can','could','may','might','must','shall','should','will','would','do','does','did','done','be','am','is','are','was','were','been','being','have','has','had','i','you','he','she','it','we','they','me','him','her','us','them','my','your','his','its','our','their','one','two','first','second','many','much','also','just','even','still','yet','now','new','old','good','bad','big','small','long','short','high','low','day','days','year','years','time','times','people','man','woman','way','thing','things','make','makes','made','get','gets','got','go','goes','went','gone','come','comes','came','take','takes','took','taken','see','sees','saw','seen','say','says','said','know','knows','knew','known','think','thinks','thought','want','wants','wanted','use','uses','used','find','finds','found','give','gives','gave','given','work','works','worked','call','calls','called','need','needs','needed','feel','feels','felt','become','becomes','became','leave','leaves','left','put','puts','mean','means','meant','keep','keeps','kept','let','lets','begin','begins','began','begun','seem','seems','help','helps','helped','talk','talks','talked','turn','turns','turned','start','starts','started','show','shows','showed','shown','hear','hears','heard','play','plays','played','run','runs','ran','move','moves','moved','live','lives','lived','believe','believes','hold','holds','held','bring','brings','brought','happen','happens','happened','write','writes','wrote','written','sit','sits','sat','stand','stands','stood','lose','loses','lost','pay','pays','paid','meet','meets','met','include','includes','included','continue','continues','continued','set','sets','learn','learns','change','changes','changed','lead','leads','led','understand','understands','watch','watches','follow','follows','stop','stops','create','creates','speak','speaks','spoke','read','reads','spend','spends','spent','grow','grows','grew','open','opens','walk','walks','win','wins','won','offer','offers','remember','remembers','love','loves','consider','considers','appear','appears','buy','buys','bought','wait','waits','serve','serves','die','dies','died','send','sends','sent','expect','expects','build','builds','built','stay','stays','fall','falls','fell','cut','cuts','reach','reaches','kill','kills','remain','remains','suggest','suggests','raise','raises','pass','passes','sell','sells','sold','require','requires','report','reports','decide','decides','pull','push','return','returns','explain','explains','hope','hopes','develop','develops','carry','carries','break','breaks','broke','receive','receives','agree','agrees','support','supports','hit','produce','produces','eat','eats','ate','eaten','cover','covers','catch','catches','caught','draw','draws','drew','choose','chooses','chose','chosen','point','points','listen','listens','wonder','wonders','laugh','laughs','smile','smiles','wear','wears','wore','pick','picks','throw','throws','threw','sleep','sleeps','slept','drive','drives','drove','fly','flies','flew','swim','swims','teach','teaches','taught','learn','study','studies','student','students','school','home','house','family','friend','friends','food','water','city','country','world','life','health','body','hand','head','eye','eyes','face','room','door','book','books','word','words','story','problem','question','answer','idea','reason','result','part','place','case','group','number','level','form','area','system','program','business','company','market','money','price','cost','government','law','war','art','music','film','sport','game','team','morning','night','week','month','hour','minute','today','tomorrow','yesterday','mother','father','child','children','son','daughter','boy','girl','name','end','side','kind','type','line','fact','point','order','power','change','mind','heart','plan','road','car','train','plane','phone','computer','internet','email','job','office','teacher','doctor','worker','research','science','nature','air','earth','sun','moon','tree','animal','dog','cat','bird','sea','river','mountain','weather','rain','snow','wind','summer','winter','spring','autumn','red','blue','green','white','black','yellow','hot','cold','warm','cool','fast','slow','easy','hard','happy','sad','angry','tired','busy','free','young','kind','nice','right','wrong','true','false','full','empty','open','close','near','far','early','late','sure','ready','able','important','different','possible','common','real','whole','large','great','little','next','last','own','same','other','another','every','each','both','either','neither','all','most','some','any','none','few','many','much','more','less','least','well','better','best','worse','worst','really','quite','rather','almost','enough','perhaps','maybe','probably','certainly','usually','often','sometimes','never','always','soon','later','already','finally','however','although','though','unless','until','since','whether','instead','besides','therefore','moreover','otherwise','meanwhile','furthermore','nevertheless','consequently',
];

function buildIndex(): void {
  for (const article of ARTICLES) {
    const collect = (key: string, raw: string) => {
      const lemma = normalizeWord(key);
      if (!lemma) return;
      const hit = parseGloss(raw);
      const list = glossaryIndex.get(lemma) ?? [];
      if (!list.some((h) => h.articleId === article.id && h.gloss === hit.gloss)) {
        list.push({ ...hit, articleId: article.id, articleTitle: article.title });
        glossaryIndex.set(lemma, list);
      }
    };
    for (const [k, v] of Object.entries(article.glossary || {})) collect(k, String(v));
    for (const kv of article.keyVocab || []) {
      if (kv.word && kv.gloss) collect(kv.word, `${kv.pos ? kv.pos + ' ' : ''}${kv.gloss}`);
    }
  }

  const known = buildBaseKnown();
  for (const k of Object.keys(LEXICON)) known.add(k);
  for (const p of PHRASES) known.add(p.lemma);
  for (const k of glossaryIndex.keys()) known.add(k);
  for (const a of ARTICLES) {
    for (const kv of a.keyVocab || []) known.add(normalizeWord(kv.word));
  }
  setKnownWords(known);
}

/**
 * 基础词表中混有大量变形（studies / went / used…）。若把变形也当作"原形"注入，
 * 词形还原的 identity 规则会直接返回变形本身，导致 studies 无法归到 study。
 * 因此这里剔除：不规则变形（有专门映射）+ 规则变形（去掉后缀能还原出基础词）。
 */
const KEEP_AS_IS = new Set([
  'news', 'means', 'series', 'species', 'always', 'perhaps', 'across', 'unless', 'towards',
  'besides', 'otherwise', 'nevertheless', 'meanwhile', 'whereas', 'thus', 'plus', 'lens', 'gas',
  'bias', 'chaos', 'virus', 'status', 'campus', 'focus', 'basis', 'crisis', 'analysis', 'thesis',
  'process', 'business', 'success', 'access', 'address', 'class', 'glass', 'less', 'miss', 'pass',
  'press', 'guess', 'dress', 'stress', 'progress', 'his', 'its', 'this', 'yes',
]);

const NOT_INFLECTED = /(ous|ious|eous|ics|ss|us|is|as|ws)$/;

function stripCandidates(w: string): string[] {
  const out: string[] = [];
  if (w.endsWith('ies')) out.push(w.slice(0, -3) + 'y');
  if (w.endsWith('ied')) out.push(w.slice(0, -3) + 'y');
  if (w.endsWith('es')) out.push(w.slice(0, -2));
  if (w.endsWith('s') && !w.endsWith('ss')) out.push(w.slice(0, -1));
  if (w.endsWith('ed')) out.push(w.slice(0, -2), w.slice(0, -1), w.slice(0, -3));
  if (w.endsWith('ing')) out.push(w.slice(0, -3), w.slice(0, -3) + 'e');
  return out.filter((c) => c.length >= 3);
}

function buildBaseKnown(): Set<string> {
  const irregularForms = new Set([...Object.keys(IRREGULAR_VERBS), ...Object.keys(IRREGULAR_NOUNS)]);
  const base = new Set<string>();
  for (const w of BASIC_WORDS) if (!irregularForms.has(w)) base.add(w);
  const known = new Set<string>();
  for (const w of base) {
    if (KEEP_AS_IS.has(w) || NOT_INFLECTED.test(w)) {
      known.add(w);
      continue;
    }
    if (stripCandidates(w).some((c) => base.has(c))) continue; // 看起来是变形，不作为原形
    known.add(w);
  }
  return known;
}

function parseGloss(raw: string): { pos: string; gloss: string } {
  const text = String(raw).trim();
  const m = /^([a-z]{1,5}\.)\s*(.+)$/i.exec(text);
  if (m) return { pos: m[1].toLowerCase(), gloss: m[2].trim() };
  return { pos: '', gloss: text };
}

buildIndex();

/* ------------------------------ 语境判断 ------------------------------ */

const DETERMINERS = new Set([
  'the','a','an','this','that','these','those','my','your','his','her','its','our','their','some','any','every','no','another','each','both','all','much','many','few','little','more','most','such','what','which','whose',
]);
const BE_VERBS = new Set(['is','are','was','were','be','been','being','am','seem','seems','seemed','become','becomes','became','feel','feels','felt','look','looks','looked','remain','remains','remained','stay','stays','stayed']);
const MODALS = new Set(['can','could','may','might','must','shall','should','will','would','do','does','did','not',"n't",'to','please','let','lets']);
const ADVERBS = new Set(['very','more','most','so','too','quite','rather','really','extremely','fairly','less','least','highly']);

function tokensOf(sentence: string): string[] {
  return (sentence.toLowerCase().match(/[a-z][a-z'-]*/g) || []);
}

/** 依据上下文做词性推测。仅用于给释义排序，结果会明确标注为"推测"。 */
export function guessPos(sentence: string | undefined, surface: string): string | null {
  if (!sentence) return null;
  const toks = tokensOf(sentence);
  const target = normalizeWord(surface);
  const idx = toks.findIndex((t) => t === target || t.startsWith(target.slice(0, Math.max(3, target.length - 2))));
  if (idx < 0) return null;
  const prev = idx > 0 ? toks[idx - 1] : '';
  const prev2 = idx > 1 ? toks[idx - 2] : '';
  const next = idx < toks.length - 1 ? toks[idx + 1] : '';

  if (prev === 'to') return 'v.';
  if (MODALS.has(prev)) return 'v.';
  if (DETERMINERS.has(prev) || DETERMINERS.has(prev2)) return 'n.';
  if (BE_VERBS.has(prev) || ADVERBS.has(prev)) return 'adj.';
  if (/ly$/.test(target) && target.length > 4) return 'adv.';
  if (/ing$/.test(target)) return 'v.';
  if (/ed$/.test(target)) return 'v.';
  if (next === 'of' || next === 'to' || next === 'for' || next === 'in') return 'n.';
  return null;
}

/** 在句子中查找该词所属的固定搭配 */
export function findPhrases(sentence: string, lemma: string, surface: string): string[] {
  const lower = ' ' + sentence.toLowerCase().replace(/[^a-z' -]+/g, ' ').replace(/\s+/g, ' ') + ' ';
  const out: string[] = [];
  for (const p of PHRASES) {
    const words = p.lemma.split(' ');
    if (!words.includes(lemma) && !words.includes(normalizeWord(surface))) continue;
    // 首词允许词形变化，其余逐字匹配
    const rest = words.slice(1).join(' ');
    const re = new RegExp(`\\b[a-z']*${escapeRe(words[0] === lemma ? '' : '')}[a-z']*\\s+${escapeRe(rest)}\\b`);
    if (words.length === 1) continue;
    if (lower.includes(' ' + p.lemma + ' ') || re.test(lower) || matchInflected(lower, words)) out.push(p.lemma);
  }
  return Array.from(new Set(out));
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
}

function matchInflected(lower: string, words: string[]): boolean {
  const head = words[0];
  const tail = ' ' + words.slice(1).join(' ');
  const stem = head.replace(/(e)$/, '');
  return new RegExp(`\\b${escapeRe(stem)}[a-z]{0,4}${escapeRe(tail)}\\b`).test(lower);
}

function matchCollocation(sentence: string, collocations: LexiconCollocation[]): LexiconCollocation | null {
  if (!sentence || !collocations.length) return null;
  const lower = ' ' + sentence.toLowerCase().replace(/[^a-z' -]+/g, ' ').replace(/\s+/g, ' ') + ' ';
  for (const c of collocations) {
    const words = c.phrase.toLowerCase().split(/\s+/);
    if (words.length === 1) {
      if (lower.includes(' ' + words[0] + ' ')) return c;
      continue;
    }
    if (lower.includes(' ' + c.phrase.toLowerCase() + ' ')) return c;
    if (matchInflected(lower, words)) return c;
  }
  return null;
}

/* ------------------------------ 在线词典 ------------------------------ */

const ONLINE_CACHE_KEY = 'english-lab:dict-cache';

/** 在线词典端点，可通过 VITE_DICTIONARY_ENDPOINT 替换为自建代理（默认 dictionaryapi.dev） */
const ONLINE_ENDPOINT =
  (import.meta.env?.VITE_DICTIONARY_ENDPOINT as string | undefined) ??
  'https://api.dictionaryapi.dev/api/v2/entries/en';
interface OnlineCacheEntry {
  ts: number;
  phonetic: { uk?: string; us?: string };
  senses: DictionarySense[];
}
let onlineCache: Record<string, OnlineCacheEntry> | null = null;

function readOnlineCache(): Record<string, OnlineCacheEntry> {
  if (onlineCache) return onlineCache;
  try {
    const raw = localStorage.getItem(ONLINE_CACHE_KEY);
    onlineCache = raw ? (JSON.parse(raw) as Record<string, OnlineCacheEntry>) : {};
  } catch {
    onlineCache = {};
  }
  return onlineCache;
}

function writeOnlineCache(lemma: string, entry: OnlineCacheEntry): void {
  const cache = readOnlineCache();
  cache[lemma] = entry;
  const keys = Object.keys(cache);
  if (keys.length > 400) {
    keys
      .sort((a, b) => cache[a].ts - cache[b].ts)
      .slice(0, keys.length - 400)
      .forEach((k) => delete cache[k]);
  }
  try {
    localStorage.setItem(ONLINE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* 配额不足时放弃缓存，不影响主流程 */
  }
}

async function fetchOnline(lemma: string): Promise<{ phonetic: { uk?: string; us?: string }; senses: DictionarySense[] } | null> {
  const cache = readOnlineCache();
  const hit = cache[lemma];
  if (hit && Date.now() - hit.ts < 1000 * 60 * 60 * 24 * 30) return { phonetic: hit.phonetic, senses: hit.senses };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${ONLINE_ENDPOINT}/${encodeURIComponent(lemma)}`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      phonetic?: string;
      phonetics?: { text?: string; audio?: string }[];
      meanings?: { partOfSpeech?: string; definitions?: { definition?: string; example?: string }[] }[];
    }[];
    if (!Array.isArray(data) || !data.length) return null;
    const first = data[0];
    const phonetic = first.phonetic || first.phonetics?.find((p) => p.text)?.text || '';
    const senses: DictionarySense[] = [];
    for (const m of first.meanings || []) {
      for (const d of (m.definitions || []).slice(0, 2)) {
        if (d.definition) {
          senses.push({
            pos: (m.partOfSpeech || '').slice(0, 3) + '.',
            definition: d.definition,
            example: d.example,
          });
        }
      }
      if (senses.length >= 4) break;
    }
    if (!senses.length) return null;
    const result = { phonetic: phonetic ? { uk: phonetic, us: phonetic } : {}, senses };
    writeOnlineCache(lemma, { ts: Date.now(), ...result });
    return result;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------ 主查询 ------------------------------ */

export interface LookupOptions {
  sentence?: string;
  articleId?: string;
  /** 是否允许联网查询（由用户设置控制） */
  online?: boolean;
}

function lexiconEntryFor(lemma: string, surface: string): LexiconEntry | undefined {
  return LEXICON[lemma] || LEXICON[surface] || PHRASES.find((p) => p.lemma === lemma || p.lemma === surface);
}

export async function lookupWord(rawSurface: string, opts: LookupOptions = {}): Promise<LookupResult> {
  const surface = normalizeWord(rawSurface);
  const lem = lemmatize(surface);
  const candidates = lem.candidates.length ? lem.candidates : [surface];

  let entry: LexiconEntry | undefined;
  let resolvedLemma = lem.lemma || surface;
  for (const c of [lem.lemma, surface, ...candidates]) {
    if (!c) continue;
    const e = lexiconEntryFor(c, surface);
    if (e) {
      entry = e;
      resolvedLemma = e.lemma;
      break;
    }
  }

  const glossaryHit = pickGlossary(candidates, opts.articleId);
  const posGuess = guessPos(opts.sentence, surface);
  const phraseHits = opts.sentence ? findPhrases(opts.sentence, resolvedLemma, surface) : [];

  const senses: DictionarySense[] = entry
    ? entry.senses.map((s) => ({
        pos: s.pos,
        definition: s.cn,
        example: s.example,
        note: s.note,
      }))
    : glossaryHit
      ? [{ pos: glossaryHit.pos, definition: glossaryHit.gloss }]
      : [];

  const collocations = entry?.collocations ?? [];
  const colloHit = opts.sentence ? matchCollocation(opts.sentence, collocations) : null;

  let contextual: LookupResult['contextual'] = null;
  if (glossaryHit && glossaryHit.articleId === opts.articleId) {
    contextual = { text: glossaryHit.gloss, basis: 'article-glossary', confidence: 'medium' };
  } else if (colloHit) {
    contextual = { text: colloHit.cn, basis: 'collocation', confidence: 'high' };
  } else if (entry && posGuess) {
    const same = entry.senses.find((s) => s.pos === posGuess);
    if (same) contextual = { text: same.cn, basis: 'pos-match', confidence: 'low' };
  }

  let source: LookupResult['source'] = entry ? 'lexicon' : glossaryHit ? 'glossary' : 'none';
  let phonetic: { uk?: string; us?: string } = { uk: entry?.uk, us: entry?.us };
  let finalSenses = senses;

  if (!entry) {
    const offline = await lookupOffline([resolvedLemma, surface, ...candidates]).catch(() => null);
    if (offline) {
      resolvedLemma = offline.lemma;
      finalSenses = offline.senses;
      phonetic = offline.phonetic;
      source = 'ecdict';
    }
  }

  if (!finalSenses.length && opts.online) {
    const online = await fetchOnline(resolvedLemma || surface);
    if (online) {
      finalSenses = online.senses;
      phonetic = online.phonetic;
      source = 'online';
    }
  }

  return {
    surface,
    lemma: resolvedLemma || surface,
    phonetic,
    pos: entry?.pos || glossaryHit?.pos || finalSenses[0]?.pos || posGuess || '',
    senses: finalSenses,
    contextual,
    collocations,
    family: entry?.family ?? [],
    semanticNote: entry?.semanticNote,
    synonyms: entry?.synonyms ?? [],
    source,
    pending: finalSenses.length === 0,
    ambiguous: lem.confident ? [] : candidates.filter((c) => c !== resolvedLemma).slice(0, 3),
    phraseHits,
  };
}

function pickGlossary(candidates: string[], articleId?: string): GlossaryHit | null {
  const all: GlossaryHit[] = [];
  for (const c of candidates) {
    const hits = glossaryIndex.get(c);
    if (hits) all.push(...hits);
  }
  if (!all.length) return null;
  if (articleId) {
    const own = all.find((h) => h.articleId === articleId);
    if (own) return own;
  }
  return all[0];
}

/** 同步获取"是否已收录"，用于阅读器快速判断标记强度（不做网络请求） */
export function hasLocalEntry(word: string): boolean {
  const surface = normalizeWord(word);
  if (LEXICON[surface]) return true;
  const { candidates } = lemmatize(surface);
  if (glossaryIndex.has(surface)) return true;
  return candidates.some((c) => LEXICON[c] !== undefined || glossaryIndex.has(c));
}

/** 把某个词的已知释义同步取出（用于悬停提示，不发起网络请求） */
export function quickGloss(word: string, articleId?: string): string | null {
  const surface = normalizeWord(word);
  const { candidates, lemma } = lemmatize(surface);
  const entry = lexiconEntryFor(lemma, surface);
  if (entry) return entry.senses[0]?.cn ?? null;
  const hit = pickGlossary([lemma, surface, ...candidates], articleId);
  return hit ? hit.gloss : null;
}

export function lexiconSize(): number {
  return Object.keys(LEXICON).length + PHRASES.length;
}

export function glossarySize(): number {
  return glossaryIndex.size;
}

export function glossaryArticleCount(lemma: string): number {
  return glossaryIndex.get(normalizeWord(lemma))?.length ?? 0;
}

export type { Article };
