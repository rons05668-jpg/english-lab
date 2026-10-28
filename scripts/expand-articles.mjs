/** Original editorial content. Re-running replaces only the twelve IDs below. */
import { readFileSync, writeFileSync } from 'node:fs';

const packs = [];
const add = (level, title, titleZh, category, body, vocab, grammar, quiz) => packs.push({ level, title, titleZh, category, body, vocab, grammar, quiz });

add(1, 'A Library Card', '一张借书证', '生活', `
Mia moved to a new town in September.|米娅九月搬到了一个新城镇。
She knew nobody there, so her first weekend felt very quiet.|她在那里谁也不认识，因此第一个周末过得十分安静。
On Sunday, she noticed a small library near the bus stop.|周日，她发现公交车站旁有一家小图书馆。

Inside, a friendly worker helped her get a free library card.|进去后，一位友善的工作人员帮她办了一张免费的借书证。
Mia chose a book about local birds and sat by the window.|米娅选了一本介绍当地鸟类的书，在窗边坐下。
Another reader asked about the bird on the cover.|另一位读者问起封面上的鸟。

They talked for a few minutes and found that they lived on the same street.|她们聊了几分钟，发现彼此住在同一条街上。
Before leaving, Mia borrowed the book and checked the date of the next reading group.|离开前，米娅借走了这本书，并查看了下一次读书小组活动的日期。
The town still felt new, but it no longer felt quite so lonely.|这个城镇仍让她觉得陌生，但已不再那么孤独。
On the way home, she began looking forward to her next visit and another conversation.|回家途中，她开始期待下一次到访和下一次交谈。
`, 'library~n.~图书馆;card~n.~卡片;town~n.~城镇;quiet~adj.~安静的;notice~v.~注意到;small~adj.~小的;near~prep.~在附近;bus~n.~公共汽车;stop~n.~车站;friendly~adj.~友善的;worker~n.~工作人员;free~adj.~免费的;choose~v.~选择;local~adj.~当地的;bird~n.~鸟;window~n.~窗户;reader~n.~读者;cover~n.~封面;talk~v.~交谈;minute~n.~分钟;street~n.~街道;borrow~v.~借入;check~v.~查看;date~n.~日期;lonely~adj.~孤独的', [
  [3, 'a worker helped her', 'a friendly worker', 'helped', 'her', 'Inside 作地点状语；get a free library card 是省略 to 的不定式补语。', 'help somebody do something 表示帮助某人做某事。'],
  [6, 'They talked and found something', 'They', 'talked / found', 'that 引导的宾语从句', 'for a few minutes 表示持续时间；on the same street 表示地点。', 'and 连接两个动作，that 从句交代发现的内容。'],
], [
  ['主旨大意', 'What is the story mainly about?', 'A small step towards feeling at home|A difficult journey by bus|A plan to buy a house|A guide to keeping birds', 0, 8, '末句的孤独感减轻呼应图书馆里的交流，说明她开始融入新地方。', ['公交车站只是地点信息，并非旅程。','文中没有购房计划。','鸟是谈话契机，并非饲养指南。']],
  ['细节理解', 'What did Mia borrow?', 'A book about local birds|A map of the town|A newspaper|A book about buses', 0, 4, '她选择了介绍当地鸟类的书，离开时借走了它。', ['文中没有借地图。','文中没有提到报纸。','公交车只出现在车站背景里。']],
  ['逻辑推断', 'What may Mia do on another weekend?', 'Attend a reading group|Stop visiting the town|Buy the library|Move to the bus stop', 0, 7, '她主动查看下一次读书小组日期，说明可能参加，但文章并未保证她一定参加。', ['她开始建立联系，没有要离开的证据。','文章没有购买图书馆的情节。','车站是附近地标，不是居住目标。']],
]);

add(1, 'Dinner Without a Recipe', '没有食谱的晚餐', '生活', `
Ben wanted to cook dinner, but he could not find his recipe book.|本想做晚餐，却找不到食谱书。
He opened the fridge and saw two carrots, an egg, and some rice.|他打开冰箱，看见两根胡萝卜、一个鸡蛋和一些米饭。
His sister suggested making a simple bowl of fried rice.|妹妹建议做一碗简单的炒饭。

First, Ben washed the carrots and cut them into small pieces.|首先，本洗好胡萝卜，把它们切成小块。
His sister heated a little oil in a pan and added the egg.|妹妹在锅里热了少许油，然后加入鸡蛋。
They put in the vegetables and rice, then stirred everything together.|他们加入蔬菜和米饭，把所有食材翻炒均匀。

The meal was ready before their parents came home.|父母回家前，这顿饭就做好了。
It was not a special dish, but everyone enjoyed eating something the children had made.|这不是什么特别的菜，但大家都很喜欢吃孩子们做的饭。
Ben wrote down the steps so that he could cook it again next week.|本记下了步骤，以便下周再做一次。
He also added a reminder to check the fridge before making a shopping list.|他还提醒自己，在列购物清单之前先检查冰箱。
`, 'recipe~n.~食谱;dinner~n.~晚餐;find~v.~找到;open~v.~打开;fridge~n.~冰箱;carrot~n.~胡萝卜;egg~n.~鸡蛋;rice~n.~米饭;sister~n.~妹妹;suggest~v.~建议;simple~adj.~简单的;bowl~n.~碗;wash~v.~清洗;cut~v.~切;piece~n.~小块;heat~v.~加热;oil~n.~油;pan~n.~平底锅;add~v.~加入;vegetable~n.~蔬菜;stir~v.~翻炒;meal~n.~一餐;ready~adj.~准备好的;dish~n.~菜肴;step~n.~步骤', [
  [2, 'His sister suggested making fried rice', 'His sister', 'suggested', 'making a simple bowl of fried rice', 'making 是动名词，作 suggested 的宾语。', 'suggest doing something 表示建议做某事，不能直接接 to do。'],
  [8, 'Ben wrote down the steps', 'Ben', 'wrote down', 'the steps', 'so that 引导目的状语从句；next week 为时间状语。', '记步骤是手段，能够再次做饭是目的。'],
], [
  ['主旨大意', 'What does Ben learn from cooking dinner?', 'He can make a meal with what is available|Every meal needs an expensive recipe|Cooking alone is always better|Vegetables cannot go with rice', 0, 1, '现有的胡萝卜、鸡蛋和米饭足以做出一家人喜欢的晚餐。', ['他找不到食谱仍做成了饭。','晚餐是本和妹妹合作完成的。','他们正是把蔬菜与米饭一起炒。']],
  ['细节理解', 'What did Ben do first with the carrots?', 'He washed them|He heated them in oil|He put them in the fridge|He wrote their names', 0, 3, 'First 后明确写了先洗胡萝卜，再切块。', ['热油是妹妹后续做的步骤。','胡萝卜原本就在冰箱中。','他记录的是烹饪步骤。']],
  ['逻辑推断', 'Why did Ben write down the steps?', 'To help himself repeat the meal|To ask his parents to buy a recipe book|To stop his sister from cooking|To count how many carrots were left', 0, 8, 'so that 从句说明记步骤是为了下周再做。', ['文中没有让父母买书的安排。','他与妹妹合作，没有阻止她。','记录步骤与清点剩余胡萝卜无关。']],
]);

