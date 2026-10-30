/**
 * 带 gzip 自解压的 JSON 请求工具
 *
 * 设计意图：
 *   词典分片以静态 JSON 放在 public/dict/（约 2,641 个文件，单片 ≤60KB）。
 *   托管平台不支持传输层 gzip 压缩，所以在构建期额外产出 `${url}.gz` 副本。
 *   浏览器支持 DecompressionStream 时，直接下载体积更小的 .gz 并在前端解压，
 *   把热门分片的传输量压到 1/5 左右；不支持时行为与普通 fetch 完全一致。
 *
 * 降级策略（任何一步出问题都退回请求原始 `${url}`）：
 *   1. 环境没有 DecompressionStream（Safari < 16.4、部分内嵌 WebView）
 *   2. `${url}.gz` 返回非 2xx（部署漏传 .gz、CDN 未同步）
 *   3. 解压抛异常（.gz 内容损坏，或被 SPA 的 index.html 兜底成 200）
 *   4. 解压成功但 JSON.parse 失败（产物损坏）
 *   超时属于「网络本身不可用」，不再回退——回退只会让用户多等一个超时周期。
 */

/** 默认请求超时，与分片加载层的预期一致 */
const DEFAULT_TIMEOUT_MS = 10_000;

/** DecompressionStream 支持情况只探测一次，结果缓存 */
let supportCache: boolean | null = null;

/** 浏览器是否支持 DecompressionStream */
export function gzipSupported(): boolean {
  if (supportCache === null) {
    // 用 typeof 而不是直接读全局，避免未声明的环境下抛 ReferenceError
    supportCache = typeof DecompressionStream === 'function';
  }
  return supportCache;
}

/** 超时错误，便于调用方用 instanceof 区分「慢」与「错」 */
export class FetchTimeoutError extends Error {
  readonly url: string;
  readonly timeoutMs: number;

  constructor(url: string, timeoutMs: number) {
    super(`请求超时（${timeoutMs}ms）：${url}`);
    this.name = 'FetchTimeoutError';
    this.url = url;
    this.timeoutMs = timeoutMs;
  }
}

/** 非 2xx 响应，message 里带上 URL 和状态码，便于定位是漏了 .gz 还是真的挂了 */
class HttpStatusError extends Error {
  readonly status: number;

  constructor(url: string, status: number) {
    super(`请求失败（HTTP ${status}）：${url}`);
    this.name = 'HttpStatusError';
    this.status = status;
  }
}

/**
 * 统一挂超时：计时器覆盖到响应体读完为止，
 * abort 后转成可识别的 FetchTimeoutError。
 */
async function withTimeout<T>(
  url: string,
  timeoutMs: number,
  run: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await run(controller.signal);
  } catch (error: unknown) {
    if (controller.signal.aborted) throw new FetchTimeoutError(url, timeoutMs);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/** 解析 JSON 文本；保持 unknown 出口，避免 any 扩散到调用方 */
function parseJson<T>(text: string, url: string): T {
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed as T;
  } catch {
    throw new Error(`JSON 解析失败：${url}`);
  }
}

/** 直接请求原始 JSON（无压缩，作为基准路径与降级目标） */
function fetchPlain<T>(url: string, timeoutMs: number): Promise<T> {
  return withTimeout(url, timeoutMs, async (signal) => {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new HttpStatusError(url, res.status);
    return parseJson<T>(await res.text(), url);
  });
}

/** 请求 `${url}.gz` 并流式解压，任何环节失败都抛错交给上层回退 */
function fetchGzipped<T>(url: string, timeoutMs: number): Promise<T> {
  const gzUrl = `${url}.gz`;
  return withTimeout(gzUrl, timeoutMs, async (signal) => {
    const res = await fetch(gzUrl, { signal });
    if (!res.ok) throw new HttpStatusError(gzUrl, res.status);
    if (!res.body) throw new Error(`响应体为空：${gzUrl}`);

    /**
     * 静态服务器（vite preview、nginx 等）识别到 .gz 后缀时会自动加上
     * Content-Encoding: gzip，此时浏览器已经把响应体解压过一次，
     * res.body 就是明文 JSON。再套一层 DecompressionStream 会直接抛错，
     * 白白多请求一次原始 .json。这里必须先看响应头再决定走哪条路。
     */
    const encoding = (res.headers.get('content-encoding') ?? '').toLowerCase();
    if (encoding.includes('gzip')) {
      return parseJson<T>(await res.text(), gzUrl);
    }

    const stream = res.body.pipeThrough(new DecompressionStream('gzip'));
    const text = await new Response(stream).text();
    return parseJson<T>(text, gzUrl);
  });
}

/** 在途请求表：同一 URL 的并发请求共享同一个 Promise，避免重复下载 */
const inflight = new Map<string, Promise<unknown>>();

/**
 * 请求 JSON。优先取 `${url}.gz` 并自解压；不支持或失败时回退到 `${url}`。
 * @param url 不含 .gz 后缀的原始 JSON 地址，如 '/dict/ab.json'
 */
export function fetchJsonMaybeGzip<T>(url: string, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<T> {
  const existing = inflight.get(url);
  if (existing) return existing as Promise<T>;

  const task = (async (): Promise<T> => {
    if (gzipSupported()) {
      try {
        return await fetchGzipped<T>(url, timeoutMs);
      } catch (error: unknown) {
        // 超时说明网络本身有问题，回退只会再等一轮，直接上报
        if (error instanceof FetchTimeoutError) throw error;
        // 其余情况（无 .gz / 解压失败 / 产物损坏）静默降级
      }
    }
    return fetchPlain<T>(url, timeoutMs);
  })().catch((error: unknown) => {
    // 失败后清掉在途记录，下一次调用可以重新尝试
    inflight.delete(url);
    throw error;
  });

  inflight.set(url, task);
  return task;
}
