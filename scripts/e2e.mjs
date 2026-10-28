/**
 * English Lab — 验收场景端到端测试（真实浏览器）
 *
 * 依赖 Playwright（不在 package.json 里，避免 npm install 时强制下载浏览器）：
 *   npm i -D playwright && npx playwright install chromium
 *
 * 运行：
 *   npm run build && npm run preview        # 另开一个终端
 *   npm run test:e2e
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    '\n未安装 Playwright。执行：\n  npm i -D playwright && npx playwright install chromium\n',
  );
  process.exit(2);
}

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

/** 复用本机已下载的 Chromium（版本可能与 playwright 包不一致） */
function resolveChromium() {
  const root = join(homedir(), 'AppData', 'Local', 'ms-playwright');
  const candidates = [];
  for (const dir of ['chromium_headless_shell-1243', 'chromium-1243', 'chromium-1248']) {
    candidates.push(join(root, dir, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe'));
    candidates.push(join(root, dir, 'chrome-win64', 'chrome.exe'));
    candidates.push(join(root, dir, 'chrome-win', 'chrome.exe'));
  }
  return candidates.find((p) => existsSync(p));
}

const results = [];
const consoleErrors = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass: !!pass, detail });
  console.log(`${pass ? '  ✓' : '  ✗'} ${name}${detail ? ' — ' + detail : ''}`);
};

const exe = resolveChromium();
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

const data = () => page.evaluate(() => JSON.parse(localStorage.getItem('english-lab:data') || 'null'));
const settle = (ms = 600) => page.waitForTimeout(ms);

