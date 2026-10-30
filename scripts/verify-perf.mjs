#!/usr/bin/env node
/**
 * 性能验证脚本：量化「首屏可交互」与「点词出释义」耗时。
 *
 * 用法：
 *   node scripts/verify-perf.mjs           # 默认 local
 *   node scripts/verify-perf.mjs local     # http://127.0.0.1:4173/
 *   node scripts/verify-perf.mjs live      # $PERF_URL 或线上地址
 *
 * 设计要点：
 * - 每轮都新建 browser context（无 cookie / 无 localStorage / 无 HTTP 缓存），
 *   两轮数字的差异来自服务端与 CDN 预热，而不是浏览器缓存。
 * - 点词成功的判定：.popover__body 内不再有 .skeleton、有文本，
 *   且确实渲染出了释义块（.vocab-card__ctx 或 .callout--info）。
 *   只有「释义待补充 / 词典不可用」时才算失败。
 * - 任一词点不出释义 → exit 1。
 */

import { chromium } from 'playwright';

/* ------------------------------ 目标与超时 ------------------------------ */

const LIVE_FALLBACK = 'https://english-lab.apps.workbuddy.host/?sharecode=V2YNQ4HFK2';

const TARGETS = {
  local: 'http://127.0.0.1:4173/',
  live: process.env.PERF_URL?.trim() || LIVE_FALLBACK,
};

const arg = (process.argv[2] ?? 'local').toLowerCase();
if (arg !== 'local' && arg !== 'live') {
  console.error(`未知目标 "${arg}"，可用：local | live`);
  process.exit(2);
}

const TARGET_NAME = arg;
const TARGET_URL = TARGETS[arg];
const IS_LIVE = arg === 'live';

const NAV_TIMEOUT = 120_000; // 线上慢，给足时间
const STEP_TIMEOUT = 120_000;
const WORD_TIMEOUT = 45_000; // 单词超时单独收紧，避免 4 个词 × 120s
const ROUNDS = 2;
const WORDS_PER_ROUND = 4;

const WORD_SELECTOR = '.reader__article span[role="button"][aria-label^="查询单词 "]';
const POPOVER_BODY = '.popover__body';
const GLOSS_SELECTOR = `${POPOVER_BODY} .vocab-card__ctx, ${POPOVER_BODY} .callout--info`;

/* ------------------------------ 小工具 ------------------------------ */

