/**
 * 首屏性能预算校验（dist/ 构建产物）
 *
 * 背景：本应用部署在低带宽托管上（实测 20–35 KB/s，且不支持 gzip 压缩），
 * 首屏每多 100KB 就意味着用户多等 3–5 秒。历史上出现过 articles/dict 这类
 * 几百 KB 的包被误引入首屏，导致白屏时间暴涨。
 *
 * 本脚本做四件事：
 *   1. 从 dist/index.html 提取首屏「直接」资源（script src / modulepreload / stylesheet）
 *   2. 按预算校验首屏总体积、单 chunk、CSS、HTML 体积
 *   3. 扫描 dist/assets，确保没有超过硬上限的 JS 大包回归
 *   4. 打印体积明细表与「通过 / 失败」结论，失败时退出码为 1（便于接 CI）
 *
 * 注意：dist/dict/ 下的词典分片是按需加载的，不属于首屏，不计入预算。
 *
 * 用法：node scripts/perf-budget.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

/* ---------- 预算常量（单位：字节，1KB = 1024B；按需调整） ---------- */

/** 首屏直接资源总体积上限 */
const BUDGET_FIRST_SCREEN = 300 * 1024;
/** 单个 JS chunk 上限 */
const BUDGET_SINGLE_JS = 200 * 1024;
/** CSS 总体积上限 */
const BUDGET_CSS_TOTAL = 90 * 1024;
/** dist/index.html 体积上限 */
const BUDGET_HTML = 40 * 1024;
/** dist/assets 下任何单个 JS 文件的硬上限（防止 articles 那种大包回归） */
const BUDGET_ANY_JS = 420 * 1024;

/* ---------- 0. 前置检查 ---------- */

if (!fs.existsSync(DIST_DIR) || !fs.existsSync(HTML_FILE)) {
  console.error('dist/ 不存在或缺少 index.html，请先运行 npm run build');
  process.exit(1);
}

/* ---------- 1. 从 index.html 提取首屏直接资源 ---------- */

const html = fs.readFileSync(HTML_FILE, 'utf8');

/** 把 href/src 归一化为 dist 下的相对路径，非本地 /assets 资源返回 null */
function toAssetRelPath(url) {
  let p = url.trim();
  if (!p || p.startsWith('data:') || p.startsWith('http:') || p.startsWith('https:') || p.startsWith('//')) return null;
  p = p.split('?')[0].split('#')[0];
  if (p.startsWith('/')) p = p.slice(1);
  else if (p.startsWith('./')) p = p.slice(2);
  return p.startsWith('assets/') ? p : null;
}

const directAssets = new Map(); // relPath -> 'js' | 'css'
const collect = (url) => {
  const rel = toAssetRelPath(url);
  if (!rel) return;
  const kind = rel.endsWith('.css') ? 'css' : rel.endsWith('.js') || rel.endsWith('.mjs') ? 'js' : null;
  if (!kind) return;
  directAssets.set(rel, kind);
};

// <script src="...">（含 type="module" 的入口）
for (const m of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) collect(m[1]);

// <link rel="modulepreload"> / <link rel="stylesheet">
for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
  const tag = m[0];
  const rel = (/\brel\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1] ?? '').toLowerCase();
  if (rel !== 'modulepreload' && rel !== 'stylesheet') continue;
  const href = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
  if (href) collect(href);
}

/* ---------- 2. 统计体积 ---------- */

const sizeOf = (absPath) => fs.statSync(absPath).size;
const fmt = (bytes) => (bytes >= 1024 ? `${(bytes / 1024).toFixed(1)}KB` : `${bytes}B`);

const resources = [...directAssets.entries()]
  .map(([rel, kind]) => {
    const abs = path.join(DIST_DIR, rel);
    const exists = fs.existsSync(abs);
    return { name: path.basename(rel), rel, kind, exists, bytes: exists ? sizeOf(abs) : 0 };
  })
  // 先 JS 后 CSS，同类按体积降序
  .sort((a, b) => (a.kind === b.kind ? b.bytes - a.bytes : a.kind === 'js' ? -1 : 1));

const missing = resources.filter((r) => !r.exists);
const firstScreenBytes = resources.reduce((sum, r) => sum + r.bytes, 0);
const jsBytes = resources.filter((r) => r.kind === 'js').reduce((sum, r) => sum + r.bytes, 0);
const cssBytes = resources.filter((r) => r.kind === 'css').reduce((sum, r) => sum + r.bytes, 0);
const biggestJs = resources.filter((r) => r.kind === 'js').sort((a, b) => b.bytes - a.bytes)[0] ?? null;
const htmlBytes = sizeOf(HTML_FILE);

/* ---------- 3. 扫描 dist/assets 下的大 JS 包 ---------- */

const jsFiles = fs.existsSync(ASSETS_DIR)
  ? fs
      .readdirSync(ASSETS_DIR)
      .filter((f) => f.endsWith('.js'))
      .map((f) => ({ name: f, bytes: sizeOf(path.join(ASSETS_DIR, f)) }))
      .sort((a, b) => b.bytes - a.bytes)
  : [];
