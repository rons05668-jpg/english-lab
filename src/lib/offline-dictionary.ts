import type { DictionarySense } from '../data/types';

/**
 * 离线词典加载层（按需 fetch）
 *
 * 架构说明：
 *   词典数据以静态 JSON 分片放在 public/dict/，不进入 JS 打包。
 *   分片按单词前缀分层组织：ab.json → co.json → con-n.json → cons-t.json …
 *   单个分片控制在 60KB 以内，避免低带宽下点一个词要等数十秒。
 *
 *   原实现用 import.meta.glob 把 740 个分片（26.3MB）打成 JS chunk，
 *   热门分片达 767KB 且服务器未启用 gzip，点词要等 20 秒以上，
 *   用户感知为「点了没释义」。这是本次重构的直接原因。
 */

interface OfflineData {
  entries: Record<string, string[]>;
  forms: Record<string, string[]>;
}

const EMPTY: OfflineData = { entries: {}, forms: {} };

/** 分片名最长层级（co → con → cons → …），与生成脚本的 depth 上限保持一致 */
const MAX_NAME_LEN = 7;
/** 单个分片的请求超时 */
const FETCH_TIMEOUT_MS = 10000;

const BASE = `${import.meta.env.BASE_URL}dict/`;

let manifestPromise: Promise<Set<string>> | null = null;
const shardCache = new Map<string, Promise<OfflineData>>();

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/** 分片清单。只请求一次，失败后允许下次重试。 */
function loadManifest(): Promise<Set<string>> {
  if (!manifestPromise) {
    manifestPromise = fetchJson<{ shards: string[] }>(`${BASE}manifest.json`)
      .then((m) => new Set(m.shards))
      .catch((error: unknown) => {
        manifestPromise = null;
        throw error;
      });
  }
  return manifestPromise;
}

/** 把单词规范成可用于匹配分片名的小写字母串 */
function normalizeKey(word: string): string {
  return (word + '_______').slice(0, MAX_NAME_LEN).replace(/[^a-z]/g, '_');
}

/**
 * 在分片清单里找出该词所属的分片名：从最长前缀往短探测。
 * 纯函数，便于单测。
 */
export function resolveShardName(word: string, shards: Set<string>): string | null {
  const key = normalizeKey(word);
  for (let len = Math.min(key.length, MAX_NAME_LEN); len >= 2; len--) {
    const name = key.slice(0, len);
    if (shards.has(name)) return name;
    // Windows 保留设备名（aux/con/nul…）在生成时加了尾部下划线
    if (shards.has(`${name}_`)) return `${name}_`;
  }
  return null;
}

async function loadShardByName(name: string): Promise<OfflineData> {
  let pending = shardCache.get(name);
  if (!pending) {
    pending = fetchJson<OfflineData>(`${BASE}${name}.json`).catch((error: unknown) => {
      shardCache.delete(name);
      throw error;
    });
    shardCache.set(name, pending);
  }
  return pending;
}

/**
 * 预取分片清单。进入阅读器时调用，让第一次点词省掉一次往返。
 * 失败不抛错——真正查询时还会重试。
 */
export function warmOfflineDictionary(): void {
  void loadManifest().catch(() => undefined);
}

/**
 * 按单词取它所属的分片数据。
 * 词不属于任何分片时返回空数据（不是错误）。
 */
export async function loadOfflineDictionary(word: string): Promise<OfflineData> {
  const shards = await loadManifest();
  const name = resolveShardName(word, shards);
  if (!name) return EMPTY;
  return loadShardByName(name);
}

function toResult(lemma: string, row: string[]) {
  const senses: DictionarySense[] = row[0].split('\n').filter(Boolean).map((line) => {
    const match = line.match(/^([a-z./ &]+\.)\s*(.*)$/i);
    return { pos: match?.[1] ?? row[2].replaceAll('/', ', '), definition: match?.[2] ?? line };
  });
  return { lemma, senses, phonetic: row[1] ? { uk: `/${row[1].replace(/^\/|\/$/g, '')}/` } : {} };
}

export async function lookupOffline(candidates: string[]) {
  for (const candidate of [...new Set(candidates.map((word) => word.toLowerCase()))]) {
    if (!/^[a-z]/.test(candidate)) continue;
    const data = await loadOfflineDictionary(candidate);
    const direct = data.entries[candidate];
    const forms = data.forms[candidate] ?? [];
    const isExplicitInflection = direct && forms.some((lemma) => direct[0].toLowerCase().includes(`${lemma}的`));
    if (direct && !isExplicitInflection) return toResult(candidate, direct);
    for (const lemma of forms) {
      const lemmaData = await loadOfflineDictionary(lemma);
      const row = lemmaData.entries[lemma];
      if (row) return toResult(lemma, row);
    }
    if (direct) return toResult(candidate, direct);
  }
  return null;
}

/** 已加载分片的数量，供诊断使用 */
export function loadedShardCount(): number {
  return shardCache.size;
}
