import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Article } from '../data/types';
import { articleMinutes, articleSentences, articleWords, getArticle, LEVELS } from '../data/articles';
import { lemmatize, normalizeWord } from '../lib/lemma';
import { quickGloss } from '../lib/dict';
import { markCompleted, saveProgress } from '../lib/db';
import { getData, setData, useData, flush } from '../lib/store';
import { navigate } from '../lib/router';
import { hasVoiceFor, speak, stopSpeaking } from '../lib/speech';
import { tokenize } from '../lib/text';
import { Badge, Button, Chip, Dialog, Empty, IconButton, Popover, Progress, Segmented, toast } from '../components/ui';
import { WordPopover } from '../components/WordPopover';
import { Icon } from '../components/icons';

const wc = (s: string) => (s.match(/[A-Za-z][A-Za-z'-]*/g) || []).length;

type PanelTab = 'outline' | 'vocab' | 'grammar' | 'quiz';

export function Reader({ id }: { id: string }) {
  const article = getArticle(id);
  if (!article) {
    return (
      <div className="page">
        <Empty
          icon="book"
          title="找不到这篇文章"
          desc="文章可能已被移除，或链接有误。"
          action={<Button variant="primary" onClick={() => navigate('/library')}>回到文章库</Button>}
        />
      </div>
    );
  }
  return <ReaderInner key={article.id} article={article} />;
}

function ReaderInner({ article }: { article: Article }) {
  const data = useData();
  const settings = data.settings;
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeWord, setActiveWord] = useState<{ surface: string; sentence: string; rect: DOMRect } | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [panelOpen, setPanelOpen] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth > 1180));
  const [panelTab, setPanelTab] = useState<PanelTab>('outline');
  const [focus, setFocus] = useState(settings.focusMode);
  const [speaking, setSpeaking] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupText, setLookupText] = useState('');
  const [hoverTip, setHoverTip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const closeOnSmallScreen = () => { if (window.innerWidth <= 1180) setPanelOpen(false); };
    window.addEventListener('resize', closeOnSmallScreen);
    return () => window.removeEventListener('resize', closeOnSmallScreen);
  }, []);

  const flat = useMemo(() => articleSentences(article), [article]);
  const cumWords = useMemo(() => {
    let acc = 0;
    return flat.map((s) => (acc += wc(s.en)));
  }, [flat]);
  const totalWords = useMemo(() => articleWords(article), [article]);
  const minutes = useMemo(() => articleMinutes(article), [article]);

  const lemmaMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of flat) {
      for (const t of tokenize(s.en)) {
        if (t.type !== 'word') continue;
        const key = normalizeWord(t.text);
        if (!key || map.has(key)) continue;
        const r = lemmatize(key);
        map.set(key, r.lemma || key);
      }
    }
    return map;
  }, [flat]);

  const vocabIndex = useMemo(() => {
    const map = new Map<string, import('../data/types').VocabularyEntry>();
    for (const e of data.vocabEntries) map.set(e.lemma, e);
    return map;
  }, [data.vocabEntries]);

  const saved = data.progress[article.id];
  const levelMeta = LEVELS.find((l) => l.level === article.level);

  /* ---------------- 阅读进度 ---------------- */
  const lastIdx = useRef<number>(-1);

  const commitProgress = useCallback(
    (idx: number) => {
      const now = Date.now();
      const previous = getData().progress[article.id];
      const words = cumWords[Math.min(idx, cumWords.length - 1)] ?? 0;
      const next = saveProgress(getData(), {
        articleId: article.id,
        sentenceIndex: idx,
        ratio: Math.min(1, (idx + 1) / flat.length),
        wordsRead: words,
        startedAt: previous?.startedAt ?? now,
        updatedAt: now,
        completedAt: previous?.completedAt,
      });
      setData(next);
    },
    [article.id, cumWords, flat.length],
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const nodes = el.querySelectorAll<HTMLElement>('[data-sent]');
        const cutoff = el.getBoundingClientRect().top + el.clientHeight * 0.72;
        let idx = 0;
        nodes.forEach((n) => {
          if (n.getBoundingClientRect().top <= cutoff) idx = Number(n.dataset.sent ?? 0);
        });
        if (idx !== lastIdx.current) {
          lastIdx.current = idx;
          commitProgress(idx);
        }
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    const onHide = () => {
      if (lastIdx.current >= 0) commitProgress(lastIdx.current);
      flush();
    };
    window.addEventListener('pagehide', onHide);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', onHide);
      onHide();
    };
  }, [commitProgress]);

  // 恢复阅读位置
  useEffect(() => {
    if (!saved || saved.sentenceIndex <= 0) return;
    const el = stageRef.current?.querySelector<HTMLElement>(`[data-sent="${saved.sentenceIndex}"]`);
    if (el && stageRef.current) {
      const stage = stageRef.current;
      const top = stage.scrollTop + el.getBoundingClientRect().top - stage.getBoundingClientRect().top - stage.clientHeight * 0.72;
      stageRef.current.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    }
    // 只在首次挂载时恢复
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.dataset.focus = focus ? '1' : '0';
    return () => {
      delete document.body.dataset.focus;
    };
  }, [focus]);

  useEffect(() => () => stopSpeaking(), []);

  /* ---------------- 交互 ---------------- */
  const openWord = (e: React.SyntheticEvent, surface: string, sentence: string) => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) return; // 用户正在选择文本，不打断
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setActiveWord({ surface, sentence, rect });
  };

  const toggleSentence = (idx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleParagraph = (pi: number) => {
    const ids = flat.filter((f) => f.paraIndex === pi).map((f) => f.globalIndex);
    setExpanded((prev) => {
      const next = new Set(prev);
      const allOpen = ids.every((i) => next.has(i));
      for (const i of ids) {
        if (allOpen) next.delete(i);
        else next.add(i);
      }
      return next;
    });
  };

  const toggleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    if (!hasVoiceFor(settings.speechVoice)) {
      toast('当前系统没有可用的英语语音，朗读不可用', 'error');
      return;
    }
    const text = flat.map((s) => s.en).join(' ');
    const ok = speak(text, {
      accent: settings.speechVoice,
      rate: settings.speechRate,
      onEnd: () => setSpeaking(false),
      onError: (m) => {
        setSpeaking(false);
        toast(m, 'error');
      },
    });
    setSpeaking(ok);
    if (ok) toast('开始朗读全文', 'success');
  };

  const finishReading = () => {
    const now = Date.now();
    setData(markCompleted(getData(), article.id, totalWords, now), true);
    toast('已记录完成阅读，进入理解测试', 'success');
    navigate(`/quiz/${article.id}`);
  };

  const scrollToSentence = (idx: number) => {
    const el = stageRef.current?.querySelector<HTMLElement>(`[data-sent="${idx}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const progressRatio = saved ? Math.max(saved.ratio, 0) : 0;
  const quizAttempts = data.quizAttempts.filter((a) => a.articleId === article.id);
  const bestScore = quizAttempts.length
    ? Math.max(...quizAttempts.map((a) => Math.round((a.correctCount / a.total) * 100)))
    : null;

  const wordClass = (surface: string): string => {
    const key = normalizeWord(surface);
    const lemma = lemmaMap.get(key) ?? key;
    const entry = vocabIndex.get(lemma);
    let cls = 'w';
    if (settings.showVocabMarks && entry) {
      cls += entry.masteryStatus === 'mastered' ? ' w--mastered' : ' w--vocab';
      cls += ` w--mark-${settings.markStyle}`;
    }
    if (activeWord && normalizeWord(activeWord.surface) === key) cls += ' w--active';
    return cls;
  };

  const onWordEnter = (e: React.MouseEvent, surface: string) => {
    if (!settings.showVocabMarks) return;
    const key = normalizeWord(surface);
    const lemma = lemmaMap.get(key) ?? key;
    const entry = vocabIndex.get(lemma);
    if (!entry) return;
    const gloss = quickGloss(surface, article.id);
    if (!gloss) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setHoverTip({ text: `${lemma}${entry.partOfSpeech ? ' ' + entry.partOfSpeech : ''} · ${gloss}`, x: r.left + r.width / 2, y: r.top });
  };

  return (
    <div
      className="reader"
      data-reader-theme={settings.readingTheme}
      style={
        {
          '--reader-size': `${19 * settings.fontScale}px`,
          '--reader-lh': String(settings.lineHeight),
          '--reader-font': settings.readingFont === 'serif' ? 'var(--font-reading)' : 'var(--font-reading-sans)',
        } as React.CSSProperties
      }
    >
      <header className="reader__top">
        <IconButton icon="left" label="返回文章库" onClick={() => navigate('/library')} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="reader__title" title={article.title}>
            {article.title}
          </div>
          <div className="reader__meta">
            <Chip level={article.level} small>
              Level {article.level} · {levelMeta?.name}
            </Chip>
            <span>{article.category}</span>
            <span>{totalWords} 词</span>
            <span>约 {minutes} 分钟</span>
            {bestScore !== null ? <Badge tone={bestScore >= 80 ? 'green' : 'orange'}>理解 {bestScore}%</Badge> : null}
          </div>
        </div>
        <div className="reader__top-progress" title={`阅读进度 ${Math.round(progressRatio * 100)}%`}>
          <Progress value={progressRatio} thin label="阅读进度" />
          <span className="mono">{Math.round(progressRatio * 100)}%</span>
        </div>
        <IconButton icon="search" label="查词" onClick={() => setLookupOpen(true)} />
        <IconButton
          icon="panel"
          label={panelOpen ? '收起侧边面板' : '打开侧边面板'}
          active={panelOpen}
          onClick={() => setPanelOpen((v) => !v)}
        />
        <IconButton icon={focus ? 'eye' : 'eyeOff'} label={focus ? '退出专注模式' : '专注模式'} onClick={() => setFocus((v) => !v)} />
      </header>

      <div className="reader__stage">
        <div className="reader__scroll" ref={stageRef}>
          <article className="reader__article" lang="en">
            <h1 className="reader__headline">{article.title}</h1>
            <p className="reader__subhead">
              {article.titleZh} · {article.category} · Level {article.level}
            </p>

            {article.paragraphs.map((p, pi) => (
              <div className="reader__para" key={pi}>
                {p.sentences.map((s, si) => {
                  const idx = flat.findIndex((f) => f.paraIndex === pi && f.sentIndex === si);
                  const gi = idx >= 0 ? idx : 0;
                  return (
                    <span key={si}>
                      <span
                        className={`reader__sentence${expanded.has(gi) ? ' is-expanded' : ''}`}
                        data-sent={gi}
                        tabIndex={0}
                        role="button"
                        aria-label={`第 ${gi + 1} 句，按回车查看译文`}
                        onClick={() => toggleSentence(gi)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            toggleSentence(gi);
                          }
                        }}
                      >
                        {tokenize(s.en).map((t, ti) =>
                          t.type === 'word' ? (
                            <span
                              key={ti}
                              className={wordClass(t.text)}
                              role="button"
                              tabIndex={0}
                              aria-label={`查询单词 ${t.text}`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openWord(e, t.text, s.en);
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openWord(e, t.text, s.en);
                              }}
                              onMouseEnter={(e) => onWordEnter(e, t.text)}
                              onMouseLeave={() => setHoverTip(null)}
                            >
                              {t.text}
                            </span>
                          ) : (
                            <span key={ti}>{t.text}</span>
                          ),
                        )}
                      </span>
                      {expanded.has(gi) ? (
                        <span className="sent-zh" lang="zh-CN">
                          {s.zh}
                        </span>
                      ) : null}{' '}
                    </span>
                  );
                })}
                <button
                  className="para-translate"
                  onClick={() => toggleParagraph(pi)}
                  aria-label={`第 ${pi + 1} 段译文`}
                >
                  {flat.filter((f) => f.paraIndex === pi).every((f) => expanded.has(f.globalIndex))
                    ? '收起译文'
                    : '全段译文'}
                </button>
              </div>
            ))}

            <div className="reader__end">
              <p className="hint">读完了。做 3–5 道理解题，检验一下真正的收获。</p>
              <Button variant="primary" icon="target" onClick={finishReading}>
                完成阅读并测试
              </Button>
            </div>
          </article>
        </div>

        <aside className="reader__panel" data-open={panelOpen} aria-hidden={!panelOpen}>
          <div className="reader__panel-head">
            <Segmented
              ariaLabel="侧边面板切换"
              value={panelTab}
              onChange={(v) => setPanelTab(v)}
              options={[
                { value: 'outline', label: '目录' },
                { value: 'vocab', label: '重点词' },
                { value: 'grammar', label: '语法' },
                { value: 'quiz', label: '测试' },
              ]}
            />
            <IconButton icon="close" label="关闭面板" onClick={() => setPanelOpen(false)} />
          </div>

          <div className="reader__panel-body">
            {panelTab === 'outline' && (
              <ol className="reader__outline">
                {article.paragraphs.map((p, pi) => {
                  const first = flat.find((f) => f.paraIndex === pi);
                  return (
                    <li key={pi}>
                      <button onClick={() => first && scrollToSentence(first.globalIndex)}>
                        <span className="mono">{pi + 1}</span>
                        <span>{p.sentences[0]?.en.slice(0, 46)}…</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}

            {panelTab === 'vocab' && (
              <div>
                <p className="hint" style={{ marginBottom: 10 }}>
                  本文重点词。点击任意词查看语境释义，并自动加入生词本。
                </p>
                <ul className="reader__vocab-list">
                  {article.keyVocab.map((v) => {
                    const entry = vocabIndex.get(normalizeWord(v.word));
                    return (
                      <li key={v.word}>
                        <button
                          onClick={(e) => {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            const sent = flat.find((f) =>
                              f.en.toLowerCase().includes(v.word.toLowerCase().slice(0, Math.max(4, v.word.length - 2))),
                            );
                            setActiveWord({ surface: v.word, sentence: sent?.en ?? flat[0]?.en ?? '', rect });
                          }}
                        >
                          <span className="reader__vocab-word">
                            {v.word}
                            {entry ? <Icon name="check" size={12} /> : null}
                          </span>
                          <span className="reader__vocab-gloss">
                            {v.pos} {v.gloss}
                          </span>
                          {v.note ? <span className="hint">{v.note}</span> : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {panelTab === 'grammar' && (
              <div className="reader__grammar">
                {article.grammar.map((g, i) => (
                  <details key={i} className="grammar-card">
                    <summary>{g.en}</summary>
                    <dl>
                      <dt>主干</dt>
                      <dd>{g.main}</dd>
                      <dt>主语</dt>
                      <dd>{g.subject}</dd>
                      <dt>谓语</dt>
                      <dd>{g.predicate}</dd>
                      <dt>宾语</dt>
                      <dd>{g.object}</dd>
                      <dt>修饰成分</dt>
                      <dd>{g.modifiers}</dd>
                      <dt>逻辑关系</dt>
                      <dd>{g.logic}</dd>
                      <dt>参考译文</dt>
                      <dd>{g.zh}</dd>
                    </dl>
                  </details>
                ))}
              </div>
            )}

            {panelTab === 'quiz' && (
              <div>
                <p className="hint" style={{ marginBottom: 12 }}>
                  共 {article.quiz.length} 题，覆盖主旨、细节、词义推断与作者观点。提交后才会显示答案。
                </p>
                {quizAttempts.length ? (
                  <div className="callout callout--info" style={{ marginBottom: 12 }}>
                    已测试 {quizAttempts.length} 次，最好成绩 {bestScore}%
                  </div>
                ) : null}
                <Button variant="primary" icon="target" block onClick={() => navigate(`/quiz/${article.id}`)}>
                  开始理解测试
                </Button>
                <div style={{ marginTop: 12 }}>
                  <Button variant="secondary" icon="check" block onClick={finishReading}>
                    标记为已读完
                  </Button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 浮动阅读工具栏 */}
      <div className="reader__toolbar" role="toolbar" aria-label="阅读设置">
        <div className="tool-group">
          <button
            className="tool-btn"
            aria-label="减小字号"
            onClick={() => setData({ ...getData(), settings: { ...settings, fontScale: Math.max(0.85, +(settings.fontScale - 0.05).toFixed(2)) } }, true)}
          >
            A<span className="tool-btn__sign">−</span>
          </button>
          <span className="tool-label mono">{Math.round(settings.fontScale * 100)}%</span>
          <button
            className="tool-btn"
            aria-label="增大字号"
            onClick={() => setData({ ...getData(), settings: { ...settings, fontScale: Math.min(1.5, +(settings.fontScale + 0.05).toFixed(2)) } }, true)}
          >
            A<span className="tool-btn__sign">+</span>
          </button>
        </div>
        <div className="tool-sep tool-sep--lines" />
        <div className="tool-group tool-group--lines">
          <button
            className="tool-btn"
            aria-label="减小行距"
            onClick={() => setData({ ...getData(), settings: { ...settings, lineHeight: Math.max(1.4, +(settings.lineHeight - 0.1).toFixed(2)) } }, true)}
          >
            <Icon name="list" size={15} />
          </button>
          <span className="tool-label mono">{settings.lineHeight.toFixed(1)}</span>
          <button
            className="tool-btn"
            aria-label="增大行距"
            onClick={() => setData({ ...getData(), settings: { ...settings, lineHeight: Math.min(2.2, +(settings.lineHeight + 0.1).toFixed(2)) } }, true)}
          >
            <Icon name="sliders" size={15} />
          </button>
        </div>
        <div className="tool-sep tool-sep--theme" />
        <div className="tool-group tool-group--theme" role="group" aria-label="阅读主题">
          {(['paper', 'plain', 'sepia', 'night'] as const).map((t) => (
            <button
              key={t}
              className={`tool-swatch tool-swatch--${t}`}
              aria-label={`阅读主题 ${t}`}
              aria-pressed={settings.readingTheme === t}
              onClick={() => setData({ ...getData(), settings: { ...settings, readingTheme: t } }, true)}
            />
          ))}
        </div>
        <div className="tool-sep" />
        <button
          className="tool-btn"
          aria-label={speaking ? '停止朗读' : '朗读全文'}
          aria-pressed={speaking}
          onClick={toggleSpeak}
        >
          <Icon name={speaking ? 'close' : 'headphones'} size={16} />
        </button>
        <button
          className="tool-btn"
          aria-label="切换标记显示"
          aria-pressed={settings.showVocabMarks}
          onClick={() => setData({ ...getData(), settings: { ...settings, showVocabMarks: !settings.showVocabMarks } }, true)}
        >
          <Icon name={settings.showVocabMarks ? 'eye' : 'eyeOff'} size={16} />
        </button>
        <button
          className="tool-btn"
          aria-label="切换译文显示方式"
          onClick={() =>
            setData(
              {
                ...getData(),
                settings: {
                  ...settings,
                  translationMode: settings.translationMode === 'hidden' ? 'tap' : 'hidden',
                },
              },
              true,
            )
          }
          title={settings.translationMode === 'hidden' ? '点击句子显示译文' : '译文已关闭'}
        >
          <Icon name="quote" size={16} />
        </button>
      </div>

      {activeWord ? (
        <Popover anchor={activeWord.rect} onClose={() => setActiveWord(null)} ariaLabel={`${activeWord.surface} 的释义`}>
          <WordPopover
            surface={activeWord.surface}
            sentence={activeWord.sentence}
            articleId={article.id}
            articleTitle={article.title}
            onClose={() => setActiveWord(null)}
          />
        </Popover>
      ) : null}

      {hoverTip ? (
        <div className="w-tip" style={{ left: hoverTip.x, top: hoverTip.y - 8 }} role="tooltip">
          {hoverTip.text}
        </div>
      ) : null}

      <Dialog
        open={lookupOpen}
        onClose={() => setLookupOpen(false)}
        title="查词"
        desc="输入任意英语单词，跳转到单词解析页。"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setLookupOpen(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const q = normalizeWord(lookupText);
                if (!q) return;
                setLookupOpen(false);
                navigate(`/word/${encodeURIComponent(q)}`);
              }}
            >
              查询
            </Button>
          </>
        }
      >
        <input
          className="input"
          autoFocus
          placeholder="例如 maintain"
          value={lookupText}
          onChange={(e) => setLookupText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const q = normalizeWord(lookupText);
              if (!q) return;
              setLookupOpen(false);
              navigate(`/word/${encodeURIComponent(q)}`);
            }
          }}
        />
      </Dialog>
    </div>
  );
}
