import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 把首屏必需的样式内联进 HTML。
 *
 * 背景：托管平台带宽只有 20–35KB/s 且不启用 gzip，主样式表有 77KB。
 * 浏览器必须等这份 CSS 下载完才能渲染，导致首屏长时间空白。
 * 把「变量 + 基础排版」这层内联进 HTML，页面结构一到位就能上色，
 * 剩余组件样式随外链 CSS 后续到达，不再阻塞首次绘制。
 *
 * 注意：这两个文件因此不再由 main.tsx 引入，否则会被重复打包。
 * 开发模式下没有 CSS 热更新，改样式后刷新页面即可看到。
 */
function inlineCriticalCss(): Plugin {
  const CRITICAL = ['src/styles/tokens.css', 'src/styles/base.css'];
  return {
    name: 'english-lab:inline-critical-css',
    transformIndexHtml(html) {
      const css = CRITICAL.map((file) => fs.readFileSync(path.resolve(process.cwd(), file), 'utf8')).join('\n');
      return html.replace('</head>', `    <style data-critical-css>\n${css}\n    </style>\n  </head>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineCriticalCss()],
  server: { port: 5173, host: '127.0.0.1' },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        /**
         * 合并首屏元数据模块。
         *
         * 这个托管的每个请求都有固定开销（实测 1KB 的文件也可能耗掉数秒），
         * 所以把 brief / levels / text 这几个都很小的模块并成一个 chunk，
         * 用体积换请求数——在低带宽高延迟下更划算。
         * 不要再往下拆：拆得越细，请求数成本越抵消体积收益。
         */
        manualChunks(id) {
          if (
            id.includes('/src/data/articles/brief') ||
            id.includes('/src/data/articles/levels') ||
            id.includes('/src/lib/text')
          ) {
            return 'app-meta';
          }
          return undefined;
        },
      },
    },
  },
});
