import { useMemo } from 'react';
import { ARTICLE_BRIEF, getBrief } from '../data/articles/brief';
import { useData } from '../lib/store';
import { navigate } from '../lib/router';
import { Badge, Button, Card, Chip, Empty, Progress } from '../components/ui';
import { Icon } from '../components/icons';
import { formatRelativeTime } from '../lib/text';

export function ContinueReading() {
  const data = useData();
  const now = Date.now();

  const reading = useMemo(
    () =>
      Object.values(data.progress)
        .filter((p) => !p.completedAt && p.ratio > 0)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map((p) => ({ progress: p, article: getBrief(p.articleId) }))
        .filter((x) => x.article),
    [data.progress],
  );

  const finished = useMemo(
    () =>
      Object.values(data.progress)
        .filter((p) => p.completedAt)
        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
        .slice(0, 10)
        .map((p) => ({ progress: p, article: getBrief(p.articleId) }))
        .filter((x) => x.article),
    [data.progress],
  );

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">继续阅读</h1>
        <p className="page__desc">阅读位置会自动保存，回来时从上次停下的句子继续。</p>
      </div>

      {reading.length === 0 ? (
        <Card>
          <Empty
            icon="play"
            title="没有未读完的文章"
            desc="去文章库挑一篇，或者从最近读完的文章里重读。"
            action={
              <Button variant="primary" onClick={() => navigate('/library')}>
                去文章库
              </Button>
            }
          />
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {reading.map(({ article, progress }) => (
            <Card key={article!.id} className="continue-card" interactive onClick={() => navigate(`/read/${article!.id}`)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Chip level={article!.level} small>
                    L{article!.level}
                  </Chip>
                  <span className="hint">{article!.category}</span>
                  <span className="hint">·</span>
                  <span className="hint">{article!.wordCount} 词</span>
                  <span className="hint">·</span>
                  <span className="hint">约 {article!.minutes} 分钟</span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>{article!.title}</div>
                <div className="hint" style={{ marginTop: 2 }}>
                  {article!.titleZh}
                </div>
                <div style={{ marginTop: 12, maxWidth: 420 }}>
                  <Progress value={progress.ratio} thin label="阅读进度" />
                  <div className="hint" style={{ marginTop: 6 }}>
                    已读 {Math.round(progress.ratio * 100)}% · {formatRelativeTime(progress.updatedAt, now)} · 第{' '}
                    {progress.sentenceIndex + 1} 句
                  </div>
                </div>
              </div>
              <Button variant="primary" icon="right" onClick={() => navigate(`/read/${article!.id}`)}>
                继续
              </Button>
            </Card>
          ))}
        </div>
      )}

      <div className="section-title">
        <Icon name="check" size={13} /> 最近读完
      </div>
      <Card>
        {finished.length ? (
          <ul className="recent-list">
            {finished.map(({ article, progress }) => (
              <li key={article!.id}>
                <button className="recent-item" onClick={() => navigate(`/read/${article!.id}`)}>
                  <span className="recent-item__title">{article!.title}</span>
                  <span className="recent-item__meta">
                    {article!.titleZh} · L{article!.level} · 完成于{' '}
                    {formatRelativeTime(progress.completedAt ?? progress.updatedAt, now)}
                  </span>
                  <Badge tone="green">已读完</Badge>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="hint" style={{ padding: 8 }}>
            还没有读完的文章。共 {ARTICLE_BRIEF.length} 篇待读。
          </p>
        )}
      </Card>
    </div>
  );
}