add(1, 'The Long Way to School', '绕一点路去学校', '健康与运动', `
Every morning, Leo took the shortest road to school.|每天早晨，利奥都走最短的那条路去学校。
The road was busy, and he often waited a long time to cross it.|那条路很繁忙，他常常要等很久才能过马路。
One day, a classmate showed him another route beside the river.|一天，一位同学带他看了河边的另一条路线。

The river path was longer, but it had no cars and plenty of trees.|河边的小路更长，但没有汽车，而且树木很多。
Leo could hear birds instead of engines as he walked.|利奥走路时听到的是鸟鸣，而非发动机的声音。
He arrived five minutes later than usual, yet he felt calm and ready for class.|他比平时晚到了五分钟，但心情平静，也准备好上课了。

Now he leaves home a little earlier when the weather is fine.|如今天气好时，他就稍微早一点出门。
On rainy days, he still takes the short road because the river path gets muddy.|下雨天他仍走近路，因为河边的小路会变得泥泞。
For Leo, the best route depends on more than distance alone.|对利奥来说，最佳路线取决于距离之外的因素。
He now pays attention to how a journey feels, as well as how long it takes.|现在他既留意行程花多长时间，也留意旅途带给自己的感受。
`, 'road~n.~道路;short~adj.~短的;busy~adj.~繁忙的;wait~v.~等待;cross~v.~穿过;classmate~n.~同学;show~v.~展示;route~n.~路线;river~n.~河流;path~n.~小路;long~adj.~长的;car~n.~汽车;tree~n.~树;hear~v.~听见;bird~n.~鸟;engine~n.~发动机;walk~v.~步行;arrive~v.~到达;usual~adj.~通常的;calm~adj.~平静的;ready~adj.~准备好的;weather~n.~天气;rainy~adj.~下雨的;muddy~adj.~泥泞的;distance~n.~距离', [
  [4, 'Leo could hear birds', 'Leo', 'could hear', 'birds', 'instead of engines 表示替代对象；as 引导时间状语从句。', '主句描述听到的声音，as 从句交代同时发生的动作。'],
  [7, 'he still takes the short road', 'he', 'takes', 'the short road', 'On rainy days 是时间状语；because 引导原因状语从句。', '走近路是结果，河边泥泞是原因。'],
], [
  ['主旨大意', 'What is the main idea of the story?', 'A good route involves more than its length|The shortest road is always dangerous|Everyone should walk beside a river|Rain is good for walking', 0, 8, '末句概括距离不是衡量路线的唯一因素。', ['文章没有说所有近路都危险。','路线取决于个人和天气条件。','雨天泥泞恰恰使河边路线不合适。']],
  ['细节理解', 'How much later did Leo arrive by the river path?', 'Five minutes|Ten minutes|Half an hour|One hour', 0, 5, '正文明确写到 five minutes later。', ['十分钟并非文中给出的差值。','半小时远超文章描述。','文章没有一小时的行程变化。']],
  ['逻辑推断', 'Why does Leo keep using two different routes?', 'Each route suits different conditions|He keeps forgetting the river path|His classmate chooses for him every day|His school changes its location', 0, 7, '晴天走河边，雨天走近路，说明他会根据条件选择。', ['他清楚两条路线的特点。','同学只是在一天介绍了路线。','学校位置没有发生变化。']],
]);

add(2, 'A Better Way to Practise', '更有效的练习方式', '教育', `
When Nina began learning English, she copied a list of twenty words every evening.|妮娜开始学英语时，每晚抄写一张包含二十个单词的词表。
The pages looked neat, but she often forgot the words when she needed them in conversation.|笔记看起来很整齐，但她在对话中需要用这些词时常常想不起来。
She decided to change the way she practised rather than simply spend more time at her desk.|她决定改变练习方式，而不是一味延长坐在书桌前的时间。

First, she chose five useful words from a short article that she could mostly understand.|首先，她从一篇基本能读懂的短文中挑出五个实用词。
For each word, she wrote a sentence about her own day and read it aloud.|她用每个词写一句与自己当天生活有关的话，并大声读出来。
The next morning, she covered the notes and tried to remember the sentences before checking them.|第二天早上，她盖住笔记，先尝试回忆这些句子，再核对。

Some words were still difficult, so she reviewed them again after a few days.|有些词仍然很难，她便过几天再次复习。
She also kept reading, which gave familiar words new situations and made their meanings clearer.|她也坚持阅读，让熟悉的词出现在新情境中，使词义更加清晰。
Her progress was gradual, but now her notebook supported real use instead of becoming a collection of copied pages.|她的进步是逐渐发生的，但现在笔记本帮助她实际运用语言，而不再只是一叠抄写页。
When a word returned in another article, she could connect the two examples and notice a difference.|当一个词在另一篇文章中再次出现时，她能联系两条例句，留意其中的差别。
`, 'practise~v.~练习;copy~v.~抄写;list~n.~列表;neat~adj.~整洁的;forget~v.~忘记;conversation~n.~对话;decide~v.~决定;change~v.~改变;simply~adv.~仅仅;useful~adj.~实用的;article~n.~文章;mostly~adv.~大部分地;understand~v.~理解;sentence~n.~句子;aloud~adv.~出声地;cover~v.~盖住;note~n.~笔记;remember~v.~记住;check~v.~核对;difficult~adj.~困难的;review~v.~复习;familiar~adj.~熟悉的;situation~n.~情境;gradual~adj.~逐步的;support~v.~帮助', [
  [2, 'She decided to change the way', 'She', 'decided', 'to change the way she practised', 'she practised 修饰 way；rather than 对比两种选择。', '改变方法与单纯增加时长形成对照。'],
  [7, 'She also kept reading', 'She', 'kept', 'reading', 'which 引导非限制性定语从句，概括继续阅读的效果。', 'which 从句中的 gave 和 made 并列，说明阅读的两方面帮助。'],
], [
  ['主旨大意', 'What change improves Nina\'s learning?', 'Using and recalling words in meaningful sentences|Copying longer lists more neatly|Avoiding all difficult words|Reading only her own notes', 0, 5, '她加入个人例句、主动回忆和持续阅读，使学习服务于实际使用。', ['笔记整齐却不会用正是原来的问题。','难词并未被放弃，而是再次复习。','她仍然阅读文章以获得新语境。']],
  ['细节理解', 'What does Nina do before checking her notes?', 'She tries to remember her sentences|She copies twenty new words|She asks a friend for the answers|She stops reading for a week', 0, 5, '她先盖住笔记回忆，随后核对。', ['二十词抄写是此前采用的方法。','文中没有朋友提供答案。','文章强调她保持阅读。']],
  ['逻辑推断', 'What does the writer suggest about progress?', 'It may be slow while still being useful|It must appear after one evening|It depends on a neat notebook alone|It requires forgetting old words', 0, 8, 'gradual 表明进步并非立刻发生，但已经提升真实使用能力。', ['末句明确说进步是渐进的。','整洁笔记本并不足以让她会运用。','复习的目标是记住而非遗忘旧词。']],
]);