/** 按显示宽度补空格（中文按 2 列算），让终端表格对齐。 */
function pad(text, width) {
  let w = 0;
  for (const ch of text) w += /[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/.test(ch) ? 2 : 1;
  return text + ' '.repeat(Math.max(0, width - w));
}

function fmtMs(ms) {
  if (ms == null || !Number.isFinite(ms)) return '—';
  return ms >= 10_000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;
}

function fmtBytes(n) {
  if (!n) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(v >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function fmtDelta(a, b) {
  if (a == null || b == null || !Number.isFinite(a) || !Number.isFinite(b) || a === 0) return '—';
  const diff = ((b - a) / a) * 100;
  const sign = diff > 0 ? '+' : '';
  return `${sign}${diff.toFixed(0)}%`;
}

function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/* ------------------------------ 单轮测量 ------------------------------ */

/**
 * 跑一轮：全新 context → 首屏 → 阅读器 → 点 4 个词。
 * 返回结构化结果，不抛异常（失败信息写在结果里）。
 */
async function runRound(browser, roundNo) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    bypassCSP: true,
  });
  const page = await ctx.newPage();

  /** 首屏资源记录；cl 为 content-length，缺失时留 null 稍后用 sizes() 补 */
  const resources = [];
  const httpErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('response', (res) => {
    const req = res.request();
    const clRaw = res.headers()['content-length'];
    const cl = clRaw != null && clRaw !== '' ? Number(clRaw) : null;
    const status = res.status();
    resources.push({
      url: res.url(),
      type: req.resourceType(),
      status,
      cl: Number.isFinite(cl) ? cl : null,
      res,
    });
    if (status >= 400) {
      httpErrors.push({ status, url: res.url(), type: req.resourceType() });
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err?.message ?? String(err));
  });
  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText ?? 'unknown' });
  });

  const result = {
    round: roundNo,
    firstInteractive: null,
    readerReady: null,
    words: [],
    firstScreen: { count: 0, bytes: 0, missingLength: 0, slowest: [] },
    httpErrors,
    pageErrors,
    failedRequests,
    entry: null, // 进入阅读器的路径：开始第一篇 / 继续阅读 / 直链
    fatal: null,
  };

  try {
    /* ---- 1. 首屏可交互 ---- */
    const t0 = Date.now();
    await page.goto(TARGET_URL, { waitUntil: 'commit', timeout: NAV_TIMEOUT });

    // 「去文章库」是首页首屏的关键文案，出现即视为可交互
    await page
      .locator('button:has-text("去文章库"), a:has-text("去文章库")')
      .first()
      .waitFor({ state: 'visible', timeout: STEP_TIMEOUT });
    result.firstInteractive = Date.now() - t0;

    // 首屏资源快照（此刻之前到达的响应）
    result.firstScreen.count = resources.length;
    result.firstScreen.raw = resources.slice();

    /* ---- 2. 阅读器就绪 ---- */
    const startBtn = page.locator('button:has-text("开始第一篇")').first();
    const contBtn = page.locator('button:has-text("继续阅读")').first();
    const readerT0 = Date.now();
    if (await startBtn.count()) {
      result.entry = '开始第一篇';
      await startBtn.click({ timeout: STEP_TIMEOUT });
    } else if (await contBtn.count()) {
      result.entry = '继续阅读';
      await contBtn.click({ timeout: STEP_TIMEOUT });
    } else {
      result.entry = '直链 #/reader/l1-01';
      await page.evaluate(() => {
        window.location.hash = '#/reader/l1-01';
      });
    }
    await page.locator('.reader__article').first().waitFor({ state: 'visible', timeout: STEP_TIMEOUT });
    result.readerReady = Date.now() - readerT0;

    /* ---- 3. 点 4 个不同首字母的词 ---- */
    const labels = await page.$$eval(WORD_SELECTOR, (els) =>
      els.map((el) => el.getAttribute('aria-label') ?? ''),
    );
    const picked = pickWords(labels, WORDS_PER_ROUND);

    if (picked.length < WORDS_PER_ROUND) {
      result.fatal = `正文里只找到 ${picked.length} 个不同首字母的可点词，无法完成 ${WORDS_PER_ROUND} 次测量`;
    }

    for (const item of picked) {
      const wordResult = await measureWord(page, item);
      result.words.push(wordResult);
    }

    /* ---- 4. 补齐缺失的 content-length 并汇总首屏字节 ---- */
    await finalizeFirstScreen(result.firstScreen);
    delete result.firstScreen.raw;
  } catch (err) {
    result.fatal = err?.message?.split('\n')[0] ?? String(err);
    if (result.firstScreen.raw) {
      await finalizeFirstScreen(result.firstScreen).catch(() => {});
      delete result.firstScreen.raw;
    }
  } finally {
    await ctx.close().catch(() => {});
  }

  return result;
}

/** 从 aria-label 列表里挑出 n 个首字母互不相同的词。 */
function pickWords(labels, n) {
  const picked = [];
  const used = new Set();
  labels.forEach((label, index) => {
    if (picked.length >= n) return;
    const word = label.replace(/^查询单词\s*/, '').trim();
    const letter = word[0]?.toLowerCase();
    if (!letter || !/[a-z]/.test(letter)) return;
    if (used.has(letter)) return;
    used.add(letter);
    picked.push({ word, index });
  });
  return picked;
}

/**
 * 点一个词并测量耗时。
 * 时间戳取自页面内 performance.now()，只包含真实点击→渲染完成的开销。
 */
