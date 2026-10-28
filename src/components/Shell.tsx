import { useEffect, useMemo, useState } from 'react';
import { Icon } from './icons';
import { IconButton, Progress, Badge } from './ui';
import { NAV_ITEMS, href, navigate, type Route } from '../lib/router';
import { useData } from '../lib/store';
import { updateSettings } from '../lib/db';
import { setData } from '../lib/store';
import { streakFromActiveDays } from '../lib/stats';
import { todayKey } from '../lib/text';

const UI_KEY = 'english-lab:ui';

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(UI_KEY) === 'collapsed';
  } catch {
    return false;
  }
}

export function Sidebar({ route }: { route: Route }) {
  const data = useData();
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const due = useMemo(() => {
    const now = Date.now();
    return data.vocabEntries.filter(
      (e) => e.masteryStatus !== 'mastered' && (e.nextReviewAt ?? 0) <= now,
    ).length;
  }, [data.vocabEntries]);

  const streak = useMemo(() => streakFromActiveDays(data.activeDays, Date.now()), [data.activeDays]);

  useEffect(() => {
    try {
      localStorage.setItem(UI_KEY, collapsed ? 'collapsed' : 'expanded');
    } catch {
      /* 忽略 */
    }
  }, [collapsed]);

  const total = data.vocabEntries.length;

  return (
    <aside className="sidebar" data-collapsed={collapsed} aria-label="主导航">
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true">
          E
        </span>
        {!collapsed && (
          <div>
            <div className="sidebar__title">English Lab</div>
            <div className="sidebar__subtitle">阅读 · 词汇 · 理解</div>
          </div>
        )}
      </div>

      <nav aria-label="页面导航">
        {NAV_ITEMS.map((item) => {
          const active = route.name === item.name;
          return (
            <a
              key={item.name}
              href={href(item.path)}
              className="nav-item"
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <span className="nav-item__icon">
                <Icon name={item.icon} size={18} />
              </span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.name === 'review' && due > 0 ? (
                <span className="nav-item__badge">{due > 99 ? '99+' : due}</span>
              ) : null}
            </a>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        {!collapsed && (
          <>
            <div className="sidebar__streak">
              <Icon name="flame" size={15} />
              <span>连续学习 {streak} 天</span>
            </div>
            <div className="sidebar__streak" style={{ background: 'var(--fill-quaternary)' }}>
              <Icon name="notebook" size={15} />
              <span>生词本 {total} 词</span>
            </div>
          </>
        )}
        <button
          className="nav-item"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
          title={collapsed ? '展开侧边栏' : '折叠侧边栏'}
        >
          <span className="nav-item__icon">
            <Icon name={collapsed ? 'right' : 'left'} size={18} />
          </span>
          {!collapsed && <span>折叠侧边栏</span>}
        </button>
      </div>
    </aside>
  );
}

export function Topbar({
  title,
  subtitle,
  right,
  sticky = true,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  sticky?: boolean;
}) {
  const data = useData();
  const theme = data.settings.theme;

  const cycleTheme = () => {
    const order: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setData(updateSettings(data, { theme: next }), true);
  };

  const themeIcon = theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'monitor';
  const themeLabel = theme === 'light' ? '浅色模式' : theme === 'dark' ? '深色模式' : '跟随系统';

  return (
    <header className={`topbar${sticky ? ' topbar--sticky' : ''}`}>
      <div style={{ minWidth: 0 }}>
        {title ? <h1 className="topbar__title">{title}</h1> : null}
        {subtitle ? <p className="hint">{subtitle}</p> : null}
      </div>
      <div className="topbar__spacer" />
      {right}
      <IconButton icon={themeIcon} label={`${themeLabel}，点击切换`} onClick={cycleTheme} />
    </header>
  );
}

export function Tabbar({ route }: { route: Route }) {
  const data = useData();
  const due = useMemo(() => {
    const now = Date.now();
    return data.vocabEntries.filter(
      (e) => e.masteryStatus !== 'mastered' && (e.nextReviewAt ?? 0) <= now,
    ).length;
  }, [data.vocabEntries]);

  const items = NAV_ITEMS.filter((i) => ['home', 'library', 'notebook', 'review', 'stats'].includes(i.name));
  return (
    <nav className="tabbar" aria-label="底部导航">
      {items.map((item) => (
        <a
          key={item.name}
          href={href(item.path)}
          className="tabbar__item"
          aria-current={route.name === item.name ? 'page' : undefined}
        >
          <Icon name={item.icon} size={20} />
          <span>{item.label.replace('我的', '')}</span>
          {item.name === 'review' && due > 0 ? (
            <span className="tabbar__badge">{due > 9 ? '9+' : due}</span>
          ) : null}
        </a>
      ))}
    </nav>
  );
}

/** 今日目标环（首页用） */
export function DailyGoalRing({ done, goal }: { done: number; goal: number }) {
  const ratio = goal > 0 ? Math.min(1, done / goal) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>今日目标</span>
          <span className="mono" style={{ fontSize: 13, color: 'var(--text-2)' }}>
            {done} / {goal}
          </span>
        </div>
        <Progress value={ratio} label="今日阅读目标" />
      </div>
      {ratio >= 1 ? <Badge tone="green">已达成</Badge> : null}
    </div>
  );
}

export function useTodayKey(): string {
  return todayKey(Date.now());
}

export function goToReview(): void {
  navigate('/review');
}