add(2, 'Before You Share the Story', '转发之前', '社会', `
An exciting headline appeared in a student group one afternoon, claiming that the college library would close for a whole year.|一天下午，学生群里出现一条引人注意的标题，声称学校图书馆将关闭整整一年。
Several people immediately shared it with friends, and others complained without opening the link.|几个人立刻转发给朋友，另一些人还没打开链接就开始抱怨。
Jia was worried too, but she wanted to find the original notice before passing the message on.|佳也很担心，但她想先找到原始通知，再传播这条消息。

The article was two years old and described a different college with a similar name.|这篇文章是两年前的，讲的是另一所名字相似的学校。
When Jia checked her own library's website, she found only a plan to repair one reading room during the summer.|佳查看自己学校图书馆的网站后，只找到一项暑期维修一间阅览室的计划。
She posted the correct notice in the group and explained where the confusion had started.|她把正确通知发到群里，并解释误解从何而来。

The incident did not mean that every surprising story was false.|这件事并不意味着所有令人惊讶的消息都是假的。
It showed why dates, places, and original sources matter, especially when a headline makes us angry or afraid.|它说明日期、地点和原始来源为何重要，尤其是在标题引起愤怒或恐惧时。
A short pause before sharing can save many people from an unnecessary worry.|转发前稍作停顿，可能让许多人免去不必要的担忧。
Jia now asks who published a message and when, even if it comes from someone she trusts.|现在即使消息来自信任的人，佳也会问是谁发布的、何时发布的。
`, 'headline~n.~新闻标题;appear~v.~出现;claim~v.~声称;college~n.~学院;library~n.~图书馆;close~v.~关闭;whole~adj.~整个的;immediately~adv.~立刻;share~v.~分享;complain~v.~抱怨;original~adj.~原始的;notice~n.~通知;message~n.~消息;describe~v.~描述;similar~adj.~相似的;website~n.~网站;repair~v.~维修;correct~adj.~正确的;confusion~n.~混淆;incident~n.~事件;false~adj.~错误的;source~n.~来源;especially~adv.~尤其;pause~n.~停顿;unnecessary~adj.~不必要的', [
  [2, 'she wanted to find the original notice', 'she', 'wanted', 'to find the original notice', 'before passing the message on 是介词加动名词结构，表示转发前。', 'but 表示她虽然担忧，仍选择先核实。'],
  [7, 'It showed why sources matter', 'It', 'showed', 'why 引导的宾语从句', 'especially 引出强调；when 引导时间状语从句。', 'why 从句解释核实信息的重要性，而非说明所有报道都不可信。'],
], [
  ['主旨大意', 'What is the main purpose of the article?', 'To encourage checking information before sharing|To prove that libraries are disappearing|To warn students against reading news|To announce a year-long library closure', 0, 8, '全文围绕一次误传展开，落点是转发前核对来源、日期和地点。', ['文中并未讨论图书馆整体消失。','作者鼓励核实，不是拒绝新闻。','关闭一年的消息正是误传内容。']],
  ['细节理解', 'What was actually planned at Jia\'s college?', 'Repairs to one reading room|A complete closure for a year|A move to another city|The removal of all books', 0, 4, '官方网站只有暑期修缮一间阅览室的计划。', ['整年关闭属于另一所学校的旧消息。','文中没有迁往另一城市。','文中没有移走所有图书的安排。']],
  ['逻辑推断', 'Why can an emotional headline require extra care?', 'It may encourage people to react before checking|It always identifies the correct place|It proves that the story is false|It makes the publication date irrelevant', 0, 7, '同学们未打开链接便转发或抱怨，体现情绪可能催促未经核实的反应。', ['相似校名恰恰导致地点误认。','作者没有把情绪性标题等同于假消息。','日期正是本次核实的重要依据。']],
]);

add(2, 'Shade on the Walk Home', '回家路上的树荫', '环境', `
During a hot week, Rui noticed that one street felt more comfortable than the others on his walk home.|在炎热的一周里，瑞发现回家路上有一条街比其他街道更舒适。
It was lined with trees, whose branches shaded much of the pavement in the afternoon.|街道两旁种着树，午后枝叶遮住了大部分人行道。
The next street had wider roads and newer buildings, but very little shade.|下一条街的道路更宽，建筑更新，却几乎没有树荫。

Rui's class decided to study the difference with their teacher instead of relying only on how the streets felt.|瑞的班级决定与老师一起研究这种差异，而非仅凭对街道的感受下结论。
They measured temperatures in shaded and sunny places at the same time on several afternoons.|他们在几个下午的同一时刻，测量阴凉处和日晒处的温度。
They also recorded traffic and wind, because these conditions could affect the results.|他们还记录交通和风的情况，因为这些条件可能影响结果。

Their small project could not explain every difference between the streets, yet it helped them ask better questions.|这个小项目不能解释街道间的所有差异，却帮助他们提出了更好的问题。
Where could new trees grow without blocking a crossing, and who would water them in dry weather?|哪些地方能在不挡住路口的情况下种树，干燥天气里又由谁浇水呢？
The students learned that making a cooler neighbourhood involves both good ideas and long-term care.|学生们明白了，让社区更凉爽既需要好主意，也需要长期养护。
They presented their notes to the school, including the questions that their measurements had not yet answered.|他们向学校展示了笔记，包括那些测量尚未解答的问题。
`, 'shade~n.~阴凉处;comfortable~adj.~舒适的;branch~n.~树枝;pavement~n.~人行道;afternoon~n.~下午;wide~adj.~宽的;building~n.~建筑物;decide~v.~决定;study~v.~研究;difference~n.~差异;teacher~n.~老师;rely~v.~依赖;measure~v.~测量;temperature~n.~温度;sunny~adj.~阳光充足的;record~v.~记录;traffic~n.~交通;wind~n.~风;condition~n.~条件;affect~v.~影响;result~n.~结果;project~n.~项目;explain~v.~解释;crossing~n.~路口;care~n.~养护', [
  [1, 'It was lined with trees', 'It', 'was lined', '无直接宾语（被动语态）', 'with trees 表示排列的事物；whose branches 引导非限制性定语从句。', 'whose 表所属关系，把树与枝叶提供树荫联系起来。'],
  [5, 'They also recorded traffic and wind', 'They', 'recorded', 'traffic and wind', 'because 引导原因状语从句，解释记录其他条件的理由。', '结果可能受多种条件影响，因此需要一并记录。'],
], [
  ['主旨大意', 'What does the class project help the students understand?', 'A cooler neighbourhood needs investigation and continuing care|New buildings always lower street temperatures|Measuring once settles every question|Trees need no attention after planting', 0, 8, '调查后的问题涉及种在哪里和谁来浇水，末句强调想法与长期照料。', ['新建筑所在街道反而少有树荫。','学生多次测量，且承认项目有局限。','谁负责浇水是文中明确提出的问题。']],
  ['细节理解', 'Why did the class record traffic and wind?', 'These conditions might influence the results|They wanted to design a new bus|Their teacher had lost a traffic map|They were counting sunny days', 0, 5, 'because 从句直接说明这些条件可能影响结果。', ['文中没有设计公交车的计划。','老师丢地图并非文章情节。','记录对象不仅是晴天数量。']],
  ['逻辑推断', 'How does the writer view the small project?', 'Useful despite its limits|A final answer to every heat problem|A waste because it was small|A replacement for watering trees', 0, 6, 'could not explain every difference 与 helped them ask better questions 表明其有限但有用。', ['作者明确承认它不能解释所有差异。','项目帮助提出问题，并非浪费。','测量无法替代后续的实际养护。']],
]);

