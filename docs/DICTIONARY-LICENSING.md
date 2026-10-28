# English Lab 权威英汉词典授权调研

核查日期：2026-10-28。依据出版社官方网站与官方开发者页面；未联系销售、未申请账户、未取得授权或报价。

## 建议

优先询问剑桥的 **Advanced Learner’s Dictionary English–Simplified Chinese 离线数据许可**，同时询问 Oxford Languages 的 **English (British) → Chinese (Simplified) semi-bilingual dataset**。这是根据 English Lab 需要英文解释、中文辅助、例句和阅读查词作出的产品适配建议，不代表出版社已同意提供完整词库。

“完整”必须限定为合同中指定版本和字段的完整数据包，不代表包含所有英语单词、所有旗下辞典或无限期更新。

| 来源 | 官方可确认的产品与渠道 | 整库/离线条件 | 价格与待确认事项 |
| --- | --- | --- | --- |
| Cambridge | 开发者中心列有简体、繁体中文的 semi-bilingual 学习词典，并说明可洽谈特定词典的 offline licenses | 官方 FAQ 说明存储/离线用途须另行协商许可；不能从普通 API 权限推定整库保存权 | 授权表单说明按数据集与用途报价，未发现整库公开定价；需确认版本、字段、可用地区、个人开发者是否接受 |
| Oxford Languages | 官方数据目录明确列出简体中文与英式英语双向数据集，以及英式英语到简体中文的 semi-bilingual 数据集 | 可询问 bulk dataset；API FAQ 明确缓存、保存和离线使用仅限 Enterprise license。Enterprise 资格本身也不等于自动取得无限整库分发权 | 定制范围需销售确认；需确认该数据集是否就是所需辞典版本，不能把 Oxford Languages、OALD 和 OED 当成同一产品 |
| Collins | 官方 API 提供单语、双语和学习词典，包含释义、翻译、例句、短语和音频等 | 本次仅确认 API 渠道，未确认公开的整库离线许可。需额外询问，不能用逐词调用拼装整库 | 官网页面列出双语 API 每月不超过 5,000 次免费，5,001–30,000 次 £75/月加 VAT；这是 API 调用价格，不是英汉整库报价，也不保证具体产品获批 |

## 官方入口

- 剑桥数据许可：[License our data](https://dictionary.cambridge.org/license.html)
- 剑桥开发者中心：[产品与离线许可说明](https://dictionary-api.thinkup.io/)
- 剑桥授权申请：[Dictionary Data Licensing and Permissions](https://dev.eim-ciip-cambridge.org/apply)
- 剑桥 FAQ：[离线和存储许可](https://dev.eim-ciip-cambridge.org/api/faq)
- 牛津：[Dictionary Language Datasets](https://languages.oup.com/products/dictionary-language-datasets/)
- 牛津：[缓存与离线使用 FAQ](https://developer.oxforddictionaries.com/faq)
- 牛津：[官方联系表单](https://languages.oup.com/contact/)
- 柯林斯：[API 产品、价格及申请入口](https://www.collinsdictionary.com/collins-api)

部分剑桥及 Collins 博客页面直接打开返回访问限制或超时，相关信息来自搜索服务返回的这些官方页面索引摘要；牛津数据目录与 FAQ 已直接读取。签约前应取得销售人员的书面确认及完整合同，不能以网页摘要替代许可文本。

## 询价应包含的具体使用需求

1. English Lab 是中国英语学习者的阅读网站，当前为个人开发与个人学习阶段；未来若增加用户或商业用途，另行确认范围。
2. 要求整包数据交付或明确允许的批量获取方式，以及服务端数据库持久化、备份和更新；不要仅询问 API key。
3. 需要词头、词形、词性、简体中文译义、英文解释、英美 IPA、例句和例句译文。音频、搭配、短语、语域标签是否包含，请逐项列明。
4. 需要网页点击查词展示；用户生词本应能保存词条引用及遇到的文章句子。释义、例句、音频能否长期保存在生词记录中，需分别确认。
5. 核实服务端存储与浏览器离线副本是否分别许可；前端静态包可能让访问者取得完整数据，不应默认允许。
6. 核实私人/公开网站、用户数量、部署地区、全球访问、中国地区使用、署名和品牌展示要求。
7. 索取样本、格式（JSON/XML等）、指定版本词头/义项/短语数量、更新频率、首年费用、续约费、最低费用及合同到期后的删除义务。
8. 如未来需要用 AI 判断当前句子的词义，应询问是否允许把词典内容发送给第三方模型、是否允许生成衍生解释；展示授权不等于模型处理授权。

## 现有项目状态

原核心精讲词典仍保留，新增的 ECDICT 399,200 个条目仅用于改善当前查词覆盖，明确标记为开源汇编词库及常见义。它不是完整出版社权威词典，也没有被冒充为其中任何一本。权威词典导入应在收到对应数据和许可后接到独立 DictionaryService，凭据放在服务端。


## 2026-10-28：改为完整开源词库导入

根据需求，项目已采用 GitHub 上的 [ECDICT](https://github.com/skywind3000/ECDICT) MIT 许可数据。导入脚本保留上游所有具有可检索英文词头及中文释义的记录，不再按频率截断；当前数据快照共 399,200 条词头、56,615 个词形索引，按两字母前缀分为 740 个数据块，用户查询时按需加载。重新生成方法见 `scripts/import-ecdict.py`。它是开源的通用英汉词库，不等于出版社权威词典，也没有逐条人工校审。
