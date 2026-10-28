import type { DictionarySense } from '../data/types';

interface OfflineData { entries: Record<string, string[]>; forms: Record<string, string[]> }
const shardLoaders = import.meta.glob<{ default: OfflineData }>('../data/ecdict/*.json');
const shardKeys = Object.keys(shardLoaders).map((path) => path.split('/').at(-1)!.replace('.json', ''));
const loaded = new Map<string, Promise<OfflineData>>();

export function loadOfflineDictionary(prefix?: string): Promise<OfflineData> {
  if (prefix === undefined) {
    return Promise.all(shardKeys.map(loadOfflineDictionary)).then((shards) => ({
      entries: Object.assign({}, ...shards.map((shard) => shard.entries)),
      forms: Object.assign({}, ...shards.map((shard) => shard.forms)),
    }));
  }
  const key = prefix.toLowerCase().slice(0, 2).padEnd(2, '_');
  let pending = loaded.get(key);
  if (!pending) {
    const loader = shardLoaders[`../data/ecdict/${key}.json`];
    pending = loader ? loader().then((module) => module.default).catch((error: unknown) => {
      loaded.delete(key);
      throw error;
    }) : Promise.resolve({ entries: {}, forms: {} });
    loaded.set(key, pending);
  }
  return pending;
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
