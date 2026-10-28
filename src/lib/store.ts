import { useSyncExternalStore } from 'react';
import type { AppData } from '../data/types';
import { loadData, saveData, saveSettings } from './storage';

let state: AppData = loadData();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | null = null;

function emit(): void {
  listeners.forEach((l) => l());
}

function persistNow(): void {
  saveData(state);
  saveSettings(state.settings);
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

export function setData(next: AppData, immediate = false): void {
  state = next;
  emit();
  if (immediate) persistNow();
  else schedule();
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