add(3, 'The Repair Table', '维修桌旁', '环境', `
On the first Saturday of each month, a community centre places a long table near its entrance and invites residents to bring broken household objects.|每月第一个周六，一家社区中心会在入口附近摆一张长桌，邀请居民带来损坏的家居物品。
Volunteer repairers work beside the owners, explaining each step rather than taking the objects away and returning them without discussion.|志愿维修人员和物主一起动手，解释每个步骤，而非把东西拿走、不加说明地修好送回。
The aim is to share practical knowledge as well as extend the life of useful products.|目的既是延长实用物品的寿命，也是分享实用知识。

For many visitors, the surprising part is discovering how small the original problem was.|对许多来访者来说，令人意外的是发现最初的问题竟那么小。
A loose connection or a damaged switch may make an entire lamp appear useless, even though most of its parts still work.|连接松动或开关损坏，可能让整盏灯看起来毫无用处，即使大部分零件仍能工作。
Seeing the repair changes the owner's understanding of what has been thrown away and what might be saved next time.|目睹维修过程改变了物主对已丢弃物品以及下次可能保留物品的看法。

However, the volunteers do not promise to fix everything, and they leave dangerous electrical work to qualified professionals.|不过，志愿者并不承诺修好所有东西，危险的电气维修交由合格专业人士处理。
Some products are sealed so tightly that opening them would cause further damage, while replacement parts for others are difficult to obtain.|有些产品封得过于严密，打开便会造成更多损坏；另一些产品则难以获取替换零件。
These limits reveal that the ability to repair depends partly on decisions made long before a customer buys the product.|这些限制表明，可维修性部分取决于顾客购买产品很久以前就已作出的设计决策。

The repair table therefore raises a wider question about design, alongside its immediate benefits for individual households.|因此，维修桌除了直接帮助家庭，也提出了更广泛的设计问题。
If manufacturers provide clear instructions and affordable spare parts, keeping a product in use may become a realistic choice rather than a specialist hobby.|如果制造商提供清晰说明和价格合理的备件，继续使用产品就可能成为可行选择，而不只是专业爱好。
Visitors leave with different outcomes: some carry a working object, while others carry a better explanation of why their object cannot safely be repaired.|来访者的收获各不相同：有人带走恢复工作的物品，有人则更清楚地知道自己的物品为什么不能安全维修。
Both outcomes can support a more informed decision when another product eventually needs replacing.|当另一件产品最终需要更换时，两种收获都有助于作出更明智的决定。
`, 'repair~n.~维修;community~n.~社区;resident~n.~居民;household~adj.~家用的;volunteer~n.~志愿者;owner~n.~物主;practical~adj.~实用的;extend~v.~延长;product~n.~产品;loose~adj.~松动的;connection~n.~连接;damaged~adj.~损坏的;switch~n.~开关;entire~adj.~整个的;useless~adj.~无用的;qualified~adj.~合格的;professional~n.~专业人士;seal~v.~密封;replacement~n.~替换;obtain~v.~获得;reveal~v.~揭示;ability~n.~能力;manufacturer~n.~制造商;affordable~adj.~价格合理的;realistic~adj.~切实可行的', [
  [7, 'Some products are sealed so tightly', 'Some products', 'are sealed', '无直接宾语（被动语态）', 'so…that… 引出结果；while 连接对比的情况。', '一个句子并列说明无法维修的两类原因：难以打开和缺少备件。'],
  [10, 'keeping a product in use may become a choice', 'keeping a product in use', 'may become', 'a realistic choice（表语）', 'If 引导条件状语从句；rather than 对比现实选择与专业爱好。', '动名词短语作主语，说明制造商的支持会改变维修的可行性。'],
], [
  ['主旨大意', 'What is the central message of the article?', 'Repair skills and repairable design both matter|Every object can be repaired by volunteers|Replacing products is always cheaper|Repair events should avoid teaching owners', 0, 8, '前文讲技能分享，后文转向产品设计和备件，强调两者共同决定维修可能性。', ['志愿者明确不保证修好一切。','文章没有对所有产品比较价格。','解释步骤恰好是活动的教学目标。']],
  ['细节理解', 'Why do some products remain difficult to repair?', 'Opening their sealed cases may damage them|Their owners refuse all instructions|Volunteers remove every working part|Community centres forbid lamps', 0, 7, '正文直接说密封过紧的产品在打开时可能进一步损坏。', ['并非所有物主拒绝学习。','志愿者不会无故拆除所有好零件。','台灯是维修例子，未被禁止。']],
  ['作者观点', 'How does the writer regard manufacturers\' involvement?', 'It can help make repair a practical option|It makes volunteer knowledge irrelevant|It guarantees that nothing will break|It matters only to professional hobbyists', 0, 10, '结尾用条件句提出制造商可通过说明和备件降低维修门槛。', ['产品设计支持与志愿技能可以互补。','可维修性并不意味着永不损坏。','作者希望维修成为更普遍的选择。']],
]);

