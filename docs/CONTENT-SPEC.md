# English Lab 内容契约（文章 JSON）

本文件是文章数据的唯一规格说明。校验器 `scripts/validate-articles.mjs` 是契约的执行者，**必须跑到通过为止**。

## 文件与数量

| 文件 | Level | 篇数 | 词数区间（校验器强制） | 建议目标 |
|---|---|---|---|---|
| `src/data/articles/level1.json` | 1 | 8 | 90–175 | 120–150 |
| `src/data/articles/level2.json` | 2 | 8 | 140–275 | 170–230 |
| `src/data/articles/level3.json` | 3 | 8 | 230–430 | 280–360 |
| `src/data/articles/level4.json` | 4 | 6 | 280–480 | 340–430 |

顶层为**数组**。id 规则：`l{level}-{两位序号}`，如 `l2-03`，全库唯一。

## 结构

```json
[
  {
    "id": "l1-01",
    "title": "The Morning Walk",
    "titleZh": "清晨散步",
    "level": 1,
    "category": "生活",
    "tags": ["习惯", "健康"],
    "paragraphs": [
      {
        "sentences": [
          { "en": "Anna gets up at six every morning.", "zh": "安娜每天早上六点起床。" },
          { "en": "She puts on her shoes and walks to the small park near her home.", "zh": "她穿上鞋，走到家附近的小公园。" }
        ]
      }
    ],
    "keyVocab": [
      { "word": "maintain", "pos": "v.", "gloss": "保持；维持", "note": "后接习惯、关系、状态等抽象名词" }
    ],
    "grammar": [
      {
        "en": "She puts on her shoes and walks to the small park near her home.",
        "main": "She puts on her shoes and walks to the park",
        "subject": "She",
        "predicate": "puts on / walks",
        "object": "her shoes / to the small park",
        "modifiers": "near her home 作后置定语修饰 the small park",
        "logic": "and 连接两个并列谓语，表示先后动作",
        "zh": "她穿上鞋，走到家附近的小公园。"
      }
    ],
    "glossary": {
      "maintain": "v. 保持；维持",
      "lifestyle": "n. 生活方式",
      "healthy": "adj. 健康的"
    },
    "quiz": [
      {
        "id": "l1-01-q1",
        "type": "主旨大意",
        "question": "What is the passage mainly about?",
        "options": ["Anna's morning routine", "Anna's job", "Anna's family", "Anna's holiday"],
        "answer": 0,
        "evidence": "Anna gets up at six every morning.",
        "explain": "全文围绕安娜清晨的固定活动展开，故主旨是她的晨间习惯。",
        "whyWrong": [
          "文中没有提到她的工作内容。",
          "家人只是背景信息，不是主题。",
          "没有涉及假期安排。"
        ]
      }
    ],
    "source": "English Lab 原创内容",
    "license": "CC BY-NC 4.0（本项目原创，可自由用于个人学习）"
  }
]
```

## 硬性规则（校验器会拦）

1. **`grammar[].en` 与 `quiz[].evidence` 必须逐字出现在正文中**（大小写、标点都要一致）。写完请自己核对。
2. 每句必须有中文译文，且译文含中文字符。译文按中文习惯表达，不要逐词硬译。
3. `quiz` 每篇 3–5 题，**题型至少覆盖 3 种**，取值只能是：主旨大意 / 细节理解 / 词义推断 / 作者观点 / 逻辑推断。
4. `options` 恰好 4 项，`answer` 为 0–3 的下标，`whyWrong` 恰好 3 条，**按 3 个错误选项在选项中出现的先后顺序**逐个说明错因。
5. `glossary` 键**必须全小写、用原形**（study 而不是 studies；went 额外补一条 `go`）。值为 `"词性. 中文释义"`。条数：Level 1/2 ≥ 25 条，Level 3/4 ≥ 45 条。覆盖文中所有非最基础的实词。
6. `category` 只能是：生活 / 教育 / 科技 / 经济 / 商业 / 心理 / 社会 / 环境 / 文化 / 历史 / 健康与运动 / 科学。
7. `keyVocab` 3–6 条，词必须真的在正文里出现。
8. **不要提供音标字段**（音标由词典层统一提供，避免编造）。
9. 不使用英文双引号 `"` 作为正文引号，改用 `'` 或全角 `“ ”`，减少 JSON 转义错误。

## 内容质量要求

- 全部为**原创英文**，语言自然、无中式英语，句子之间要有真实逻辑，不能是词汇堆砌。
- 主题要有信息量：讲清一件小事、一个现象或一个观点，读完能学到东西。
- Level 1：高频生活词汇，简单句与常见时态（一般现在时、过去时、将来时、现在进行时）。
- Level 2：四级高频词，常见从句（定语从句、宾语从句、状语从句）、非谓语初步。
- Level 3：复杂句法、抽象话题、观点与论证关系、词义推断空间。
- Level 4：接近考研英语二风格，社会/经济/教育/科技议题，含作者态度、逻辑转折、隐含推断。
- 同一 level 内主题不重复，12 个分类尽量分散。
- 不要出现真实人物负面评价、政治敏感内容；不要复制任何受版权保护的原文。

## 自检命令

```bash
cd "C:/Users/25488/WorkBuddy AI/2026-10-28-22-03-03/english-lab"
node scripts/validate-articles.mjs level1.json
```

必须看到 `✅ 校验通过`。有错误就改到通过为止（警告可接受，但要尽量少）。
