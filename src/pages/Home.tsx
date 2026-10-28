import { useMemo } from 'react';
import { ARTICLES, LEVELS, articleMinutes, articleWords, getArticle } from '../data/articles';
import { computeDashboard } from '../lib/stats';
import { useData } from '../lib/store';
import { navigate } from '../lib/router';
import { Badge, Button, Card, Chip, Empty, Progress, StatCard } from '../components/ui';
import { DailyGoalRing } from '../components/Shell';
import { Icon } from '../components/icons';
import { formatRelativeTime } from '../lib/text';

function greeting(hour: number): string {
  if (hour < 5) return '夜深了';
  if (hour < 11) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export function Home() {
  const data = useData();
  const now = Date.now();
  const stats = useMemo(() => computeDashboard(data, ARTICLES, now), [data, now]);

  const continueTarget = useMemo(() => {
    const started = Object.values(data.progress)
      .filter((p) => !p.completedAt && p.ratio > 0)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    if (started.length) return { article: getArticle(started[0].articleId), progress: started[0] };
    const recent = data.recent.map((id) => getArticle(id)).find(Boolean);
    if (recent) return { article: recent, progress: data.progress[recent.id] };
    return null;
  }, [data.progress, data.recent]);

  const recommended = useMemo(() => {
    const completed = new Set(Object.values(data.progress).filter((p) => p.completedAt).map((p) => p.articleId));
    const levels = [1, 2, 3, 4] as const;
    const currentLevel = levels.find((l) => ARTICLES.filter((a) => a.level === l).some((a) => !completed.has(a.id))) ?? 1;
    const pool = ARTICLES.filter((a) => a.level === currentLevel && !completed.has(a.id));
    return pool[0] ?? ARTICLES.find((a) => !completed.has(a.id)) ?? ARTICLES[0];
  }, [data.progress]);

  const recentList = useMemo(
    () =>
      data.recent
        .map((id) => ({ article: getArticle(id), progress: data.progress[id] }))
        .filter((x) => x.article)
        .slice(0, 4),
    [data.recent, data.progress],
  );

  const hour = new Date(now).getHours();

  return (
    <div className="page">
      <div className="home-head">
        <div>
          <h1 className="home-greet">
            {greeting(hour)}
            <span className="home-greet__dot" aria-hidden="true" />
          </h1>
          <p className="home-sub">
            {stats.dueToday > 0
              ? `今天有 ${stats.dueToday} 个词等你复习，先花 5 分钟把它们捞回来。`
              : stats.todayArticles > 0
                ? '今天已经读过文章了，保持这个节奏。'
                : '今天还没开始阅读。一篇短文，5 分钟就够。'}
          </p>
        </div>
        <div className="home-actions">
          <Button variant="primary" icon="book" onClick={() => navigate('/library')}>
            去文章库
          </Button>
          {stats.dueToday > 0 ? (
            <Button variant="secondary" icon="cards" onClick={() => navigate('/review')}>
              开始复习
            </Button>
          ) : null}
        </div>
      </div>

      <div className="stat-strip">
        <StatCard label="今日阅读" value={stats.todayArticles} hint="篇（今日完成）" tone="accent" />
        <StatCard label="今日待复习" value={stats.dueToday} hint="词" tone="orange" onClick={() => navigate('/review')} />
        <StatCard label="生词本" value={stats.vocabTotal} hint={`已掌握 ${stats.vocabMastered}`} tone="purple" onClick={() => navigate('/notebook')} />
        <StatCard
          label="理解正确率"
          value={stats.quizQuestionTotal ? `${Math.round(stats.quizAccuracy * 100)}%` : '—'}
          hint={`${stats.quizAttempts} 次测试`}
          tone="green"
        />
      </div>

      <div className="home-grid">
        <Card className="hero-card">
          <div className="hero-card__text">
            <div className="section-title" style={{ margin: '0 0 8px' }}>
              <Icon name="play" size={13} /> 继续阅读
            </div>
            {continueTarget?.article ? (
              <>
                <h2 className="hero-title">{continueTarget.article.title}</h2>
                <p className="hero-card__meta">
                  {continueTarget.article.titleZh} · Level {continueTarget.article.level} ·{' '}
                  {articleWords(continueTarget.article)} 词
                </p>
                <div style={{ margin: '14px 0 12px', maxWidth: 320 }}>
                  <Progress
                    value={continueTarget.progress?.ratio ?? 0}
                    label="阅读进度"
                  />
                  <div className="hint" style={{ marginTop: 6 }}>
                    已读 {Math.round((continueTarget.progress?.ratio ?? 0) * 100)}%
                    {continueTarget.progress ? ` · ${formatRelativeTime(continueTarget.progress.updatedAt, now)}` : ''}
                  </div>
                </div>
                <Button
                  variant="primary"
                  icon="right"
                  onClick={() => navigate(`/read/${continueTarget.article!.id}`)}
                >
                  继续阅读
                </Button>
              </>
            ) : (
              <>
                <h2 className="hero-title">{recommended.title}</h2>
                <p className="hero-card__meta">
                  {recommended.titleZh} · Level {recommended.level} · 约 {articleMinutes(recommended)} 分钟
                </p>
                <p className="hint" style={{ margin: '10px 0 14px', maxWidth: 420 }}>
                  还没有阅读记录。从这篇开始，遇到不认识的词直接点它，会自动进生词本。
                </p>
                <Button variant="primary" icon="right" onClick={() => navigate(`/read/${recommended.id}`)}>
                  开始第一篇
                </Button>
              </>
            )}
          </div>
        </Card>

        <Card className="due-card">
          <div className="due-card__count">
            <span className="mono">{stats.dueToday}</span>
            <span className="hint">个待复习</span>
          </div>
          <DailyGoalRing done={stats.todayArticles} goal={stats.dailyGoal} />
          <div className="divider" />
          <div className="due-card__row">
            <span>新词</span>
            <span className="mono">{stats.newWords}</span>
          </div>
          <div className="due-card__row">
            <span>学习中</span>
            <span className="mono">{stats.vocabLearning}</span>
          </div>
          <div className="due-card__row">
            <span>已掌握</span>
            <span className="mono">{stats.vocabMastered}</span>
          </div>
          <Button variant="secondary" block icon="cards" onClick={() => navigate('/review')}>
            进入复习
          </Button>
        </Card>
      </div>

      <div className="section-title">
        <Icon name="layers" size={13} /> 学习阶段
      </div>
      <Card>
        <div className="level-list">
          {LEVELS.map((l) => {
            const row = stats.levelBreakdown.find((x) => x.level === l.level);
            const total = row?.total ?? 0;
            const done = row?.completed ?? 0;
            return (
              <div className="level-row" key={l.level}>
                <div className="level-row__head">
                  <Chip level={l.level} small>
                    L{l.level}
                  </Chip>
                  <span className="level-row__name">{l.name}</span>
                  <span className="hint">{l.desc}</span>
                  <span className="mono level-row__count">
                    {done}/{total}
                  </span>
                </div>
                <div className="level-row__bar">
                  <Progress value={total ? done / total : 0} thin label={`${l.name}完成度`} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="section-title">
        <Icon name="clock" size={13} /> 最近阅读
        {recentList.length ? (
          <button className="link-btn" onClick={() => navigate('/continue')}>
            全部 <Icon name="right" size={12} />
          </button>
        ) : null}
      </div>
      <Card>
        {recentList.length ? (
          <ul className="recent-list">
            {recentList.map(({ article, progress }) => (
              <li key={article!.id}>
                <button className="recent-item" onClick={() => navigate(`/read/${article!.id}`)}>
                  <span className="recent-item__title">{article!.title}</span>
                  <span className="recent-item__meta">
                    {article!.titleZh} · L{article!.level}
                    {progress ? ` · ${Math.round(progress.ratio * 100)}%` : ''}
                  </span>
                  {progress?.completedAt ? <Badge tone="green">已读完</Badge> : null}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            icon="clock"
            title="还没有阅读记录"
            desc="打开一篇文章，阅读进度会自动保存。"
            action={<Button variant="primary" onClick={() => navigate('/library')}>去选一篇</Button>}
          />
        )}
      </Card>
    </div>
  );
}