add(3, 'The Quiet Cost of Switching Tasks', '切换任务的隐性代价', '心理', `
At the end of a busy afternoon, Chen could name many things he had started, yet very few he had actually finished.|忙碌的一下午结束时，陈能列出许多已开始的事，却几乎说不出真正做完了什么。
He had switched repeatedly between an assignment, messages from classmates, a shopping page, and a video that promised advice on studying efficiently.|他不断在作业、同学消息、购物页面和一段号称教授高效学习方法的视频之间切换。
Each change seemed brief enough to ignore, but returning to the assignment meant finding his place and rebuilding the argument in his head.|每次切换似乎短得可以忽略，但回到作业时，他都得重新定位进度，在脑中重建论证。

Chen decided to try a modest experiment rather than blame himself for lacking determination.|陈决定做一个小实验，而不是责怪自己缺乏毅力。
For the next three afternoons, he left his phone in a drawer and worked on one clearly defined part of the assignment before taking a break.|接下来的三个下午，他把手机放进抽屉，先完成作业中一个明确划定的部分，再休息。
He kept a sheet of paper nearby to note unrelated ideas, so that remembering an errand would not require immediately opening another application.|他在旁边放了一张纸记录无关的想法，这样想起一件杂事时就不必立刻打开另一个应用。

The arrangement did not remove every distraction, and one afternoon a necessary call interrupted his work.|这种安排并未消除所有干扰，其中一个下午，一通必要的电话打断了他的工作。
Nevertheless, finishing a small section gave him a clearer sense of progress than spending the same time surrounded by several unfinished tasks.|尽管如此，完成一小节，比用同样时间处理好几项未完任务更能让他感到进展。
He also found it easier to decide what to do next when the current step had a visible ending.|当眼下的步骤有明确终点时，他也更容易决定下一步做什么。

His experience does not establish a universal rule about concentration, but it points to a useful question for anyone who feels constantly busy.|他的经历不能确立一条普遍适用的专注规律，却为总觉得忙碌的人提供了一个有用问题。
Instead of asking only how long we worked, we might ask how often we had to start the same work again.|除了问自己工作了多久，我们还可以问，同一项工作究竟被迫重新开始了多少次。
That question can help us design a working environment in which returning to a task is less frequently necessary and progress is easier to recognise.|这个问题有助于设计一种工作环境，减少反复返回任务的必要，也让进展更容易辨认。
`, 'switch~v.~切换;task~n.~任务;assignment~n.~作业;repeatedly~adv.~反复地;efficiently~adv.~高效地;ignore~v.~忽略;argument~n.~论证;modest~adj.~规模不大的;experiment~n.~实验;determination~n.~毅力;drawer~n.~抽屉;define~v.~明确界定;section~n.~部分;unrelated~adj.~无关的;errand~n.~杂事;application~n.~应用程序;arrangement~n.~安排;distraction~n.~干扰;necessary~adj.~必要的;interrupt~v.~打断;nevertheless~adv.~尽管如此;visible~adj.~明显的;establish~v.~确立;universal~adj.~普遍适用的;concentration~n.~专注', [
  [5, 'He kept a sheet of paper nearby', 'He', 'kept', 'a sheet of paper', 'to note unrelated ideas 表示目的；so that 引导目的状语从句。', '记在纸上是为了不因想到杂事而立即切换应用。'],
  [9, 'His experience does not establish a rule', 'His experience', 'does not establish / points', 'a universal rule / to a useful question', 'who feels constantly busy 修饰 anyone。', 'but 连接局限与启发，避免把个人体验夸大为普遍结论。'],
], [
  ['主旨大意', 'What does the article invite readers to reconsider?', 'How often they restart work after switching tasks|Whether all phone calls should be banned|How to keep every application open|Whether assignments should be cancelled', 0, 10, '结尾将注意力从工作总时长转向重复进入同一任务的次数。', ['必要电话的存在说明作者并未主张禁掉一切来电。','同时打开多个应用是切换背景，不是建议。','文章探讨完成方法，而非取消作业。']],
  ['细节理解', 'Why did Chen keep paper beside him?', 'To record unrelated ideas without opening an application|To copy all his messages|To draw a plan of his drawer|To measure the length of a phone call', 0, 5, '纸张用来暂记杂事，减少立即切换应用的需求。', ['他没有抄写全部消息。','抽屉只用于存放手机。','没有用纸测量通话时间。']],
  ['作者观点', 'How does the writer present Chen\'s experiment?', 'As a limited personal experience with a useful lesson|As proof of a rule that applies to everyone|As a failure because one call occurred|As a comparison of different phone brands', 0, 9, '作者明确否认个人体验能确立普遍规律，同时指出它能引出有用问题。', ['universal rule 被明确否定。','一次中断不抹去完成小节的积极体验。','文中没有比较手机品牌。']],
]);

add(3, 'A Bus That People Can Trust', '值得信赖的公交车', '社会', `
When a town asks why residents prefer driving to taking the bus, the first answer is often that the journey takes too long.|当一个城镇询问居民为什么宁愿开车而不乘公交时，最常见的回答是行程太久。
Yet a closer conversation may reveal that the uncertain waiting time matters as much as the time spent moving.|但深入交谈可能发现，不确定的候车时间与行车时间同样重要。
A passenger who cannot predict whether a bus will arrive in two minutes or twenty must allow extra time for the entire trip.|如果乘客无法预测公交车会在两分钟还是二十分钟后到达，就必须为整段行程预留额外时间。

Consider two routes with the same average journey time but very different patterns of arrival.|设想两条平均行程时间相同、到站规律却截然不同的路线。
On one route, buses arrive at regular intervals; on the other, several may appear together after a long gap.|一条路线的公交车按固定间隔到达；另一条则可能久等之后几辆车一起来。
For someone travelling to an examination or collecting a child, the second pattern creates a risk that the average does not describe.|对赶考或接孩子的人来说，后一种模式带来的风险无法由平均数体现。

Improving the experience therefore involves more than adding a faster vehicle to an unreliable service.|因此，改善乘车体验不只是为不可靠的服务添上一辆速度更快的车。
Clear information about delays can help, but it cannot replace timetables that can usually be followed in ordinary traffic.|清晰的延误信息有所帮助，却不能替代在正常交通条件下通常能遵守的时刻表。
Planners may also need to examine junctions where buses repeatedly lose time and stops where boarding becomes unnecessarily slow.|规划者还可能需要研究公交车经常耽搁的路口，以及上车过程不必要地缓慢的站点。

No single change will make public transport suitable for every journey, especially in places where homes and workplaces are far apart.|没有哪项单一变化能让公共交通适合所有行程，尤其是在居住地与工作地相距甚远的地方。
Nevertheless, treating reliability as a central feature rather than a minor bonus gives planners a more accurate picture of what passengers need.|尽管如此，把可靠性视为核心特征而非附加好处，能让规划者更准确地了解乘客需求。
Asking passengers how early they leave home for an important appointment may reveal a hidden part of the journey that a timetable alone would miss.|询问乘客为了重要约会会提前多久出门，可能揭示单靠时刻表无法看到的隐性出行时间。
Reducing that burden could make an ordinary bus trip feel considerably more manageable.|减轻这种负担，可能让普通公交行程更容易安排。
`, 'resident~n.~居民;prefer~v.~更喜欢;journey~n.~行程;uncertain~adj.~不确定的;passenger~n.~乘客;predict~v.~预测;allow~v.~预留;entire~adj.~整个的;average~adj.~平均的;pattern~n.~模式;regular~adj.~规律的;interval~n.~间隔;gap~n.~空档;risk~n.~风险;unreliable~adj.~不可靠的;vehicle~n.~车辆;delay~n.~延误;replace~v.~替代;timetable~n.~时刻表;ordinary~adj.~普通的;junction~n.~路口;boarding~n.~上车;suitable~adj.~合适的;reliability~n.~可靠性;accurate~adj.~准确的', [
  [2, 'A passenger must allow extra time', 'A passenger', 'must allow', 'extra time', 'who 引导定语从句；whether…or… 引出两个可能到站时间。', '主干说明必须预留时间，定语从句交代乘客面临的不确定性。'],
  [10, 'treating reliability as a central feature gives planners a picture', 'treating reliability as a central feature rather than a minor bonus', 'gives', 'planners / a more accurate picture', 'of what passengers need 补充 picture 的内容。', '动名词短语作主语，give 后接间接宾语与直接宾语。'],
], [
  ['主旨大意', 'What feature of bus services does the writer emphasise?', 'Predictable and reliable arrival|The colour of vehicles|The complete removal of bus stops|The same route for every passenger', 0, 10, '文章重点是可靠性，末句明确将其定位为核心特征。', ['车辆颜色与文章论点无关。','作者建议研究站点效率，而非取消所有站点。','作者承认不同出行有不同需要。']],
  ['细节理解', 'What can the average journey time fail to show?', 'The risk created by irregular arrivals|The exact colour of the bus|Whether a town has any schools|The total population of a country', 0, 5, '平均耗时相同仍可能有规律与扎堆到达的差异，影响赶时间的人。', ['文章并未讨论车身颜色。','学校存在与否不是均值的讨论对象。','全国人口并非本文指标。']],
  ['作者观点', 'What does the writer think about delay information?', 'It helps but cannot replace a dependable timetable|It removes the need to improve service|It is useless in every situation|It makes all journeys equally suitable for buses', 0, 7, 'can help 与 cannot replace 同时承认信息价值和其局限。', ['信息不能取代实际服务可靠性。','作者明确说信息可以有所帮助。','最后一段否认单一措施适合所有行程。']],
]);

