/**
 * 为离线词典分片生成 .gz 副本（默认 public/dict，可传目录参数）
 *
 * 为什么需要这个脚本：
 *   托管平台不启用 gzip（实测响应头没有 Content-Encoding），public/dict/ 下约 15MB 的
 *   JSON 会原样传输，低带宽下加载分片很慢。前端改用 DecompressionStream('gzip') 自解压，
 *   所以需要构建期预先产出 .json.gz，让传输体积降到原来的 1/4 左右。
 *
 * 说明：
 *   - manifest.json 不压缩：只有 16KB，且前端必须先拿到它才知道有哪些分片，保持明文更简单
 *   - 幂等：重复运行会覆盖旧 .gz，不会重复处理 .gz 自身
 *
 * 用法：node scripts/gzip-dict-shards.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(import.meta.dirname, '..');
// 支持传入目录，默认压源目录；构建后压 dist/dict 可让 .gz 只作为构建产物存在
const TARGET = process.argv[2] || 'public/dict';
const DICT_DIR = path.resolve(ROOT, TARGET);

/** 不参与压缩的文件（前端需要先明文读取） */
const SKIP = new Set(['manifest.json']);

/* ---------- 1. 校验目录 ---------- */
if (!fs.existsSync(DICT_DIR) || !fs.statSync(DICT_DIR).isDirectory()) {
  console.error(`错误：找不到词典目录 ${DICT_DIR}`);
  console.error('请先运行 node scripts/build-dict-shards.mjs 生成分片。');
  process.exit(1);
}

const files = fs.readdirSync(DICT_DIR).filter((f) => f.endsWith('.json') && !SKIP.has(f));
if (files.length === 0) {
  console.error(`错误：${DICT_DIR} 下没有任何 .json 分片`);
  console.error('请先运行 node scripts/build-dict-shards.mjs 生成分片。');
  process.exit(1);
}

/* ---------- 2. 逐个压缩 ---------- */
let rawTotal = 0;
let gzTotal = 0;
let maxRaw = 0;
let maxGz = 0;
let maxName = '';

for (const file of files.sort()) {
  const src = path.join(DICT_DIR, file);
  const buf = fs.readFileSync(src);
  const gz = zlib.gzipSync(buf, { level: 9 });
  // 覆盖写入，保证幂等
  fs.writeFileSync(`${src}.gz`, gz);

  rawTotal += buf.length;
  gzTotal += gz.length;
  if (buf.length > maxRaw) {
    maxRaw = buf.length;
    maxGz = gz.length;
    maxName = file;
  }
}

/* ---------- 3. 输出统计 ---------- */
const kb = (n) => (n / 1024).toFixed(0) + 'KB';
const mb = (n) => (n / 1048576).toFixed(1) + 'MB';
const pct = (n, total) => ((n / total) * 100).toFixed(1) + '%';

console.log('处理文件数:', files.length);
console.log('原始总大小:', mb(rawTotal));
console.log('压缩后总大小:', mb(gzTotal));
console.log('压缩比:', pct(gzTotal, rawTotal), '(压缩后 / 原始)');
console.log('最大单文件:', maxName, kb(maxRaw), '->', kb(maxGz));
