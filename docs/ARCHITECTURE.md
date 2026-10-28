# 架构说明

## 1. 整体形态

纯前端单页应用，无服务端。构建产物是静态文件，部署只需一个静态托管。

```
浏览器
 ├─ React 视图层（pages / components）
 ├─ 领域层（lib/dict, lemma, srs, stats, text）
 ├─ 数据仓库层（lib/db：纯函数，输入输出都是 AppData）
 └─ 持久化层（lib/storage：localStorage + 版本迁移）
        ↕
   localStorage: english-lab:data / english-lab:settings / english-lab:dict-cache
```

分层的核心约束：**`lib/db` 不依赖 React，全部是 `(data, ...args) => newData` 的纯函数**。这让「点击单词自动收藏」这类核心逻辑可以直接用 vitest 断言，不需要渲染组件。

## 2. 关键设计决策

### 2.1 为什么是纯前端 + localStorage

单用户、数据量小、要求离线可用。引入 Postgres + ORM 会让「打开就能用」变成「先起三个服务」。代价是没有跨设备同步——用导出/导入 JSON 兜底，并保留了迁移到服务端的路径（见 `DATA-MODEL.md`）。

### 2.2 状态管理：useSyncExternalStore

`src/lib/store.ts` 只有一个模块级 `AppData` 和一组订阅者。写入走 `mutate(fn)`，`fn` 返回新对象（结构化不可变），然后 240ms 防抖落盘；`pagehide` / `visibilitychange` 时强制 flush，避免关页面丢数据。

不用 Redux/Zustand 的理由：单一数据源、无异步 action、无中间件需求，60 行够了。

### 2.3 阅读器的渲染管线

文章正文 424 句、7,028 词。逐词渲染成 `<span>` 是必要的（要支持点击、标记、悬停），但每次渲染都做词形还原会卡。做法：

1. 文章加载时 `useMemo` 构建 `lemmaMap: Map<surface, lemma>`，一篇文章内每个词形只还原一次。
2. 生词索引 `vocabIndex: Map<lemma, entry>` 随 `data.vocabEntries` 变化重建，O(n)。
3. 单词 span 的 class 计算是纯字符串拼接，无正则。
4. 阅读进度用 `requestAnimationFrame` 节流的滚动监听 + 900ms 写入节流，避免滚动时反复写 localStorage。

实测 335 词的文章滚动无掉帧（headless 环境，无 GPU 加速）。

### 2.4 单词浮层的定位

`Popover` 组件在 `useLayoutEffect` 里测量自身高度后决定放上方还是下方，并做视口内收敛；同时挂 `ResizeObserver`——因为释义是异步查的，内容会在打开后变高，初次测量不可靠。这是「浮层溢出屏幕」类 bug 的根因，必须用 ResizeObserver 兜住。

浮层刻意**不使用 `backdrop-filter`**：该属性叠加动画层时，在无 GPU 合成的环境里会导致背景层不绘制，正文透过来。玻璃质感保留在侧栏、顶栏、底栏这些「背景本身是纯色」的位置。

### 2.5 词典的三级来源与「可信度分级」

见 README。架构上的要点是：`lookupWord()` 返回的 `LookupResult` 里带 `source` 与 `contextual.confidence`，UI 必须把它们显示出来。**不允许把推测包装成确定结论**，这是产品约束，不是可选装饰。

### 2.6 词形还原的歧义处理

`lemmatize()` 返回 `{ lemma, candidates, confident, rule }`：

- 不规则表命中 → 确定
- 词形本身就是已知原形 → 确定
- 规则派生，只保留「在已知词表中存在」的候选
- 多个候选都成立（如 `leaves` → `leaf` / `leave`）→ `confident: false`，`candidates` 全部返回，UI 提示「该词形可能对应多个原形」

已知词表 = 核心词典键 + 文章 glossary 键 + 基础词表。**基础词表里的变形词会被剔除**（`studies` / `went` / `used`…），否则 identity 规则会直接返回变形本身，导致 `studies` 无法归到 `study`。这个坑在验收测试场景 C 里暴露过，修复方式见 `dict.ts` 的 `buildBaseKnown()`。

### 2.7 无障碍与动效

- 单词 span 用 `role="button"` + `tabIndex={-1}`：可点击、可被屏幕阅读器识别，但不占用 Tab 序列（400 个 Tab 停靠点会让键盘用户无法导航）。
- 句子是 `tabIndex={0}`，回车展开译文；另有段落级「全段译文」按钮作为可发现的主路径。
- 查词框、设置项、弹窗都走原生控件，保留焦点环。
- 全局 `prefers-reduced-motion` 与手动开关都归零动画时长。
- 颜色全部走 CSS 变量，深浅色同一套语义，正文对比度按 WCAG AA 校验（正文 `#1D1D1F` on `#FDFCFA` ≈ 15.8:1）。

## 3. 性能

| 项 | 数值 |
|---|---|
| 生产构建 | 1.7 s |
| JS 产物 | 680 KB（gzip 293 KB），其中文章与词典数据约 480 KB |
| CSS 产物 | 70 KB（gzip 12.6 KB） |
| 首屏可交互 | 本地 < 300 ms |

如果文章扩到数百篇，应当把 JSON 拆成按需加载的 chunk（`import()` + 动态路由）。当前 30 篇一次性加载换来的是「搜索/筛选瞬时响应」，这个取舍在内容规模扩大后需要重新评估。

## 4. 安全

- 无服务端，无密钥。`.env.example` 里的变量都是公开的前端配置，已在注释中写明不能放密钥。
- 所有渲染走 React 的文本插值，没有 `dangerouslySetInnerHTML`，文章内容无法注入脚本。
- 导入 JSON 走 `migrate()` 白名单式重建：只读取已知字段，未知字段丢弃，类型错误回落默认值。
- 在线词典请求只发单词本身，不发送任何用户学习数据。

## 5. 未来接入服务端时的改动面

1. `lib/db` 的纯函数改成调用 API（函数签名不变，`data` 参数改为服务端返回）。
2. `lib/storage` 换成 fetch + 乐观更新缓存。
3. 新增 `userId` 维度：`AppData` 已经是「单用户全量数据」的形态，加一层 `byUser` 即可。
4. 词典代理上服务端，解决国内访问与密钥问题。

预留位置在 `DATA-MODEL.md` 的「多用户扩展」一节。
