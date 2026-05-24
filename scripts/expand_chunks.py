#!/usr/bin/env python3
"""Expand chunks.json with all 6 topics to 50 chunks each (300 total)."""

import json
import os
import random

random.seed(42)

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "chunks.json")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    chunks = json.load(f)

print(f"Loaded {len(chunks)} existing chunks.")

# Verify existing topics
topics_count = {}
for c in chunks:
    for t in c["topics"]:
        topics_count[t] = topics_count.get(t, 0) + 1
print(f"Current topic counts: {topics_count}")

# Topic prefix to Chinese name
TOPIC_CN = {
    "work": "工作",
    "health": "健康",
    "city": "城市",
}


def make_chunk(cid, word, translation, band, freq, topics, modules,
               collocations, example, synonyms, mistakes, context):
    return {
        "id": cid,
        "word": word,
        "translation": translation,
        "part_of_speech": "noun phrase",
        "band_level": band,
        "frequency_score": freq,
        "topics": topics,
        "modules": modules,
        "collocations": collocations,
        "example_sentence": example,
        "synonyms": synonyms,
        "common_mistakes": mistakes,
        "ielts_context": context,
    }


# ===============================================================
# WORK TOPIC (49 new: work-002 to work-050)
# Distribution: 20 超高频(90-99), 17 高频(70-89), 12 中频(50-69)
# work-001 existing: score 85 (high-freq)
# ===============================================================

