import { useMemo, useRef, useState } from 'react';
import type { Article, QuizType } from '../data/types';
import { getArticle } from '../data/articles';
import { useData, getData, setData } from '../lib/store';
import { recordActiveDay, recordQuizAttempt, pushRecent } from '../lib/db';
import { navigate } from '../lib/router';
import { todayKey } from '../lib/text';
import { Badge, Button, Card, Chip, Empty, Progress, toast } from '../components/ui';
import { Icon } from '../components/icons';

export function Quiz({ id }: { id: string }) {
  const article = getArticle(id);
  if (!article) {
    return (
      <div className="page">
        <Empty icon="target" title="找不到这篇文章" action={<Button variant="primary" onClick={() => navigate('/library')}>回到文章库</Button>} />
      </div>
    );
  }
  return <QuizInner article={article} />;
}

function QuizInner({ article }: { article: Article }) {
  const data = useData();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollTop = () => {
    const scroller = document.querySelector('.scroll-area');
    if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
    else topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const questions = article.quiz;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const result = useMemo(() => {
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    const byType: Record<string, number> = {};
    for (const q of questions) {
      if (answers[q.id] !== q.answer) byType[q.type] = (byType[q.type] ?? 0) + 1;
    }
    return { correct, total: questions.length, byType };
  }, [answers, questions]);

  const previous = data.quizAttempts.filter((a) => a.articleId === article.id);

  const submit = () => {
    if (!allAnswered) {
      toast(`还有 ${questions.length - answeredCount} 题未作答`, 'error');
      return;
    }
    const now = Date.now();
    let next = recordQuizAttempt(getData(), {
      id: `q_${article.id}_${now}`,
      articleId: article.id,
      articleTitle: article.title,
      level: article.level,
      answers,
      correctCount: result.correct,
      total: result.total,
      wrongByType: result.byType,
      submittedAt: now,
    });
    next = recordActiveDay(next, todayKey(now));
    next = pushRecent(next, article.id);
    setData(next, true);
    setSubmitted(true);
    scrollTop();
    toast(`已记录成绩：${result.correct}/${result.total}`, 'success');
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
    scrollTop();
  };

  const pct = submitted ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <div className="page" ref={topRef}>
      <div className="page__head">
        <button className="link-btn" onClick={() => navigate(`/read/${article.id}`)}>
          <Icon name="left" size={12} /> 返回文章
        </button>
        <h1 className="page__title">阅读理解</h1>
        <p className="page__desc">
          {article.title} · {article.titleZh} · Level {article.level} · 共 {questions.length} 题
        </p>
      </div>

      {submitted ? (
        <Card className="quiz-result">
          <div className="quiz-result__score">
            <span className="mono">{pct}%</span>
            <span className="hint">
              答对 {result.correct} / {result.total}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14 }}>
              {pct >= 80
                ? '理解得不错。可以试试下一阶段更长的文章。'
                : pct >= 60
                  ? '基本读懂了，但细节和推断上还有漏洞。看看下面的解析。'
                  : '这篇文章的理解还不够扎实。建议重读一遍，重点看错题依据的句子。'}
            </p>
            {Object.keys(result.byType).length ? (
              <p className="hint" style={{ marginTop: 6 }}>
                错题集中在：{Object.entries(result.byType).map(([t, n]) => `${t} ${n} 题`).join('、')}
              </p>
            ) : null}
          </div>
          <Button variant="secondary" icon="rotate" onClick={retry}>
            重做
          </Button>
        </Card>
      ) : (
        <Card className="quiz-progress">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="hint">作答进度</span>
              <span className="mono hint">
                {answeredCount} / {questions.length}
              </span>
            </div>
            <Progress value={answeredCount / questions.length} thin label="作答进度" />
          </div>
          <Button variant="primary" icon="check" disabled={!allAnswered} onClick={submit}>
            提交答案
          </Button>
        </Card>
      )}

      <div className="quiz">
        {questions.map((q, qi) => {
          const picked = answers[q.id];
          const isCorrect = picked === q.answer;
          const wrongOptions = q.options.map((_, i) => i).filter((i) => i !== q.answer);
          return (
            <Card key={q.id} className="quiz-q">
              <div className="quiz-q__head">
                <span className="quiz-q__index mono">{qi + 1}</span>
                <span className="quiz-q__type">{q.type}</span>
                {submitted ? (
                  <Badge tone={isCorrect ? 'green' : 'red'}>{isCorrect ? '正确' : '错误'}</Badge>
                ) : picked !== undefined ? (
                  <Badge tone="accent">已选</Badge>
                ) : null}
              </div>
              <p className="quiz-q__text">{q.question}</p>

              <div className="quiz-options">
                {q.options.map((opt, oi) => {
                  const chosen = picked === oi;
                  let cls = 'quiz-option';
                  if (!submitted && chosen) cls += ' quiz-option--selected';
                  if (submitted) {
                    if (oi === q.answer) cls += ' quiz-option--correct';
                    else if (chosen) cls += ' quiz-option--wrong';
                  }
                  return (
                    <button
                      key={oi}
                      className={cls}
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      aria-pressed={chosen}
                    >
                      <span className="quiz-option__mark">{String.fromCharCode(65 + oi)}</span>
                      <span>{opt}</span>
                      {submitted && oi === q.answer ? <Icon name="check" size={15} /> : null}
                      {submitted && chosen && oi !== q.answer ? <Icon name="close" size={15} /> : null}
                    </button>
                  );
                })}
              </div>

              {submitted ? (
                <div className="quiz-feedback">
                  <div className="quiz-evidence">
                    <span className="quiz-feedback__label">原文依据</span>
                    <p>“{q.evidence}”</p>
                  </div>
                  <div className="quiz-explain">
                    <span className="quiz-feedback__label">正确项解析</span>
                    <p>{q.explain}</p>
                  </div>
                  <div className="quiz-wrongwhy">
                    <span className="quiz-feedback__label">错误项分析</span>
                    <ul>
                      {wrongOptions.map((oi, wi) => (
                        <li key={oi}>
                          <strong>{String.fromCharCode(65 + oi)}</strong>
                          {q.whyWrong[wi]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      {!submitted ? (
        <div className="quiz-submit-bar">
          <span className="hint">
            {allAnswered ? '已全部作答，可以提交了。' : `还有 ${questions.length - answeredCount} 题未作答`}
          </span>
          <Button variant="primary" size="lg" icon="check" disabled={!allAnswered} onClick={submit}>
            提交答案
          </Button>
        </div>
      ) : (
        <div className="quiz-submit-bar">
          <span className="hint">成绩已记录。{previous.length ? `这是第 ${previous.length + 1} 次测试。` : ''}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" icon="rotate" onClick={retry}>
              重做
            </Button>
            <Button variant="primary" iconRight="right" onClick={() => navigate('/library')}>
              下一篇
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const QUIZ_TYPE_LABEL: Record<QuizType, string> = {
  主旨大意: '主旨大意',
  细节理解: '细节理解',
  词义推断: '词义推断',
  作者观点: '作者观点',
  逻辑推断: '逻辑推断',
};

export function QuizTypeChip({ type }: { type: QuizType }) {
  const tone: Record<QuizType, string> = {
    主旨大意: 'accent',
    细节理解: 'green',
    词义推断: 'orange',
    作者观点: 'purple',
    逻辑推断: 'teal',
  };
  return <Chip small>{`${tone[type]} · ${type}`}</Chip>;
}
