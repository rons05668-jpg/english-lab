import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LookupResult } from '../lib/dict';
import { dictionaryService } from '../lib/dictionary-service';
import { addWord, markMastered, unmarkMastered, updateEntry } from '../lib/db';
import { getData, setData } from '../lib/store';
import { hasVoiceFor, speakWord } from '../lib/speech';
import { navigate } from '../lib/router';
import { Button, IconButton, toast } from './ui';
import { Icon } from './icons';
import type { VocabularyEntry } from '../data/types';

const BASIS_LABEL: Record<string, { text: string; tone: string; hint: string }> = {
  'article-glossary': { text: '本文标注', tone: 'accent', hint: '本文作者为该词标注的语境释义' },
  collocation: { text: '固定搭配', tone: 'green', hint: '依据句中的固定搭配判断' },
  'pos-match': { text: '按词性推测', tone: 'orange', hint: '仅依据词性匹配，语境判断不可靠，请结合上下文' },
  none: { text: '待补充', tone: 'red', hint: '未能可靠确定语境含义' },
};

export function WordPopover({
  surface,
  sentence,
  articleId,
  articleTitle,
  onClose,
}: {
  surface: string;
  sentence: string;
  articleId: string;
  articleTitle: string;
  onClose: () => void;
}) {
  const [result, setResult] = useState<LookupResult | null>(null);
  const [entry, setEntry] = useState<VocabularyEntry | null>(null);
  const [created, setCreated] = useState(false);
  const [saveState, setSaveState] = useState<'saving' | 'saved' | 'failed'>('saving');
  const [loading, setLoading] = useState(true);
  const [onlineState, setOnlineState] = useState<'idle' | 'loading' | 'failed'>('idle');

  const settings = getData().settings;
  const voiceOk = hasVoiceFor('uk') || hasVoiceFor('us');

  const persist = useCallback(
    (res: LookupResult, isCreated: boolean) => {
      const out = addWord(getData(), {
        surface,
        lemma: res.lemma,
        pos: res.pos,
        phonetics: res.phonetic,
        definitions: res.senses,
        contextualMeaning: res.contextual?.text,
        pendingGloss: res.pending,
        sentence,
        articleId,
        articleTitle,
        now: Date.now(),
      });
      const saved = setData(out.data, true);
      setSaveState(saved ? 'saved' : 'failed');
      setEntry(out.entry);
      setCreated(isCreated && out.created);
    },
    [articleId, articleTitle, sentence, surface],
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setSaveState('saving');
    dictionaryService.lookup(surface, { sentence, articleId, online: false })
      .then((res) => {
        if (!alive) return;
        setResult(res);
        persist(res, true);
        setLoading(false);
        if (res.pending && settings.onlineDictionary) void tryOnline(res.lemma);
      })
      .catch(() => {
        if (!alive) return;
        setLoading(false);
        setSaveState('failed');
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surface, sentence, articleId]);

  const tryOnline = async (lemma: string) => {
    setOnlineState('loading');
    const res = await dictionaryService.lookup(lemma, { sentence, articleId, online: true });
    if (res.senses.length) {
      setResult(res);
      const cur = getData().vocabEntries.find((e) => e.lemma === res.lemma);
      if (cur) {
        setData(
          updateEntry(
            getData(),
            cur.id,
            {
              definitions: res.senses,
              phonetics: res.phonetic,
              pendingGloss: false,
              partOfSpeech: res.pos || cur.partOfSpeech,
            },
            Date.now(),
          ),
        );
        setEntry({ ...cur, definitions: res.senses, pendingGloss: false });
      }
      setOnlineState('idle');
    } else {
      setOnlineState('failed');
    }
  };

  const basis = result?.contextual ? BASIS_LABEL[result.contextual.basis] : null;
  const occurrenceCount = useMemo(() => {
    if (!entry) return 0;
    return getData().occurrences.filter((o) => o.vocabularyEntryId === entry.id).length;
  }, [entry]);

  const toggleMastered = () => {
    if (!entry) return;
    const mastered = entry.masteryStatus === 'mastered';
    setData(
      mastered
        ? unmarkMastered(getData(), entry.id, Date.now())
        : markMastered(getData(), entry.id, 'user', Date.now()),
      true,
    );
    setEntry({ ...entry, masteryStatus: mastered ? 'reviewing' : 'mastered' });
    toast(mastered ? '已重新加入复习' : '已标记为掌握', 'success');
  };

  return (
    <div className="vocab-card">
      <div className="popover__head">
        <div className="vp-head__main">
          <div className="vp-word-row">
            <span className="vocab-card__word">{surface}</span>
            {result && result.lemma !== surface ? <span className="hint">原形 {result.lemma}</span> : null}
            {result?.pos ? <span className="vocab-card__pos">{result.pos}</span> : null}
          </div>
          <div className="vp-phon-row">
            {result?.phonetic.uk ? (
              <span className="vp-pair">
                <span className="vocab-card__phon">{result.source === 'ecdict' ? '词库音标' : '英'} {result.phonetic.uk}</span>
                <button
                  className="vp-speak"
                  aria-label="朗读英式发音"
                  title={voiceOk ? '朗读英式发音' : '当前系统没有可用的英语语音'}
                  disabled={!voiceOk}
                  onClick={() => speakWord(surface, 'uk', settings.speechRate)}
                >
                  <Icon name="volume" size={13} />
                </button>
              </span>
            ) : null}
            {result?.phonetic.us ? (
              <span className="vp-pair">
                <span className="vocab-card__phon">美 {result.phonetic.us}</span>
                <button
                  className="vp-speak"
                  aria-label="朗读美式发音"
                  title={voiceOk ? '朗读美式发音' : '当前系统没有可用的英语语音'}
                  disabled={!voiceOk}
                  onClick={() => speakWord(surface, 'us', settings.speechRate)}
                >
                  <Icon name="volume" size={13} />
                </button>
              </span>
            ) : null}
            {!result?.phonetic.uk && !result?.phonetic.us ? <span className="hint">音标未收录</span> : null}
          </div>
        </div>
        <IconButton icon="close" label="关闭" onClick={onClose} size={16} />
      </div>

      <div className="popover__body">
        <div className="vp-status">
          <span className={`badge badge--${created ? 'green' : 'accent'}`}>
            <Icon name={created ? 'check' : 'bookmark'} size={11} />
            {saveState === 'saving' ? '正在保存…' : saveState === 'failed' ? '保存失败' : created ? '已加入生词本' : '已在生词本'}
          </span>
          {occurrenceCount > 1 ? <span className="hint">这是第 {occurrenceCount} 处上下文</span> : null}
          {entry?.masteryStatus === 'mastered' ? <span className="badge badge--purple">已掌握</span> : null}
        </div>

        {saveState === 'failed' ? <div className="callout callout--warn" role="alert">记录尚未成功保存。请检查浏览器存储权限或空间。<Button size="sm" onClick={() => { if (result) persist(result, false); }}>重试保存</Button></div> : null}

        {loading ? (
          <div className="skeleton skeleton--line" style={{ height: 44 }} />
        ) : result?.pending ? (
          <div className="callout callout--warn" style={{ marginBottom: 12 }}>
            <strong>词典暂未收录该词。</strong>
            <div className="hint" style={{ marginTop: 4 }}>
              已先存入生词本并标记为「释义待补充」，不会编造释义。
              {settings.onlineDictionary ? null : '可在设置中开启在线词典查询。'}
            </div>
            {settings.onlineDictionary ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => void tryOnline(result.lemma)}
                loading={onlineState === 'loading'}
                style={{ marginTop: 8 }}
              >
                {onlineState === 'failed' ? '重试在线查询' : '联网查询释义'}
              </Button>
            ) : null}
            {onlineState === 'failed' ? (
              <div className="hint" style={{ marginTop: 6 }}>
                在线词典不可用（网络受限或该词未收录），释义仍待补充。
              </div>
            ) : null}
          </div>
        ) : (
          <>
            {result?.contextual ? (
              <div className="vocab-card__ctx">
                <div className="vocab-card__ctx-label">
                  <span>当前语境</span>
                  {basis ? (
                    <span className={`badge badge--${basis.tone}`} title={basis.hint}>
                      {basis.text}
                    </span>
                  ) : null}
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.55 }}>{result.contextual.text}</div>
                <div className="hint" style={{ marginTop: 6, fontStyle: 'italic' }}>
                  “{sentence.length > 96 ? sentence.slice(0, 96) + '…' : sentence}”
                </div>
              </div>
            ) : (
              <div className="callout callout--info" style={{ marginBottom: 12 }}>
                无法从上下文可靠判断具体含义，下面是词典常见义项。
              </div>
            )}

            {result?.senses.length ? (
              <div className="wd__section" style={{ marginTop: 14 }}>
                <div className="section-title" style={{ margin: '0 0 8px' }}>
                  词典释义{result.source === 'ecdict' ? ' · ECDICT' : ''}
                </div>
                {result.senses.slice(0, 4).map((s, i) => (
                  <div className="sense" key={i}>
                    <div className="sense__def">
                      {s.pos ? <span className="sense__pos">{s.pos}</span> : null}
                      {s.definition}
                    </div>
                    {s.example ? (
                      <div className="sense__example">
                        {s.example}
                        {s.note ? <span className="sense__note">（{s.note}）</span> : null}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {result?.collocations.length ? (
              <div className="wd__section">
                <div className="section-title" style={{ margin: '0 0 8px' }}>
                  常见搭配
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.collocations.map((c) => (
                    <span className="chip chip--sm" key={c.phrase} title={c.cn}>
                      {c.phrase}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {result?.phraseHits.length ? (
              <div className="wd__section">
                <div className="section-title" style={{ margin: '0 0 8px' }}>
                  句中的固定搭配
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.phraseHits.map((p) => (
                    <span className="chip chip--sm" key={p}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {result?.semanticNote ? (
              <div className="wd__section">
                <div className="section-title" style={{ margin: '0 0 8px' }}>
                  词义联系
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-2)' }}>{result.semanticNote}</p>
              </div>
            ) : null}

            {result?.synonyms.length ? (
              <div className="wd__section">
                <div className="section-title" style={{ margin: '0 0 8px' }}>
                  近义词辨析
                </div>
                <ul className="syn-list">
                  {result.synonyms.map((s) => (
                    <li key={s.word}>
                      <strong>{s.word}</strong>
                      <span>{s.distinction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {result?.ambiguous.length ? (
              <p className="hint" style={{ marginTop: 10 }}>
                该词形可能对应多个原形（{result.ambiguous.join(' / ')}），已按最可能的一项处理。
              </p>
            ) : null}

            {result?.source === 'glossary' ? (
              <p className="hint" style={{ marginTop: 8 }}>
                释义来自本文词汇标注，尚未进入核心词典。
              </p>
            ) : null}
            {result?.source === 'ecdict' ? <p className="hint">来源：<a href="https://github.com/skywind3000/ECDICT" target="_blank" rel="noreferrer">ECDICT</a>（MIT）。以下为词典常见义，未经逐条人工校订；当前语境请优先参考本文标注。<a href="/licenses/ECDICT-LICENSE.txt">许可说明</a></p> : null}
          </>
        )}
      </div>

      <div className="popover__foot">
        <Button
          size="sm"
          variant="ghost"
          icon="graduation"
          onClick={toggleMastered}
          disabled={!entry}
        >
          {entry?.masteryStatus === 'mastered' ? '重新加入复习' : '标记已掌握'}
        </Button>
        <div style={{ flex: 1 }} />
        <Button
          size="sm"
          variant="secondary"
          iconRight="right"
          onClick={() => {
            if (result) navigate(`/word/${encodeURIComponent(result.lemma)}`);
            onClose();
          }}
        >
          详细解析
        </Button>
      </div>
    </div>
  );
}