work_data = [
    # === 超高频 20 items (90-99): work-002 ~ work-021 ===
    ("work-002", "employment opportunities", "就业机会", "6.5", 98,
     ["writing","speaking"],
     ["create employment opportunities","limited employment opportunities","expand employment opportunities","access to employment opportunities"],
     "The government should invest in vocational training to expand employment opportunities for young people.",
     ["job opportunities","job prospects","career opportunities"],
     ["employment 不可数；说 job opportunities 更口语化"],
     "Writing Task 2: unemployment / government policy; Speaking Part 3: jobs"),

    ("work-003", "job satisfaction", "工作满意度", "6.5", 97,
     ["writing","speaking"],
     ["high level of job satisfaction","improve job satisfaction","factors affecting job satisfaction","decline in job satisfaction"],
     "A supportive work environment is one of the key factors affecting job satisfaction.",
     ["work satisfaction","career satisfaction","occupational satisfaction"],
     ["satisfaction 介词用 with：job satisfaction with salary"],
     "Writing Task 2: work motivation / company culture; Speaking Part 3: career"),

    ("work-004", "career advancement", "职业晋升", "6.5", 96,
     ["writing","speaking"],
     ["pursue career advancement","opportunities for career advancement","blocked career advancement","rapid career advancement"],
     "Many employees change jobs frequently in search of better career advancement opportunities.",
     ["career progression","career growth","professional advancement"],
     ["advancement 不用于 physical movement，仅用于抽象晋升"],
     "Writing Task 2: career development; Speaking Part 3: ambitions"),

    ("work-005", "workplace environment", "工作环境", "6.0", 95,
     ["writing","speaking"],
     ["positive workplace environment","toxic workplace environment","create a safe workplace environment","competitive workplace environment"],
     "A positive workplace environment boosts employee morale and overall productivity.",
     ["working environment","work atmosphere","office environment"],
     ["workplace 和 workspace 不同：workplace 泛指工作场所，workspace 指个人工位"],
     "Writing Task 2: company culture; Speaking Part 3: job preferences"),

    ("work-006", "job security", "工作稳定性", "6.0", 94,
     ["writing","speaking"],
     ["guarantee job security","threaten job security","loss of job security","sense of job security"],
     "In times of economic uncertainty, job security becomes a top priority for workers.",
     ["employment security","job stability","tenure security"],
     ["security 不可数，不说 a job security"],
     "Writing Task 2: employment trends / gig economy; Speaking Part 3: job market"),

    ("work-007", "professional development", "职业发展", "6.5", 93,
     ["writing","speaking"],
     ["invest in professional development","ongoing professional development","professional development opportunities","support professional development"],
     "Companies that invest in employees' professional development tend to have lower staff turnover rates.",
     ["career development","vocational development","professional growth"],
     ["professional development 常见缩写 CPD (Continuing Professional Development)"],
     "Writing Task 2: education / training; Speaking Part 3: workplace learning"),

    ("work-008", "unemployment rate", "失业率", "5.5", 99,
     ["writing","speaking"],
     ["rising unemployment rate","reduce the unemployment rate","youth unemployment rate","official unemployment rate"],
     "Despite technological advances, the unemployment rate in many countries remains stubbornly high.",
     ["jobless rate","rate of unemployment","unemployment level"],
     ["说 the unemployment rate 或 an unemployment rate of 5%"],
     "Writing Task 1: line graphs / bar charts; Writing Task 2: economy"),

    ("work-009", "transferable skills", "可迁移技能", "6.5", 91,
     ["writing","speaking"],
     ["develop transferable skills","acquire transferable skills","demonstrate transferable skills","highly transferable skills"],
     "Volunteering helps young people develop transferable skills such as communication and teamwork.",
     ["portable skills","cross-functional skills","versatile skills"],
     ["transferable 两个 r：trans-fer-able"],
     "Writing Task 2: education / employment; Speaking Part 3: career preparation"),

    ("work-010", "corporate culture", "企业文化", "6.5", 92,
     ["reading","writing"],
     ["strong corporate culture","shape corporate culture","toxic corporate culture","corporate culture transformation"],
     "A healthy corporate culture encourages innovation and open communication among staff.",
     ["organizational culture","company culture","business culture"],
     ["corporate 的发音 /ˈkɔːpərət/，重音在第一音节"],
     "Reading: business articles; Writing Task 2: management"),

    ("work-011", "salary negotiation", "薪资谈判", "6.0", 90,
     ["speaking","listening"],
     ["engage in salary negotiation","successful salary negotiation","salary negotiation skills","during salary negotiation"],
     "Many candidates feel uncomfortable with salary negotiation and accept the first offer they receive.",
     ["pay negotiation","wage bargaining","compensation negotiation"],
     ["negotiation 拼写注意 ti 不是 ci"],
     "Speaking Part 3: workplace / career; Listening Section 3: job interview discussion"),

    ("work-012", "performance evaluation", "绩效评估", "6.5", 90,
     ["reading","writing"],
     ["undergo performance evaluation","annual performance evaluation","conduct a performance evaluation","performance evaluation system"],
     "Regular performance evaluations provide employees with valuable feedback for improvement.",
     ["performance review","performance appraisal","performance assessment"],
     ["evaluation 的动词是 evaluate，去 e 加 ion"],
     "Reading: HR management; Writing Task 2: workplace practices"),

    ("work-013", "job market", "就业市场", "6.0", 95,
     ["writing","speaking"],
     ["competitive job market","enter the job market","tight job market","global job market"],
     "Graduates face fierce competition when entering today's highly competitive job market.",
     ["labour market","employment market","work market"],
     ["job market 前不总加 the：enter the job market 但 a tight job market"],
     "Writing Task 2: graduate employment; Speaking Part 3: career planning"),

    ("work-014", "flexible working hours", "弹性工作时间", "6.0", 93,
     ["writing","speaking"],
     ["offer flexible working hours","request flexible working hours","benefit from flexible working hours","introduce flexible working hours"],
     "Flexible working hours allow employees to better balance their professional and personal responsibilities.",
     ["flextime","flexible schedule","flexible work arrangements"],
     ["hours 必须用复数；flexible working hours 不是 flexible work hours"],
     "Writing Task 2: work-life balance; Speaking Part 3: ideal job"),

    ("work-015", "team collaboration", "团队协作", "5.5", 96,
     ["writing","speaking"],
     ["enhance team collaboration","effective team collaboration","promote team collaboration","cross-functional team collaboration"],
     "Modern project management tools facilitate team collaboration across different time zones.",
     ["teamwork","group cooperation","collaborative work"],
     ["collaboration 介词用 with：collaboration with colleagues"],
     "Writing Task 2: workplace efficiency; Speaking Part 3: teamwork"),

    ("work-016", "staff turnover", "员工流动率", "6.5", 91,
     ["reading","writing"],
     ["high staff turnover","reduce staff turnover","staff turnover rate","excessive staff turnover"],
     "Industries with high staff turnover often struggle to maintain consistent service quality.",
     ["employee turnover","personnel turnover","labour turnover"],
     ["turnover 在此义项下不可数；注意不是 overturn"],
     "Reading: business / HR management; Writing Task 2: employment"),

    ("work-017", "career path", "职业道路", "6.0", 90,
     ["writing","speaking"],
     ["choose a career path","follow a traditional career path","non-linear career path","change career path"],
     "Young people today are more likely to change their career path several times during their working life.",
     ["career trajectory","professional path","vocational path"],
     ["path 可搭配 different/alternative/non-traditional"],
     "Writing Task 2: career change; Speaking Part 3: ambitions"),

    ("work-018", "occupational health", "职业健康", "6.5", 90,
     ["reading","listening"],
     ["occupational health and safety","occupational health standards","occupational health risks","occupational health services"],
     "Employers have a legal duty to protect their workers' occupational health and safety.",
     ["workplace health","industrial health","occupational wellness"],
     ["常缩写为 OHS (Occupational Health and Safety) 或 OSH"],
     "Reading: workplace regulations; Listening Section 4: health and safety lecture"),

    ("work-019", "employee benefits", "员工福利", "6.0", 90,
     ["writing","speaking"],
     ["attractive employee benefits","comprehensive employee benefits package","provide employee benefits","cut employee benefits"],
     "In addition to a competitive salary, the company offers a comprehensive range of employee benefits.",
     ["employee perks","staff benefits","workplace benefits"],
     ["benefits 常用复数；perk 是更口语的说法"],
     "Writing Task 2: employment compensation; Speaking Part 3: ideal job"),

    ("work-020", "labour productivity", "劳动生产力", "6.0", 91,
     ["reading","writing"],
     ["boost labour productivity","measure labour productivity","decline in labour productivity","maintain high labour productivity"],
     "Studies show that regular breaks can significantly improve labour productivity and accuracy.",
     ["workforce productivity","employee output","workplace productivity"],
     ["productivity 不可数；来自形容词 productive"],
     "Reading: business / economics; Writing Task 2: work efficiency"),

    ("work-021", "labour force participation", "劳动力参与率", "6.5", 90,
     ["reading","writing"],
     ["labour force participation rate","increase labour force participation","declining labour force participation","female labour force participation"],
     "The aging population has led to a gradual decline in labour force participation across developed nations.",
     ["workforce participation","labour participation","economic participation"],
     ["labour (UK) = labor (US)；两者都可用于 IELTS"],
     "Writing Task 1: demographic data; Reading: economic reports"),

    # === 高频 17 items (70-89): work-022 ~ work-038 ===
    ("work-022", "career prospects", "职业前景", "6.0", 85,
     ["writing","speaking"],
     ["bright career prospects","limited career prospects","future career prospects","improve career prospects"],
     "Many students choose their degree based on future career prospects rather than personal interest.",
     ["job prospects","career outlook","professional future"],
     ["prospects 常用复数；不说 career prospect（虽然单数有时可接受）"],
     "Writing Task 2: education / employment; Speaking Part 3: university choice"),

    ("work-023", "commuting time", "通勤时间", "5.5", 83,
     ["writing","speaking"],
     ["long commuting time","reduce commuting time","average commuting time","waste hours in commuting time"],
     "Long commuting times have been linked to higher stress levels and reduced job satisfaction.",
     ["travel time to work","journey time","commute duration"],
     ["commuting 是 commute 的动名词；commute 既可作动词也可作名词"],
     "Speaking Part 1: daily routine; Writing Task 2: urban planning"),

    ("work-024", "salary package", "薪资方案", "6.0", 80,
     ["speaking","listening"],
     ["competitive salary package","negotiate a better salary package","attractive salary package","overall salary package"],
     "When evaluating a job offer, candidates should consider the entire salary package rather than just the base pay.",
     ["compensation package","remuneration package","pay package"],
     ["salary 和 wage 的区别：salary 通常是年薪（白领），wage 通常按小时/周计算（蓝领）"],
     "Speaking Part 3: job expectations; Listening Section 3: career advice"),

    ("work-025", "promotion opportunity", "晋升机会", "6.0", 82,
     ["writing","speaking"],
     ["limited promotion opportunities","seek promotion opportunities","equal promotion opportunities","lack of promotion opportunities"],
     "A lack of promotion opportunities is often cited as the primary reason for leaving a job.",
     ["career advancement opportunities","upward mobility","promotional prospects"],
     ["get a promotion（获得晋升），promotion 可数"],
     "Writing Task 2: gender equality; Speaking Part 3: career goals"),

    ("work-026", "workplace diversity", "职场多元化", "6.5", 78,
     ["reading","writing"],
     ["promote workplace diversity","embrace workplace diversity","cultural workplace diversity","benefits of workplace diversity"],
     "Companies with strong workplace diversity tend to be more innovative and better at problem-solving.",
     ["workforce diversity","employment diversity","organizational diversity"],
     ["diversity 不可数，不说 a diversity"],
     "Reading: business management; Writing Task 2: equality in workplace"),

    ("work-027", "workforce shortage", "劳动力短缺", "6.5", 81,
     ["reading","writing"],
     ["address workforce shortage","severe workforce shortage","skilled workforce shortage","global workforce shortage"],
     "The healthcare industry is facing a critical workforce shortage as demand for services continues to grow.",
     ["labour shortage","staff shortage","manpower shortage"],
     ["workforce 注意拼写：一个词，不是 work force"],
     "Reading: economic trends; Writing Task 2: immigration / employment policy"),

    ("work-028", "vocational training", "职业培训", "6.0", 84,
     ["writing","speaking"],
     ["provide vocational training","undergo vocational training","vocational training programme","access to vocational training"],
     "Governments should invest more in vocational training to bridge the skills gap in the labour market.",
     ["technical training","job training","trade training"],
     ["vocational 来自 vocation（职业），不是 vacation（假期）"],
     "Writing Task 2: education policy / skills gap; Speaking Part 3: alternative to university"),

    ("work-029", "employment contract", "劳动合同", "6.0", 76,
     ["reading","listening"],
     ["sign an employment contract","fixed-term employment contract","breach of employment contract","under the terms of the employment contract"],
     "Before starting a new job, employees should carefully review their employment contract.",
     ["work contract","labour contract","contract of employment"],
     ["contract 作名词重音在前 /ˈkɒntrækt/，作动词重音在后 /kənˈtrækt/"],
     "Reading: employment law; Listening Section 3: HR discussion"),

    ("work-030", "working conditions", "工作条件", "6.0", 86,
     ["writing","speaking"],
     ["improve working conditions","poor working conditions","safe working conditions","harsh working conditions"],
     "Improving working conditions in factories should be a priority for governments and multinational corporations.",
     ["work conditions","labour conditions","workplace conditions"],
     ["conditions 必用复数；working conditions 不是 work conditions"],
     "Writing Task 2: labour rights / globalization; Speaking Part 3: workplace"),

    ("work-031", "job application", "求职申请", "5.5", 80,
     ["speaking","listening"],
     ["submit a job application","fill out a job application","successful job application","online job application"],
     "Crafting a tailored job application for each position increases the chances of securing an interview.",
     ["employment application","job submission","position application"],
     ["application 后介词用 for：job application for the position"],
     "Speaking Part 1: job hunting; Listening Section 2: job fair announcement"),

    ("work-032", "trade union", "工会", "6.0", 77,
     ["reading","writing"],
     ["join a trade union","trade union membership","trade union representatives","powerful trade union"],
     "Trade unions play a vital role in protecting workers' rights and negotiating fair wages.",
     ["labour union","union","labour organization"],
     ["trade union (UK) = labor union (US)"],
     "Reading: labour history; Writing Task 2: workers' rights"),

    ("work-033", "managerial position", "管理职位", "6.5", 75,
     ["reading","writing"],
     ["hold a managerial position","promoted to a managerial position","senior managerial position","aspire to a managerial position"],
     "Women remain underrepresented in senior managerial positions across many industries.",
     ["management position","executive role","leadership position"],
     ["managerial 是 manager 的形容词形式；注意拼写：-erial 不是 -eriall"],
     "Reading: gender equality; Writing Task 2: workplace inequality"),

    ("work-034", "working remotely", "远程办公", "6.0", 88,
     ["writing","speaking"],
     ["prefer working remotely","adapt to working remotely","challenges of working remotely","advantages of working remotely"],
     "Working remotely has become the new normal for millions of office workers since the pandemic.",
     ["telecommuting","remote work","working from home"],
     ["remotely 副词；remote 形容词。说 work remotely 不是 work remote"],
     "Writing Task 2: future of work; Speaking Part 3: lifestyle changes"),

    ("work-035", "freelance work", "自由职业", "6.0", 79,
     ["writing","speaking"],
     ["engage in freelance work","pursue freelance work","full-time freelance work","secure freelance work"],
     "The gig economy has made freelance work a viable career option for millions of professionals.",
     ["self-employment","independent contracting","freelancing"],
     ["freelance 可以作形容词、名词(freelancer)、动词(to freelance)"],
     "Writing Task 2: gig economy; Speaking Part 3: work trends"),

    ("work-036", "career break", "职业中断", "6.0", 73,
     ["speaking","listening"],
     ["take a career break","extended career break","returning from a career break","voluntary career break"],
     "Taking a career break to travel or raise children is becoming increasingly accepted by employers.",
     ["career gap","employment gap","career hiatus"],
     ["break 应与 gap 区分：career break 是主动选择，unemployment gap 是被动失业"],
     "Speaking Part 1: career history; Listening Section 3: career counseling"),

    ("work-037", "apprenticeship programme", "学徒项目", "6.0", 71,
     ["listening","reading"],
     ["enrol in an apprenticeship programme","apprenticeship programme provider","complete an apprenticeship programme","government-funded apprenticeship programme"],
     "Apprenticeship programmes offer a practical alternative to university education for many young people.",
     ["trainee programme","vocational apprenticeship","skills training programme"],
     ["apprenticeship 双 p：apprentice + ship（状态）"],
     "Listening Section 2: course information; Reading: education alternatives"),

    ("work-038", "income inequality", "收入不平等", "6.5", 84,
     ["writing","speaking"],
     ["address income inequality","rising income inequality","reduce income inequality","growing income inequality"],
     "Rising income inequality has become one of the most pressing economic challenges of our time.",
     ["income disparity","wage inequality","earnings gap"],
     ["inequality 不可数；注意区别 wealth inequality（财富不平等）"],
     "Writing Task 2: economic policy / social justice; Speaking Part 3: society"),

    # === 中频 12 items (50-69): work-039 ~ work-050 ===
    ("work-039", "skills gap", "技能缺口", "6.5", 68,
     ["reading","writing"],
     ["bridge the skills gap","address the skills gap","widening skills gap","technical skills gap"],
     "Employers across the technology sector report a persistent skills gap between graduate capabilities and industry needs.",
     ["skill shortage","competency gap","qualifications gap"],
     ["gap 搭配 bridge/close/narrow/address；不说 solve the gap"],
     "Reading: education / employment; Writing Task 2: education reform"),

    ("work-040", "sick leave", "病假", "5.5", 65,
     ["speaking","listening"],
     ["take sick leave","paid sick leave","entitled to sick leave","extended sick leave"],
     "Employees should not feel pressured to work when they are ill, as sick leave exists to protect both workers and colleagues.",
     ["medical leave","sickness absence","health leave"],
     ["sick leave 是固定搭配；leave 此处不可数"],
     "Speaking Part 1: work; Listening Section 1: absence reporting"),

    ("work-041", "performance bonus", "绩效奖金", "6.0", 63,
     ["speaking","listening"],
     ["receive a performance bonus","annual performance bonus","eligible for a performance bonus","performance bonus scheme"],
     "The company offers a generous annual performance bonus to employees who exceed their targets.",
     ["merit bonus","incentive pay","performance incentive"],
     ["bonus 复数 bonuses（不是 boni）"],
     "Speaking Part 3: work motivation; Listening Section 3: HR presentation"),

    ("work-042", "labour rights", "劳工权益", "6.5", 61,
     ["reading","writing"],
     ["protect labour rights","violate labour rights","basic labour rights","labour rights violations"],
     "International organizations have called for stricter enforcement of labour rights in global supply chains.",
     ["workers' rights","employee rights","labour standards"],
     ["labour rights 常用复数；表示多项权利的整体"],
     "Reading: globalization / ethics; Writing Task 2: corporate social responsibility"),

    ("work-043", "job burnout", "职业倦怠", "6.5", 66,
     ["reading","writing"],
     ["experience job burnout","prevent job burnout","symptoms of job burnout","severe job burnout"],
     "Chronic overwork and high pressure can lead to job burnout, affecting both personal well-being and professional performance.",
     ["occupational burnout","work exhaustion","career burnout"],
     ["burnout 一个词（名词）；burn out 两个词（短语动词）"],
     "Reading: workplace psychology; Writing Task 2: work culture"),

    ("work-044", "career ladder", "职业阶梯", "6.0", 62,
     ["writing","speaking"],
     ["climb the career ladder","move up the career ladder","bottom rung of the career ladder","corporate career ladder"],
     "Mentoring programmes can help junior staff climb the career ladder more quickly.",
     ["corporate ladder","promotion ladder","professional hierarchy"],
     ["climb the career ladder 是隐喻，ladder 在此不指实物"],
     "Writing Task 2: career development; Speaking Part 3: ambition"),

    ("work-045", "shift work", "轮班工作", "5.5", 67,
     ["listening","reading"],
     ["do shift work","night shift work","rotating shift work","shift work schedule"],
     "Long-term shift work can disrupt the body's natural circadian rhythms and lead to chronic health issues.",
     ["rotating work","shift-based employment","alternating shifts"],
     ["shift 的常见搭配：day/night/evening/graveyard shift"],
     "Listening Section 1: job interview; Reading: occupational health"),

    ("work-046", "minimum wage", "最低工资", "6.0", 69,
     ["writing","speaking"],
     ["raise the minimum wage","above minimum wage","statutory minimum wage","living wage vs minimum wage"],
     "Proponents argue that raising the minimum wage helps lift low-income families out of poverty.",
     ["base pay","statutory minimum","wage floor"],
     ["minimum wage 前用 the：the minimum wage（政策层面）"],
     "Writing Task 2: economic policy / poverty; Speaking Part 3: inequality"),

    ("work-047", "desk job", "文职工作", "5.5", 64,
     ["speaking","writing"],
     ["sedentary desk job","typical desk job","stuck in a desk job","leave a desk job"],
     "Having a desk job often means sitting for eight or more hours a day, which poses serious health risks.",
     ["office job","white-collar job","administrative job"],
     ["desk job 不是 desk work（后者指在办公桌上做的事）"],
     "Speaking Part 1: daily routine; Writing Task 2: health and lifestyle"),

    ("work-048", "exit interview", "离职面谈", "6.0", 55,
     ["listening","speaking"],
     ["conduct an exit interview","attend an exit interview","exit interview feedback","exit interview process"],
     "Exit interviews provide valuable insight into why employees leave and how the organization can improve.",
     ["departure interview","leaving interview","separation interview"],
     ["exit interview 是离职面谈；exit exam 是毕业考试 — 不同概念"],
     "Listening Section 3: HR discussion; Speaking Part 3: job change"),

    ("work-049", "economic inactivity", "经济不活跃", "6.5", 58,
     ["reading","listening"],
     ["rising economic inactivity","economic inactivity rate","long-term economic inactivity","reasons for economic inactivity"],
     "Economic inactivity among working-age adults has risen sharply in regions affected by industrial decline.",
     ["non-participation","labour market inactivity","economic non-engagement"],
     ["economic inactivity 不等于 unemployment：失业的人在 actively seeking work"],
     "Reading: economic analysis; Listening Section 4: economics lecture"),

    ("work-050", "manual labour", "体力劳动", "5.5", 52,
     ["reading","writing"],
     ["perform manual labour","heavy manual labour","decline in manual labour","skilled manual labour"],
     "Automation has significantly reduced the demand for manual labour in manufacturing industries.",
     ["physical labour","blue-collar work","manual work"],
     ["labour 此处不可数；作 '劳工' 义项时集合名词（不可数）"],
     "Writing Task 2: automation / employment; Reading: industrial history"),
]

