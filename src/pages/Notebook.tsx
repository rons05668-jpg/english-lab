import { useMemo, useState } from 'react';
import type { MasteryStatus, VocabularyEntry } from '../data/types';
import { useData, getData, setData } from '../lib/store';
import { deleteEntry, markMastered, occurrencesOf, reviewsOf, unmarkMastered } from '../lib/db';
import { navigate } from '../lib/router';
import { speakWord, hasVoiceFor } from '../lib/speech';
import { Badge, Button, Card, Chip, Empty, IconButton, Tabs, toast, useConfirm } from '../components/ui';
import { Icon } from '../components/icons';
import { formatRelativeTime } from '../lib/text';

const STATUS_LABEL: Record<MasteryStatus, { text: string; tone: 'accent' | 'green' | 'orange' | 'purple' }> = {
  new: { text: '新词', tone: 'accent' },
  learning: { text: '学习中', tone: 'orange' },
  reviewing: { text: '复习中', tone: 'purple' },
  mastered: { text: '已掌握', tone: 'green' },
};

type Filter = 'all' | MasteryStatus;

export function Notebook() {
  const data = useData();
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'recent' | 'alpha' | 'source'>('recent');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const { confirm, dialog } = useConfirm();

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data.vocabEntries.length };
    for (const e of data.vocabEntries) c[e.masteryStatus] = (c[e.masteryStatus] ?? 0) + 1;
    return c;
  }, [data.vocabEntries]);

  const sources = useMemo(() => {
    const set = new Set(data.occurrences.map((o) => o.articleTitle));
    return Array.from(set);
  }, [data.occurrences]);

  const list = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    let out = data.vocabEntries.filter((e) => {
      if (filter !== 'all' && e.masteryStatus !== filter) return false;
      if (keyword) {
        const hay = `${e.lemma} ${e.definitions.map((d) => d.definition).join(' ')} ${e.contextualMeaning ?? ''}`.toLowerCase();
        if (!hay.includes(keyword)) return false;
      }
      if (sourceFilter !== 'all') {
        const occ = data.occurrences.filter((o) => o.vocabularyEntryId === e.id);
        if (!occ.some((o) => o.articleTitle === sourceFilter)) return false;
      }
      return true;
    });
    out = [...out].sort((a, b) => {
      if (sort === 'alpha') return a.lemma.localeCompare(b.lemma);
      if (sort === 'source') {
        const oa = data.occurrences.find((o) => o.vocabularyEntryId === a.id)?.encounteredAt ?? 0;
        const ob = data.occurrences.find((o) => o.vocabularyEntryId === b.id)?.encounteredAt ?? 0;
        return ob - oa;
      }
      return b.createdAt - a.createdAt;
    });
    return out;
  }, [data.vocabEntries, data.occurrences, filter, q, sort, sourceFilter]);

  const selected = useMemo(() => {
    const id = selectedId ?? list[0]?.id ?? null;
    return data.vocabEntries.find((e) => e.id === id) ?? null;
  }, [selectedId, list, data.vocabEntries]);

  const remove = async (entry: VocabularyEntry) => {
    const ok = await confirm({
      title: `删除「${entry.lemma}」？`,
      desc: '会同时删除该词的上下文记录与复习历史，且无法恢复。如果只是不想再复习，建议标记为「已掌握」。',
      confirmText: '删除',
      danger: true,
    });
    if (!ok) return;
    setData(deleteEntry(getData(), entry.id), true);
    setSelectedId(null);
    toast('已删除该生词记录', 'success');
  };

  return (
    <div className="page page--wide">
      <div className="page__head">
        <h1 className="page__title">我的生词本</h1>
        <p className="page__desc">
          阅读时点击过的单词会自动出现在这里。收藏不等于掌握——掌握状态由复习表现或你的手动标记决定。
        </p>
      </div>

      <div className="nb">
        <div className="nb__list-col">
          <div className="nb__toolbar">
            <div className="input--search input-wrap">
              <Icon name="search" size={16} />
              <input
                className="input"
                placeholder="搜索单词或释义"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="搜索生词"
              />
              {q ? <IconButton icon="close" label="清空" size={14} onClick={() => setQ('')} /> : null}
            </div>
            <div className="nb__filters">
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="排序">
                <option value="recent">最近收藏</option>
                <option value="alpha">字母顺序</option>
                <option value="source">最近遇到</option>
              </select>
              <select
                className="select"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                aria-label="按文章来源筛选"
              >
                <option value="all">全部来源</option>
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <Tabs
              value={filter}
              onChange={setFilter}
              tabs={[
                { value: 'all', label: '全部', count: counts.all },
                { value: 'new', label: '新词', count: counts.new ?? 0 },
                { value: 'learning', label: '学习中', count: counts.learning ?? 0 },
                { value: 'reviewing', label: '复习中', count: counts.reviewing ?? 0 },
                { value: 'mastered', label: '已掌握', count: counts.mastered ?? 0 },
              ]}
            />
          </div>

          {list.length === 0 ? (
            <Empty
              icon="notebook"
              title={data.vocabEntries.length ? '没有匹配的单词' : '生词本还是空的'}
              desc={
                data.vocabEntries.length
                  ? '换个筛选条件或清空搜索词。'
                  : '打开一篇文章，点击任意不认识的单词，它会自动出现在这里。'
              }
              action={
                <Button variant="primary" onClick={() => navigate('/library')}>
                  去阅读
                </Button>
              }
            />
          ) : (
            <ul className="nb__list">
              {list.map((e) => {
                const occ = data.occurrences.filter((o) => o.vocabularyEntryId === e.id);
                const st = STATUS_LABEL[e.masteryStatus];
                return (
                  <li key={e.id}>
                    <button
                      className={`nb-row${selected?.id === e.id ? ' nb-row--active' : ''}`}
                      onClick={() => setSelectedId(e.id)}
                    >
                      <span className="nb-row__main">
                        <span className="nb-row__word">{e.lemma}</span>
                        <span className="nb-row__meta">
                          {e.partOfSpeech} {e.contextualMeaning || e.definitions[0]?.definition || '释义待补充'}
                        </span>
                      </span>
                      <span className="nb-row__side">
                        <Badge tone={st.tone}>{st.text}</Badge>
                        <span className="hint mono">{occ.length} 处</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="nb__detail-col">
          {selected ? (
            <NotebookDetail
              entry={selected}
              onDelete={() => void remove(selected)}
              onSelectArticle={(id) => navigate(`/read/${id}`)}
            />
          ) : (
            <Card>
              <Empty icon="notebook" title="选择一个单词" desc="左侧列表中选择单词，查看它的释义、上下文与复习记录。" />
            </Card>
          )}
        </div>
      </div>
      {dialog}
    </div>
  );
}

function NotebookDetail({
  entry,
  onDelete,
  onSelectArticle,
}: {
  entry: VocabularyEntry;
  onDelete: () => void;
  onSelectArticle: (id: string) => void;
}) {
  const data = useData();
  const occ = occurrencesOf(data, entry.id);
  const logs = reviewsOf(data, entry.id).slice(-5).reverse();
  const st = STATUS_LABEL[entry.masteryStatus];
  const voiceOk = hasVoiceFor('us');

  return (
    <Card>
      <div className="nb-detail__head">
        <div>
          <div className="nb-detail__word">{entry.lemma}</div>
          <div className="nb-detail__phon">
            {entry.phonetics.uk ? <span>英 {entry.phonetics.uk}</span> : null}
            {entry.phonetics.us ? <span>美 {entry.phonetics.us}</span> : null}
            {!entry.phonetics.uk && !entry.phonetics.us ? <span className="hint">音标未收录</span> : null}
            {entry.partOfSpeech ? <Chip small>{entry.partOfSpeech}</Chip> : null}
            <Badge tone={st.tone}>{st.text}</Badge>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <IconButton
            icon="volume"
            label="朗读"
            disabled={!voiceOk}
            onClick={() => speakWord(entry.lemma, 'us', 0.85)}
          />
          <IconButton icon="close" label="删除" onClick={onDelete} />
        </div>
      </div>

      <div className="nb-detail__actions">
        <Button
          size="sm"
          variant="secondary"
          icon={entry.masteryStatus === 'mastered' ? 'rotate' : 'check'}
          onClick={() =>
            setData(
              entry.masteryStatus === 'mastered'
                ? unmarkMastered(getData(), entry.id, Date.now())
                : markMastered(getData(), entry.id, 'user', Date.now()),
              true,
            )
          }
        >
          {entry.masteryStatus === 'mastered' ? '重新加入复习' : '标记已掌握'}
        </Button>
        <Button size="sm" variant="ghost" iconRight="right" onClick={() => navigate(`/word/${entry.lemma}`)}>
          完整解析
        </Button>
        <div style={{ flex: 1 }} />
        <span className="hint">
          {entry.nextReviewAt ? `下次复习 ${formatRelativeTime(entry.nextReviewAt, Date.now())}` : '尚未安排复习'}
        </span>
      </div>

      <div className="section-title">释义</div>
      {entry.definitions.length ? (
        <div>
          {entry.contextualMeaning && entry.contextualMeaning !== entry.definitions[0]?.definition ? (
            <div className="vocab-card__ctx" style={{ marginBottom: 10 }}>
              <div className="vocab-card__ctx-label">
                <span>最近语境</span>
              </div>
              <div>{entry.contextualMeaning}</div>
            </div>
          ) : null}
          {entry.definitions.map((d, i) => (
            <div className="sense" key={i}>
              <div className="sense__def">
                {d.pos ? <span className="sense__pos">{d.pos}</span> : null}
                {d.definition}
              </div>
              {d.example ? <div className="sense__example">{d.example}</div> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="hint">释义待补充。词典暂未收录该词，记录已保留。</p>
      )}

      <div className="section-title">出现过的句子（{occ.length}）</div>
      <ul className="occ-list">
        {occ.map((o) => (
          <li className="occ" key={o.id}>
            <p className="occ__sentence">{highlight(o.sentence, o.surfaceForm)}</p>
            {o.contextualMeaning ? <p className="occ__ctx">语境释义：{o.contextualMeaning}</p> : null}
            <div className="occ__meta">
              <button className="link-btn" onClick={() => onSelectArticle(o.articleId)}>
                {o.articleTitle}
              </button>
              <span>·</span>
              <span>{formatRelativeTime(o.encounteredAt, Date.now())}</span>
              <span>·</span>
              <span className="mono">{o.surfaceForm}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="section-title">复习记录</div>
      {logs.length ? (
        <ul className="occ-list">
          {logs.map((l) => (
            <li className="occ" key={l.id}>
              <div className="occ__meta" style={{ marginTop: 0 }}>
                <Badge tone={l.grade === 'again' ? 'red' : l.grade === 'hard' ? 'orange' : l.grade === 'good' ? 'accent' : 'green'}>
                  {l.grade === 'again' ? '忘了' : l.grade === 'hard' ? '勉强' : l.grade === 'good' ? '记得' : '很熟'}
                </Badge>
                <span>{formatRelativeTime(l.reviewedAt, Date.now())}</span>
                <span>·</span>
                <span>间隔 {l.prevIntervalDays} → {l.nextIntervalDays} 天</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="hint">还没有复习记录。收藏只是第一步，去复习页检验一下记忆。</p>
      )}
    </Card>
  );
}

function highlight(sentence: string, surface: string): React.ReactNode {
  const idx = sentence.toLowerCase().indexOf(surface.toLowerCase());
  if (idx < 0) return sentence;
  return (
    <>
      {sentence.slice(0, idx)}
      <mark>{sentence.slice(idx, idx + surface.length)}</mark>
      {sentence.slice(idx + surface.length)}
    </>
  );
}
