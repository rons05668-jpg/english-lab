import { useEffect, useMemo } from 'react';
import { useRoute } from './lib/router';
import { useData } from './lib/store';
import { Sidebar, Tabbar, Topbar } from './components/Shell';
import { Button, Empty, Toaster } from './components/ui';
import { Home } from './pages/Home';
import { Library } from './pages/Library';
import { Reader } from './pages/Reader';
import { Notebook } from './pages/Notebook';
import { Review } from './pages/Review';
import { Stats } from './pages/Stats';
import { Settings } from './pages/Settings';
import { WordDetail } from './pages/WordDetail';
import { Quiz } from './pages/Quiz';
import { ContinueReading } from './pages/ContinueReading';
import { navigate } from './lib/router';

const TITLES: Record<string, string> = {};

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
          <Reader id={route.id ?? ''} />
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar route={route} />
      <main className="main">
        <Topbar title={TITLES[route.name]} />
        <div className="scroll-area">{page}</div>
      </main>
      <Tabbar route={route} />
      <Toaster />
    </div>
  );
}