# ===============================================================
# HEALTH TOPIC (49 new: health-002 to health-050)
# Distribution: 19 超高频(90-99), 18 高频(70-89), 12 中频(50-69)
# health-001 existing: score 90 (ultra-high-freq)
# ===============================================================

health_data = [
    # === 超高频 19 items (91-99): health-002 ~ health-020 ===
    ("health-002", "physical health", "身体健康", "6.0", 99,
     ["writing","speaking"],
     ["maintain physical health","benefit physical health","impact on physical health","neglect physical health"],
     "Regular exercise is essential for maintaining both physical health and mental well-being.",
     ["bodily health","physical well-being","physical fitness"],
     ["physical health 是相对 mental health 的概念；不加 s"],
     "Writing Task 2: health / lifestyle; Speaking Part 3: healthy habits"),

    ("health-003", "healthy lifestyle", "健康生活方式", "6.0", 98,
     ["writing","speaking"],
     ["adopt a healthy lifestyle","promote a healthy lifestyle","lead a healthy lifestyle","maintain a healthy lifestyle"],
     "Schools should educate children about the importance of maintaining a healthy lifestyle from an early age.",
     ["health-conscious lifestyle","wholesome lifestyle","health-promoting lifestyle"],
     ["lifestyle 可数，说 a healthy lifestyle"],
     "Writing Task 2: public health / education; Speaking Part 3: daily habits"),

    ("health-004", "sedentary lifestyle", "久坐生活方式", "6.5", 96,
     ["writing","speaking"],
     ["lead a sedentary lifestyle","associated with a sedentary lifestyle","risks of a sedentary lifestyle","increasingly sedentary lifestyle"],
     "A sedentary lifestyle has been linked to an increased risk of obesity, diabetes, and cardiovascular disease.",
     ["inactive lifestyle","sitting-based lifestyle","physically inactive lifestyle"],
     ["sedentary 发音 /ˈsednteri/，来自拉丁语 sedere（坐）"],
     "Writing Task 2: modern lifestyle / health risks; Speaking Part 3: workplace health"),

    ("health-005", "balanced diet", "均衡饮食", "5.5", 97,
     ["writing","speaking"],
     ["maintain a balanced diet","eat a balanced diet","follow a balanced diet","lack of a balanced diet"],
     "A balanced diet rich in fruits, vegetables, and whole grains is the foundation of good health.",
     ["healthy diet","nutritious diet","well-rounded diet"],
     ["balanced diet 前用 a；区别于 dietary balance（更学术）"],
     "Writing Task 2: nutrition / health education; Speaking Part 1: food / diet"),

    ("health-006", "mental disorder", "精神障碍", "6.5", 92,
     ["reading","writing"],
     ["suffer from a mental disorder","diagnose a mental disorder","common mental disorder","treat mental disorders"],
     "Depression is one of the most common mental disorders, affecting millions of people worldwide.",
     ["psychiatric disorder","mental illness","psychological disorder"],
     ["mental disorder 比 mental illness 更临床、更正式"],
     "Reading: health / psychology articles; Writing Task 2: mental health"),

    ("health-007", "public health", "公共卫生", "6.5", 98,
     ["reading","writing"],
     ["protect public health","threaten public health","public health crisis","public health policy"],
     "Vaccination programmes are one of the most effective public health interventions in history.",
     ["community health","population health","public healthcare"],
     ["public health 不加 the；泛指概念时零冠词"],
     "Reading: public health reports; Writing Task 2: government health policy"),

    ("health-008", "healthcare system", "医疗保健体系", "6.5", 95,
     ["writing","speaking"],
     ["universal healthcare system","overburdened healthcare system","reform the healthcare system","access to the healthcare system"],
     "An efficient healthcare system is essential for ensuring that all citizens receive timely medical treatment.",
     ["medical system","health system","health service"],
     ["healthcare 一个词（英式）或 health care 两个词（美式）；IELTS 两种均接受"],
     "Writing Task 2: government spending / health policy; Speaking Part 3: public services"),

    ("health-009", "chronic disease", "慢性疾病", "6.5", 93,
     ["reading","writing"],
     ["suffer from a chronic disease","manage chronic disease","prevent chronic disease","chronic disease burden"],
     "The rising prevalence of chronic diseases such as diabetes places an enormous strain on healthcare budgets.",
     ["long-term illness","chronic illness","non-communicable disease"],
     ["chronic /ˈkrɒnɪk/ 不是 acute（急性）；chronic 强调长期性"],
     "Reading: medical reports; Writing Task 2: aging population / health costs"),

    ("health-010", "life expectancy", "预期寿命", "6.5", 96,
     ["reading","writing"],
     ["increase life expectancy","average life expectancy","life expectancy has risen","longer life expectancy"],
     "Improved sanitation and medical advances have dramatically increased life expectancy over the past century.",
     ["longevity","expected lifespan","average lifespan"],
     ["life expectancy 不可数/可数均可；常用单数"],
     "Writing Task 1: demographic data; Writing Task 2: aging society"),

    ("health-011", "physical activity", "身体活动", "5.5", 94,
     ["writing","speaking"],
     ["engage in physical activity","lack of physical activity","regular physical activity","benefits of physical activity"],
     "Children should engage in at least one hour of moderate physical activity every day.",
     ["exercise","bodily activity","physical exercise"],
     ["physical activity 比 exercise 涵盖更广（包括日常活动如走路、爬楼梯）"],
     "Writing Task 2: children's health / lifestyle; Speaking Part 3: fitness"),

    ("health-012", "health insurance", "健康保险", "6.0", 91,
     ["writing","speaking"],
     ["purchase health insurance","comprehensive health insurance","lack health insurance","private health insurance"],
     "In countries without universal healthcare, health insurance is essential for accessing affordable medical care.",
     ["medical insurance","health coverage","medical coverage"],
     ["insurance 不可数；说 buy/provide/have health insurance（不加 s）"],
     "Writing Task 2: healthcare funding; Speaking Part 3: medical costs"),

    ("health-013", "obesity epidemic", "肥胖流行病", "6.5", 94,
     ["reading","writing"],
     ["tackle the obesity epidemic","combat the obesity epidemic","rising obesity epidemic","obesity epidemic among children"],
     "The obesity epidemic is driven by a combination of poor diet, sedentary lifestyles, and aggressive food marketing.",
     ["obesity crisis","overweight epidemic","weight problem epidemic"],
     ["epidemic 本义是传染病流行；比喻义为问题蔓延；obesity 发音 /əʊˈbiːsəti/"],
     "Reading: health / nutrition articles; Writing Task 2: junk food / public health"),

    ("health-014", "stress management", "压力管理", "6.0", 91,
     ["writing","speaking"],
     ["effective stress management","stress management techniques","practice stress management","poor stress management"],
     "Employers should offer stress management workshops to help employees cope with workplace pressure.",
     ["stress relief","coping strategies","stress reduction"],
     ["stress management 不是 pressure management；stress 是长期压力，pressure 是短期压力"],
     "Writing Task 2: workplace wellness; Speaking Part 3: modern life pressures"),

    ("health-015", "medical treatment", "医疗治疗", "6.0", 92,
     ["reading","listening"],
     ["receive medical treatment","seek medical treatment","access to medical treatment","delay medical treatment"],
     "Early diagnosis and prompt medical treatment significantly improve recovery outcomes for most conditions.",
     ["healthcare treatment","therapeutic treatment","clinical treatment"],
     ["treatment 可数/不可数：medical treatment（整体）/ a new treatment（具体疗法）"],
     "Reading: health articles; Listening Section 3: health center consultation"),

    ("health-016", "nutritional intake", "营养摄入", "6.5", 90,
     ["reading","writing"],
     ["adequate nutritional intake","daily nutritional intake","monitor nutritional intake","insufficient nutritional intake"],
     "Poor nutritional intake in early childhood can have lasting effects on cognitive development.",
     ["dietary intake","nutrient consumption","nutritional consumption"],
     ["nutritional 和 nutritious 不同：nutritional = 关于营养的，nutritious = 有营养的"],
     "Reading: nutrition science; Writing Task 2: children's health"),

    ("health-017", "cardiovascular disease", "心血管疾病", "6.5", 91,
     ["reading","listening"],
     ["risk of cardiovascular disease","prevent cardiovascular disease","develop cardiovascular disease","cardiovascular disease prevention"],
     "Smoking, poor diet, and physical inactivity are the leading causes of cardiovascular disease worldwide.",
     ["heart disease","CVD","coronary artery disease"],
     ["cardiovascular 来自 cardio（心脏）+ vascular（血管）"],
     "Reading: medical / health articles; Listening Section 4: health lecture"),

    ("health-018", "immune system", "免疫系统", "6.0", 93,
     ["reading","listening"],
     ["weakened immune system","strengthen the immune system","compromised immune system","boost your immune system"],
     "Adequate sleep and proper nutrition are critical for maintaining a strong immune system.",
     ["body's defences","immunological system","disease defence system"],
     ["immune 发音 /ɪˈmjuːn/；注意区别于 immune to（对...免疫）"],
     "Reading: health / biology; Listening Section 4: science lecture"),

    ("health-019", "sleep deprivation", "睡眠不足", "6.5", 93,
     ["reading","writing"],
     ["chronic sleep deprivation","suffer from sleep deprivation","effects of sleep deprivation","severe sleep deprivation"],
     "Chronic sleep deprivation impairs cognitive function and increases the risk of accidents and chronic diseases.",
     ["sleep deficiency","insufficient sleep","sleep shortage"],
     ["deprivation 不可数；动词 deprive someone of sleep"],
     "Reading: health studies; Writing Task 2: modern lifestyle / student stress"),

    ("health-020", "substance abuse", "药物滥用", "6.5", 94,
     ["reading","writing"],
     ["struggle with substance abuse","treat substance abuse","substance abuse problem","substance abuse among teenagers"],
     "Substance abuse among young people is a growing public health crisis that requires early intervention.",
     ["drug abuse","substance misuse","chemical dependency"],
     ["substance 在此义项下指药物、酒精等成瘾物质"],
     "Reading: social issues / health; Writing Task 2: youth problems"),

    # === 高频 18 items (70-89): health-021 ~ health-038 ===
    ("health-021", "health awareness", "健康意识", "6.0", 84,
     ["writing","speaking"],
     ["raise health awareness","increase health awareness","public health awareness","lack of health awareness"],
     "Health awareness campaigns have played a crucial role in reducing smoking rates across many countries.",
     ["health consciousness","wellness awareness","health literacy"],
     ["awareness 不可数；搭配 raise/increase/promote"],
     "Writing Task 2: public health campaigns; Speaking Part 3: health education"),

    ("health-022", "dietary habits", "饮食习惯", "6.0", 86,
     ["writing","speaking"],
     ["unhealthy dietary habits","improve dietary habits","poor dietary habits","develop dietary habits"],
     "Children's dietary habits formed in early years tend to persist into adulthood.",
     ["eating habits","nutritional habits","food habits"],
     ["dietary 是 diet 的形容词；发音 /ˈdaɪətəri/"],
     "Writing Task 2: nutrition / children's health; Speaking Part 1: food"),

    ("health-023", "preventive care", "预防性护理", "6.5", 79,
     ["reading","writing"],
     ["invest in preventive care","emphasize preventive care","access to preventive care","preventive care services"],
     "Investing in preventive care is far more cost-effective than treating advanced diseases.",
     ["preventive medicine","preventative care","proactive healthcare"],
     ["preventive 和 preventative 均可，preventive 更常用于学术语境"],
     "Reading: healthcare policy; Writing Task 2: government health spending"),

    ("health-024", "health screening", "健康筛查", "6.0", 75,
     ["reading","listening"],
     ["routine health screening","undergo health screening","regular health screening","national health screening programme"],
     "Regular health screening can detect diseases at an early stage when they are more treatable.",
     ["medical screening","health check-up","diagnostic screening"],
     ["screening 不可数（作过程）；screen 是可数名词/动词"],
     "Reading: medical procedures; Listening Section 3: health centre information"),

    ("health-025", "fast food consumption", "快餐消费", "6.0", 82,
     ["writing","speaking"],
     ["excessive fast food consumption","reduce fast food consumption","rise in fast food consumption","cut down on fast food consumption"],
     "The dramatic rise in fast food consumption has been linked to increasing rates of obesity and related diseases.",
     ["junk food intake","convenience food consumption","fast-food eating"],
     ["fast food 中 fast 是形容词（快的），不是动词"],
     "Writing Task 2: diet / public health; Speaking Part 1: eating habits"),

    ("health-026", "psychological counselling", "心理咨询", "6.5", 74,
     ["reading","listening"],
     ["seek psychological counselling","provide psychological counselling","access psychological counselling","benefit from psychological counselling"],
     "Universities should offer free psychological counselling services to support students' mental well-being.",
     ["mental health counselling","therapy","psychological therapy"],
     ["counselling (UK) = counseling (US)；双 l 是英式拼写"],
     "Reading: mental health services; Listening Section 3: student services"),

    ("health-027", "medical breakthrough", "医学突破", "6.0", 78,
     ["reading","listening"],
     ["major medical breakthrough","achieve a medical breakthrough","recent medical breakthrough","scientific medical breakthrough"],
     "The development of mRNA vaccines represents one of the most significant medical breakthroughs of the 21st century.",
     ["medical advance","scientific breakthrough","healthcare breakthrough"],
     ["breakthrough 可数，一个重大突破 a breakthrough"],
     "Reading: medical / science articles; Listening Section 4: scientific lecture"),

    ("health-028", "eating disorder", "进食障碍", "6.5", 76,
     ["reading","writing"],
     ["suffer from an eating disorder","develop an eating disorder","treat eating disorders","eating disorder among adolescents"],
     "Social media has been implicated in the rising prevalence of eating disorders among teenagers.",
     ["disordered eating","eating disturbance","food-related disorder"],
     ["常见 eating disorders：anorexia (厌食症), bulimia (贪食症), binge eating (暴食)"],
     "Reading: psychology / health; Writing Task 2: media influence / body image"),

    ("health-029", "health expenditure", "医疗支出", "6.5", 80,
     ["reading","writing"],
     ["rising health expenditure","government health expenditure","control health expenditure","health expenditure per capita"],
     "Rising health expenditure is a major concern for governments facing aging populations.",
     ["healthcare spending","medical expenditure","health spending"],
     ["expenditure 不可数；介词搭配 expenditure on health/education"],
     "Writing Task 1: economic data; Reading: government reports"),

    ("health-030", "fitness regimen", "健身计划", "6.0", 71,
     ["speaking","listening"],
     ["follow a fitness regimen","strict fitness regimen","maintain a fitness regimen","start a fitness regimen"],
     "Adopting a regular fitness regimen can improve both physical health and mental clarity.",
     ["exercise routine","workout plan","training regimen"],
     ["regimen /ˈredʒɪmən/ 不是 regime /reɪˈʒiːm/（政权）"],
     "Speaking Part 1: hobbies / exercise; Listening Section 1: gym membership"),

    ("health-031", "vaccination programme", "疫苗接种计划", "6.0", 85,
     ["reading","writing"],
     ["implement a vaccination programme","national vaccination programme","childhood vaccination programme","successful vaccination programme"],
     "Mass vaccination programmes have eradicated or dramatically reduced many life-threatening infectious diseases.",
     ["immunization programme","vaccination campaign","inoculation programme"],
     ["vaccination 和 immunization 常互换；vaccination 强调接种行为本身"],
     "Writing Task 2: public health policy; Reading: health reports"),

    ("health-032", "health education", "健康教育", "6.0", 83,
     ["writing","speaking"],
     ["promote health education","school-based health education","provide health education","comprehensive health education"],
     "Comprehensive health education in schools can equip children with the knowledge to make informed lifestyle choices.",
     ["public health education","wellness education","health literacy education"],
     ["health education 不可数；泛指概念前不加冠词"],
     "Writing Task 2: school curriculum / public health; Speaking Part 3: education"),

    ("health-033", "patient care", "患者护理", "6.0", 81,
     ["reading","listening"],
     ["improve patient care","quality of patient care","patient-centred care","provide patient care"],
     "Improving the quality of patient care requires adequate staffing levels and ongoing professional training.",
     ["medical care","healthcare delivery","clinical care"],
     ["patient 发音 /ˈpeɪʃnt/，不是 patience /ˈpeɪʃəns/（耐心）"],
     "Reading: healthcare management; Listening Section 4: nursing lecture"),

    ("health-034", "junk food advertising", "垃圾食品广告", "6.0", 82,
     ["writing","speaking"],
     ["ban junk food advertising","restrict junk food advertising","targeted junk food advertising","exposure to junk food advertising"],
     "Many health experts argue that junk food advertising aimed at children should be strictly regulated.",
     ["fast food advertising","unhealthy food advertising","food marketing to children"],
     ["junk food 不可数；泛指垃圾食品时不加 s"],
     "Writing Task 2: advertising / children's health; Speaking Part 3: consumer culture"),

    ("health-035", "calorie intake", "卡路里摄入", "6.0", 75,
     ["reading","writing"],
     ["reduce calorie intake","excessive calorie intake","daily calorie intake","monitor calorie intake"],
     "Reducing daily calorie intake combined with regular exercise is the most effective weight loss strategy.",
     ["caloric intake","energy intake","dietary energy consumption"],
     ["calorie 可数；常用复数 calories"],
     "Reading: nutrition / health studies; Writing Task 1: dietary data"),

    ("health-036", "mental resilience", "心理韧性", "6.5", 73,
     ["writing","speaking"],
     ["build mental resilience","develop mental resilience","lack of mental resilience","enhance mental resilience"],
     "Building mental resilience helps individuals cope effectively with stress, adversity, and life challenges.",
     ["psychological resilience","emotional resilience","mental toughness"],
     ["resilience 来自动词 resile（回弹）；发音 /rɪˈzɪliəns/"],
     "Writing Task 2: education / mental health; Speaking Part 3: coping with challenges"),

    ("health-037", "disease prevention", "疾病预防", "6.5", 87,
     ["reading","writing"],
     ["focus on disease prevention","effective disease prevention","disease prevention strategy","prioritize disease prevention"],
     "Governments should shift their healthcare focus from treatment to disease prevention through public health campaigns.",
     ["illness prevention","prevention of disease","prophylactic care"],
     ["prevention 不可数；prevention of + 名词 或 disease prevention"],
     "Writing Task 2: healthcare priorities; Reading: public health policy"),

    ("health-038", "health inequality", "健康不平等", "6.5", 77,
     ["reading","writing"],
     ["address health inequality","social health inequality","reduce health inequality","persistent health inequality"],
     "Health inequality persists between rich and poor communities even within the same city.",
     ["health disparity","health gap","health inequity"],
     ["inequality 和 inequity 的区别：inequality = 客观不平等，inequity = 不公平（有道德判断）"],
     "Reading: social medicine / public health; Writing Task 2: social justice"),

    # === 中频 12 items (50-69): health-039 ~ health-050 ===
    ("health-039", "contagious disease", "传染病", "6.0", 67,
     ["reading","listening"],
     ["spread of contagious disease","highly contagious disease","outbreak of a contagious disease","control contagious disease"],
     "Good hygiene practices are essential for preventing the spread of contagious diseases in schools and workplaces.",
     ["infectious disease","communicable disease","transmissible disease"],
     ["contagious 指接触传播；infectious 范围更广（包括空气/水传播）"],
     "Reading: public health; Listening Section 4: epidemiology lecture"),

    ("health-040", "prescription drug", "处方药", "6.0", 62,
     ["reading","listening"],
     ["take prescription drugs","over-the-counter vs prescription drugs","cost of prescription drugs","prescription drug abuse"],
     "The rising cost of prescription drugs has made essential medications unaffordable for many patients.",
     ["prescription medication","prescribed medicine","Rx drug"],
     ["prescription 拼写注意 scrip；区别于 subscription（订阅）"],
     "Reading: health economics; Listening Section 3: pharmacy consultation"),

    ("health-041", "genetic disorder", "遗传疾病", "6.5", 59,
     ["reading","listening"],
     ["inherited genetic disorder","diagnose a genetic disorder","rare genetic disorder","carrier of a genetic disorder"],
     "Advances in gene therapy offer new hope for treating previously incurable genetic disorders.",
     ["hereditary disease","congenital disorder","inherited condition"],
     ["genetic (遗传的) 和 hereditary (家族遗传) 有细微区别"],
     "Reading: medical / science articles; Listening Section 4: biology lecture"),

    ("health-042", "first aid", "急救", "5.5", 63,
     ["speaking","listening"],
     ["administer first aid","basic first aid","first aid training","first aid kit"],
     "Learning basic first aid should be a mandatory part of the school curriculum.",
     ["emergency care","immediate assistance","emergency treatment"],
     ["first aid 不加 the；不可数概念"],
     "Speaking Part 2: describe a useful skill; Listening Section 2: first aid course"),

    ("health-043", "premature death", "过早死亡", "6.5", 61,
     ["reading","writing"],
     ["prevent premature death","risk of premature death","cause premature death","reduce premature death rates"],
     "Smoking is the leading cause of preventable premature death worldwide.",
     ["early mortality","untimely death","premature mortality"],
     ["premature 发音 /ˈpremətʃə(r)/；来自 pre（前）+ mature（成熟）"],
     "Writing Task 2: smoking / public health; Reading: health statistics"),

    ("health-044", "rehabilitation centre", "康复中心", "6.0", 55,
     ["listening","reading"],
     ["attend a rehabilitation centre","drug rehabilitation centre","inpatient rehabilitation centre","referral to a rehabilitation centre"],
     "The rehabilitation centre offers comprehensive programmes for patients recovering from serious injuries or addiction.",
     ["rehab facility","recovery centre","treatment centre"],
     ["rehabilitation 常缩略为 rehab（口语）；正式写作中用全称"],
     "Listening Section 2: facility tour; Reading: health services"),

    ("health-045", "dietary supplement", "膳食补充剂", "6.0", 57,
     ["reading","listening"],
     ["take dietary supplements","natural dietary supplement","vitamin dietary supplement","use of dietary supplements"],
     "While dietary supplements can fill nutritional gaps, they are no substitute for a healthy balanced diet.",
     ["food supplement","nutritional supplement","health supplement"],
     ["supplement 不是 replacement（替代品）；supplement 是补充"],
     "Reading: nutrition / health; Listening Section 3: health advice"),

    ("health-046", "holistic approach", "整体方法", "6.5", 58,
     ["writing","speaking"],
     ["take a holistic approach","holistic approach to health","adopt a holistic approach","holistic treatment approach"],
     "A holistic approach to healthcare addresses not only physical symptoms but also mental and social factors.",
     ["comprehensive approach","integrated approach","whole-person approach"],
     ["holistic 来自 whole；发音 /həʊˈlɪstɪk/，h不发音的现象已过时"],
     "Writing Task 2: healthcare reform; Speaking Part 3: alternative medicine"),

    ("health-047", "hygiene practice", "卫生习惯", "5.5", 66,
     ["writing","speaking"],
     ["good hygiene practice","personal hygiene practice","poor hygiene practice","promote hygiene practice"],
     "Teaching children good hygiene practices from an early age helps prevent the spread of infectious diseases.",
     ["sanitary practice","cleanliness habit","hygienic behaviour"],
     ["hygiene 不可数；发音 /ˈhaɪdʒiːn/"],
     "Writing Task 2: public health / education; Speaking Part 3: health in schools"),

    ("health-048", "health indicator", "健康指标", "6.0", 53,
     ["reading","listening"],
     ["key health indicator","measure health indicators","health indicator data","vital health indicators"],
     "Life expectancy and infant mortality are two of the most commonly used health indicators.",
     ["health metric","health measure","wellness indicator"],
     ["indicator 可数；key/important indicator of + 名词"],
     "Writing Task 1: health data; Listening Section 4: public health lecture"),

    ("health-049", "quality of life", "生活质量", "6.5", 69,
     ["writing","speaking"],
     ["improve quality of life","overall quality of life","diminished quality of life","enhance quality of life"],
     "Access to green spaces and recreational facilities significantly improves residents' quality of life.",
     ["standard of living","life quality","well-being"],
     ["quality of life 缩写 QoL；注意区别于 standard of living（偏经济指标）"],
     "Writing Task 2: urban planning / healthcare; Speaking Part 3: happiness / well-being"),

    ("health-050", "addictive behaviour", "成瘾行为", "6.5", 56,
     ["reading","writing"],
     ["exhibit addictive behaviour","treat addictive behaviour","signs of addictive behaviour","compulsive addictive behaviour"],
     "Social media platforms are designed to encourage addictive behaviour and maximize user engagement.",
     ["dependency behaviour","compulsive behaviour","habit-forming behaviour"],
     ["addictive 是形容词（令人上瘾的）；addicted 是过去分词形容词（已上瘾的）"],
     "Reading: psychology / technology; Writing Task 2: social media impact"),
]

