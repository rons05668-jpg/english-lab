import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://127.0.0.1:4173';
const exe = 'C:/Users/25488/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
mkdirSync('screenshots', { recursive: true });

const b = await chromium.launch({ executablePath: exe });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();

// 预置一些学习数据，让各页面有内容
await p.goto(`${BASE}/#/read/l3-01`, { waitUntil: 'networkidle' });
await p.waitForSelector('.app');
const words = ['maintain', 'neighbour', 'distance', 'notice'];
for (const w of words) {
  const loc = p.locator('.reader__article .w').filter({ hasText: new RegExp(`^${w}$`, 'i') }).first();
  if ((await loc.count()) === 0) continue;
  await loc.click();
  await p.waitForSelector('.popover .vocab-card', { timeout: 4000 });
  await p.waitForTimeout(700);
  if (w === 'maintain') await p.screenshot({ path: 'screenshots/popover.png' });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
}
await p.goto(`${BASE}/#/quiz/l3-01`, { waitUntil: 'networkidle' });
await p.waitForSelector('.quiz-q');
const n = await p.locator('.quiz-q').count();
for (let i = 0; i < n; i++) await p.locator('.quiz-q').nth(i).locator('.quiz-option').first().click();
await p.locator('.quiz-submit-bar button', { hasText: '提交答案' }).click();
await p.waitForTimeout(600);
await p.screenshot({ path: 'screenshots/quiz-result.png', fullPage: false });

for (const [hash, name] of [
  ['/library', 'library'],
  ['/notebook', 'notebook'],
  ['/review', 'review'],
  ['/stats', 'stats'],
  ['/settings', 'settings'],
  ['/continue', 'continue'],
  ['/word/maintain', 'word'],
]) {
  await p.goto(`${BASE}/#${hash}`, { waitUntil: 'networkidle' });
  await p.waitForSelector('.app');
  await p.waitForTimeout(700);
  await p.screenshot({ path: `screenshots/page-${name}.png` });
}

// 移动端
await p.setViewportSize({ width: 390, height: 844 });
for (const [hash, name] of [
  ['/read/l3-01', 'reader'],
  ['/notebook', 'notebook'],
  ['/review', 'review'],
]) {
  await p.goto(`${BASE}/#${hash}`, { waitUntil: 'networkidle' });
  await p.waitForSelector('.app');
  await p.waitForTimeout(600);
  await p.screenshot({ path: `screenshots/m-${name}.png` });
}

await b.close();
console.log('done');
