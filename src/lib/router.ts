import { useEffect, useState } from 'react';

export type RouteName =
  | 'home'
  | 'library'
  | 'continue'
  | 'notebook'
  | 'review'
  | 'stats'
  | 'settings'
  | 'reader'
  | 'quiz'
  | 'word'
  | 'notfound';

export interface Route {
  name: RouteName;
  id?: string;
  hash: string;
}

const NAMES: RouteName[] = ['home', 'library', 'continue', 'notebook', 'review', 'stats', 'settings', 'reader', 'quiz', 'word'];

/** URL 段 → 路由名（/read/:id 是阅读器的对外路径） */
const ALIAS: Record<string, RouteName> = { read: 'reader' };

export function parseHash(raw: string): Route {
  const hash = raw.replace(/^#\/?/, '').replace(/\/$/, '');
  if (!hash) return { name: 'home', hash: '' };
  const [seg, id] = hash.split('/');
  const name = ALIAS[seg] ?? ((NAMES as string[]).includes(seg) ? (seg as RouteName) : 'notfound');
  return { name, id: id ? decodeURIComponent(id) : undefined, hash };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function navigate(path: string, opts: { replace?: boolean } = {}): void {
  const target = path.startsWith('#') ? path : `#${path.startsWith('/') ? path : '/' + path}`;
  if (window.location.hash === target) return;
  if (opts.replace) {
    window.history.replaceState(null, '', target);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = target;
  }
}

export function href(path: string): string {
  return `#${path.startsWith('/') ? path : '/' + path}`;
}

export const NAV_ITEMS: { name: RouteName; label: string; path: string; icon: string }[] = [
  { name: 'home', label: '首页', path: '/', icon: 'home' },
  { name: 'library', label: '文章库', path: '/library', icon: 'library' },
  { name: 'continue', label: '继续阅读', path: '/continue', icon: 'play' },
  { name: 'notebook', label: '我的生词本', path: '/notebook', icon: 'notebook' },
  { name: 'review', label: '单词复习', path: '/review', icon: 'cards' },
  { name: 'stats', label: '学习统计', path: '/stats', icon: 'chart' },
  { name: 'settings', label: '设置', path: '/settings', icon: 'gear' },
];
