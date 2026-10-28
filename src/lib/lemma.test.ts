import { beforeEach, describe, expect, it } from 'vitest';
import { IRREGULAR_NOUNS, IRREGULAR_VERBS, INVARIANT } from '../data/irregular';
import { isKnown, lemmatize, lemmatizeSentence, normalizeWord, setKnownWords } from './lemma';

/**
 * 测试用小型词表：模拟 setKnownWords 注入的"词典键 + glossary 键"。
 * 故意同时收录 leaf 与 leave，用来验证 leaves 的歧义处理。
 */
const KNOWN: readonly string[] = [
  'study',
  'leave',
  'leaf',
  'life',
  'knife',
  'run',
  'stop',
  'plan',
  'big',
  'make',
  'use',
  'write',
  'like',
  'agree',
  'carry',
  'try',
  'watch',
  'book',
  'class',
  'glass',
  'quick',
  'happy',
  'fast',
  'nice',
  'light',
  'kind',
  'new',
  'mean',
  'walk',
  'sing',
  'lie',
  'student',
  'go',
  'eat',
  'take',
  'bring',
  'think',
  'see',
  'be',
  'have',
  'do',
];

describe('normalizeWord', () => {
  it('小写化并去掉首尾标点', () => {
    expect(normalizeWord('Studies,')).toBe('studies');
    expect(normalizeWord('“Study.”')).toBe('study');
    expect(normalizeWord('  Hello  ')).toBe('hello');
    expect(normalizeWord('(book)')).toBe('book');
  });

  it('弯引号转直引号，并去掉所有格', () => {
    expect(normalizeWord('don’t')).toBe("don't");
    expect(normalizeWord("students'")).toBe('students');
    expect(normalizeWord("student's")).toBe('student');
  });

  it('空输入与纯标点返回空字符串', () => {
    expect(normalizeWord('')).toBe('');
    expect(normalizeWord('   ')).toBe('');
    expect(normalizeWord('—!?')).toBe('');
  });
});

describe('已知词表', () => {
  beforeEach(() => {
    setKnownWords(KNOWN);
  });

  it('注入后可查询，且大小写/标点不敏感', () => {
    expect(isKnown('study')).toBe(true);
    expect(isKnown('Study,')).toBe(true);
    expect(isKnown('zzzq')).toBe(false);
  });

  it('重复调用 setKnownWords 会覆盖而非累加', () => {
    setKnownWords(['alpha']);
    expect(isKnown('study')).toBe(false);
    expect(isKnown('alpha')).toBe(true);
    setKnownWords(KNOWN);
  });
});

describe('不规则表', () => {
  beforeEach(() => {
    setKnownWords(KNOWN);
  });

  it('不规则动词命中即返回原形', () => {
    expect(lemmatize('went')).toMatchObject({ lemma: 'go', confident: true, rule: 'irregular-verb' });
    expect(lemmatize('gone').lemma).toBe('go');
    expect(lemmatize('eaten').lemma).toBe('eat');
    expect(lemmatize('taken').lemma).toBe('take');
    expect(lemmatize('brought').lemma).toBe('bring');
    expect(lemmatize('thought').lemma).toBe('think');
  });

  it('不规则名词命中即返回单数', () => {
    expect(lemmatize('children')).toMatchObject({
      lemma: 'child',
      confident: true,
      rule: 'irregular-noun',
    });
    expect(lemmatize('feet').lemma).toBe('foot');
    expect(lemmatize('mice').lemma).toBe('mouse');
    expect(lemmatize('teeth').lemma).toBe('tooth');
  });

  it('不规则表不收录规则变形', () => {
    expect(IRREGULAR_VERBS['studies']).toBeUndefined();
    expect(IRREGULAR_NOUNS['leaves']).toBeUndefined();
    expect(IRREGULAR_NOUNS['books']).toBeUndefined();
  });
});

