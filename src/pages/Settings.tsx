import { useRef, useState } from 'react';
import { useData, getData, setData } from '../lib/store';
import { clearAll, exportJSON, importJSON, storageUsage } from '../lib/storage';
import { updateSettings } from '../lib/db';
import { lexiconSize, glossarySize } from '../lib/dict';
import offlineMeta from '../data/ecdict-meta.json';
import { ARTICLES, TOTAL_WORDS } from '../data/articles';
import { accentLabel, hasVoiceFor, speak, speechSupported } from '../lib/speech';
import { Badge, Button, Card, Segmented, Switch, toast, useConfirm } from '../components/ui';
import { Icon } from '../components/icons';

export function Settings() {
  const data = useData();
  const s = data.settings;
  const { confirm, dialog } = useConfirm();
  const fileRef = useRef<HTMLInputElement>(null);
  const [usage, setUsage] = useState(() => storageUsage());

  const patch = (p: Partial<typeof s>) => {
    setData(updateSettings(getData(), p), true);
    setUsage(storageUsage());
  };

  const doExport = () => {
    const json = exportJSON(getData());
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `english-lab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('已导出学习数据', 'success');
  };

  const doImport = async (file: File) => {
    const text = await file.text();
    const res = importJSON(text);
    if (!res.ok) {
      toast(`导入失败：${res.error}`, 'error');
      return;
    }
    const ok = await confirm({
      title: '导入学习数据？',
      desc: '导入会覆盖当前设备上的全部学习记录（生词、复习、答题、阅读进度）。建议先导出备份。',
      confirmText: '覆盖导入',
      danger: true,
    });
    if (!ok) return;
    setData(res.data, true);
    setUsage(storageUsage());
    toast('导入完成', 'success');
  };

  const doReset = async () => {
    const ok = await confirm({
      title: '清空所有学习数据？',
      desc: '生词本、复习记录、答题记录、阅读进度与设置都会被删除，且无法恢复。',
      confirmText: '全部清空',
      danger: true,
    });
    if (!ok) return;
    clearAll();
    location.reload();
  };

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page__title">设置</h1>
        <p className="page__desc">所有设置保存在本机浏览器，不需要账号，也不会上传。</p>
      </div>

      <Card className="set-group">
        <div className="set-group__title">外观</div>
        <div className="set-row">
          <div className="set-row__label">
            界面主题
            <div className="set-row__desc">跟随系统时会自动响应系统的浅色 / 深色切换</div>
          </div>
          <div className="set-row__control">
            <Segmented
              ariaLabel="界面主题"
              value={s.theme}
              onChange={(v) => patch({ theme: v })}
              options={[
                { value: 'light', label: '浅色' },
                { value: 'dark', label: '深色' },
                { value: 'system', label: '自动' },
              ]}
            />
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            减少动态效果
            <div className="set-row__desc">关闭过渡与缩放动画。系统已开启「减少动态效果」时会自动生效。</div>
          </div>
          <div className="set-row__control">
            <Badge tone="accent">
              {typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? '系统已开启'
                : '跟随系统'}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="set-group">
        <div className="set-group__title">阅读</div>
        <div className="set-row">
          <div className="set-row__label">
            阅读主题
            <div className="set-row__desc">只影响正文区域，不影响界面</div>
          </div>
          <div className="set-row__control">
            <div className="set-swatches">
              {(
                [
                  { v: 'paper', label: '纸张' },
                  { v: 'plain', label: '纯白' },
                  { v: 'sepia', label: '护眼' },
                  { v: 'night', label: '夜间' },
                ] as const
              ).map((t) => (
                <button
                  key={t.v}
                  className={`swatch swatch--${t.v}${s.readingTheme === t.v ? ' swatch--active' : ''}`}
                  aria-label={`阅读主题 ${t.label}`}
                  aria-pressed={s.readingTheme === t.v}
                  onClick={() => patch({ readingTheme: t.v })}
                  title={t.label}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            正文字体
            <div className="set-row__desc">衬线体更接近纸质书；无衬线体在小屏上更清晰</div>
          </div>
          <div className="set-row__control">
            <Segmented
              ariaLabel="正文字体"
              value={s.readingFont}
              onChange={(v) => patch({ readingFont: v })}
              options={[
                { value: 'serif', label: '衬线' },
                { value: 'sans', label: '无衬线' },
              ]}
            />
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            字号
            <div className="set-row__desc">{Math.round(s.fontScale * 100)}%</div>
          </div>
          <div className="set-row__control">
            <input
              type="range"
              min={0.85}
              max={1.5}
              step={0.05}
              value={s.fontScale}
              onChange={(e) => patch({ fontScale: Number(e.target.value) })}
              aria-label="正文字号"
            />
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            行距
            <div className="set-row__desc">{s.lineHeight.toFixed(1)} 倍</div>
          </div>
          <div className="set-row__control">
            <input
              type="range"
              min={1.4}
              max={2.2}
              step={0.1}
              value={s.lineHeight}
              onChange={(e) => patch({ lineHeight: Number(e.target.value) })}
              aria-label="行距"
            />
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            译文显示
            <div className="set-row__desc">默认不显示中文，点击句子才展开，避免长期依赖逐句翻译</div>
          </div>
          <div className="set-row__control">
            <Segmented
              ariaLabel="译文显示方式"
              value={s.translationMode}
              onChange={(v) => patch({ translationMode: v })}
              options={[
                { value: 'hidden', label: '不显示' },
                { value: 'tap', label: '点击展开' },
                { value: 'always', label: '始终显示' },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card className="set-group">
        <div className="set-group__title">生词标记</div>
        <div className="set-row">
          <div className="set-row__label">
            显示生词标记
            <div className="set-row__desc">关闭后正文恢复纯文本，收藏记录不受影响</div>
          </div>
          <div className="set-row__control">
            <Switch checked={s.showVocabMarks} onChange={(v) => patch({ showVocabMarks: v })} label="显示生词标记" />
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            标记样式
            <div className="set-row__desc">未掌握的词会被标记；已掌握的词使用更弱的标记</div>
          </div>
          <div className="set-row__control">
            <Segmented
              ariaLabel="标记样式"
              value={s.markStyle}
              onChange={(v) => patch({ markStyle: v })}
              options={[
                { value: 'underline', label: '下划线' },
                { value: 'highlight', label: '浅色底' },
                { value: 'dot', label: '点线' },
              ]}
            />
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            点击即收藏
            <div className="set-row__desc">产品设计如此：主动点击一个词，就视为你想学它。此开关不可关闭。</div>
          </div>
          <div className="set-row__control">
            <Switch checked onChange={() => toast('点击即收藏是核心设计，无法关闭', 'error')} label="点击即收藏" />
          </div>
        </div>
      </Card>

      <Card className="set-group">
        <div className="set-group__title">学习</div>
        <div className="set-row">
          <div className="set-row__label">
            每日阅读目标
            <div className="set-row__desc">按「今日完成阅读的篇数」计算</div>
          </div>
          <div className="set-row__control">
            <select className="select" value={s.dailyGoal} onChange={(e) => patch({ dailyGoal: Number(e.target.value) })} aria-label="每日阅读目标">
              {[1, 2, 3, 5].map((n) => (
                <option key={n} value={n}>
                  {n} 篇
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            朗读口音
            <div className="set-row__desc">
              {speechSupported()
                ? hasVoiceFor(s.speechVoice)
                  ? `当前系统可用：${accentLabel(s.speechVoice)}语音`
                  : '当前系统没有该口音的语音包'
                : '当前浏览器不支持语音朗读'}
            </div>
          </div>
          <div className="set-row__control" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Segmented
              ariaLabel="朗读口音"
              value={s.speechVoice}
              onChange={(v) => patch({ speechVoice: v })}
              options={[
                { value: 'uk', label: '英式' },
                { value: 'us', label: '美式' },
              ]}
            />
            <Button
              size="sm"
              variant="ghost"
              icon="volume"
              onClick={() => speak('This is how the article will sound.', { accent: s.speechVoice, rate: s.speechRate })}
            >
              试听
            </Button>
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            朗读语速
            <div className="set-row__desc">{s.speechRate.toFixed(2)} 倍</div>
          </div>
          <div className="set-row__control">
            <input
              type="range"
              min={0.6}
              max={1.4}
              step={0.05}
              value={s.speechRate}
              onChange={(e) => patch({ speechRate: Number(e.target.value) })}
              aria-label="朗读语速"
            />
          </div>
        </div>
      </Card>

      <Card className="set-group">
        <div className="set-group__title">词典</div>
        <div className="set-row">
          <div className="set-row__label">
            在线词典补充查询
            <div className="set-row__desc">
              仅当本地词典与文章标注都没有收录该词时才会联网（dictionaryapi.dev，免费公开接口，无需密钥）。
              国内网络可能访问不稳定，失败时会明确提示，不会编造释义。
            </div>
          </div>
          <div className="set-row__control">
            <Switch checked={s.onlineDictionary} onChange={(v) => patch({ onlineDictionary: v })} label="在线词典补充查询" />
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            本地词典规模
            <div className="set-row__desc">人工校订核心词条 + 文章标注释义索引</div>
          </div>
          <div className="set-row__control">
            <span className="mono hint">
              {lexiconSize()} 条精讲 / {offlineMeta.entries.toLocaleString()} 条扩展 / {glossarySize()} 条文章索引
            </span>
          </div>
        </div>
      </Card>

      <Card className="set-group">
        <div className="set-group__title">数据</div>
        <div className="set-row">
          <div className="set-row__label">
            本地存储占用
            <div className="set-row__desc">
              {(usage.bytes / 1024).toFixed(1)} KB / {(usage.limitBytes / 1024 / 1024).toFixed(0)} MB（
              {Math.round(usage.ratio * 100)}%）
            </div>
          </div>
          <div className="set-row__control">
            <Button size="sm" variant="ghost" icon="refresh" onClick={() => setUsage(storageUsage())}>
              刷新
            </Button>
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            导出 / 导入
            <div className="set-row__desc">导出为 JSON，可用于备份或迁移到另一台设备</div>
          </div>
          <div className="set-row__control" style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="secondary" icon="download" onClick={doExport}>
              导出
            </Button>
            <Button size="sm" variant="secondary" icon="upload" onClick={() => fileRef.current?.click()}>
              导入
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void doImport(f);
                e.target.value = '';
              }}
            />
          </div>
        </div>
        <div className="set-row set-danger">
          <div className="set-row__label">
            清空所有数据
            <div className="set-row__desc">不可恢复。建议先导出备份。</div>
          </div>
          <div className="set-row__control">
            <Button size="sm" variant="danger" icon="trash" onClick={() => void doReset()}>
              清空
            </Button>
          </div>
        </div>
      </Card>

      <Card className="set-group">
        <div className="set-group__title">关于</div>
        <div className="set-row">
          <div className="set-row__label">
            内容来源
            <div className="set-row__desc">
              {ARTICLES.length} 篇原创英文短文，共约 {TOTAL_WORDS.toLocaleString()} 词。版权状态：English Lab 原创，CC BY-NC 4.0。
              未使用任何考研真题、商业教材或受版权保护的原文。
            </div>
          </div>
          <div className="set-row__control">
            <Badge tone="green">原创</Badge>
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            词典数据
            <div className="set-row__desc">
              保留原有核心词典，新增 ECDICT 开源英汉词库 {offlineMeta.entries.toLocaleString()} 词条（MIT，非出版社权威词典，未经逐条人工校订）。文章释义由内容作者标注；可选在线查询使用 dictionaryapi.dev。
              音标缺失时显示「未收录」，不做猜测。
            </div>
          </div>
          <div className="set-row__control">
            <Icon name="shield" size={18} />
          </div>
        </div>
        <div className="set-row">
          <div className="set-row__label">
            版本
            <div className="set-row__desc">English Lab 1.0.0 · 单用户本地部署</div>
          </div>
          <div className="set-row__control">
            <span className="mono hint">v1.0.0</span>
          </div>
        </div>
      </Card>
      {dialog}
    </div>
  );
}
