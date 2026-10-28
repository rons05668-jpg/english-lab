import { useCallback, useMemo, useState } from 'react';
import type { ReviewGrade, VocabularyEntry } from '../data/types';
import { useData, getData, setData } from '../lib/store';
import { recordActiveDay, recordReview } from '../lib/db';
import { applyReview, describeNextReview, SRS_ALGORITHM_DOC } from '../lib/srs';
import { navigate } from '../lib/router';
import { speakWord, hasVoiceFor } from '../lib/speech';
import { todayKey } from '../lib/text';
import { Badge, Button, Card, Chip, Empty, IconButton, Progress, toast } from '../components/ui';
import { Icon } from '../components/icons';

const GRADES: { grade: ReviewGrade; label: string; hint: string }[] = [
  { grade: 'again', label: '忘了', hint: '完全想不起来' },
  { grade: 'hard', label: '勉强', hint: '想起来很吃力' },
  { grade: 'good', label: '记得', hint: '正常回忆起来' },
  { grade: 'easy', label: '很熟', hint: '毫不费力' },
];

export function Review() {
  const data = useData();
  const now = Date.now();

  const dueList = useMemo(
    () => data.vocabEntries.filter((e) => e.masteryStatus !== 'mastered' && (e.nextReviewAt ?? 0) <= now),
    [data.vocabEntries, now],
  );
  const newList = useMemo(
    () => data.vocabEntries.filter((e) => e.srs.reps === 0 && e.masteryStatus !== 'mastered'),
    [data.vocabEntries],
  );
  const hardList = useMemo(
    () => data.vocabEntries.filter((e) => e.srs.lapses >= 2 && e.masteryStatus !== 'mastered'),
    [data.vocabEntries],
  );

  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [queue, setQueue] = useState<VocabularyEntry[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<{ lemma: string; grade: ReviewGrade }[]>([]);

  const start = useCallback(
    (mode: 'due' | 'new' | 'mixed' | 'hard') => {
      const pick = (list: VocabularyEntry[], limit: number) =>
        [...list].sort((a, b) => (a.nextReviewAt ?? 0) - (b.nextReviewAt ?? 0)).slice(0, limit);
      let q: VocabularyEntry[] = [];
      if (mode === 'due') q = pick(dueList, 30);
      else if (mode === 'new') q = pick(newList, 15);
      else if (mode === 'hard') q = pick(hardList, 20);
      else {
        const seen = new Set<string>();
        for (const e of [...pick(dueList, 15), ...pick(newList, 8), ...pick(hardList, 7)]) {
          if (seen.has(e.id)) continue;
          seen.add(e.id);
          q.push(e);
        }
      }
      if (!q.length) {
        toast('这个分组暂时没有单词', 'error');
        return;
      }
      setQueue(q);
      setIdx(0);
      setRevealed(false);
      setResults([]);
      setPhase('running');
    },
    [dueList, newList, hardList],
  );

  const current = queue[idx];

  const previews = useMemo(() => {
    if (!current) return null;
    return GRADES.map((g) => {
      const out = applyReview({ srs: current.srs, masteryStatus: current.masteryStatus }, g.grade, Date.now());
      return { ...g, interval: out.intervalDays, label2: describeNextReview(out.intervalDays) };
    });
  }, [current]);

  const submit = (grade: ReviewGrade) => {
    if (!current) return;
    const nowTs = Date.now();
    const out = applyReview({ srs: current.srs, masteryStatus: current.masteryStatus }, grade, nowTs);
    let next = recordReview(getData(), {
      entryId: current.id,
      lemma: current.lemma,
      grade,
      prevIntervalDays: current.srs.intervalDays,
      nextIntervalDays: out.intervalDays,
      masteryStatus: out.masteryStatus,
      masteredBy: out.masteredBy,
      nextReviewAt: out.nextReviewAt,
      now: nowTs,
    });
    next = recordActiveDay(next, todayKey(nowTs));
    setData(next, true);
    setResults((r) => [...r, { lemma: current.lemma, grade }]);
    if (idx + 1 >= queue.length) {
      setPhase('done');
    } else {
      setIdx(idx + 1);
      setRevealed(false);
    }
  };

  if (phase === 'idle') {
    const nothing = !dueList.length && !newList.length && !hardList.length;
    return (
      <div className="page">
        <div className="page__head">
          <h1 className="page__title">单词复习</h1>
          <p className="page__desc">
            收藏只是开始。这里用主动回忆检验记忆：先自己想，再显示答案，然后如实评价。间隔由算法安排，不由点击次数决定。
          </p>
        </div>

        <div className="stat-strip">
          <Card className="rv-stat">
            <span className="stat-card__label">今日待复习</span>
            <span className="stat-card__value">{dueList.length}</span>
            <span className="stat-card__hint">到期需要复习的词</span>
          </Card>
          <Card className="rv-stat">
            <span className="stat-card__label">新词</span>
            <span className="stat-card__value">{newList.length}</span>
            <span className="stat-card__hint">还没复习过</span>
          </Card>
          <Card className="rv-stat">
            <span className="stat-card__label">常记错</span>
            <span className="stat-card__value">{hardList.length}</span>
            <span className="stat-card__hint">遗忘 ≥ 2 次</span>
          </Card>
          <Card className="rv-stat">
            <span className="stat-card__label">已掌握</span>
            <span className="stat-card__value">{data.vocabEntries.filter((e) => e.masteryStatus === 'mastered').length}</span>
            <span className="stat-card__hint">连续记住且间隔 ≥ 21 天</span>
          </Card>
        </div>

        {nothing ? (
            <Card>
            <Empty
              icon="cards"
              title="暂时没有需要复习的单词"
              desc="去读一篇文章，点击不认识的词，它们会自动进入复习队列。"
              action={
                <Button variant="primary" onClick={() => navigate('/library')}>
                  去阅读
                </Button>
              }
            />
          </Card>
        ) : (
          <Card>
            <div className="section-title">开始复习</div>
            <div className="rv-start-grid">
              <Button variant="primary" icon="cards" block onClick={() => start('mixed')}>
                混合复习（推荐）
              </Button>
              <Button variant="secondary" block onClick={() => start('due')} disabled={!dueList.length}>
                只复习到期的 {dueList.length} 个
              </Button>
              <Button variant="secondary" block onClick={() => start('new')} disabled={!newList.length}>
                只学新词 {newList.length} 个
              </Button>
              <Button variant="secondary" block onClick={() => start('hard')} disabled={!hardList.length}>
                强化常记错的 {hardList.length} 个
              </Button>
            </div>
            <details className="srs-doc" style={{ marginTop: 20 }}>
              <summary>{SRS_ALGORITHM_DOC.name}</summary>
              <p>{SRS_ALGORITHM_DOC.summary}</p>
              <div className="srs-doc__grades">
                {SRS_ALGORITHM_DOC.grades.map((g) => (
                  <div key={g.grade}>
                    <strong>{g.label}</strong>
                    <span>{g.effect}</span>
                  </div>
                ))}
              </div>
              <p className="hint">{SRS_ALGORITHM_DOC.masteryRule}</p>
              <ul className="srs-doc__notes">
                {SRS_ALGORITHM_DOC.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </details>
          </Card>
        )}
      </div>
    );
  }

  if (phase === 'done') {
    const counts = { again: 0, hard: 0, good: 0, easy: 0 };
    for (const r of results) counts[r.grade] += 1;
    return (
      <div className="page">
        <div className="rv-done">
          <div className="rv-done__icon">
            <Icon name="check" size={28} />
          </div>
          <h1 className="page__title">本轮复习完成</h1>
          <p className="page__desc">
            共 {results.length} 个词，记得 {counts.good + counts.easy} 个，勉强 {counts.hard} 个，忘了 {counts.again} 个。
          </p>
          <div className="rv-stats">
            {GRADES.map((g) => (
              <div key={g.grade}>
                <span className="mono">{counts[g.grade]}</span>
                <span className="hint">{g.label}</span>
              </div>
            ))}
          </div>
          <div className="rv-done__actions">
            <Button variant="primary" onClick={() => setPhase('idle')}>
              返回复习首页
            </Button>
            <Button variant="secondary" onClick={() => navigate('/stats')}>
              查看学习数据
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const gloss =
    current.contextualMeaning || current.definitions[0]?.definition || '释义待补充';
  const voiceOk = hasVoiceFor('us');

  return (
    <div className="page rv">
      <div className="rv__head">
        <Button variant="ghost" icon="left" onClick={() => setPhase('idle')}>
          退出
        </Button>
        <div className="rv__progress">
          <Progress value={(idx + (revealed ? 0.5 : 0)) / queue.length} thin label="本轮进度" />
          <span className="mono hint">
            {idx + 1} / {queue.length}
          </span>
        </div>
        <Badge tone="accent">{current.srs.reps === 0 ? '新词' : `复习 ${current.srs.reps} 次`}</Badge>
      </div>

      <div className="rv-card" onClick={() => !revealed && setRevealed(true)} role="button" tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!revealed) setRevealed(true);
          }
        }}
      >
        <div className="rv-card__word">{current.lemma}</div>
        <div className="rv-card__phon">
          {current.phonetics.us || current.phonetics.uk ? (
            <span>{current.phonetics.us ?? current.phonetics.uk}</span>
          ) : null}
          <IconButton
            icon="volume"
            label="朗读"
            size={16}
            disabled={!voiceOk}
            onClick={(e) => {
              e.stopPropagation();
              speakWord(current.lemma, 'us', 0.85);
            }}
          />
          {current.partOfSpeech ? <Chip small>{current.partOfSpeech}</Chip> : null}
        </div>

        {!revealed ? (
          <div className="rv-card__hint">
            <Icon name="eye" size={16} />
            <span>先在脑子里回想它的意思，然后点击卡片查看答案</span>
          </div>
        ) : (
          <div className="rv-card__answer">
            <div className="rv-answer-main">{gloss}</div>
            {current.definitions.length > 1 ? (
              <ul className="rv-card__senses">
                {current.definitions.slice(1, 4).map((d, i) => (
                  <li key={i}>
                    {d.pos ? <span className="sense__pos">{d.pos}</span> : null}
                    {d.definition}
                  </li>
                ))}
              </ul>
            ) : null}
            {current.definitions[0]?.example ? (
              <p className="rv-source">{current.definitions[0].example}</p>
            ) : null}
            <div className="rv__queue">
              {(() => {
                const occ = getData().occurrences.filter((o) => o.vocabularyEntryId === current.id)[0];
                return occ ? (
                  <>
                    <Icon name="quote" size={12} />
                    <span>{occ.sentence}</span>
                  </>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </div>

      {revealed ? (
        <div className="rv-actions">
          {previews?.map((g) => (
            <button
              key={g.grade}
              className={`rv-grade rv-grade--${g.grade}`}
              onClick={() => submit(g.grade)}
              title={g.hint}
            >
              <span className="rv-grade__label">{g.label}</span>
              <span className="rv-grade__next">{g.label2}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rv-actions rv-actions--center">
          <Button variant="primary" size="lg" icon="eye" onClick={() => setRevealed(true)}>
            显示答案
          </Button>
        </div>
      )}
      <p className="hint" style={{ textAlign: 'center', marginTop: 12 }}>
        评价要如实：记错时说「忘了」，算法才会把间隔缩短。骗自己只会让复习越来越无效。
      </p>
    </div>
  );
}