# ===============================================================
# CITY TOPIC (49 new: city-002 to city-050)
# Distribution: 20 超高频(90-99), 17 高频(70-89), 12 中频(50-69)
# city-001 existing: score 89 (high-freq)
# ===============================================================

city_data = [
    # === 超高频 20 items (91-99): city-002 ~ city-021 ===
    ("city-002", "urban development", "城市发展", "6.5", 98,
     ["writing","speaking"],
     ["rapid urban development","unsustainable urban development","plan urban development","urban development project"],
     "Rapid urban development has placed enormous pressure on existing infrastructure and public services.",
     ["city development","urban growth","metropolitan development"],
     ["urban 是形容词；泛指城市相关的。比较 city（名词）"],
     "Writing Task 2: urbanization / city planning; Speaking Part 3: hometown changes"),

    ("city-003", "traffic congestion", "交通拥堵", "6.0", 99,
     ["writing","speaking"],
     ["ease traffic congestion","severe traffic congestion","reduce traffic congestion","stuck in traffic congestion"],
     "Traffic congestion in major cities costs billions in lost productivity and contributes to air pollution.",
     ["traffic jams","gridlock","heavy traffic"],
     ["congestion 不可数；heavy/severe traffic congestion 是固定搭配"],
     "Writing Task 2: transport / urban problems; Speaking Part 1: hometown"),

    ("city-004", "public transportation system", "公共交通系统", "6.0", 96,
     ["writing","speaking"],
     ["reliable public transportation system","invest in the public transportation system","efficient public transportation system","expand the public transportation system"],
     "An efficient public transportation system is the backbone of any sustainable city.",
     ["mass transit system","public transport network","transit system"],
     ["transportation (US) = transport (UK)；IELTS 两种用法均接受"],
     "Writing Task 2: urban infrastructure; Speaking Part 3: city improvements"),

    ("city-005", "infrastructure investment", "基础设施投资", "6.5", 95,
     ["reading","writing"],
     ["increase infrastructure investment","public infrastructure investment","massive infrastructure investment","infrastructure investment project"],
     "Sustained infrastructure investment is critical for supporting economic growth and improving living standards.",
     ["capital investment","infrastructure spending","public works investment"],
     ["infrastructure 不可数；注意拼写 infra + structure"],
     "Writing Task 2: government spending; Reading: economic development"),

    ("city-006", "housing market", "住房市场", "6.0", 94,
     ["writing","speaking"],
     ["overheated housing market","affordable housing market","housing market crash","regulate the housing market"],
     "The housing market in many major cities has become increasingly unaffordable for young first-time buyers.",
     ["property market","real estate market","residential market"],
     ["housing 不可数；泛指住房；house 是可数名词"],
     "Writing Task 2: housing affordability; Speaking Part 3: cost of living"),

    ("city-007", "sustainable city", "可持续城市", "6.5", 91,
     ["writing","speaking"],
     ["build a sustainable city","design sustainable cities","sustainable city initiative","vision of a sustainable city"],
     "A sustainable city balances economic growth with environmental protection and social equity.",
     ["eco-city","green city","livable city"],
     ["sustainable 来自动词 sustain；注意 -able 后缀表示 '能够...的'"],
     "Writing Task 2: urban planning / environment; Speaking Part 3: future cities"),

    ("city-008", "city dweller", "城市居民", "6.0", 95,
     ["writing","speaking"],
     ["modern city dweller","city dwellers face challenges","majority of city dwellers","urban city dweller"],
     "City dwellers often face higher living costs but also enjoy greater access to cultural and entertainment facilities.",
     ["urban resident","city inhabitant","townspeople"],
     ["dweller 来自 dwell（居住）；city dweller 是固定搭配，不说 city liver"],
     "Writing Task 2: urban life; Speaking Part 1: hometown"),

    ("city-009", "residential area", "住宅区", "5.5", 93,
     ["speaking","listening"],
     ["quiet residential area","suburban residential area","high-density residential area","live in a residential area"],
     "The new residential area on the outskirts of the city offers more space but limited public transport links.",
     ["housing estate","neighbourhood","residential district"],
     ["residential 是 reside 的形容词形式；发音重音在 den"],
     "Speaking Part 1: accommodation; Listening Section 1: accommodation inquiry"),

    ("city-010", "urban planning", "城市规划", "6.5", 94,
     ["reading","writing"],
     ["poor urban planning","effective urban planning","urban planning policy","modern urban planning"],
     "Effective urban planning can alleviate many of the problems associated with rapid urbanization.",
     ["city planning","town planning","municipal planning"],
     ["urban planning 不加 the；泛指学科/活动"],
     "Reading: urban studies; Writing Task 2: city development"),

    ("city-011", "public facilities", "公共设施", "6.0", 92,
     ["writing","speaking"],
     ["access to public facilities","improve public facilities","lack of public facilities","invest in public facilities"],
     "Investment in public facilities such as libraries, parks, and sports centres greatly enhances community well-being.",
     ["public amenities","community facilities","civic facilities"],
     ["facilities 常用复数；指设备、设施的整体"],
     "Writing Task 2: public spending / quality of life; Speaking Part 3: community"),

    ("city-012", "commercial district", "商业区", "6.0", 90,
     ["speaking","listening"],
     ["bustling commercial district","central commercial district","modern commercial district","located in the commercial district"],
     "The commercial district has undergone significant redevelopment, attracting new businesses and shoppers.",
     ["business district","shopping district","downtown area"],
     ["commercial 发音 /kəˈmɜːʃl/；来自 commerce（商业）"],
     "Speaking Part 1: hometown; Listening Section 1: city tour information"),

    ("city-013", "green space", "绿地", "5.5", 96,
     ["writing","speaking"],
     ["preserve green space","lack of green space","create more green spaces","urban green space"],
     "Preserving urban green spaces is essential for residents' physical and mental well-being.",
     ["parkland","open space","green area"],
     ["green space 可数（a green space）也可集合名词；urban green spaces 更常用"],
     "Writing Task 2: urban environment / quality of life; Speaking Part 3: city vs countryside"),

    ("city-014", "smart city", "智慧城市", "6.5", 92,
     ["reading","writing"],
     ["develop a smart city","smart city technology","smart city initiative","build smart cities"],
     "Smart city technologies use data and sensors to improve traffic flow, energy efficiency, and public safety.",
     ["intelligent city","digital city","connected city"],
     ["smart city 新兴概念，2010年代后广泛使用"],
     "Reading: technology / urban studies; Writing Task 2: future cities"),

    ("city-015", "public amenity", "公共便利设施", "6.5", 90,
     ["reading","writing"],
     ["provide public amenities","essential public amenities","access to public amenities","investment in public amenities"],
     "Adequate public amenities such as clean water supply and sanitation are fundamental to a healthy urban environment.",
     ["public service","civic amenity","community facility"],
     ["amenity 发音 /əˈmiːnəti/；可数名词，复数 amenities 更常用"],
     "Reading: urban development reports; Writing Task 2: living standards"),

    ("city-016", "population density", "人口密度", "6.5", 97,
     ["reading","writing"],
     ["high population density","low population density","increase population density","reduce population density"],
     "High population density in city centres creates challenges for housing, transport, and public health.",
     ["population concentration","density of population","crowding level"],
     ["density 形容词形式 dense（密集的）；不说 dense population density（重复）"],
     "Writing Task 1: demographic data; Writing Task 2: urban planning"),

    ("city-017", "road network", "道路网络", "6.0", 91,
     ["reading","listening"],
     ["extensive road network","well-developed road network","expand the road network","congested road network"],
     "An efficient road network is vital for the smooth flow of goods and people within a city.",
     ["street network","highway system","transport network"],
     ["road network 中 network 可数；a road network / road networks"],
     "Reading: infrastructure; Listening Section 2: traffic report"),

    ("city-018", "city council", "市议会", "5.5", 90,
     ["speaking","listening"],
     ["local city council","city council election","city council member","run for city council"],
     "The city council has approved a new five-year plan to expand cycling lanes and pedestrian zones.",
     ["municipal council","town council","local council"],
     ["council 和 counsel 区分：council = 议会/委员会，counsel = 忠告/律师"],
     "Speaking Part 3: local government; Listening Section 2: community announcement"),

    ("city-019", "urban sprawl", "城市蔓延（无序扩张）", "6.5", 93,
     ["reading","writing"],
     ["uncontrolled urban sprawl","limit urban sprawl","consequences of urban sprawl","suburban sprawl"],
     "Urban sprawl leads to the loss of farmland, increased car dependency, and higher infrastructure costs.",
     ["suburban sprawl","urban expansion","metropolitan sprawl"],
     ["sprawl 通常带负面含义（无序扩张）；与 planned expansion（有序扩张）对比"],
     "Reading: environmental / urban studies; Writing Task 2: city development"),

    ("city-020", "downtown area", "市中心区域", "5.5", 92,
     ["speaking","listening"],
     ["bustling downtown area","downtown area attractions","shopping in the downtown area","revitalized downtown area"],
     "The downtown area has been revitalized with new shops, restaurants, and cultural venues.",
     ["city centre","town centre","central business district"],
     ["downtown 主要北美用法；city/town centre 英国用法；两者 IELTS 均可"],
     "Speaking Part 1: hometown; Listening Section 1: tourist information"),

    ("city-021", "municipal services", "市政服务", "6.5", 90,
     ["reading","writing"],
     ["provide municipal services","essential municipal services","improve municipal services","access to municipal services"],
     "Efficient municipal services such as waste collection and water supply are taken for granted in most developed cities.",
     ["council services","city services","local government services"],
     ["municipal 发音 /mjuːˈnɪsɪpl/；来自拉丁语 municipium（自治市）"],
     "Writing Task 2: local government responsibility; Reading: public administration"),

    # === 高频 17 items (70-89): city-022 ~ city-038 ===
    ("city-022", "pedestrian zone", "步行区", "6.0", 83,
     ["writing","speaking"],
     ["create pedestrian zones","car-free pedestrian zone","expand pedestrian zones","shopping pedestrian zone"],
     "Creating more pedestrian zones in city centres encourages walking, reduces pollution, and boosts local businesses.",
     ["pedestrian area","walking zone","car-free area"],
     ["pedestrian 拼写注意 pedes-，来自拉丁语 pes（脚）"],
     "Writing Task 2: urban design / environment; Speaking Part 3: city improvements"),

    ("city-023", "rush hour", "高峰时段", "5.5", 88,
     ["speaking","listening"],
     ["during rush hour","morning rush hour","avoid the rush hour","rush hour traffic"],
     "The city's metro system carries over a million commuters during the morning rush hour alone.",
     ["peak hour","peak time","busy hour"],
     ["rush hour 可数；during the rush hour 或 during rush hour 均可"],
     "Speaking Part 1: daily routine; Listening Section 1: travel schedule"),

    ("city-024", "housing shortage", "住房短缺", "6.0", 84,
     ["writing","speaking"],
     ["severe housing shortage","acute housing shortage","address the housing shortage","chronic housing shortage"],
     "A severe housing shortage in major cities has pushed property prices and rents to record levels.",
     ["housing crisis","housing deficit","lack of housing"],
     ["shortage 可数；a shortage of + 名词 / housing shortage"],
     "Writing Task 2: housing policy / urbanization; Speaking Part 3: cost of living"),

    ("city-025", "metropolitan area", "大都市区域", "6.0", 82,
     ["reading","listening"],
     ["greater metropolitan area","in the metropolitan area","wider metropolitan area","metropolitan area population"],
     "The greater metropolitan area now extends over 100 kilometres from the original city centre.",
     ["conurbation","metro area","urban agglomeration"],
     ["metropolitan 发音 /ˌmetrəˈpɒlɪtən/；metropolis = 大都市"],
     "Reading: urban geography; Listening Section 2: regional news"),

    ("city-026", "traffic regulation", "交通管制", "6.0", 76,
     ["reading","listening"],
     ["enforce traffic regulations","strict traffic regulation","violate traffic regulations","obey traffic regulations"],
     "Strict traffic regulations combined with heavy fines have significantly reduced road accidents in the city.",
     ["traffic law","traffic rule","road regulation"],
     ["regulation 常用复数 regulations；traffic regulation 作为系统概念时可用单数"],
     "Reading: urban management; Listening Section 2: traffic announcement"),

    ("city-027", "street vendor", "街头小贩", "5.5", 78,
     ["speaking","listening"],
     ["licensed street vendor","illegal street vendor","street vendor selling food","ban street vendors"],
     "Street vendors add vibrancy to city life but also pose challenges for sanitation and traffic management.",
     ["hawker","street seller","market stall trader"],
     ["vendor 发音 /ˈvendə(r)/；来自拉丁语 vendere（卖）"],
     "Speaking Part 3: city life / informal economy; Listening Section 1: city walk"),

    ("city-028", "urban infrastructure", "城市基础设施", "6.5", 86,
     ["reading","writing"],
     ["aging urban infrastructure","invest in urban infrastructure","improve urban infrastructure","urban infrastructure project"],
     "Aging urban infrastructure in many older cities requires massive investment to meet modern standards.",
     ["city infrastructure","municipal infrastructure","metropolitan infrastructure"],
     ["infrastructure 不可数；常用搭配：critical / essential infrastructure"],
     "Reading: urban development; Writing Task 2: government investment"),

    ("city-029", "urban regeneration", "城市更新", "6.5", 79,
     ["reading","writing"],
     ["undergo urban regeneration","urban regeneration project","urban regeneration scheme","fund urban regeneration"],
     "Urban regeneration projects have transformed derelict industrial areas into vibrant residential and cultural quarters.",
     ["urban renewal","city revitalization","urban redevelopment"],
     ["regeneration 来自 re（重新）+ generate（生成）；不可数"],
     "Reading: urban studies; Writing Task 2: city development"),

    ("city-030", "shopping mall", "购物中心", "5.5", 81,
     ["speaking","listening"],
     ["huge shopping mall","visit the shopping mall","shopping mall complex","out-of-town shopping mall"],
     "The rise of online shopping has threatened the traditional business model of large shopping malls.",
     ["shopping centre","retail centre","mall"],
     ["mall 发音 /mɔːl/ 或 /mæl/（美式）"],
     "Speaking Part 1: leisure / shopping; Listening Section 1: directions"),

    ("city-031", "bicycle lane", "自行车道", "5.5", 80,
     ["writing","speaking"],
     ["dedicated bicycle lane","build more bicycle lanes","separated bicycle lane","network of bicycle lanes"],
     "Investing in safe bicycle lanes encourages more people to cycle, reducing both congestion and pollution.",
     ["cycle lane","bike lane","cycling path"],
     ["bicycle 可缩写为 bike；lane 强调道路上的划线车道"],
     "Writing Task 2: green transport; Speaking Part 3: city transport"),

    ("city-032", "living standard", "生活水平", "6.0", 87,
     ["writing","speaking"],
     ["improve living standards","high living standard","declining living standard","raise living standards"],
     "Good urban planning can significantly improve living standards for all city residents.",
     ["standard of living","quality of life","living condition"],
     ["living standards（复数）比 living standard（单数）更常用"],
     "Writing Task 2: urban quality of life; Speaking Part 3: city vs countryside"),

    ("city-033", "commuting distance", "通勤距离", "5.5", 74,
     ["speaking","writing"],
     ["long commuting distance","average commuting distance","reduce commuting distance","acceptable commuting distance"],
     "Long commuting distances are a major source of stress and reduced leisure time for city workers.",
     ["travel distance to work","journey distance","commute length"],
     ["commute 作名词可数；a long commute / my daily commute"],
     "Speaking Part 1: daily routine; Writing Task 2: work-life balance"),

    ("city-034", "public security", "公共安全", "6.0", 79,
     ["reading","listening"],
     ["ensure public security","threaten public security","maintain public security","public security concern"],
     "The installation of CCTV cameras has been justified on the grounds of improving public security.",
     ["public safety","public order","civic security"],
     ["security 和 safety 区别：security 强调免受故意伤害，safety 强调免受意外伤害"],
     "Reading: urban crime; Listening Section 3: city council debate"),

    ("city-035", "street lighting", "街道照明", "5.5", 72,
     ["speaking","listening"],
     ["adequate street lighting","poor street lighting","improve street lighting","energy-efficient street lighting"],
     "Better street lighting has been demonstrated to reduce crime rates and improve pedestrian safety at night.",
     ["road lighting","public lighting","street illumination"],
     ["lighting 不可数；street lights 指具体的灯（可数）"],
     "Speaking Part 3: neighbourhood safety; Listening Section 1: complaint"),

    ("city-036", "rental market", "租赁市场", "6.0", 83,
     ["writing","speaking"],
     ["competitive rental market","tight rental market","regulation of the rental market","booming rental market"],
     "The rental market in the city has become so competitive that prospective tenants routinely offer above the asking price.",
     ["lettings market","tenancy market","housing rental market"],
     ["rental 可作形容词（租赁的）或名词（租金）"],
     "Writing Task 2: housing policy; Speaking Part 3: housing challenges"),

    ("city-037", "urban migration", "城市迁移（人口向城市流动）", "6.5", 80,
     ["reading","writing"],
     ["rural-to-urban migration","mass urban migration","drive urban migration","rapid urban migration"],
     "Rural-to-urban migration has accelerated in developing countries as people seek better employment opportunities.",
     ["urbanization","rural-urban drift","internal migration to cities"],
     ["migration 是不可数名词（作为过程）或集合名词"],
     "Reading: demographic studies; Writing Task 2: urbanization causes / effects"),

    ("city-038", "civic engagement", "公民参与", "6.5", 71,
     ["reading","writing"],
     ["promote civic engagement","increase civic engagement","lack of civic engagement","community civic engagement"],
     "Higher levels of civic engagement are associated with stronger communities and more responsive local government.",
     ["citizen participation","community involvement","public participation"],
     ["civic 是 civil 的同源词；civic 强调城市/公民事务，civil 更广泛"],
     "Reading: social studies / urban sociology; Writing Task 2: community / democracy"),

    # === 中频 12 items (50-69): city-039 ~ city-050 ===
    ("city-039", "parking space", "停车位", "5.5", 68,
     ["speaking","listening"],
     ["limited parking space","shortage of parking spaces","find a parking space","designated parking space"],
     "The shortage of parking spaces in the city centre has led to higher charges and increased use of public transport.",
     ["parking spot","parking bay","car park space"],
     ["parking space 可数；注意不要与 parking lot（停车场整体）混淆"],
     "Speaking Part 1: driving / transport; Listening Section 1: directions"),

    ("city-040", "residential building", "住宅楼", "5.5", 67,
     ["speaking","listening"],
     ["high-rise residential building","modern residential building","residential building complex","new residential building"],
     "The city has approved the construction of several new high-rise residential buildings to address the housing shortage.",
     ["apartment building","housing block","dwelling"],
     ["residential 和 residence 区分：residence 是名词（住所），residential 是形容词"],
     "Speaking Part 1: accommodation; Listening Section 1: property viewing"),

    ("city-041", "landfill site", "垃圾填埋场", "6.0", 58,
     ["reading","listening"],
     ["designate a landfill site","overflowing landfill site","close a landfill site","waste to landfill site"],
     "As landfill sites reach capacity, cities must invest in recycling and waste-to-energy technologies.",
     ["rubbish dump","waste disposal site","garbage dump"],
     ["landfill 一个词；可数（指场地）或不可数（指处理方式）"],
     "Reading: waste management; Listening Section 4: environmental lecture"),

    ("city-042", "traffic violation", "交通违规", "5.5", 64,
     ["speaking","listening"],
     ["commit a traffic violation","minor traffic violation","traffic violation fine","repeat traffic violation"],
     "Installing more traffic cameras has led to a significant decrease in traffic violations at major intersections.",
     ["traffic offence","traffic infraction","driving violation"],
     ["violation 来自动词 violate；可数名词"],
     "Speaking Part 3: road safety; Listening Section 2: police announcement"),

    ("city-043", "urban landscape", "城市景观", "6.0", 62,
     ["writing","speaking"],
     ["transforming urban landscape","modern urban landscape","dominate the urban landscape","changing urban landscape"],
     "The proliferation of high-rise buildings has fundamentally altered the urban landscape of many Asian cities.",
     ["cityscape","townscape","urban scenery"],
     ["landscape 可数；the urban landscape 指城市总体面貌"],
     "Writing Task 1: describing places; Speaking Part 3: hometown changes"),

    ("city-044", "heritage site", "遗产地", "6.0", 60,
     ["reading","listening"],
     ["protect a heritage site","UNESCO World Heritage site","cultural heritage site","preserve heritage sites"],
     "The city's historic district has been designated a UNESCO World Heritage site, attracting millions of tourists annually.",
     ["historic site","cultural site","listed site"],
     ["heritage 不可数；a World Heritage site（可数，指具体地点）"],
     "Reading: tourism / culture; Listening Section 2: guided tour information"),

    ("city-045", "drainage system", "排水系统", "6.0", 56,
     ["reading","listening"],
     ["inadequate drainage system","improve the drainage system","urban drainage system","blocked drainage system"],
     "Flash flooding in the city is largely due to an outdated drainage system unable to cope with heavy rainfall.",
     ["sewer system","stormwater system","wastewater system"],
     ["drainage 来自 drain（排水）；发音 /ˈdreɪnɪdʒ/"],
     "Reading: urban infrastructure; Listening Section 4: civil engineering lecture"),

    ("city-046", "garbage disposal", "垃圾处理", "5.5", 65,
     ["writing","speaking"],
     ["proper garbage disposal","illegal garbage disposal","municipal garbage disposal","garbage disposal problem"],
     "Improper garbage disposal in rapidly growing cities poses serious health and environmental risks.",
     ["waste disposal","rubbish disposal","trash disposal"],
     ["garbage (US) / rubbish (UK) / waste（正式）；IELTS 三种均可"],
     "Writing Task 2: waste management; Speaking Part 3: environmental problems"),

    ("city-047", "noise complaint", "噪音投诉", "5.5", 52,
     ["speaking","listening"],
     ["file a noise complaint","noise complaint from residents","deal with noise complaints","repeated noise complaint"],
     "The council receives hundreds of noise complaints each year, mostly relating to late-night bars and construction work.",
     ["noise grievance","sound complaint","noise nuisance report"],
     ["complaint 是名词（投诉），complain 是动词；complaint about + 噪音来源"],
     "Speaking Part 3: neighbourhood problems; Listening Section 1: complaint form"),

    ("city-048", "pedestrian crossing", "人行横道", "5.5", 54,
     ["speaking","listening"],
     ["designated pedestrian crossing","use the pedestrian crossing","safe pedestrian crossing","zebra pedestrian crossing"],
     "Installing more signal-controlled pedestrian crossings near schools has improved safety for children.",
     ["crosswalk","zebra crossing","foot crossing"],
     ["crossing (UK) 和 crosswalk (US)；IELTS 均可使用"],
     "Speaking Part 1: neighbourhood; Listening Section 1: giving directions"),

    ("city-049", "public art installation", "公共艺术装置", "6.0", 51,
     ["speaking","listening"],
     ["commission a public art installation","temporary public art installation","controversial public art installation","outdoor public art installation"],
     "Public art installations can transform neglected urban spaces and foster a sense of community identity.",
     ["street art","civic art","urban sculpture"],
     ["installation 可数；指具体艺术作品时 a public art installation"],
     "Speaking Part 3: culture / public spaces; Listening Section 2: city festival"),

    ("city-050", "real estate developer", "房地产开发商", "6.0", 57,
     ["reading","writing"],
     ["commercial real estate developer","property developer","private real estate developer","real estate developer profits"],
     "Real estate developers have been accused of prioritizing profits over community needs and environmental considerations.",
     ["property developer","land developer","housing developer"],
     ["real estate 为美式英语；英式用 property；IELTS 均可"],
     "Reading: business / urban development; Writing Task 2: housing / economy"),
]


