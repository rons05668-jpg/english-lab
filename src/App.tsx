import { Suspense, lazy, useEffect, useMemo } from 'react';
import { useRoute } from './lib/router';
import { useData, usePersistenceError, flush } from './lib/store';
import { Sidebar, Tabbar, Topbar } from './components/Shell';
import { Button, Empty, Toaster } from './components/ui';
import { navigate } from './lib/router';

// 页面按需加载：低带宽下首屏只需主包，进入具体页面时才拉对应 chunk
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Library = lazy(() => import('./pages/Library').then((m) => ({ default: m.Library })));
const Reader = lazy(() => import('./pages/Reader').then((m) => ({ default: m.Reader })));
const Notebook = lazy(() => import('./pages/Notebook').then((m) => ({ default: m.Notebook })));
const Review = lazy(() => import('./pages/Review').then((m) => ({ default: m.Review })));
const Stats = lazy(() => import('./pages/Stats').then((m) => ({ default: m.Stats })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const WordDetail = lazy(() => import('./pages/WordDetail').then((m) => ({ default: m.WordDetail })));
const Quiz = lazy(() => import('./pages/Quiz').then((m) => ({ default: m.Quiz })));
const ContinueReading = lazy(() => import('./pages/ContinueReading').then((m) => ({ default: m.ContinueReading })));

/** 页面切换时的占位，避免低带宽下长时间空白 */
function PageFallback() {
  return (
    <div className="page" aria-busy="true">
      <div className="skeleton skeleton--line" style={{ height: 28, width: '38%', marginBottom: 16 }} />
      <div className="skeleton skeleton--line" style={{ height: 14, width: '72%', marginBottom: 8 }} />
      <div className="skeleton skeleton--line" style={{ height: 14, width: '64%' }} />
    </div>
  );
}

const TITLES: Record<string, string> = {};

function PersistenceNotice() {
  const failed = usePersistenceError();
  return failed ? <div className="persistence-notice" role="alert">学习记录保存失败。请释放浏览器存储空间或允许本站存储，恢复后重试。<button onClick={flush}>重试保存</button></div> : null;
}

export default function App() {
  const route = useRoute();
  const data = useData();
  const theme = data.settings.theme;

  // 主题：system 时跟随系统，并监听系统切换
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    };
    apply();
    if (theme !== 'system') return;
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  // 全局键盘：Esc 关闭专注模式
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.body.dataset.focus === '1') {
        document.body.dataset.focus = '0';
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const page = useMemo(() => {
    switch (route.name) {
      case 'home':
        return <Home />;
      case 'library':
        return <Library />;
      case 'continue':
        return <ContinueReading />;
      case 'notebook':
        return <Notebook />;
      case 'review':
        return <Review />;
      case 'stats':
        return <Stats />;
      case 'settings':
        return <Settings />;
      case 'word':
        return <WordDetail lemma={route.id ?? ''} />;
      case 'quiz':
        return <Quiz id={route.id ?? ''} />;
      default:
        return (
          <div className="page">
            <Empty
              icon="search"
              title="页面不存在"
              desc="链接可能已失效，回到首页继续。"
              action={
                <Button variant="primary" onClick={() => navigate('/')}>
                  回到首页
                </Button>
              }
            />
          </div>
        );
    }
  }, [route.name, route.id]);

  if (route.name === 'reader') {
    return (
      <div className="app">
        <Sidebar route={route} />
        <main className="main">
          <Suspense fallback={<PageFallback />}>
            <Reader id={route.id ?? ''} />
          </Suspense>
        </main>
        <Toaster />
        <PersistenceNotice />
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar route={route} />
      <main className="main">
        <Topbar title={TITLES[route.name]} />
        <div className="scroll-area">
          <Suspense fallback={<PageFallback />}>{page}</Suspense>
        </div>
      </main>
      <Tabbar route={route} />
      <Toaster />
      <PersistenceNotice />
    </div>
  );
}
