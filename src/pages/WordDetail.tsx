import { useEffect, useState } from 'react';
import type { LookupResult } from '../lib/dict';
import { lookupWord } from '../lib/dict';
import { addWord } from '../lib/db';
import { ARTICLES } from '../data/articles';
import { useData, getData, setData } from '../lib/store';
import { navigate } from '../lib/router';
import { hasVoiceFor, speakWord } from '../lib/speech';
import { normalizeWord } from '../lib/lemma';
import { Badge, Button, Card, Chip, Empty, IconButton, Skeleton, toast } from '../components/ui';
import { Icon } from '../components/icons';
import { formatRelativeTime } from '../lib/text';

export function WordDetail({ lemma }: { lemma: string }) {
  const data = useData();
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const key = normalizeWord(lemma);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    lookupWord(key, { online: getData().settings.onlineDictionary })
      .then((r) => {
        if (!alive) return;
        setResult(r);
        setLoading(false);
      })
      .catch(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [key]);

  const entry = data.vocabEntries.find((e) => e.lemma === (result?.lemma ?? key));
  const occ = entry ? data.occurrences.filter((o) => o.vocabularyEntryId === entry.id) : [];
  const logs = entry ? data.reviews.filter((r) => r.vocabularyEntryId === entry.id).slice(-5).reverse() : [];

  const related = ARTICLES.filter((a) =>
    Object.keys(a.glossary || {}).some((k) => normalizeWord(k) === (result?.lemma ?? key)),
  ).slice(0, 4);

  const addToNotebook = () => {
    if (!result) return;
    const sentence = occ[0]?.sentence ?? '';
    const out = addWord(getData(), {
      surface: result.surface || key,
      lemma: result.lemma,
      pos: result.pos,
      phonetics: result.phonetic,
      definitions: result.senses,
      contextualMeaning: result.contextual?.text,
      pendingGloss: result.pending,
      sentence,
      articleId: occ[0]?.articleId ?? '',
      articleTitle: occ[0]?.articleTitle ?? '手动查询',
      now: Date.now(),
    });
    setData(out.data, true);
    setAdded(true);
    toast(out.created ? '已加入生词本' : '该词已在生词本中', 'success');
  };

  const voiceOk = hasVoiceFor('us');

  return (
    <div className="page">
      <button className="link-btn" onClick={() => navigate('/notebook')} style={{ marginBottom: 12 }}>
        <Icon name="left" size={12} /> 返回生词本
      </button>

      <div className="wd">
        <div className="wd__head">
          <div>
            <h1 className="wd__title">{result?.lemma ?? key}</h1>
            <div className="wd__phon">
              {result?.phonetic.uk ? <span>英 {result.phonetic.uk}</span> : null}
              {result?.phonetic.us ? <span>美 {result.phonetic.us}</span> : null}
              {!result?.phonetic.uk && !result?.phonetic.us ? <span className="hint">音标未收录</span> : null}
              <IconButton icon="volume" label="朗读英式" size={15} disabled={!voiceOk} onClick={() => speakWord(key, 'uk', 0.85)} />
              <IconButton icon="volume" label="朗读美式" size={15} disabled={!voiceOk} onClick={() => speakWord(key, 'us', 0.85)} />
            </div>
            <div className="wd__chips">
              {result?.pos ? <Chip small>{result.pos}</Chip> : null}
              {entry ? (
                <Badge tone={entry.masteryStatus === 'mastered' ? 'green' : 'accent'}>
                  {entry.masteryStatus === 'mastered' ? '已掌握' : '在生词本中'}
                </Badge>
              ) : null}
              {result?.source ? (
                <span className="hint">
                  {result.source === 'lexicon'
                    ? '核心词典'
                    : result.source === 'glossary'
                      ? '文章标注释义'
                      : result.source === 'online'
                        ? '在线词典'
                        : '未收录'}
                </span>
              ) : null}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!entry ? (
              <Button variant="primary" icon="plus" onClick={addToNotebook} disabled={!result || added}>
                加入生词本
              </Button>
            ) : (
              <Button variant="secondary" icon="cards" onClick={() => navigate('/review')}>
                去复习
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <Card>
            <Skeleton lines={4} />
          </Card>
        ) : result?.pending ? (
          <Card>
            <div className="callout callout--warn">
              词典暂未收录该词，也不会编造释义。
              {getData().settings.onlineDictionary ? '可稍后重试，或在设置中确认在线词典是否可用。' : '可在设置中开启在线词典补充查询。'}
            </div>
          </Card>
        ) : (
          <>
            <Card>
              <div className="section-title">释义</div>
              {result?.senses.map((s, i) => (
                <div className="sense" key={i}>
                  <div className="sense__def">
                    {s.pos ? <span className="sense__pos">{s.pos}</span> : null}
                    {s.definition}
                  </div>
                  {s.example ? <div className="sense__example">{s.example}</div> : null}
                  {s.note ? <div className="sense__note">{s.note}</div> : null}
                </div>
              ))}
            </Card>

            {result?.semanticNote || result?.synonyms.length ? (
              <div className="chart-grid">
                {result.semanticNote ? (
                  <Card>
                    <div className="section-title">词义之间的联系</div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)' }}>{result.semanticNote}</p>
                  </Card>
                ) : null}
                {result.synonyms.length ? (
                  <Card>
                    <div className="section-title">近义词辨析</div>
                    <ul className="syn-list">
                      {result.synonyms.map((s) => (
                        <li key={s.word}>
                          <strong>{s.word}</strong>
                          <span>{s.distinction}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ) : null}
              </div>
            ) : null}

            {result?.collocations.length || result?.family.length ? (
              <Card>
                {result.collocations.length ? (
                  <>
                    <div className="section-title">常见搭配</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.collocations.map((c) => (
                        <span className="chip" key={c.phrase}>
                          {c.phrase} <span className="hint">{c.cn}</span>
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}
                {result.family.length ? (
                  <>
                    <div className="section-title">同族词形</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.family.map((f) => (
                        <Chip key={f} small onClick={() => navigate(`/word/${encodeURIComponent(f)}`)}>
                          {f}
                        </Chip>
                      ))}
                    </div>
                  </>
                ) : null}
              </Card>
            ) : null}
          </>
        )}

        {occ.length ? (
          <Card>
            <div className="section-title">你的上下文记录（{occ.length}）</div>
            <ul className="occ-list">
              {occ.map((o) => (
                <li className="occ" key={o.id}>
                  <p className="occ__sentence">{o.sentence}</p>
                  {o.contextualMeaning ? <p className="occ__ctx">语境释义：{o.contextualMeaning}</p> : null}
                  <div className="occ__meta">
                    <button className="link-btn" onClick={() => navigate(`/read/${o.articleId}`)}>
                      {o.articleTitle}
                    </button>
                    <span>·</span>
                    <span>{formatRelativeTime(o.encounteredAt, Date.now())}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {logs.length ? (
          <Card>
            <div className="section-title">复习记录</div>
            <ul className="occ-list">
              {logs.map((l) => (
                <li className="occ" key={l.id}>
                  <div className="occ__meta" style={{ marginTop: 0 }}>
                    <Badge tone={l.grade === 'again' ? 'red' : l.grade === 'hard' ? 'orange' : l.grade === 'good' ? 'accent' : 'green'}>
                      {l.grade === 'again' ? '忘了' : l.grade === 'hard' ? '勉强' : l.grade === 'good' ? '记得' : '很熟'}
                    </Badge>
                    <span>{formatRelativeTime(l.reviewedAt, Date.now())}</span>
                    <span>·</span>
                    <span>
                      间隔 {l.prevIntervalDays} → {l.nextIntervalDays} 天
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {related.length ? (
          <Card>
            <div className="section-title">包含该词的文章</div>
            <ul className="recent-list">
              {related.map((a) => (
                <li key={a.id}>
                  <button className="recent-item" onClick={() => navigate(`/read/${a.id}`)}>
                    <span className="recent-item__title">{a.title}</span>
                    <span className="recent-item__meta">
                      {a.titleZh} · L{a.level} · {a.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {!loading && result?.pending && !occ.length ? (
          <Empty icon="search" title="没有更多数据" desc="换一个词试试，或直接阅读文章积累语境。" />
        ) : null}
      </div>
    </div>
  );
}
