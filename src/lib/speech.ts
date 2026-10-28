/** 语音朗读：使用浏览器原生 SpeechSynthesis，不依赖任何外部服务 */

export type Accent = 'uk' | 'us';

const LANG: Record<Accent, string> = { uk: 'en-GB', us: 'en-US' };

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export function loadVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length) cachedVoices = v;
  return cachedVoices;
}

export function pickVoice(accent: Accent): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  const lang = LANG[accent];
  const exact = voices.find((v) => v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase());
  if (exact) return exact;
  const loose = voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
  return loose ?? null;
}

export function hasVoiceFor(accent: Accent): boolean {
  return pickVoice(accent) !== null;
}

let current: SpeechSynthesisUtterance | null = null;

export interface SpeakOptions {
  accent?: Accent;
  rate?: number;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export function speak(text: string, opts: SpeakOptions = {}): boolean {
  if (!speechSupported()) {
    opts.onError?.('当前浏览器不支持语音朗读');
    return false;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const accent = opts.accent ?? 'us';
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = LANG[accent];
  utter.rate = Math.min(1.6, Math.max(0.5, opts.rate ?? 1));
  const voice = pickVoice(accent);
  if (voice) utter.voice = voice;
  utter.onend = () => {
    current = null;
    opts.onEnd?.();
  };
  utter.onerror = (e) => {
    current = null;
    if (e.error !== 'interrupted' && e.error !== 'canceled') opts.onError?.(`朗读失败：${e.error}`);
  };
  current = utter;
  synth.speak(utter);
  return true;
}

export function stopSpeaking(): void {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
  current = null;
}

export function isSpeaking(): boolean {
  return speechSupported() && window.speechSynthesis.speaking;
}

export function speakWord(word: string, accent: Accent, rate = 0.9): boolean {
  return speak(word, { accent, rate });
}

export function accentLabel(accent: Accent): string {
  return accent === 'uk' ? '英式' : '美式';
}

/** 组件卸载时兜底停止朗读 */
export function useSpeechCleanup(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeunload', stopSpeaking);
}

export { current as _currentUtterance };