add(4, 'When a Target Becomes the Task', '当指标变成任务', '商业', `
A customer service team was asked to reduce the average length of its telephone calls, a target intended to help more customers receive assistance without waiting.|一个客服团队被要求缩短电话的平均通话时长，原意是让更多顾客无需等待便能得到帮助。
Managers could measure the figure easily, compare it across weeks, and display progress in a simple chart that seemed to make performance transparent.|管理者很容易衡量这个数字，逐周比较，再用简洁图表展示进展，绩效似乎由此变得透明。
Within a month, calls became shorter, but some customers began calling again because their original questions had not been resolved.|一个月内通话缩短了，但有些顾客因为原先的问题尚未解决，开始再次来电。

The result illustrates a familiar difficulty in managing complex work: an indicator can represent a goal without capturing everything that makes the goal valuable.|这一结果说明管理复杂工作时一种常见困难：指标能够代表目标，却无法涵盖目标之所以有价值的全部方面。
Shorter conversations may reflect clearer explanations, yet they may also reflect pressure to end a conversation before the customer understands the answer.|对话变短可能反映解释更清楚，也可能反映客服承受着在顾客理解前就结束通话的压力。
If only the duration is rewarded, employees receive a strong signal about which part of their work matters to the organisation.|如果只奖励时长，员工就会清楚感受到组织认为工作中的哪一部分重要。

Abandoning measurement altogether would not solve the problem, since managers still need ways to identify delays, distribute resources, and notice failures.|完全放弃衡量也无法解决问题，因为管理者仍需识别延误、分配资源并发现失败的方法。
A more useful response would combine the original measure with information about repeat calls and whether the customer's problem was actually solved.|更有用的做法是把原指标与重复来电情况、顾客问题是否真正解决等信息结合起来。
Listening to a small sample of calls could also reveal difficulties that a numerical summary would otherwise conceal.|听取少量通话样本，也可能揭示数字概况原本会掩盖的困难。

Such an approach requires judgement rather than the automatic assumption that an improving number must mean an improving service.|这种方法需要判断力，而不是自动认定数字改善就必然意味着服务改善。
It also requires explaining to employees why the measures exist, so that a temporary target does not quietly replace the broader purpose of helping people.|它还需要向员工解释衡量指标存在的原因，以免临时指标悄悄取代帮助顾客这一更广泛的目的。
The most informative question is therefore not simply whether a target has been reached, but what changed in the process of reaching it and who experienced those changes.|因此，最有信息价值的问题不只是是否达标，而是达标过程中改变了什么，以及谁经历了这些变化。
In the team's next discussion, a longer conversation with a confused customer might be examined as a necessary investment rather than an automatic failure.|在团队下一次讨论中，与困惑顾客进行较长对话，就可以被视为必要投入，而非自动判定为失败。
This would not excuse avoidable delays; it would distinguish time spent usefully from time that could genuinely be saved.|这并不是为可以避免的延误开脱，而是区分有用的时间投入与确实可以节省的时间。
The distinction matters because a measure is most helpful when it supports better questions about work, instead of ending the discussion as soon as the number looks right.|这种区分很重要，因为指标最有帮助的用法是促进对工作的深入追问，而非数字一旦好看就结束讨论。
Managers can then discuss the reasons behind an improvement before deciding whether to repeat the change.|管理者由此可以先讨论改善背后的原因，再决定是否继续采用这种变化。
`, 'target~n.~指标;assistance~n.~帮助;figure~n.~数字;transparent~adj.~透明的;resolve~v.~解决;illustrate~v.~说明;indicator~n.~指标;represent~v.~代表;capture~v.~涵盖;reflect~v.~反映;pressure~n.~压力;duration~n.~持续时间;reward~v.~奖励;employee~n.~员工;organisation~n.~组织;abandon~v.~放弃;measurement~n.~衡量;identify~v.~识别;distribute~v.~分配;resource~n.~资源;combine~v.~结合;numerical~adj.~数字的;conceal~v.~掩盖;judgement~n.~判断力;temporary~adj.~临时的', [
  [4, 'Shorter conversations may reflect explanations', 'Shorter conversations', 'may reflect', 'clearer explanations / pressure', 'yet 引出转折；before 引导时间状语从句。', '相同的表面指标变化可能对应完全不同的原因。'],
  [10, 'It also requires explaining why the measures exist', 'It', 'requires', 'explaining to employees why the measures exist', 'so that 引导目的状语从句；why 引导 explaining 的宾语从句。', '说明指标的用意，是为了防止手段取代服务目标。'],
], [
  ['主旨大意', 'What is the writer\'s main argument about targets?', 'Measures need to be interpreted alongside the purpose of the work|All numerical targets should immediately be removed|Short calls always prove excellent customer service|Employees should never know how performance is measured', 0, 9, '全文通过通话时长的例子主张综合判断指标与服务目标之间的关系。', ['作者明确说完全放弃衡量不能解决问题。','短通话也可能源于未解决问题便结束。','作者主张向员工解释衡量目的。']],
  ['细节理解', 'Why did some customers call a second time?', 'Their original problems remained unresolved|They could not read the progress chart|Managers required two calls from everyone|The team had stopped answering calls', 0, 2, '第三句明确用 because 指出问题未得到解决。', ['图表主要用于管理，没有顾客读图的情节。','文中不存在每人必须拨两次的规定。','团队缩短通话，并未停止接听。']],
  ['作者观点', 'How does the writer view listening to a sample of calls?', 'It can uncover problems hidden by a summary figure|It makes every other measure unnecessary|It guarantees that every customer is satisfied|It should replace all employee explanations', 0, 8, '听样本可补充数字概况遗漏的信息，但文章未声称它能替代全部措施。', ['作者建议结合多种信息。','少量样本不能保证所有顾客满意。','向员工解释指标的目的仍被强调。']],
]);