describe('study 系列', () => {
  beforeEach(() => {
    setKnownWords(KNOWN);
  });

  it('studies / studied / studying 都归到 study', () => {
    expect(lemmatize('studies')).toMatchObject({ lemma: 'study', confident: true, rule: 'ies-to-y' });
    expect(lemmatize('studied').lemma).toBe('study');
    expect(lemmatize('studying').lemma).toBe('study');
    expect(lemmatize('Studies,').lemma).toBe('study');
  });

  it('study 本身是 identity', () => {
    expect(lemmatize('study')).toMatchObject({ lemma: 'study', confident: true, rule: 'identity' });
  });
});

describe('规则派生', () => {
  beforeEach(() => {
    setKnownWords(KNOWN);
  });

  it('双写辅音还原', () => {
    expect(lemmatize('running')).toMatchObject({ lemma: 'run', rule: 'ing-undouble' });
    expect(lemmatize('stopped')).toMatchObject({ lemma: 'stop', rule: 'ed-undouble' });
    expect(lemmatize('bigger')).toMatchObject({ lemma: 'big', rule: 'er-undouble' });
    expect(lemmatize('biggest').lemma).toBe('big');
    expect(lemmatize('planned').lemma).toBe('plan');
  });

  it('补 e 还原', () => {
    expect(lemmatize('making')).toMatchObject({ lemma: 'make', rule: 'ing-add-e' });
    expect(lemmatize('used')).toMatchObject({ lemma: 'use', rule: 'ed-add-e' });
    expect(lemmatize('writing').lemma).toBe('write');
    expect(lemmatize('liked').lemma).toBe('like');
    expect(lemmatize('agreed').lemma).toBe('agree');
  });

  it('-ies / -ied 还原为 -y', () => {
    expect(lemmatize('carries').lemma).toBe('carry');
    expect(lemmatize('carried').lemma).toBe('carry');
    expect(lemmatize('tried')).toMatchObject({ lemma: 'try', rule: 'ied-to-y' });
  });

  it('-ying 还原为 -ie', () => {
    expect(lemmatize('lying')).toMatchObject({ lemma: 'lie', rule: 'ying-to-ie' });
  });

  it('-es / -s 还原', () => {
    expect(lemmatize('watches')).toMatchObject({ lemma: 'watch', rule: 'es-drop-es' });
    expect(lemmatize('books')).toMatchObject({ lemma: 'book', rule: 's-drop' });
    expect(lemmatize('glasses')).toMatchObject({ lemma: 'glass', confident: true });
  });

  it('-ly / -ily 还原', () => {
    expect(lemmatize('quickly')).toMatchObject({ lemma: 'quick', rule: 'ly-drop' });
    expect(lemmatize('happily')).toMatchObject({ lemma: 'happy', rule: 'ily-to-y' });
  });

  it('派生后缀不还原（-ness / -ment / -tion / -ity 是独立词条）', () => {
    expect(lemmatize('kindness')).toMatchObject({ lemma: 'kindness', rule: 'unknown' });
    expect(lemmatize('movement').rule).toBe('unknown');
  });

  it('-ss 结尾不被去掉 s', () => {
    expect(lemmatize('class')).toMatchObject({ lemma: 'class', confident: true, rule: 'identity' });
  });
});

describe('不变形词', () => {
  beforeEach(() => {
    setKnownWords(KNOWN);
  });

  it('news / series / sheep / means 视为原形', () => {
    for (const word of ['news', 'series', 'sheep', 'means', 'species']) {
      expect(lemmatize(word)).toMatchObject({ lemma: word, confident: true, rule: 'invariant' });
    }
  });

  it('INVARIANT 集合覆盖常见同形词', () => {
    expect(INVARIANT.has('news')).toBe(true);
    expect(INVARIANT.has('series')).toBe(true);
    expect(INVARIANT.has('sheep')).toBe(true);
    expect(INVARIANT.has('glasses')).toBe(false);
  });

  it('news 不会被 -s 规则拆成 new', () => {
    expect(lemmatize('news').lemma).not.toBe('new');
  });
});

