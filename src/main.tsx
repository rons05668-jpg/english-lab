import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// tokens.css 与 base.css 由 vite.config.ts 的 inlineCriticalCss 内联进 HTML，
// 这里不能再引，否则会被重复打包进主样式表。
import './styles/components.css';
import './styles/pages.css';
import './styles/extra.css';
// reader.css 只在阅读器用，随 Reader 组件按需加载，不阻塞首屏。

const root = document.getElementById('root');
if (!root) throw new Error('#root 不存在');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // 在线功能仍可用；浏览器可能不支持离线缓存。
    });
  });
}
