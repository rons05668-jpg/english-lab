/**
 * 核心词典：人工校订的高价值词条。
 *
 * 设计取舍：
 * - 只收录能讲清"义项之间怎么串起来"的词，宁可少收也不硬凑。
 * - 音标只在有把握时给出；不确定就整条省略，避免给出错误示范。
 * - 例句追求"像人说的话"，不用教科书式的主谓宾堆砌。
 * - semanticNote 讲的是语义延伸逻辑（本义 → 引申），不涉及词源考据。
 *
 * 该文件为纯数据，导入时不执行任何逻辑。
 */

import type { LexiconEntry } from './types';

export const LEXICON: Record<string, LexiconEntry> = {
  maintain: {
    lemma: 'maintain',
    uk: '/meɪnˈteɪn/',
    us: '/meɪnˈteɪn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '维持，保持（使继续处于某种状态或水平）',
        example: 'The museum maintains a constant temperature all year round.',
        exampleZh: '博物馆全年维持恒定的温度。',
      },
      {
        pos: 'v.',
        cn: '维修，养护（建筑、设备、道路）',
        example: 'The bridge is maintained by the city council.',
        exampleZh: '这座桥由市议会负责养护。',
      },
      {
        pos: 'v.',
        cn: '坚持声称（后接 that 从句，含"对方并不认同"的意味）',
        example: 'She maintained that she had never seen the document.',
        exampleZh: '她坚称自己从未见过那份文件。',
      },
    ],
    collocations: [
      { phrase: 'maintain order', cn: '维持秩序' },
      { phrase: 'maintain a balance', cn: '保持平衡' },
      { phrase: 'maintain contact with', cn: '与…保持联系' },
      { phrase: 'maintain that…', cn: '坚持认为…' },
    ],
    family: ['maintains', 'maintained', 'maintaining', 'maintenance'],
    semanticNote:
      '三条义项是同一动作的三层落点：手上托住一件东西是"养护"，托住一种状态不让它掉下来是"维持"，用自己的话把立场托住不让它倒，就是"坚持声称"。',
    synonyms: [
      { word: 'preserve', distinction: 'preserve 侧重"抢在损坏之前保住"，对象多为文物、传统、食物、环境；maintain 侧重持续投入精力让状态不变。' },
      { word: 'sustain', distinction: 'sustain 强调"从下面提供支撑使延续"，常与 growth、life、interest 搭配，比 maintain 更有"供能"的意味。' },
      { word: 'keep', distinction: 'keep 最口语、最宽泛，可直接接形容词；maintain 更正式，多用于书面与专业语境。' },
    ],
    level: 2,
  },

  sustain: {
    lemma: 'sustain',
    uk: '/səˈsteɪn/',
    us: '/səˈsteɪn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '支撑（重量）',
        example: 'Two stone pillars sustain the weight of the roof.',
        exampleZh: '两根石柱支撑着屋顶的重量。',
      },
      {
        pos: 'v.',
        cn: '使持续，维系（增长、生命、兴趣）',
        example: 'No economy can sustain this rate of growth for long.',
        exampleZh: '没有哪个经济体能把这种增速长期维持下去。',
      },
      {
        pos: 'v.',
        cn: '遭受（伤害、损失）（正式）',
        example: 'He sustained a minor injury during training.',
        exampleZh: '他在训练中受了轻伤。',
      },
    ],
    collocations: [
      { phrase: 'sustain growth', cn: '维持增长' },
      { phrase: 'sustain an injury', cn: '受伤' },
      { phrase: 'sustain life', cn: '维持生命' },
      { phrase: 'sustain interest', cn: '保持兴趣' },
    ],
    family: ['sustains', 'sustained', 'sustaining', 'sustainable', 'sustainability'],
    semanticNote:
      '本义是"从下面托住"。托住重量是支撑；托住一件正在进行的事不让它中断，是维系；而身体被外力"托"了一下，就落到"遭受损伤"这条义项上。',
    synonyms: [
      { word: 'maintain', distinction: 'maintain 中性，指让状态保持不变；sustain 强调提供资源或力量使某过程延续，暗含"要花代价"。' },
      { word: 'support', distinction: 'support 既可指具体托举，也可指道义、资金上的支持，适用范围比 sustain 宽。' },
      { word: 'bear', distinction: 'bear 强调承受重量或后果，含忍耐意味；sustain 更强调"撑住之后还能继续"。' },
    ],
    level: 3,
  },

  preserve: {
    lemma: 'preserve',
    uk: '/prɪˈzɜːv/',
    us: '/prɪˈzɜːrv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '保护，保存（使不损坏、不消失）',
        example: 'The trust works to preserve the old town as it was a century ago.',
        exampleZh: '该基金会致力于把这座老城按一百年前的样子保存下来。',
      },
      {
        pos: 'v.',
        cn: '腌制，保鲜（食物）',
        example: 'Salt was once used to preserve meat through the winter.',
        exampleZh: '过去人们用盐把肉腌起来过冬。',
      },
      {
        pos: 'n.',
        cn: '专属领域（常用单数，含"外人不得插手"之意）',
        example: 'Wildlife protection is no longer the preserve of scientists.',
        exampleZh: '野生动物保护不再是科学家的专属领域。',
      },
    ],
    collocations: [
      { phrase: 'preserve the environment', cn: '保护环境' },
      { phrase: 'preserve traditions', cn: '保留传统' },
      { phrase: 'preserved food', cn: '腌制食品' },
      { phrase: 'a national preserve', cn: '国家保护区' },
    ],
    family: ['preserves', 'preserved', 'preserving', 'preservation', 'preservative'],
    semanticNote:
      '核心是"抢在坏掉之前先守住"：食物先处理再守住是腌制，老建筑提前守住是保护，某个领域提前圈起来守住就是"专属领域"。',
    synonyms: [
      { word: 'conserve', distinction: 'conserve 强调"节约使用、避免浪费"，多与 energy、resources 搭配；preserve 强调"防止损坏或消失"。' },
      { word: 'reserve', distinction: 'reserve 是"留作后用"或"预订"，重点在占位；preserve 重点在保护其原状。' },
      { word: 'maintain', distinction: 'maintain 是让状态不下降，允许改变；preserve 是让原貌不变，抗拒改变。' },
    ],
    level: 3,
  },

  remain: {
    lemma: 'remain',
    uk: '/rɪˈmeɪn/',
    us: '/rɪˈmeɪn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '仍然是，保持（作系动词，后接形容词、名词或分词）',
        example: 'The results remain unclear.',
        exampleZh: '结果仍不清楚。',
      },
      {
        pos: 'v.',
        cn: '留下，逗留（人未离开）',
        example: 'Only a few guests remained after midnight.',
        exampleZh: '午夜过后只剩几位客人。',
      },
      {
        pos: 'n.',
        cn: '剩余物；遗迹（常用复数 remains）',
        example: 'The remains of a Roman villa were found under the car park.',
        exampleZh: '停车场下面发现了一座罗马别墅的遗迹。',
      },
    ],
    collocations: [
      { phrase: 'remain unchanged', cn: '保持不变' },
      { phrase: 'remain silent', cn: '保持沉默' },
      { phrase: 'it remains to be seen', cn: '尚待观察' },
      { phrase: 'remain in contact', cn: '保持联系' },
    ],
    family: ['remains', 'remained', 'remaining'],
    semanticNote:
      '核心是"留在原地没动"。空间上没走是"留下"；状态停在原地没变，就是 remain + 形容词的"仍然是"；人走后剩下的东西，自然就是"遗迹、残余"。',
    synonyms: [
      { word: 'stay', distinction: 'stay 口语化，多指人停留或某状态保持；remain 更正式，且可作系动词直接接形容词。' },
      { word: 'continue', distinction: 'continue 强调动作不间断地延续；remain 强调状态未被改变。' },
      { word: 'linger', distinction: 'linger 指"迟迟不去"，常带不愿离开或残留不散的情感色彩。' },
    ],
    level: 2,
  },

  retain: {
    lemma: 'retain',
    uk: '/rɪˈteɪn/',
    us: '/rɪˈteɪn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '保留，保住（不失去原有的东西）',
        example: 'The town has retained much of its medieval charm.',
        exampleZh: '这座小镇保留了不少中世纪的韵味。',
      },
      {
        pos: 'v.',
        cn: '记住，记住不忘',
        example: 'Children retain information better when the topic interests them.',
        exampleZh: '话题让孩子感兴趣时，他们记得更牢。',
      },
      {
        pos: 'v.',
        cn: '聘请（律师、顾问）（正式）',
        example: 'The company retained a firm of consultants.',
        exampleZh: '公司聘请了一家咨询公司。',
      },
    ],
    collocations: [
      { phrase: 'retain control', cn: '保持控制权' },
      { phrase: 'retain information', cn: '记住信息' },
      { phrase: 'retain staff', cn: '留住员工' },
      { phrase: 'retain heat', cn: '保温' },
    ],
    family: ['retains', 'retained', 'retaining', 'retention', 'retentive'],
    semanticNote:
      're-（向后）+ tain（握住）＝"往回握住不放"。握住东西是保留，握住信息是记住，把某人的服务握在手里为己所用就是聘请。',
    synonyms: [
      { word: 'keep', distinction: 'keep 最宽泛、最口语；retain 更正式，隐含"本来可能失去，但成功保住了"。' },
      { word: 'preserve', distinction: 'preserve 强调保护原貌不被破坏；retain 只强调没有丢失，不涉及是否完好。' },
      { word: 'maintain', distinction: 'maintain 强调持续投入以维持水平；retain 强调结果上的"还在手上"。' },
    ],
    level: 3,
  },

  study: {
    lemma: 'study',
    uk: '/ˈstʌdi/',
    us: '/ˈstʌdi/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '学习，研究（投入时间系统地学）',
        example: 'She is studying the effects of sleep loss on memory.',
        exampleZh: '她在研究睡眠不足对记忆的影响。',
      },
      {
        pos: 'n.',
        cn: '研究，调查（可数，常带具体成果）',
        example: 'A recent study found that teenagers sleep less than they did twenty years ago.',
        exampleZh: '最近一项研究发现，青少年比二十年前睡得更少。',
      },
      {
        pos: 'n.',
        cn: '书房',
        example: 'He was still working in his study at midnight.',
        exampleZh: '午夜时他还在书房里工作。',
      },
    ],
    collocations: [
      { phrase: 'carry out a study', cn: '开展研究' },
      { phrase: 'a case study', cn: '个案研究' },
      { phrase: 'study for a degree', cn: '攻读学位' },
      { phrase: 'study abroad', cn: '出国留学' },
    ],
    family: ['studies', 'studied', 'studying', 'student', 'studious'],
    semanticNote:
      '从"用心投入"到"系统研究"，再到"做研究的那间屋子"，是动作—活动—场所的自然延伸，和中文"书房"的构词思路一致。',
    synonyms: [
      { word: 'learn', distinction: 'learn 侧重"学会"的结果；study 侧重投入时间的过程，学了不一定学会。' },
      { word: 'research', distinction: 'research 指系统深入的学术探究，通常不可数；study 可数，也可指一项具体研究。' },
      { word: 'examine', distinction: 'examine 强调仔细查看的过程，不必然包含理论学习。' },
    ],
    level: 1,
  },

  learn: {
    lemma: 'learn',
    uk: '/lɜːn/',
    us: '/lɜːrn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '学会，学到（技能或知识）',
        example: 'He learned to swim at the age of five.',
        exampleZh: '他五岁学会了游泳。',
      },
      {
        pos: 'v.',
        cn: '得知，获悉（消息）',
        example: 'We learned of the decision only yesterday.',
        exampleZh: '我们昨天才得知这个决定。',
      },
    ],
    collocations: [
      { phrase: 'learn from experience', cn: '从经验中学习' },
      { phrase: 'learn by heart', cn: '背熟' },
      { phrase: 'learn of', cn: '得知' },
      { phrase: 'learn a lesson', cn: '吸取教训' },
    ],
    family: ['learns', 'learned', 'learnt', 'learning', 'learner'],
    semanticNote:
      '两条义项都是"东西进入脑子"：进入的是知识技能，就是学会；进入的是别人告知的消息，就是得知。区别只在于来源。',
    synonyms: [
      { word: 'study', distinction: 'study 强调学习的过程与投入；learn 强调最终掌握。' },
      { word: 'acquire', distinction: 'acquire 更正式，强调经过一段时间逐渐获得，常与 skills、language、habits 搭配。' },
      { word: 'master', distinction: 'master 指学到精通、能自如运用，程度远高于 learn。' },
    ],
    level: 1,
  },

  acquire: {
    lemma: 'acquire',
    uk: '/əˈkwaɪə(r)/',
    us: '/əˈkwaɪər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '获得，习得（能力、知识、习惯）',
        example: 'Children acquire language without formal instruction.',
        exampleZh: '儿童无需正式教学就能习得语言。',
      },
      {
        pos: 'v.',
        cn: '收购，购得（公司、资产）',
        example: 'The group acquired three smaller rivals last year.',
        exampleZh: '该集团去年收购了三家规模较小的对手。',
      },
    ],
    collocations: [
      { phrase: 'acquire knowledge', cn: '获取知识' },
      { phrase: 'acquire a taste for', cn: '逐渐喜欢上' },
      { phrase: 'acquire a company', cn: '收购公司' },
      { phrase: 'an acquired taste', cn: '需要慢慢培养的爱好' },
    ],
    family: ['acquires', 'acquired', 'acquiring', 'acquisition', 'acquisitive'],
    semanticNote:
      '与 get 的关键差别在于"过程性"：acquire 暗示一点一点攒到手并长期归自己所有，所以既能说 acquire a skill（慢慢练成），也能说 acquire a company（买下来归自己）。',
    synonyms: [
      { word: 'obtain', distinction: 'obtain 强调通过申请、努力"取得"某个具体东西，多为一次性动作；acquire 强调逐步累积并拥有。' },
      { word: 'gain', distinction: 'gain 强调"增加"的那部分，常与 weight、experience、confidence 搭配。' },
      { word: 'get', distinction: 'get 最口语、最宽泛，不强调方式与过程。' },
    ],
    level: 3,
  },

  afford: {
    lemma: 'afford',
    uk: '/əˈfɔːd/',
    us: '/əˈfɔːrd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '买得起，负担得起（钱），常与 can / could 连用',
        example: 'Few young families can afford a house in this area.',
        exampleZh: '这一带很少有年轻家庭买得起房。',
      },
      {
        pos: 'v.',
        cn: '承担得起（后果、代价）',
        example: 'We cannot afford to ignore the warning signs.',
        exampleZh: '我们承担不起忽视这些警示的后果。',
      },
      {
        pos: 'v.',
        cn: '提供，给予（正式，书面）',
        example: 'The window affords a view of the whole valley.',
        exampleZh: '这扇窗可以望见整个山谷。',
      },
    ],
    collocations: [
      { phrase: 'afford to do sth', cn: '负担得起做某事' },
      { phrase: 'can ill afford', cn: '难以承受' },
      { phrase: 'afford an opportunity', cn: '提供机会' },
    ],
    family: ['affords', 'afforded', 'affording', 'affordable'],
    semanticNote:
      '三条义项都围绕"还有余力"：钱上有余力是买得起，风险上有余力是担得起，条件上有余力是提供得出。否定式 cannot afford 最常用。',
    synonyms: [
      { word: 'manage', distinction: 'manage 指"设法做到"，常暗示勉强；afford 只谈有没有这个能力或财力。' },
      { word: 'bear', distinction: 'bear 强调承受费用或后果时的忍耐；afford 强调是否具备承受的条件。' },
    ],
    level: 2,
  },

  approach: {
    lemma: 'approach',
    uk: '/əˈprəʊtʃ/',
    us: '/əˈproʊtʃ/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '方法，途径（后接 to）',
        example: 'The school has adopted a new approach to teaching reading.',
        exampleZh: '学校在阅读教学上采用了一种新方法。',
      },
      {
        pos: 'v.',
        cn: '接近，靠近（时间或空间）',
        example: 'Winter is approaching and the nights are drawing in.',
        exampleZh: '冬天临近，天黑得越来越早。',
      },
      {
        pos: 'v.',
        cn: '着手处理，对付（问题、任务）',
        example: 'We need to approach the problem from a different angle.',
        exampleZh: '我们得换个角度来处理这个问题。',
      },
    ],
    collocations: [
      { phrase: 'a new approach to', cn: '对…的新方法' },
      { phrase: 'approach a problem', cn: '着手处理问题' },
      { phrase: 'as winter approaches', cn: '随着冬天临近' },
      { phrase: 'a practical approach', cn: '务实的方法' },
    ],
    family: ['approaches', 'approached', 'approaching', 'approachable'],
    semanticNote:
      '空间上的"走近"是起点：走近一个问题，就是开始处理它；而走近它时走的那条路线，就是"方法"。所以 approach 的名词义和动词义其实是一件事的两面。',
    synonyms: [
      { word: 'method', distinction: 'method 指有明确步骤的具体方法，可数；approach 更抽象，强调思路与取向。' },
      { word: 'way', distinction: 'way 最宽泛、最口语；approach 更正式，且固定搭配是 approach to doing。' },
      { word: 'means', distinction: 'means 指"手段、工具"，单复数同形，多用于 by means of。' },
    ],
    level: 2,
  },

  assume: {
    lemma: 'assume',
    uk: '/əˈsjuːm/',
    us: '/əˈsuːm/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '假定，想当然地认为（尚无证据）',
        example: 'I assume you have read the report before the meeting.',
        exampleZh: '我以为你在会前已经看过报告了。',
      },
      {
        pos: 'v.',
        cn: '承担（责任、职务、控制权）',
        example: 'She assumed control of the company in March.',
        exampleZh: '她三月接手了公司的管理。',
      },
      {
        pos: 'v.',
        cn: '呈现，显出（某种样子或性质）',
        example: 'The problem has assumed a new form in recent years.',
        exampleZh: '近年来这个问题呈现出新的形态。',
      },
    ],
    collocations: [
      { phrase: 'assume responsibility', cn: '承担责任' },
      { phrase: 'assume that…', cn: '假定…' },
      { phrase: 'let us assume', cn: '假设' },
      { phrase: 'assume office', cn: '就职' },
    ],
    family: ['assumes', 'assumed', 'assuming', 'assumption'],
    semanticNote:
      '词根意思是"拿起来"。把未经证实的东西拿过来当前提，是假定；把责任拿过来扛，是承担；把一副新样子拿过来穿上，是呈现。',
    synonyms: [
      { word: 'presume', distinction: 'presume 把握更大，常含"按理说应当如此"的语气；assume 更中性，甚至暗示可能想错了。' },
      { word: 'suppose', distinction: 'suppose 口语化，多用于随口假设或委婉表达；assume 更书面。' },
      { word: 'guess', distinction: 'guess 是毫无把握的猜测，美式口语常用 I guess 表示"我想"。' },
    ],
    level: 3,
  },

  assess: {
    lemma: 'assess',
    uk: '/əˈses/',
    us: '/əˈses/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '评估，评定（水平、质量、能力）',
        example: 'Teachers assess students on both written work and speaking.',
        exampleZh: '老师根据书面作业和口语两方面来评定学生。',
      },
      {
        pos: 'v.',
        cn: '估算，核定（金额、损失、税额）',
        example: 'The damage was assessed at two million pounds.',
        exampleZh: '损失估计为两百万英镑。',
      },
    ],
    collocations: [
      { phrase: 'assess the impact', cn: '评估影响' },
      { phrase: 'assess the risk', cn: '评估风险' },
      { phrase: 'assess performance', cn: '评定表现' },
      { phrase: 'assess the damage', cn: '估算损失' },
    ],
    family: ['assesses', 'assessed', 'assessing', 'assessment', 'assessor'],
    semanticNote:
      '核心是"依据某个标准给出判断"。评人看的是水平，估物看的是价值，两者都是把对象放到一把尺子前量一量。',
    synonyms: [
      { word: 'evaluate', distinction: 'evaluate 更正式，多用于方案、政策、课程的效果；assess 更常用于人、风险、损失。' },
      { word: 'estimate', distinction: 'estimate 只做数量上的粗略推算，不含"好坏"判断。' },
      { word: 'judge', distinction: 'judge 强调下结论，主观成分更重；assess 强调依据标准。' },
    ],
    level: 3,
  },

  contribute: {
    lemma: 'contribute',
    uk: '/kənˈtrɪbjuːt/',
    us: '/kənˈtrɪbjuːt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '促成，是…的原因之一（contribute to）',
        example: 'Poor sleep contributes to poor concentration.',
        exampleZh: '睡眠不足会导致注意力不集中。',
      },
      {
        pos: 'v.',
        cn: '贡献，捐助（钱物、力量）',
        example: 'Everyone contributed something to the farewell gift.',
        exampleZh: '每个人都为这份告别礼物出了一份。',
      },
      {
        pos: 'v.',
        cn: '投稿，撰稿（contribute to a magazine）',
        example: 'She contributes regularly to a science magazine.',
        exampleZh: '她定期为一家科学杂志撰稿。',
      },
    ],
    collocations: [
      { phrase: 'contribute to', cn: '促成；有助于' },
      { phrase: 'contribute money', cn: '捐钱' },
      { phrase: 'make a contribution to', cn: '对…作出贡献' },
      { phrase: 'contribute ideas', cn: '出主意' },
    ],
    family: ['contributes', 'contributed', 'contributing', 'contribution', 'contributor', 'contributory'],
    semanticNote:
      'con-（共同）+ tribute（给出）＝"大家一起拿出自己那一份"。拿出的可以是钱物（捐助）、文章（投稿），也可以是一份作用（促成）。',
    synonyms: [
      { word: 'donate', distinction: 'donate 专指捐钱物，多用于慈善；contribute 范围更宽，可指出钱、出力、出主意。' },
      { word: 'attribute', distinction: 'attribute 是"把…归因于"，方向相反：attribute A to B 意为认为 A 由 B 造成。' },
      { word: 'devote', distinction: 'devote 指奉献时间精力，固定搭配 devote oneself to，带情感投入。' },
    ],
    level: 2,
  },

  decline: {
    lemma: 'decline',
    uk: '/dɪˈklaɪn/',
    us: '/dɪˈklaɪn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '下降，减少（数量、水平）',
        example: 'Sales declined sharply in the second quarter.',
        exampleZh: '第二季度销量大幅下滑。',
      },
      {
        pos: 'v.',
        cn: '婉言谢绝（比 refuse 客气）',
        example: 'He declined the invitation politely.',
        exampleZh: '他礼貌地谢绝了邀请。',
      },
      {
        pos: 'n.',
        cn: '下降，衰退（过程或趋势）',
        example: 'The report charts the decline of the local fishing industry.',
        exampleZh: '报告记录了当地渔业的衰落过程。',
      },
    ],
    collocations: [
      { phrase: 'decline sharply', cn: '急剧下降' },
      { phrase: 'decline an offer', cn: '婉拒提议' },
      { phrase: 'in decline', cn: '处于衰退中' },
      { phrase: 'a sharp decline in', cn: '在…方面的急剧下降' },
    ],
    family: ['declines', 'declined', 'declining', 'declination'],
    semanticNote:
      '本义是"向下倾斜"。数量往下走是下降；把头偏开、把递来的东西推回去，就是婉拒。名词沿用"往下走"这条线。',
    synonyms: [
      { word: 'refuse', distinction: 'refuse 语气直接甚至生硬；decline 礼貌委婉，多用于邀请、提议。' },
      { word: 'reject', distinction: 'reject 是"不接受、否定其价值"，语气最强，可用于申请、方案、人选。' },
      { word: 'decrease', distinction: 'decrease 中性，可及物（decrease costs）；decline 多不及物，且常暗示"不由自主地变差"。' },
    ],
    level: 2,
  },

  demand: {
    lemma: 'demand',
    uk: '/dɪˈmɑːnd/',
    us: '/dɪˈmænd/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '需求（对商品、服务的需要）',
        example: 'Demand for electric cars has risen faster than supply.',
        exampleZh: '电动汽车的需求增长快于供给。',
      },
      {
        pos: 'v.',
        cn: '强烈要求（语气强硬，后接 that 从句用虚拟语气）',
        example: 'Residents demanded that the factory be closed.',
        exampleZh: '居民要求关闭这家工厂。',
      },
      {
        pos: 'n.',
        cn: '（常复数）要求，负担（工作、任务带来的）',
        example: 'The demands of the job left him exhausted.',
        exampleZh: '这份工作的种种要求把他累垮了。',
      },
    ],
    collocations: [
      { phrase: 'meet demand', cn: '满足需求' },
      { phrase: 'supply and demand', cn: '供求' },
      { phrase: 'in demand', cn: '受欢迎，抢手' },
      { phrase: 'demand that…', cn: '要求…' },
    ],
    family: ['demands', 'demanded', 'demanding'],
    semanticNote:
      '从"下命令"出发：买方下命令要货，就成了经济学里的"需求"；工作向人下命令，就成了"要求、负担"。',
    synonyms: [
      { word: 'require', distinction: 'require 指客观需要，语气平；demand 带强制性和情绪，主语多为人或规则。' },
      { word: 'request', distinction: 'request 是礼貌请求，对方可以拒绝；demand 几乎不留拒绝余地。' },
      { word: 'claim', distinction: 'claim 是"依据权利索要"，如 claim compensation；demand 更强调态度强硬。' },
    ],
    level: 2,
  },

  demonstrate: {
    lemma: 'demonstrate',
    uk: '/ˈdemənstreɪt/',
    us: '/ˈdemənstreɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '证明，表明（用证据或实验）',
        example: 'The experiment demonstrates that plants respond to sound.',
        exampleZh: '该实验证明植物对声音有反应。',
      },
      {
        pos: 'v.',
        cn: '演示，示范（怎么做）',
        example: 'The nurse demonstrated how to use the device.',
        exampleZh: '护士演示了这个装置的使用方法。',
      },
      {
        pos: 'v.',
        cn: '示威，游行',
        example: 'Thousands demonstrated against the new tax.',
        exampleZh: '数千人上街抗议新税。',
      },
    ],
    collocations: [
      { phrase: 'demonstrate that…', cn: '表明…' },
      { phrase: 'demonstrate how to', cn: '演示如何…' },
      { phrase: 'demonstrate against', cn: '示威反对' },
      { phrase: 'demonstrate a commitment to', cn: '显示出对…的承诺' },
    ],
    family: ['demonstrates', 'demonstrated', 'demonstrating', 'demonstration', 'demonstrative'],
    semanticNote:
      '核心动作是"摆出来给人看"：摆出证据是证明，摆出操作是演示，摆出人群走上街就是示威。三条义项共用同一个"公开展示"的内核。',
    synonyms: [
      { word: 'prove', distinction: 'prove 语气最强，指经检验确凿无疑；demonstrate 侧重"展示出足以令人信服的东西"。' },
      { word: 'show', distinction: 'show 最通用、最口语；demonstrate 更正式，且暗示有方法、有说服力。' },
      { word: 'illustrate', distinction: 'illustrate 强调用例子、图表来帮助理解，不必然构成证明。' },
    ],
    level: 2,
  },

  emerge: {
    lemma: 'emerge',
    uk: '/ɪˈmɜːdʒ/',
    us: '/ɪˈmɜːrdʒ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '出现，浮现（从遮蔽处出来）',
        example: 'The sun emerged from behind the clouds.',
        exampleZh: '太阳从云后露了出来。',
      },
      {
        pos: 'v.',
        cn: '（事实）显露，暴露（it emerged that…）',
        example: 'It emerged that the letter had never been sent.',
        exampleZh: '后来才知道那封信根本没寄出去。',
      },
      {
        pos: 'v.',
        cn: '（新事物、新现象）兴起，形成',
        example: 'A new kind of online learning has emerged over the past decade.',
        exampleZh: '过去十年间兴起了一种新的在线学习方式。',
      },
    ],
    collocations: [
      { phrase: 'emerge from', cn: '从…中出现' },
      { phrase: 'it emerged that…', cn: '后来才知道…' },
      { phrase: 'newly emerging', cn: '新兴的' },
      { phrase: 'emerge as', cn: '逐渐成为' },
    ],
    family: ['emerges', 'emerged', 'emerging', 'emergence', 'emergent'],
    semanticNote:
      'e-（向外）+ merge（沉入）＝"从水里浮出来"。看得见的东西浮出水面是出现；看不见的事实浮出水面是"后来才知道"；原本没有的事物浮出水面就是"兴起"。',
    synonyms: [
      { word: 'appear', distinction: 'appear 最通用，可指突然可见，也可指"似乎"；emerge 强调从隐蔽、模糊中逐渐显出。' },
      { word: 'arise', distinction: 'arise 多与 problem、question、opportunity 搭配，指"产生"，不及物且无被动。' },
      { word: 'surface', distinction: 'surface 指隐藏一段时间后浮现，常带"此前被掩盖"的意味。' },
    ],
    level: 3,
  },

  emphasize: {
    lemma: 'emphasize',
    uk: '/ˈemfəsaɪz/',
    us: '/ˈemfəsaɪz/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '强调（某点的重要性）',
        example: 'The report emphasizes the need for early diagnosis.',
        exampleZh: '报告强调了早期诊断的必要性。',
      },
      {
        pos: 'v.',
        cn: '重读，加重语气',
        example: 'He emphasized the word "never".',
        exampleZh: '他把"从不"这个词念得很重。',
      },
    ],
    collocations: [
      { phrase: 'emphasize the importance of', cn: '强调…的重要性' },
      { phrase: 'emphasize that…', cn: '强调…' },
      { phrase: 'it must be emphasized that', cn: '必须强调的是' },
    ],
    family: ['emphasizes', 'emphasized', 'emphasizing', 'emphasis', 'emphatic'],
    semanticNote:
      '核心是"让重点显出来"。说话时加重语气是重读，写文章时把某点放到显眼位置就是强调。英式拼写也可作 emphasise。',
    synonyms: [
      { word: 'stress', distinction: 'stress 更口语，常直接接 that 从句或名词；emphasize 更书面。' },
      { word: 'highlight', distinction: 'highlight 强调"使从整体中凸显出来"，视觉隐喻强，多用于问题、差异。' },
      { word: 'underline', distinction: 'underline 英式书面常用，语气比 emphasize 更强，含"再次提醒"之意。' },
    ],
    level: 3,
  },

  encounter: {
    lemma: 'encounter',
    uk: '/ɪnˈkaʊntə(r)/',
    us: '/ɪnˈkaʊntər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '遇到，遭遇（困难、问题、阻力）',
        example: 'Researchers encountered several unexpected problems.',
        exampleZh: '研究人员遇到了几个意料之外的问题。',
      },
      {
        pos: 'v.',
        cn: '偶然遇见（人）',
        example: 'I encountered an old friend at the station.',
        exampleZh: '我在车站偶遇了一位老朋友。',
      },
      {
        pos: 'n.',
        cn: '相遇，遭遇（可数）',
        example: 'It was a brief encounter, but it changed his mind.',
        exampleZh: '那次相遇很短暂，却改变了他的想法。',
      },
    ],
    collocations: [
      { phrase: 'encounter difficulties', cn: '遇到困难' },
      { phrase: 'encounter resistance', cn: '遭遇阻力' },
      { phrase: 'a chance encounter', cn: '偶遇' },
    ],
    family: ['encounters', 'encountered', 'encountering'],
    semanticNote:
      '比 meet 多一层"迎面撞上"的意思，所以主语常是被动的一方：问题撞上来、阻力撞上来。也正因如此，它多用于麻烦，少用于喜事。',
    synonyms: [
      { word: 'meet', distinction: 'meet 中性，可以是安排好的；encounter 强调意外与不期而遇。' },
      { word: 'confront', distinction: 'confront 强调"直面并必须处理"，语气更强，常含对抗意味。' },
      { word: 'come across', distinction: 'come across 口语，多指偶然发现某物或某人，不强调困难。' },
    ],
    level: 3,
  },

  establish: {
    lemma: 'establish',
    uk: '/ɪˈstæblɪʃ/',
    us: '/ɪˈstæblɪʃ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '建立，创办（机构、组织、关系）',
        example: 'The school was established in 1892.',
        exampleZh: '这所学校创办于 1892 年。',
      },
      {
        pos: 'v.',
        cn: '查明，确定（事实、原因）',
        example: 'The police have not yet established the cause of the fire.',
        exampleZh: '警方尚未查明起火原因。',
      },
      {
        pos: 'v.',
        cn: '使站稳脚跟，确立（地位、名声）',
        example: 'The brand has established itself as a market leader.',
        exampleZh: '这个品牌已经确立了市场领先地位。',
      },
    ],
    collocations: [
      { phrase: 'establish a company', cn: '创办公司' },
      { phrase: 'establish a link between', cn: '确立…之间的联系' },
      { phrase: 'well-established', cn: '根基稳固的' },
      { phrase: 'establish the facts', cn: '查清事实' },
    ],
    family: ['establishes', 'established', 'establishing', 'establishment'],
    semanticNote:
      '核心是"使站稳"。建起机构是让它站住脚，查清事实是让结论站得住，品牌被市场接受是它在竞争中站稳了。',
    synonyms: [
      { word: 'found', distinction: 'found 专指创立机构，强调开端那一刻；establish 还可指"使稳固"，范围更宽。' },
      { word: 'set up', distinction: 'set up 口语，指搭建组织或系统，过程感强；establish 更正式，含"长期稳固"之意。' },
      { word: 'prove', distinction: 'prove 是证明；establish 在"查明"义上只表示查实，不强调对外说服。' },
    ],
    level: 2,
  },

  evaluate: {
    lemma: 'evaluate',
    uk: '/ɪˈvæljueɪt/',
    us: '/ɪˈvæljueɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '评价，评估（效果、价值、表现）',
        example: 'The course is evaluated by students at the end of each term.',
        exampleZh: '每学期末由学生对该课程作出评价。',
      },
      {
        pos: 'v.',
        cn: '求…的值（数学）',
        example: 'Evaluate the expression for x = 3.',
        exampleZh: '求 x = 3 时该表达式的值。',
      },
    ],
    collocations: [
      { phrase: 'evaluate the effectiveness of', cn: '评估…的有效性' },
      { phrase: 'evaluate performance', cn: '考核绩效' },
      { phrase: 'evaluate the evidence', cn: '评估证据' },
    ],
    family: ['evaluates', 'evaluated', 'evaluating', 'evaluation'],
    semanticNote:
      '由"算出数值"引申为"给出价值判断"：两者都是按一套标准走一遍，最后得出一个可比较的结果。',
    synonyms: [
      { word: 'assess', distinction: 'assess 更常用于人、风险、损失；evaluate 更常用于方案、政策、课程、效果。' },
      { word: 'judge', distinction: 'judge 强调下结论，主观性强；evaluate 强调有标准、有过程。' },
      { word: 'appraise', distinction: 'appraise 很正式，多用于专业估价（房产、艺术品）。' },
    ],
    level: 3,
  },

  evidence: {
    lemma: 'evidence',
    uk: '/ˈevɪdəns/',
    us: '/ˈevɪdəns/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '证据（不可数，不能说 an evidence）',
        example: 'There is little evidence to support the claim.',
        exampleZh: '几乎没有证据支持这一说法。',
      },
      {
        pos: 'n.',
        cn: '迹象，表明（某情感或事实）',
        example: 'Her smile was evidence of relief.',
        exampleZh: '她的笑容说明她松了一口气。',
      },
      {
        pos: 'v.',
        cn: '证明，显示（正式书面，少用）',
        example: 'The results evidence a clear downward trend.',
        exampleZh: '结果显示出明显的下降趋势。',
      },
    ],
    collocations: [
      { phrase: 'evidence suggests that…', cn: '证据表明…' },
      { phrase: 'a piece of evidence', cn: '一条证据' },
      { phrase: 'in evidence', cn: '显眼可见' },
      { phrase: 'give evidence', cn: '作证' },
    ],
    family: ['evidences', 'evidenced', 'evidential', 'evidently'],
    semanticNote:
      '由"看得见的东西"引申为"能让人相信的东西"。法庭上摆出来的是证据，日常生活里能看出端倪的迹象也是证据，只是强度不同。',
    synonyms: [
      { word: 'proof', distinction: 'proof 指不可辩驳的证明，语气最强；evidence 只是支持某一结论的材料，可强可弱。' },
      { word: 'sign', distinction: 'sign 只是外在迹象，本身不构成证明；evidence 隐含"可用于推断"。' },
      { word: 'data', distinction: 'data 是原始数据，需要解释才能成为证据。' },
    ],
    level: 2,
  },

  factor: {
    lemma: 'factor',
    uk: '/ˈfæktə(r)/',
    us: '/ˈfæktər/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '因素，要素（影响结果的一个成分）',
        example: 'Cost was the deciding factor in their choice.',
        exampleZh: '价格是他们做选择时的决定性因素。',
      },
      {
        pos: 'n.',
        cn: '因子，因数（数学）',
        example: 'Three and five are factors of fifteen.',
        exampleZh: '3 和 5 是 15 的因数。',
      },
    ],
    collocations: [
      { phrase: 'a key factor', cn: '关键因素' },
      { phrase: 'factor in', cn: '把…考虑在内' },
      { phrase: 'risk factors', cn: '风险因素' },
      { phrase: 'a contributing factor', cn: '促成因素' },
    ],
    family: ['factors', 'factored', 'factoring', 'factorize'],
    semanticNote:
      '由"做事的一方"引申为"共同起作用的一个成分"。数学里相乘得到积的那些数，也是"共同凑成结果"的成分，所以共用 factor 一词。',
    synonyms: [
      { word: 'element', distinction: 'element 指构成整体的成分，强调"组成部分"；factor 强调"对结果起作用"。' },
      { word: 'component', distinction: 'component 多指机械、系统中的部件，较具体。' },
      { word: 'cause', distinction: 'cause 强调因果链条中的直接原因；factor 只是诸多影响因素之一，语气更弱。' },
    ],
    level: 2,
  },

  feature: {
    lemma: 'feature',
    uk: '/ˈfiːtʃə(r)/',
    us: '/ˈfiːtʃər/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '特点，特色（事物显著的一面）',
        example: 'The main feature of the design is its simplicity.',
        exampleZh: '这个设计最大的特点是简洁。',
      },
      {
        pos: 'n.',
        cn: '（复数）五官，面容',
        example: 'His features were hard to read in the dark.',
        exampleZh: '黑暗中很难看清他的表情。',
      },
      {
        pos: 'v.',
        cn: '以…为特色；由…主演',
        example: 'The film features a young unknown actress.',
        exampleZh: '这部电影由一位名不见经传的年轻女演员主演。',
      },
    ],
    collocations: [
      { phrase: 'a key feature', cn: '主要特点' },
      { phrase: 'a feature film', cn: '故事片' },
      { phrase: 'special features', cn: '特色功能' },
      { phrase: 'feature prominently', cn: '占据显著位置' },
    ],
    family: ['features', 'featured', 'featuring'],
    semanticNote:
      '由"脸的样子"引申为"事物的样子"：一张脸由五官构成，一个事物由若干特点构成，于是 feature 从"五官"长成了"特征"。',
    synonyms: [
      { word: 'characteristic', distinction: 'characteristic 指区别性特征，较正式，常用于人或事物的本质属性。' },
      { word: 'trait', distinction: 'trait 多指人的性格特点，也可指生物性状。' },
      { word: 'quality', distinction: 'quality 指品质，可好可坏，常与形容词连用（good quality）。' },
    ],
    level: 2,
  },

  generate: {
    lemma: 'generate',
    uk: '/ˈdʒenəreɪt/',
    us: '/ˈdʒenəreɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '产生，创造（电、热、收入、兴趣）',
        example: 'The panels generate enough electricity for the whole building.',
        exampleZh: '这些板子发的电够整栋楼使用。',
      },
      {
        pos: 'v.',
        cn: '生成（数据、文本、图像）',
        example: 'The software generates a report automatically.',
        exampleZh: '该软件会自动生成报告。',
      },
    ],
    collocations: [
      { phrase: 'generate electricity', cn: '发电' },
      { phrase: 'generate income', cn: '创造收入' },
      { phrase: 'generate interest', cn: '引起兴趣' },
      { phrase: 'generate jobs', cn: '创造就业' },
    ],
    family: ['generates', 'generated', 'generating', 'generation', 'generator', 'generative'],
    semanticNote:
      '词根意为"生育、产生"，所以它的宾语多是"能被产出的东西"：电、热、钱、工作机会、兴趣、数据。抽象名词也能"被生出来"，这是它比 make 更正式的地方。',
    synonyms: [
      { word: 'produce', distinction: 'produce 最通用，可指工农业产品；generate 更强调"由某种过程产生"，多用于能源、收入、想法。' },
      { word: 'create', distinction: 'create 强调从无到有，带创造性；generate 强调有来源、有机制地产出。' },
      { word: 'yield', distinction: 'yield 多用于农作物、利润、结果的产出，含"回报"意味。' },
    ],
    level: 2,
  },

  identify: {
    lemma: 'identify',
    uk: '/aɪˈdentɪfaɪ/',
    us: '/aɪˈdentɪfaɪ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '识别，辨认出（是谁、是什么）',
        example: 'Can you identify the man in this photograph?',
        exampleZh: '你能认出照片上的这个人吗？',
      },
      {
        pos: 'v.',
        cn: '找出，确定（原因、问题、关键）',
        example: 'The study identifies three main causes of the decline.',
        exampleZh: '这项研究找出了衰退的三个主要原因。',
      },
      {
        pos: 'v.',
        cn: '认同，感同身受（identify with）',
        example: 'Readers identify with the heroine.',
        exampleZh: '读者对女主人公产生了认同。',
      },
    ],
    collocations: [
      { phrase: 'identify with', cn: '认同；与…产生共鸣' },
      { phrase: 'identify the cause', cn: '找出原因' },
      { phrase: 'be identified as', cn: '被确认为' },
      { phrase: 'identify a need', cn: '发现需求' },
    ],
    family: ['identifies', 'identified', 'identifying', 'identification', 'identity', 'identifiable'],
    semanticNote:
      '核心是"确认是同一个"。从众多对象中把它对上号是识别，从复杂现象中把关键对上号是找出；identify with 则是把自己和对方对成同一个，即认同。',
    synonyms: [
      { word: 'recognize', distinction: 'recognize 是凭印象认出"见过的"，前提是此前认识；identify 不要求此前认识，只需确认身份。' },
      { word: 'distinguish', distinction: 'distinguish 强调区分出差别（distinguish A from B）；identify 强调确认。' },
      { word: 'pinpoint', distinction: 'pinpoint 强调精确定位，常用于位置、原因、时刻。' },
    ],
    level: 2,
  },

  impact: {
    lemma: 'impact',
    uk: '/ˈɪmpækt/',
    us: '/ˈɪmpækt/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '影响，作用（have an impact on）',
        example: 'Social media has had a profound impact on how teenagers make friends.',
        exampleZh: '社交媒体深刻影响了青少年交友的方式。',
      },
      {
        pos: 'n.',
        cn: '撞击，冲击（力）',
        example: 'The impact of the crash shattered the windscreen.',
        exampleZh: '撞击的冲力震碎了挡风玻璃。',
      },
      {
        pos: 'v.',
        cn: '影响（多用于美式，英式常作 impact on）',
        example: 'Rising costs will impact on small businesses.',
        exampleZh: '成本上升将影响小企业。',
      },
    ],
    collocations: [
      { phrase: 'have an impact on', cn: '对…有影响' },
      { phrase: 'environmental impact', cn: '环境影响' },
      { phrase: 'impact on', cn: '影响（动词）' },
      { phrase: 'on impact', cn: '在撞击时' },
    ],
    family: ['impacts', 'impacted', 'impacting'],
    semanticNote:
      '由"撞上去"这一物理动作引申为"对事物产生作用"。撞击有力度，影响也有力度，所以常与 profound、significant、lasting 这类表示程度的词搭配。',
    synonyms: [
      { word: 'influence', distinction: 'influence 常指潜移默化的影响，多用于人、观念；impact 力度感更强，常指重大影响。' },
      { word: 'effect', distinction: 'effect 多用于 have an effect on，偏"结果"；impact 偏"冲击力度"。' },
      { word: 'consequence', distinction: 'consequence 指后果，常含负面意味，且强调因果链。' },
    ],
    level: 2,
  },

  implement: {
    lemma: 'implement',
    uk: '/ˈɪmplɪment/',
    us: '/ˈɪmplɪment/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '实施，执行（政策、计划、方案）',
        example: 'The council plans to implement the scheme next spring.',
        exampleZh: '市议会计划明年春天实施该方案。',
      },
      {
        pos: 'n.',
        cn: '工具，器具（多用于农业、手工）',
        example: 'Farm implements were stacked against the wall.',
        exampleZh: '农具靠墙堆着。',
      },
    ],
    collocations: [
      { phrase: 'implement a policy', cn: '实施政策' },
      { phrase: 'implement changes', cn: '落实变革' },
      { phrase: 'implement a plan', cn: '执行计划' },
    ],
    family: ['implements', 'implemented', 'implementing', 'implementation'],
    semanticNote:
      '名词"工具"是"用来把事做成的东西"，动词"实施"就是"把纸上的方案变成能用的东西"。注意重音：动词在首音节 /ˈɪmplɪment/，名词在末音节。',
    synonyms: [
      { word: 'carry out', distinction: 'carry out 口语，多指执行任务、实验、调查；implement 更正式，对象多为政策、方案。' },
      { word: 'execute', distinction: 'execute 强调精确、完整地落实，含"按计划一丝不苟"之意。' },
      { word: 'enforce', distinction: 'enforce 专指强制执行法律、规定，带强制力。' },
    ],
    level: 3,
  },

  indicate: {
    lemma: 'indicate',
    uk: '/ˈɪndɪkeɪt/',
    us: '/ˈɪndɪkeɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '表明，显示（数据、迹象）',
        example: 'The figures indicate a slow recovery.',
        exampleZh: '数据显示经济在缓慢复苏。',
      },
      {
        pos: 'v.',
        cn: '指出，示意（用手势、眼神）',
        example: 'He indicated the door with a nod.',
        exampleZh: '他点头示意门在那边。',
      },
      {
        pos: 'v.',
        cn: '表示，暗示（某种需要或态度）',
        example: 'The situation indicates a change of plan.',
        exampleZh: '形势说明计划需要调整。',
      },
    ],
    collocations: [
      { phrase: 'indicate that…', cn: '表明…' },
      { phrase: 'as indicated above', cn: '如上所示' },
      { phrase: 'indicate a preference', cn: '表示偏好' },
    ],
    family: ['indicates', 'indicated', 'indicating', 'indication', 'indicator', 'indicative'],
    semanticNote:
      '由"用手指"引申为"用任何方式让人知道"：用手势是示意，用数据是表明，用迹象是显示。三种方式，一个内核。',
    synonyms: [
      { word: 'show', distinction: 'show 最通用、最口语；indicate 更正式，多用于数据、迹象、态度。' },
      { word: 'suggest', distinction: 'suggest 语气更弱，只表示"有…的可能"，不构成明确结论。' },
      { word: 'signal', distinction: 'signal 强调主动发出信号以传递信息。' },
    ],
    level: 2,
  },

  involve: {
    lemma: 'involve',
    uk: '/ɪnˈvɒlv/',
    us: '/ɪnˈvɑːlv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '涉及，包含（必然带来的内容）',
        example: 'The job involves a lot of travel.',
        exampleZh: '这份工作需要经常出差。',
      },
      {
        pos: 'v.',
        cn: '使参与，让…加入',
        example: 'Parents should be involved in the decision.',
        exampleZh: '父母应当参与这个决定。',
      },
      {
        pos: 'v.',
        cn: '牵涉，使卷入（案件、丑闻）',
        example: 'Several officials were involved in the scandal.',
        exampleZh: '数名官员卷入了这起丑闻。',
      },
    ],
    collocations: [
      { phrase: 'be involved in', cn: '参与；牵涉' },
      { phrase: 'involve doing sth', cn: '需要做某事' },
      { phrase: 'get involved', cn: '参与进来' },
      { phrase: 'the people involved', cn: '相关人员' },
    ],
    family: ['involves', 'involved', 'involving', 'involvement'],
    semanticNote:
      '原义是"卷进去"。事情把某项内容卷进来，就是"包含"；把人卷进来，就是"使参与"；把人卷进丑闻，就是"牵涉"。注意 involve 后接动词要用 -ing。',
    synonyms: [
      { word: 'include', distinction: 'include 只是列举整体中的一部分，不含"必然伴随"之意；involve 强调做这件事就免不了。' },
      { word: 'engage', distinction: 'engage 指使人主动投入、产生兴趣地参与。' },
      { word: 'entail', distinction: 'entail 很正式，指"必然导致、必然包含"，逻辑意味强。' },
    ],
    level: 2,
  },

  issue: {
    lemma: 'issue',
    uk: '/ˈɪʃuː/',
    us: '/ˈɪʃuː/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '问题，议题（公众关心、需要讨论的）',
        example: 'Housing remains the biggest issue in the election.',
        exampleZh: '住房仍是这次选举中最大的议题。',
      },
      {
        pos: 'n.',
        cn: '（报刊的）期，号',
        example: 'The article appeared in the March issue.',
        exampleZh: '那篇文章发表在三月号上。',
      },
      {
        pos: 'v.',
        cn: '发布，发放（声明、证件、货币）',
        example: 'The bank issued a new card within a week.',
        exampleZh: '银行一周内就发出了新卡。',
      },
    ],
    collocations: [
      { phrase: 'raise an issue', cn: '提出问题' },
      { phrase: 'the latest issue', cn: '最新一期' },
      { phrase: 'issue a statement', cn: '发表声明' },
      { phrase: 'at issue', cn: '争议中的；关键的' },
    ],
    family: ['issues', 'issued', 'issuing'],
    semanticNote:
      '由"出去"这一动作串起来：话出去是发表，文件出去是发放，争论中被抛到台面上的话题就是"议题"。',
    synonyms: [
      { word: 'problem', distinction: 'problem 指明确需要解决的困难，负面色彩强；issue 更中性，指"值得讨论的事"。' },
      { word: 'matter', distinction: 'matter 很中性，指"事情"，不带"待解决"的紧迫感。' },
      { word: 'topic', distinction: 'topic 只是讨论的话题，不含争议性。' },
    ],
    level: 2,
  },

  likely: {
    lemma: 'likely',
    uk: '/ˈlaɪkli/',
    us: '/ˈlaɪkli/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '很可能的（be likely to do / it is likely that）',
        example: 'Children who read daily are more likely to do well at school.',
        exampleZh: '每天阅读的孩子更有可能在学校表现良好。',
      },
      {
        pos: 'adv.',
        cn: '很可能（只与 most、very、quite 连用）',
        example: 'They will most likely arrive on Friday.',
        exampleZh: '他们最有可能周五到。',
      },
      {
        pos: 'adj.',
        cn: '合适的，有希望的（人选、结果）',
        example: 'She is the most likely candidate for the post.',
        exampleZh: '她是最有希望得到这个职位的人选。',
      },
    ],
    collocations: [
      { phrase: 'be likely to do', cn: '很可能做' },
      { phrase: 'more than likely', cn: '十有八九' },
      { phrase: 'the likely outcome', cn: '可能的结果' },
      { phrase: 'a likely candidate', cn: '合适的人选' },
    ],
    family: ['likelier', 'likeliest', 'likelihood', 'unlikely'],
    semanticNote:
      '由"看起来像"引申为"看样子会发生"：既表示概率高，也表示"看着像那么回事"，所以能修饰"合适的人选"。作副词时只能与 most、very 等搭配，不能说 He likely comes。',
    synonyms: [
      { word: 'probable', distinction: 'probable 可能性更大，较正式，且不能作副词；likely 可作副词（与 most 连用）。' },
      { word: 'possible', distinction: 'possible 只表示"有可能"，程度明显弱于 likely。' },
      { word: 'liable', distinction: 'liable 常含负面意味，指"易于遭受"或"负有法律责任"。' },
    ],
    level: 2,
  },

  obtain: {
    lemma: 'obtain',
    uk: '/əbˈteɪn/',
    us: '/əbˈteɪn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '获得，取得（正式，常指通过申请或努力）',
        example: 'You must obtain permission before entering the site.',
        exampleZh: '进入工地前必须先取得许可。',
      },
      {
        pos: 'v.',
        cn: '（规则、习俗）存在，通行（很书面）',
        example: 'The custom still obtains in some rural areas.',
        exampleZh: '这一习俗在一些农村地区仍然存在。',
      },
    ],
    collocations: [
      { phrase: 'obtain permission', cn: '获得许可' },
      { phrase: 'obtain information', cn: '获取信息' },
      { phrase: 'obtain a degree', cn: '取得学位' },
    ],
    family: ['obtains', 'obtained', 'obtaining', 'obtainable'],
    semanticNote:
      '第一条是"通过努力拿到"，第二条是"一直立在那里"——规则立着，就是"通行、有效"。后一用法在现代英语中已相当书面化。',
    synonyms: [
      { word: 'acquire', distinction: 'acquire 强调逐步累积并长期拥有，多与技能、资产搭配；obtain 多指一次性取得具体之物。' },
      { word: 'gain', distinction: 'gain 强调"增加的量或好处"，如 gain experience、gain weight。' },
      { word: 'secure', distinction: 'secure 强调经过努力确保到手，含"来之不易"之意。' },
    ],
    level: 3,
  },

  occur: {
    lemma: 'occur',
    uk: '/əˈkɜː(r)/',
    us: '/əˈkɜːr/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '发生（尤指意外或未经计划的事）',
        example: 'The accident occurred at about six in the morning.',
        exampleZh: '事故发生在早上六点左右。',
      },
      {
        pos: 'v.',
        cn: '存在，出现（某现象在某处可见）',
        example: 'The same pattern occurs in other species.',
        exampleZh: '同样的模式在其他物种身上也存在。',
      },
      {
        pos: 'v.',
        cn: '被想到（occur to sb）',
        example: 'It never occurred to me that she might refuse.',
        exampleZh: '我从没想过她可能会拒绝。',
      },
    ],
    collocations: [
      { phrase: 'occur to sb', cn: '某人想到' },
      { phrase: 'occur naturally', cn: '天然存在' },
      { phrase: 'frequently occurring', cn: '常见的' },
      { phrase: 'when the opportunity occurs', cn: '有机会时' },
    ],
    family: ['occurs', 'occurred', 'occurring', 'occurrence'],
    semanticNote:
      '本义是"迎面跑过来"。事情迎面而来是发生，想法迎面而来就是"被想到"，所以 occur to sb 的主语通常是 it 或某个想法，而不是人。注意双写 r。',
    synonyms: [
      { word: 'happen', distinction: 'happen 最通用，可指计划内也可指计划外；occur 更正式，多用于书面与统计描述。' },
      { word: 'take place', distinction: 'take place 多指有安排的事件，如会议、比赛，一般不用被动。' },
      { word: 'arise', distinction: 'arise 多与抽象名词搭配，指问题、情况"产生"。' },
    ],
    level: 2,
  },

  perceive: {
    lemma: 'perceive',
    uk: '/pəˈsiːv/',
    us: '/pərˈsiːv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '察觉，注意到（细微变化）',
        example: 'She perceived a slight change in his tone.',
        exampleZh: '她察觉到他的语气有点变化。',
      },
      {
        pos: 'v.',
        cn: '把…看作，认为（perceive as）',
        example: 'The reform was perceived as a threat by many workers.',
        exampleZh: '许多工人把这项改革视为威胁。',
      },
    ],
    collocations: [
      { phrase: 'be perceived as', cn: '被视为' },
      { phrase: 'perceive a difference', cn: '察觉到差别' },
      { phrase: 'public perception', cn: '公众看法' },
    ],
    family: ['perceives', 'perceived', 'perceiving', 'perception', 'perceptive', 'perceptible'],
    semanticNote:
      '词根意为"抓住"。用感官抓住外界的变化是察觉，用头脑抓住对它的判断就是"视为"。所以第二条义项几乎总与 as 连用。',
    synonyms: [
      { word: 'notice', distinction: 'notice 更随意，指偶然注意到；perceive 更正式，含"有意识地辨认"。' },
      { word: 'regard', distinction: 'regard 也表"视为"，必须与 as 连用，语气更接近"评价"。' },
      { word: 'sense', distinction: 'sense 强调凭直觉感到，不必然有明确依据。' },
    ],
    level: 3,
  },

  persist: {
    lemma: 'persist',
    uk: '/pəˈsɪst/',
    us: '/pərˈsɪst/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '坚持（做某事，含不怕阻拦）',
        example: 'She persisted in asking questions until she got an answer.',
        exampleZh: '她一直追问，直到得到答复。',
      },
      {
        pos: 'v.',
        cn: '持续存在（问题、症状、现象）',
        example: 'The symptoms persisted for several weeks.',
        exampleZh: '症状持续了好几周。',
      },
    ],
    collocations: [
      { phrase: 'persist in doing', cn: '坚持做' },
      { phrase: 'persist with', cn: '坚持进行' },
      { phrase: 'if symptoms persist', cn: '如果症状持续' },
    ],
    family: ['persists', 'persisted', 'persisting', 'persistence', 'persistent'],
    semanticNote:
      '本义"站到底"。人站到底是坚持，问题站到底不走就是持续存在。语法上要注意 persist in doing，不能接不定式。',
    synonyms: [
      { word: 'insist', distinction: 'insist 是"坚持主张"，多接 on + 名词/动名词或 that 从句，重点在"说"。' },
      { word: 'persevere', distinction: 'persevere 褒义，强调不畏艰难、有毅力地坚持，比 persist 更正面。' },
      { word: 'continue', distinction: 'continue 中性，只描述持续，不含意志与阻力。' },
    ],
    level: 3,
  },

  potential: {
    lemma: 'potential',
    uk: '/pəˈtenʃl/',
    us: '/pəˈtenʃl/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '潜在的，可能发生的（尚未成为现实）',
        example: 'The drug has potential side effects.',
        exampleZh: '这种药有潜在的副作用。',
      },
      {
        pos: 'n.',
        cn: '潜力，可能性（不可数）',
        example: 'She has the potential to become a first-rate researcher.',
        exampleZh: '她有成为一流研究者的潜力。',
      },
    ],
    collocations: [
      { phrase: 'potential customers', cn: '潜在客户' },
      { phrase: 'reach one\'s potential', cn: '发挥潜力' },
      { phrase: 'the potential for', cn: '有…的可能' },
      { phrase: 'potential risk', cn: '潜在风险' },
    ],
    family: ['potentially', 'potentiality'],
    semanticNote:
      '由"有力量但尚未使出"出发：形容词指"尚未发生但具备条件"，名词指"尚未发挥出来的能力"。所以 potential 总是面向未来。',
    synonyms: [
      { word: 'possible', distinction: 'possible 只谈"有没有可能"，不含"有待发展、值得培养"的意思。' },
      { word: 'latent', distinction: 'latent 指潜伏未显，术语感强，多用于医学、心理学。' },
      { word: 'prospective', distinction: 'prospective 指"未来的、预期的"，多修饰人选、客户、买家。' },
    ],
    level: 2,
  },

  previous: {
    lemma: 'previous',
    uk: '/ˈpriːviəs/',
    us: '/ˈpriːviəs/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '以前的，先前的（泛指过去某一次）',
        example: 'Her previous job was in a small publishing house.',
        exampleZh: '她上一份工作是在一家小出版社。',
      },
      {
        pos: 'adj.',
        cn: '上一个的（时间上紧邻）',
        example: 'The previous chapter dealt with the same question.',
        exampleZh: '上一章讨论的是同一个问题。',
      },
    ],
    collocations: [
      { phrase: 'previous experience', cn: '以往经验' },
      { phrase: 'the previous day', cn: '前一天' },
      { phrase: 'previous to', cn: '在…之前（正式）' },
      { phrase: 'as previously mentioned', cn: '如前所述' },
    ],
    family: ['previously'],
    semanticNote:
      '由"走在前面的"引申为"时间上在先的"。因此既可指"以前的任何一次"，也可指"紧挨着的上一个"，具体靠语境判断。',
    synonyms: [
      { word: 'former', distinction: 'former 多指以前的职位、身份，且只作定语（the former president）。' },
      { word: 'prior', distinction: 'prior 强调"先于某事"，较正式，常与 to 连用。' },
      { word: 'earlier', distinction: 'earlier 口语化，可作副词，指"早些时候"。' },
    ],
    level: 2,
  },

  primary: {
    lemma: 'primary',
    uk: '/ˈpraɪməri/',
    us: '/ˈpraɪmeri/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '主要的，首要的（排在第一位）',
        example: 'The primary aim of the course is to build confidence.',
        exampleZh: '这门课的首要目标是建立自信。',
      },
      {
        pos: 'adj.',
        cn: '初级的，初等的（教育阶段）',
        example: 'She teaches at a primary school.',
        exampleZh: '她在一所小学教书。',
      },
      {
        pos: 'adj.',
        cn: '最初的，原生的（来源、阶段）',
        example: 'The primary source of the river is a spring in the hills.',
        exampleZh: '这条河的源头是山间的一眼泉。',
      },
    ],
    collocations: [
      { phrase: 'primary school', cn: '小学' },
      { phrase: 'primary care', cn: '初级医疗' },
      { phrase: 'the primary cause', cn: '主要原因' },
      { phrase: 'primary research', cn: '一手研究' },
    ],
    family: ['primarily'],
    semanticNote:
      '由"第一"生出三层意思：重要性排第一是"首要"，阶段排第一是"初等"，顺序排第一是"最初、原生"。判断哪一层，看它修饰的名词。',
    synonyms: [
      { word: 'main', distinction: 'main 最通用、最口语，只指"最主要的部分"，不含"第一顺位"的意味。' },
      { word: 'chief', distinction: 'chief 多修饰人（chief executive）或原因、目标，较正式。' },
      { word: 'principal', distinction: 'principal 正式，多修饰事物（principal reason），美式还可指校长。' },
    ],
    level: 2,
  },

  promote: {
    lemma: 'promote',
    uk: '/prəˈməʊt/',
    us: '/prəˈmoʊt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '促进，推动（某事物发展）',
        example: 'The campaign promotes healthier eating among children.',
        exampleZh: '这项活动旨在促进儿童健康饮食。',
      },
      {
        pos: 'v.',
        cn: '提升，晋升（职位）',
        example: 'She was promoted to head of department.',
        exampleZh: '她被提升为部门主管。',
      },
      {
        pos: 'v.',
        cn: '推销，宣传（产品、作品）',
        example: 'The band is touring to promote its new album.',
        exampleZh: '乐队正在巡演宣传新专辑。',
      },
    ],
    collocations: [
      { phrase: 'promote growth', cn: '促进增长' },
      { phrase: 'be promoted to', cn: '被提升为' },
      { phrase: 'promote awareness', cn: '提高意识' },
      { phrase: 'promote cooperation', cn: '促进合作' },
    ],
    family: ['promotes', 'promoted', 'promoting', 'promotion'],
    semanticNote:
      '由"向前送"出发：把事情往前送是促进，把人往前送是提拔，把产品往前推到顾客眼前是推销。三条义项共用一个"往前"的方向。',
    synonyms: [
      { word: 'encourage', distinction: 'encourage 侧重"给人勇气和意愿"，主语多为人；promote 侧重"推动事物本身发展"。' },
      { word: 'advance', distinction: 'advance 较正式，指推进进程、促进利益，也可指提升职位。' },
      { word: 'boost', distinction: 'boost 口语与商务常用，指"大幅提升"，力度强于 promote。' },
    ],
    level: 2,
  },

  provide: {
    lemma: 'provide',
    uk: '/prəˈvaɪd/',
    us: '/prəˈvaɪd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '提供，供给（provide sb with sth / provide sth for sb）',
        example: 'The school provides free meals for younger pupils.',
        exampleZh: '学校为低年级学生提供免费午餐。',
      },
      {
        pos: 'v.',
        cn: '（法律、条款）规定',
        example: 'The contract provides that notice must be given in writing.',
        exampleZh: '合同规定必须以书面形式通知。',
      },
      {
        pos: 'v.',
        cn: '供养，维持生计（provide for）',
        example: 'He works two jobs to provide for his family.',
        exampleZh: '他打两份工养家。',
      },
    ],
    collocations: [
      { phrase: 'provide sb with sth', cn: '向某人提供某物' },
      { phrase: 'provide for', cn: '供养；为…作准备' },
      { phrase: 'provide that…', cn: '规定…' },
      { phrase: 'provide an opportunity', cn: '提供机会' },
    ],
    family: ['provides', 'provided', 'providing', 'provision', 'provider'],
    semanticNote:
      '由"预先看到、预先备好"出发：提前备好东西给人用是提供，法律提前把条件写好就是规定，提前备好一家人的吃用就是供养。',
    synonyms: [
      { word: 'supply', distinction: 'supply 多指大批量供应货物，商务与工业语境常见；provide 范围更宽，可提供抽象之物。' },
      { word: 'offer', distinction: 'offer 是主动提出给予，对方可以拒绝；provide 强调实际供给到位。' },
      { word: 'furnish', distinction: 'furnish 很正式，多用于提供信息、证据，也可指给房间配家具。' },
    ],
    level: 2,
  },

  reduce: {
    lemma: 'reduce',
    uk: '/rɪˈdjuːs/',
    us: '/rɪˈduːs/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '减少，降低（数量、程度、价格）',
        example: 'The city aims to reduce traffic in the centre by a third.',
        exampleZh: '该市的目标是把市中心的交通量减少三分之一。',
      },
      {
        pos: 'v.',
        cn: '使沦为，使变成（reduce to，多指不幸结果）',
        example: 'The fire reduced the house to ashes.',
        exampleZh: '大火把房子烧成了灰烬。',
      },
      {
        pos: 'v.',
        cn: '归纳，简化（reduce to）',
        example: 'We can reduce the argument to three main points.',
        exampleZh: '我们可以把这场论证归纳为三个要点。',
      },
    ],
    collocations: [
      { phrase: 'reduce costs', cn: '降低成本' },
      { phrase: 'reduce the risk of', cn: '降低…的风险' },
      { phrase: 'be reduced to', cn: '沦为' },
      { phrase: 'reduce by 20%', cn: '减少 20%' },
    ],
    family: ['reduces', 'reduced', 'reducing', 'reduction', 'reducible'],
    semanticNote:
      '由"往回引"出发：把数量往回引是减少，把事物往回压到某种糟糕状态是"沦为"，把复杂内容往回压成几条就是归纳。',
    synonyms: [
      { word: 'decrease', distinction: 'decrease 中性，可及物也可不及物，不带感情色彩。' },
      { word: 'cut', distinction: 'cut 口语，多指削减开支、人员、数量，动作感强。' },
      { word: 'lower', distinction: 'lower 多指降低水平、价格、声音，强调"往下移"。' },
    ],
    level: 1,
  },

  reflect: {
    lemma: 'reflect',
    uk: '/rɪˈflekt/',
    us: '/rɪˈflekt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '反映，体现（某种情况或态度）',
        example: 'The survey reflects a wider change in attitudes.',
        exampleZh: '这项调查反映了人们态度上更广泛的变化。',
      },
      {
        pos: 'v.',
        cn: '反射（光、热、声音）',
        example: 'The lake reflected the evening sky.',
        exampleZh: '湖面映出傍晚的天空。',
      },
      {
        pos: 'v.',
        cn: '认真思考（reflect on）',
        example: 'She paused to reflect on what he had said.',
        exampleZh: '她停下来细想他说过的话。',
      },
    ],
    collocations: [
      { phrase: 'reflect on', cn: '反思，细想' },
      { phrase: 'be reflected in', cn: '体现在' },
      { phrase: 'reflect a trend', cn: '反映一种趋势' },
    ],
    family: ['reflects', 'reflected', 'reflecting', 'reflection', 'reflective'],
    semanticNote:
      '本义是"折回"。光折回来是反射，事物把外界的样子折回来是反映，思路折回自己身上就是反思。',
    synonyms: [
      { word: 'show', distinction: 'show 最通用，不含"如实映射"的意味；reflect 强调"是…的写照"。' },
      { word: 'mirror', distinction: 'mirror 比喻性强，强调"像镜子一样如实呈现"，多用于文学评论。' },
      { word: 'indicate', distinction: 'indicate 依据数据或迹象"表明"，逻辑性强于 reflect。' },
    ],
    level: 2,
  },

  regard: {
    lemma: 'regard',
    uk: '/rɪˈɡɑːd/',
    us: '/rɪˈɡɑːrd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '把…看作，认为（regard as）',
        example: 'Many regard him as the finest player of his generation.',
        exampleZh: '很多人认为他是同辈中最出色的球员。',
      },
      {
        pos: 'n.',
        cn: '尊重，重视（不可数）',
        example: 'She is held in high regard by her colleagues.',
        exampleZh: '同事们非常敬重她。',
      },
      {
        pos: 'n.',
        cn: '问候（复数 regards）',
        example: 'Please give my regards to your family.',
        exampleZh: '请代我向你家人问好。',
      },
    ],
    collocations: [
      { phrase: 'regard as', cn: '把…看作' },
      { phrase: 'with regard to', cn: '关于' },
      { phrase: 'in this regard', cn: '在这方面' },
      { phrase: 'as regards', cn: '至于' },
    ],
    family: ['regards', 'regarded', 'regarding'],
    semanticNote:
      '由"看"出发：怎么看一个人就是怎么评价他（视为），带着敬意的看是尊重，托人带去的"看一眼"就是问候。',
    synonyms: [
      { word: 'consider', distinction: 'consider 可直接接宾语补足语（consider him clever），regard 必须借 as。' },
      { word: 'view', distinction: 'view 较正式，也需接 as，语气更接近"持某种看法"。' },
      { word: 'deem', distinction: 'deem 极正式，多见于法律文书与评论文章。' },
    ],
    level: 2,
  },

  require: {
    lemma: 'require',
    uk: '/rɪˈkwaɪə(r)/',
    us: '/rɪˈkwaɪər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '需要（客观必需）',
        example: 'The job requires patience and a good memory.',
        exampleZh: '这份工作需要耐心和好记性。',
      },
      {
        pos: 'v.',
        cn: '规定，要求（正式，常用被动）',
        example: 'All passengers are required to show identification.',
        exampleZh: '所有乘客都须出示身份证件。',
      },
    ],
    collocations: [
      { phrase: 'require attention', cn: '需要注意' },
      { phrase: 'be required to do', cn: '被要求做' },
      { phrase: 'as required', cn: '按要求' },
      { phrase: 'meet the requirements', cn: '符合要求' },
    ],
    family: ['requires', 'required', 'requiring', 'requirement'],
    semanticNote:
      '与 need 的差别在"来源"：require 常暗示要求来自规则、职位或事物本身的性质，所以多出现在规章、说明书、招聘启事里。',
    synonyms: [
      { word: 'need', distinction: 'need 最口语，主语可以是人或物；require 更正式，主语多为事物或规则。' },
      { word: 'demand', distinction: 'demand 带强硬语气与情绪，主语多为人。' },
      { word: 'necessitate', distinction: 'necessitate 极正式，指"必然使得某事成为必需"。' },
    ],
    level: 2,
  },

  respond: {
    lemma: 'respond',
    uk: '/rɪˈspɒnd/',
    us: '/rɪˈspɑːnd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '回答，回应（respond to）',
        example: 'He responded to the question with a shrug.',
        exampleZh: '他对这个问题只是耸了耸肩。',
      },
      {
        pos: 'v.',
        cn: '作出反应（对治疗、变化、刺激）',
        example: 'The patient is responding well to treatment.',
        exampleZh: '病人对治疗反应良好。',
      },
    ],
    collocations: [
      { phrase: 'respond to', cn: '回应；对…作出反应' },
      { phrase: 'respond well to treatment', cn: '对治疗反应良好' },
      { phrase: 'in response to', cn: '作为对…的回应' },
    ],
    family: ['responds', 'responded', 'responding', 'response', 'responsive', 'respondent'],
    semanticNote:
      '由"回话"扩展到"回以行动"：用语言回是回答，用身体或系统回就是"有反应"，如病人对药物的反应、市场对政策的反应。',
    synonyms: [
      { word: 'reply', distinction: 'reply 多指口头或书面答复，常接 to 或直接引语。' },
      { word: 'answer', distinction: 'answer 最通用，可直接接宾语（answer the question）。' },
      { word: 'react', distinction: 'react 强调本能或情绪上的反应，常含"来不及思考"。' },
    ],
    level: 2,
  },

  reveal: {
    lemma: 'reveal',
    uk: '/rɪˈviːl/',
    us: '/rɪˈviːl/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '揭示，透露（此前不为人知的事）',
        example: 'The documents reveal how the decision was made.',
        exampleZh: '这些文件揭示了决定是如何作出的。',
      },
      {
        pos: 'v.',
        cn: '露出，显出（原本被遮住）',
        example: 'The curtain rose to reveal an empty stage.',
        exampleZh: '幕布升起，露出空荡荡的舞台。',
      },
    ],
    collocations: [
      { phrase: 'reveal that…', cn: '揭示…' },
      { phrase: 'reveal the truth', cn: '揭示真相' },
      { phrase: 'reveal a preference', cn: '显露出偏好' },
    ],
    family: ['reveals', 'revealed', 'revealing', 'revelation'],
    semanticNote:
      '由"拉开帷幕"出发：把遮着的东西拉开是露出，把藏着的信息拉开就是揭露。所以它的宾语总是"此前被遮住的"。',
    synonyms: [
      { word: 'disclose', distinction: 'disclose 正式，多指公开本应保密的信息，如财务、合同细节。' },
      { word: 'show', distinction: 'show 通用，不含"此前隐藏"的前提。' },
      { word: 'expose', distinction: 'expose 揭露丑事或危险，常含使当事人难堪、受损之意。' },
    ],
    level: 2,
  },

  significant: {
    lemma: 'significant',
    uk: '/sɪɡˈnɪfɪkənt/',
    us: '/sɪɡˈnɪfɪkənt/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '重要的，重大的',
        example: 'The study found a significant difference between the two groups.',
        exampleZh: '研究发现两组之间存在显著差异。',
      },
      {
        pos: 'adj.',
        cn: '显著的，可观的（数量、程度）',
        example: 'There has been a significant increase in applications.',
        exampleZh: '申请人数大幅增加。',
      },
      {
        pos: 'adj.',
        cn: '意味深长的（眼神、停顿）',
        example: 'She gave him a significant look.',
        exampleZh: '她意味深长地看了他一眼。',
      },
    ],
    collocations: [
      { phrase: 'a significant difference', cn: '显著差异' },
      { phrase: 'statistically significant', cn: '统计上显著的' },
      { phrase: 'significant progress', cn: '重大进展' },
      { phrase: 'a significant number of', cn: '相当数量的' },
    ],
    family: ['significantly', 'significance', 'insignificant'],
    semanticNote:
      '由"带有意义"出发：意义大就是重要，大到肉眼可见就是显著，眼神里带着意思就是意味深长。注意统计学里的 significant 只表示"不太可能出于偶然"，不等于"重要"。',
    synonyms: [
      { word: 'important', distinction: 'important 最通用、最口语；significant 更书面，且可指"数量上可观"。' },
      { word: 'considerable', distinction: 'considerable 只谈数量或程度大，不含"重要性"判断。' },
      { word: 'substantial', distinction: 'substantial 指"实质性的、份量足的"，多修饰增长、证据、份额。' },
    ],
    level: 2,
  },

  source: {
    lemma: 'source',
    uk: '/sɔːs/',
    us: '/sɔːrs/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '来源，出处（信息、能源、收入、问题）',
        example: 'The report names tourism as the main source of income.',
        exampleZh: '报告把旅游业列为主要的收入来源。',
      },
      {
        pos: 'n.',
        cn: '源头（河流的）',
        example: 'They followed the river up to its source.',
        exampleZh: '他们沿着河一直走到源头。',
      },
      {
        pos: 'v.',
        cn: '采购，寻求货源',
        example: 'The company sources its coffee from small farms.',
        exampleZh: '这家公司的咖啡采购自小型农场。',
      },
    ],
    collocations: [
      { phrase: 'a source of income', cn: '收入来源' },
      { phrase: 'source of energy', cn: '能源' },
      { phrase: 'according to sources', cn: '据消息人士称' },
      { phrase: 'a reliable source', cn: '可靠来源' },
    ],
    family: ['sources', 'sourced', 'sourcing'],
    semanticNote:
      '由"泉水涌出之处"出发：水涌出的地方是源头，信息、能源、问题涌出的地方是来源，商品"涌进来"的地方就是货源。',
    synonyms: [
      { word: 'origin', distinction: 'origin 强调最初的起点，多用于事物、人群、词汇的起源。' },
      { word: 'root', distinction: 'root 多指问题的根本原因，比喻"根"。' },
      { word: 'cause', distinction: 'cause 强调因果链条中的直接原因。' },
    ],
    level: 2,
  },

  structure: {
    lemma: 'structure',
    uk: '/ˈstrʌktʃə(r)/',
    us: '/ˈstrʌktʃər/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '结构，构造（各部分如何组合）',
        example: 'The structure of the essay is easy to follow.',
        exampleZh: '这篇文章的结构很清楚。',
      },
      {
        pos: 'n.',
        cn: '建筑物，构造物',
        example: 'The old structure has been turned into a museum.',
        exampleZh: '这座老建筑已被改建成博物馆。',
      },
      {
        pos: 'v.',
        cn: '组织，安排（使有条理）',
        example: 'The course is structured around weekly projects.',
        exampleZh: '这门课以每周的项目为线索组织。',
      },
    ],
    collocations: [
      { phrase: 'social structure', cn: '社会结构' },
      { phrase: 'organizational structure', cn: '组织结构' },
      { phrase: 'a well-structured essay', cn: '结构清晰的文章' },
    ],
    family: ['structures', 'structured', 'structuring', 'structural'],
    semanticNote:
      '由"建造"出发：盖起来的东西是建筑物，盖的方式是结构，按某种方式搭起来就是"组织、安排"。',
    synonyms: [
      { word: 'framework', distinction: 'framework 指支撑性的框架，比喻性强，常用于理论、制度。' },
      { word: 'organization', distinction: 'organization 多指机构，也可指安排方式，但不指实体建筑物。' },
      { word: 'construction', distinction: 'construction 指建造过程，或不可数地指建筑业。' },
    ],
    level: 2,
  },

  submit: {
    lemma: 'submit',
    uk: '/səbˈmɪt/',
    us: '/səbˈmɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '提交，呈递（文件、申请、论文）',
        example: 'Applications must be submitted by 31 May.',
        exampleZh: '申请须在 5 月 31 日前提交。',
      },
      {
        pos: 'v.',
        cn: '屈服，顺从（submit to）',
        example: 'He refused to submit to the pressure.',
        exampleZh: '他拒绝屈服于压力。',
      },
      {
        pos: 'v.',
        cn: '主张，认为（法律用语）',
        example: 'Counsel submitted that the evidence was unreliable.',
        exampleZh: '辩护律师主张该证据不可靠。',
      },
    ],
    collocations: [
      { phrase: 'submit an application', cn: '提交申请' },
      { phrase: 'submit to', cn: '屈服于' },
      { phrase: 'submit a report', cn: '提交报告' },
    ],
    family: ['submits', 'submitted', 'submitting', 'submission'],
    semanticNote:
      '由"送到下面"出发：把文件送到上级手里是提交，把自己放到别人下面就是屈服；把看法送到法官面前，就是法律意义上的"主张"。',
    synonyms: [
      { word: 'hand in', distinction: 'hand in 口语，多指交作业、交表格。' },
      { word: 'present', distinction: 'present 正式呈交，含"当面展示"之意。' },
      { word: 'yield', distinction: 'yield 指让步、屈服，也可指产出。' },
    ],
    level: 3,
  },

  suggest: {
    lemma: 'suggest',
    uk: '/səˈdʒest/',
    us: '/səˈdʒest/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '建议（后接动名词或 that 从句，从句用虚拟语气）',
        example: 'I suggest taking the earlier train.',
        exampleZh: '我建议坐早一班火车。',
      },
      {
        pos: 'v.',
        cn: '表明，暗示（不直接说出）',
        example: 'The evidence suggests that the trend is slowing.',
        exampleZh: '证据表明这一趋势正在放缓。',
      },
    ],
    collocations: [
      { phrase: 'suggest doing sth', cn: '建议做某事' },
      { phrase: 'suggest that…', cn: '建议/表明…' },
      { phrase: 'I suggest that you', cn: '我建议你' },
    ],
    family: ['suggests', 'suggested', 'suggesting', 'suggestion', 'suggestive'],
    semanticNote:
      '由"在下面递上来"出发：把想法递到别人面前是建议，让事实自己把结论递出来就是表明。第二条义项的主语常是 evidence、data、study。',
    synonyms: [
      { word: 'propose', distinction: 'propose 更正式，多指正式提出方案、动议。' },
      { word: 'recommend', distinction: 'recommend 含"我认为这样更好"的判断，带推荐意味。' },
      { word: 'imply', distinction: 'imply 指说话人暗示、由听者自行推断，主语多为人或话语。' },
    ],
    level: 2,
  },

  support: {
    lemma: 'support',
    uk: '/səˈpɔːt/',
    us: '/səˈpɔːrt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '支持，赞成（观点、计划、人）',
        example: 'Most residents support the plan.',
        exampleZh: '多数居民支持这项计划。',
      },
      {
        pos: 'v.',
        cn: '支撑（重量、结构）',
        example: 'The roof is supported by steel beams.',
        exampleZh: '屋顶由钢梁支撑。',
      },
      {
        pos: 'v.',
        cn: '供养，养活',
        example: 'She supports two children on a single salary.',
        exampleZh: '她靠一份工资养活两个孩子。',
      },
    ],
    collocations: [
      { phrase: 'support a claim', cn: '支持某一主张' },
      { phrase: 'financial support', cn: '经济支持' },
      { phrase: 'in support of', cn: '支持；为支持…' },
      { phrase: 'support a family', cn: '养家' },
    ],
    family: ['supports', 'supported', 'supporting', 'supportive', 'supporter'],
    semanticNote:
      '由"从下面托住"出发：托住重量是支撑，托住一个主张是支持，托住一家人的生活就是供养。名词 support 同时保留"支持"与"支架"两义。',
    synonyms: [
      { word: 'back', distinction: 'back 多指资金支持或公开表态，口语常用。' },
      { word: 'sustain', distinction: 'sustain 强调提供持续的能量或资源使延续。' },
      { word: 'uphold', distinction: 'uphold 多指维护法律、原则、判决，正式。' },
    ],
    level: 1,
  },

  tend: {
    lemma: 'tend',
    uk: '/tend/',
    us: '/tend/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '倾向于，往往会（tend to do）',
        example: 'People tend to overestimate how much they can do in a day.',
        exampleZh: '人们往往高估自己一天能做完的事。',
      },
      {
        pos: 'v.',
        cn: '照料，照管（tend to sb / tend the garden）',
        example: 'She tends the garden every morning.',
        exampleZh: '她每天早上打理花园。',
      },
    ],
    collocations: [
      { phrase: 'tend to do', cn: '往往会' },
      { phrase: 'tend towards', cn: '倾向于' },
      { phrase: 'tend to sb', cn: '照料某人' },
    ],
    family: ['tends', 'tended', 'tending', 'tendency'],
    semanticNote:
      '两条义项都源自"伸向"：心思伸向某处就是"倾向于"，注意力伸向某物并照看它就是"照料"。',
    synonyms: [
      { word: 'be inclined to', distinction: 'be inclined to 较正式，强调意愿上的偏向。' },
      { word: 'be likely to', distinction: 'be likely to 只谈概率，不含"习惯成自然"的意味。' },
      { word: 'look after', distinction: 'look after 最通用的"照顾"，tend 更书面，多用于花园、病人、机器。' },
    ],
    level: 2,
  },

  transform: {
    lemma: 'transform',
    uk: '/trænsˈfɔːm/',
    us: '/trænsˈfɔːrm/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '使彻底改变，改造（面貌一新）',
        example: 'The internet has transformed the way we shop.',
        exampleZh: '互联网彻底改变了我们的购物方式。',
      },
      {
        pos: 'v.',
        cn: '转化（能量、数据的形式）',
        example: 'The device transforms sunlight into electricity.',
        exampleZh: '这个装置把阳光转化为电能。',
      },
    ],
    collocations: [
      { phrase: 'transform into', cn: '转变成' },
      { phrase: 'transform the way', cn: '改变…的方式' },
      { phrase: 'digital transformation', cn: '数字化转型' },
    ],
    family: ['transforms', 'transformed', 'transforming', 'transformation', 'transformer'],
    semanticNote:
      '由"改变形状"出发：改变外形是改造，改变能量的形式是转化。它比 change 力度大，强调"面目一新、性质不同"。',
    synonyms: [
      { word: 'change', distinction: 'change 最通用，程度可大可小；transform 强调根本性、整体性的改变。' },
      { word: 'convert', distinction: 'convert 多指形式、用途、信仰的转换，常接 into。' },
      { word: 'alter', distinction: 'alter 指部分改动，本质不变，多用于衣服、计划、立场。' },
    ],
    level: 3,
  },

  vary: {
    lemma: 'vary',
    uk: '/ˈveəri/',
    us: '/ˈveri/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '变化，彼此不同（因条件而异）',
        example: 'Prices vary from shop to shop.',
        exampleZh: '各家店的价格不一样。',
      },
      {
        pos: 'v.',
        cn: '使多样化，变换',
        example: 'She varies her routine to stay motivated.',
        exampleZh: '她变换日常安排，以保持干劲。',
      },
    ],
    collocations: [
      { phrase: 'vary from…to…', cn: '从…到…不等' },
      { phrase: 'vary widely', cn: '差别很大' },
      { phrase: 'vary in size', cn: '大小不一' },
    ],
    family: ['varies', 'varied', 'varying', 'variety', 'various', 'variation', 'variable'],
    semanticNote:
      '由"改变"出发：自己变是变化，彼此之间不一样是"有差异"，主动去变就是"使多样化"。不及物时几乎总与 from…to… 或 in 搭配。',
    synonyms: [
      { word: 'differ', distinction: 'differ 只强调彼此不同，不涉及"随条件变化"的过程。' },
      { word: 'fluctuate', distinction: 'fluctuate 指上下波动，多用于价格、温度、数据。' },
      { word: 'range', distinction: 'range 指在某一范围内变动，常与 from…to… 连用，强调跨度。' },
    ],
    level: 2,
  },

  adapt: {
    lemma: 'adapt',
    uk: '/əˈdæpt/',
    us: '/əˈdæpt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '适应（adapt to 新环境、变化）',
        example: 'It took her a year to adapt to the new climate.',
        exampleZh: '她花了一年才适应新的气候。',
      },
      {
        pos: 'v.',
        cn: '改编，改写（为另一种用途或媒介）',
        example: 'The novel was adapted for television.',
        exampleZh: '这部小说被改编成了电视剧。',
      },
    ],
    collocations: [
      { phrase: 'adapt to', cn: '适应' },
      { phrase: 'be adapted from', cn: '改编自' },
      { phrase: 'adapt quickly', cn: '迅速适应' },
    ],
    family: ['adapts', 'adapted', 'adapting', 'adaptation', 'adaptable', 'adaptive'],
    semanticNote:
      '由"使合适"出发：让自己变得合适是适应，让作品变得适合另一种媒介是改编。注意与 adopt（采纳、收养）只差一个字母。',
    synonyms: [
      { word: 'adjust', distinction: 'adjust 的改动通常较小，指微调到合适状态。' },
      { word: 'accommodate', distinction: 'accommodate 指为他人作出调整、迁就，也可指容纳。' },
      { word: 'modify', distinction: 'modify 指修改物件或方案，不含"适应环境"之意。' },
    ],
    level: 2,
  },

  adjust: {
    lemma: 'adjust',
    uk: '/əˈdʒʌst/',
    us: '/əˈdʒʌst/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '调整，调节（略微改动使之合适）',
        example: 'You can adjust the seat height with this lever.',
        exampleZh: '你可以用这个手柄调节座椅高度。',
      },
      {
        pos: 'v.',
        cn: '适应（adjust to 新情况）',
        example: 'It takes time to adjust to working nights.',
        exampleZh: '适应上夜班需要时间。',
      },
    ],
    collocations: [
      { phrase: 'adjust to', cn: '适应' },
      { phrase: 'adjust the settings', cn: '调整设置' },
      { phrase: 'adjust for inflation', cn: '按通胀调整' },
    ],
    family: ['adjusts', 'adjusted', 'adjusting', 'adjustment', 'adjustable'],
    semanticNote:
      '由"使正好对上"出发：把物件调到位是调节，把自己调到新环境里是适应。改动幅度通常小于 adapt，更多是微调。',
    synonyms: [
      { word: 'adapt', distinction: 'adapt 的改动更大，含"改造自身以适应"之意；adjust 多为小幅调节。' },
      { word: 'modify', distinction: 'modify 指修改设计、方案、措辞，目的不一定是"适应"。' },
      { word: 'tune', distinction: 'tune 指调音、调校机器，专业感强。' },
    ],
    level: 2,
  },

  adopt: {
    lemma: 'adopt',
    uk: '/əˈdɒpt/',
    us: '/əˈdɑːpt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '采用，采纳（方法、政策、建议）',
        example: 'The school adopted a new reading programme.',
        exampleZh: '学校采用了一套新的阅读课程。',
      },
      {
        pos: 'v.',
        cn: '收养（子女）',
        example: 'They adopted a girl from the same town.',
        exampleZh: '他们收养了一个同镇的姑娘。',
      },
      {
        pos: 'v.',
        cn: '采取（态度、姿态、语气）',
        example: 'He adopted a relaxed tone.',
        exampleZh: '他换上了一副轻松的语气。',
      },
    ],
    collocations: [
      { phrase: 'adopt a policy', cn: '采用政策' },
      { phrase: 'adopt an approach', cn: '采取方法' },
      { phrase: 'adopted child', cn: '养子女' },
    ],
    family: ['adopts', 'adopted', 'adopting', 'adoption', 'adoptive'],
    semanticNote:
      '由"挑过来作为自己的"出发：把方法挑过来用是采用，把孩子挑过来养是收养，把某种姿态挑过来摆上就是"采取"。',
    synonyms: [
      { word: 'embrace', distinction: 'embrace 指欣然接受新观念、新技术，含热情。' },
      { word: 'take up', distinction: 'take up 口语，指开始采用某做法或从事某活动。' },
      { word: 'employ', distinction: 'employ 正式，指使用某种方法、手段，也可指雇用。' },
    ],
    level: 2,
  },

  affect: {
    lemma: 'affect',
    uk: '/əˈfekt/',
    us: '/əˈfekt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '影响（多指受到不利影响）',
        example: 'The strike affected thousands of commuters.',
        exampleZh: '罢工影响了几千名通勤者。',
      },
      {
        pos: 'v.',
        cn: '使感动，触动（情绪）',
        example: 'She was deeply affected by the letter.',
        exampleZh: '那封信让她深受触动。',
      },
    ],
    collocations: [
      { phrase: 'be affected by', cn: '受…影响' },
      { phrase: 'affect performance', cn: '影响表现' },
      { phrase: 'be deeply affected', cn: '深受触动' },
    ],
    family: ['affects', 'affected', 'affecting', 'affection', 'affective'],
    semanticNote:
      '与 effect 的分工必须记牢：affect 是动词"影响"，effect 通常是名词"影响、效果"（have an effect on）。"感动"义是"情绪被触动"，与"影响"同源。',
    synonyms: [
      { word: 'influence', distinction: 'influence 常指潜移默化地影响人的想法或决定，语气较温和。' },
      { word: 'impact', distinction: 'impact 作动词力度更强，多指重大冲击，英式常接 on。' },
      { word: 'touch', distinction: 'touch 的"感动"义情感色彩更浓，多指打动人心。' },
    ],
    level: 2,
  },

  benefit: {
    lemma: 'benefit',
    uk: '/ˈbenɪfɪt/',
    us: '/ˈbenɪfɪt/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '好处，益处（可数）',
        example: 'One benefit of cycling is that it costs almost nothing.',
        exampleZh: '骑车的好处之一是几乎不花钱。',
      },
      {
        pos: 'v.',
        cn: '使受益；得益于（benefit from）',
        example: 'Small firms will benefit most from the tax cut.',
        exampleZh: '小企业将从减税中获益最多。',
      },
      {
        pos: 'n.',
        cn: '福利，救济金（英式，不可数）',
        example: 'She lives on unemployment benefit.',
        exampleZh: '她靠失业救济金生活。',
      },
    ],
    collocations: [
      { phrase: 'benefit from', cn: '从…中受益' },
      { phrase: 'for the benefit of', cn: '为了…的利益' },
      { phrase: 'health benefits', cn: '健康益处' },
      { phrase: 'mutual benefit', cn: '互惠' },
    ],
    family: ['benefits', 'benefited', 'benefiting', 'beneficial', 'beneficiary'],
    semanticNote:
      '由"善行"引申为"好处"：个人得到的好处是益处，国家给予的善行是福利金。动词要注意方向：benefit sb 是使某人受益，benefit from 是自身受益。',
    synonyms: [
      { word: 'advantage', distinction: 'advantage 含"比别人占优"之意，常与 over 连用。' },
      { word: 'profit', distinction: 'profit 多指金钱上的利润。' },
      { word: 'gain', distinction: 'gain 指获得的增量或好处，可作名词与动词。' },
    ],
    level: 2,
  },

  challenge: {
    lemma: 'challenge',
    uk: '/ˈtʃælɪndʒ/',
    us: '/ˈtʃælɪndʒ/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '挑战，难题（需要努力才能应对）',
        example: 'Learning to read in a second language is a real challenge.',
        exampleZh: '用第二语言学习阅读是真正的挑战。',
      },
      {
        pos: 'v.',
        cn: '对…提出质疑',
        example: 'Several economists have challenged the findings.',
        exampleZh: '几位经济学家对这些结论提出了质疑。',
      },
      {
        pos: 'v.',
        cn: '向…挑战，激将',
        example: 'He challenged me to a game of chess.',
        exampleZh: '他挑我和他下一盘棋。',
      },
    ],
    collocations: [
      { phrase: 'face a challenge', cn: '面对挑战' },
      { phrase: 'challenge an assumption', cn: '质疑某个假设' },
      { phrase: 'a challenging task', cn: '有挑战性的任务' },
      { phrase: 'rise to the challenge', cn: '迎难而上' },
    ],
    family: ['challenges', 'challenged', 'challenging'],
    semanticNote:
      '由"提出异议"出发：提出异议是质疑，把异议摆到对方面前要求应战是挑战，而摆在面前的难题本身也叫挑战。',
    synonyms: [
      { word: 'question', distinction: 'question 的质疑语气较温和，多为"表示怀疑"。' },
      { word: 'dispute', distinction: 'dispute 指争论并拒不承认，语气更强。' },
      { word: 'dare', distinction: 'dare 是口语化的激将，带挑衅意味。' },
    ],
    level: 2,
  },

  compare: {
    lemma: 'compare',
    uk: '/kəmˈpeə(r)/',
    us: '/kəmˈper/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '比较，对比（compare with / compare A and B）',
        example: 'The report compares rural and urban schools.',
        exampleZh: '报告对农村和城市学校作了比较。',
      },
      {
        pos: 'v.',
        cn: '把…比作（compare to）',
        example: 'Critics compared the film to a long dream.',
        exampleZh: '评论家把这部电影比作一场漫长的梦。',
      },
    ],
    collocations: [
      { phrase: 'compared with', cn: '与…相比' },
      { phrase: 'compare A with B', cn: '比较 A 和 B' },
      { phrase: 'beyond compare', cn: '无与伦比' },
    ],
    family: ['compares', 'compared', 'comparing', 'comparison', 'comparable', 'comparative'],
    semanticNote:
      'compare with 侧重"找出异同"，compare to 侧重"说成同一类"；但现代英语中两者已大量混用。compared with/to 作状语时意为"与…相比"。',
    synonyms: [
      { word: 'contrast', distinction: 'contrast 强调差异与反差，常与 with 连用。' },
      { word: 'liken', distinction: 'liken 正式，只能表示"比作"，必须接 to。' },
      { word: 'match', distinction: 'match 指与…相匹敌、相配，不含"比较异同"的过程。' },
    ],
    level: 2,
  },

  conclude: {
    lemma: 'conclude',
    uk: '/kənˈkluːd/',
    us: '/kənˈkluːd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '得出结论，断定',
        example: 'The authors conclude that the policy has failed.',
        exampleZh: '作者们得出结论：这项政策失败了。',
      },
      {
        pos: 'v.',
        cn: '结束，终止',
        example: 'The concert concluded with a familiar song.',
        exampleZh: '音乐会以一首大家熟悉的歌结束。',
      },
      {
        pos: 'v.',
        cn: '缔结（条约、协议）',
        example: 'The two sides concluded an agreement in June.',
        exampleZh: '双方于六月缔结了协议。',
      },
    ],
    collocations: [
      { phrase: 'conclude that…', cn: '得出结论…' },
      { phrase: 'to conclude', cn: '最后（用于总结）' },
      { phrase: 'conclude an agreement', cn: '缔结协议' },
    ],
    family: ['concludes', 'concluded', 'concluding', 'conclusion', 'conclusive'],
    semanticNote:
      '由"关上"出发：把讨论关上就是结束，关上之后剩下的那句话就是结论，把谈判关上就是缔结。',
    synonyms: [
      { word: 'infer', distinction: 'infer 强调由证据推理得出，突出推理过程。' },
      { word: 'deduce', distinction: 'deduce 指演绎推理，正式，多用于逻辑、侦探语境。' },
      { word: 'finish', distinction: 'finish 最通用，只表示结束，不含"得出判断"。' },
    ],
    level: 2,
  },

  confirm: {
    lemma: 'confirm',
    uk: '/kənˈfɜːm/',
    us: '/kənˈfɜːrm/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '证实，确认（使确定无疑）',
        example: 'The results confirm what earlier studies had suggested.',
        exampleZh: '这些结果证实了此前研究的推测。',
      },
      {
        pos: 'v.',
        cn: '确认（预订、安排不再变动）',
        example: 'Please confirm your booking by email.',
        exampleZh: '请通过邮件确认您的预订。',
      },
    ],
    collocations: [
      { phrase: 'confirm that…', cn: '证实…' },
      { phrase: 'confirm a booking', cn: '确认预订' },
      { phrase: 'confirmed by', cn: '由…证实' },
    ],
    family: ['confirms', 'confirmed', 'confirming', 'confirmation'],
    semanticNote:
      '由"使坚固"出发：让一个说法变坚固是证实，让一个安排变坚固（不再变动）就是确认预订。',
    synonyms: [
      { word: 'verify', distinction: 'verify 强调通过核查程序来证实，多用于数据、身份。' },
      { word: 'prove', distinction: 'prove 语气最强，指确凿无疑地证明。' },
      { word: 'validate', distinction: 'validate 指使生效、予以认可，多用于票据、理论、感受。' },
    ],
    level: 2,
  },

  consider: {
    lemma: 'consider',
    uk: '/kənˈsɪdə(r)/',
    us: '/kənˈsɪdər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '考虑（做某事，后接动名词）',
        example: 'We are considering moving abroad.',
        exampleZh: '我们在考虑移居国外。',
      },
      {
        pos: 'v.',
        cn: '认为，把…视为',
        example: 'Many consider him the best in the field.',
        exampleZh: '很多人认为他是这一领域最出色的人。',
      },
    ],
    collocations: [
      { phrase: 'consider doing sth', cn: '考虑做某事' },
      { phrase: 'be considered as', cn: '被视为' },
      { phrase: 'all things considered', cn: '全面考虑之后' },
    ],
    family: ['considers', 'considered', 'considering', 'consideration', 'considerable', 'considerate'],
    semanticNote:
      '由"仔细端详"出发：把事情放在眼前反复看是考虑，看完给出评价就是认为。语法上记牢 consider doing，不接不定式。',
    synonyms: [
      { word: 'contemplate', distinction: 'contemplate 更书面，含"长久、沉静地思量"之意。' },
      { word: 'regard', distinction: 'regard 表"视为"时必须借 as，不能直接接补语。' },
      { word: 'think about', distinction: 'think about 口语，最随意，也可指"想起"。' },
    ],
    level: 2,
  },

  contain: {
    lemma: 'contain',
    uk: '/kənˈteɪn/',
    us: '/kənˈteɪn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '包含，容纳（内部装有）',
        example: 'The box contains old photographs and letters.',
        exampleZh: '盒子里装着旧照片和信件。',
      },
      {
        pos: 'v.',
        cn: '控制，抑制（使不扩散）',
        example: 'Firefighters are still trying to contain the blaze.',
        exampleZh: '消防员仍在设法控制火势。',
      },
    ],
    collocations: [
      { phrase: 'contain information', cn: '包含信息' },
      { phrase: 'contain the spread', cn: '控制蔓延' },
      { phrase: 'contain costs', cn: '控制成本' },
    ],
    family: ['contains', 'contained', 'containing', 'container', 'containment'],
    semanticNote:
      '由"一起握住"出发：把东西握在容器里是包含，把火、情绪、疫情握在范围内不让扩散就是控制。',
    synonyms: [
      { word: 'include', distinction: 'include 只是列举整体中的一部分，不强调"装在内部"。' },
      { word: 'hold', distinction: 'hold 强调容量，指"能装得下"。' },
      { word: 'restrain', distinction: 'restrain 多指抑制人的冲动或行为，含克制意味。' },
    ],
    level: 2,
  },

  contrast: {
    lemma: 'contrast',
    uk: '/ˈkɒntrɑːst/',
    us: '/ˈkɑːntræst/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '对比，反差（差异本身）',
        example: 'There is a sharp contrast between the two regions.',
        exampleZh: '这两个地区之间反差鲜明。',
      },
      {
        pos: 'v.',
        cn: '对照；与…形成对比（contrast with）',
        example: 'His calm manner contrasts with her nervous energy.',
        exampleZh: '他的沉稳与她的紧张形成了对比。',
      },
    ],
    collocations: [
      { phrase: 'in contrast', cn: '相比之下' },
      { phrase: 'by contrast', cn: '相比之下' },
      { phrase: 'contrast with', cn: '与…形成对比' },
      { phrase: 'a sharp contrast', cn: '鲜明对比' },
    ],
    family: ['contrasts', 'contrasted', 'contrasting', 'contrastive'],
    semanticNote:
      '由"站在对面"出发：把两样东西摆在对立面看，差异就显出来。注意重音：名词在前 /ˈkɒntrɑːst/，动词在后 /kənˈtrɑːst/。',
    synonyms: [
      { word: 'compare', distinction: 'compare 中性，既可比异也可比同；contrast 只强调差异。' },
      { word: 'difference', distinction: 'difference 指差异本身，不带"刻意并置"的意味。' },
      { word: 'distinction', distinction: 'distinction 多指概念上需要区分的差别。' },
    ],
    level: 3,
  },

  convince: {
    lemma: 'convince',
    uk: '/kənˈvɪns/',
    us: '/kənˈvɪns/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '使确信（convince sb of sth / that 从句）',
        example: 'The evidence convinced the jury that he was innocent.',
        exampleZh: '证据使陪审团相信他是无辜的。',
      },
      {
        pos: 'v.',
        cn: '说服（某人做某事，美式常作 convince sb to do）',
        example: 'She convinced him to see a doctor.',
        exampleZh: '她说服他去看了医生。',
      },
    ],
    collocations: [
      { phrase: 'be convinced that…', cn: '确信…' },
      { phrase: 'convince sb of sth', cn: '使某人相信某事' },
      { phrase: 'a convincing argument', cn: '有说服力的论证' },
    ],
    family: ['convinces', 'convinced', 'convincing', 'conviction'],
    semanticNote:
      '由"彻底战胜"出发：把对方的怀疑打赢了，他就"确信"了；让他由此采取行动，就是"说服"。英式传统上把"说服去做"留给 persuade。',
    synonyms: [
      { word: 'persuade', distinction: 'persuade 强调说服成功并促成行动，英式常接 to do；convince 更偏"使人相信"。' },
      { word: 'assure', distinction: 'assure 是向人保证、消除其担忧，宾语必须是人。' },
      { word: 'satisfy', distinction: 'satisfy 指证据充分使人不再怀疑，语气较平。' },
    ],
    level: 3,
  },

  create: {
    lemma: 'create',
    uk: '/kriˈeɪt/',
    us: '/kriˈeɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '创造，创作（使原本不存在的东西出现）',
        example: 'The artist created the piece from recycled metal.',
        exampleZh: '这位艺术家用回收金属创作了这件作品。',
      },
      {
        pos: 'v.',
        cn: '造成，引起（问题、印象、气氛）',
        example: 'The delay created a lot of bad feeling.',
        exampleZh: '这次延误引起了很多不满。',
      },
    ],
    collocations: [
      { phrase: 'create jobs', cn: '创造就业' },
      { phrase: 'create an impression', cn: '留下印象' },
      { phrase: 'create opportunities', cn: '创造机会' },
    ],
    family: ['creates', 'created', 'creating', 'creation', 'creative', 'creativity', 'creator'],
    semanticNote:
      '由"使生长"出发：让原本没有的东西出现是创造，让某种局面出现就是造成。第二条义项的主语常是事件，而不是人。',
    synonyms: [
      { word: 'make', distinction: 'make 最通用，不强调创造性；create 强调"从无到有"。' },
      { word: 'produce', distinction: 'produce 强调生产的过程与产出，多用于实物。' },
      { word: 'generate', distinction: 'generate 强调由某种机制产出，多用于能源、收入、数据。' },
    ],
    level: 1,
  },

  define: {
    lemma: 'define',
    uk: '/dɪˈfaɪn/',
    us: '/dɪˈfaɪn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '给…下定义，界定（含义）',
        example: 'The term is hard to define precisely.',
        exampleZh: '这个术语很难精确定义。',
      },
      {
        pos: 'v.',
        cn: '明确，划定（范围、职责、界限）',
        example: 'The contract defines what each party must do.',
        exampleZh: '合同明确了各方必须做什么。',
      },
      {
        pos: 'v.',
        cn: '决定…的性质，成为…的特征',
        example: 'Her early years defined the rest of her life.',
        exampleZh: '她的早年经历决定了她此后的人生。',
      },
    ],
    collocations: [
      { phrase: 'clearly defined', cn: '明确界定的' },
      { phrase: 'define the scope', cn: '界定范围' },
      { phrase: 'be defined as', cn: '被定义为' },
    ],
    family: ['defines', 'defined', 'defining', 'definition', 'definite', 'definitive'],
    semanticNote:
      '由"划定边界"出发：划出含义的范围就是下定义，划清职责就是明确，而把一个人的边界划出来、决定他是什么样的人，就是"塑造其性质"。',
    synonyms: [
      { word: 'describe', distinction: 'describe 只是描述，不要求划出精确边界。' },
      { word: 'specify', distinction: 'specify 指明确规定细节，多用于合同、要求。' },
      { word: 'characterize', distinction: 'characterize 指"成为…的特征"，多用于描述整体属性。' },
    ],
    level: 3,
  },

  depend: {
    lemma: 'depend',
    uk: '/dɪˈpend/',
    us: '/dɪˈpend/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '取决于（depend on 某条件）',
        example: 'The answer depends on how you measure success.',
        exampleZh: '答案取决于你如何衡量成功。',
      },
      {
        pos: 'v.',
        cn: '依靠，依赖（depend on 某人或某物）',
        example: 'Many families depend on one income.',
        exampleZh: '许多家庭只靠一份收入生活。',
      },
    ],
    collocations: [
      { phrase: 'depend on', cn: '取决于；依靠' },
      { phrase: 'it depends', cn: '视情况而定' },
      { phrase: 'dependent on', cn: '依赖于' },
    ],
    family: ['depends', 'depended', 'depending', 'dependence', 'dependent', 'dependable'],
    semanticNote:
      '由"悬挂在…下面"出发：挂在一根绳子上就是依赖，事情挂在某个条件上就是取决于。两条义项其实是同一个"挂着"。',
    synonyms: [
      { word: 'rely', distinction: 'rely 含"信任地依靠"之意，多接 on，主语多为人。' },
      { word: 'count on', distinction: 'count on 口语，指"指望"，带信心。' },
      { word: 'hinge on', distinction: 'hinge on 正式，强调"关键在于"，主语多为结果、成败。' },
    ],
    level: 2,
  },

  determine: {
    lemma: 'determine',
    uk: '/dɪˈtɜːmɪn/',
    us: '/dɪˈtɜːrmɪn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '决定，左右（结果、走向）',
        example: 'Early experience determines how confident a child becomes.',
        exampleZh: '早期经历决定了一个孩子能有多自信。',
      },
      {
        pos: 'v.',
        cn: '确定，查明（事实、原因）',
        example: 'Investigators are trying to determine the cause.',
        exampleZh: '调查人员正在设法查明原因。',
      },
      {
        pos: 'v.',
        cn: '下定决心（be determined to）',
        example: 'She was determined to finish the race.',
        exampleZh: '她下定决心要跑完全程。',
      },
    ],
    collocations: [
      { phrase: 'be determined to', cn: '决心' },
      { phrase: 'determine the outcome', cn: '决定结果' },
      { phrase: 'determine whether', cn: '确定是否' },
    ],
    family: ['determines', 'determined', 'determining', 'determination', 'determinant'],
    semanticNote:
      '由"划定界限"出发：把结果的范围划死是决定，把事实的范围划清是查明，把意志的边界划死就是下定决心。',
    synonyms: [
      { word: 'decide', distinction: 'decide 多指人主动作出选择；determine 可指事物"决定"结果。' },
      { word: 'establish', distinction: 'establish 在"查明"义上更强调查实并确认。' },
      { word: 'resolve', distinction: 'resolve 正式，指下决心解决问题，也可指"决议"。' },
    ],
    level: 2,
  },

  develop: {
    lemma: 'develop',
    uk: '/dɪˈveləp/',
    us: '/dɪˈveləp/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '发展，成长（逐渐变大变强）',
        example: 'The town developed rapidly after the railway arrived.',
        exampleZh: '铁路通车后，这座小镇迅速发展起来。',
      },
      {
        pos: 'v.',
        cn: '开发，研制（产品、技术）',
        example: 'The team is developing a cheaper test.',
        exampleZh: '团队正在开发一种更便宜的检测方法。',
      },
      {
        pos: 'v.',
        cn: '患上（疾病），形成（习惯）',
        example: 'He developed a cough that would not go away.',
        exampleZh: '他咳了起来，一直不见好。',
      },
    ],
    collocations: [
      { phrase: 'develop a habit', cn: '养成习惯' },
      { phrase: 'developing countries', cn: '发展中国家' },
      { phrase: 'develop skills', cn: '培养技能' },
    ],
    family: ['develops', 'developed', 'developing', 'development', 'developer'],
    semanticNote:
      '由"解开、展开"出发：能力一点点展开是发展，产品从图纸展开成实物是开发，病在体内慢慢展开就是患上。三条都是"逐渐展开"。',
    synonyms: [
      { word: 'grow', distinction: 'grow 指自然增长、变大，不及物时最常用。' },
      { word: 'evolve', distinction: 'evolve 指逐步演变，含形态或性质发生变化。' },
      { word: 'build', distinction: 'build 指逐步建设，多与 up 连用表示积累。' },
    ],
    level: 1,
  },

  differ: {
    lemma: 'differ',
    uk: '/ˈdɪfə(r)/',
    us: '/ˈdɪfər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '不同，有差异（differ from / differ in）',
        example: 'British and American spelling differ in small ways.',
        exampleZh: '英式和美式拼写有细微差别。',
      },
      {
        pos: 'v.',
        cn: '意见不一（differ on / about）',
        example: 'Experts differ on how much sleep is enough.',
        exampleZh: '专家们对睡多久才算够意见不一。',
      },
    ],
    collocations: [
      { phrase: 'differ from', cn: '与…不同' },
      { phrase: 'differ in', cn: '在…方面不同' },
      { phrase: 'opinions differ', cn: '意见不一' },
    ],
    family: ['differs', 'differed', 'differing', 'difference', 'different', 'differentiate'],
    semanticNote:
      '由"分开、带走"出发：彼此被分开就是不同，看法被分开就是意见不一。',
    synonyms: [
      { word: 'vary', distinction: 'vary 强调随条件而变化，常与 from…to… 搭配。' },
      { word: 'disagree', distinction: 'disagree 只指意见不合，不表示事物之间的差别。' },
      { word: 'contrast', distinction: 'contrast 需搭配 with，强调形成反差。' },
    ],
    level: 2,
  },

  distribute: {
    lemma: 'distribute',
    uk: '/dɪˈstrɪbjuːt/',
    us: '/dɪˈstrɪbjuːt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '分发，分配（给众人）',
        example: 'Volunteers distributed food to the families.',
        exampleZh: '志愿者把食物分发给这些家庭。',
      },
      {
        pos: 'v.',
        cn: '分布（在一定区域内）',
        example: 'The species is widely distributed across the north.',
        exampleZh: '该物种在北方广泛分布。',
      },
    ],
    collocations: [
      { phrase: 'distribute food', cn: '分发食物' },
      { phrase: 'evenly distributed', cn: '均匀分布' },
      { phrase: 'the distribution of wealth', cn: '财富分配' },
    ],
    family: ['distributes', 'distributed', 'distributing', 'distribution', 'distributor'],
    semanticNote:
      '由"分开地给"出发：把东西分开给众人是分发，把人口、物种分开撒在一片区域里就是分布。',
    synonyms: [
      { word: 'allocate', distinction: 'allocate 指按计划分配资源、名额，正式，强调有依据。' },
      { word: 'deliver', distinction: 'deliver 指投递到具体目的地，不强调"分给多人"。' },
      { word: 'spread', distinction: 'spread 强调铺开的范围与动作，可指蔓延。' },
    ],
    level: 3,
  },

  efficient: {
    lemma: 'efficient',
    uk: '/ɪˈfɪʃnt/',
    us: '/ɪˈfɪʃnt/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '高效的（以较少投入取得较多成果）',
        example: 'The new system is far more efficient than the old one.',
        exampleZh: '新系统比旧系统高效得多。',
      },
      {
        pos: 'adj.',
        cn: '（人）干练的，办事利落的',
        example: 'She is an efficient organizer.',
        exampleZh: '她是个办事利落的组织者。',
      },
    ],
    collocations: [
      { phrase: 'energy-efficient', cn: '节能的' },
      { phrase: 'an efficient way', cn: '高效的方式' },
      { phrase: 'efficient use of resources', cn: '资源的有效利用' },
    ],
    family: ['efficiently', 'efficiency', 'inefficient'],
    semanticNote:
      '与 effective 的分工要清楚：effective 看"有没有达到目的"，efficient 看"用了多少代价达到目的"。所以完全可能 an efficient but not very effective method。',
    synonyms: [
      { word: 'effective', distinction: 'effective 只问效果，不问成本；efficient 同时问成本。' },
      { word: 'productive', distinction: 'productive 强调产出多，可用于人、时间、会议。' },
      { word: 'economical', distinction: 'economical 强调省钱、节约，多修饰方法、车型。' },
    ],
    level: 3,
  },

  engage: {
    lemma: 'engage',
    uk: '/ɪnˈɡeɪdʒ/',
    us: '/ɪnˈɡeɪdʒ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '参与，从事（engage in）',
        example: 'Students are encouraged to engage in debate.',
        exampleZh: '学校鼓励学生参与讨论。',
      },
      {
        pos: 'v.',
        cn: '吸引（注意力、兴趣）',
        example: 'The speaker knew how to engage an audience.',
        exampleZh: '这位讲者懂得如何抓住听众。',
      },
      {
        pos: 'v.',
        cn: '雇用（正式）',
        example: 'The firm engaged a team of lawyers.',
        exampleZh: '这家公司聘请了一组律师。',
      },
    ],
    collocations: [
      { phrase: 'engage in', cn: '参与，从事' },
      { phrase: 'engage with', cn: '与…互动；认真对待' },
      { phrase: 'be engaged in', cn: '忙于' },
      { phrase: 'engage the audience', cn: '吸引观众' },
    ],
    family: ['engages', 'engaged', 'engaging', 'engagement'],
    semanticNote:
      '由"许诺、抵押"引申为"把自己投入进去"：投入一件事是参与，把观众的注意力扣住是吸引，把某人的服务订下来就是雇用。',
    synonyms: [
      { word: 'involve', distinction: 'involve 侧重"被卷入、被包含"，engage 侧重"主动投入"。' },
      { word: 'attract', distinction: 'attract 只指吸引注意力，不必然带来互动。' },
      { word: 'employ', distinction: 'employ 是最通用的"雇用"，engage 更正式，多用于专业服务。' },
    ],
    level: 3,
  },

  enhance: {
    lemma: 'enhance',
    uk: '/ɪnˈhɑːns/',
    us: '/ɪnˈhæns/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '提高，增强（质量、效果、吸引力）',
        example: 'Good lighting can enhance the look of a room.',
        exampleZh: '好的灯光能提升房间的观感。',
      },
      {
        pos: 'v.',
        cn: '提升（声誉、地位、能力）',
        example: 'The award enhanced her reputation abroad.',
        exampleZh: '这个奖项提升了她在国外的声誉。',
      },
    ],
    collocations: [
      { phrase: 'enhance the quality of', cn: '提高…的质量' },
      { phrase: 'enhance performance', cn: '提升表现' },
      { phrase: 'enhance one\'s reputation', cn: '提升声誉' },
    ],
    family: ['enhances', 'enhanced', 'enhancing', 'enhancement'],
    semanticNote:
      '由"抬高"出发：把品质抬高是提高，把名声抬高是提升。它只用于抽象的好东西，不能说 enhance the price，也不能说 enhance the number。',
    synonyms: [
      { word: 'improve', distinction: 'improve 最通用，可用于具体与抽象，也可不及物。' },
      { word: 'boost', distinction: 'boost 口语与商务常用，指"大幅拉升"，力度更强。' },
      { word: 'strengthen', distinction: 'strengthen 多指加强力量、关系、结构。' },
    ],
    level: 3,
  },

  ensure: {
    lemma: 'ensure',
    uk: '/ɪnˈʃʊə(r)/',
    us: '/ɪnˈʃʊr/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '确保，保证（某事一定发生）',
        example: 'Please ensure that all windows are closed.',
        exampleZh: '请确保所有窗户都已关好。',
      },
      {
        pos: 'v.',
        cn: '使免受（损失、风险）（ensure against，较旧用法）',
        example: 'The policy ensures you against loss.',
        exampleZh: '这份保单使你免于损失。',
      },
    ],
    collocations: [
      { phrase: 'ensure that…', cn: '确保…' },
      { phrase: 'ensure safety', cn: '保障安全' },
      { phrase: 'ensure compliance', cn: '确保合规' },
    ],
    family: ['ensures', 'ensured', 'ensuring'],
    semanticNote:
      '由"使安全"出发：让某结果稳稳落地就是确保，让人免受损失就是保障。语法上 ensure 后接 that 从句或名词，不接 to do。',
    synonyms: [
      { word: 'assure', distinction: 'assure 的宾语必须是人，意为"向某人保证、打消其疑虑"。' },
      { word: 'guarantee', distinction: 'guarantee 含担保责任，出问题要负责，语气最强。' },
      { word: 'secure', distinction: 'secure 指努力争取到手，强调"来之不易"。' },
    ],
    level: 2,
  },

  essential: {
    lemma: 'essential',
    uk: '/ɪˈsenʃl/',
    us: '/ɪˈsenʃl/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '必不可少的，必需的（essential to / for）',
        example: 'Sleep is essential for memory.',
        exampleZh: '睡眠对记忆必不可少。',
      },
      {
        pos: 'adj.',
        cn: '本质的，根本的',
        example: 'The essential difference between the two is cost.',
        exampleZh: '两者之间的根本差别在于成本。',
      },
      {
        pos: 'n.',
        cn: '必需品（常用复数 essentials）',
        example: 'We packed only the essentials.',
        exampleZh: '我们只带了必需品。',
      },
    ],
    collocations: [
      { phrase: 'essential to', cn: '对…必不可少' },
      { phrase: 'essential for health', cn: '健康所必需' },
      { phrase: 'the bare essentials', cn: '最基本的必需品' },
    ],
    family: ['essentially', 'essence'],
    semanticNote:
      '由"本质"出发：属于本质的东西不能少，所以是"必需"；把本质挑出来说，就是"根本的差别"；生活中不能少的东西就是"必需品"。',
    synonyms: [
      { word: 'necessary', distinction: 'necessary 只是"需要"，语气弱于 essential；essential 含"缺了就办不成"。' },
      { word: 'vital', distinction: 'vital 关乎存亡与生死，程度最重。' },
      { word: 'crucial', distinction: 'crucial 强调"决定成败的关键节点"。' },
    ],
    level: 2,
  },

  expand: {
    lemma: 'expand',
    uk: '/ɪkˈspænd/',
    us: '/ɪkˈspænd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '扩大，扩展（规模、范围、业务）',
        example: 'The company plans to expand into Asia.',
        exampleZh: '公司计划向亚洲扩张。',
      },
      {
        pos: 'v.',
        cn: '膨胀（体积变大）',
        example: 'Metal expands when heated.',
        exampleZh: '金属受热会膨胀。',
      },
      {
        pos: 'v.',
        cn: '详述（expand on）',
        example: 'She was asked to expand on her answer.',
        exampleZh: '她被要求进一步说明自己的回答。',
      },
    ],
    collocations: [
      { phrase: 'expand into', cn: '扩展到' },
      { phrase: 'expand rapidly', cn: '迅速扩张' },
      { phrase: 'expand on', cn: '详述' },
    ],
    family: ['expands', 'expanded', 'expanding', 'expansion', 'expansive'],
    semanticNote:
      '由"向外铺开"出发：范围向外铺是扩大，体积向外铺是膨胀，内容向外铺开讲就是详述。',
    synonyms: [
      { word: 'extend', distinction: 'extend 多指长度、期限的延伸；expand 指体积或规模的变大。' },
      { word: 'enlarge', distinction: 'enlarge 指使变大，多用于照片、房间、孔洞。' },
      { word: 'broaden', distinction: 'broaden 多指范围、视野、思路的拓宽。' },
    ],
    level: 2,
  },

  expect: {
    lemma: 'expect',
    uk: '/ɪkˈspekt/',
    us: '/ɪkˈspekt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '预料，预计（认为会发生）',
        example: 'We expect the results next week.',
        exampleZh: '我们预计下周出结果。',
      },
      {
        pos: 'v.',
        cn: '期待，指望（对某人抱有期望）',
        example: 'Parents expect too much of their children.',
        exampleZh: '父母对孩子的期望过高。',
      },
      {
        pos: 'v.',
        cn: '要求，理应（含"规矩如此"之意）',
        example: 'Guests are expected to dress formally.',
        exampleZh: '客人应当着正装。',
      },
    ],
    collocations: [
      { phrase: 'be expected to', cn: '预计会' },
      { phrase: 'expect too much of', cn: '对…期望过高' },
      { phrase: 'as expected', cn: '正如预料' },
    ],
    family: ['expects', 'expected', 'expecting', 'expectation', 'expectant'],
    semanticNote:
      '由"向外看"出发：往外看等着某事发生是预料，带着盼望地看是期待，认为对方理应如此就是要求。',
    synonyms: [
      { word: 'anticipate', distinction: 'anticipate 含"预见并提前准备"之意，比 expect 更主动。' },
      { word: 'predict', distinction: 'predict 多依据数据或理论作出预测。' },
      { word: 'await', distinction: 'await 只是"等待"，正式，不必然含预料。' },
    ],
    level: 1,
  },

  experience: {
    lemma: 'experience',
    uk: '/ɪkˈspɪəriəns/',
    us: '/ɪkˈspɪriəns/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '经验（不可数，积累下来的知识与技能）',
        example: 'She has ten years of experience in teaching.',
        exampleZh: '她有十年教学经验。',
      },
      {
        pos: 'n.',
        cn: '经历（可数，指具体的一件事）',
        example: 'Living abroad was a formative experience.',
        exampleZh: '在国外生活是一段塑造人的经历。',
      },
      {
        pos: 'v.',
        cn: '经历，体验',
        example: 'The region experienced heavy rainfall in July.',
        exampleZh: '该地区七月经历了强降雨。',
      },
    ],
    collocations: [
      { phrase: 'work experience', cn: '工作经验' },
      { phrase: 'a memorable experience', cn: '难忘的经历' },
      { phrase: 'learn from experience', cn: '从经验中学习' },
    ],
    family: ['experiences', 'experienced', 'experiencing', 'experiential'],
    semanticNote:
      '不可数指"攒下来的东西"，可数指"一件事"。同一个词两种数法，含义随之改变，这是英语里很典型的一组对立。',
    synonyms: [
      { word: 'undergo', distinction: 'undergo 多指经历艰难、变化、治疗，正式，强调"承受"。' },
      { word: 'encounter', distinction: 'encounter 多指遭遇问题、阻力，含"迎面撞上"。' },
      { word: 'go through', distinction: 'go through 口语，多指经历困难时期。' },
    ],
    level: 1,
  },

  extend: {
    lemma: 'extend',
    uk: '/ɪkˈstend/',
    us: '/ɪkˈstend/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '延长，延伸（时间、长度）',
        example: 'The deadline has been extended by two weeks.',
        exampleZh: '截止日期延长了两周。',
      },
      {
        pos: 'v.',
        cn: '扩大，扩展（范围、影响）',
        example: 'The scheme was extended to rural areas.',
        exampleZh: '该方案被推广到了农村地区。',
      },
      {
        pos: 'v.',
        cn: '给予，提供（邀请、感谢，正式）',
        example: 'They extended a warm welcome to the visitors.',
        exampleZh: '他们向访客表示了热烈欢迎。',
      },
    ],
    collocations: [
      { phrase: 'extend the deadline', cn: '延长期限' },
      { phrase: 'extend to', cn: '扩展到' },
      { phrase: 'extend an invitation', cn: '发出邀请' },
    ],
    family: ['extends', 'extended', 'extending', 'extension', 'extensive'],
    semanticNote:
      '由"向外伸"出发：时间往外伸是延长，范围往外伸是扩展，把好意"伸"给别人就是给予。',
    synonyms: [
      { word: 'expand', distinction: 'expand 指体积或规模变大，extend 指长度、期限或范围的延伸。' },
      { word: 'prolong', distinction: 'prolong 多指人为拖长时间，常含"不必要的延长"。' },
      { word: 'stretch', distinction: 'stretch 强调拉伸，含张力，可用于衣物、时间、资源。' },
    ],
    level: 2,
  },

  familiar: {
    lemma: 'familiar',
    uk: '/fəˈmɪliə(r)/',
    us: '/fəˈmɪliər/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '熟悉的（be familiar with，主语是人）',
        example: 'I am not familiar with this software.',
        exampleZh: '我对这个软件不熟。',
      },
      {
        pos: 'adj.',
        cn: '常见的，听惯见惯的（be familiar to，主语是事物）',
        example: 'The scene was familiar to anyone who grew up there.',
        exampleZh: '在那里长大的人对这一幕都很熟悉。',
      },
      {
        pos: 'adj.',
        cn: '冒昧的，过分亲昵的',
        example: 'His tone was a little too familiar.',
        exampleZh: '他的语气有点过于随便了。',
      },
    ],
    collocations: [
      { phrase: 'be familiar with', cn: '熟悉（人作主语）' },
      { phrase: 'familiar to', cn: '为…所熟悉（物作主语）' },
      { phrase: 'a familiar face', cn: '熟面孔' },
    ],
    family: ['familiarity', 'familiarize', 'unfamiliar'],
    semanticNote:
      '由"像家里人一样"出发：见过多次就像家人一样熟，熟到没有分寸就变成"冒昧"。介词方向要记牢：人 be familiar with 物，物 be familiar to 人。',
    synonyms: [
      { word: 'acquainted', distinction: 'acquainted 正式，be acquainted with 指"了解、认识"，程度浅于 familiar。' },
      { word: 'well-known', distinction: 'well-known 指"广为人知"，不含"个人熟悉"之意。' },
      { word: 'accustomed', distinction: 'accustomed 指"习惯于"，接 to，与熟悉无关。' },
    ],
    level: 2,
  },

  focus: {
    lemma: 'focus',
    uk: '/ˈfəʊkəs/',
    us: '/ˈfoʊkəs/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '集中（注意力），专注于（focus on）',
        example: 'The report focuses on three regions.',
        exampleZh: '报告集中讨论三个地区。',
      },
      {
        pos: 'n.',
        cn: '焦点，重点',
        example: 'Safety is the main focus of the training.',
        exampleZh: '安全是这次培训的重点。',
      },
      {
        pos: 'v.',
        cn: '调焦，对准（镜头、视线）',
        example: 'She focused the camera on the bird.',
        exampleZh: '她把镜头对准了那只鸟。',
      },
    ],
    collocations: [
      { phrase: 'focus on', cn: '专注于' },
      { phrase: 'the focus of attention', cn: '关注的焦点' },
      { phrase: 'in focus', cn: '清晰' },
      { phrase: 'out of focus', cn: '模糊' },
    ],
    family: ['focuses', 'focused', 'focussing', 'focal'],
    semanticNote:
      '由光学"焦点"出发：镜头对准一点是调焦，注意力对准一点是专注，讨论对准一点就是重点。',
    synonyms: [
      { word: 'concentrate', distinction: 'concentrate 指集中注意力或资源，常接 on，语气比 focus 略正式。' },
      { word: 'emphasize', distinction: 'emphasize 侧重"把某点说重"，focus 侧重"把注意力放到某点"。' },
      { word: 'centre', distinction: 'centre 指"以…为中心"，英式拼写，多用于讨论、活动。' },
    ],
    level: 2,
  },

  function: {
    lemma: 'function',
    uk: '/ˈfʌŋkʃn/',
    us: '/ˈfʌŋkʃn/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '功能，作用（器官、部件所起的作用）',
        example: 'The main function of the skin is to protect the body.',
        exampleZh: '皮肤的主要功能是保护身体。',
      },
      {
        pos: 'n.',
        cn: '职能，职责',
        example: 'Your function is to keep the records.',
        exampleZh: '你的职责是保管记录。',
      },
      {
        pos: 'v.',
        cn: '运转，起作用',
        example: 'The machine functions best in cool conditions.',
        exampleZh: '这台机器在凉爽的环境下运转最好。',
      },
    ],
    collocations: [
      { phrase: 'bodily functions', cn: '身体机能' },
      { phrase: 'function as', cn: '充当' },
      { phrase: 'function properly', cn: '正常运转' },
    ],
    family: ['functions', 'functioned', 'functioning', 'functional'],
    semanticNote:
      '由"履行职责"出发：器官、部件履行的职责是功能，人担任的职责是职能，整体正常履行职责就是"运转"。',
    synonyms: [
      { word: 'role', distinction: 'role 多指人在群体中扮演的角色，含"身份"意味。' },
      { word: 'purpose', distinction: 'purpose 回答"为什么存在"，偏意图；function 回答"起什么作用"。' },
      { word: 'operate', distinction: 'operate 指操作或运转，多用于机器、系统、企业。' },
    ],
    level: 2,
  },

  gradual: {
    lemma: 'gradual',
    uk: '/ˈɡrædʒuəl/',
    us: '/ˈɡrædʒuəl/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '逐渐的，渐进的（缓慢而连续）',
        example: 'There has been a gradual improvement in air quality.',
        exampleZh: '空气质量在逐步改善。',
      },
      {
        pos: 'adj.',
        cn: '（坡度）平缓的',
        example: 'The path takes a gradual climb.',
        exampleZh: '这条小路缓缓向上。',
      },
    ],
    collocations: [
      { phrase: 'a gradual increase', cn: '逐渐增加' },
      { phrase: 'a gradual process', cn: '渐进的过程' },
      { phrase: 'gradual change', cn: '渐变' },
    ],
    family: ['gradually', 'gradualism'],
    semanticNote:
      '由"台阶"出发：一级一级往上就是逐渐，坡一级一级抬高就是平缓。反义词是 sudden 与 abrupt。',
    synonyms: [
      { word: 'steady', distinction: 'steady 强调稳定不间断，不一定慢；gradual 强调每一步幅度小。' },
      { word: 'progressive', distinction: 'progressive 指逐步推进，有时含"日益严重"之意。' },
      { word: 'slow', distinction: 'slow 只谈速度，不含"连续、分阶段"的意思。' },
    ],
    level: 2,
  },

  guarantee: {
    lemma: 'guarantee',
    uk: '/ˌɡærənˈtiː/',
    us: '/ˌɡærənˈtiː/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '保证，担保（承诺结果一定发生）',
        example: 'We cannot guarantee that the flight will leave on time.',
        exampleZh: '我们无法保证航班准点起飞。',
      },
      {
        pos: 'n.',
        cn: '保修单，质保（商品）',
        example: 'The laptop comes with a two-year guarantee.',
        exampleZh: '这台笔记本电脑有两年保修。',
      },
      {
        pos: 'n.',
        cn: '保证，担保（抽象，常作 no guarantee of）',
        example: 'Hard work is no guarantee of success.',
        exampleZh: '努力并不能保证成功。',
      },
    ],
    collocations: [
      { phrase: 'guarantee that…', cn: '保证…' },
      { phrase: 'under guarantee', cn: '在保修期内' },
      { phrase: 'a guarantee of success', cn: '成功的保证' },
    ],
    family: ['guarantees', 'guaranteed', 'guaranteeing'],
    semanticNote:
      '由"担保人"出发：商家对产品作担保是保修，对结果作担保是保证。no guarantee of 这类抽象用法在议论文里很常见。',
    synonyms: [
      { word: 'ensure', distinction: 'ensure 只是"确保"，不含赔偿责任；guarantee 出问题要负责。' },
      { word: 'promise', distinction: 'promise 是口头承诺，情感色彩强，不具约束力。' },
      { word: 'warrant', distinction: 'warrant 正式，含法律担保或"使…显得正当"。' },
    ],
    level: 3,
  },

  ignore: {
    lemma: 'ignore',
    uk: '/ɪɡˈnɔː(r)/',
    us: '/ɪɡˈnɔːr/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '忽视，不理会（看见了但故意不理）',
        example: 'He ignored the warning and went ahead.',
        exampleZh: '他无视警告，照旧行事。',
      },
      {
        pos: 'v.',
        cn: '忽略（论述中未予考虑）',
        example: 'The report ignores the cost of the scheme.',
        exampleZh: '报告没有考虑该方案的成本。',
      },
    ],
    collocations: [
      { phrase: 'ignore the warning', cn: '无视警告' },
      { phrase: 'ignore the fact that', cn: '无视…这一事实' },
      { phrase: 'simply ignore', cn: '干脆不理' },
    ],
    family: ['ignores', 'ignored', 'ignoring', 'ignorance', 'ignorant'],
    semanticNote:
      '与 neglect 的分工：ignore 多是"看见了但故意不理"，neglect 是"该管而没管好"，含失职意味。',
    synonyms: [
      { word: 'neglect', distinction: 'neglect 指疏于照顾、未尽职责，含过失。' },
      { word: 'overlook', distinction: 'overlook 多指疏忽而未看到，通常不是故意。' },
      { word: 'disregard', distinction: 'disregard 正式，指不理会规定、警告、意见。' },
    ],
    level: 2,
  },

  improve: {
    lemma: 'improve',
    uk: '/ɪmˈpruːv/',
    us: '/ɪmˈpruːv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '改善，提高（使变好）',
        example: 'The city has improved its bus service.',
        exampleZh: '该市改善了公交服务。',
      },
      {
        pos: 'v.',
        cn: '好转（自身变好）',
        example: 'Her health improved after the operation.',
        exampleZh: '手术后她的身体状况好转了。',
      },
      {
        pos: 'v.',
        cn: '改进，超过（improve on / upon）',
        example: 'It is hard to improve on that performance.',
        exampleZh: '很难再超越那次表现。',
      },
    ],
    collocations: [
      { phrase: 'improve performance', cn: '提高表现' },
      { phrase: 'improve on', cn: '改进；超过' },
      { phrase: 'room for improvement', cn: '改进空间' },
    ],
    family: ['improves', 'improved', 'improving', 'improvement'],
    semanticNote:
      '由"变得更有价值"出发：让事物更有价值是改善，自身变得更好是好转，做得比原来更好就是"超过"。',
    synonyms: [
      { word: 'enhance', distinction: 'enhance 只用于提升抽象的好品质，不能指"变好"的不及物用法。' },
      { word: 'better', distinction: 'better 作动词较口语，多用于处境、条件。' },
      { word: 'refine', distinction: 'refine 指精炼、改进细节，多用于方法、工艺、品味。' },
    ],
    level: 1,
  },

  increase: {
    lemma: 'increase',
    uk: '/ɪnˈkriːs/',
    us: '/ɪnˈkriːs/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '增加，提高（及物，使变多）',
        example: 'The company increased prices by five per cent.',
        exampleZh: '公司把价格提高了百分之五。',
      },
      {
        pos: 'v.',
        cn: '增长（不及物，自身变多）',
        example: 'The population increased steadily.',
        exampleZh: '人口稳步增长。',
      },
      {
        pos: 'n.',
        cn: '增长，增加（重音在前 /ˈɪnkriːs/）',
        example: 'There has been a sharp increase in demand.',
        exampleZh: '需求急剧增长。',
      },
    ],
    collocations: [
      { phrase: 'increase by', cn: '增加了（幅度）' },
      { phrase: 'increase in', cn: '在…方面的增长' },
      { phrase: 'a sharp increase', cn: '急剧增长' },
    ],
    family: ['increases', 'increased', 'increasing', 'increasingly'],
    semanticNote:
      '及物是"使增加"，不及物是"自己增长"，名词重音前移。这种"名动重音交替"在英语里很常见，如 record、present、progress。',
    synonyms: [
      { word: 'rise', distinction: 'rise 不及物，指自身上升，不能带宾语。' },
      { word: 'grow', distinction: 'grow 多指自然增长，可用于人口、经济、植物。' },
      { word: 'raise', distinction: 'raise 及物，主语多为人，指主动提高价格、标准、工资。' },
    ],
    level: 1,
  },

  influence: {
    lemma: 'influence',
    uk: '/ˈɪnfluəns/',
    us: '/ˈɪnfluəns/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '影响（不可数，常与 on 连用）',
        example: 'Peer pressure has a strong influence on teenagers.',
        exampleZh: '同伴压力对青少年影响很大。',
      },
      {
        pos: 'v.',
        cn: '影响（多指对人、决定、观念）',
        example: 'Advertising influences what we buy.',
        exampleZh: '广告影响我们买什么。',
      },
      {
        pos: 'n.',
        cn: '影响力，势力',
        example: 'She used her influence to get him the job.',
        exampleZh: '她动用自己的影响力帮他得到了这份工作。',
      },
    ],
    collocations: [
      { phrase: 'have an influence on', cn: '对…有影响' },
      { phrase: 'under the influence of', cn: '在…影响下' },
      { phrase: 'a good influence', cn: '好的影响' },
    ],
    family: ['influences', 'influenced', 'influencing', 'influential'],
    semanticNote:
      '由"流入"出发：某种力量悄悄流进别人的判断里就是影响；这种力量本身足够大，就成了"势力"。',
    synonyms: [
      { word: 'affect', distinction: 'affect 多指受到不利影响，且只作动词；influence 可作名词。' },
      { word: 'impact', distinction: 'impact 力度更强，多指重大冲击。' },
      { word: 'sway', distinction: 'sway 指左右、动摇某人的意见，含"使其改变立场"。' },
    ],
    level: 2,
  },

  insist: {
    lemma: 'insist',
    uk: '/ɪnˈsɪst/',
    us: '/ɪnˈsɪst/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '坚称，坚持认为（insist that…）',
        example: 'She insisted that she had done nothing wrong.',
        exampleZh: '她坚称自己没做错任何事。',
      },
      {
        pos: 'v.',
        cn: '坚决要求（insist on sth / doing）',
        example: 'He insisted on paying for the meal.',
        exampleZh: '他坚持要付这顿饭钱。',
      },
    ],
    collocations: [
      { phrase: 'insist on', cn: '坚持（要求）' },
      { phrase: 'insist that…', cn: '坚持认为／坚决要求…' },
      { phrase: 'if you insist', cn: '如果你坚持的话' },
    ],
    family: ['insists', 'insisted', 'insisting', 'insistence', 'insistent'],
    semanticNote:
      '与 persist 的分工：insist 重在"说"，坚持某个说法或要求；persist 重在"做"，坚持某个行动。insist 后接 that 从句表"要求"时用虚拟语气（insist that he go）。',
    synonyms: [
      { word: 'persist', distinction: 'persist 指坚持做某事，重行动，常接 in doing。' },
      { word: 'maintain', distinction: 'maintain 也表"坚持声称"，但语气更冷静、更书面。' },
      { word: 'demand', distinction: 'demand 是强硬要求，几乎不留拒绝余地。' },
    ],
    level: 2,
  },

  intend: {
    lemma: 'intend',
    uk: '/ɪnˈtend/',
    us: '/ɪnˈtend/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '打算，有意（intend to do）',
        example: 'I intend to finish the report tonight.',
        exampleZh: '我打算今晚把报告写完。',
      },
      {
        pos: 'v.',
        cn: '旨在，专为…而设（be intended for）',
        example: 'The course is intended for beginners.',
        exampleZh: '这门课是给初学者开的。',
      },
      {
        pos: 'v.',
        cn: '意指（话里想表达的意思）',
        example: 'What exactly do you intend by that remark?',
        exampleZh: '你那句话到底是什么意思？',
      },
    ],
    collocations: [
      { phrase: 'intend to do', cn: '打算做' },
      { phrase: 'be intended for', cn: '专为…而设' },
      { phrase: 'as intended', cn: '按原意' },
    ],
    family: ['intends', 'intended', 'intending', 'intention', 'intentional'],
    semanticNote:
      '由"把心思伸向"出发：心思伸向某个动作是打算，事物被设计出来指向某群人是"专为…而设"，话语指向某个意思是"意指"。',
    synonyms: [
      { word: 'plan', distinction: 'plan 含具体步骤与安排，intend 只表示意图。' },
      { word: 'mean', distinction: 'mean 口语，可指"打算"也可指"意思是"，需靠语境分辨。' },
      { word: 'aim', distinction: 'aim 多用于目标、政策，指"旨在"。' },
    ],
    level: 2,
  },

  interpret: {
    lemma: 'interpret',
    uk: '/ɪnˈtɜːprɪt/',
    us: '/ɪnˈtɜːrprɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '理解，解释（把含义讲清楚）',
        example: 'The results can be interpreted in several ways.',
        exampleZh: '这些结果可以有几种解读。',
      },
      {
        pos: 'v.',
        cn: '口译（当场翻译）',
        example: 'She interpreted for the delegation.',
        exampleZh: '她为代表团做口译。',
      },
      {
        pos: 'v.',
        cn: '演绎（音乐、戏剧作品）',
        example: 'The pianist interpreted the sonata with great freedom.',
        exampleZh: '这位钢琴家非常自由地演绎了这首奏鸣曲。',
      },
    ],
    collocations: [
      { phrase: 'interpret as', cn: '把…理解为' },
      { phrase: 'interpret the data', cn: '解读数据' },
      { phrase: 'interpret for sb', cn: '为某人口译' },
    ],
    family: ['interprets', 'interpreted', 'interpreting', 'interpretation', 'interpreter'],
    semanticNote:
      '由"在中间传达"出发：在两种语言之间传是口译，在文本与读者之间传是解释，在乐谱与听众之间传就是演绎。',
    synonyms: [
      { word: 'explain', distinction: 'explain 目的是使对方明白，不涉及"多种可能"。' },
      { word: 'translate', distinction: 'translate 多指笔译，强调语言转换。' },
      { word: 'read', distinction: 'read 表"解读"时口语化，含主观判断，如 read the situation。' },
    ],
    level: 3,
  },

  introduce: {
    lemma: 'introduce',
    uk: '/ˌɪntrəˈdjuːs/',
    us: '/ˌɪntrəˈduːs/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '介绍（使彼此认识）',
        example: 'Let me introduce you to my colleague.',
        exampleZh: '我来把你介绍给我的同事。',
      },
      {
        pos: 'v.',
        cn: '引进，推行（新事物、新制度）',
        example: 'The school introduced a new timetable.',
        exampleZh: '学校启用了一张新作息表。',
      },
      {
        pos: 'v.',
        cn: '提出（话题、议案）',
        example: 'She introduced the subject gently.',
        exampleZh: '她委婉地把话题引了出来。',
      },
    ],
    collocations: [
      { phrase: 'introduce sb to', cn: '把某人介绍给' },
      { phrase: 'introduce a policy', cn: '推行政策' },
      { phrase: 'introduce yourself', cn: '自我介绍' },
    ],
    family: ['introduces', 'introduced', 'introducing', 'introduction', 'introductory'],
    semanticNote:
      '由"引进去"出发：把人引进去让彼此认识是介绍，把新事物引进去是引进，把话题引进去就是提出。',
    synonyms: [
      { word: 'present', distinction: 'present 更正式，指正式介绍或呈交，如 present a paper。' },
      { word: 'bring in', distinction: 'bring in 口语，指引进外来的人、做法或收入。' },
      { word: 'launch', distinction: 'launch 指推出新产品，通常伴随宣传。' },
    ],
    level: 1,
  },

  invest: {
    lemma: 'invest',
    uk: '/ɪnˈvest/',
    us: '/ɪnˈvest/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '投资（资金）',
        example: 'They invested heavily in new machinery.',
        exampleZh: '他们在新设备上投入了大量资金。',
      },
      {
        pos: 'v.',
        cn: '投入（时间、精力）',
        example: 'She has invested years in this research.',
        exampleZh: '她在这项研究上投入了好几年。',
      },
      {
        pos: 'v.',
        cn: '授予（权力、职权，正式）',
        example: 'The council is invested with the power to fine.',
        exampleZh: '该委员会被授予罚款的权力。',
      },
    ],
    collocations: [
      { phrase: 'invest in', cn: '投资于' },
      { phrase: 'invest time in', cn: '在…上投入时间' },
      { phrase: 'a sound investment', cn: '稳妥的投资' },
    ],
    family: ['invests', 'invested', 'investing', 'investment', 'investor'],
    semanticNote:
      '由"给穿上衣服"出发：把钱"穿"到项目上是投资，把时间精力穿进去也是投入，把权力穿到某人身上就是授予。',
    synonyms: [
      { word: 'fund', distinction: 'fund 指为项目提供资金，多用于机构、研究。' },
      { word: 'put in', distinction: 'put in 口语，指投入时间、精力、金钱。' },
      { word: 'devote', distinction: 'devote 指奉献时间精力，含情感投入，固定搭配 devote to。' },
    ],
    level: 2,
  },

  limit: {
    lemma: 'limit',
    uk: '/ˈlɪmɪt/',
    us: '/ˈlɪmɪt/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '限度，极限（允许的最大量）',
        example: 'There is a limit to how much we can do.',
        exampleZh: '我们能做的事是有限度的。',
      },
      {
        pos: 'v.',
        cn: '限制，限定',
        example: 'The government limits the number of permits.',
        exampleZh: '政府限制许可证的数量。',
      },
      {
        pos: 'n.',
        cn: '界限，边界（城市、区域的）',
        example: 'The city limits are marked by a sign.',
        exampleZh: '市界用一块牌子标出。',
      },
    ],
    collocations: [
      { phrase: 'speed limit', cn: '限速' },
      { phrase: 'limit to', cn: '限制在' },
      { phrase: 'within limits', cn: '在一定范围内' },
    ],
    family: ['limits', 'limited', 'limiting', 'limitation', 'limitless'],
    semanticNote:
      '由"边界线"出发：划出的线是界限，线内允许的量是限度，划线这个动作就是限制。',
    synonyms: [
      { word: 'restrict', distinction: 'restrict 语气较强，多指以规定限制行为或范围。' },
      { word: 'cap', distinction: 'cap 指设定上限，商务与政策语境常用。' },
      { word: 'confine', distinction: 'confine 指把…局限在某个空间或范围内，含"束缚"。' },
    ],
    level: 2,
  },

  manage: {
    lemma: 'manage',
    uk: '/ˈmænɪdʒ/',
    us: '/ˈmænɪdʒ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '管理，经营（组织、团队、企业）',
        example: 'She manages a team of twelve.',
        exampleZh: '她带一个十二人的团队。',
      },
      {
        pos: 'v.',
        cn: '设法做到（manage to do，含克服困难）',
        example: 'We managed to finish on time.',
        exampleZh: '我们设法按时完成了。',
      },
      {
        pos: 'v.',
        cn: '应付，勉强过活（manage on）',
        example: 'How do they manage on one salary?',
        exampleZh: '他们靠一份工资怎么过？',
      },
    ],
    collocations: [
      { phrase: 'manage to do', cn: '设法做成' },
      { phrase: 'manage a company', cn: '管理公司' },
      { phrase: 'manage stress', cn: '应对压力' },
    ],
    family: ['manages', 'managed', 'managing', 'management', 'manager', 'manageable'],
    semanticNote:
      '由"用手驾驭"出发：驾驭一个团队是管理，驾驭一件难事是设法做到，驾驭一份不够用的收入就是勉强过活。',
    synonyms: [
      { word: 'run', distinction: 'run 口语，指经营、运转，如 run a business。' },
      { word: 'cope', distinction: 'cope 指应付压力或困难，多接 with。' },
      { word: 'handle', distinction: 'handle 指应对具体问题、局面，强调"处理得了"。' },
    ],
    level: 1,
  },

  measure: {
    lemma: 'measure',
    uk: '/ˈmeʒə(r)/',
    us: '/ˈmeʒər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '测量，衡量（尺寸、水平）',
        example: 'The device measures air quality.',
        exampleZh: '这个装置测量空气质量。',
      },
      {
        pos: 'n.',
        cn: '措施，办法（常用复数）',
        example: 'The city took measures to cut traffic.',
        exampleZh: '该市采取措施减少交通流量。',
      },
      {
        pos: 'n.',
        cn: '程度，尺度（a measure of）',
        example: 'The results are a measure of how far we have come.',
        exampleZh: '这些结果衡量了我们走了多远。',
      },
    ],
    collocations: [
      { phrase: 'take measures', cn: '采取措施' },
      { phrase: 'measure up to', cn: '达到…标准' },
      { phrase: 'a measure of', cn: '一定程度的' },
    ],
    family: ['measures', 'measured', 'measuring', 'measurement', 'measurable'],
    semanticNote:
      '由"量"出发：量长度是测量，量出问题多大之后采取的动作是措施，量出来的结果就是"程度"。',
    synonyms: [
      { word: 'assess', distinction: 'assess 含判断与评定，measure 只强调得出数值。' },
      { word: 'gauge', distinction: 'gauge 多指凭经验估算、判断，也可指测量仪器。' },
      { word: 'step', distinction: 'step 指具体的一步措施，口语，常与 take 连用。' },
    ],
    level: 2,
  },

  mention: {
    lemma: 'mention',
    uk: '/ˈmenʃn/',
    us: '/ˈmenʃn/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '提到，说起（顺带一提）',
        example: 'She mentioned that she might be late.',
        exampleZh: '她提到自己可能会迟到。',
      },
      {
        pos: 'n.',
        cn: '提及（多用于 not to mention、at the mention of）',
        example: 'He speaks French, not to mention German.',
        exampleZh: '他会说法语，更不用说德语了。',
      },
    ],
    collocations: [
      { phrase: 'mention that…', cn: '提到…' },
      { phrase: 'not to mention', cn: '更不用说' },
      { phrase: 'don\'t mention it', cn: '不客气' },
    ],
    family: ['mentions', 'mentioned', 'mentioning'],
    semanticNote:
      '由"提醒"出发：轻轻点一下就是提到。语气比 discuss 轻得多，暗示"只是顺带说说"，不展开。',
    synonyms: [
      { word: 'refer to', distinction: 'refer to 正式，可指提及，也可指"指的是"。' },
      { word: 'cite', distinction: 'cite 指引用，多用于文献、案例、数据。' },
      { word: 'bring up', distinction: 'bring up 指主动提出话题，口语。' },
    ],
    level: 1,
  },

  method: {
    lemma: 'method',
    uk: '/ˈmeθəd/',
    us: '/ˈmeθəd/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '方法，办法（有步骤、可重复）',
        example: 'The method is simple but effective.',
        exampleZh: '这个方法简单但有效。',
      },
      {
        pos: 'n.',
        cn: '条理，秩序（正式）',
        example: 'There is no method in his work.',
        exampleZh: '他做事毫无章法。',
      },
    ],
    collocations: [
      { phrase: 'a teaching method', cn: '教学方法' },
      { phrase: 'method of payment', cn: '付款方式' },
      { phrase: 'scientific method', cn: '科学方法' },
    ],
    family: ['methods', 'methodical', 'methodology'],
    semanticNote:
      '由"沿着路走"出发：按固定路线走就是方法，做事有固定路线就是有条理。',
    synonyms: [
      { word: 'approach', distinction: 'approach 更抽象，指思路与取向；method 更具体，有步骤。' },
      { word: 'way', distinction: 'way 最宽泛、最口语，几乎可替换任何"方法"。' },
      { word: 'technique', distinction: 'technique 指专业操作手法，多用于艺术、运动、实验。' },
    ],
    level: 2,
  },

  obvious: {
    lemma: 'obvious',
    uk: '/ˈɒbviəs/',
    us: '/ˈɑːbviəs/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '明显的，显而易见的',
        example: 'It was obvious that she was tired.',
        exampleZh: '她显然累了。',
      },
      {
        pos: 'adj.',
        cn: '缺乏新意的，一眼看穿的',
        example: 'The ending was rather obvious.',
        exampleZh: '这个结尾没什么新意。',
      },
    ],
    collocations: [
      { phrase: 'it is obvious that…', cn: '显然…' },
      { phrase: 'for obvious reasons', cn: '出于显而易见的原因' },
      { phrase: 'the obvious choice', cn: '显而易见的选择' },
    ],
    family: ['obviously', 'obviousness'],
    semanticNote:
      '由"挡在路上"出发：明显到挡在眼前、躲不开，就是"显而易见"；一眼看穿、没有余味，就成了"老套"。',
    synonyms: [
      { word: 'evident', distinction: 'evident 更正式，暗示有证据支撑。' },
      { word: 'apparent', distinction: 'apparent 指"表面看来"，可含"未必真实"之意。' },
      { word: 'clear', distinction: 'clear 最通用，可指视觉清晰或逻辑清楚。' },
    ],
    level: 2,
  },

  offer: {
    lemma: 'offer',
    uk: '/ˈɒfə(r)/',
    us: '/ˈɔːfər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '主动提出，提供（对方可以拒绝）',
        example: 'He offered to drive me home.',
        exampleZh: '他提出送我回家。',
      },
      {
        pos: 'n.',
        cn: '提议；报价',
        example: 'They accepted our offer.',
        exampleZh: '他们接受了我们的报价。',
      },
      {
        pos: 'v.',
        cn: '出售，供应（商品、服务）',
        example: 'The shop offers a wide range of teas.',
        exampleZh: '这家店供应各种茶叶。',
      },
    ],
    collocations: [
      { phrase: 'offer to do', cn: '主动提出做' },
      { phrase: 'an offer of help', cn: '主动帮忙' },
      { phrase: 'on offer', cn: '在售；可供选择' },
    ],
    family: ['offers', 'offered', 'offering'],
    semanticNote:
      '由"献上"出发：把东西献到对方面前是提供，把价格献出来是报价，把商品摆出来供人选就是出售。核心是"对方仍有选择权"。',
    synonyms: [
      { word: 'provide', distinction: 'provide 强调实际供给到位，不强调对方选择。' },
      { word: 'propose', distinction: 'propose 正式提出方案、建议。' },
      { word: 'present', distinction: 'present 正式呈交，含"当面递交"。' },
    ],
    level: 1,
  },

  oppose: {
    lemma: 'oppose',
    uk: '/əˈpəʊz/',
    us: '/əˈpoʊz/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '反对（计划、政策、做法）',
        example: 'Local residents oppose the new road.',
        exampleZh: '当地居民反对修建这条新路。',
      },
      {
        pos: 'v.',
        cn: '与…相对立（be opposed to / as opposed to）',
        example: 'The two views are diametrically opposed.',
        exampleZh: '这两种观点截然对立。',
      },
    ],
    collocations: [
      { phrase: 'oppose a plan', cn: '反对某计划' },
      { phrase: 'be opposed to', cn: '反对' },
      { phrase: 'as opposed to', cn: '而不是' },
    ],
    family: ['opposes', 'opposed', 'opposing', 'opposition'],
    semanticNote:
      '由"放在对面"出发：把自己放在对面就是反对，两种观点放在对面就是"截然相反"，as opposed to 就是"把两者摆开作对比"。',
    synonyms: [
      { word: 'resist', distinction: 'resist 含"抵抗、抵制"的行动，语气更强。' },
      { word: 'object', distinction: 'object 表反对时必须接 to，语气较正式。' },
      { word: 'contradict', distinction: 'contradict 指言论上与…相矛盾，不涉及立场对抗。' },
    ],
    level: 2,
  },

  ordinary: {
    lemma: 'ordinary',
    uk: '/ˈɔːdnri/',
    us: '/ˈɔːrdneri/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '普通的，平常的（无特别之处）',
        example: 'It started as an ordinary working day.',
        exampleZh: '那天开始时和普通工作日没什么两样。',
      },
      {
        pos: 'adj.',
        cn: '平庸的，不出色的',
        example: 'The food was ordinary at best.',
        exampleZh: '这菜充其量算一般。',
      },
    ],
    collocations: [
      { phrase: 'ordinary people', cn: '普通人' },
      { phrase: 'out of the ordinary', cn: '不寻常' },
      { phrase: 'in the ordinary way', cn: '通常情况下' },
    ],
    family: ['ordinarily', 'extraordinary'],
    semanticNote:
      '由"按常规顺序的"出发：按常规来的就是普通，普通到没有亮点就是平庸。褒贬全看上下文与修饰语。',
    synonyms: [
      { word: 'common', distinction: 'common 指"常见的、多数的"，中性，不含"平庸"评价。' },
      { word: 'usual', distinction: 'usual 指"习惯上如此的"，与"这一次"相对。' },
      { word: 'average', distinction: 'average 指"平均水平的"，常暗示不出色。' },
    ],
    level: 2,
  },

  organize: {
    lemma: 'organize',
    uk: '/ˈɔːɡənaɪz/',
    us: '/ˈɔːrɡənaɪz/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '组织，筹办（活动、会议）',
        example: 'They organized a concert to raise money.',
        exampleZh: '他们办了一场音乐会来筹款。',
      },
      {
        pos: 'v.',
        cn: '整理，安排（使有条理）',
        example: 'She organized her notes into three piles.',
        exampleZh: '她把笔记整理成三摞。',
      },
    ],
    collocations: [
      { phrase: 'organize an event', cn: '筹办活动' },
      { phrase: 'well-organized', cn: '有条理的' },
      { phrase: 'organize into', cn: '整理成' },
    ],
    family: ['organizes', 'organized', 'organizing', 'organization', 'organizer'],
    semanticNote:
      '由"使成为器官般的整体"出发：把人和事安排成一个整体是组织，把杂物安排成有序状态是整理。美式拼 organize，英式亦可作 organise。',
    synonyms: [
      { word: 'arrange', distinction: 'arrange 多指安排时间、顺序、座位，强调"排定"。' },
      { word: 'coordinate', distinction: 'coordinate 强调协调各方配合，多方参与。' },
      { word: 'sort', distinction: 'sort 指分类整理，口语，常接 out。' },
    ],
    level: 1,
  },

  particular: {
    lemma: 'particular',
    uk: '/pəˈtɪkjələ(r)/',
    us: '/pərˈtɪkjələr/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '特定的，某一个（作定语）',
        example: 'On that particular day, the shop was closed.',
        exampleZh: '就在那一天，商店关门了。',
      },
      {
        pos: 'adj.',
        cn: '特别的，格外的（take particular care）',
        example: 'She took particular care with the wording.',
        exampleZh: '她在措辞上格外用心。',
      },
      {
        pos: 'adj.',
        cn: '挑剔的，讲究的（be particular about）',
        example: 'He is very particular about his coffee.',
        exampleZh: '他对咖啡很讲究。',
      },
    ],
    collocations: [
      { phrase: 'in particular', cn: '尤其' },
      { phrase: 'be particular about', cn: '对…挑剔／讲究' },
      { phrase: 'a particular case', cn: '特定案例' },
    ],
    family: ['particularly', 'particularity', 'particularize'],
    semanticNote:
      '由"关于某一点"出发：指向某一点就是"特定的"，对某一点格外在意就是"格外的"，对某一点过分在意就变成"挑剔"。',
    synonyms: [
      { word: 'specific', distinction: 'specific 强调"明确、具体"，与"笼统"相对；particular 强调"这一个"。' },
      { word: 'special', distinction: 'special 含"与众不同、值得另眼相看"之意。' },
      { word: 'peculiar', distinction: 'peculiar 指"奇特"，也可指"某人所独有的"。' },
    ],
    level: 2,
  },

  perform: {
    lemma: 'perform',
    uk: '/pəˈfɔːm/',
    us: '/pərˈfɔːrm/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '表演，演出',
        example: 'The group performs every Friday night.',
        exampleZh: '这个乐队每周五晚上演出。',
      },
      {
        pos: 'v.',
        cn: '执行，履行（任务、职责、手术）',
        example: 'The surgeon performed the operation in under an hour.',
        exampleZh: '外科医生不到一小时就做完了这台手术。',
      },
      {
        pos: 'v.',
        cn: '表现（在工作、测试、路况中）',
        example: 'The car performs well on wet roads.',
        exampleZh: '这车在湿滑路面上表现不错。',
      },
    ],
    collocations: [
      { phrase: 'perform well', cn: '表现良好' },
      { phrase: 'perform a task', cn: '执行任务' },
      { phrase: 'perform on stage', cn: '登台演出' },
    ],
    family: ['performs', 'performed', 'performing', 'performance', 'performer'],
    semanticNote:
      '由"彻底完成"出发：在观众面前完成一套动作是表演，完成一项职责是执行，完成得好不好就是"表现"。',
    synonyms: [
      { word: 'conduct', distinction: 'conduct 多指进行调查、实验、采访，正式。' },
      { word: 'carry out', distinction: 'carry out 口语，指执行任务、计划、实验。' },
      { word: 'act', distinction: 'act 指表演，多用于戏剧、电影，也可指"采取行动"。' },
    ],
    level: 2,
  },

  permit: {
    lemma: 'permit',
    uk: '/pəˈmɪt/',
    us: '/pərˈmɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '允许，准许（较正式）',
        example: 'Smoking is not permitted in the building.',
        exampleZh: '楼内禁止吸烟。',
      },
      {
        pos: 'n.',
        cn: '许可证（重音在前 /ˈpɜːmɪt/）',
        example: 'You need a permit to park here.',
        exampleZh: '在这里停车需要许可证。',
      },
    ],
    collocations: [
      { phrase: 'permit sb to do', cn: '允许某人做' },
      { phrase: 'a work permit', cn: '工作许可' },
      { phrase: 'weather permitting', cn: '天气允许的话' },
    ],
    family: ['permits', 'permitted', 'permitting', 'permission', 'permissible'],
    semanticNote:
      '由"让通过"出发：让某事通过是允许，让一张纸通过关卡就是许可证。名动重音交替：动词在后，名词在前。',
    synonyms: [
      { word: 'allow', distinction: 'allow 最通用，语气中性；permit 更正式，多用于规章。' },
      { word: 'let', distinction: 'let 口语，后接不带 to 的不定式。' },
      { word: 'authorize', distinction: 'authorize 指正式授权，多用于官方、法律。' },
    ],
    level: 3,
  },

  persuade: {
    lemma: 'persuade',
    uk: '/pəˈsweɪd/',
    us: '/pərˈsweɪd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '说服（某人做某事，强调结果）',
        example: 'We persuaded her to stay for dinner.',
        exampleZh: '我们说服她留下吃晚饭。',
      },
      {
        pos: 'v.',
        cn: '使相信（persuade sb of sth）',
        example: 'He persuaded the jury of his innocence.',
        exampleZh: '他让陪审团相信他是无辜的。',
      },
    ],
    collocations: [
      { phrase: 'persuade sb to do', cn: '说服某人做' },
      { phrase: 'persuade sb of sth', cn: '使某人相信某事' },
      { phrase: 'try to persuade', cn: '试图说服' },
    ],
    family: ['persuades', 'persuaded', 'persuading', 'persuasion', 'persuasive'],
    semanticNote:
      '与 convince 的分工：persuade 强调"说动了、真的去做了"，convince 强调"使相信"。persuade 本身已含成功，要表"试图"须加 try to。',
    synonyms: [
      { word: 'convince', distinction: 'convince 偏认知上的"使相信"，不必然带来行动。' },
      { word: 'urge', distinction: 'urge 指力劝，语气急迫，不保证对方接受。' },
      { word: 'talk into', distinction: 'talk into 口语，指劝某人做某事，常含"费了口舌"。' },
    ],
    level: 2,
  },

  prefer: {
    lemma: 'prefer',
    uk: '/prɪˈfɜː(r)/',
    us: '/prɪˈfɜːr/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '更喜欢（prefer A to B，不用 than）',
        example: 'I prefer tea to coffee.',
        exampleZh: '比起咖啡我更喜欢茶。',
      },
      {
        pos: 'v.',
        cn: '宁愿（prefer to do / prefer doing）',
        example: 'She prefers to work alone.',
        exampleZh: '她宁愿独自工作。',
      },
    ],
    collocations: [
      { phrase: 'prefer A to B', cn: '喜欢 A 胜过 B' },
      { phrase: 'prefer to do', cn: '宁愿做' },
      { phrase: 'would prefer', cn: '更愿意' },
    ],
    family: ['prefers', 'preferred', 'preferring', 'preference', 'preferable'],
    semanticNote:
      '由"放在前面"出发：把某样东西放在前面就是更喜欢。搭配要记牢：prefer A to B 不用 than；prefer to do rather than do。',
    synonyms: [
      { word: 'favour', distinction: 'favour 正式，指偏向某一方案，也可指"有利于"。' },
      { word: 'would rather', distinction: 'would rather 后接动词原形，口语化，语气更主观。' },
      { word: 'choose', distinction: 'choose 只表示作出选择，不含"更喜欢"的程度。' },
    ],
    level: 1,
  },

  prevent: {
    lemma: 'prevent',
    uk: '/prɪˈvent/',
    us: '/prɪˈvent/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '阻止，妨碍（prevent sb from doing）',
        example: 'The fence prevents animals from entering.',
        exampleZh: '围栏挡住了动物进入。',
      },
      {
        pos: 'v.',
        cn: '预防（疾病、事故、问题）',
        example: 'Regular exercise helps prevent heart disease.',
        exampleZh: '经常锻炼有助于预防心脏病。',
      },
    ],
    collocations: [
      { phrase: 'prevent sb from doing', cn: '阻止某人做' },
      { phrase: 'prevent the spread of', cn: '防止…蔓延' },
      { phrase: 'prevent disease', cn: '预防疾病' },
    ],
    family: ['prevents', 'prevented', 'preventing', 'prevention', 'preventive'],
    semanticNote:
      '由"先到前面"出发：抢在前面挡住就是阻止；抢在坏事发生之前挡住就是预防。介词用 from，口语中可省略。',
    synonyms: [
      { word: 'stop', distinction: 'stop 最通用，也可接 from doing，语气比 prevent 直接。' },
      { word: 'avoid', distinction: 'avoid 的主语是自己避开，不能指"阻止别人"。' },
      { word: 'prohibit', distinction: 'prohibit 指依据规定明令禁止，正式。' },
    ],
    level: 2,
  },

  produce: {
    lemma: 'produce',
    uk: '/prəˈdjuːs/',
    us: '/prəˈduːs/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '生产，制造（实物）',
        example: 'The factory produces parts for aircraft.',
        exampleZh: '这家工厂生产飞机零件。',
      },
      {
        pos: 'v.',
        cn: '产生（结果、效果、证据）',
        example: 'The talks produced no agreement.',
        exampleZh: '会谈没有达成任何协议。',
      },
      {
        pos: 'n.',
        cn: '农产品（不可数，重音在前 /ˈprɒdjuːs/）',
        example: 'The market sells local produce.',
        exampleZh: '这个市场卖本地农产品。',
      },
    ],
    collocations: [
      { phrase: 'produce results', cn: '产生结果' },
      { phrase: 'mass-produced', cn: '大批量生产的' },
      { phrase: 'local produce', cn: '本地农产品' },
    ],
    family: ['produces', 'produced', 'producing', 'product', 'production', 'producer', 'productive'],
    semanticNote:
      '由"向前引出"出发：把产品引出来是生产，把结果引出来是产生。名词 produce 重音前移，专指农产品，这一点常考。',
    synonyms: [
      { word: 'make', distinction: 'make 最通用、最口语，不强调规模与工艺。' },
      { word: 'manufacture', distinction: 'manufacture 指工业化制造，正式，强调流程。' },
      { word: 'generate', distinction: 'generate 多用于能源、收入、数据等由机制产出的东西。' },
    ],
    level: 1,
  },

  progress: {
    lemma: 'progress',
    uk: '/ˈprəʊɡres/',
    us: '/ˈprɑːɡres/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '进步，进展（不可数，不能说 a progress）',
        example: 'She has made good progress this term.',
        exampleZh: '这学期她进步很大。',
      },
      {
        pos: 'v.',
        cn: '前进，进展（重音在后 /prəˈɡres/）',
        example: 'The work is progressing slowly.',
        exampleZh: '工作进展缓慢。',
      },
    ],
    collocations: [
      { phrase: 'make progress', cn: '取得进步' },
      { phrase: 'in progress', cn: '进行中' },
      { phrase: 'progress report', cn: '进度报告' },
    ],
    family: ['progresses', 'progressed', 'progressing', 'progressive'],
    semanticNote:
      '由"向前走"出发：往前走这个动作是进展，走出来的距离是进步。名词不可数，所以只能说 make progress，不能说 make a progress。',
    synonyms: [
      { word: 'advance', distinction: 'advance 较正式，指前进或进展，可作名词与动词。' },
      { word: 'development', distinction: 'development 多指事物本身的演变、发展过程。' },
      { word: 'improvement', distinction: 'improvement 强调"变得更好"，是 progress 的一种结果。' },
    ],
    level: 2,
  },

  prove: {
    lemma: 'prove',
    uk: '/pruːv/',
    us: '/pruːv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '证明，证实（用证据确定）',
        example: 'Can you prove that you were there?',
        exampleZh: '你能证明你当时在场吗？',
      },
      {
        pos: 'v.',
        cn: '结果是，原来是（prove to be）',
        example: 'The task proved harder than expected.',
        exampleZh: '这项任务比预想的更难。',
      },
    ],
    collocations: [
      { phrase: 'prove to be', cn: '结果是' },
      { phrase: 'prove that…', cn: '证明…' },
      { phrase: 'prove sb wrong', cn: '证明某人错了' },
    ],
    family: ['proves', 'proved', 'proven', 'proving', 'proof'],
    semanticNote:
      '由"检验"出发：检验之后得出结论是证明；事情经过检验显出真面目，就是"结果是"。第二条义项不用被动。',
    synonyms: [
      { word: 'demonstrate', distinction: 'demonstrate 侧重"展示出足以令人信服的东西"，语气略弱于 prove。' },
      { word: 'confirm', distinction: 'confirm 是证实已有的推测，不强调从零建立。' },
      { word: 'verify', distinction: 'verify 强调通过核查程序确认，多用于数据、身份。' },
    ],
    level: 2,
  },

  pursue: {
    lemma: 'pursue',
    uk: '/pəˈsjuː/',
    us: '/pərˈsuː/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '追求（目标、梦想、事业）',
        example: 'She moved abroad to pursue a career in music.',
        exampleZh: '她移居国外去追求音乐事业。',
      },
      {
        pos: 'v.',
        cn: '继续进行，从事（调查、研究、政策）',
        example: 'The police are pursuing a new line of inquiry.',
        exampleZh: '警方正在追查一条新线索。',
      },
      {
        pos: 'v.',
        cn: '追赶，追捕',
        example: 'The car was pursued by two police vehicles.',
        exampleZh: '那辆车被两辆警车追赶。',
      },
    ],
    collocations: [
      { phrase: 'pursue a career', cn: '从事某职业' },
      { phrase: 'pursue a goal', cn: '追求目标' },
      { phrase: 'pursue an investigation', cn: '继续调查' },
    ],
    family: ['pursues', 'pursued', 'pursuing', 'pursuit'],
    semanticNote:
      '由"跟随"出发：跟在目标后面是追求，跟在案件线索后面是继续追查，跟在人后面跑就是追捕。',
    synonyms: [
      { word: 'chase', distinction: 'chase 口语，指追赶，也可指追求名利。' },
      { word: 'seek', distinction: 'seek 正式，指寻求帮助、机会、答案。' },
      { word: 'follow', distinction: 'follow 最通用，指跟随，也可指遵循。' },
    ],
    level: 3,
  },

  qualify: {
    lemma: 'qualify',
    uk: '/ˈkwɒlɪfaɪ/',
    us: '/ˈkwɑːlɪfaɪ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '取得资格，合格（qualify as / for）',
        example: 'She qualified as a doctor last year.',
        exampleZh: '她去年取得了医生资格。',
      },
      {
        pos: 'v.',
        cn: '有资格，符合条件',
        example: 'You may qualify for a grant.',
        exampleZh: '你可能符合申请补助的条件。',
      },
      {
        pos: 'v.',
        cn: '限定，修饰（语法、论述）',
        example: 'Adjectives qualify nouns.',
        exampleZh: '形容词修饰名词。',
      },
    ],
    collocations: [
      { phrase: 'qualify as', cn: '取得…资格' },
      { phrase: 'qualify for', cn: '有资格获得' },
      { phrase: 'highly qualified', cn: '资历很高的' },
    ],
    family: ['qualifies', 'qualified', 'qualifying', 'qualification'],
    semanticNote:
      '由"使具备某种性质"出发：让自己具备条件是取得资格，让某说法带上限定条件就是"限定"；语法里修饰名词也是给名词加限定。',
    synonyms: [
      { word: 'entitle', distinction: 'entitle 指赋予权利，常用被动 be entitled to。' },
      { word: 'be eligible for', distinction: 'be eligible for 指符合条件、有资格，正式。' },
      { word: 'certify', distinction: 'certify 指正式认证，出具证明。' },
    ],
    level: 3,
  },

  raise: {
    lemma: 'raise',
    uk: '/reɪz/',
    us: '/reɪz/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '举起，抬起；提高（水平、价格、工资）',
        example: 'The council raised parking charges again this year.',
        exampleZh: '市议会今年再次提高了停车费。',
      },
      {
        pos: 'v.',
        cn: '提出（问题、疑虑、议题）',
        example: 'Several parents raised concerns about safety.',
        exampleZh: '几位家长提出了安全方面的担忧。',
      },
      {
        pos: 'v.',
        cn: '抚养（孩子），饲养（动物）',
        example: 'She raised three children on her own.',
        exampleZh: '她独自把三个孩子抚养成人。',
      },
    ],
    collocations: [
      { phrase: 'raise awareness', cn: '提高意识' },
      { phrase: 'raise a question', cn: '提出问题' },
      { phrase: 'raise money', cn: '筹款' },
      { phrase: 'raise children', cn: '抚养孩子' },
    ],
    family: ['raises', 'raised', 'raising'],
    semanticNote:
      '核心是"往上抬"：把物体往上抬是举起，把数量往上抬是提高，把问题抬到桌面上是提出，把孩子往上养大就是抚养。注意 raise 及物，rise 不及物。',
    synonyms: [
      { word: 'rise', distinction: 'rise 不及物，指自身上升，不能带宾语，也没有被动。' },
      { word: 'lift', distinction: 'lift 多指用体力举起实物，口语，也可指"提高"限制。' },
      { word: 'increase', distinction: 'increase 泛指数量增加，raise 强调"由人主动调高"。' },
    ],
    level: 2,
  },

  range: {
    lemma: 'range',
    uk: '/reɪndʒ/',
    us: '/reɪndʒ/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '范围，幅度（涉及或变动的区间）',
        example: 'The course covers a wide range of topics.',
        exampleZh: '这门课涵盖的话题很广。',
      },
      {
        pos: 'n.',
        cn: '一系列（同类商品、选择）',
        example: 'The shop stocks a range of organic teas.',
        exampleZh: '这家店供应一系列有机茶。',
      },
      {
        pos: 'v.',
        cn: '在…范围内变动（range from…to…）',
        example: 'Prices range from twenty to two hundred pounds.',
        exampleZh: '价格从二十到两百英镑不等。',
      },
    ],
    collocations: [
      { phrase: 'a wide range of', cn: '各种各样的' },
      { phrase: 'range from…to…', cn: '从…到…不等' },
      { phrase: 'within range', cn: '在范围内' },
      { phrase: 'out of range', cn: '超出范围' },
    ],
    family: ['ranges', 'ranged', 'ranging'],
    semanticNote:
      '由"排列成行"出发：排成一行的东西构成"一系列"，这一行从头到尾的距离是"范围"，在两端之间变动就是"从…到…不等"。',
    synonyms: [
      { word: 'scope', distinction: 'scope 多指议题、工作涉及的范围与余地。' },
      { word: 'extent', distinction: 'extent 多指程度、广度，常用于 to some extent。' },
      { word: 'variety', distinction: 'variety 强调种类多，常与 a variety of 搭配。' },
    ],
    level: 2,
  },

  realize: {
    lemma: 'realize',
    uk: '/ˈriːəlaɪz/',
    us: '/ˈriːəlaɪz/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '意识到，认识到（此前没注意）',
        example: 'I did not realize how late it was.',
        exampleZh: '我没意识到已经这么晚了。',
      },
      {
        pos: 'v.',
        cn: '实现（目标、梦想、价值）',
        example: 'The plan was never fully realized.',
        exampleZh: '这个计划从未完全实现。',
      },
    ],
    collocations: [
      { phrase: 'realize that…', cn: '意识到…' },
      { phrase: 'realize one\'s potential', cn: '发挥潜力' },
      { phrase: 'suddenly realize', cn: '突然意识到' },
    ],
    family: ['realizes', 'realized', 'realizing', 'realization'],
    semanticNote:
      '由"使成为真实"出发：让目标变成现实是实现，让某个事实在脑子里变成现实就是"意识到"。英式亦可作 realise。',
    synonyms: [
      { word: 'notice', distinction: 'notice 指注意到，程度较浅，不一定带来认知上的转变。' },
      { word: 'recognize', distinction: 'recognize 多指认出，或公开承认某事实。' },
      { word: 'achieve', distinction: 'achieve 指达成目标，强调结果，与"意识到"无关。' },
    ],
    level: 2,
  },

  recognize: {
    lemma: 'recognize',
    uk: '/ˈrekəɡnaɪz/',
    us: '/ˈrekəɡnaɪz/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '认出（曾经见过的人或物）',
        example: 'I hardly recognized her after all these years.',
        exampleZh: '这么多年过去，我几乎认不出她了。',
      },
      {
        pos: 'v.',
        cn: '承认，认可（事实、成就、问题）',
        example: 'The government recognized the need for change.',
        exampleZh: '政府承认了变革的必要性。',
      },
      {
        pos: 'v.',
        cn: '正式承认（国家、资格、学位）',
        example: 'The country was recognized as independent in 1960.',
        exampleZh: '该国于 1960 年被承认为独立国家。',
      },
    ],
    collocations: [
      { phrase: 'recognize sb by', cn: '凭…认出某人' },
      { phrase: 'be recognized as', cn: '被公认为' },
      { phrase: 'widely recognized', cn: '公认的' },
    ],
    family: ['recognizes', 'recognized', 'recognizing', 'recognition', 'recognizable'],
    semanticNote:
      '由"重新知道"出发：再次见到而知道是它，是认出；知道某事为真并公开承认，是认可；由官方出面认可，就是正式承认。',
    synonyms: [
      { word: 'identify', distinction: 'identify 只需确认身份，不要求此前认识。' },
      { word: 'acknowledge', distinction: 'acknowledge 指承认事实，常含"不情愿但不得不认"。' },
      { word: 'admit', distinction: 'admit 多指承认错误或不愿说的事，带歉意。' },
    ],
    level: 2,
  },

  recommend: {
    lemma: 'recommend',
    uk: '/ˌrekəˈmend/',
    us: '/ˌrekəˈmend/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '推荐，介绍（认为值得一试）',
        example: 'Can you recommend a good dentist?',
        exampleZh: '你能推荐一位好牙医吗？',
      },
      {
        pos: 'v.',
        cn: '建议（正式，从句用虚拟语气）',
        example: 'The report recommends that the scheme be extended.',
        exampleZh: '报告建议延长该方案。',
      },
    ],
    collocations: [
      { phrase: 'highly recommend', cn: '强烈推荐' },
      { phrase: 'recommend doing sth', cn: '建议做某事' },
      { phrase: 'recommend that…', cn: '建议…' },
    ],
    family: ['recommends', 'recommended', 'recommending', 'recommendation'],
    semanticNote:
      '与 suggest 的分工：recommend 含"我认为这样更好"的价值判断，带推荐意味；suggest 只是提出一种可能。两者接从句时都用虚拟语气。',
    synonyms: [
      { word: 'suggest', distinction: 'suggest 只提出可能，不含"更好"的判断。' },
      { word: 'advise', distinction: 'advise 侧重给对方出主意，站在顾问位置。' },
      { word: 'endorse', distinction: 'endorse 指公开支持、代言，多用于产品、候选人。' },
    ],
    level: 2,
  },

  recover: {
    lemma: 'recover',
    uk: '/rɪˈkʌvə(r)/',
    us: '/rɪˈkʌvər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '康复，恢复健康（recover from）',
        example: 'It took him months to recover from the operation.',
        exampleZh: '他术后花了好几个月才康复。',
      },
      {
        pos: 'v.',
        cn: '恢复（水平、经济、信心）',
        example: 'The industry has recovered slowly.',
        exampleZh: '该行业恢复缓慢。',
      },
      {
        pos: 'v.',
        cn: '找回，重新获得（失物、失地）',
        example: 'Police recovered the stolen paintings.',
        exampleZh: '警方找回了被盗的画作。',
      },
    ],
    collocations: [
      { phrase: 'recover from', cn: '从…中恢复' },
      { phrase: 'recover lost ground', cn: '收复失地' },
      { phrase: 'fully recover', cn: '完全康复' },
    ],
    family: ['recovers', 'recovered', 'recovering', 'recovery'],
    semanticNote:
      '由"重新拿到"出发：把健康重新拿到是康复，把水平重新拿到是恢复，把失物重新拿到就是找回。',
    synonyms: [
      { word: 'recuperate', distinction: 'recuperate 正式，多指休养康复，强调休息过程。' },
      { word: 'regain', distinction: 'regain 及物，指重新获得，后面直接接宾语。' },
      { word: 'bounce back', distinction: 'bounce back 口语，指迅速恢复，含"弹性好"。' },
    ],
    level: 2,
  },

  relate: {
    lemma: 'relate',
    uk: '/rɪˈleɪt/',
    us: '/rɪˈleɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '有关，涉及（relate to）',
        example: 'The questions relate to the first two chapters.',
        exampleZh: '这些问题与头两章有关。',
      },
      {
        pos: 'v.',
        cn: '把…联系起来（relate A to B）',
        example: 'The study relates diet to mood.',
        exampleZh: '这项研究把饮食与情绪联系起来。',
      },
      {
        pos: 'v.',
        cn: '理解，产生共鸣（relate to）',
        example: 'Teenagers relate to songs about being misunderstood.',
        exampleZh: '青少年对唱"被误解"的歌很有共鸣。',
      },
    ],
    collocations: [
      { phrase: 'relate to', cn: '与…有关；理解' },
      { phrase: 'be related to', cn: '与…相关' },
      { phrase: 'relate A to B', cn: '把 A 与 B 联系起来' },
    ],
    family: ['relates', 'related', 'relating', 'relation', 'relationship', 'relative'],
    semanticNote:
      '由"带回联系"出发：两件事之间有联系是"有关"，主动把两件事连起来是"联系"，能把自己的经历和对方连上就是"共鸣"。',
    synonyms: [
      { word: 'connect', distinction: 'connect 可指具体连接，也可指抽象关联，最通用。' },
      { word: 'associate', distinction: 'associate 指在头脑中把两者联想在一起，常接 with。' },
      { word: 'concern', distinction: 'concern 指"涉及"，正式，主语多为事物。' },
    ],
    level: 2,
  },

  release: {
    lemma: 'release',
    uk: '/rɪˈliːs/',
    us: '/rɪˈliːs/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '释放，放走（人或动物）',
        example: 'The birds were released back into the wild.',
        exampleZh: '这些鸟被放回了野外。',
      },
      {
        pos: 'v.',
        cn: '发布，发行（数据、影片、专辑）',
        example: 'The figures will be released next month.',
        exampleZh: '这些数据将于下月公布。',
      },
      {
        pos: 'n.',
        cn: '释放；发行（on release 上映）',
        example: 'The film goes on release in June.',
        exampleZh: '这部电影六月上映。',
      },
    ],
    collocations: [
      { phrase: 'release a report', cn: '发布报告' },
      { phrase: 'release sb from', cn: '把某人从…中释放' },
      { phrase: 'press release', cn: '新闻稿' },
    ],
    family: ['releases', 'released', 'releasing'],
    semanticNote:
      '由"松开"出发：把抓住的东西松开是释放，把压着的信息松开就是发布。',
    synonyms: [
      { word: 'free', distinction: 'free 指使自由，最通用，可指人也可指资源。' },
      { word: 'publish', distinction: 'publish 多指出版、公布文字或数据，强调公开。' },
      { word: 'launch', distinction: 'launch 指推出新产品，通常伴随宣传推广。' },
    ],
    level: 2,
  },

  rely: {
    lemma: 'rely',
    uk: '/rɪˈlaɪ/',
    us: '/rɪˈlaɪ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '依靠，依赖（rely on 某物）',
        example: 'Many students rely on part-time work to pay rent.',
        exampleZh: '很多学生靠兼职付房租。',
      },
      {
        pos: 'v.',
        cn: '信赖，指望（rely on 某人）',
        example: 'You can rely on her to be honest.',
        exampleZh: '你可以指望她说实话。',
      },
    ],
    collocations: [
      { phrase: 'rely on', cn: '依靠' },
      { phrase: 'rely heavily on', cn: '严重依赖' },
      { phrase: 'rely on sb to do', cn: '指望某人做' },
    ],
    family: ['relies', 'relied', 'relying', 'reliance', 'reliable', 'reliability'],
    semanticNote:
      '由"把自身绑在…上"出发：绑在某人或某物上是依靠，绑得住、靠得住就是信赖。相比 depend on，rely on 更强调"信任"。',
    synonyms: [
      { word: 'depend on', distinction: 'depend on 偏客观依赖，也可指"取决于"；rely on 更强调信任。' },
      { word: 'count on', distinction: 'count on 口语，指"指望"，带信心。' },
      { word: 'trust', distinction: 'trust 多指信任人品、判断，不必然含"依赖其供给"。' },
    ],
    level: 2,
  },

  remove: {
    lemma: 'remove',
    uk: '/rɪˈmuːv/',
    us: '/rɪˈmuːv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '移开，去掉（物体、污渍、障碍）',
        example: 'Please remove your shoes before entering.',
        exampleZh: '进门前请脱鞋。',
      },
      {
        pos: 'v.',
        cn: '撤销职务，免除',
        example: 'The manager was removed from his post.',
        exampleZh: '这位经理被撤职了。',
      },
      {
        pos: 'v.',
        cn: '消除（疑虑、障碍、不公平）',
        example: 'The apology did little to remove the doubt.',
        exampleZh: '一句道歉并没有消除疑虑。',
      },
    ],
    collocations: [
      { phrase: 'remove from', cn: '从…中移除' },
      { phrase: 'remove the barrier', cn: '消除障碍' },
      { phrase: 'remove doubts', cn: '消除疑虑' },
    ],
    family: ['removes', 'removed', 'removing', 'removal'],
    semanticNote:
      '由"移走"出发：把物体移走是去掉，把人从职位上移走是撤职，把疑虑移走就是消除。',
    synonyms: [
      { word: 'eliminate', distinction: 'eliminate 指彻底消除，语气最强，多用于问题、风险。' },
      { word: 'delete', distinction: 'delete 专指删除文字、文件、数据。' },
      { word: 'take away', distinction: 'take away 口语，指拿走、带走。' },
    ],
    level: 2,
  },

  replace: {
    lemma: 'replace',
    uk: '/rɪˈpleɪs/',
    us: '/rɪˈpleɪs/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '取代，代替（新的顶替旧的）',
        example: 'Email has largely replaced letters.',
        exampleZh: '电子邮件已在很大程度上取代了信件。',
      },
      {
        pos: 'v.',
        cn: '更换，替换（坏掉的东西）',
        example: 'We need to replace the broken window.',
        exampleZh: '我们得把破了的窗子换掉。',
      },
    ],
    collocations: [
      { phrase: 'replace A with B', cn: '用 B 替换 A' },
      { phrase: 'be replaced by', cn: '被…取代' },
      { phrase: 'replace the battery', cn: '更换电池' },
    ],
    family: ['replaces', 'replaced', 'replacing', 'replacement'],
    semanticNote:
      '由"放回原位"出发：把旧东西放回去、用新的顶上就是替换；新的顶上之后旧的就不在了，就是取代。注意方向：replace A with B 是"用 B 换 A"。',
    synonyms: [
      { word: 'substitute', distinction: 'substitute 结构相反：substitute B for A 意为用 B 代替 A。' },
      { word: 'displace', distinction: 'displace 含"挤走、迫使离开"之意，多用于人、物种。' },
      { word: 'renew', distinction: 'renew 指更新证件、合同、订阅，强调续期。' },
    ],
    level: 2,
  },

  represent: {
    lemma: 'represent',
    uk: '/ˌreprɪˈzent/',
    us: '/ˌreprɪˈzent/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '代表（人、组织、团体）',
        example: 'She represents the union on the committee.',
        exampleZh: '她在委员会中代表工会。',
      },
      {
        pos: 'v.',
        cn: '表示，象征（符号、图形）',
        example: 'In this chart, the red bars represent last year.',
        exampleZh: '在这张图里，红色柱表示去年。',
      },
      {
        pos: 'v.',
        cn: '构成，占（一定比例）',
        example: 'Women represent 60 per cent of the workforce.',
        exampleZh: '女性占劳动力的百分之六十。',
      },
    ],
    collocations: [
      { phrase: 'represent a change', cn: '代表一种变化' },
      { phrase: 'be represented by', cn: '由…代表' },
      { phrase: 'represent 40% of', cn: '占…的 40%' },
    ],
    family: ['represents', 'represented', 'representing', 'representation', 'representative'],
    semanticNote:
      '由"使在场"出发：替不在场的人出面是代表，用符号让某个量"在场"是表示，一群人在整体中占一席之地就是"占…比例"。',
    synonyms: [
      { word: 'stand for', distinction: 'stand for 多指符号、缩写所代表的内容，也可指"主张"。' },
      { word: 'symbolize', distinction: 'symbolize 多用于抽象意义的象征，如颜色象征情感。' },
      { word: 'account for', distinction: 'account for 表"占…比例"时与 represent 相近，也可指"解释"。' },
    ],
    level: 3,
  },

  resist: {
    lemma: 'resist',
    uk: '/rɪˈzɪst/',
    us: '/rɪˈzɪst/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '抵抗，抵制（变革、诱惑、压力）',
        example: 'The town resisted the plan for years.',
        exampleZh: '这个小镇抵制该计划多年。',
      },
      {
        pos: 'v.',
        cn: '抵挡，抗（侵蚀、疾病、磨损）',
        example: 'This fabric resists stains.',
        exampleZh: '这种布料抗污。',
      },
    ],
    collocations: [
      { phrase: 'resist change', cn: '抵制变革' },
      { phrase: 'resist the temptation', cn: '抵制诱惑' },
      { phrase: 'cannot resist doing', cn: '忍不住做' },
    ],
    family: ['resists', 'resisted', 'resisting', 'resistance', 'resistant'],
    semanticNote:
      '由"站住不动"出发：面对外力站住不退是抵抗，材料对外力站得住就是"抗…"。语法上记牢 resist doing，不接不定式。',
    synonyms: [
      { word: 'oppose', distinction: 'oppose 偏重表态上的反对，不一定有行动。' },
      { word: 'withstand', distinction: 'withstand 指承受住压力、考验，强调"没被压垮"。' },
      { word: 'defy', distinction: 'defy 指公然违抗，语气最强，也可指"使难以…"。' },
    ],
    level: 3,
  },

  resolve: {
    lemma: 'resolve',
    uk: '/rɪˈzɒlv/',
    us: '/rɪˈzɑːlv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '解决（问题、争端）',
        example: 'The two sides resolved the dispute without going to court.',
        exampleZh: '双方没有上法庭就解决了争端。',
      },
      {
        pos: 'v.',
        cn: '决心，决意（resolve to do，正式）',
        example: 'She resolved to speak to him directly.',
        exampleZh: '她决心直接跟他说。',
      },
      {
        pos: 'n.',
        cn: '决心（不可数，正式）',
        example: 'He met the criticism with quiet resolve.',
        exampleZh: '他平静而坚定地面对批评。',
      },
    ],
    collocations: [
      { phrase: 'resolve a dispute', cn: '解决争端' },
      { phrase: 'resolve to do', cn: '决心做' },
      { phrase: 'resolve the issue', cn: '解决问题' },
    ],
    family: ['resolves', 'resolved', 'resolving', 'resolution', 'resolute'],
    semanticNote:
      '由"把结解开"出发：把问题的结解开是解决，把心里的犹豫解开、定下来就是决心。',
    synonyms: [
      { word: 'solve', distinction: 'solve 更常用于具体问题、难题、方程，技术性强。' },
      { word: 'settle', distinction: 'settle 多指解决争端，强调双方达成一致。' },
      { word: 'determine', distinction: 'determine 也可指下决心，但更常指"决定结果、查明"。' },
    ],
    level: 3,
  },

  restrict: {
    lemma: 'restrict',
    uk: '/rɪˈstrɪkt/',
    us: '/rɪˈstrɪkt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '限制（数量、范围、自由）',
        example: 'The rules restrict the use of phones in class.',
        exampleZh: '规定限制课堂上使用手机。',
      },
      {
        pos: 'v.',
        cn: '把…局限于（restrict to）',
        example: 'Discussion was restricted to two topics.',
        exampleZh: '讨论只限于两个话题。',
      },
    ],
    collocations: [
      { phrase: 'restrict access to', cn: '限制进入' },
      { phrase: 'be restricted to', cn: '仅限于' },
      { phrase: 'restrict freedom', cn: '限制自由' },
    ],
    family: ['restricts', 'restricted', 'restricting', 'restriction', 'restrictive'],
    semanticNote:
      '由"收紧绑住"出发：把范围收紧是限制，收到某一点上就是"局限于"。语气比 limit 强，含"人为设限"之意。',
    synonyms: [
      { word: 'limit', distinction: 'limit 语气较中性，可指自然限度；restrict 强调人为设限。' },
      { word: 'constrain', distinction: 'constrain 含"受外力压制、不得自由"之意，较正式。' },
      { word: 'confine', distinction: 'confine 指把…局限在某个空间或范围内，空间感强。' },
    ],
    level: 3,
  },

  result: {
    lemma: 'result',
    uk: '/rɪˈzʌlt/',
    us: '/rɪˈzʌlt/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '结果，成果（可数）',
        example: 'The results of the survey were surprising.',
        exampleZh: '调查结果出人意料。',
      },
      {
        pos: 'v.',
        cn: '导致，造成（result in + 结果）',
        example: 'The delay resulted in a missed connection.',
        exampleZh: '这次延误导致错过了转乘。',
      },
      {
        pos: 'v.',
        cn: '由…造成（result from + 原因）',
        example: 'The problem results from poor planning.',
        exampleZh: '这个问题源于规划不周。',
      },
    ],
    collocations: [
      { phrase: 'result in', cn: '导致' },
      { phrase: 'result from', cn: '由…造成' },
      { phrase: 'as a result', cn: '因此' },
      { phrase: 'as a result of', cn: '由于' },
    ],
    family: ['results', 'resulted', 'resulting'],
    semanticNote:
      '由"弹回来"出发：事情做完弹回来的东西就是结果。方向必须分清：result in 后面接结果，result from 后面接原因，这是高频陷阱。',
    synonyms: [
      { word: 'consequence', distinction: 'consequence 常含负面意味，强调因果链。' },
      { word: 'outcome', distinction: 'outcome 指经过一段过程后的最终局面，较中性。' },
      { word: 'effect', distinction: 'effect 多指某事物造成的影响、效果。' },
    ],
    level: 2,
  },

  reward: {
    lemma: 'reward',
    uk: '/rɪˈwɔːd/',
    us: '/rɪˈwɔːrd/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '奖励，回报（可数）',
        example: 'The job brings few financial rewards.',
        exampleZh: '这份工作在经济上回报很少。',
      },
      {
        pos: 'v.',
        cn: '奖励，给以回报',
        example: 'Students were rewarded for their effort.',
        exampleZh: '学生们因努力而受到奖励。',
      },
      {
        pos: 'n.',
        cn: '悬赏金',
        example: 'A reward was offered for information.',
        exampleZh: '有人悬赏征集线索。',
      },
    ],
    collocations: [
      { phrase: 'reward for', cn: '对…的奖励' },
      { phrase: 'financial reward', cn: '经济回报' },
      { phrase: 'reward sb with', cn: '用…奖励某人' },
    ],
    family: ['rewards', 'rewarded', 'rewarding'],
    semanticNote:
      '由"回头看、给予回报"出发：对付出给予回报是奖励，对提供线索给予回报就是悬赏。与 award（颁发奖项）容易混，award 侧重"正式授予"。',
    synonyms: [
      { word: 'award', distinction: 'award 指正式颁发的奖项，多由机构决定，也可作动词。' },
      { word: 'prize', distinction: 'prize 多指竞赛中赢得的奖品。' },
      { word: 'bonus', distinction: 'bonus 指额外给予的奖金，与工资分开。' },
    ],
    level: 2,
  },

  satisfy: {
    lemma: 'satisfy',
    uk: '/ˈsætɪsfaɪ/',
    us: '/ˈsætɪsfaɪ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '使满意，满足（需要、要求）',
        example: 'The answer did not satisfy the committee.',
        exampleZh: '这个答复没能让委员会满意。',
      },
      {
        pos: 'v.',
        cn: '使确信，消除（疑虑）',
        example: 'He satisfied them that the money was safe.',
        exampleZh: '他让他们相信这笔钱是安全的。',
      },
      {
        pos: 'v.',
        cn: '符合（条件、标准）',
        example: 'Applicants must satisfy the entry requirements.',
        exampleZh: '申请者必须符合入学要求。',
      },
    ],
    collocations: [
      { phrase: 'satisfy demand', cn: '满足需求' },
      { phrase: 'be satisfied with', cn: '对…满意' },
      { phrase: 'satisfy the requirements', cn: '符合要求' },
    ],
    family: ['satisfies', 'satisfied', 'satisfying', 'satisfaction', 'satisfactory'],
    semanticNote:
      '由"做得足够"出发：做到对方满意的量是满足，做到让对方不再怀疑是使确信，做到符合标准就是"符合"。',
    synonyms: [
      { word: 'meet', distinction: 'meet 常与 needs、requirements、demand 搭配，最简洁。' },
      { word: 'content', distinction: 'content 指使满足、不再多求，多用于 be content with。' },
      { word: 'fulfil', distinction: 'fulfil 指实现承诺、发挥潜力、履行义务。' },
    ],
    level: 2,
  },

  secure: {
    lemma: 'secure',
    uk: '/sɪˈkjʊə(r)/',
    us: '/sɪˈkjʊr/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '安全的，稳固的（免受危险）',
        example: 'Keep your passport in a secure place.',
        exampleZh: '把护照放在安全的地方。',
      },
      {
        pos: 'v.',
        cn: '获得，争取到（来之不易）',
        example: 'The team secured a narrow victory.',
        exampleZh: '这支队以微弱优势取得了胜利。',
      },
      {
        pos: 'v.',
        cn: '使安全，加固（门、系统）',
        example: 'The door was secured with two locks.',
        exampleZh: '门上装了两把锁。',
      },
    ],
    collocations: [
      { phrase: 'secure a job', cn: '争取到工作' },
      { phrase: 'secure against', cn: '使免受' },
      { phrase: 'a secure future', cn: '有保障的未来' },
    ],
    family: ['secures', 'secured', 'securing', 'security', 'securely'],
    semanticNote:
      '由"无忧"出发：没有危险是安全的，把东西弄到没有风险的地步是加固，把机会牢牢拿到手、不再有变数就是"争取到"。',
    synonyms: [
      { word: 'safe', distinction: 'safe 最通用，指没有危险；secure 还含"有保障、牢固"之意。' },
      { word: 'obtain', distinction: 'obtain 中性，指取得；secure 强调经过努力、来之不易。' },
      { word: 'fasten', distinction: 'fasten 指物理上系紧、扣牢，不含"安全"评价。' },
    ],
    level: 3,
  },

  seek: {
    lemma: 'seek',
    uk: '/siːk/',
    us: '/siːk/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '寻找，寻求（帮助、机会、答案，正式）',
        example: 'She is seeking a new challenge.',
        exampleZh: '她在寻找新的挑战。',
      },
      {
        pos: 'v.',
        cn: '试图，设法（seek to do）',
        example: 'The study seeks to explain the gap.',
        exampleZh: '这项研究试图解释这一差距。',
      },
    ],
    collocations: [
      { phrase: 'seek help', cn: '寻求帮助' },
      { phrase: 'seek to do', cn: '试图做' },
      { phrase: 'seek advice', cn: '征求意见' },
    ],
    family: ['seeks', 'sought', 'seeking'],
    semanticNote:
      '由"追踪"出发：追着某物找是寻求，追着某个目标去做就是试图。过去式与过去分词均为 sought，属不规则动词。',
    synonyms: [
      { word: 'look for', distinction: 'look for 口语，最通用，不含正式语域。' },
      { word: 'pursue', distinction: 'pursue 强调持续努力地追求，多用于目标、事业。' },
      { word: 'search', distinction: 'search 强调彻底搜查，可接 for 或直接接地点。' },
    ],
    level: 2,
  },

  select: {
    lemma: 'select',
    uk: '/sɪˈlekt/',
    us: '/sɪˈlekt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '挑选，选择（按标准，较正式）',
        example: 'Participants were selected at random.',
        exampleZh: '参与者是随机抽取的。',
      },
      {
        pos: 'adj.',
        cn: '精选的，优等的（作定语）',
        example: 'The hotel has a select clientele.',
        exampleZh: '这家酒店接待的是精选客群。',
      },
    ],
    collocations: [
      { phrase: 'select from', cn: '从…中挑选' },
      { phrase: 'carefully selected', cn: '精心挑选的' },
      { phrase: 'a select committee', cn: '专门委员会' },
    ],
    family: ['selects', 'selected', 'selecting', 'selection', 'selective'],
    semanticNote:
      '由"挑出来"出发：按标准挑出来是挑选，被挑出来的自然就是"精选的"。',
    synonyms: [
      { word: 'choose', distinction: 'choose 最通用、最口语，不强调标准。' },
      { word: 'pick', distinction: 'pick 口语，指随意挑选，常接 out。' },
      { word: 'elect', distinction: 'elect 指投票选举产生，程序性强。' },
    ],
    level: 2,
  },

  separate: {
    lemma: 'separate',
    uk: '/ˈsepəreɪt/',
    us: '/ˈsepəreɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '分开，分离（把混在一起的分开）',
        example: 'The teacher separated the class into four groups.',
        exampleZh: '老师把全班分成四组。',
      },
      {
        pos: 'adj.',
        cn: '分开的，单独的（重音在前 /ˈsepərət/）',
        example: 'They sleep in separate rooms.',
        exampleZh: '他们分房睡。',
      },
      {
        pos: 'v.',
        cn: '区分，分辨（把概念分开）',
        example: 'It is hard to separate fact from opinion.',
        exampleZh: '很难把事实与观点分开。',
      },
    ],
    collocations: [
      { phrase: 'separate from', cn: '与…分开' },
      { phrase: 'separate A into B', cn: '把 A 分成 B' },
      { phrase: 'keep separate', cn: '分开保存' },
    ],
    family: ['separates', 'separated', 'separating', 'separation'],
    semanticNote:
      '由"准备分开"出发：把人和物分开是分离，把概念分开是区分。形容词重音在前，动词重音在后。',
    synonyms: [
      { word: 'divide', distinction: 'divide 强调分成几份，常接 into，也指"除法"。' },
      { word: 'split', distinction: 'split 口语，指劈开、分裂，可指人群意见分裂。' },
      { word: 'distinguish', distinction: 'distinguish 专指区分出差别，多接 between 或 from。' },
    ],
    level: 2,
  },

  serve: {
    lemma: 'serve',
    uk: '/sɜːv/',
    us: '/sɜːrv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '服务，为…工作',
        example: 'She has served the company for twenty years.',
        exampleZh: '她已为这家公司工作了二十年。',
      },
      {
        pos: 'v.',
        cn: '端上（饭菜），招待',
        example: 'Dinner is served at seven.',
        exampleZh: '晚饭七点开。',
      },
      {
        pos: 'v.',
        cn: '起…作用，充当（serve as）',
        example: 'The room serves as both office and bedroom.',
        exampleZh: '这个房间既是办公室又是卧室。',
      },
    ],
    collocations: [
      { phrase: 'serve as', cn: '充当' },
      { phrase: 'serve a purpose', cn: '有用处' },
      { phrase: 'first come, first served', cn: '先到先得' },
    ],
    family: ['serves', 'served', 'serving', 'service', 'servant'],
    semanticNote:
      '由"当仆人"出发：为人做事是服务，把菜端上桌是招待，某个东西充当某种角色就是"起…作用"。',
    synonyms: [
      { word: 'work for', distinction: 'work for 只表示"为…工作"，不含"服务"的正式语域。' },
      { word: 'provide', distinction: 'provide 指提供具体的东西或服务内容。' },
      { word: 'function as', distinction: 'function as 指"起…作用"，比 serve as 更书面。' },
    ],
    level: 1,
  },

  shift: {
    lemma: 'shift',
    uk: '/ʃɪft/',
    us: '/ʃɪft/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '转变（观念、政策、重点）',
        example: 'There has been a shift in public opinion.',
        exampleZh: '公众舆论出现了转变。',
      },
      {
        pos: 'v.',
        cn: '转移，移动（把重心、生产挪走）',
        example: 'The company shifted production overseas.',
        exampleZh: '公司把生产转移到了海外。',
      },
      {
        pos: 'n.',
        cn: '班次，轮班',
        example: 'She works the night shift.',
        exampleZh: '她上夜班。',
      },
    ],
    collocations: [
      { phrase: 'a shift in', cn: '在…方面的转变' },
      { phrase: 'shift attention to', cn: '把注意力转向' },
      { phrase: 'night shift', cn: '夜班' },
    ],
    family: ['shifts', 'shifted', 'shifting'],
    semanticNote:
      '由"移动位置"出发：位置移动是转移，方向移动是转变，人按时段换位置就是"轮班"。',
    synonyms: [
      { word: 'change', distinction: 'change 最通用，可指任何变化；shift 强调方向或重点的挪移。' },
      { word: 'move', distinction: 'move 多指具体位置的移动。' },
      { word: 'transfer', distinction: 'transfer 正式，多指人员、资金、权力的转移。' },
    ],
    level: 3,
  },

  solve: {
    lemma: 'solve',
    uk: '/sɒlv/',
    us: '/sɑːlv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '解决（问题、困难、危机）',
        example: 'The team solved the problem in a week.',
        exampleZh: '团队一周内解决了这个问题。',
      },
      {
        pos: 'v.',
        cn: '解答（谜题、方程、案件）',
        example: 'Can you solve this equation?',
        exampleZh: '你能解出这个方程吗？',
      },
    ],
    collocations: [
      { phrase: 'solve a problem', cn: '解决问题' },
      { phrase: 'solve a puzzle', cn: '解谜' },
      { phrase: 'solve the mystery', cn: '解开谜团' },
    ],
    family: ['solves', 'solved', 'solving', 'solution', 'solvable'],
    semanticNote:
      '由"解开"出发：把缠住的结解开是解决，把题目解开是解答。相比 resolve，solve 更常用于具体问题与技术性难题。',
    synonyms: [
      { word: 'resolve', distinction: 'resolve 更正式，多用于争端、矛盾，含"化解"。' },
      { word: 'settle', distinction: 'settle 强调双方达成一致，多用于争端。' },
      { word: 'work out', distinction: 'work out 口语，指想出办法、算出结果。' },
    ],
    level: 1,
  },

  specific: {
    lemma: 'specific',
    uk: '/spəˈsɪfɪk/',
    us: '/spəˈsɪfɪk/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '具体的，明确的（不笼统）',
        example: 'Can you give a specific example?',
        exampleZh: '你能举一个具体的例子吗？',
      },
      {
        pos: 'adj.',
        cn: '特定的，特有的（specific to）',
        example: 'The rules are specific to this region.',
        exampleZh: '这些规定只适用于这一地区。',
      },
    ],
    collocations: [
      { phrase: 'a specific example', cn: '具体例子' },
      { phrase: 'specific to', cn: '为…所特有' },
      { phrase: 'be specific about', cn: '明确说明' },
    ],
    family: ['specifically', 'specification', 'specify', 'specificity'],
    semanticNote:
      '由"指明种类"出发：把话说细、指明是哪一种就是具体；某种性质只属于某一类，就是"特有的"。',
    synonyms: [
      { word: 'particular', distinction: 'particular 强调"这一个"，specific 强调"说得细、不含糊"。' },
      { word: 'precise', distinction: 'precise 强调准确无误，多用于数据、描述。' },
      { word: 'definite', distinction: 'definite 强调确定、不含糊，多用于答案、计划。' },
    ],
    level: 2,
  },

  spread: {
    lemma: 'spread',
    uk: '/spred/',
    us: '/spred/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '传播，蔓延（消息、疾病、火）',
        example: 'The news spread quickly through the village.',
        exampleZh: '消息很快传遍了全村。',
      },
      {
        pos: 'v.',
        cn: '铺开，涂抹（在表面上）',
        example: 'She spread the map on the table.',
        exampleZh: '她把地图摊在桌上。',
      },
      {
        pos: 'n.',
        cn: '传播，普及（不可数）',
        example: 'The spread of online learning has changed higher education.',
        exampleZh: '在线学习的普及改变了高等教育。',
      },
    ],
    collocations: [
      { phrase: 'spread quickly', cn: '迅速传播' },
      { phrase: 'spread across', cn: '遍布' },
      { phrase: 'the spread of disease', cn: '疾病的传播' },
    ],
    family: ['spreads', 'spreading'],
    semanticNote:
      '由"铺开"出发：把东西铺开是摊开，把消息、疾病铺向更广的范围就是传播。过去式与原形同形，仍是 spread。',
    synonyms: [
      { word: 'circulate', distinction: 'circulate 多指信息、货币在人群中流通、传阅。' },
      { word: 'extend', distinction: 'extend 强调范围变长、变大，不含"扩散到人群"。' },
      { word: 'scatter', distinction: 'scatter 指撒开、散落，强调分散而非扩散。' },
    ],
    level: 2,
  },

  stable: {
    lemma: 'stable',
    uk: '/ˈsteɪbl/',
    us: '/ˈsteɪbl/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '稳定的，稳固的（不易改变）',
        example: 'The patient is now in a stable condition.',
        exampleZh: '病人目前情况稳定。',
      },
      {
        pos: 'adj.',
        cn: '稳重的，可靠的（人）',
        example: 'He is a stable, dependable colleague.',
        exampleZh: '他是个稳重可靠的同事。',
      },
      {
        pos: 'n.',
        cn: '马厩',
        example: 'The horses were led back to the stable.',
        exampleZh: '马被牵回了马厩。',
      },
    ],
    collocations: [
      { phrase: 'a stable condition', cn: '病情稳定' },
      { phrase: 'a stable economy', cn: '稳定的经济' },
      { phrase: 'remain stable', cn: '保持稳定' },
    ],
    family: ['stability', 'stabilize', 'unstable'],
    semanticNote:
      '由"站立的地方"出发：站得稳是稳定，人站得稳是稳重，马站的地方就是马厩。',
    synonyms: [
      { word: 'steady', distinction: 'steady 强调平稳、不间断，可指速度、增长、手。' },
      { word: 'secure', distinction: 'secure 强调免受威胁，含"有保障"。' },
      { word: 'firm', distinction: 'firm 多指物体坚固或态度坚决。' },
    ],
    level: 2,
  },

  strategy: {
    lemma: 'strategy',
    uk: '/ˈstrætədʒi/',
    us: '/ˈstrætədʒi/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '战略，策略（为达成目标的整体规划）',
        example: 'The company needs a new marketing strategy.',
        exampleZh: '公司需要一套新的营销策略。',
      },
      {
        pos: 'n.',
        cn: '策略性做法（具体场合的手段）',
        example: 'Reading the questions first is a useful strategy.',
        exampleZh: '先读题是个有用的策略。',
      },
    ],
    collocations: [
      { phrase: 'a marketing strategy', cn: '营销策略' },
      { phrase: 'develop a strategy', cn: '制定策略' },
      { phrase: 'a strategy for', cn: '应对…的策略' },
    ],
    family: ['strategies', 'strategic', 'strategist'],
    semanticNote:
      '由"将军之术"出发：整体层面的规划是战略，具体场合的手段是策略。可数，与不可数的 policy 用法不同。',
    synonyms: [
      { word: 'plan', distinction: 'plan 含具体步骤与时间表，比 strategy 更落地。' },
      { word: 'tactic', distinction: 'tactic 指短期、具体的战术手段，服务于 strategy。' },
      { word: 'approach', distinction: 'approach 指思路与取向，较抽象，不含"竞争"意味。' },
    ],
    level: 3,
  },

  stress: {
    lemma: 'stress',
    uk: '/stres/',
    us: '/stres/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '压力，紧张（心理或物理）',
        example: 'Many students suffer from stress before exams.',
        exampleZh: '很多学生在考前压力很大。',
      },
      {
        pos: 'v.',
        cn: '强调（某点的重要性）',
        example: 'The report stresses the need for training.',
        exampleZh: '报告强调培训的必要性。',
      },
      {
        pos: 'n.',
        cn: '重音，重读',
        example: 'Put the stress on the first syllable.',
        exampleZh: '重音放在第一个音节上。',
      },
    ],
    collocations: [
      { phrase: 'under stress', cn: '在压力下' },
      { phrase: 'stress the importance of', cn: '强调…的重要性' },
      { phrase: 'cope with stress', cn: '应对压力' },
    ],
    family: ['stresses', 'stressed', 'stressing', 'stressful'],
    semanticNote:
      '由"拉紧"出发：身体或心理被拉紧是压力，把某一点"拉紧"、加重是强调，把某个音节拉紧就是重音。',
    synonyms: [
      { word: 'pressure', distinction: 'pressure 多指外部施加的压力，也可指物理压强。' },
      { word: 'strain', distinction: 'strain 指绷到极限的紧张与负担，含"损伤"意味。' },
      { word: 'tension', distinction: 'tension 多指关系紧张或物理张力。' },
    ],
    level: 2,
  },

  strict: {
    lemma: 'strict',
    uk: '/strɪkt/',
    us: '/strɪkt/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '严格的（规则、管教）',
        example: 'The school has strict rules about phones.',
        exampleZh: '学校对手机有严格规定。',
      },
      {
        pos: 'adj.',
        cn: '严谨的，严格意义上的（不留弹性）',
        example: 'In the strict sense, the two are not the same.',
        exampleZh: '严格说来，这两者并不相同。',
      },
    ],
    collocations: [
      { phrase: 'strict rules', cn: '严格的规定' },
      { phrase: 'be strict with', cn: '对…严格' },
      { phrase: 'in the strict sense', cn: '严格意义上' },
    ],
    family: ['strictly', 'strictness'],
    semanticNote:
      '由"拉紧"出发：把规矩拉紧是严格，把定义拉紧、不留弹性就是"严格意义上的"。',
    synonyms: [
      { word: 'severe', distinction: 'severe 指严厉，多用于惩罚、天气、病情、问题。' },
      { word: 'rigid', distinction: 'rigid 含"僵硬、不知变通"的贬义。' },
      { word: 'rigorous', distinction: 'rigorous 指方法、检验严谨周密，褒义。' },
    ],
    level: 2,
  },

  succeed: {
    lemma: 'succeed',
    uk: '/səkˈsiːd/',
    us: '/səkˈsiːd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '成功（succeed in doing）',
        example: 'She succeeded in convincing the board.',
        exampleZh: '她成功说服了董事会。',
      },
      {
        pos: 'v.',
        cn: '继任，接替（succeed sb as）',
        example: 'He succeeded his father as chairman.',
        exampleZh: '他接替父亲出任董事长。',
      },
    ],
    collocations: [
      { phrase: 'succeed in doing', cn: '成功做成某事' },
      { phrase: 'succeed sb as', cn: '接替某人担任' },
      { phrase: 'succeed in life', cn: '人生有成' },
    ],
    family: ['succeeds', 'succeeded', 'succeeding', 'success', 'successful', 'succession', 'successor'],
    semanticNote:
      '由"跟在后面走"出发：跟着目标走到底就是成功；跟在某人后面接他的位置就是继任。两条义项共用一个"接续"的内核。',
    synonyms: [
      { word: 'manage', distinction: 'manage to do 口语，指设法做到，含"不容易"。' },
      { word: 'accomplish', distinction: 'accomplish 正式，指完成艰巨任务、目标。' },
      { word: 'inherit', distinction: 'inherit 指继承财产、职位，多因血缘或遗嘱。' },
    ],
    level: 2,
  },

  suffer: {
    lemma: 'suffer',
    uk: '/ˈsʌfə(r)/',
    us: '/ˈsʌfər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '遭受，蒙受（损失、灾害、疾病）',
        example: 'The region suffered severe flooding.',
        exampleZh: '该地区遭受了严重洪灾。',
      },
      {
        pos: 'v.',
        cn: '受苦，受折磨',
        example: 'He suffered in silence for years.',
        exampleZh: '他默默忍受了很多年。',
      },
      {
        pos: 'v.',
        cn: '变差，受损（业绩、质量、健康）',
        example: 'Sales suffered after the recall.',
        exampleZh: '召回之后销量受到了影响。',
      },
    ],
    collocations: [
      { phrase: 'suffer from', cn: '患有；受…之苦' },
      { phrase: 'suffer a loss', cn: '遭受损失' },
      { phrase: 'suffer in silence', cn: '默默忍受' },
    ],
    family: ['suffers', 'suffered', 'suffering', 'sufferer'],
    semanticNote:
      '由"在下面承受"出发：承受痛苦是遭受，长期承受是受苦，因为承受而变差就是"受损"。',
    synonyms: [
      { word: 'endure', distinction: 'endure 强调持久忍耐，含"咬牙撑住"。' },
      { word: 'undergo', distinction: 'undergo 中性，指经历变化、治疗，不必然痛苦。' },
      { word: 'sustain', distinction: 'sustain 在"受伤、损失"义上更正式，多用于书面。' },
    ],
    level: 2,
  },

  sufficient: {
    lemma: 'sufficient',
    uk: '/səˈfɪʃnt/',
    us: '/səˈfɪʃnt/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '足够的，充分的（正式，作定语或表语）',
        example: 'There is sufficient evidence to proceed.',
        exampleZh: '有足够的证据可以继续推进。',
      },
    ],
    collocations: [
      { phrase: 'sufficient evidence', cn: '充分的证据' },
      { phrase: 'sufficient to do', cn: '足以做' },
      { phrase: 'self-sufficient', cn: '自给自足的' },
    ],
    family: ['sufficiently', 'sufficiency', 'insufficient'],
    semanticNote:
      '与 enough 相比，sufficient 更正式，且不能放在名词后；与 adequate 相比，sufficient 只谈"量够"，adequate 还隐含"质量刚好达标"。',
    synonyms: [
      { word: 'enough', distinction: 'enough 最口语，可后置（time enough），sufficient 不能后置。' },
      { word: 'adequate', distinction: 'adequate 含"勉强够用、达标即可"之意，语气弱于 sufficient。' },
      { word: 'ample', distinction: 'ample 含"充足而有余"，语气最宽裕。' },
    ],
    level: 3,
  },

  supply: {
    lemma: 'supply',
    uk: '/səˈplaɪ/',
    us: '/səˈplaɪ/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '供应，供给（不可数）；供应量（可数）',
        example: 'The supply of clean water is at risk.',
        exampleZh: '清洁水的供应正面临风险。',
      },
      {
        pos: 'v.',
        cn: '供应，提供（大批量）',
        example: 'The farm supplies local restaurants.',
        exampleZh: '这个农场向当地餐馆供货。',
      },
      {
        pos: 'n.',
        cn: '补给品，用品（常用复数 supplies）',
        example: 'We packed medical supplies.',
        exampleZh: '我们带了医疗用品。',
      },
    ],
    collocations: [
      { phrase: 'supply and demand', cn: '供求' },
      { phrase: 'a steady supply of', cn: '稳定的…供应' },
      { phrase: 'office supplies', cn: '办公用品' },
    ],
    family: ['supplies', 'supplied', 'supplying', 'supplier'],
    semanticNote:
      '由"从下面填补"出发：把缺的东西填上就是供应；填进去的东西本身，就是"补给品"。',
    synonyms: [
      { word: 'provide', distinction: 'provide 范围更宽，可提供抽象之物；supply 多指货物、能源的批量供应。' },
      { word: 'deliver', distinction: 'deliver 强调送到目的地这一动作。' },
      { word: 'stock', distinction: 'stock 指储备存货，强调"备着"。' },
    ],
    level: 2,
  },

  survive: {
    lemma: 'survive',
    uk: '/səˈvaɪv/',
    us: '/sərˈvaɪv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '幸存，活下来（灾难、事故之后）',
        example: 'Only two passengers survived the crash.',
        exampleZh: '只有两名乘客在这次撞车中幸存。',
      },
      {
        pos: 'v.',
        cn: '继续存在，存续（习俗、物种）',
        example: 'The custom survives in remote villages.',
        exampleZh: '这一习俗在偏远村庄里延续下来。',
      },
      {
        pos: 'v.',
        cn: '挺过，熬过（危机、困难时期）',
        example: 'The company survived the recession.',
        exampleZh: '这家公司挺过了经济衰退。',
      },
    ],
    collocations: [
      { phrase: 'survive on', cn: '靠…维持生存' },
      { phrase: 'survive the crisis', cn: '挺过危机' },
      { phrase: 'the sole survivor', cn: '唯一的幸存者' },
    ],
    family: ['survives', 'survived', 'surviving', 'survival', 'survivor'],
    semanticNote:
      '由"活得超过"出发：活得比灾难久是幸存，活得比同类久是存续，企业活得比危机久就是挺过。注意 survive 作及物动词时后面不接 from。',
    synonyms: [
      { word: 'endure', distinction: 'endure 含忍耐意味，也可指事物长期存在。' },
      { word: 'outlive', distinction: 'outlive 指比…活得久，强调比较。' },
      { word: 'withstand', distinction: 'withstand 指经受住压力、考验，不涉及"存活"。' },
    ],
    level: 2,
  },

  suspect: {
    lemma: 'suspect',
    uk: '/səˈspekt/',
    us: '/səˈspekt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '怀疑，猜想（认为很可能如此）',
        example: 'I suspect he knew about it all along.',
        exampleZh: '我怀疑他一直都知道。',
      },
      {
        pos: 'v.',
        cn: '怀疑（某人有罪、有责）',
        example: 'They suspected him of taking the money.',
        exampleZh: '他们怀疑是他拿了钱。',
      },
      {
        pos: 'n.',
        cn: '嫌疑人（重音在前 /ˈsʌspekt/）',
        example: 'The police have arrested a suspect.',
        exampleZh: '警方逮捕了一名嫌疑人。',
      },
    ],
    collocations: [
      { phrase: 'suspect sb of', cn: '怀疑某人…' },
      { phrase: 'a murder suspect', cn: '谋杀案嫌疑人' },
      { phrase: 'the prime suspect', cn: '头号嫌疑人' },
    ],
    family: ['suspects', 'suspected', 'suspecting', 'suspicion', 'suspicious'],
    semanticNote:
      '由"从下面看"出发：在暗处观察、心里存疑就是怀疑。注意与 doubt 方向相反：suspect 是"倾向于认为有"，doubt 是"倾向于认为没有"。',
    synonyms: [
      { word: 'doubt', distinction: 'doubt 表示"怀疑某事不成立"，方向与 suspect 相反。' },
      { word: 'assume', distinction: 'assume 语气更确定，指"想当然地认为"。' },
      { word: 'distrust', distinction: 'distrust 指不信任，多用于人对人的态度。' },
    ],
    level: 3,
  },

  target: {
    lemma: 'target',
    uk: '/ˈtɑːɡɪt/',
    us: '/ˈtɑːrɡɪt/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '目标，指标（要达成的量）',
        example: 'The company missed its sales target.',
        exampleZh: '公司没有完成销售目标。',
      },
      {
        pos: 'v.',
        cn: '以…为目标，针对',
        example: 'The campaign targets young voters.',
        exampleZh: '这场活动针对年轻选民。',
      },
      {
        pos: 'n.',
        cn: '靶子，目标物',
        example: 'The arrow hit the centre of the target.',
        exampleZh: '箭射中了靶心。',
      },
    ],
    collocations: [
      { phrase: 'meet a target', cn: '达成目标' },
      { phrase: 'target audience', cn: '目标受众' },
      { phrase: 'be targeted at', cn: '针对' },
    ],
    family: ['targets', 'targeted', 'targeting'],
    semanticNote:
      '由"小圆盾"出发：射箭瞄准的盾是靶子，做事瞄准的对象是目标，把某人定为对象就是"针对"。',
    synonyms: [
      { word: 'goal', distinction: 'goal 多指努力方向与最终目的，主观性强。' },
      { word: 'aim', distinction: 'aim 指目的，也可指"瞄准"这一动作。' },
      { word: 'objective', distinction: 'objective 正式，多用于管理、项目，强调可衡量。' },
    ],
    level: 2,
  },

  tolerate: {
    lemma: 'tolerate',
    uk: '/ˈtɒləreɪt/',
    us: '/ˈtɑːləreɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '容忍，忍受（不赞成但不阻止）',
        example: 'The school will not tolerate bullying.',
        exampleZh: '学校不会容忍欺凌行为。',
      },
      {
        pos: 'v.',
        cn: '耐受（药物、环境、条件）',
        example: 'These plants tolerate shade well.',
        exampleZh: '这些植物很耐阴。',
      },
    ],
    collocations: [
      { phrase: 'tolerate behaviour', cn: '容忍某种行为' },
      { phrase: 'tolerate differences', cn: '包容差异' },
      { phrase: 'a tolerance for', cn: '对…的容忍度' },
    ],
    family: ['tolerates', 'tolerated', 'tolerating', 'tolerance', 'tolerant', 'tolerable'],
    semanticNote:
      '由"承担"出发：把不喜欢的东西承担下来是容忍；身体承担得住某种条件就是"耐受"。',
    synonyms: [
      { word: 'bear', distinction: 'bear 口语，多用于否定句 cannot bear，强调难以承受。' },
      { word: 'endure', distinction: 'endure 指长期忍受痛苦，含"熬"。' },
      { word: 'put up with', distinction: 'put up with 口语，指勉强容忍某人或某事。' },
    ],
    level: 3,
  },

  transfer: {
    lemma: 'transfer',
    uk: '/trænsˈfɜː(r)/',
    us: '/trænsˈfɜːr/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '转移，调动（人员、资金、权力）',
        example: 'He was transferred to the Leeds office.',
        exampleZh: '他被调到了利兹的办公室。',
      },
      {
        pos: 'v.',
        cn: '转账，转让',
        example: 'The money was transferred on Friday.',
        exampleZh: '这笔钱周五转了过去。',
      },
      {
        pos: 'n.',
        cn: '转移，移交（重音在前 /ˈtrænsfɜː(r)/）',
        example: 'The transfer of power was peaceful.',
        exampleZh: '权力交接是和平的。',
      },
    ],
    collocations: [
      { phrase: 'transfer to', cn: '转到' },
      { phrase: 'bank transfer', cn: '银行转账' },
      { phrase: 'technology transfer', cn: '技术转让' },
    ],
    family: ['transfers', 'transferred', 'transferring', 'transference'],
    semanticNote:
      '由"从这边搬到那边"出发：人搬过去是调动，钱搬过去是转账，权力搬过去就是移交。名动重音交替。',
    synonyms: [
      { word: 'move', distinction: 'move 最通用，可指任何移动，不强调"交接"。' },
      { word: 'shift', distinction: 'shift 多指方向、重点的转移。' },
      { word: 'relocate', distinction: 'relocate 多指公司、住所整体搬迁。' },
    ],
    level: 3,
  },

  treat: {
    lemma: 'treat',
    uk: '/triːt/',
    us: '/triːt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '对待，看待（treat sb/sth as）',
        example: 'The report treats the issue as a local problem.',
        exampleZh: '报告把这个问题当作地方性问题来处理。',
      },
      {
        pos: 'v.',
        cn: '治疗，医治',
        example: 'The wound was treated at the scene.',
        exampleZh: '伤口在现场就得到了处理。',
      },
      {
        pos: 'v.',
        cn: '款待，请客',
        example: 'Let me treat you to lunch.',
        exampleZh: '午饭我请你。',
      },
    ],
    collocations: [
      { phrase: 'treat sb as', cn: '把某人当作' },
      { phrase: 'treat a disease', cn: '治病' },
      { phrase: 'a real treat', cn: '难得的乐事' },
    ],
    family: ['treats', 'treated', 'treating', 'treatment'],
    semanticNote:
      '由"处理"出发：处理一个人是"对待"，处理伤口是"治疗"，处理一顿饭的钱（替你付）就是"款待"。名词 a treat 指"难得的乐事"。',
    synonyms: [
      { word: 'handle', distinction: 'handle 多指处理事务、局面，不含"对待某人"的态度义。' },
      { word: 'cure', distinction: 'cure 指治愈，强调结果；treat 只指施治过程。' },
      { word: 'regard', distinction: 'regard 表"看待"时必须接 as，语气更接近"评价"。' },
    ],
    level: 2,
  },

  trend: {
    lemma: 'trend',
    uk: '/trend/',
    us: '/trend/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '趋势，趋向（长期走向）',
        example: 'There is a growing trend towards remote work.',
        exampleZh: '远程办公的趋势在增强。',
      },
      {
        pos: 'n.',
        cn: '时尚，潮流',
        example: 'The film set a new trend in animation.',
        exampleZh: '这部电影在动画领域开创了新潮流。',
      },
    ],
    collocations: [
      { phrase: 'a growing trend', cn: '日益增长的趋势' },
      { phrase: 'set a trend', cn: '引领潮流' },
      { phrase: 'follow the trend', cn: '跟随潮流' },
    ],
    family: ['trends', 'trendy'],
    semanticNote:
      '由"转向"出发：数据长期往一个方向转是趋势，大众口味往一个方向转就是潮流。相比 tendency，trend 更强调"可观察的走向"。',
    synonyms: [
      { word: 'tendency', distinction: 'tendency 多指人或事物固有的倾向，较内在。' },
      { word: 'pattern', distinction: 'pattern 强调规律性、重复出现的模式。' },
      { word: 'fashion', distinction: 'fashion 多指短期流行，也可指"方式"。' },
    ],
    level: 2,
  },

  typical: {
    lemma: 'typical',
    uk: '/ˈtɪpɪkl/',
    us: '/ˈtɪpɪkl/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '典型的，有代表性的',
        example: 'This is a typical example of the genre.',
        exampleZh: '这是该类型的一个典型例子。',
      },
      {
        pos: 'adj.',
        cn: '一贯的，特有的（常含轻微抱怨）',
        example: 'It is typical of him to arrive late.',
        exampleZh: '迟到是他的一贯作风。',
      },
    ],
    collocations: [
      { phrase: 'a typical example', cn: '典型例子' },
      { phrase: 'be typical of', cn: '是…的典型' },
      { phrase: 'typically', cn: '通常；典型地' },
    ],
    family: ['typically', 'typicality'],
    semanticNote:
      '由"类型"出发：能代表整个类型的就是典型；某人的作风"很他"，就是"他一贯如此"，常带轻微抱怨。',
    synonyms: [
      { word: 'representative', distinction: 'representative 更正式，强调"足以代表整体"。' },
      { word: 'characteristic', distinction: 'characteristic 指特征鲜明，多修饰某个群体独有的表现。' },
      { word: 'usual', distinction: 'usual 只指习惯上如此，不含"代表性"。' },
    ],
    level: 2,
  },

  unique: {
    lemma: 'unique',
    uk: '/juˈniːk/',
    us: '/juˈniːk/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '独特的，独一无二的',
        example: 'Each fingerprint is unique.',
        exampleZh: '每个人的指纹都是独一无二的。',
      },
      {
        pos: 'adj.',
        cn: '特有的，仅…才有的（unique to）',
        example: 'This species is unique to the island.',
        exampleZh: '这个物种是该岛特有的。',
      },
    ],
    collocations: [
      { phrase: 'unique to', cn: '为…所独有' },
      { phrase: 'a unique opportunity', cn: '难得的机会' },
      { phrase: 'uniquely', cn: '独特地' },
    ],
    family: ['uniquely', 'uniqueness'],
    semanticNote:
      '由"唯一的"出发：只有一个，所以独一无二；只属于某一处，就是"特有的"。严格用法中不加 very，可说 absolutely unique。',
    synonyms: [
      { word: 'distinctive', distinction: 'distinctive 指有辨识度、特征明显，不强调"唯一"。' },
      { word: 'peculiar', distinction: 'peculiar 指"特有的"，也可指"奇怪的"，需靠语境。' },
      { word: 'singular', distinction: 'singular 正式，指独一无二的，也可指"非凡的"。' },
    ],
    level: 2,
  },

  urge: {
    lemma: 'urge',
    uk: '/ɜːdʒ/',
    us: '/ɜːrdʒ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '力劝，敦促（urge sb to do）',
        example: 'Officials urged residents to stay indoors.',
        exampleZh: '官员敦促居民留在室内。',
      },
      {
        pos: 'n.',
        cn: '强烈欲望，冲动',
        example: 'She felt a sudden urge to laugh.',
        exampleZh: '她突然很想笑。',
      },
    ],
    collocations: [
      { phrase: 'urge sb to do', cn: '敦促某人做' },
      { phrase: 'feel an urge to', cn: '有…的冲动' },
      { phrase: 'strongly urge', cn: '强烈敦促' },
    ],
    family: ['urges', 'urged', 'urging', 'urgent', 'urgency'],
    semanticNote:
      '由"推、催"出发：从外面推人去做是敦促，从里面推自己就是冲动。',
    synonyms: [
      { word: 'persuade', distinction: 'persuade 强调说服成功，urge 只表示强烈劝说，不保证结果。' },
      { word: 'encourage', distinction: 'encourage 语气温和，含"给以支持"。' },
      { word: 'press', distinction: 'press 指反复催促，含施压意味。' },
    ],
    level: 3,
  },

  value: {
    lemma: 'value',
    uk: '/ˈvæljuː/',
    us: '/ˈvæljuː/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '价值，重要性（不可数）',
        example: 'The value of regular exercise is well documented.',
        exampleZh: '经常锻炼的价值已有充分记载。',
      },
      {
        pos: 'n.',
        cn: '价值观（常用复数 values）',
        example: 'The two parties share similar values.',
        exampleZh: '两党有着相似的价值观。',
      },
      {
        pos: 'v.',
        cn: '重视，珍视',
        example: 'She values honesty above everything.',
        exampleZh: '她把诚实看得比什么都重。',
      },
    ],
    collocations: [
      { phrase: 'of value', cn: '有价值的' },
      { phrase: 'value for money', cn: '性价比' },
      { phrase: 'family values', cn: '家庭观念' },
    ],
    family: ['values', 'valued', 'valuing', 'valuable', 'valuation', 'invaluable'],
    semanticNote:
      '由"值多少"出发：东西值多少钱是价值，一件事值不值得重视也是价值，一个群体认为值得重视的东西就是价值观。',
    synonyms: [
      { word: 'worth', distinction: 'worth 多指内在价值，常作表语（be worth doing）。' },
      { word: 'appreciate', distinction: 'appreciate 指欣赏、重视，也可指"感激"与"升值"。' },
      { word: 'cherish', distinction: 'cherish 情感浓，指珍爱、珍惜回忆或人。' },
    ],
    level: 2,
  },

  witness: {
    lemma: 'witness',
    uk: '/ˈwɪtnəs/',
    us: '/ˈwɪtnəs/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '目击者，证人',
        example: 'Police are appealing for witnesses.',
        exampleZh: '警方正在寻找目击者。',
      },
      {
        pos: 'v.',
        cn: '目睹，亲眼看到',
        example: 'She witnessed the whole incident.',
        exampleZh: '她目睹了整个事件。',
      },
      {
        pos: 'v.',
        cn: '见证（某时期发生的事，主语为时间、地点）',
        example: 'The city has witnessed rapid change.',
        exampleZh: '这座城市见证了飞速的变化。',
      },
    ],
    collocations: [
      { phrase: 'witness an accident', cn: '目睹事故' },
      { phrase: 'a key witness', cn: '关键证人' },
      { phrase: 'bear witness to', cn: '为…作证；证明' },
    ],
    family: ['witnesses', 'witnessed', 'witnessing'],
    semanticNote:
      '由"知道、作证"出发：亲眼看到并可以作证的人是目击者；而一个时代"看到"了某事，就是"见证"——这是英文新闻里极常见的拟人用法。',
    synonyms: [
      { word: 'observe', distinction: 'observe 指观察，较冷静客观，不一定"在场"。' },
      { word: 'see', distinction: 'see 最通用，但书面语中"见证"义多用 witness。' },
      { word: 'testify', distinction: 'testify 指在法庭上作证，程序性强。' },
    ],
    level: 3,
  },

  abandon: {
    lemma: 'abandon',
    uk: '/əˈbændən/',
    us: '/əˈbændən/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '放弃（计划、尝试、努力）',
        example: 'They abandoned the project after two years.',
        exampleZh: '两年后他们放弃了这个项目。',
      },
      {
        pos: 'v.',
        cn: '遗弃，丢下（人、地方、车辆）',
        example: 'The car was abandoned by the roadside.',
        exampleZh: '那辆车被丢在了路边。',
      },
      {
        pos: 'n.',
        cn: '放纵，尽情（with abandon）',
        example: 'She danced with abandon.',
        exampleZh: '她纵情地跳着舞。',
      },
    ],
    collocations: [
      { phrase: 'abandon a plan', cn: '放弃计划' },
      { phrase: 'abandon ship', cn: '弃船' },
      { phrase: 'with abandon', cn: '纵情地' },
    ],
    family: ['abandons', 'abandoned', 'abandoning', 'abandonment'],
    semanticNote:
      '由"交出控制权"出发：把计划交出去不管了是放弃，把人或物丢下不管就是遗弃；把自己完全交出去、不加约束，就是 with abandon 的"纵情"。',
    synonyms: [
      { word: 'desert', distinction: 'desert 含"违背责任、弃之不顾"的贬义，多用于人。' },
      { word: 'give up', distinction: 'give up 口语，多指放弃尝试，不含"丢下不管"。' },
      { word: 'quit', distinction: 'quit 指停止、辞职，口语，多用于工作、习惯。' },
    ],
    level: 3,
  },

  access: {
    lemma: 'access',
    uk: '/ˈækses/',
    us: '/ˈækses/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '通道；使用权（have access to）',
        example: 'Students have free access to the library.',
        exampleZh: '学生可以免费使用图书馆。',
      },
      {
        pos: 'v.',
        cn: '访问，读取（数据、系统）',
        example: 'You can access your files from any device.',
        exampleZh: '你可以在任何设备上访问自己的文件。',
      },
    ],
    collocations: [
      { phrase: 'have access to', cn: '有权使用；能接触到' },
      { phrase: 'easy access', cn: '方便进入' },
      { phrase: 'access the internet', cn: '上网' },
    ],
    family: ['accesses', 'accessed', 'accessing', 'accessible', 'accessibility'],
    semanticNote:
      '由"走近"出发：能走近某个地方就是有通道，能走近某种资源就是有使用权；在数字时代，"走近"文件就是访问。',
    synonyms: [
      { word: 'entry', distinction: 'entry 多指物理入口或进入权，不涉及"使用权"。' },
      { word: 'approach', distinction: 'approach 指接近的动作或路径，较少用于抽象资源。' },
      { word: 'reach', distinction: 'reach 指能够触及的范围，如 within reach。' },
    ],
    level: 2,
  },

  account: {
    lemma: 'account',
    uk: '/əˈkaʊnt/',
    us: '/əˈkaʊnt/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '账户（银行、网站）',
        example: 'She opened a savings account at the local bank.',
        exampleZh: '她在当地银行开了一个储蓄账户。',
      },
      {
        pos: 'n.',
        cn: '叙述，描述',
        example: 'The book gives a vivid account of village life.',
        exampleZh: '这本书生动地记述了乡村生活。',
      },
      {
        pos: 'v.',
        cn: '解释；占（比例）（account for）',
        example: 'The delay accounts for the missing data.',
        exampleZh: '这次延误解释了数据缺失的原因。',
      },
    ],
    collocations: [
      { phrase: 'account for', cn: '解释；占（比例）' },
      { phrase: 'take into account', cn: '考虑到' },
      { phrase: 'on account of', cn: '由于' },
    ],
    family: ['accounts', 'accounted', 'accounting', 'accountant', 'accountable'],
    semanticNote:
      '由"算账"出发：钱的账是账户，事情的账是叙述；把账算清楚、说明原因就是"解释"；算出来占多少，就是"占…比例"。',
    synonyms: [
      { word: 'description', distinction: 'description 只是描述，不强调"有条理地交代"。' },
      { word: 'report', distinction: 'report 多指正式的报告，含调查与结论。' },
      { word: 'explanation', distinction: 'explanation 对应 account for 的"解释"义，最直接。' },
    ],
    level: 2,
  },

  acknowledge: {
    lemma: 'acknowledge',
    uk: '/əkˈnɒlɪdʒ/',
    us: '/əkˈnɑːlɪdʒ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '承认（事实、错误，常含不情愿）',
        example: 'He acknowledged that mistakes had been made.',
        exampleZh: '他承认确实出了差错。',
      },
      {
        pos: 'v.',
        cn: '确认收到（信件、申请）',
        example: 'Please acknowledge receipt of this letter.',
        exampleZh: '收到此信请复函确认。',
      },
      {
        pos: 'v.',
        cn: '感谢，致谢（在书、论文中）',
        example: 'The author acknowledges the help of colleagues.',
        exampleZh: '作者对同事的帮助表示感谢。',
      },
    ],
    collocations: [
      { phrase: 'acknowledge that…', cn: '承认…' },
      { phrase: 'widely acknowledged', cn: '公认的' },
      { phrase: 'acknowledge receipt', cn: '确认收到' },
    ],
    family: ['acknowledges', 'acknowledged', 'acknowledging', 'acknowledgement'],
    semanticNote:
      '由"知道并认下"出发：认下事实是承认，认下收到是确认，认下别人的帮助就是致谢。',
    synonyms: [
      { word: 'admit', distinction: 'admit 多指承认错误，带歉意，主语多为人。' },
      { word: 'recognize', distinction: 'recognize 承认时更偏"认可其存在或正当性"。' },
      { word: 'confess', distinction: 'confess 指坦白罪行或隐私，语气最重。' },
    ],
    level: 3,
  },

  adequate: {
    lemma: 'adequate',
    uk: '/ˈædɪkwət/',
    us: '/ˈædɪkwət/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '足够的（够用，但不算充裕）',
        example: 'The room has adequate light for reading.',
        exampleZh: '这个房间的光线看书够用。',
      },
      {
        pos: 'adj.',
        cn: '胜任的，合格的',
        example: 'He is adequate for the job, but no more.',
        exampleZh: '他干这份工作还算称职，仅此而已。',
      },
    ],
    collocations: [
      { phrase: 'adequate for', cn: '足以应付' },
      { phrase: 'adequate supply', cn: '充足的供应' },
      { phrase: 'barely adequate', cn: '勉强够用' },
    ],
    family: ['adequately', 'adequacy', 'inadequate'],
    semanticNote:
      '由"达到标准"出发：量达到标准是足够，能力达到标准是胜任。语气比 sufficient 弱，常暗示"刚够，不算好"。',
    synonyms: [
      { word: 'sufficient', distinction: 'sufficient 更正式，语气中性，只谈"量够"。' },
      { word: 'enough', distinction: 'enough 口语，可后置，最通用。' },
      { word: 'satisfactory', distinction: 'satisfactory 含"令人满意"的评价，不只谈数量。' },
    ],
    level: 3,
  },

  advocate: {
    lemma: 'advocate',
    uk: '/ˈædvəkeɪt/',
    us: '/ˈædvəkeɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '提倡，主张（公开支持某种做法）',
        example: 'Several economists advocate raising the retirement age.',
        exampleZh: '几位经济学家主张提高退休年龄。',
      },
      {
        pos: 'n.',
        cn: '拥护者，倡导者（读 /ˈædvəkət/）',
        example: 'She is a lifelong advocate of public libraries.',
        exampleZh: '她终身倡导公共图书馆。',
      },
    ],
    collocations: [
      { phrase: 'advocate doing sth', cn: '主张做某事' },
      { phrase: 'a strong advocate of', cn: '坚决拥护者' },
      { phrase: 'advocate for', cn: '为…发声' },
    ],
    family: ['advocates', 'advocated', 'advocating', 'advocacy'],
    semanticNote:
      '由"召唤到身边"出发：把某个主张召来替它说话就是提倡，替它说话的人就是拥护者。注意名动读音不同：动词词尾为 /-keɪt/。',
    synonyms: [
      { word: 'support', distinction: 'support 最通用，可指行动、资金支持，advocate 特指公开主张。' },
      { word: 'promote', distinction: 'promote 含推动落实的行动，advocate 多停留在主张层面。' },
      { word: 'champion', distinction: 'champion 指积极捍卫某项事业，语气更强。' },
    ],
    level: 4,
  },

  alter: {
    lemma: 'alter',
    uk: '/ˈɔːltə(r)/',
    us: '/ˈɔːltər/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '改变，改动（部分修改，本质不变）',
        example: 'The design was altered to save space.',
        exampleZh: '为了节省空间，设计做了改动。',
      },
      {
        pos: 'v.',
        cn: '改（衣服尺寸）',
        example: 'She had the dress altered.',
        exampleZh: '她让人把裙子改了改。',
      },
    ],
    collocations: [
      { phrase: 'alter a plan', cn: '改动计划' },
      { phrase: 'alter the course of', cn: '改变…的进程' },
      { phrase: 'have sth altered', cn: '让人改衣服' },
    ],
    family: ['alters', 'altered', 'altering', 'alteration'],
    semanticNote:
      '强调"部分改动、本质不变"，与 change 的全面改变、transform 的彻底改造构成一个程度梯度。',
    synonyms: [
      { word: 'change', distinction: 'change 最通用，程度可大可小，可指彻底改变。' },
      { word: 'modify', distinction: 'modify 多指修改设计、方案、措辞，目的性强。' },
      { word: 'transform', distinction: 'transform 指根本性、整体性的改造。' },
    ],
    level: 3,
  },

  alternative: {
    lemma: 'alternative',
    uk: '/ɔːlˈtɜːnətɪv/',
    us: '/ɔːlˈtɜːrnətɪv/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '替代方案，可选项',
        example: 'We have no alternative but to wait.',
        exampleZh: '我们除了等别无选择。',
      },
      {
        pos: 'adj.',
        cn: '可替代的，另类的（非主流的）',
        example: 'Alternative energy sources are becoming cheaper.',
        exampleZh: '替代能源正变得越来越便宜。',
      },
    ],
    collocations: [
      { phrase: 'have no alternative but to', cn: '别无选择只能' },
      { phrase: 'an alternative to', cn: '替代…的方案' },
      { phrase: 'alternative energy', cn: '替代能源' },
    ],
    family: ['alternatives', 'alternatively', 'alternate'],
    semanticNote:
      '由"两者轮流"出发：二选一里的另一个就是替代方案；不走主流路线的那一类，就是"另类的"。',
    synonyms: [
      { word: 'option', distinction: 'option 指可选的做法，中性，不强调"替代"。' },
      { word: 'choice', distinction: 'choice 指选择这一行为或可选范围，最通用。' },
      { word: 'substitute', distinction: 'substitute 多指具体替代物，如替代品、替补。' },
    ],
    level: 2,
  },

  anticipate: {
    lemma: 'anticipate',
    uk: '/ænˈtɪsɪpeɪt/',
    us: '/ænˈtɪsɪpeɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '预料，预期',
        example: 'We anticipate a rise in demand.',
        exampleZh: '我们预计需求会上升。',
      },
      {
        pos: 'v.',
        cn: '预先应对，抢先一步',
        example: 'The company anticipated the change in the law.',
        exampleZh: '公司提前应对了法律的变化。',
      },
    ],
    collocations: [
      { phrase: 'anticipate problems', cn: '预见问题' },
      { phrase: 'as anticipated', cn: '正如预料' },
      { phrase: 'anticipate demand', cn: '预判需求' },
    ],
    family: ['anticipates', 'anticipated', 'anticipating', 'anticipation'],
    semanticNote:
      '与 expect 的差别在于"提前行动"：expect 只是等着看，anticipate 往往含"因此先做准备"。',
    synonyms: [
      { word: 'expect', distinction: 'expect 只表示认为会发生，不含"预先准备"。' },
      { word: 'predict', distinction: 'predict 多依据数据或理论作出预测。' },
      { word: 'foresee', distinction: 'foresee 正式，指预见未来的情况。' },
    ],
    level: 3,
  },

  apparent: {
    lemma: 'apparent',
    uk: '/əˈpærənt/',
    us: '/əˈpærənt/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '明显的（一看就知道）',
        example: 'It became apparent that the plan would fail.',
        exampleZh: '很明显，这个计划会失败。',
      },
      {
        pos: 'adj.',
        cn: '表面上的，貌似的（未必真实）',
        example: 'His apparent calm hid real panic.',
        exampleZh: '他表面上的镇定掩盖了真实的慌乱。',
      },
    ],
    collocations: [
      { phrase: 'it is apparent that…', cn: '显然…' },
      { phrase: 'for no apparent reason', cn: '没有明显理由' },
      { phrase: 'apparent contradiction', cn: '表面矛盾' },
    ],
    family: ['apparently', 'appearance', 'appear'],
    semanticNote:
      '两条义项方向相反：一为"确实明显"，一为"只是看上去"。遇到 apparent + 褒义词时，多半是"貌似"，需靠语境判断。',
    synonyms: [
      { word: 'obvious', distinction: 'obvious 语气更强，指"躲都躲不开的明显"。' },
      { word: 'evident', distinction: 'evident 更正式，暗示有证据支撑。' },
      { word: 'seeming', distinction: 'seeming 只作定语，专表"表面上的"。' },
    ],
    level: 3,
  },

  apply: {
    lemma: 'apply',
    uk: '/əˈplaɪ/',
    us: '/əˈplaɪ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '申请（apply for）',
        example: 'She applied for a scholarship.',
        exampleZh: '她申请了奖学金。',
      },
      {
        pos: 'v.',
        cn: '适用（规则、条款）',
        example: 'The rule applies to all staff.',
        exampleZh: '这条规定适用于全体员工。',
      },
      {
        pos: 'v.',
        cn: '应用，运用；涂抹',
        example: 'Apply the cream twice a day.',
        exampleZh: '每天涂两次药膏。',
      },
    ],
    collocations: [
      { phrase: 'apply for', cn: '申请' },
      { phrase: 'apply to', cn: '适用于' },
      { phrase: 'apply for a job', cn: '求职' },
    ],
    family: ['applies', 'applied', 'applying', 'application', 'applicant', 'applicable'],
    semanticNote:
      '由"贴上去"出发：把规则贴到具体情形上是适用，把药膏贴到皮肤上是涂抹，把自己贴到某个岗位上去就是申请。',
    synonyms: [
      { word: 'use', distinction: 'use 最通用，不含"把理论落到具体"的意味。' },
      { word: 'employ', distinction: 'employ 正式，多指使用方法、手段、技术。' },
      { word: 'request', distinction: 'request 只是请求，不含"走申请程序"。' },
    ],
    level: 2,
  },

  appreciate: {
    lemma: 'appreciate',
    uk: '/əˈpriːʃieɪt/',
    us: '/əˈpriːʃieɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '欣赏，重视（看出价值）',
        example: 'I appreciate the effort you put in.',
        exampleZh: '我很看重你付出的努力。',
      },
      {
        pos: 'v.',
        cn: '感激',
        example: 'We appreciate your patience.',
        exampleZh: '感谢您的耐心。',
      },
      {
        pos: 'v.',
        cn: '理解，意识到（难处、严重性）',
        example: 'I appreciate that this is difficult.',
        exampleZh: '我明白这很难。',
      },
    ],
    collocations: [
      { phrase: 'appreciate your help', cn: '感谢你的帮助' },
      { phrase: 'greatly appreciate', cn: '非常感激' },
      { phrase: 'appreciate the difference', cn: '体会到差别' },
    ],
    family: ['appreciates', 'appreciated', 'appreciating', 'appreciation', 'appreciative'],
    semanticNote:
      '由"估价"出发：看出某物的价值是欣赏，看出别人付出的价值是感激，看出处境的难处就是理解。三条都是"看出价值"。',
    synonyms: [
      { word: 'value', distinction: 'value 指长期看重，不带"感激"的情绪。' },
      { word: 'cherish', distinction: 'cherish 情感浓，指珍爱某人、某段回忆。' },
      { word: 'recognize', distinction: 'recognize 只是"认识到"，不含欣赏或感激。' },
    ],
    level: 2,
  },

  appropriate: {
    lemma: 'appropriate',
    uk: '/əˈprəʊpriət/',
    us: '/əˈproʊpriət/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '合适的，恰当的（合乎场合）',
        example: 'Wear something appropriate for the occasion.',
        exampleZh: '穿得适合这个场合一点。',
      },
      {
        pos: 'v.',
        cn: '挪用，拨用（款项，正式）',
        example: 'The funds were appropriated for other purposes.',
        exampleZh: '这笔资金被挪作他用。',
      },
    ],
    collocations: [
      { phrase: 'appropriate for', cn: '适合' },
      { phrase: 'appropriate to', cn: '与…相称' },
      { phrase: 'take appropriate measures', cn: '采取适当措施' },
    ],
    family: ['appropriately', 'appropriateness', 'inappropriate', 'appropriation'],
    semanticNote:
      '由"使成为自己的"出发：把某物用在该用的地方就是合适，把不属于自己的东西据为己有就是挪用。形容词与动词读音不同。',
    synonyms: [
      { word: 'suitable', distinction: 'suitable 最通用，只谈"适合"，不含"得体"的社会含义。' },
      { word: 'proper', distinction: 'proper 含"合乎规矩、体统"之意。' },
      { word: 'fitting', distinction: 'fitting 较正式，指"与情境相称"。' },
    ],
    level: 3,
  },

  argue: {
    lemma: 'argue',
    uk: '/ˈɑːɡjuː/',
    us: '/ˈɑːrɡjuː/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '争论，争吵',
        example: 'They argued about money all evening.',
        exampleZh: '他们为钱争了一整晚。',
      },
      {
        pos: 'v.',
        cn: '主张，论证（提出理由支持某观点）',
        example: 'The author argues that testing harms learning.',
        exampleZh: '作者论证说考试损害学习。',
      },
    ],
    collocations: [
      { phrase: 'argue that…', cn: '主张…' },
      { phrase: 'argue with sb', cn: '与某人争论' },
      { phrase: 'argue for', cn: '主张支持' },
    ],
    family: ['argues', 'argued', 'arguing', 'argument', 'argumentative'],
    semanticNote:
      '由"把话说清楚"出发：双方各说各的、争起来是争吵；单方把理由摆出来、试图说服读者就是"论证"。学术文章里的 argue 几乎都指第二条。',
    synonyms: [
      { word: 'claim', distinction: 'claim 只是声称，不含给出理由的过程。' },
      { word: 'contend', distinction: 'contend 正式，指在争论中坚持某主张。' },
      { word: 'debate', distinction: 'debate 指双方对等的正式辩论。' },
    ],
    level: 2,
  },

  attach: {
    lemma: 'attach',
    uk: '/əˈtætʃ/',
    us: '/əˈtætʃ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '附上，贴上（文件、标签）',
        example: 'Please attach your CV to the email.',
        exampleZh: '请把简历附在邮件里。',
      },
      {
        pos: 'v.',
        cn: '使隶属，使依附',
        example: 'He is attached to the research unit.',
        exampleZh: '他隶属这个研究单位。',
      },
      {
        pos: 'v.',
        cn: '重视（attach importance to）',
        example: 'The school attaches great importance to reading.',
        exampleZh: '学校非常重视阅读。',
      },
    ],
    collocations: [
      { phrase: 'attach importance to', cn: '重视' },
      { phrase: 'attach to', cn: '附在…上' },
      { phrase: 'be attached to', cn: '依恋；隶属于' },
    ],
    family: ['attaches', 'attached', 'attaching', 'attachment'],
    semanticNote:
      '由"系上"出发：把文件系在邮件上是附上，把人系在某个单位是隶属，把重要性系在某事上就是重视。',
    synonyms: [
      { word: 'fasten', distinction: 'fasten 指物理上系紧、扣牢，动作具体。' },
      { word: 'connect', distinction: 'connect 指连接，可具体可抽象，不强调"附属"。' },
      { word: 'affix', distinction: 'affix 正式，指贴上、盖上（印章、标签）。' },
    ],
    level: 3,
  },

  attribute: {
    lemma: 'attribute',
    uk: '/əˈtrɪbjuːt/',
    us: '/əˈtrɪbjuːt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '把…归因于（attribute A to B）',
        example: 'She attributes her success to luck.',
        exampleZh: '她把自己的成功归因于运气。',
      },
      {
        pos: 'n.',
        cn: '属性，特质（读 /ˈætrɪbjuːt/）',
        example: 'Patience is a key attribute of a good teacher.',
        exampleZh: '耐心是好老师的一项关键特质。',
      },
    ],
    collocations: [
      { phrase: 'attribute A to B', cn: '把 A 归因于 B' },
      { phrase: 'a key attribute', cn: '关键特质' },
      { phrase: 'be attributed to', cn: '被归因于' },
    ],
    family: ['attributes', 'attributed', 'attributing', 'attribution'],
    semanticNote:
      '由"给予"出发：把某个结果"给"到某个原因头上就是归因；一个人身上"给"出来的特征就是属性。注意与 contribute 方向相反。',
    synonyms: [
      { word: 'credit', distinction: 'credit 指把功劳归于某人，含赞扬。' },
      { word: 'blame', distinction: 'blame 指把过错归于某人，负面。' },
      { word: 'ascribe', distinction: 'ascribe 极正式，多用于学术与法律文本。' },
    ],
    level: 4,
  },

  authority: {
    lemma: 'authority',
    uk: '/ɔːˈθɒrəti/',
    us: '/əˈθɔːrəti/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '权力，职权（不可数）',
        example: 'She has the authority to hire staff.',
        exampleZh: '她有权聘用员工。',
      },
      {
        pos: 'n.',
        cn: '当局，官方（常用复数 the authorities）',
        example: 'The authorities have closed the beach.',
        exampleZh: '当局已经关闭了海滩。',
      },
      {
        pos: 'n.',
        cn: '权威，专家（an authority on）',
        example: 'He is a leading authority on climate policy.',
        exampleZh: '他是气候政策方面的权威。',
      },
    ],
    collocations: [
      { phrase: 'have the authority to', cn: '有权做' },
      { phrase: 'the local authorities', cn: '地方当局' },
      { phrase: 'an authority on', cn: '在…方面的权威' },
    ],
    family: ['authorities', 'authoritative', 'authorize', 'authorization'],
    semanticNote:
      '由"发起者、作者"出发：能发起、能定调的人就有权力；行使权力的机构是当局；在某一领域说话算数的人就是权威。',
    synonyms: [
      { word: 'power', distinction: 'power 最通用，可指实际能力或支配力，不含"合法性"。' },
      { word: 'control', distinction: 'control 指控制权，强调"掌握在手中"。' },
      { word: 'expert', distinction: 'expert 对应"权威"义，但不含"有权力"的意思。' },
    ],
    level: 3,
  },

  available: {
    lemma: 'available',
    uk: '/əˈveɪləbl/',
    us: '/əˈveɪləbl/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '可获得的，可用的（物）',
        example: 'Tickets are available online.',
        exampleZh: '门票可在网上购买。',
      },
      {
        pos: 'adj.',
        cn: '有空的（人）',
        example: 'The manager is not available right now.',
        exampleZh: '经理现在没空。',
      },
    ],
    collocations: [
      { phrase: 'be available to', cn: '可供…使用' },
      { phrase: 'readily available', cn: '随手可得' },
      { phrase: 'available resources', cn: '可用资源' },
    ],
    family: ['availability', 'unavailable'],
    semanticNote:
      '由"能派上用场"出发：东西能派上用场是可获得，人能派上用场就是有空。作定语修饰名词时常后置（the seats available）。',
    synonyms: [
      { word: 'accessible', distinction: 'accessible 强调"能接近、能进入"，含物理可达性。' },
      { word: 'obtainable', distinction: 'obtainable 正式，只指"能取得"。' },
      { word: 'free', distinction: 'free 表"有空"时口语，也可指免费，易混。' },
    ],
    level: 2,
  },

  aware: {
    lemma: 'aware',
    uk: '/əˈweə(r)/',
    us: '/əˈwer/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '意识到的，知道的（be aware of）',
        example: 'She was not aware of the risk.',
        exampleZh: '她并不知道其中的风险。',
      },
      {
        pos: 'adj.',
        cn: '有…意识的（作构词成分）',
        example: 'Consumers are becoming more health-aware.',
        exampleZh: '消费者越来越有健康意识。',
      },
    ],
    collocations: [
      { phrase: 'be aware of', cn: '意识到' },
      { phrase: 'become aware that', cn: '意识到' },
      { phrase: 'environmentally aware', cn: '有环保意识的' },
    ],
    family: ['awareness', 'unaware'],
    semanticNote:
      '由"当心"出发：心里留意到某事就是意识到；把这种留意变成一种常态，就是"有…意识"。',
    synonyms: [
      { word: 'conscious', distinction: 'conscious 强调清醒、有知觉，也可指"刻意的"。' },
      { word: 'mindful', distinction: 'mindful 正式，指"留心、注意到"，常接 of。' },
      { word: 'informed', distinction: 'informed 指"知情的"，强调掌握信息。' },
    ],
    level: 2,
  },

  capacity: {
    lemma: 'capacity',
    uk: '/kəˈpæsəti/',
    us: '/kəˈpæsəti/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '容量，容纳量',
        example: 'The hall has a capacity of five hundred.',
        exampleZh: '这个大厅能容纳五百人。',
      },
      {
        pos: 'n.',
        cn: '能力，才能（做某事的能力）',
        example: 'She has a great capacity for hard work.',
        exampleZh: '她特别能吃苦。',
      },
      {
        pos: 'n.',
        cn: '身份，职位（in one\'s capacity as，正式）',
        example: 'He attended in his capacity as adviser.',
        exampleZh: '他以顾问身份出席。',
      },
    ],
    collocations: [
      { phrase: 'at full capacity', cn: '满负荷运转' },
      { phrase: 'capacity for', cn: '有…的能力' },
      { phrase: 'in one\'s capacity as', cn: '以…的身份' },
    ],
    family: ['capacities', 'capacious', 'incapacitate'],
    semanticNote:
      '由"能装多少"出发：容器能装多少是容量，人能装下多少工作就是能力，一个人"装着"某个职位就是身份。',
    synonyms: [
      { word: 'ability', distinction: 'ability 多指已具备的技能，可数；capacity 偏"潜力与容量"。' },
      { word: 'volume', distinction: 'volume 是物理量"体积、容量"，也可指"量"。' },
      { word: 'role', distinction: 'role 对应"身份"义，指所扮演的角色。' },
    ],
    level: 3,
  },

  commit: {
    lemma: 'commit',
    uk: '/kəˈmɪt/',
    us: '/kəˈmɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '承诺，致力于（commit to / be committed to）',
        example: 'The government has committed itself to cutting emissions.',
        exampleZh: '政府承诺削减排放。',
      },
      {
        pos: 'v.',
        cn: '犯（罪、错误）',
        example: 'He committed a serious error of judgement.',
        exampleZh: '他犯了严重的判断错误。',
      },
      {
        pos: 'v.',
        cn: '投入（时间、资源）',
        example: 'We committed two years to the project.',
        exampleZh: '我们在这个项目上投入了两年。',
      },
    ],
    collocations: [
      { phrase: 'commit to', cn: '致力于；承诺' },
      { phrase: 'commit a crime', cn: '犯罪' },
      { phrase: 'be committed to', cn: '致力于' },
    ],
    family: ['commits', 'committed', 'committing', 'commitment'],
    semanticNote:
      '由"交付"出发：把自己交付给某个目标是承诺，把资源交付出去是投入，把自己交付给坏事就是犯罪。',
    synonyms: [
      { word: 'devote', distinction: 'devote 指奉献时间精力，情感色彩更浓，固定接 to。' },
      { word: 'pledge', distinction: 'pledge 指郑重承诺，多用于公开场合、捐款。' },
      { word: 'perform', distinction: 'perform 不用于"犯罪"，commit 与 crime、error 是固定搭配。' },
    ],
    level: 3,
  },

  compensate: {
    lemma: 'compensate',
    uk: '/ˈkɒmpenseɪt/',
    us: '/ˈkɑːmpenseɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '补偿，赔偿（compensate sb for）',
        example: 'The airline compensated passengers for the delay.',
        exampleZh: '航空公司就延误向乘客作了赔偿。',
      },
      {
        pos: 'v.',
        cn: '弥补（compensate for 缺失）',
        example: 'Nothing can compensate for the loss of a friend.',
        exampleZh: '失去朋友是任何东西都弥补不了的。',
      },
    ],
    collocations: [
      { phrase: 'compensate for', cn: '弥补' },
      { phrase: 'compensate sb for', cn: '就…赔偿某人' },
      { phrase: 'compensation for', cn: '对…的补偿' },
    ],
    family: ['compensates', 'compensated', 'compensating', 'compensation', 'compensatory'],
    semanticNote:
      '由"一起称量"出发：用等量的东西去抵，就是补偿；抵得住缺失，就是弥补。',
    synonyms: [
      { word: 'make up for', distinction: 'make up for 口语，指弥补不足或过失。' },
      { word: 'offset', distinction: 'offset 指抵消成本、影响，多用于财务与环境。' },
      { word: 'reimburse', distinction: 'reimburse 指报销，把钱还给垫付的人。' },
    ],
    level: 4,
  },

  comprehensive: {
    lemma: 'comprehensive',
    uk: '/ˌkɒmprɪˈhensɪv/',
    us: '/ˌkɑːmprɪˈhensɪv/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '全面的，综合的（覆盖各方面）',
        example: 'The report offers a comprehensive review of the evidence.',
        exampleZh: '报告对证据作了全面回顾。',
      },
      {
        pos: 'adj.',
        cn: '（保险）综合的，保全险的',
        example: 'Comprehensive insurance covers most risks.',
        exampleZh: '综合险覆盖大部分风险。',
      },
    ],
    collocations: [
      { phrase: 'a comprehensive review', cn: '全面回顾' },
      { phrase: 'comprehensive insurance', cn: '综合险' },
      { phrase: 'a comprehensive school', cn: '综合中学（英式）' },
    ],
    family: ['comprehensively', 'comprehensiveness', 'comprehend', 'comprehensible'],
    semanticNote:
      '由"全部抓住"出发：把所有方面都抓住就是全面。注意与 comprehensible（可理解的）只差几个字母，极易混。',
    synonyms: [
      { word: 'thorough', distinction: 'thorough 强调细致彻底，重在"深度"。' },
      { word: 'complete', distinction: 'complete 强调"不缺任何部分"，重在"完整"。' },
      { word: 'extensive', distinction: 'extensive 强调覆盖范围广，重在"广度"。' },
    ],
    level: 3,
  },

  concentrate: {
    lemma: 'concentrate',
    uk: '/ˈkɒnsntreɪt/',
    us: '/ˈkɑːnsntreɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '集中注意力，专心（concentrate on）',
        example: 'It is hard to concentrate with the television on.',
        exampleZh: '开着电视很难专心。',
      },
      {
        pos: 'v.',
        cn: '使集中（把资源、人群聚到一处）',
        example: 'The industry is concentrated in the north.',
        exampleZh: '该产业集中在北方。',
      },
    ],
    collocations: [
      { phrase: 'concentrate on', cn: '专注于' },
      { phrase: 'concentrated effort', cn: '集中的努力' },
      { phrase: 'be concentrated in', cn: '集中在' },
    ],
    family: ['concentrates', 'concentrated', 'concentrating', 'concentration'],
    semanticNote:
      '由"聚到共同中心"出发：注意力聚到一点是专注，产业聚到一处是集中。',
    synonyms: [
      { word: 'focus', distinction: 'focus 与 concentrate 常可互换，focus 更常用于"重点、焦点"。' },
      { word: 'gather', distinction: 'gather 指把人或物聚在一起，不含"专心"。' },
      { word: 'cluster', distinction: 'cluster 指成簇聚集，多用于具体事物、数据点。' },
    ],
    level: 2,
  },

  concern: {
    lemma: 'concern',
    uk: '/kənˈsɜːn/',
    us: '/kənˈsɜːrn/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '担忧，关切（不可数）',
        example: 'There is growing concern about air quality.',
        exampleZh: '人们对空气质量的担忧在增加。',
      },
      {
        pos: 'v.',
        cn: '涉及，与…有关',
        example: 'The report concerns the northern region.',
        exampleZh: '这份报告涉及北部地区。',
      },
      {
        pos: 'n.',
        cn: '关心的事，重要的事',
        example: 'Her main concern was her family.',
        exampleZh: '她最牵挂的是家人。',
      },
    ],
    collocations: [
      { phrase: 'concern about', cn: '对…的担忧' },
      { phrase: 'as far as I am concerned', cn: '就我而言' },
      { phrase: 'be concerned with', cn: '与…有关' },
    ],
    family: ['concerns', 'concerned', 'concerning'],
    semanticNote:
      '由"关系到"出发：与自己有关就会在意，在意到不安就是担忧；"关于"某事的正式说法也是 concern。',
    synonyms: [
      { word: 'worry', distinction: 'worry 口语，多指个人的担心，可数。' },
      { word: 'anxiety', distinction: 'anxiety 指焦虑，偏心理与医学层面。' },
      { word: 'involve', distinction: 'involve 对应动词"涉及"义，但不含"关切"。' },
    ],
    level: 2,
  },

  conduct: {
    lemma: 'conduct',
    uk: '/kənˈdʌkt/',
    us: '/kənˈdʌkt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '进行，实施（调查、实验、访谈）',
        example: 'The team conducted a survey of two thousand households.',
        exampleZh: '团队对两千户人家做了调查。',
      },
      {
        pos: 'n.',
        cn: '行为，举止（读 /ˈkɒndʌkt/）',
        example: 'His conduct at the meeting was unacceptable.',
        exampleZh: '他在会上的举止令人无法接受。',
      },
      {
        pos: 'v.',
        cn: '指挥（乐队）；传导（热、电）',
        example: 'She conducted the orchestra for ten years.',
        exampleZh: '她指挥这个乐团十年。',
      },
    ],
    collocations: [
      { phrase: 'conduct research', cn: '开展研究' },
      { phrase: 'code of conduct', cn: '行为准则' },
      { phrase: 'conduct an experiment', cn: '做实验' },
    ],
    family: ['conducts', 'conducted', 'conducting', 'conduction', 'conductor'],
    semanticNote:
      '由"引导"出发：引导一项工作往前走是进行，引导自己的行为是举止，引导乐队是指挥，引导热与电就是传导。名动重音不同。',
    synonyms: [
      { word: 'carry out', distinction: 'carry out 口语，多指执行任务、实验、计划。' },
      { word: 'perform', distinction: 'perform 多指执行具体任务或手术，也可指表演。' },
      { word: 'behaviour', distinction: 'behaviour 对应名词"行为"义，英式拼写。' },
    ],
    level: 3,
  },

  consequence: {
    lemma: 'consequence',
    uk: '/ˈkɒnsɪkwəns/',
    us: '/ˈkɑːnsəkwens/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '后果，结果（常含负面）',
        example: 'The decision had serious consequences.',
        exampleZh: '这个决定带来了严重后果。',
      },
      {
        pos: 'n.',
        cn: '重要性（of consequence，正式）',
        example: 'It is a matter of little consequence.',
        exampleZh: '这是件无关紧要的事。',
      },
    ],
    collocations: [
      { phrase: 'as a consequence', cn: '因此' },
      { phrase: 'in consequence of', cn: '由于' },
      { phrase: 'serious consequences', cn: '严重后果' },
    ],
    family: ['consequences', 'consequent', 'consequently'],
    semanticNote:
      '由"随后而来"出发：跟着某事而来的就是结果，常带负面色彩；一件事"跟着"的分量有多大，就是重要性。',
    synonyms: [
      { word: 'result', distinction: 'result 中性，可好可坏，最通用。' },
      { word: 'outcome', distinction: 'outcome 中性，指经过过程后的最终局面。' },
      { word: 'effect', distinction: 'effect 多指某事物造成的影响、效果。' },
    ],
    level: 3,
  },

  considerable: {
    lemma: 'considerable',
    uk: '/kənˈsɪdərəbl/',
    us: '/kənˈsɪdərəbl/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '相当大的，可观的（数量、程度）',
        example: 'The project required a considerable amount of money.',
        exampleZh: '这个项目需要相当多的资金。',
      },
    ],
    collocations: [
      { phrase: 'a considerable amount', cn: '相当多的量' },
      { phrase: 'considerable influence', cn: '相当大的影响' },
      { phrase: 'considerable progress', cn: '长足进步' },
    ],
    family: ['considerably', 'consider'],
    semanticNote:
      '与 considerate（体贴的）极易混：considerable 修饰"量"，considerate 修饰"人"。它只谈数量或程度，不含"重要"的判断。',
    synonyms: [
      { word: 'substantial', distinction: 'substantial 含"份量足、实质性"之意，多修饰增长、证据。' },
      { word: 'significant', distinction: 'significant 还可指"重要"，considerable 不能。' },
      { word: 'sizeable', distinction: 'sizeable 口语些，只指"个头不小"。' },
    ],
    level: 3,
  },

  consist: {
    lemma: 'consist',
    uk: '/kənˈsɪst/',
    us: '/kənˈsɪst/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '由…组成（consist of）',
        example: 'The committee consists of nine members.',
        exampleZh: '委员会由九名成员组成。',
      },
      {
        pos: 'v.',
        cn: '在于（consist in，正式）',
        example: 'True happiness consists in contentment.',
        exampleZh: '真正的幸福在于知足。',
      },
    ],
    collocations: [
      { phrase: 'consist of', cn: '由…组成' },
      { phrase: 'consist in', cn: '在于' },
      { phrase: 'consist with', cn: '与…一致' },
    ],
    family: ['consists', 'consisted', 'consisting', 'consistency', 'consistent'],
    semanticNote:
      '由"站在一起"出发：几个部分站在一起构成整体就是"由…组成"；一个东西的本质"站"在某一点上就是"在于"。consist of 不用被动。',
    synonyms: [
      { word: 'comprise', distinction: 'comprise 正式，可及物：The committee comprises nine members。' },
      { word: 'be made up of', distinction: 'be made up of 口语，意思与 consist of 相同。' },
      { word: 'contain', distinction: 'contain 是"包含"，方向相反：整体含部分。' },
    ],
    level: 3,
  },

  constant: {
    lemma: 'constant',
    uk: '/ˈkɒnstənt/',
    us: '/ˈkɑːnstənt/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '不断的，接连发生的',
        example: 'The constant noise made it hard to sleep.',
        exampleZh: '持续的噪音让人难以入睡。',
      },
      {
        pos: 'adj.',
        cn: '恒定的，不变的',
        example: 'Keep the temperature constant.',
        exampleZh: '保持温度恒定。',
      },
    ],
    collocations: [
      { phrase: 'constant change', cn: '不断的变化' },
      { phrase: 'remain constant', cn: '保持不变' },
      { phrase: 'a constant stream of', cn: '源源不断的' },
    ],
    family: ['constantly', 'constancy', 'inconstant'],
    semanticNote:
      '由"站住不动"出发：数值站住不变是恒定，事情一件接一件不停就是"不断的"。两条义项一个讲"不变"，一个讲"不停"，都是"不间断"。',
    synonyms: [
      { word: 'continuous', distinction: 'continuous 指空间或时间上毫无间断，如 continuous line。' },
      { word: 'steady', distinction: 'steady 指平稳、有规律，不含"令人烦"的意味。' },
      { word: 'persistent', distinction: 'persistent 多指问题、症状持续不去。' },
    ],
    level: 3,
  },

  consume: {
    lemma: 'consume',
    uk: '/kənˈsjuːm/',
    us: '/kənˈsuːm/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '消耗（能源、时间、资源）',
        example: 'The building consumes very little energy.',
        exampleZh: '这栋楼能耗很低。',
      },
      {
        pos: 'v.',
        cn: '消费，吃，喝',
        example: 'We consume far more sugar than we did fifty years ago.',
        exampleZh: '我们摄入的糖比五十年前多得多。',
      },
      {
        pos: 'v.',
        cn: '吞噬（火、灾害，书面）',
        example: 'The fire consumed the whole building.',
        exampleZh: '大火吞噬了整栋楼。',
      },
    ],
    collocations: [
      { phrase: 'energy consumption', cn: '能源消耗' },
      { phrase: 'consume time', cn: '耗费时间' },
      { phrase: 'time-consuming', cn: '耗时的' },
    ],
    family: ['consumes', 'consumed', 'consuming', 'consumption', 'consumer'],
    semanticNote:
      '由"完全拿走"出发：把资源拿走用完是消耗，把食物拿走吃掉是消费，火把房子整个拿走就是吞噬。',
    synonyms: [
      { word: 'use up', distinction: 'use up 口语，指用完，强调"一点不剩"。' },
      { word: 'expend', distinction: 'expend 正式，多指耗费精力、资金、弹药。' },
      { word: 'devour', distinction: 'devour 指狼吞虎咽，语气强，也可指"如饥似渴地读"。' },
    ],
    level: 3,
  },

  context: {
    lemma: 'context',
    uk: '/ˈkɒntekst/',
    us: '/ˈkɑːntekst/',
    pos: 'n.',
    senses: [
      {
        pos: 'n.',
        cn: '上下文，语境',
        example: 'You can guess the meaning from the context.',
        exampleZh: '你可以从上下文猜出意思。',
      },
      {
        pos: 'n.',
        cn: '背景，环境（事件发生的整体情况）',
        example: 'The decision must be understood in its historical context.',
        exampleZh: '这个决定必须放在历史背景中理解。',
      },
    ],
    collocations: [
      { phrase: 'in the context of', cn: '在…背景下' },
      { phrase: 'out of context', cn: '断章取义' },
      { phrase: 'social context', cn: '社会背景' },
    ],
    family: ['contexts', 'contextual'],
    semanticNote:
      '由"编织在一起"出发：词与词编织在一起是上下文，事件与时代编织在一起就是背景。脱离 context 的判断往往失真，这是议论文常见论点。',
    synonyms: [
      { word: 'background', distinction: 'background 最通用，可指个人经历或事件背景。' },
      { word: 'setting', distinction: 'setting 多指故事、事件发生的具体场景。' },
      { word: 'circumstances', distinction: 'circumstances 指具体处境、条件，常用复数。' },
    ],
    level: 3,
  },

  cope: {
    lemma: 'cope',
    uk: '/kəʊp/',
    us: '/koʊp/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '应付，处理（cope with 困难、压力）',
        example: 'She is coping well with the workload.',
        exampleZh: '她应付这份工作量应付得不错。',
      },
      {
        pos: 'v.',
        cn: '勉强维持（cope on 有限的条件）',
        example: 'Some families cannot cope on one income.',
        exampleZh: '有些家庭靠一份收入撑不下去。',
      },
    ],
    collocations: [
      { phrase: 'cope with', cn: '应对' },
      { phrase: 'cope with stress', cn: '应对压力' },
      { phrase: 'cope on', cn: '靠…维持' },
    ],
    family: ['copes', 'coped', 'coping'],
    semanticNote:
      '由"交手"出发：与困难交手并撑住就是应付；撑住日常开销就是勉强维持。必须接 with，不能直接带宾语。',
    synonyms: [
      { word: 'manage', distinction: 'manage 可接 to do，强调"设法做成"；cope 只表示"撑得住"。' },
      { word: 'handle', distinction: 'handle 指处理具体问题，含"处理得了"的信心。' },
      { word: 'deal with', distinction: 'deal with 口语，范围更宽，可指处理人或事。' },
    ],
    level: 2,
  },

  crucial: {
    lemma: 'crucial',
    uk: '/ˈkruːʃl/',
    us: '/ˈkruːʃl/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '至关重要的（起决定作用）',
        example: 'Sleep plays a crucial role in memory.',
        exampleZh: '睡眠对记忆起着关键作用。',
      },
      {
        pos: 'adj.',
        cn: '关键的（时刻、决定）',
        example: 'It was a crucial moment in the campaign.',
        exampleZh: '那是这场竞选中的关键时刻。',
      },
    ],
    collocations: [
      { phrase: 'play a crucial role', cn: '起关键作用' },
      { phrase: 'crucial to', cn: '对…至关重要' },
      { phrase: 'a crucial moment', cn: '关键时刻' },
    ],
    family: ['crucially'],
    semanticNote:
      '由"十字路口"出发：走到岔路口、必须选一边，就是"决定性的"；这种时刻做的事自然"至关重要"。',
    synonyms: [
      { word: 'vital', distinction: 'vital 关乎存亡，程度最重。' },
      { word: 'essential', distinction: 'essential 指"必不可少"，偏静态的必需。' },
      { word: 'critical', distinction: 'critical 也可指"批评的"，需靠语境区分。' },
    ],
    level: 2,
  },

  cultivate: {
    lemma: 'cultivate',
    uk: '/ˈkʌltɪveɪt/',
    us: '/ˈkʌltɪveɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '耕作，栽培（土地、作物）',
        example: 'The land has been cultivated for centuries.',
        exampleZh: '这片土地已被耕作了几百年。',
      },
      {
        pos: 'v.',
        cn: '培养（习惯、能力、关系）',
        example: 'Schools should cultivate curiosity, not just obedience.',
        exampleZh: '学校应当培养好奇心，而不只是服从。',
      },
    ],
    collocations: [
      { phrase: 'cultivate a habit', cn: '培养习惯' },
      { phrase: 'cultivate land', cn: '耕地' },
      { phrase: 'cultivate relationships', cn: '经营关系' },
    ],
    family: ['cultivates', 'cultivated', 'cultivating', 'cultivation'],
    semanticNote:
      '由"耕作土地"出发：照料土地让它长出作物是栽培，照料自己或他人让它长出能力、关系就是培养。两者都需要时间与耐心。',
    synonyms: [
      { word: 'foster', distinction: 'foster 正式，多指培养观念、关系、发展。' },
      { word: 'nurture', distinction: 'nurture 含"呵护、养育"的温情，多用于儿童、才能。' },
      { word: 'grow', distinction: 'grow 多指具体种植，也可指自身成长。' },
    ],
    level: 3,
  },

  derive: {
    lemma: 'derive',
    uk: '/dɪˈraɪv/',
    us: '/dɪˈraɪv/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '源自，由…派生（derive from）',
        example: 'The word derives from an old French term.',
        exampleZh: '这个词源自一个古法语词。',
      },
      {
        pos: 'v.',
        cn: '从…中得到（derive pleasure from）',
        example: 'She derives great satisfaction from teaching.',
        exampleZh: '她从教学中获得极大的满足感。',
      },
    ],
    collocations: [
      { phrase: 'derive from', cn: '源自' },
      { phrase: 'derive pleasure from', cn: '从…中获得乐趣' },
      { phrase: 'be derived from', cn: '由…派生' },
    ],
    family: ['derives', 'derived', 'deriving', 'derivation', 'derivative'],
    semanticNote:
      '由"从河床引水"出发：水从源头引来是"源自"，从某事中引来好处就是"从中获得"。几乎总与 from 连用。',
    synonyms: [
      { word: 'obtain', distinction: 'obtain 只指"取得"，不含"来源"之意。' },
      { word: 'originate', distinction: 'originate 正式，只指"起源"，不能表示"获得"。' },
      { word: 'gain', distinction: 'gain 强调获得的增量或好处。' },
    ],
    level: 4,
  },

  despite: {
    lemma: 'despite',
    uk: '/dɪˈspaɪt/',
    us: '/dɪˈspaɪt/',
    pos: 'prep.',
    senses: [
      {
        pos: 'prep.',
        cn: '尽管，虽然（后接名词或动名词）',
        example: 'Despite the rain, the match went ahead.',
        exampleZh: '尽管下雨，比赛照常进行。',
      },
      {
        pos: 'prep.',
        cn: '不由自主地（despite oneself）',
        example: 'He smiled despite himself.',
        exampleZh: '他不由自主地笑了。',
      },
    ],
    collocations: [
      { phrase: 'despite the fact that', cn: '尽管' },
      { phrase: 'despite efforts', cn: '尽管作了努力' },
      { phrase: 'despite oneself', cn: '不由自主地' },
    ],
    family: ['spite', 'spiteful'],
    semanticNote:
      '由"轻视"出发：把阻碍看轻、照样去做，就是"尽管"。语法要点：despite 后接名词或 doing，接句子要用 although 或 despite the fact that。',
    synonyms: [
      { word: 'in spite of', distinction: 'in spite of 与 despite 同义，略口语，用法完全一致。' },
      { word: 'although', distinction: 'although 是连词，后面必须接完整句子。' },
      { word: 'notwithstanding', distinction: 'notwithstanding 极正式，多见于法律文本。' },
    ],
    level: 2,
  },

  distinguish: {
    lemma: 'distinguish',
    uk: '/dɪˈstɪŋɡwɪʃ/',
    us: '/dɪˈstɪŋɡwɪʃ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '区分，辨别（distinguish between / A from B）',
        example: 'Children learn to distinguish fact from fiction.',
        exampleZh: '孩子学会分辨事实与虚构。',
      },
      {
        pos: 'v.',
        cn: '使杰出，使有别于（be distinguished by）',
        example: 'What distinguishes this book is its honesty.',
        exampleZh: '这本书的与众不同之处在于它的诚实。',
      },
    ],
    collocations: [
      { phrase: 'distinguish between', cn: '区分' },
      { phrase: 'distinguish A from B', cn: '把 A 与 B 区分开' },
      { phrase: 'be distinguished by', cn: '以…著称' },
    ],
    family: ['distinguishes', 'distinguished', 'distinguishing', 'distinction', 'distinctive'],
    semanticNote:
      '由"分开、做出标记"出发：把两者分开是区分，把自己从众人中分开、显得突出就是"使杰出"。',
    synonyms: [
      { word: 'differentiate', distinction: 'differentiate 更正式，多接 between 或 from。' },
      { word: 'tell', distinction: 'tell 口语，固定搭配 tell A from B。' },
      { word: 'discriminate', distinction: 'discriminate 也可指"歧视"，需靠语境判断。' },
    ],
    level: 3,
  },

  domestic: {
    lemma: 'domestic',
    uk: '/dəˈmestɪk/',
    us: '/dəˈmestɪk/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '国内的（非国外的）',
        example: 'Domestic demand has fallen sharply.',
        exampleZh: '国内需求大幅下降。',
      },
      {
        pos: 'adj.',
        cn: '家庭的，家用的',
        example: 'Domestic work is still largely unpaid.',
        exampleZh: '家务劳动在很大程度上仍然是无偿的。',
      },
    ],
    collocations: [
      { phrase: 'domestic market', cn: '国内市场' },
      { phrase: 'domestic violence', cn: '家庭暴力' },
      { phrase: 'gross domestic product', cn: '国内生产总值' },
    ],
    family: ['domestically', 'domesticate'],
    semanticNote:
      '由"家里的"出发：家里的事是家务，一国之内的事就是"国内的"——把国家看成一个大家庭。',
    synonyms: [
      { word: 'internal', distinction: 'internal 指组织、机构内部，也可指体内。' },
      { word: 'household', distinction: 'household 只作定语，指"家用的、家庭的"。' },
      { word: 'home', distinction: 'home 表"本国的"时多用于 home market、home team。' },
    ],
    level: 3,
  },

  dominate: {
    lemma: 'dominate',
    uk: '/ˈdɒmɪneɪt/',
    us: '/ˈdɑːmɪneɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '支配，控制（占据主导地位）',
        example: 'A few firms dominate the market.',
        exampleZh: '少数几家公司主导着市场。',
      },
      {
        pos: 'v.',
        cn: '在…中占首要地位，最为显眼',
        example: 'The skyline is dominated by the tower.',
        exampleZh: '天际线以那座塔最为醒目。',
      },
    ],
    collocations: [
      { phrase: 'dominate the market', cn: '主导市场' },
      { phrase: 'be dominated by', cn: '由…主导' },
      { phrase: 'dominate the discussion', cn: '主导讨论' },
    ],
    family: ['dominates', 'dominated', 'dominating', 'domination', 'dominant', 'dominance'],
    semanticNote:
      '由"当主人"出发：当主人就是说了算，所以是支配；在画面或市场中占据最大份额，就是"占首要地位"。',
    synonyms: [
      { word: 'control', distinction: 'control 最通用，强调掌握、调控。' },
      { word: 'prevail', distinction: 'prevail 不及物，指"盛行、占优势"。' },
      { word: 'overshadow', distinction: 'overshadow 指使别的东西显得不重要，含"盖过"。' },
    ],
    level: 3,
  },

  eliminate: {
    lemma: 'eliminate',
    uk: '/ɪˈlɪmɪneɪt/',
    us: '/ɪˈlɪmɪneɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '消除，排除（问题、风险、可能）',
        example: 'The new rules aim to eliminate waste.',
        exampleZh: '新规定旨在杜绝浪费。',
      },
      {
        pos: 'v.',
        cn: '淘汰（比赛中）',
        example: 'The team was eliminated in the first round.',
        exampleZh: '这支队在第一轮就被淘汰了。',
      },
    ],
    collocations: [
      { phrase: 'eliminate the risk', cn: '消除风险' },
      { phrase: 'eliminate waste', cn: '杜绝浪费' },
      { phrase: 'be eliminated from', cn: '从…中被淘汰' },
    ],
    family: ['eliminates', 'eliminated', 'eliminating', 'elimination'],
    semanticNote:
      '由"赶出门外"出发：把问题赶出去是消除，把对手赶出赛场就是淘汰。',
    synonyms: [
      { word: 'remove', distinction: 'remove 语气较弱，只指"去掉"，不必然彻底。' },
      { word: 'eradicate', distinction: 'eradicate 语气最强，指彻底根除（疾病、贫困）。' },
      { word: 'rule out', distinction: 'rule out 专指排除某种可能性。' },
    ],
    level: 3,
  },

  employ: {
    lemma: 'employ',
    uk: '/ɪmˈplɔɪ/',
    us: '/ɪmˈplɔɪ/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '雇用',
        example: 'The factory employs three hundred people.',
        exampleZh: '这家工厂雇了三百人。',
      },
      {
        pos: 'v.',
        cn: '使用，采用（方法、手段，正式）',
        example: 'The study employs a mixed-method design.',
        exampleZh: '这项研究采用了混合方法设计。',
      },
    ],
    collocations: [
      { phrase: 'be employed in', cn: '受雇于；从事' },
      { phrase: 'employ a method', cn: '采用方法' },
      { phrase: 'fully employed', cn: '充分就业' },
    ],
    family: ['employs', 'employed', 'employing', 'employment', 'employer', 'employee'],
    semanticNote:
      '由"使用"出发：使用一个人的劳动是雇用，使用一种方法是采用。与 hire 相比，employ 更正式、更强调长期。',
    synonyms: [
      { word: 'hire', distinction: 'hire 多指短期雇用，美式常用，口语。' },
      { word: 'recruit', distinction: 'recruit 强调招募过程，多用于组织扩充人员。' },
      { word: 'use', distinction: 'use 最通用，employ 用于方法时更正式。' },
    ],
    level: 2,
  },

  endure: {
    lemma: 'endure',
    uk: '/ɪnˈdjʊə(r)/',
    us: '/ɪnˈdʊr/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '忍受，忍耐（痛苦、困难）',
        example: 'She endured months of treatment without complaint.',
        exampleZh: '她毫无怨言地忍受了几个月的治疗。',
      },
      {
        pos: 'v.',
        cn: '持续存在，长久不衰',
        example: 'The custom has endured for centuries.',
        exampleZh: '这一习俗延续了几个世纪。',
      },
    ],
    collocations: [
      { phrase: 'endure hardship', cn: '忍受艰苦' },
      { phrase: 'endure for centuries', cn: '延续数百年' },
      { phrase: 'enduring appeal', cn: '持久的吸引力' },
    ],
    family: ['endures', 'endured', 'enduring', 'endurance'],
    semanticNote:
      '由"变硬、撑住"出发：人撑住痛苦是忍受，事物撑住时间的磨损就是长久存在。',
    synonyms: [
      { word: 'bear', distinction: 'bear 口语，多用于否定句 cannot bear，强调难以承受。' },
      { word: 'tolerate', distinction: 'tolerate 含"不赞成但不阻止"的意味。' },
      { word: 'last', distinction: 'last 不及物，只指"持续"，不含忍耐。' },
    ],
    level: 4,
  },

  enormous: {
    lemma: 'enormous',
    uk: '/ɪˈnɔːməs/',
    us: '/ɪˈnɔːrməs/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '巨大的，庞大的（数量、规模）',
        example: 'The response to the appeal was enormous.',
        exampleZh: '这次呼吁得到的响应非常热烈。',
      },
      {
        pos: 'adj.',
        cn: '极大的（程度，修饰抽象名词）',
        example: 'She took enormous pleasure in the work.',
        exampleZh: '她从这项工作中得到极大的乐趣。',
      },
    ],
    collocations: [
      { phrase: 'an enormous amount of', cn: '大量的' },
      { phrase: 'enormous pressure', cn: '巨大压力' },
      { phrase: 'enormous potential', cn: '巨大潜力' },
    ],
    family: ['enormously', 'enormity'],
    semanticNote:
      '由"超出常规"出发：大到不合常规就是巨大。修饰抽象名词时表示程度极深，如 enormous pleasure、enormous pressure。',
    synonyms: [
      { word: 'huge', distinction: 'huge 口语，最常用，程度略轻。' },
      { word: 'vast', distinction: 'vast 多指面积、范围辽阔，如 vast area。' },
      { word: 'immense', distinction: 'immense 正式，指极大，多修饰抽象名词。' },
    ],
    level: 2,
  },

  estimate: {
    lemma: 'estimate',
    uk: '/ˈestɪmeɪt/',
    us: '/ˈestɪmeɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '估计，估算（数量、成本）',
        example: 'Experts estimate that the cost will double.',
        exampleZh: '专家估计成本会翻倍。',
      },
      {
        pos: 'n.',
        cn: '估计，估价（读 /ˈestɪmət/）',
        example: 'According to official estimates, unemployment has fallen.',
        exampleZh: '据官方估计，失业率已经下降。',
      },
    ],
    collocations: [
      { phrase: 'it is estimated that', cn: '据估计' },
      { phrase: 'a rough estimate', cn: '粗略估计' },
      { phrase: 'at a conservative estimate', cn: '保守估计' },
    ],
    family: ['estimates', 'estimated', 'estimating', 'estimation', 'overestimate', 'underestimate'],
    semanticNote:
      '由"定价"出发：给个大概的数字就是估计。它只谈数量，不含好坏判断，这点与 assess、evaluate 不同。',
    synonyms: [
      { word: 'assess', distinction: 'assess 含"依据标准评定"，不只是数字。' },
      { word: 'calculate', distinction: 'calculate 指精确计算，不含"大概"。' },
      { word: 'reckon', distinction: 'reckon 口语，可指"认为"，也可指估算。' },
    ],
    level: 2,
  },

  exceed: {
    lemma: 'exceed',
    uk: '/ɪkˈsiːd/',
    us: '/ɪkˈsiːd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '超过（数量、限度、规定）',
        example: 'Costs must not exceed the budget.',
        exampleZh: '成本不得超过预算。',
      },
      {
        pos: 'v.',
        cn: '超越（期望、权限）',
        example: 'The results exceeded all expectations.',
        exampleZh: '结果超出了所有人的预期。',
      },
    ],
    collocations: [
      { phrase: 'exceed expectations', cn: '超出预期' },
      { phrase: 'exceed the limit', cn: '超出限度' },
      { phrase: 'exceed the speed limit', cn: '超速' },
    ],
    family: ['exceeds', 'exceeded', 'exceeding', 'excess', 'excessive'],
    semanticNote:
      '由"走出去"出发：走出规定的线就是超过，走出预期的范围就是超越。',
    synonyms: [
      { word: 'surpass', distinction: 'surpass 多指超越成就、期望，褒义。' },
      { word: 'overtake', distinction: 'overtake 指赶上并超过，多用于竞争者、数量。' },
      { word: 'outstrip', distinction: 'outstrip 正式，指超过、胜过，多用于增长。' },
    ],
    level: 3,
  },

  exclude: {
    lemma: 'exclude',
    uk: '/ɪkˈskluːd/',
    us: '/ɪkˈskluːd/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '排除在外，不包括',
        example: 'The price excludes delivery.',
        exampleZh: '价格不含运费。',
      },
      {
        pos: 'v.',
        cn: '排除（某种可能性）',
        example: 'We cannot exclude the possibility of error.',
        exampleZh: '我们不能排除出错的可能。',
      },
    ],
    collocations: [
      { phrase: 'exclude from', cn: '把…排除在外' },
      { phrase: 'exclude the possibility', cn: '排除可能' },
      { phrase: 'social exclusion', cn: '社会排斥' },
    ],
    family: ['excludes', 'excluded', 'excluding', 'exclusion', 'exclusive'],
    semanticNote:
      '由"关在门外"出发：把人或项目关在门外是排除在外，把某种可能关在门外就是排除可能性。与 include 相对。',
    synonyms: [
      { word: 'rule out', distinction: 'rule out 专指排除可能性，与"不包括"义无关。' },
      { word: 'eliminate', distinction: 'eliminate 指消除，语气更强，含"彻底去掉"。' },
      { word: 'omit', distinction: 'omit 多指遗漏、省略，可出于疏忽。' },
    ],
    level: 3,
  },

  exhibit: {
    lemma: 'exhibit',
    uk: '/ɪɡˈzɪbɪt/',
    us: '/ɪɡˈzɪbɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '表现出，显出（特征、症状）',
        example: 'Some children exhibit signs of anxiety early.',
        exampleZh: '有些孩子很早就表现出焦虑的迹象。',
      },
      {
        pos: 'v.',
        cn: '展出，陈列',
        example: 'The museum exhibits local crafts.',
        exampleZh: '博物馆展出当地手工艺品。',
      },
      {
        pos: 'n.',
        cn: '展品',
        example: 'The exhibits are labelled in two languages.',
        exampleZh: '展品标有两种语言的说明。',
      },
    ],
    collocations: [
      { phrase: 'exhibit signs of', cn: '表现出…的迹象' },
      { phrase: 'exhibit at', cn: '在…展出' },
      { phrase: 'a museum exhibit', cn: '博物馆展品' },
    ],
    family: ['exhibits', 'exhibited', 'exhibiting', 'exhibition', 'exhibitor'],
    semanticNote:
      '由"拿出去"出发：把作品拿出去给人看是展出，把某种特征拿出去让人看见就是"表现出"。第二条在医学、心理学文献中极常见。',
    synonyms: [
      { word: 'display', distinction: 'display 最通用，可指展示物品或表现情绪。' },
      { word: 'show', distinction: 'show 最口语，范围最宽。' },
      { word: 'demonstrate', distinction: 'demonstrate 含"以证据说明"，逻辑性强。' },
    ],
    level: 3,
  },

  explicit: {
    lemma: 'explicit',
    uk: '/ɪkˈsplɪsɪt/',
    us: '/ɪkˈsplɪsɪt/',
    pos: 'adj.',
    senses: [
      {
        pos: 'adj.',
        cn: '明确的，清楚说明的',
        example: 'The instructions are explicit about what to do.',
        exampleZh: '说明书明确说明了该怎么做。',
      },
      {
        pos: 'adj.',
        cn: '直白的，不加掩饰的（内容）',
        example: 'The film contains explicit language.',
        exampleZh: '这部电影含有露骨的语言。',
      },
    ],
    collocations: [
      { phrase: 'explicit instructions', cn: '明确指示' },
      { phrase: 'make explicit', cn: '明确说明' },
      { phrase: 'explicit about', cn: '对…说得很清楚' },
    ],
    family: ['explicitly', 'explicitness', 'implicit'],
    semanticNote:
      '由"展开"出发：把意思完全摊开、不加遮掩就是明确。与 implicit（含蓄的、隐含的）相对，是阅读题里常考的一对。',
    synonyms: [
      { word: 'clear', distinction: 'clear 最通用，但不强调"已经说出来"。' },
      { word: 'definite', distinction: 'definite 强调确定、不含糊，多修饰答案、计划。' },
      { word: 'unambiguous', distinction: 'unambiguous 指不会产生歧义，语气更强。' },
    ],
    level: 4,
  },

  exploit: {
    lemma: 'exploit',
    uk: '/ɪkˈsplɔɪt/',
    us: '/ɪkˈsplɔɪt/',
    pos: 'v.',
    senses: [
      {
        pos: 'v.',
        cn: '利用，开发（资源、机会）',
        example: 'We should exploit the data we already have.',
        exampleZh: '我们应该利用手头已有的数据。',
      },
      {
        pos: 'v.',
        cn: '剥削，压榨（人）',
        example: 'Workers were exploited for years.',
        exampleZh: '工人们被剥削了很多年。',
      },
      {
        pos: 'n.',
        cn: '功绩，壮举（读 /ˈeksplɔɪt/，常用复数）',
        example: 'His exploits were legendary.',
        exampleZh: '他的事迹成了传奇。',
      },
    ],
    collocations: [
      { phrase: 'exploit resources', cn: '开发资源' },
      { phrase: 'exploit workers', cn: '剥削工人' },
      { phrase: 'exploit an opportunity', cn: '利用机会' },
    ],
    family: ['exploits', 'exploited', 'exploiting', 'exploitation', 'exploitative'],
    semanticNote:
      '由"展开、发挥"出发：把资源的作用发挥出来是利用，把人当作资源榨干就是剥削；被传颂的"发挥"出来的事就是功绩。名动重音不同。',
    synonyms: [
      { word: 'utilize', distinction: 'utilize 正式、中性，只指"加以利用"。' },
      { word: 'abuse', distinction: 'abuse 指滥用，含"不当使用"的负面评价。' },
      { word: 'take advantage of', distinction: 'take advantage of 口语，可中性也可含贬义。' },
    ],
    level: 4,
  },
};

/**
 * 固定搭配与短语动词。
 * 短语不标音标（连读重音随语境变化，标单一音标反而误导），
 * 因此统一省略 uk / us 字段。
 */
export const PHRASES: LexiconEntry[] = [
  {
    lemma: 'give rise to',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '引起，导致（多指某种现象或问题）',
        example: 'The new policy gave rise to a wave of complaints.',
        exampleZh: '新政策引发了大量投诉。',
        note: 'to 是介词，后面接名词或动名词，不能接句子。',
      },
    ],
    collocations: [
      { phrase: 'give rise to concern', cn: '引起担忧' },
      { phrase: 'give rise to speculation', cn: '引发猜测' },
    ],
    semanticNote:
      'rise 是"升起"，字面意思是"使某物升起来"，所以后面跟的多是被引发出来的现象，语气偏正式，且常带负面色彩。',
    synonyms: [
      { word: 'lead to', distinction: 'lead to 最通用，中性，口语书面皆可。' },
      { word: 'result in', distinction: 'result in 较正式，强调因果链条的结果端。' },
      { word: 'bring about', distinction: 'bring about 多指有意促成的变化，语气较积极。' },
    ],
    level: 4,
  },
  {
    lemma: 'stick with',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '坚持，继续采用（不改变）',
        example: 'I will stick with my original plan.',
        exampleZh: '我会坚持原来的计划。',
        note: '口语。宾语可以是决定、计划、方法，也可以是人（不离不弃）。',
      },
    ],
    collocations: [
      { phrase: 'stick with a decision', cn: '坚持某个决定' },
      { phrase: 'stick with it', cn: '坚持下去' },
    ],
    semanticNote:
      'stick 是"粘住"，所以核心意思是"不离开、不换掉"，与 give up（放弃）、switch（改换）相对。',
    synonyms: [
      { word: 'stick to', distinction: 'stick to 多指遵守规则、坚持原则或话题；stick with 多指不换方案、不弃同伴。' },
      { word: 'persist', distinction: 'persist 更正式，强调不怕阻力地持续。' },
    ],
    level: 3,
  },
  {
    lemma: 'take into account',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '把…考虑在内',
        example: 'The plan should take local conditions into account.',
        exampleZh: '这个方案应当把当地条件考虑进去。',
        note: '常用被动：be taken into account。代词作宾语时须放在中间：take it into account。',
      },
    ],
    collocations: [
      { phrase: 'take sth into account', cn: '把某事考虑在内' },
      { phrase: 'take account of', cn: '考虑到（同义，结构不同）' },
    ],
    semanticNote:
      'account 是"算账"，take into account 就是"把这一项算进账里"，所以它比 consider 更强调"在权衡时给它留出份额"。',
    synonyms: [
      { word: 'consider', distinction: 'consider 最通用，只表示"想到、权衡"，不含"计入总量"。' },
      { word: 'allow for', distinction: 'allow for 指"预留余地"，多用于时间、误差、变数。' },
    ],
    level: 3,
  },
  {
    lemma: 'come up with',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '想出，提出（主意、办法、借口）',
        example: 'She came up with a simple solution.',
        exampleZh: '她想出了一个简单的办法。',
        note: '宾语通常是 idea、plan、solution、excuse、answer，不能是人。',
      },
    ],
    collocations: [
      { phrase: 'come up with an idea', cn: '想出主意' },
      { phrase: 'come up with a solution', cn: '想出解决办法' },
    ],
    semanticNote:
      '由"追上来、凑到跟前"引申为"拿出来"，所以它强调"从无到有地拿出一个东西"，而非"想到某个已有事实"。',
    synonyms: [
      { word: 'think of', distinction: 'think of 只表示"想到"，不强调"拿出可行方案"。' },
      { word: 'propose', distinction: 'propose 正式，指正式提出方案供讨论。' },
    ],
    level: 2,
  },
  {
    lemma: 'rely on',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '依靠，依赖；信赖',
        example: 'Rural areas still rely on private cars.',
        exampleZh: '农村地区仍然依赖私家车。',
        note: 'on 是介词，后接名词或动名词；不用于进行时。',
      },
    ],
    collocations: [
      { phrase: 'rely heavily on', cn: '严重依赖' },
      { phrase: 'rely on sb to do', cn: '指望某人做' },
    ],
    semanticNote:
      'rely 本义是"把自身绑在…上"，所以既指物质上的依靠，也指信任意义上的指望。',
    synonyms: [
      { word: 'depend on', distinction: 'depend on 偏客观依赖，也可指"取决于"。' },
      { word: 'count on', distinction: 'count on 口语，指"指望"，带信心。' },
    ],
    level: 2,
  },
  {
    lemma: 'result in',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '导致，造成（后接结果）',
        example: 'The delay resulted in a missed connection.',
        exampleZh: '这次延误导致错过了转乘。',
        note: '方向必须分清：result in + 结果，result from + 原因。',
      },
    ],
    collocations: [
      { phrase: 'result in failure', cn: '导致失败' },
      { phrase: 'result in serious injury', cn: '造成重伤' },
    ],
    semanticNote:
      'in 表示"落进去"，所以 in 后面装的是最终落到的那个结果；from 表示"从…出来"，后面装的是源头。',
    synonyms: [
      { word: 'lead to', distinction: 'lead to 更口语，也可指道路"通向"。' },
      { word: 'cause', distinction: 'cause 直接带宾语，语气最直接。' },
    ],
    level: 2,
  },
  {
    lemma: 'lead to',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '导致，引起（某种结果）',
        example: 'Poor sleep can lead to serious health problems.',
        exampleZh: '睡眠不足会导致严重的健康问题。',
        note: 'to 是介词，后接名词或动名词。',
      },
      {
        pos: 'phr.',
        cn: '通向（某地）',
        example: 'This path leads to the beach.',
        exampleZh: '这条小路通向海滩。',
      },
    ],
    collocations: [
      { phrase: 'lead to a decline in', cn: '导致…下降' },
      { phrase: 'lead to the conclusion that', cn: '使人得出…的结论' },
    ],
    semanticNote:
      '本义是"引到某处"，所以既能指道路通向，也能指原因把结果"引"出来，两条义项共用同一路径隐喻。',
    synonyms: [
      { word: 'result in', distinction: 'result in 更正式，多用于书面与分析性文字。' },
      { word: 'give rise to', distinction: 'give rise to 更正式，多指引发某种现象，常带负面色彩。' },
    ],
    level: 2,
  },
  {
    lemma: 'in terms of',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '就…而言，在…方面',
        example: 'In terms of cost, the second option is better.',
        exampleZh: '就成本而言，第二个方案更好。',
        note: '后接名词或动名词，用于限定比较的维度。',
      },
    ],
    collocations: [
      { phrase: 'in terms of quality', cn: '在质量方面' },
      { phrase: 'in real terms', cn: '按实际价值计算' },
    ],
    semanticNote:
      'term 是"术语、条件"，in terms of 就是"用…这一套说法来衡量"，作用是把笼统的比较限定到一个具体维度上。',
    synonyms: [
      { word: 'as regards', distinction: 'as regards 更正式，只表示"关于"，不含"衡量维度"。' },
      { word: 'with respect to', distinction: 'with respect to 正式，指"关于"，多用于书面。' },
    ],
    level: 3,
  },
  {
    lemma: 'at the expense of',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '以…为代价（牺牲某物换来另一物）',
        example: 'The company grew at the expense of its staff.',
        exampleZh: '公司的发展是以牺牲员工为代价的。',
        note: '后接名词或动名词，常含批评意味。',
      },
    ],
    collocations: [
      { phrase: 'at the expense of quality', cn: '以质量为代价' },
      { phrase: 'at the expense of others', cn: '以他人为代价' },
    ],
    semanticNote:
      'expense 是"花费"，把某物当作花费付出去，就是牺牲它。这个短语几乎总在暗示"这笔交易不划算或不公平"。',
    synonyms: [
      { word: 'at the cost of', distinction: 'at the cost of 语气更直接，多指付出明确代价。' },
      { word: 'sacrifice', distinction: 'sacrifice 是动词或名词，需改变句式，不能直接替换。' },
    ],
    level: 4,
  },
  {
    lemma: 'carry out',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '执行，实施（任务、计划、调查、实验）',
        example: 'The team carried out a series of interviews.',
        exampleZh: '团队进行了一系列访谈。',
        note: '可分短语：代词宾语放中间，carry it out。',
      },
    ],
    collocations: [
      { phrase: 'carry out research', cn: '开展研究' },
      { phrase: 'carry out a survey', cn: '做调查' },
      { phrase: 'carry out orders', cn: '执行命令' },
    ],
    semanticNote:
      'carry 是"带着走"，out 是"到底"，合起来是"一路带到完成"，所以强调从头做到尾的落实。',
    synonyms: [
      { word: 'implement', distinction: 'implement 更正式，对象多为政策、方案、制度。' },
      { word: 'conduct', distinction: 'conduct 多与 research、survey、interview 搭配，较正式。' },
    ],
    level: 2,
  },
  {
    lemma: 'point out',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '指出，说明（常接 that 从句）',
        example: 'She pointed out that the data were incomplete.',
        exampleZh: '她指出数据并不完整。',
        note: '可分短语：point it out。语气比 argue 温和，只强调"提出来让对方注意"。',
      },
    ],
    collocations: [
      { phrase: 'point out a mistake', cn: '指出错误' },
      { phrase: 'as pointed out earlier', cn: '如前所述' },
    ],
    semanticNote:
      '由"用手指点"引申为"用话点出来"，所以它的宾语总是某个具体的点，而不是整套论证。',
    synonyms: [
      { word: 'note', distinction: 'note 更书面，指"注意到并提及"，语气更轻。' },
      { word: 'highlight', distinction: 'highlight 强调"使凸显"，力度强于 point out。' },
    ],
    level: 2,
  },
  {
    lemma: 'bring about',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '带来，促成（变化、结果）',
        example: 'The reform brought about a lasting change in attitudes.',
        exampleZh: '这场改革带来了观念的持久改变。',
        note: '可分短语：bring it about。宾语多为 change、improvement、reform 这类抽象名词。',
      },
    ],
    collocations: [
      { phrase: 'bring about change', cn: '带来改变' },
      { phrase: 'bring about a solution', cn: '促成解决办法' },
    ],
    semanticNote:
      'about 在这里是"周围、到位"，bring about 强调"一步步把事情带到发生"，比 cause 更有过程感。',
    synonyms: [
      { word: 'cause', distinction: 'cause 最直接，可指任何因果，不含"逐步促成"。' },
      { word: 'give rise to', distinction: 'give rise to 多指引发负面现象，较正式。' },
    ],
    level: 3,
  },
  {
    lemma: 'be subject to',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '受…支配，须服从（规定、批准）',
        example: 'All applications are subject to approval by the committee.',
        exampleZh: '所有申请都须经委员会批准。',
      },
      {
        pos: 'phr.',
        cn: '易受…影响，可能会…',
        example: 'Prices are subject to change without notice.',
        exampleZh: '价格如有变动，恕不另行通知。',
      },
    ],
    collocations: [
      { phrase: 'subject to change', cn: '可能变动' },
      { phrase: 'subject to approval', cn: '须经批准' },
      { phrase: 'subject to pressure', cn: '易受压力影响' },
    ],
    semanticNote:
      'subject 本义是"臣民、受支配者"，所以 be subject to 就是"处在…的管辖或影响之下"。法律、合同、规章里出现频率极高。',
    synonyms: [
      { word: 'be liable to', distinction: 'be liable to 多指"易于发生（不好的事）"，也可指法律责任。' },
      { word: 'be prone to', distinction: 'be prone to 指"有…的倾向"，多用于疾病、错误。' },
    ],
    level: 4,
  },
  {
    lemma: 'on the whole',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '总的来说，大体上',
        example: 'On the whole, the experiment was a success.',
        exampleZh: '总的来说，这次实验是成功的。',
        note: '作句子状语，通常置于句首，后加逗号。',
      },
    ],
    collocations: [
      { phrase: 'on the whole, yes', cn: '大体上是的' },
    ],
    semanticNote:
      'whole 是"整体"，所以这个短语的意思是"把整体看一遍再下结论"，暗示局部可能有例外。',
    synonyms: [
      { word: 'in general', distinction: 'in general 指"一般而言"，可指普遍规律，不限于某一次评价。' },
      { word: 'by and large', distinction: 'by and large 口语，语气更随意。' },
    ],
    level: 3,
  },
  {
    lemma: 'in contrast',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '相比之下（用于对比两种情况）',
        example: 'In contrast, the southern region saw steady growth.',
        exampleZh: '相比之下，南部地区则稳步增长。',
        note: '常与 to / with 连用：in contrast to the north。',
      },
    ],
    collocations: [
      { phrase: 'in contrast to', cn: '与…形成对比' },
      { phrase: 'by contrast', cn: '相比之下（更强调反差）' },
    ],
    semanticNote:
      'contrast 是"站在对面看"，所以这个短语后面接的必须是与前文形成反差的情况，不能用于并列补充。',
    synonyms: [
      { word: 'on the other hand', distinction: 'on the other hand 用于并列两种视角，不一定形成反差。' },
      { word: 'conversely', distinction: 'conversely 强调"反过来也成立"，逻辑更严格。' },
    ],
    level: 3,
  },
  {
    lemma: 'figure out',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '弄明白，想出（解决办法）',
        example: 'It took me an hour to figure out the instructions.',
        exampleZh: '我花了一个小时才弄明白这些说明。',
        note: '口语。可分短语：figure it out。',
      },
    ],
    collocations: [
      { phrase: 'figure out how to', cn: '弄明白怎么做' },
      { phrase: 'figure out the problem', cn: '想明白问题所在' },
    ],
    semanticNote:
      'figure 作动词有"计算"之意，figure out 就是"算出来、推出来"，所以强调通过思考把不清楚的事弄清楚。',
    synonyms: [
      { word: 'work out', distinction: 'work out 与 figure out 几乎同义，英式更常用。' },
      { word: 'understand', distinction: 'understand 只表示"理解"，不含"费劲推理"的过程。' },
    ],
    level: 2,
  },
  {
    lemma: 'look into',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '调查，了解（问题、投诉、案件）',
        example: 'The council is looking into the complaints.',
        exampleZh: '议会正在调查这些投诉。',
      },
    ],
    collocations: [
      { phrase: 'look into the matter', cn: '调查此事' },
      { phrase: 'look into the possibility', cn: '研究这种可能性' },
    ],
    semanticNote:
      '字面是"往里看"，所以强调"深入内部看清情况"，比 investigate 口语，但同样指有目的的查证。',
    synonyms: [
      { word: 'investigate', distinction: 'investigate 正式，多用于警方、官方调查。' },
      { word: 'examine', distinction: 'examine 指仔细检查，对象多为证据、细节。' },
    ],
    level: 2,
  },
  {
    lemma: 'put up with',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '容忍，忍受（不喜欢但无法摆脱）',
        example: 'I do not know how she puts up with the noise.',
        exampleZh: '我不知道她怎么受得了这种噪音。',
        note: '口语，宾语放在 up 与 with 之间或之后均可，但代词须放中间：put it up with。',
      },
    ],
    collocations: [
      { phrase: 'put up with noise', cn: '忍受噪音' },
      { phrase: 'put up with behaviour', cn: '容忍某种行为' },
    ],
    semanticNote:
      '字面是"撑起来承受"，暗示"勉强撑着"，所以语气里总带一点无奈或不情愿。',
    synonyms: [
      { word: 'tolerate', distinction: 'tolerate 更正式，语气中性，不含"无奈"。' },
      { word: 'endure', distinction: 'endure 强调长期忍耐痛苦，程度更重。' },
    ],
    level: 3,
  },
  {
    lemma: 'keep up with',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '跟上（进度、变化、他人）',
        example: 'It is hard to keep up with the pace of change.',
        exampleZh: '很难跟上变化的节奏。',
      },
      {
        pos: 'phr.',
        cn: '保持联系（keep up with sb）',
        example: 'We kept up with each other for years after college.',
        exampleZh: '大学毕业后我们保持了好几年联系。',
      },
    ],
    collocations: [
      { phrase: 'keep up with the pace', cn: '跟上节奏' },
      { phrase: 'keep up with technology', cn: '跟上技术发展' },
    ],
    semanticNote:
      'keep up 是"保持在同样的高度"，with 引出比较对象，所以核心是"不掉队"。与 keep up（坚持、维持）单独使用时意思不同。',
    synonyms: [
      { word: 'catch up with', distinction: 'catch up with 指"追上来"，含"原本落后"。' },
      { word: 'keep pace with', distinction: 'keep pace with 更书面，意思与 keep up with 基本相同。' },
    ],
    level: 2,
  },
  {
    lemma: 'make up for',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '弥补，补偿（损失、不足、过失）',
        example: 'Nothing can make up for the lost time.',
        exampleZh: '失去的时间是补不回来的。',
      },
    ],
    collocations: [
      { phrase: 'make up for lost time', cn: '弥补失去的时间' },
      { phrase: 'make up for a mistake', cn: '弥补过失' },
    ],
    semanticNote:
      'make up 有"补齐、凑足"之意，for 引出被补的对象，所以是"把缺的那块补上"。',
    synonyms: [
      { word: 'compensate for', distinction: 'compensate for 更正式，多用于赔偿、抵消。' },
      { word: 'offset', distinction: 'offset 指抵消影响或成本，财务、环境语境常见。' },
    ],
    level: 3,
  },
  {
    lemma: 'account for',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '解释，说明（原因）',
        example: 'How do you account for the sudden drop in sales?',
        exampleZh: '你如何解释销量突然下滑？',
      },
      {
        pos: 'phr.',
        cn: '占（一定比例）',
        example: 'Women account for nearly half the workforce.',
        exampleZh: '女性占了劳动力的近一半。',
      },
    ],
    collocations: [
      { phrase: 'account for 40% of', cn: '占…的 40%' },
      { phrase: 'account for the difference', cn: '解释这一差异' },
    ],
    semanticNote:
      '由"算账"出发：把账算清楚、交代每一笔的去向是"解释"；算出来占多少份额，就是"占…比例"。',
    synonyms: [
      { word: 'explain', distinction: 'explain 只指解释，不含"占比例"义。' },
      { word: 'represent', distinction: 'represent 表"占比例"时与 account for 相近。' },
    ],
    level: 3,
  },
  {
    lemma: 'come across',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '偶然遇到，碰见（人或物）',
        example: 'I came across an old photograph in the drawer.',
        exampleZh: '我在抽屉里偶然翻到一张旧照片。',
      },
      {
        pos: 'phr.',
        cn: '给人…的印象（come across as）',
        example: 'He comes across as shy, but he is not.',
        exampleZh: '他给人的印象是腼腆，其实并不是。',
      },
    ],
    collocations: [
      { phrase: 'come across as', cn: '给人…的印象' },
      { phrase: 'come across a problem', cn: '碰到问题' },
    ],
    semanticNote:
      '字面是"走过来碰上"，所以第一条义项强调"偶然"；而一个人的形象"走过来"落到别人眼里，就是第二条"给人的印象"。',
    synonyms: [
      { word: 'run into', distinction: 'run into 多指偶遇某人，也可指"陷入困难"。' },
      { word: 'encounter', distinction: 'encounter 更正式，多用于问题、阻力。' },
    ],
    level: 3,
  },
  {
    lemma: 'get rid of',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '摆脱，除掉（不想要的人或物）',
        example: 'It is hard to get rid of old habits.',
        exampleZh: '旧习惯很难改掉。',
      },
    ],
    collocations: [
      { phrase: 'get rid of waste', cn: '处理垃圾' },
      { phrase: 'get rid of a habit', cn: '改掉习惯' },
    ],
    semanticNote:
      'rid 是"使摆脱"，get rid of 就是"把包袱卸掉"，所以宾语总是不想要的东西，语气比 remove 更口语、更有情绪。',
    synonyms: [
      { word: 'dispose of', distinction: 'dispose of 正式，多指处理垃圾、资产。' },
      { word: 'eliminate', distinction: 'eliminate 强调彻底消除，语气更强。' },
    ],
    level: 2,
  },
  {
    lemma: 'look forward to',
    pos: 'phr.',
    senses: [
      {
        pos: 'phr.',
        cn: '期待，盼望',
        example: 'I look forward to hearing from you.',
        exampleZh: '期待您的回复。',
        note: 'to 是介词，后接名词或动名词，这是最高频的错误点。',
      },
    ],
    collocations: [
      { phrase: 'look forward to doing', cn: '期待做某事' },
      { phrase: 'look forward to your reply', cn: '期待您的回复' },
    ],
    semanticNote:
      'forward 是"向前"，look forward 是"朝前看"，to 引出看到的那件事，所以整体是"朝前望着某件事发生"。',
    synonyms: [
      { word: 'anticipate', distinction: 'anticipate 更正式，含"预先准备"之意。' },
      { word: 'expect', distinction: 'expect 只表示"预计会发生"，不含"盼望"的愉悦感。' },
    ],
    level: 2,
  },
];
