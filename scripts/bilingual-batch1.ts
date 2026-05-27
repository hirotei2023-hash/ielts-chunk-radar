// 第 1 批缺失双语数据 (word → bilingual)，共 38 条
// 由 Claude 生成，用于 bilingual-db.json
export const BATCH1: Record<string, {
  pronunciation: string;
  collocations_cn: string[];
  example_sentence_cn: string;
  synonyms_cn: string[];
}> = {
  "lifelong learning": {
    pronunciation: "/ˌlaɪf.lɒŋ ˈlɜː.nɪŋ/",
    collocations_cn: ["促进终身学习", "拥抱终身学习", "终身学习习惯", "终身学习文化"],
    example_sentence_cn: "在当今快速变化的就业市场中，终身学习已成为职业发展的必要条件。",
    synonyms_cn: ["持续学习", "持续教育", "终身教育"],
  },
  "education reform": {
    pronunciation: "/ˌedʒ.ʊˈkeɪ.ʃən rɪˈfɔːm/",
    collocations_cn: ["实施教育改革", "全面教育改革", "教育改革政策", "呼吁教育改革"],
    example_sentence_cn: "迫切需要进行教育改革，使学生掌握数字素养等21世纪技能。",
    synonyms_cn: ["教育改革", "学校改革", "课程改革"],
  },
  "peer pressure": {
    pronunciation: "/pɪə ˈpreʃ.ər/",
    collocations_cn: ["屈服于同侪压力", "消极的同侪压力", "应对同侪压力", "同侪压力的影响"],
    example_sentence_cn: "青少年常常因社交圈中强烈的同侪压力而参与冒险行为。",
    synonyms_cn: ["同侪影响", "社交压力", "群体压力"],
  },
  "learning environment": {
    pronunciation: "/ˈlɜː.nɪŋ ɪnˈvaɪ.rən.mənt/",
    collocations_cn: ["有益的学习环境", "支持性学习环境", "营造积极的学习环境", "包容性学习环境"],
    example_sentence_cn: "一个支持性的学习环境对于学生充分发挥潜力至关重要。",
    synonyms_cn: ["教育环境", "学习氛围", "学术环境"],
  },
  "educational opportunity": {
    pronunciation: "/ˌedʒ.ʊˈkeɪ.ʃən.əl ˌɒp.əˈtjuː.nə.ti/",
    collocations_cn: ["平等的教育机会", "扩大教育机会", "获得教育机会", "有限的教育机会"],
    example_sentence_cn: "在线学习平台为偏远地区的学生扩大了教育机会。",
    synonyms_cn: ["学习机会", "受教育机会", "教育准入"],
  },
  "rote memorization": {
    pronunciation: "/rəʊt ˌmem.ə.raɪˈzeɪ.ʃən/",
    collocations_cn: ["依赖死记硬背", "不鼓励死记硬背", "死记硬背的方法", "超越死记硬背"],
    example_sentence_cn: "传统的应试教育往往过分强调死记硬背而非理解。",
    synonyms_cn: ["机械记忆", "死记", "强记"],
  },
  "scholarship program": {
    pronunciation: "/ˈskɒl.ə.ʃɪp ˈprəʊ.ɡræm/",
    collocations_cn: ["申请奖学金项目", "授予奖学金", "基于成绩的奖学金", "全额资助的奖学金项目"],
    example_sentence_cn: "该大学提供一系列奖学金项目以吸引有才华的国际学生。",
    synonyms_cn: ["助学金项目", "资助计划", "奖学金"],
  },
  "literacy rate": {
    pronunciation: "/ˈlɪt.ər.ə.si reɪt/",
    collocations_cn: ["提高识字率", "成人识字率", "高识字率", "全国识字率"],
    example_sentence_cn: "过去几十年来，发展中国家在提高识字率方面取得了显著进展。",
    synonyms_cn: ["阅读能力", "识字人口比例", "教育程度指标"],
  },
  "academic integrity": {
    pronunciation: "/ˌæk.əˈdem.ɪk ɪnˈteɡ.rə.ti/",
    collocations_cn: ["维护学术诚信", "违反学术诚信", "学术诚信政策", "保持学术诚信"],
    example_sentence_cn: "大学必须执行严格的政策来维护学术诚信并防止抄袭行为。",
    synonyms_cn: ["学术诚实", "学术道德", "学术正直"],
  },
  "dropout rate": {
    pronunciation: "/ˈdrɒp.aʊt reɪt/",
    collocations_cn: ["高辍学率", "降低辍学率", "学校辍学率", "大学辍学率"],
    example_sentence_cn: "农村地区的高辍学率主要是由贫困和教育资源匮乏造成的。",
    synonyms_cn: ["流失率", "未完成率", "退学率"],
  },
  "educational resources": {
    pronunciation: "/ˌedʒ.ʊˈkeɪ.ʃən.əl rɪˈzɔː.sɪz/",
    collocations_cn: ["分配教育资源", "缺乏教育资源", "教育资源的公平分配", "数字教育资源"],
    example_sentence_cn: "城乡之间教育资源分配不均仍然是一个紧迫的问题。",
    synonyms_cn: ["学习资源", "教学资源", "学术资源"],
  },
  "classroom interaction": {
    pronunciation: "/ˈklɑːs.ruːm ˌɪn.tərˈæk.ʃən/",
    collocations_cn: ["鼓励课堂互动", "促进课堂互动", "有意义的课堂互动", "课堂互动模式"],
    example_sentence_cn: "教师应鼓励更多的课堂互动，帮助学生培养沟通能力。",
    synonyms_cn: ["课堂参与", "师生互动", "课堂投入"],
  },
  "hands-on experience": {
    pronunciation: "/ˌhændz ˈɒn ɪkˈspɪə.ri.əns/",
    collocations_cn: ["获得实践经验", "宝贵的实践经验", "提供实践经验", "实用的实践经验"],
    example_sentence_cn: "实习为学生提供了在课堂上无法获得的宝贵实践经验。",
    synonyms_cn: ["实际经验", "实战经验", "体验式学习"],
  },
  "standardized testing": {
    pronunciation: "/ˈstæn.də.daɪzd ˈtes.tɪŋ/",
    collocations_cn: ["依赖标准化考试", "对标准化考试的批评", "标准化考试体系", "标准化考试成绩"],
    example_sentence_cn: "批评者认为标准化考试无法衡量创造力和批判性思维能力。",
    synonyms_cn: ["标准化评估", "统一考试", "常模参照测试"],
  },
  "academic research": {
    pronunciation: "/ˌæk.əˈdem.ɪk rɪˈsɜːtʃ/",
    collocations_cn: ["进行学术研究", "同行评审的学术研究", "学术研究论文", "学术研究成果"],
    example_sentence_cn: "政府对学术研究的资助对科学和技术进步至关重要。",
    synonyms_cn: ["学术研究", "科学调查", "学术探究"],
  },
  "educational background": {
    pronunciation: "/ˌedʒ.ʊˈkeɪ.ʃən.əl ˈbæk.ɡraʊnd/",
    collocations_cn: ["学术和教育背景", "多元化的教育背景", "教育背景信息", "无论教育背景如何"],
    example_sentence_cn: "来自不同教育背景的申请者为该课程带来了独特的视角。",
    synonyms_cn: ["学术背景", "学历背景", "教育经历"],
  },
  "tertiary education": {
    pronunciation: "/ˈtɜː.ʃər.i ˌedʒ.ʊˈkeɪ.ʃən/",
    collocations_cn: ["接受高等教育", "高等教育的入学机会", "高等教育部门", "高等教育机构"],
    example_sentence_cn: "投资高等教育对于一个国家的长期经济竞争力至关重要。",
    synonyms_cn: ["高等教育", "中学后教育", "大学教育"],
  },
  "academic excellence": {
    pronunciation: "/ˌæk.əˈdem.ɪk ˈek.səl.əns/",
    collocations_cn: ["追求学术卓越", "追求卓越学术", "学术卓越奖", "学术卓越标准"],
    example_sentence_cn: "这所学校在过去三十年中建立了学术卓越的声誉。",
    synonyms_cn: ["学术杰出", "教育卓越", "学术优异"],
  },
  "student enrollment": {
    pronunciation: "/ˈstjuː.dənt ɪnˈrəʊl.mənt/",
    collocations_cn: ["入学人数增长", "入学人数下降", "入学人数数据", "总入学人数"],
    example_sentence_cn: "自推出在线课程以来，该大学的入学人数稳步增长。",
    synonyms_cn: ["学生录取", "注册人数", "招生人数"],
  },
  "intellectual development": {
    pronunciation: "/ˌɪn.təlˈek.tʃu.əl dɪˈvel.əp.mənt/",
    collocations_cn: ["支持智力发展", "儿童的智力发展", "促进智力发展", "智力发展理论"],
    example_sentence_cn: "基于游戏的学习已被证明能支持幼儿的智力发展。",
    synonyms_cn: ["认知发展", "心智成长", "智力成长"],
  },
  "academic discipline": {
    pronunciation: "/ˌæk.əˈdem.ɪk ˈdɪs.ə.plɪn/",
    collocations_cn: ["核心学科", "跨学科", "各学科", "传统学科"],
    example_sentence_cn: "跨越多个学科的跨学科研究正变得越来越普遍。",
    synonyms_cn: ["研究领域", "学科领域", "学术领域"],
  },
  "educational attainment": {
    pronunciation: "/ˌedʒ.ʊˈkeɪ.ʃən.əl əˈteɪn.mənt/",
    collocations_cn: ["教育程度水平", "高教育程度", "教育程度差距", "衡量教育程度"],
    example_sentence_cn: "教育程度与终身收入之间存在很强的相关性。",
    synonyms_cn: ["教育成就", "学业成就", "教育水平"],
  },
  "learning curve": {
    pronunciation: "/ˈlɜː.nɪŋ kɜːv/",
    collocations_cn: ["陡峭的学习曲线", "可控的学习曲线", "学习曲线理论", "克服学习曲线"],
    example_sentence_cn: "学习一门新语言起初学习曲线很陡峭，但坚持练习会变得更容易。",
    synonyms_cn: ["学习轨迹", "技能习得速度", "适应期"],
  },
  "formative assessment": {
    pronunciation: "/ˈfɔːr.mə.tɪv əˈses.mənt/",
    collocations_cn: ["进行形成性评价", "形成性评价策略", "形成性与终结性评价", "持续的形成性评价"],
    example_sentence_cn: "形成性评价提供持续反馈，帮助学生在整个学习过程中不断改进。",
    synonyms_cn: ["持续性评估", "过程性评价", "诊断性评估"],
  },
  "educational equity": {
    pronunciation: "/ˌedʒ.ʊˈkeɪ.ʃən.əl ˈek.wɪ.ti/",
    collocations_cn: ["促进教育公平", "确保教育公平", "教育公平政策", "教育公平问题"],
    example_sentence_cn: "确保教育公平仍然是发展中国家面临的最大挑战之一。",
    synonyms_cn: ["教育平等", "平等的教育机会", "教育公正"],
  },
  "boarding school": {
    pronunciation: "/ˈbɔː.dɪŋ skuːl/",
    collocations_cn: ["就读寄宿学校", "寄宿学校教育", "传统寄宿学校", "寄宿学校经历"],
    example_sentence_cn: "一些家长认为寄宿学校教育能培养孩子的独立性和自律能力。",
    synonyms_cn: ["寄宿制学校", "住宿学校", "住校学校"],
  },
  "self-directed learning": {
    pronunciation: "/ˌself dɪˈrek.tɪd ˈlɜː.nɪŋ/",
    collocations_cn: ["鼓励自主学习", "自主学习技能", "独立自主学习", "促进自主学习"],
    example_sentence_cn: "在线课程需要较强的自主学习技能，因为教师的监督很少。",
    synonyms_cn: ["自主学习", "自定进度学习", "独立学习"],
  },
  "intellectual curiosity": {
    pronunciation: "/ˌɪn.təlˈek.tʃu.əl ˌkjʊə.riˈɒs.ɪ.ti/",
    collocations_cn: ["激发求知欲", "培养求知欲", "求知欲与创造力", "天生的求知欲"],
    example_sentence_cn: "优秀的教师知道如何通过引人入胜的课程激发学生的求知欲。",
    synonyms_cn: ["好奇心", "求知渴望", "学习好奇心"],
  },
  "mixed-ability class": {
    pronunciation: "/ˌmɪkst əˈbɪl.ə.ti klɑːs/",
    collocations_cn: ["教授混合能力班", "混合能力班的挑战", "在混合能力班中", "管理混合能力班"],
    example_sentence_cn: "教授混合能力班需要差异化教学以满足每个学生的需求。",
    synonyms_cn: ["异质班级", "多层次班级", "混合水平组"],
  },
  "academic pressure": {
    pronunciation: "/ˌæk.əˈdem.ɪk ˈpreʃ.ər/",
    collocations_cn: ["巨大的学业压力", "应对学业压力", "承受学业压力", "日益增加的学业压力"],
    example_sentence_cn: "许多学生因来自家长和学校的巨大学习压力而遭受焦虑和抑郁的困扰。",
    synonyms_cn: ["学习压力", "教育压力", "考试压力"],
  },
  "learning disability": {
    pronunciation: "/ˈlɜː.nɪŋ ˌdɪs.əˈbɪl.ə.ti/",
    collocations_cn: ["被诊断有学习障碍", "有学习障碍的学生", "特定学习障碍", "克服学习障碍"],
    example_sentence_cn: "有学习障碍的学生需要量身定制的支持才能在主流教育中取得成功。",
    synonyms_cn: ["学习困难", "学习障碍", "特殊教育需求"],
  },
  "educational philosophy": {
    pronunciation: "/ˌedʒ.ʊˈkeɪ.ʃən.əl fɪˈlɒs.ə.fi/",
    collocations_cn: ["教育理念强调", "进步主义教育理念", "采用教育理念", "传统教育理念"],
    example_sentence_cn: "蒙台梭利的教育理念强调动手学习和自主活动。",
    synonyms_cn: ["教学理念", "教育方法", "教育思想"],
  },
  "educational subsidy": {
    pronunciation: "/ˌedʒ.ʊˈkeɪ.ʃən.əl ˈsʌb.sɪ.di/",
    collocations_cn: ["政府教育补贴", "获得教育补贴", "教育补贴计划", "提供教育补贴"],
    example_sentence_cn: "政府教育补贴可以帮助缩小贫困学生与富裕学生之间的差距。",
    synonyms_cn: ["教育补助金", "学费补贴", "助学金"],
  },
  "climate change": {
    pronunciation: "/ˈklaɪ.mət tʃeɪndʒ/",
    collocations_cn: ["应对气候变化", "解决气候变化问题", "气候变化的影响", "气候变化适应"],
    example_sentence_cn: "气候变化对世界各地的生态系统和人类社会构成了前所未有的威胁。",
    synonyms_cn: ["全球变暖", "气候变迁", "气候危机"],
  },
  "greenhouse gas": {
    pronunciation: "/ˈɡriːn.haʊs ɡæs/",
    collocations_cn: ["排放温室气体", "减少温室气体排放", "温室效应", "主要温室气体"],
    example_sentence_cn: "二氧化碳是导致全球变暖的最主要温室气体。",
    synonyms_cn: ["吸热气体", "大气污染物", "二氧化碳当量"],
  },
  "environmental degradation": {
    pronunciation: "/ɪnˌvaɪ.rənˈmen.təl ˌdeɡ.rəˈdeɪ.ʃən/",
    collocations_cn: ["造成环境退化", "防止环境退化", "严重的环境退化", "应对环境退化"],
    example_sentence_cn: "不受控制的工业扩张已导致许多地区严重的环境退化。",
    synonyms_cn: ["环境破坏", "生态恶化", "环境恶化"],
  },
  "conservation efforts": {
    pronunciation: "/ˌkɒn.səˈveɪ.ʃən ˈef.əts/",
    collocations_cn: ["支持保护工作", "野生动物保护工作", "保护工作旨在", "加强保护工作"],
    example_sentence_cn: "国际合作对于跨国界有效的野生动物保护工作至关重要。",
    synonyms_cn: ["保护倡议", "保护措施", "保护计划"],
  },
  "deforestation rate": {
    pronunciation: "/diːˌfɒr.ɪˈsteɪ.ʃən reɪt/",
    collocations_cn: ["惊人的森林砍伐率", "降低森林砍伐率", "快速的森林砍伐率", "减缓森林砍伐率"],
    example_sentence_cn: "亚马逊雨林惊人的森林砍伐率已引起全球的严重关注。",
    synonyms_cn: ["森林清除率", "森林损失率", "树木覆盖损失"],
  },
};
