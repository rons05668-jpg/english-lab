import { useSyncExternalStore } from 'react';
import type { AppData } from '../data/types';
import { loadData, saveData, saveSettings } from './storage';

let state: AppData = loadData();
const listeners = new Set<() => void>();
let persistenceError = false;
const persistenceListeners = new Set<() => void>();

export function usePersistenceError(): boolean {
  return useSyncExternalStore(
    (listener) => { persistenceListeners.add(listener); return () => { persistenceListeners.delete(listener); }; },
    () => persistenceError,
    () => false,
  );
}
let timer: ReturnType<typeof setTimeout> | null = null;

function emit(): void {
  listeners.forEach((l) => l());
}

function persistNow(): boolean {
  const saved = saveData(state);
  // AppData 已包含设置；独立设置键是兼容缓存，不决定主数据的保存结果。
  if (saved) saveSettings(state.settings);
  persistenceError = !saved;
  persistenceListeners.forEach((listener) => listener());
  return saved;
}

function schedule(): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    persistNow();
  }, 240);
}

export function getData(): AppData {
  return state;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setData(next: AppData, immediate = false): boolean {
  state = next;
  emit();
  if (immediate) return persistNow();
  schedule();
  return false; // 已安排写入，不等于已落盘。
}

/** 以纯函数方式更新：mutator 返回新的 AppData */
export function mutate(mutator: (data: AppData) => AppData): void {
  setData(mutator(state));
}

/** 立即落盘（用于离开页面前） */
export function flush(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  persistNow();
}

export function useData(): AppData {
  return useSyncExternalStore(subscribe, getData, getData);
}

export function useSettings() {
  return useData().settings;
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}