async function measureWord(page, { word, index }) {
  const out = { word, letter: word[0]?.toLowerCase(), ms: null, ok: false, note: '' };
  const locator = page.locator(WORD_SELECTOR).nth(index);

  try {
    // 关掉上一轮的浮层
    if (await page.locator('.popover').count()) {
      await page.keyboard.press('Escape');
      await page.locator('.popover').first().waitFor({ state: 'detached', timeout: 5_000 }).catch(() => {});
    }

    await locator.scrollIntoViewIfNeeded({ timeout: 10_000 }).catch(() => {});

    const t0 = await page.evaluate(() => performance.now());
    try {
      await locator.click({ timeout: 15_000 });
    } catch {
      // 元素被粘性头部遮挡等情况，退化为直接派发 click
      await locator.dispatchEvent('click', undefined, { timeout: 10_000 });
      out.note = '（点击降级为 dispatchEvent）';
    }

    await page.waitForFunction(
      (sel) => {
        const body = document.querySelector(sel);
        if (!body) return false;
        if (body.querySelector('.skeleton')) return false;
        return (body.textContent ?? '').trim().length > 0;
      },
      POPOVER_BODY,
      { timeout: WORD_TIMEOUT, polling: 50 },
    );

    const t1 = await page.evaluate(() => performance.now());
    out.ms = t1 - t0;

    // 确认真的出了释义，而不是「待补充 / 词典不可用」
    const hasGloss = await page.locator(GLOSS_SELECTOR).first().count();
    const warn = await page.locator(`${POPOVER_BODY} .callout--warn`).first().count();
    if (hasGloss > 0) {
      out.ok = true;
    } else {
      out.note += warn > 0 ? '（词典不可用 / 释义待补充）' : '（浮层无释义块）';
    }
  } catch (err) {
    out.note += `（${err?.message?.split('\n')[0] ?? String(err)}）`;
  } finally {
    await page.locator('.popover').first().waitFor({ state: 'detached', timeout: 3_000 }).catch(async () => {
      await page.keyboard.press('Escape').catch(() => {});
    });
  }

  return out;
}

/** 汇总首屏资源：数量、总字节（优先 content-length，缺失时用 sizes()）、最慢 3 个。 */
async function finalizeFirstScreen(screen) {
  const raw = screen.raw ?? [];
  let bytes = 0;
  let missing = 0;
  const slowest = [];

  for (const rec of raw) {
    let size = rec.cl;
    if (size == null) {
      missing += 1;
      try {
        const s = await rec.res.request().sizes();
        size = s.responseBodySize > 0 ? s.responseBodySize : 0;
      } catch {
        size = 0;
      }
    }
    bytes += size ?? 0;

    try {
      const timing = rec.res.request().timing();
      const dur = timing.responseEnd > 0 ? timing.responseEnd - timing.startTime : null;
      if (dur != null && dur >= 0) slowest.push({ url: shortUrl(rec.url), dur, type: rec.type });
    } catch {
      /* timing 不可用则跳过 */
    }
  }

  screen.count = raw.length;
  screen.bytes = bytes;
  screen.missingLength = missing;
  screen.slowest = slowest.sort((a, b) => b.dur - a.dur).slice(0, 3);
}

function shortUrl(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.split('/').filter(Boolean).pop() ?? u.pathname;
    return `${path}${u.search ? '?…' : ''}`;
  } catch {
    return url.slice(0, 60);
  }
}

/* ------------------------------ 报告 ------------------------------ */

function printRound(r) {
  console.log('');
  console.log(`【第 ${r.round} 轮】`);
  if (r.fatal) {
    console.log(`  致命错误：${r.fatal}`);
    return;
  }

  console.log(`  首屏可交互      ${fmtMs(r.firstInteractive)}   （goto → 「去文章库」可见）`);
  console.log(`  阅读器就绪      ${fmtMs(r.readerReady)}   （点击「${r.entry}」→ .reader__article 可见）`);
  console.log('  点词出释义');
  console.log(`    ${pad('单词', 16)}${pad('首字母', 8)}${pad('耗时', 12)}结果`);
  for (const w of r.words) {
    const state = w.ok ? '成功' : `失败 ${w.note}`;
    console.log(`    ${pad(w.word, 16)}${pad(w.letter, 8)}${pad(fmtMs(w.ms), 12)}${state}`);
  }

  const fs = r.firstScreen;
  console.log(`  首屏资源        ${fs.count} 个 / ${fmtBytes(fs.bytes)}   （截至可交互时刻）`);
  if (fs.missingLength > 0) {
    console.log(`                  ${fs.missingLength} 个响应无 content-length，字节数取自 CDP sizes()`);
  }
  if (fs.slowest.length) {
    console.log(`  最慢资源        ${fs.slowest.map((s) => `${s.url} ${fmtMs(s.dur)}`).join(' · ')}`);
  }

  console.log(`  HTTP 4xx/5xx    ${r.httpErrors.length === 0 ? '无' : `${r.httpErrors.length} 个`}`);
  for (const e of r.httpErrors.slice(0, 5)) {
    console.log(`                  ${e.status} ${e.type} ${shortUrl(e.url)}`);
  }
  if (r.httpErrors.length > 5) console.log(`                  …另有 ${r.httpErrors.length - 5} 个`);

  console.log(`  JS 异常         ${r.pageErrors.length === 0 ? '无' : `${r.pageErrors.length} 个`}`);
  for (const msg of r.pageErrors.slice(0, 3)) {
    console.log(`                  ${msg.slice(0, 120)}`);
  }
  if (r.failedRequests.length) {
    console.log(`  请求失败        ${r.failedRequests.length} 个（多为取消/超时，仅供参考）`);
  }
}