add(4, 'The Value of an Unchosen Book', '未被选中的书', '科技', `
An online bookshop learns what a reader enjoys by recording the titles they buy, the pages they visit, and the recommendations they choose to open.|一家网上书店通过记录读者买的书、访问的页面以及点开的推荐，了解其阅读喜好。
Used carefully, this information can make a large collection less overwhelming and introduce readers to authors they would otherwise struggle to discover.|谨慎使用这些信息，可以让庞大的藏书不那么令人无从下手，也能把原本难以发现的作者介绍给读者。
The convenience is real, but the evidence available to the system is narrower than the reader's interests might initially suggest.|便利确实存在，但系统掌握的证据可能比读者的实际兴趣狭窄得多。

A purchase may be a gift, a visit may be accidental, and a book left unopened may simply have appeared when the reader was too busy.|一次购买可能是送礼，一次浏览可能是误点，而一本未被打开的书可能只是出现在读者太忙的时候。
Moreover, the system cannot easily observe an interest that its own earlier recommendations never gave the reader an opportunity to express.|此外，对于此前的推荐从未给读者机会表达的兴趣，系统很难观察到。
If similar books are repeatedly displayed because they attracted attention before, a pattern can strengthen even when it reflects limited exposure rather than a fixed preference.|如果类似的书因为过去曾吸引注意而不断被展示，一种模式就可能增强，即使它反映的是接触有限而非偏好固定。

This does not mean that personalised suggestions inevitably trap every reader in a narrow world, or that a completely random shelf would serve them better.|这并不意味着个性化推荐必然把每个读者困在狭窄世界里，也不意味着完全随机的书架会提供更好服务。
It means that successful recommendations should leave room for discovery as well as repeat what already appears familiar.|它意味着成功的推荐除了重复看起来熟悉的内容，也应为发现新事物留出空间。
A reader might be allowed to explore an unfamiliar subject, explain that a purchase was a gift, or reset a pattern that no longer matches their aims.|读者可以获准探索陌生主题、说明某次购买是礼物，或重置已不符合其目标的推荐模式。

For designers, the difficult question is how to recognise the value of such exploration when a quick click is easier to measure than a slowly developing interest.|对设计者来说，难题是在快速点击比逐渐形成的兴趣更易衡量时，如何识别探索的价值。
A recommendation that is ignored today might still introduce a subject that becomes meaningful months later, although that possibility should not be confused with proven success.|今天被忽略的推荐，仍可能引入一个数月后变得重要的主题，不过不能把这种可能性混同于已证实的成功。
Treating the reader as someone whose interests can change, rather than as a stable collection of past clicks, offers a more generous starting point.|把读者视为兴趣能够变化的人，而非过去点击记录的固定集合，是一个更为开阔的出发点。
One practical option is to explain why a title appears and offer a separate route to subjects outside the usual pattern, without forcing the reader to abandon useful personal recommendations.|一个实用选择是解释某本书为何出现，同时提供通向惯常模式之外主题的独立入口，而不强迫读者放弃有用的个性化推荐。
Designers would then need to study whether people can actually find and understand those controls, rather than assuming that the mere presence of a button gives them meaningful choice.|设计者随后还需研究人们能否真正找到并理解这些控制选项，而不是假定只要有一个按钮，人们就获得了有意义的选择。
An understandable explanation can support that choice without requiring technical knowledge of the recommendation system.|清楚易懂的解释能帮助读者作出选择，无需他们掌握推荐系统的技术知识。
`, 'recommendation~n.~推荐;collection~n.~集合;overwhelming~adj.~令人无从应对的;otherwise~adv.~否则;convenience~n.~便利;evidence~n.~证据;initially~adv.~最初;purchase~n.~购买;accidental~adj.~偶然的;observe~v.~观察;opportunity~n.~机会;express~v.~表达;repeatedly~adv.~反复地;exposure~n.~接触;preference~n.~偏好;personalised~adj.~个性化的;inevitably~adv.~不可避免地;random~adj.~随机的;discovery~n.~发现;unfamiliar~adj.~不熟悉的;recognise~v.~识别;exploration~n.~探索;meaningful~adj.~有意义的;stable~adj.~稳定的;generous~adj.~宽广包容的', [
  [5, 'a pattern can strengthen', 'a pattern', 'can strengthen', '无直接宾语', 'If 为条件从句，even when 为让步状语从句；because 说明展示原因。', '多个从句嵌套，主干仍是推荐模式可能自我强化。'],
  [11, 'Treating the reader as someone offers a starting point', 'Treating the reader as someone whose interests can change', 'offers', 'a more generous starting point', 'whose 引导定语从句；rather than 引出对照。', '动名词短语作主语，对比可变化的人与固定点击集合。'],
], [
  ['主旨大意', 'What principle does the writer propose for book recommendations?', 'Allow interests to develop beyond past behaviour|Use only random books for every reader|Treat every purchase as a permanent preference|Remove all recommendations from bookshops', 0, 11, '结尾强调兴趣能够变化，推荐需要给探索留出空间。', ['作者明确不主张完全随机的书架更好。','购买可能是礼物，不等于永久偏好。','作者承认推荐的实际便利，并未要求取消。']],
  ['细节理解', 'Why might a purchase misrepresent a reader\'s taste?', 'The book may be a gift for someone else|The bookshop records no purchases|The reader is unable to visit any pages|Every purchased book is immediately returned', 0, 3, '第四句直接给出购买礼物的可能性。', ['系统正是通过购买记录了解读者。','页面访问也在系统记录之列。','文章没有提到全部图书都被退回。']],
  ['作者观点', 'How does the writer describe an ignored recommendation?', 'It may have later value, but that value is not yet proved|It always proves that the system has failed|It guarantees a new interest within a month|It should be counted as an immediate successful sale', 0, 10, '作者同时保留潜在价值与证据边界，不能把可能成功算成已成功。', ['作者提出被忽略也可能产生较晚价值。','may 和 might 都不构成时间保证。','未点击或未购买不能算即时销售。']],
]);

