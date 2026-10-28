/**
 * 内容与领域模型类型定义。
 * 文章数据以 JSON 存储，加载时由 src/data/articles/index.ts 做运行时校验。
 */

export type Level = 1 | 2 | 3 | 4;

export const CATEGORIES = [
  '生活',
  '教育',
  '科技',
  '经济',
  '商业',
  '心理',
  '社会',
  '环境',
  '文化',
  '历史',
  '健康与运动',
  '科学',
] as const;

export type Category = (typeof CATEGORIES)[number];

/** 一句话：英文 + 中文参考译文（默认折叠，用户主动展开） */
export interface Sentence {
  en: string;
  zh: string;
}

export interface Paragraph {
  sentences: Sentence[];
}

/** 重点词汇（文章自带的教学标注） */
export interface KeyVocab {
  word: string;
  pos: string;
  gloss: string;
  note?: string;
}

/** 长难句解析 */
export interface GrammarPoint {
  en: string;
  main: string;
  subject: string;
  predicate: string;
  object: string;
  modifiers: string;
  logic: string;
  zh: string;
}

export type QuizType = '主旨大意' | '细节理解' | '词义推断' | '作者观点' | '逻辑推断';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  options: string[];
  /** 正确选项下标 0-3 */
  answer: number;
  /** 原文依据，必须逐字出现在正文中 */
  evidence: string;
  /** 正确项解析 */
  explain: string;
  /** 错误项分析，长度 = options.length - 1，按错误项出现顺序 */
  whyWrong: string[];
}

export interface Article {
  id: string;
  title: string;
  titleZh: string;
  level: Level;
  category: Category;
  tags?: string[];
  paragraphs: Paragraph[];
  keyVocab: KeyVocab[];
  grammar: GrammarPoint[];
  /** 文中实词的简明释义表，键为小写原形 */
  glossary: Record<string, string>;
  quiz: QuizQuestion[];
  source: string;
  license: string;
}

/* ------------------------------------------------------------------ */
/* 用户学习数据模型                                                     */
/* ------------------------------------------------------------------ */

export type MasteryStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

/** 词汇条目：一个 lemma 一条记录，跨文章复用 */
export interface VocabularyEntry {
  id: string;
  /** 词形还原后的原形，小写 */
  lemma: string;
  /** 主词性，如 v. / n. / adj. */
  partOfSpeech: string;
  phonetics: { uk?: string; us?: string };
  /** 词典释义（可能多条） */
  definitions: DictionarySense[];
  /** 当前语境释义，可能为空（待补充） */
  contextualMeaning?: string;
  masteryStatus: MasteryStatus;
  /** 已掌握标记来源：user = 用户手动，srs = 复习系统判定 */
  masteredBy?: 'user' | 'srs';
  createdAt: number;
  updatedAt: number;
  lastReviewedAt?: number;
  nextReviewAt?: number;
  /** SM-2 状态 */
  srs: SrsState;
  /** 释义是否待补充（词典未命中） */
  pendingGloss?: boolean;
}

/** 单词在具体文章中的出现记录 */
export interface VocabularyOccurrence {
  id: string;
  vocabularyEntryId: string;
  articleId: string;
  articleTitle: string;
  /** 用户实际点击的词形 */
  surfaceForm: string;
  sentence: string;
  contextualMeaning?: string;
  encounteredAt: number;
}

export interface DictionarySense {
  pos: string;
  definition: string;
  example?: string;
  /** 该义项与当前语境的关系说明 */
  note?: string;
}

export interface SrsState {
  /** 复习次数 */
  reps: number;
  /** 连续回忆成功次数 */
  streak: number;
  /** 难度因子 1.3 - 2.8 */
  ease: number;
  /** 当前间隔（天） */
  intervalDays: number;
  /** 遗忘次数 */
  lapses: number;
}

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

export interface ReviewLog {
  id: string;
  vocabularyEntryId: string;
  lemma: string;
  grade: ReviewGrade;
  /** 复习前状态 */
  prevIntervalDays: number;
  nextIntervalDays: number;
  reviewedAt: number;
}

export interface QuizAttempt {
  id: string;
  articleId: string;
  articleTitle: string;
  level: Level;
  /** 每题作答：题号 -> 选项下标 */
  answers: Record<string, number>;
  correctCount: number;
  total: number;
  /** 按题型统计的错误数 */
  wrongByType: Record<string, number>;
  submittedAt: number;
}

/** 阅读进度 */
export interface ReadingProgress {
  articleId: string;
  /** 已读到的句子索引（全局句子序号） */
  sentenceIndex: number;
  /** 0-1 */
  ratio: number;
  /** 累计实际阅读词数（按已读句子累加，口径：实际阅读范围） */
  wordsRead: number;
  startedAt: number;
  updatedAt: number;
  completedAt?: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  /** 阅读主题：纸张 / 纯白 / 护眼 / 深色 */
  readingTheme: 'paper' | 'plain' | 'sepia' | 'night';
  fontScale: number;
  lineHeight: number;
  /** 正文字体 */
  readingFont: 'serif' | 'sans';
  showVocabMarks: boolean;
  markStyle: 'underline' | 'highlight' | 'dot';
  translationMode: 'hidden' | 'tap' | 'always';
  focusMode: boolean;
  speechRate: number;
  speechVoice: 'uk' | 'us';
  autoAddOnClick: boolean;
  dailyGoal: number;
  onlineDictionary: boolean;
}

/* ------------------------------------------------------------------ */
/* 词典层                                                              */
/* ------------------------------------------------------------------ */

export interface LexiconSense {
  /** 词性缩写，如 v. / n. / adj. */
  pos: string;
  /** 中文释义 */
  cn: string;
  /** 英文释义（可选，用于区分近义） */
  en?: string;
  /** 自然例句 */
  example?: string;
  exampleZh?: string;
  /** 该义项的使用条件 / 与其他义项的关系 */
  note?: string;
}

export interface LexiconCollocation {
  phrase: string;
  cn: string;
}

/** 人工校订的核心词条（音标、多义、搭配、语义网络） */
export interface LexiconEntry {
  lemma: string;
  /** 英式音标，含斜杠，如 /meɪnˈteɪn/ */
  uk?: string;
  /** 美式音标 */
  us?: string;
  /** 主要词性 */
  pos: string;
  senses: LexiconSense[];
  collocations?: LexiconCollocation[];
  /** 同族词形 */
  family?: string[];
  /** 多义词之间的联系说明（中文，讲清语义延伸逻辑） */
  semanticNote?: string;
  /** 近义词辨析 */
  synonyms?: { word: string; distinction: string }[];
  /** 对应学习阶段 */
  level?: Level;
}

export interface AppData {
  version: number;
  vocabEntries: VocabularyEntry[];
  occurrences: VocabularyOccurrence[];
  reviews: ReviewLog[];
  quizAttempts: QuizAttempt[];
  progress: Record<string, ReadingProgress>;
  favorites: string[];
  recent: string[];
  settings: UserSettings;
  /** 每日活跃记录，用于连续学习天数 */
  activeDays: string[];
}