function printComparison(a, b) {
  console.log('');
  console.log('【两轮关键数字对比】');
  console.log(`  ${pad('指标', 20)}${pad('第 1 轮', 14)}${pad('第 2 轮', 14)}变化`);
  const rows = [
    ['首屏可交互', a.firstInteractive, b.firstInteractive, (v) => fmtMs(v)],
    ['阅读器就绪', a.readerReady, b.readerReady, (v) => fmtMs(v)],
    ['点词平均', avgWord(a), avgWord(b), (v) => fmtMs(v)],
    ['点词最慢', maxWord(a), maxWord(b), (v) => fmtMs(v)],
    ['首屏资源数', a.firstScreen.count, b.firstScreen.count, (v) => String(v)],
    ['首屏字节', a.firstScreen.bytes, b.firstScreen.bytes, (v) => fmtBytes(v)],
  ];
  for (const [label, x, y, fmt] of rows) {
    const delta = label === '首屏资源数' || label === '首屏字节' ? '—' : fmtDelta(x, y);
    console.log(`  ${pad(label, 20)}${pad(fmt(x), 14)}${pad(fmt(y), 14)}${delta}`);
  }
  console.log('');
  console.log('  说明：每轮均为全新 browser context（无 cookie / 无 localStorage / 无 HTTP 缓存），');
  console.log('        第 2 轮的差异主要来自服务端与 CDN 预热，而非浏览器缓存。');
}

function avgWord(r) {
  const ok = r.words.filter((w) => w.ok && w.ms != null);
  if (!ok.length) return null;
  return ok.reduce((s, w) => s + w.ms, 0) / ok.length;
}

function maxWord(r) {
  const ok = r.words.filter((w) => w.ok && w.ms != null);
  if (!ok.length) return null;
  return Math.max(...ok.map((w) => w.ms));
}

/* ------------------------------ 主流程 ------------------------------ */

console.log('='.repeat(64));
console.log('  English Lab 性能验证');
console.log(`  目标      ${TARGET_NAME}  ${TARGET_URL}`);
console.log(`  时间      ${nowStamp()}`);
console.log(`  轮次      ${ROUNDS} 轮 × ${WORDS_PER_ROUND} 个词，每轮独立 context`);
console.log('='.repeat(64));

const browser = await chromium.launch({ headless: true });
const rounds = [];
try {
  for (let i = 1; i <= ROUNDS; i += 1) {
    rounds.push(await runRound(browser, i));
  }
} finally {
  await browser.close().catch(() => {});
}

for (const r of rounds) printRound(r);
printComparison(rounds[0], rounds[1]);

/* ------------------------------ 结论与退出码 ------------------------------ */

const problems = [];
for (const r of rounds) {
  if (r.fatal) problems.push(`第 ${r.round} 轮中断：${r.fatal}`);
  for (const w of r.words) {
    if (!w.ok) problems.push(`第 ${r.round} 轮「${w.word}」未出释义${w.note ? ` ${w.note}` : ''}`);
  }
  if (r.words.length < WORDS_PER_ROUND && !r.fatal) {
    problems.push(`第 ${r.round} 轮只测了 ${r.words.length}/${WORDS_PER_ROUND} 个词`);
  }
  if (r.firstInteractive == null && !r.fatal) problems.push(`第 ${r.round} 轮未测到首屏可交互时间`);
  if (r.pageErrors.length) problems.push(`第 ${r.round} 轮出现 ${r.pageErrors.length} 个 JS 异常`);
  const serverErrors = r.httpErrors.filter((e) => e.status >= 500);
  if (serverErrors.length) problems.push(`第 ${r.round} 轮出现 ${serverErrors.length} 个 5xx 响应`);
}

console.log('');
if (problems.length === 0) {
  console.log('结论：通过 —— 两轮的首屏与点词测量均成功，无 5xx、无 JS 异常。');
  process.exit(0);
} else {
  console.log(`结论：失败 —— 共 ${problems.length} 项问题`);
  for (const p of problems) console.log(`  · ${p}`);
  process.exit(1);
}