# ===============================================================
# Build chunk objects from tuples
# ===============================================================

def build_chunks(data, topic):
    result = []
    for item in data:
        cid, word, trans, band, freq, modules, collocs, example, syns, mistakes, context = item
        result.append(make_chunk(
            cid=cid, word=word, translation=trans, band=band, freq=freq,
            topics=[topic], modules=modules,
            collocations=collocs, example=example, synonyms=syns,
            mistakes=mistakes, context=context
        ))
    return result


new_work = build_chunks(work_data, "work")
new_health = build_chunks(health_data, "health")
new_city = build_chunks(city_data, "city")

print(f"Generated: {len(new_work)} work, {len(new_health)} health, {len(new_city)} city chunks")

# ===============================================================
# Verify frequency distribution
# ===============================================================

def verify_freq(chunks_list, topic_name):
    ultra = [c for c in chunks_list if c["frequency_score"] >= 90]
    high = [c for c in chunks_list if 70 <= c["frequency_score"] <= 89]
    mid = [c for c in chunks_list if 50 <= c["frequency_score"] <= 69]
    print(f"\n{topic_name} frequency distribution:")
    print(f"  超高频 (90-99): {len(ultra)}")
    print(f"  高频 (70-89): {len(high)}")
    print(f"  中频 (50-69): {len(mid)}")
    # Check for any scores outside expected ranges
    others = [c for c in chunks_list if c["frequency_score"] < 50 or c["frequency_score"] > 99]
    if others:
        print(f"  WARNING: chunks outside 50-99 range: {[(c['id'], c['frequency_score']) for c in others]}")
    # Check for duplicate IDs
    ids = [c["id"] for c in chunks_list]
    if len(ids) != len(set(ids)):
        from collections import Counter
        dupes = [i for i, cnt in Counter(ids).items() if cnt > 1]
        print(f"  WARNING: duplicate IDs: {dupes}")
    # Check modules distribution
    mod_count = {}
    for c in chunks_list:
        for m in c["modules"]:
            mod_count[m] = mod_count.get(m, 0) + 1
    print(f"  Module mentions: {mod_count}")
    return True