const oversized = jsFiles.filter((f) => f.bytes > BUDGET_ANY_JS);
const biggestAnyJs = jsFiles[0] ?? null;

/* ---------- 4. 输出明细表 ---------- */

/** 终端显示宽度：CJK / 全角字符占 2 列 */
const dispWidth = (s) =>
  [...s].reduce((n, ch) => n + (/[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(ch) ? 2 : 1), 0);

const pad = (s, w, align = 'left') => {
  const gap = Math.max(0, w - dispWidth(s));
  return align === 'right' ? ' '.repeat(gap) + s : s + ' '.repeat(gap);
};

const COLUMNS = ['资源', '类型', '大小', '预算', '结果'];
const rows = resources.map((r) => [
  r.name,
  r.kind.toUpperCase(),
  r.exists ? fmt(r.bytes) : '缺失',
  fmt(r.kind === 'css' ? BUDGET_CSS_TOTAL : BUDGET_SINGLE_JS),
  !r.exists ? '缺失' : r.bytes <= (r.kind === 'css' ? BUDGET_CSS_TOTAL : BUDGET_SINGLE_JS) ? 'OK' : '超预算',
]);

const widths = COLUMNS.map((c, i) => Math.max(dispWidth(c), ...rows.map((r) => dispWidth(r[i]))));
const line = (cells, align = []) => '  ' + cells.map((c, i) => pad(c, widths[i], align[i])).join('  ');

console.log('首屏资源（提取自 dist/index.html）');
console.log(line(COLUMNS));
console.log('  ' + widths.map((w) => '-'.repeat(w)).join('  '));
for (const r of rows) console.log(line(r, ['left', 'left', 'right', 'right', 'left']));
console.log('');

/* ---------- 5. 预算校验 ---------- */

const checks = [
  {
    label: '首屏直接资源合计',
    actual: firstScreenBytes,
    budget: BUDGET_FIRST_SCREEN,
    pass: firstScreenBytes <= BUDGET_FIRST_SCREEN,
    detail: `${resources.length} 个文件（JS ${fmt(jsBytes)} / CSS ${fmt(cssBytes)}）`,
  },
  {
    label: '单个 JS chunk 上限',
    actual: biggestJs?.bytes ?? 0,
    budget: BUDGET_SINGLE_JS,
    pass: !biggestJs || biggestJs.bytes <= BUDGET_SINGLE_JS,
    detail: biggestJs ? `最大 ${biggestJs.name}` : '无 JS',
  },
  {
    label: 'CSS 总体积',
    actual: cssBytes,
    budget: BUDGET_CSS_TOTAL,
    pass: cssBytes <= BUDGET_CSS_TOTAL,
    detail: `${resources.filter((r) => r.kind === 'css').length} 个文件`,
  },
  {
    label: 'dist/index.html',
    actual: htmlBytes,
    budget: BUDGET_HTML,
    pass: htmlBytes <= BUDGET_HTML,
    detail: '入口 HTML',
  },
  {
    label: `无超过 ${fmt(BUDGET_ANY_JS)} 的 JS 大包`,
    actual: biggestAnyJs?.bytes ?? 0,
    budget: BUDGET_ANY_JS,
    pass: oversized.length === 0,
    detail: biggestAnyJs ? `assets 下最大 ${biggestAnyJs.name}` : 'assets 下无 JS',
  },
];

const checkWidths = [
  Math.max(...checks.map((c) => dispWidth(c.label))),
  Math.max(...checks.map((c) => dispWidth(fmt(c.actual)))),
  Math.max(...checks.map((c) => dispWidth(fmt(c.budget)))),
  Math.max(...checks.map((c) => dispWidth(c.detail))),
];

console.log('预算校验');
for (const c of checks) {
  console.log(
    '  ' +
      [
        pad(c.label, checkWidths[0]),
        `${pad(fmt(c.actual), checkWidths[1], 'right')} / ${pad(fmt(c.budget), checkWidths[2], 'right')}`,
        pad(c.detail, checkWidths[3]),
        c.pass ? '通过' : '失败',
      ].join('  '),
  );
}
console.log('');

/* ---------- 6. 结论 ---------- */

const failed = checks.filter((c) => !c.pass);

if (missing.length) {
  console.error(`× 有 ${missing.length} 个首屏资源在 dist/ 中不存在：${missing.map((r) => r.rel).join(', ')}`);
}
if (oversized.length) {
  console.error(`× 发现 ${oversized.length} 个超大 JS 包：${oversized.map((f) => `${f.name}=${fmt(f.bytes)}`).join(', ')}`);
}

if (failed.length || missing.length) {
  console.error(`首屏性能预算：失败（${failed.length + (missing.length ? 1 : 0)} 项未通过）`);
  process.exit(1);
}

console.log('首屏性能预算：通过');