describe('歧义处理', () => {
  it('leaf 与 leave 都已知时，leaves 标记 ambiguous', () => {
    setKnownWords(KNOWN);
    const result = lemmatize('leaves');
    expect(result.confident).toBe(false);
    expect(result.rule).toBe('ambiguous');
    expect(result.candidates).toContain('leaf');
    expect(result.candidates).toContain('leave');
    // 不规则名词优先于动词变形
    expect(result.lemma).toBe('leaf');
    expect(result.candidates[0]).toBe('leaf');
  });

  it('只有 leaf 已知时，leaves 唯一确定', () => {
    setKnownWords(['leaf']);
    const result = lemmatize('leaves');
    expect(result).toMatchObject({ lemma: 'leaf', confident: true, rule: 'ves-to-f' });
    expect(result.candidates).toEqual(['leaf']);
  });

  it('只有 leave 已知时，leaves 唯一确定', () => {
    setKnownWords(['leave']);
    expect(lemmatize('leaves')).toMatchObject({ lemma: 'leave', confident: true, rule: 'ves-to-ve' });
  });

  it('knives / lives 的 -ves 分支', () => {
    setKnownWords(['knife']);
    expect(lemmatize('knives').lemma).toBe('knife');
    setKnownWords(['life', 'live']);
    const lives = lemmatize('lives');
    expect(lives.confident).toBe(false);
    expect(lives.candidates).toEqual(expect.arrayContaining(['life', 'live']));
  });
});

describe('边界与容错', () => {
  beforeEach(() => {
    setKnownWords(KNOWN);
  });

  it('空输入返回 empty 结构', () => {
    expect(lemmatize('')).toEqual({
      surface: '',
      lemma: '',
      candidates: [],
      confident: false,
      rule: 'empty',
    });
  });

  it('纯标点不抛错，等价于空输入', () => {
    expect(lemmatize('—!?').rule).toBe('empty');
    expect(lemmatize('   ').lemma).toBe('');
  });

  it('未知词返回自身且不抛错', () => {
    const result = lemmatize('zzzq');
    expect(result).toMatchObject({
      surface: 'zzzq',
      lemma: 'zzzq',
      confident: false,
      rule: 'unknown',
    });
    expect(result.candidates).toEqual(['zzzq']);
  });

  it('任何情况下 lemma 非空，且 candidates 含 lemma', () => {
    const samples = ['study', 'studies', 'went', 'children', 'leaves', 'zzzq', 'running'];
    for (const sample of samples) {
      const result = lemmatize(sample);
      expect(result.lemma.length).toBeGreaterThan(0);
      expect(result.candidates).toContain(result.lemma);
      expect(result.surface).toBe(normalizeWord(sample));
    }
  });

  it('多次调用结果稳定（纯函数）', () => {
    expect(lemmatize('studies')).toEqual(lemmatize('studies'));
  });
});

describe('lemmatizeSentence', () => {
  beforeEach(() => {
    setKnownWords(KNOWN);
  });

  it('整句还原，键为 surface，键数等于不同单词数', () => {
    const sentence = 'Studies show that running helps children.';
    const map = lemmatizeSentence(sentence);
    expect(map.size).toBe(6);
    expect([...map.keys()]).toEqual(['studies', 'show', 'that', 'running', 'helps', 'children']);
    expect(map.get('studies')?.lemma).toBe('study');
    expect(map.get('running')?.lemma).toBe('run');
    expect(map.get('children')?.lemma).toBe('child');
  });

  it('重复词形只保留一次，标点不进入键', () => {
    const map = lemmatizeSentence('“Study,” she said. Study!');
    expect(map.size).toBe(3);
    expect(map.has('study')).toBe(true);
    expect(map.has('“study')).toBe(false);
    expect(map.get('said')?.lemma).toBe('say');
  });

  it('空句子返回空 Map', () => {
    expect(lemmatizeSentence('').size).toBe(0);
    expect(lemmatizeSentence('   ...  ').size).toBe(0);
  });
});
