import { beforeEach, describe, expect, it } from 'vitest';
import { __setStorageForTests, createEmptyData, DATA_KEY, loadData } from './storage';
import { flush, setData } from './store';

describe('学习记录落盘结果', () => {
  let values: Map<string, string>;
  let blocked: boolean;
  beforeEach(() => {
    values = new Map();
    blocked = false;
    __setStorageForTests({
      get length() { return values.size; },
      clear: () => values.clear(),
      key: (index) => [...values.keys()][index] ?? null,
      getItem: (key) => values.get(key) ?? null,
      removeItem: (key) => { values.delete(key); },
      setItem: (key, value) => {
        if (blocked) throw new DOMException('Storage full', 'QuotaExceededError');
        values.set(key, value);
      },
    });
  });

  it('立即保存成功后，可从持久化存储恢复设置', () => {
    const data = createEmptyData();
    data.settings.fontScale = 1.25;
    expect(setData(data, true)).toBe(true);
    expect(loadData().settings.fontScale).toBe(1.25);
  });

  it('配额不足返回失败，恢复后重试会保存同一份记录', () => {
    const data = createEmptyData();
    data.recent = ['l1-01'];
    blocked = true;
    expect(setData(data, true)).toBe(false);
    expect(values.has(DATA_KEY)).toBe(false);
    blocked = false;
    flush();
    expect(loadData().recent).toEqual(['l1-01']);
  });

  it('延迟保存不能提前报告落盘成功，离开页面前 flush 能落盘', () => {
    expect(setData(createEmptyData())).toBe(false);
    expect(values.has(DATA_KEY)).toBe(false);
    flush();
    expect(values.has(DATA_KEY)).toBe(true);
  });
});