async function open(hash) {
  await page.goto(`${BASE}/#${hash}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.app', { timeout: 8000 });
  await settle(350);
}

async function clickWord(word) {
  const loc = page
    .locator('.reader__article .w')
    .filter({ hasText: new RegExp(`^${word}$`, 'i') })
    .first();
  await loc.scrollIntoViewIfNeeded();
  await loc.click();
  await page.waitForSelector('.popover .vocab-card', { timeout: 5000 });
  await settle(500);
  return loc;
}

/* ------------------------------ 场景 A ------------------------------ */
console.log('\n场景 A：首次收藏 maintain');
await open('/read/l3-01');
check('文章正常渲染', (await page.locator('.reader__article .reader__para').count()) > 0);

await clickWord('maintain');
check('点击单词弹出释义浮层', await page.locator('.popover .vocab-card').isVisible());
const badgeText = await page.locator('.vocab-card .badge').first().innerText();
check('浮层显示"已加入生词本"', badgeText.includes('已加入生词本'), badgeText);
const hasPhonetic = await page.locator('.vocab-card__phon').count();
check('显示音标', hasPhonetic > 0, `${hasPhonetic} 条音标`);
const ctxText = await page.locator('.vocab-card__ctx').first().innerText().catch(() => '');
check('显示当前语境释义', ctxText.length > 4, ctxText.replace(/\n/g, ' ').slice(0, 40));
check('显示固定搭配', (await page.locator('.vocab-card .chip').count()) > 0);

await page.keyboard.press('Escape');
await settle(500);
let d = await data();
const maintainEntry = (d.vocabEntries || []).find((e) => e.lemma === 'maintain');
check('已写入 localStorage 生词本', !!maintainEntry, maintainEntry ? maintainEntry.lemma : '未找到');

await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForSelector('.app');
await settle(400);
d = await data();
check('刷新后 maintain 仍在生词本', (d.vocabEntries || []).some((e) => e.lemma === 'maintain'));

/* ------------------------------ 场景 B ------------------------------ */
console.log('\n场景 B：跨文章识别（water）');
await open('/read/l1-01');
await clickWord('water');
await page.keyboard.press('Escape');
await settle(500);

await open('/read/l1-04');
const marked = await page
  .locator('.reader__article .w--vocab')
  .filter({ hasText: /^water$/i })
  .count();
check('新文章自动标记已收藏单词', marked > 0, `${marked} 处`);

await clickWord('water');
const badgeB = await page.locator('.vocab-card .badge').first().innerText();
check('再次点击显示"已在生词本"', badgeB.includes('已在生词本'), badgeB);
await page.keyboard.press('Escape');
await settle(500);
d = await data();
const waterEntries = (d.vocabEntries || []).filter((e) => e.lemma === 'water');
const waterOcc = (d.occurrences || []).filter((o) => o.vocabularyEntryId === waterEntries[0]?.id);
check('不重复创建词条', waterEntries.length === 1, `${waterEntries.length} 条`);
check('保留第二处上下文', waterOcc.length === 2, `${waterOcc.length} 条上下文`);
check('上下文记录不同文章', new Set(waterOcc.map((o) => o.articleId)).size === 2);

/* ------------------------------ 场景 C ------------------------------ */
console.log('\n场景 C：词形变化（study / studies）');
await open('/read/l1-06');
await clickWord('study');
await page.keyboard.press('Escape');
await settle(500);
await open('/read/l3-03');
const studiesMarked = await page
  .locator('.reader__article .w--vocab')
  .filter({ hasText: /^studies$/i })
  .count();
check('studies 被识别为已收藏（同一 lemma）', studiesMarked > 0, `${studiesMarked} 处`);
await clickWord('studies');
await page.keyboard.press('Escape');
await settle(500);
d = await data();
const studyEntries = (d.vocabEntries || []).filter((e) => e.lemma === 'study');
check('study 只产生一条记录', studyEntries.length === 1, `${studyEntries.length} 条`);
check('没有产生 studies 词条', !(d.vocabEntries || []).some((e) => e.lemma === 'studies'));
const studyOcc = (d.occurrences || []).filter((o) => o.vocabularyEntryId === studyEntries[0]?.id);
check('study 有 2 处上下文', studyOcc.length === 2, `${studyOcc.length} 处`);
check('保留了实际点击的词形', studyOcc.some((o) => o.surfaceForm.toLowerCase() === 'studies'), studyOcc.map((o) => o.surfaceForm).join(','));

/* ------------------------------ 场景 D ------------------------------ */
console.log('\n场景 D：复习系统');
await open('/review');
check('复习页显示待复习统计', (await page.locator('.rv-stat').count()) === 4);
await page.locator('button', { hasText: '混合复习' }).first().click();
await page.waitForSelector('.rv-card', { timeout: 5000 });
check('进入复习卡片', await page.locator('.rv-card').isVisible());
await page.locator('button', { hasText: '显示答案' }).first().click();
await settle(300);
check('显示答案后出现释义', (await page.locator('.rv-card__answer').count()) > 0);
check('显示四个评分按钮', (await page.locator('.rv-grade').count()) === 4);
await page.locator('.rv-grade--good').click();
await settle(700);
d = await data();
check('复习记录已保存', (d.reviews || []).length >= 1, `${(d.reviews || []).length} 条`);
const reviewed = (d.reviews || [])[0];
check('记录了评分与间隔', !!reviewed && reviewed.grade === 'good', reviewed ? `${reviewed.lemma} ${reviewed.prevIntervalDays}→${reviewed.nextIntervalDays} 天` : '');

await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForSelector('.app');
await settle(400);
d = await data();
check('刷新后复习历史仍在', (d.reviews || []).length >= 1);
await open('/notebook');
await settle(300);
check('生词本列出已收藏单词', (await page.locator('.nb-row').count()) >= 3, `${await page.locator('.nb-row').count()} 条`);

/* ------------------------------ 场景 E ------------------------------ */
console.log('\n场景 E：阅读理解');
await open('/quiz/l1-01');
const qCount = await page.locator('.quiz-q').count();
check('题目数量 3–5', qCount >= 3 && qCount <= 5, `${qCount} 题`);
check('未提交时不显示答案', (await page.locator('.quiz-feedback').count()) === 0);
for (let i = 0; i < qCount; i++) {
  await page.locator('.quiz-q').nth(i).locator('.quiz-option').first().click();
}
await page.locator('.quiz-submit-bar button', { hasText: '提交答案' }).click();
await settle(600);
check('提交后显示成绩', (await page.locator('.quiz-result__score').count()) > 0);
const scoreText = await page.locator('.quiz-result__score .mono').innerText();
check('成绩为百分比', /%$/.test(scoreText.trim()), scoreText);
check('显示原文依据', (await page.locator('.quiz-evidence').count()) === qCount);
check('显示错误项分析', (await page.locator('.quiz-wrongwhy').count()) === qCount);
d = await data();
check('答题记录已保存', (d.quizAttempts || []).length === 1);

await open('/stats');
const statsText = await page.locator('.page').innerText();
check('统计页同步理解正确率', /理解正确率/.test(statsText));
check('统计页显示累计完成', /累计完成/.test(statsText));
check('统计页显示两个词数口径', /实际阅读词数/.test(statsText) && /完成文章总词数/.test(statsText));

/* ------------------------------ 场景 F ------------------------------ */
console.log('\n场景 F：视觉与交互');
const viewports = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'ipad', w: 1024, h: 768 },
  { name: 'iphone', w: 390, h: 844 },
];
for (const vp of viewports) {
  await page.setViewportSize({ width: vp.w, height: vp.h });
  for (const [hash, label] of [
    ['/', 'home'],
    ['/library', 'library'],
    ['/read/l1-01', 'reader'],
  ]) {
    await open(hash);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    check(`${vp.name}/${label} 无横向溢出`, overflow <= 1, `溢出 ${overflow}px`);
    await page.screenshot({ path: `${OUT}/${vp.name}-${label}.png`, fullPage: false });
  }
  if (vp.name === 'iphone') {
    await open('/');
    const tabbar = await page.locator('.tabbar').isVisible();
    const sidebar = await page.locator('.sidebar').isVisible();
    check('移动端显示底部导航', tabbar);
    check('移动端隐藏侧边栏', !sidebar);
  }
}

// 深色模式
await page.setViewportSize({ width: 1440, height: 900 });
await open('/settings');
await page.locator('.segmented__item', { hasText: '深色' }).first().click();
await settle(500);
const themeAttr = await page.evaluate(() => document.documentElement.dataset.theme);
check('切换深色模式生效', themeAttr === 'dark', themeAttr);
await open('/');
await page.screenshot({ path: `${OUT}/dark-home.png` });
await open('/read/l1-01');
await page.screenshot({ path: `${OUT}/dark-reader.png` });
const bg = await page.evaluate(() => getComputedStyle(document.querySelector('.reader')).backgroundColor);
check('深色阅读背景为深灰而非纯黑', bg !== 'rgb(0, 0, 0)', bg);

// 阅读器交互
await page.setViewportSize({ width: 1440, height: 900 });
await open('/read/l2-01');
const beforeZh = await page.locator('.sent-zh').count();
await page.locator('.para-translate').first().click();
await settle(300);
const afterZh = await page.locator('.sent-zh').count();
check('段落译文开关展开译文', afterZh > beforeZh, `${beforeZh} → ${afterZh}`);
await page.locator('.reader__sentence').nth(0).click({ position: { x: 2, y: 2 } }).catch(() => {});
await settle(200);
// 字号调整
const sizeBefore = await page.evaluate(() => getComputedStyle(document.querySelector('.reader__article')).fontSize);
await page.locator('.tool-btn[aria-label="增大字号"]').click();
await settle(250);
const sizeAfter = await page.evaluate(() => getComputedStyle(document.querySelector('.reader__article')).fontSize);
check('字号可调', parseFloat(sizeAfter) > parseFloat(sizeBefore), `${sizeBefore} → ${sizeAfter}`);
// 侧边面板
await page.locator('.reader__panel-head .segmented__item', { hasText: '语法' }).click();
await settle(200);
check('语法面板可展开', (await page.locator('.grammar-card').count()) > 0);
// 键盘可访问：句子可 Tab 聚焦并用回车展开
const focusable = await page.evaluate(() => {
  const el = document.querySelector('.reader__sentence');
  return el ? el.getAttribute('tabindex') : null;
});
check('句子可通过键盘聚焦', focusable === '0', `tabindex=${focusable}`);

// 减少动效
await page.emulateMedia({ reducedMotion: 'reduce' });
await settle(200);
const dur = await page.evaluate(() => {
  const el = document.querySelector('.btn') || document.body;
  return getComputedStyle(el).transitionDuration;
});
check('尊重 prefers-reduced-motion', parseFloat(dur) < 0.01, `transition-duration=${dur}`);
await page.emulateMedia({ reducedMotion: 'no-preference' });

/* ------------------------------ 第一阶段回归 ------------------------------ */
console.log('\n第一阶段回归：键盘、即时保存、失败与重试');
await open('/read/l1-01');
const keyboardWord = page.locator('.reader__article .w').first();
await keyboardWord.press('Enter');
await page.waitForSelector('.popover .vocab-card');
await page.getByText(/已加入生词本|已在生词本/).first().waitFor();
check('键盘能打开单词释义', await page.locator('.popover').isVisible());
check('浮层获得键盘焦点', await page.locator('.popover').evaluate((el) => el === document.activeElement));
check('显示保存成功时记录已落盘', (await data()).vocabEntries.length > 0);
await page.keyboard.press('Escape');
check('关闭浮层后焦点返回单词', await keyboardWord.evaluate((el) => el === document.activeElement));

// 在隔离测试上下文中模拟配额错误，不触碰真实学习数据。
await page.evaluate(() => {
  window.__originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function () { throw new DOMException('Full', 'QuotaExceededError'); };
});
await keyboardWord.click();
await page.getByText('保存失败', { exact: true }).waitFor();
check('保存失败不会冒充已收藏', await page.getByText('保存失败', { exact: true }).isVisible());
await page.evaluate(() => { Storage.prototype.setItem = window.__originalSetItem; });
await page.locator('.vocab-card').getByRole('button', { name: '重试保存' }).click();
check('恢复存储后可重试保存', await page.getByText('已在生词本', { exact: true }).isVisible());
await page.keyboard.press('Escape');

// 快速滚动末尾后刷新，覆盖旧节流代码漏掉尾次更新的情况。
await page.locator('.reader__scroll').evaluate((el) => { el.scrollTop = el.scrollHeight; });
await settle(100);
await page.reload();
await page.waitForSelector('.reader__stage');
check('快速滚动后刷新保留末次进度', (await data()).progress['l1-01'].sentenceIndex > 0);

await page.setViewportSize({ width: 390, height: 844 });
await open('/read/l1-01');
await clickWord('water');
const mobilePopover = await page.locator('.popover').boundingBox();
check('手机单词浮层位于视口内', mobilePopover && mobilePopover.x >= 0 && mobilePopover.y >= 0 && mobilePopover.x + mobilePopover.width <= 391 && mobilePopover.y + mobilePopover.height <= 845);
await page.screenshot({ path: `${OUT}/iphone-popover.png` });
await page.keyboard.press('Escape');

const savedScale = (await data()).settings.fontScale;
await page.reload();
await page.waitForSelector('.reader__article');
check('阅读字号偏好刷新后保留', (await data()).settings.fontScale === savedScale);

/* ------------------------------ 汇总 ------------------------------ */
const consoleOk = consoleErrors.filter((e) => !/favicon|Download the React DevTools/i.test(e));
check('浏览器控制台无报错', consoleOk.length === 0, consoleOk.slice(0, 3).join(' | '));
const failed = results.filter((r) => !r.pass);

console.log(`\n结果：${results.length - failed.length}/${results.length} 通过`);
if (failed.length) console.log('失败项：\n' + failed.map((f) => `  - ${f.name} ${f.detail}`).join('\n'));

writeFileSync(
  'screenshots/e2e-result.json',
  JSON.stringify({ total: results.length, failed: failed.length, results, consoleErrors }, null, 2),
);

await browser.close();
process.exit(failed.length ? 1 : 0);