add(4, 'Whose Time Does Flexibility Save?', '弹性安排节省了谁的时间', '经济', `
Flexible working arrangements are often described as a simple exchange: employees gain control over their schedules, while organisations gain a more satisfied workforce.|弹性工作安排常被描述为一种简单交换：员工获得对日程的控制，组织则拥有更满意的员工队伍。
For a worker who can avoid a crowded commute or collect a child before returning to a task, the benefits can be substantial.|对能够避开拥挤通勤，或先接孩子再回去处理任务的员工而言，好处可能很大。
However, the word flexibility can describe very different relationships between the person doing the work and the person deciding when it must be done.|不过，弹性一词可能描述劳动者与工作时间决定者之间截然不同的关系。

In one arrangement, a team agrees on the hours when everyone needs to be available and allows individuals to organise the remaining work around their responsibilities.|一种安排是团队商定所有人需要在线的时段，让个人围绕其他责任安排剩余工作。
In another, workers receive their schedules at short notice and must remain prepared for changes that they have little power to refuse.|另一种安排中，员工临时才收到排班通知，还必须随时准备应对自己几乎无权拒绝的变动。
Both arrangements may be called flexible, yet only the first clearly gives employees greater ability to plan their own time.|两种安排都可能被称为弹性，但只有第一种明显让员工更有能力规划自己的时间。

The difference becomes especially important when work intersects with care, education, or a second job.|当工作与照护、教育或第二份工作交织时，这一区别尤为重要。
A last-minute change may appear minor to a manager looking at a staffing table, but it can force a worker to rearrange childcare or lose a place in a class.|在查看人员配置表的经理眼里，临时调整似乎无关紧要，却可能迫使员工重新安排托育或错过课程。
An apparent efficiency for the organisation may therefore involve costs that have simply moved outside its own accounts.|因此，组织表面上效率提高，可能只是把成本转移到了自身账目之外。

Evaluating flexible work requires asking who controls the changes, how much warning is provided, and whether declining an unsuitable shift carries a penalty.|评价弹性工作，需要问谁控制变动、提前多久通知，以及拒绝不合适的班次是否会受罚。
Clear expectations about response times can matter as much as permission to work away from an office, particularly if messages otherwise extend the working day into the evening.|对于回复时限的明确约定，可能与获准远程办公同样重要，尤其是在消息会把工作日延伸到夜晚的情况下。
The aim should be an arrangement that creates usable freedom, rather than a convenient label that leaves uncertainty with those least able to absorb it.|目标应是创造可实际运用的自由，而不是使用一个方便的标签，把不确定性留给最难承受的人。
For example, publishing a schedule earlier may have little effect on the total hours worked while greatly improving someone's ability to arrange transport and care.|例如，提前发布排班，可能几乎不影响总工时，却显著改善一个人安排交通与照护的能力。
Such benefits are easy to overlook if evaluation focuses only on how quickly an organisation can adjust its staffing, rather than on whether the people affected can make reliable plans of their own.|如果评价只关注组织多快能调整人员配备，而不关注受到影响的人能否可靠地安排生活，这些好处就很容易被忽略。
What looks flexible on paper should therefore be tested against the daily experience of the people expected to live with it.|因此，纸面上看似灵活的安排，应当对照实际承受它的人们的日常体验来检验。
`, 'flexible~adj.~灵活的;arrangement~n.~安排;employee~n.~员工;schedule~n.~日程;organisation~n.~组织;workforce~n.~员工队伍;commute~n.~通勤;substantial~adj.~很大的;relationship~n.~关系;available~adj.~可联系到的;individual~n.~个人;responsibility~n.~责任;refuse~v.~拒绝;intersect~v.~交织;care~n.~照护;minor~adj.~较小的;staffing~n.~人员配备;rearrange~v.~重新安排;apparent~adj.~表面上的;efficiency~n.~效率;evaluate~v.~评价;shift~n.~班次;penalty~n.~处罚;expectation~n.~预期;uncertainty~n.~不确定性', [
  [7, 'A last-minute change may appear minor but it can force a worker', 'A last-minute change / it', 'may appear / can force', 'minor（表语）/ a worker', 'looking at a staffing table 修饰 manager；to rearrange…or lose… 是宾语补足语。', 'but 对比经理看到的小调整与劳动者实际承担的后果。'],
  [9, 'Evaluating flexible work requires asking questions', 'Evaluating flexible work', 'requires', 'asking who controls the changes, how much warning is provided, and whether…', 'who、how much、whether 引导三个并列的间接疑问结构。', '动名词作主语，通过三个问题给出评价弹性安排的维度。'],
], [
  ['主旨大意', 'What distinction is central to the article?', 'Whether workers actually control their time|Whether offices have modern furniture|Whether every employee works the same hours|Whether messages can replace all meetings', 0, 5, '两种同名安排的差别在于员工能否掌控并规划自己的时间。', ['办公家具未进入文章论证。','作者允许个人安排，不主张时间完全相同。','消息仅用于说明回复边界，不是会议替代论。']],
  ['细节理解', 'What can a last-minute schedule change force a worker to do?', 'Rearrange childcare or miss a class|Create a new staffing table for the manager|Give up every future job|Move the office to another city', 0, 7, '第八句明确举出重新安排托育或错过课程的代价。', ['配置表由经理查看，非劳动者被迫制作。','文章没有把后果扩大为放弃所有工作。','办公室搬迁并非文中后果。']],
  ['作者观点', 'What does the writer suggest when judging flexibility?', 'Examine control, notice, and the consequences of refusal|Accept the label without asking further questions|Count only the organisation\'s recorded expenses|Assume working away from an office solves every problem', 0, 9, '作者给出控制权、通知时间、拒绝后果三项具体评价问题。', ['全文反对只看弹性这个标签。','转移到账外的成本正是需要关注的。','回复边界说明远程办公仍可能拉长工时。']],
]);

const base = new URL('../src/data/articles/', import.meta.url);
const counts = { 1: 8, 2: 8, 3: 8, 4: 6 };
for (const pack of packs) {
  const n = ++counts[pack.level];
  const id = `l${pack.level}-${String(n).padStart(2, '0')}`;
  const paragraphs = pack.body.trim().split(/\n\s*\n/).map((paragraph) => ({ sentences: paragraph.split('\n').map((line) => { const [en, zh] = line.split('|'); return { en, zh }; }) }));
  const flat = paragraphs.flatMap((p) => p.sentences);
  const vocabulary = pack.vocab.split(';').map((line) => { const [word, pos, gloss] = line.split('~'); return { word, pos, gloss }; });
  const article = {
    id, title: pack.title, titleZh: pack.titleZh, level: pack.level, category: pack.category,
    tags: ['扩充阅读', '原创'], paragraphs, keyVocab: vocabulary.slice(0, 5),
    glossary: Object.fromEntries(vocabulary.map((v) => [v.word, `${v.pos} ${v.gloss}`])),
    grammar: pack.grammar.map(([index, main, subject, predicate, object, modifiers, logic]) => ({ en: flat[index].en, zh: flat[index].zh, main, subject, predicate, object, modifiers, logic })),
    quiz: pack.quiz.map(([type, question, options, answer, index, explain, whyWrong], i) => {
      const choices = options.split('|').map((text, j) => ({ text, correct: j === answer, reason: j === answer ? null : whyWrong[j < answer ? j : j - 1] }));
      const rotation = (n + i) % choices.length;
      const ordered = [...choices.slice(rotation), ...choices.slice(0, rotation)];
      return { id: `${id}-q${i + 1}`, type, question, options: ordered.map((c) => c.text), answer: ordered.findIndex((c) => c.correct), evidence: flat[index].en, explain, whyWrong: ordered.filter((c) => !c.correct).map((c) => c.reason) };
    }),
    source: 'English Lab 原创教学短文；人物及情境为虚构示例，不代表真实研究或新闻报道',
    license: 'English Lab original educational content',
  };
  const file = new URL(`level${pack.level}.json`, base);
  const articles = JSON.parse(readFileSync(file, 'utf8')).filter((a) => a.id !== id);
  articles.push(article);
  writeFileSync(file, JSON.stringify(articles, null, 2) + '\n');
  console.log(id, (flat.map((s) => s.en).join(' ').match(/[A-Za-z][A-Za-z'-]*/g) || []).length, pack.title);
}
