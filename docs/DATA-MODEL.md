# 数据模型与迁移

## 1. 存储布局

| key | 内容 | 写入时机 |
|---|---|---|
| `english-lab:data` | 全部学习数据（`AppData`） | 变更后 240ms 防抖；`pagehide` 强制写入 |
| `english-lab:settings` | 仅 `UserSettings` 的副本 | 与 data 同步写入 |
| `english-lab:dict-cache` | 在线词典查询缓存（≤ 400 条，30 天） | 在线查询成功后 |
| `english-lab:ui` | 侧栏折叠状态 | 切换时 |

`english-lab:settings` 单独存一份的原因：`index.html` 里的内联脚本要在 React 挂载前读取主题，避免深色模式闪白。它只是 `AppData.settings` 的冗余副本，**以 `AppData.settings` 为准**。

## 2. AppData 结构

```ts
interface AppData {
  version: number;                    // 当前 1
  vocabEntries: VocabularyEntry[];    // 词条，一个 lemma 一条
  occurrences: VocabularyOccurrence[];// 词条在具体文章中的出现
  reviews: ReviewLog[];               // 复习流水
  quizAttempts: QuizAttempt[];        // 答题记录
  progress: Record<articleId, ReadingProgress>;
  favorites: string[];                // 收藏的文章
  recent: string[];                   // 最近阅读（去重、置顶、上限 20）
  settings: UserSettings;
  activeDays: string[];               // 'YYYY-MM-DD'，用于连续天数
}
```

### VocabularyEntry（词条）

```ts
{
  id, lemma, partOfSpeech,
  phonetics: { uk?, us? },
  definitions: DictionarySense[],
  contextualMeaning?: string,
  masteryStatus: 'new' | 'learning' | 'reviewing' | 'mastered',
  masteredBy?: 'user' | 'srs',
  createdAt, updatedAt, lastReviewedAt?, nextReviewAt?,
  srs: { reps, streak, ease, intervalDays, lapses },
  pendingGloss?: boolean          // 词典未收录，释义待补充
}
```

### VocabularyOccurrence（上下文）

```ts
{
  id, vocabularyEntryId, articleId, articleTitle,
  surfaceForm,        // 用户实际点击的词形，如 studies
  sentence,           // 所在原句
  contextualMeaning?, encounteredAt
}
```

## 3. 不变量（由 `lib/db.ts` 保证并被单测覆盖）

1. **一个 lemma 只有一条 VocabularyEntry**。`addWord` 先按 lemma 查，命中则复用。
2. **上下文去重键 = `(vocabularyEntryId, articleId, 归一化句子)`**。同一句重复点击不新增记录；同文章不同句允许新增。
3. **低质量数据不覆盖高质量数据**。已有词条有释义时，新的空释义不会把它清空；反之 `pendingGloss` 的词条会用新释义补全并清除标记。
4. **删除词条级联删除**其 occurrences 与 reviews。
5. **所有写操作是纯函数**：输入 `AppData`，返回新 `AppData`，入参不被修改（单测用快照深比较验证）。
6. **`nextReviewAt` 只由复习算法写入**，`addWord` 不设置它——新词进「待复习」队列靠 `(nextReviewAt ?? 0) <= now` 判定。

## 4. 迁移策略

`src/lib/storage.ts`：

```ts
export const CURRENT_VERSION = 1;
export function migrate(raw: unknown): AppData
```

规则：

- 逐字段白名单重建，未知字段丢弃。
- 数组字段非数组 → `[]`；数字字段 `NaN`/越界 → 默认值并 clamp；枚举值非法 → 默认值。
- `settings` 缺字段用 `DEFAULT_SETTINGS` 补齐。
- `version` 高于 `CURRENT_VERSION` 时不崩溃，尽力读取（只保证不丢数据，不保证语义正确）。
- 读取或 `JSON.parse` 失败 → 返回 `createEmptyData()`，应用照常启动。

**加版本时的操作**：`CURRENT_VERSION` +1，在 `migrate` 里加 `if (v < 2) { ... }` 分支，并补一个「旧结构 → 新结构」的单测用例。

## 5. 容量

localStorage 上限约 5 MB（按 UTF-16 计）。实测数据规模：

| 场景 | 体积 |
|---|---|
| 空数据 | ~0.6 KB |
| 30 篇全部读完 + 500 生词 + 2000 条上下文 | ~600 KB |
| 理论可承载 | 数千生词 + 上万条上下文 |

设置页实时显示占用率。写入失败（`QuotaExceededError`）时 `saveData` 返回 `false` 而不抛错，界面继续可用，只是不落盘。

## 6. 多用户扩展（未启用）

当前是单用户。要支持登录与云同步，模型需要加两个维度：`userId` 与 `updatedAt` 的向量时钟。参考 schema 见 `docs/future-schema.prisma`（**仅作设计参考，未接入构建**）。

关键点：

- `vocab_entries` 唯一约束 `(user_id, lemma)`——把当前的「按 lemma 去重」下沉到数据库层。
- `vocab_occurrences` 唯一约束 `(entry_id, article_id, sentence_hash)`——对应当前的内存去重键。
- `review_logs` 只追加不更新，天然适合作为事件流。
- 同步冲突策略：词条以 `updatedAt` 较新者为准；occurrences / reviews 是追加型，直接并集去重。
