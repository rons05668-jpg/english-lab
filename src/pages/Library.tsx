import { useMemo, useState } from 'react';
import { ARTICLE_BRIEF, LEVELS } from '../data/articles/brief';
import type { ArticleBrief } from '../data/articles/brief';
import { useData } from '../lib/store';
import { navigate } from '../lib/router';
import { toggleFavorite } from '../lib/db';
import { getData, setData } from '../lib/store';
import { Badge, Button, Card, Chip, Empty, IconButton, Segmented } from '../components/ui';
import { Icon } from '../components/icons';

type StatusFilter = 'all' | 'unread' | 'reading' | 'done';
type SortKey = 'level' | 'words' | 'recent';

export function Library() {
  const data = useData();
  const [q, setQ] = useState('');
  const [level, setLevel] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortKey>('level');
  const [favOnly, setFavOnly] = useState(false);

  const categories = useMemo(() => Array.from(new Set(ARTICLE_BRIEF.map((a) => a.category))).sort(), []);

  const list = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    let out = ARTICLE_BRIEF.filter((a) => {
      if (level !== null && a.level !== level) return false;
      if (category !== 'all' && a.category !== category) return false;
      if (favOnly && !data.favorites.includes(a.id)) return false;
      const p = data.progress[a.id];
      if (status === 'unread' && p && p.ratio > 0) return false;
      if (status === 'reading' && (!p || p.ratio === 0 || p.completedAt)) return false;
      if (status === 'done' && !p?.completedAt) return false;
      if (keyword) {
        const hay = `${a.title} ${a.titleZh} ${a.category} ${(a.tags ?? []).join(' ')} ${a.vocabWords.join(' ')}`.toLowerCase();
        if (!hay.includes(keyword)) return false;
      }
      return true;
    });
    out = [...out].sort((a, b) => {
      if (sort === 'words') return a.wordCount - b.wordCount;
      if (sort === 'recent') {
        const ta = data.progress[a.id]?.updatedAt ?? 0;
        const tb = data.progress[b.id]?.updatedAt ?? 0;
        return tb - ta;
      }
      return a.level - b.level || a.id.localeCompare(b.id);
    });
    return out;
  }, [q, level, category, status, sort, favOnly, data.progress, data.favorites]);

  return (
    <div className="page page--wide">
      <div className="page__head">
        <h1 className="page__title">文章库</h1>
        <p className="page__desc">
          四个阶段共 {ARTICLE_BRIEF.length} 篇原创短文。分级是产品内部的教学分层，不等于 CEFR 或任何官方等级。
        </p>
      </div>

      <div className="lib-toolbar">
        <div className="input--search input-wrap">
          <Icon name="search" size={16} />
          <input
            className="input"
            placeholder="搜索标题、主题、重点词…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="搜索文章"
          />
          {q ? <IconButton icon="close" label="清空搜索" size={14} onClick={() => setQ('')} /> : null}
        </div>
        <Segmented
          ariaLabel="阅读状态筛选"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: '全部' },
            { value: 'unread', label: '未读' },
            { value: 'reading', label: '在读' },
            { value: 'done', label: '已读' },
          ]}
        />
        <select className="select sort-select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="排序方式">
          <option value="level">按难度</option>
          <option value="words">按词数</option>
          <option value="recent">按最近阅读</option>
        </select>
      </div>

      <div className="lib-filters">
        <Chip active={level === null} onClick={() => setLevel(null)}>
          全部难度
        </Chip>
        {LEVELS.map((l) => (
          <Chip key={l.level} level={l.level} active={level === l.level} onClick={() => setLevel(l.level)}>
            L{l.level} {l.name}
          </Chip>
        ))}
        <span className="divider-v" />
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="主题分类">
          <option value="all">全部主题</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Chip active={favOnly} onClick={() => setFavOnly((v) => !v)}>
          <Icon name="star" size={12} /> 收藏
        </Chip>
        <span className="lib-count mono">{list.length} 篇</span>
      </div>

      {list.length === 0 ? (
        <Card>
          <Empty
            icon="search"
            title="没有符合条件的文章"
            desc="试试放宽筛选条件，或清空搜索关键词。"
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQ('');
                  setLevel(null);
                  setCategory('all');
                  setStatus('all');
                  setFavOnly(false);
                }}
              >
                重置筛选
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="lib-grid">
          {list.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: ArticleBrief }) {
  const data = useData();
  const p = data.progress[article.id];
  const fav = data.favorites.includes(article.id);
  const excerpt = article.excerpt;
  const vocabCount = article.vocabCount;

  return (
    <Card as="article" className={`article-card${p?.completedAt ? ' article-card--done' : ''}`}>
      <div className="article-card__top">
        <Chip level={article.level} small>
          L{article.level}
        </Chip>
        <span className="hint">{article.category}</span>
        <div style={{ flex: 1 }} />
        <IconButton
          icon={fav ? 'star' : 'bookmark'}
          label={fav ? '取消收藏' : '收藏文章'}
          size={15}
          active={fav}
          onClick={() => setData(toggleFavorite(getData(), article.id))}
        />
      </div>
      <h3 className="article-card__title" onClick={() => navigate(`/read/${article.id}`)}>
        {article.title}
      </h3>
      <p className="article-card__sub">{article.titleZh}</p>
      <p className="article-card__excerpt">{excerpt}</p>
      <div className="article-card__foot">
        <span className="article-card__stat">
          <Icon name="type" size={12} /> {article.wordCount} 词
        </span>
        <span className="article-card__stat">
          <Icon name="clock" size={12} /> {article.minutes} 分钟
        </span>
        <span className="article-card__stat">
          <Icon name="graduation" size={12} /> {vocabCount} 重点词
        </span>
        <div style={{ flex: 1 }} />
        {p?.completedAt ? (
          <Badge tone="green">已读完</Badge>
        ) : p && p.ratio > 0 ? (
          <Badge tone="orange">读 {Math.round(p.ratio * 100)}%</Badge>
        ) : (
          <Button size="sm" variant="ghost" iconRight="right" onClick={() => navigate(`/read/${article.id}`)}>
            阅读
          </Button>
        )}
      </div>
    </Card>
  );
}