verify_freq(new_work, "Work")
verify_freq(new_health, "Health")
verify_freq(new_city, "City")

# ===============================================================
# Combine with existing and verify overall
# ===============================================================

all_chunks = chunks + new_work + new_health + new_city

# Count totals per topic
topic_total = {}
for c in all_chunks:
    for t in c["topics"]:
        topic_total[t] = topic_total.get(t, 0) + 1
print(f"\nOverall topic counts: {topic_total}")

# Count by ID prefix
prefix_count = {}
for c in all_chunks:
    prefix = c["id"].split("-")[0]
    prefix_count[prefix] = prefix_count.get(prefix, 0) + 1
print(f"Counts by prefix: {prefix_count}")

# Verify all fields present
required_fields = ["id","word","translation","part_of_speech","band_level","frequency_score",
                   "topics","modules","collocations","example_sentence","synonyms",
                   "common_mistakes","ielts_context"]
for i, c in enumerate(all_chunks):
    missing = [f for f in required_fields if f not in c]
    if missing:
        print(f"ERROR: chunk {c.get('id', f'index {i}')} missing fields: {missing}")

print(f"\nTotal chunks: {len(all_chunks)}")

# ===============================================================
# Write output
# ===============================================================

with open(DATA_PATH, "w", encoding="utf-8") as f:
    json.dump(all_chunks, f, ensure_ascii=False, indent=2)

print(f"\nWritten {len(all_chunks)} chunks to {DATA_PATH}")
