import { useMemo } from 'react';
import { ARTICLES, LEVELS } from '../data/articles';
import { accuracyByType, computeDashboard, heatmap, METRIC_DEFINITIONS, recentQuizTrend } from '../lib/stats';
import { useData } from '../lib/store';
import { navigate } from '../lib/router';
import { Badge, Button, Card, Chip, Empty, Progress, StatCard } from '../components/ui';
import { Icon } from '../components/icons';

export function Stats() {
  const data = useData();
  const now = Date.now();
  const s = useMemo(() => computeDashboard(data, ARTICLES, now), [data, now]);
  const types = useMemo(() => accuracyByType(data.quizAttempts), [data.quizAttempts]);
  const cells = useMemo(() => heatmap(data.activeDays, 8, now), [data.activeDays, now]);
  const trend = useMemo(() => recentQuizTrend(data.quizAttempts, 10), [data.quizAttempts]);

  const hasAny = data.vocabEntries.length > 0 || data.quizAttempts.length > 0 || Object.keys(data.progress).length > 0;

  return (
    <div className="page page--wide">
      <div className="page__head">
        <h1 className="page__title">学习统计</h1>
        <p className="page__desc">
          所有数字都来自本地保存的真实记录。「已收藏」不等于「已掌握」，两个指标分开统计。
        </p>
      </div>

      {!hasAny ? (
        <Card>
          <Empty
            icon="chart"
            title="还没有学习数据"
            desc="读一篇文章、点几个单词，这里就会开始有数字。"
            action={<Button variant="primary" onClick={() => navigate('/library')}>去阅读</Button>}
          />
        </Card>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard label="今日阅读" value={s.todayArticles} hint="篇（今日完成）" tone="accent" />
            <StatCard label="累计完成" value={s.totalArticlesCompleted} hint={`共 ${ARTICLES.length} 篇`} />
            <StatCard
              label="实际阅读词数"
              value={s.wordsReadActual.toLocaleString()}
              hint="按已读句子累加"
            />
            <StatCard
              label="完成文章总词数"
              value={s.wordsInCompletedArticles.toLocaleString()}
              hint="按已读完文章计"
            />
            <StatCard label="生词收藏" value={s.vocabTotal} hint="点击过的词" tone="purple" />
            <StatCard label="已掌握" value={s.vocabMastered} hint="复习达标或手动标记" tone="green" />
            <StatCard label="今日待复习" value={s.dueToday} hint="到期词数" tone="orange" />
            <StatCard
              label="理解正确率"
              value={s.quizQuestionTotal ? `${Math.round(s.quizAccuracy * 100)}%` : '—'}
              hint={`${s.quizQuestionTotal} 题 / ${s.quizAttempts} 次`}
            />
            <StatCard label="连续学习" value={`${s.streakDays} 天`} hint={s.todayActive ? '今天已学习' : '今天还没学'} />
            <StatCard label="完成率" value={`${Math.round(s.completionRate * 100)}%`} hint="已完成 / 全部文章" />
            <StatCard label="今日词数" value={s.todayWordsRead} hint="今日阅读词数" />
            <StatCard label="今日阅读时长" value={`${s.minutesReadToday} 分`} hint="按 150 词/分钟估算" />
          </div>

          <div className="chart-grid">
            <Card className="chart-card">
              <div className="section-title">各阶段完成情况</div>
              <div className="level-list">
                {LEVELS.map((l) => {
                  const row = s.levelBreakdown.find((x) => x.level === l.level);
                  const total = row?.total ?? 0;
                  const done = row?.completed ?? 0;
                  return (
                    <div className="level-row" key={l.level}>
                      <div className="level-row__head">
                        <Chip level={l.level} small>
                          L{l.level}
                        </Chip>
                        <span className="level-row__name">{l.name}</span>
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

            <Card className="chart-card">
              <div className="section-title">最近 8 周学习记录</div>
              <div className="heatmap" role="img" aria-label={`最近 8 周共 ${data.activeDays.length} 天有学习记录`}>
                {cells.map((c) => (
                  <span
                    key={c.date}
                    className={`heatmap__cell${c.active ? ` heatmap__cell--l${Math.max(1, c.level)}` : ''}`}
                    title={`${c.date}${c.active ? ' 有学习' : ' 无记录'}`}
                  />
                ))}
              </div>
              <div className="heatmap__legend">
                <span className="hint">8 周前</span>
                <div style={{ flex: 1 }} />
                <span className="hint">今天</span>
              </div>
              <p className="metric-note">
                只有「有 / 无学习记录」两档，不做强度推断——本产品的记录粒度是每天是否学习，不虚构更细的数据。
              </p>
            </Card>
          </div>

          <div className="chart-grid">
            <Card className="chart-card">
              <div className="section-title">最近测试正确率</div>
              {trend.length ? (
                <div className="bar-chart">
                  {trend.map((t, i) => (
                    <div className="bar-chart__col" key={i} title={`${t.date} · ${Math.round(t.accuracy * 100)}%（${t.total} 题）`}>
                      <div className="bar-chart__bar" style={{ height: `${Math.max(4, t.accuracy * 100)}%` }} />
                      <span className="bar-chart__label mono">{Math.round(t.accuracy * 100)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="hint">还没有测试记录。读完文章后做一次理解测试就会出现在这里。</p>
              )}
            </Card>

            <Card className="chart-card">
              <div className="section-title">错误题型分布</div>
              {types.length ? (
                <table className="type-table">
                  <thead>
                    <tr>
                      <th>题型</th>
                      <th>错题</th>
                      <th>总题</th>
                      <th>正确率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {types.map((t) => (
                      <tr key={t.type} className="type-row">
                        <td>{t.type}</td>
                        <td className="mono">{t.wrong}</td>
                        <td className="mono">{t.total}</td>
                        <td>
                          <Badge tone={t.accuracy >= 0.8 ? 'green' : t.accuracy >= 0.6 ? 'orange' : 'red'}>
                            {Math.round(t.accuracy * 100)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="hint">还没有答题记录。</p>
              )}
            </Card>
          </div>

          <div className="section-title">
            <Icon name="info" size={13} /> 指标口径说明
          </div>
          <Card>
            <dl className="metric-defs">
              {Object.entries(METRIC_DEFINITIONS).map(([k, v]) => (
                <div key={k}>
                  <dt className="mono">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </>
      )}
    </div>
  );
}
