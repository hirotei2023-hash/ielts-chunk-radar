// scripts/enrich-chunks.ts
// 为 data/chunks.json 中的 300 个词块生成双语字段
// 用法: npx tsx scripts/enrich-chunks.ts
// 设置环境变量 LLM_API_KEY, LLM_BASE_URL (可选), LLM_MODEL (可选) 来使用 LLM 模式
// 否则使用内置词典模式

import fs from "fs";
import path from "path";

const CHUNKS_PATH = path.resolve(__dirname, "../data/chunks.json");

interface Chunk {
  id: string;
  word: string;
  translation: string;
  part_of_speech: string;
  band_level: string;
  frequency_score: number;
  topics: string[];
  modules: string[];
  collocations: string[];
  example_sentence: string;
  synonyms: string[];
  common_mistakes: string[];
  ielts_context: string;
  pronunciation?: string;
  collocations_cn?: string[];
  example_sentence_cn?: string;
  synonyms_cn?: string[];
}

// ============================================================
// IPA 音标词典 — 常见 IELTS 词汇发音
// ============================================================
const IPA_MAP: Record<string, string> = {
  "academic performance": "/ˌæk.əˈdem.ɪk pərˈfɔːr.məns/",
  "higher education": "/ˈhaɪ.ər ˌedʒ.ʊˈkeɪ.ʃən/",
  "critical thinking": "/ˈkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/",
  "curriculum": "/kəˈrɪk.jʊ.ləm/",
  "pedagogy": "/ˈped.ə.ɡɒdʒ.i/",
  "literacy": "/ˈlɪt.ər.ə.si/",
  "cognitive development": "/ˈkɒɡ.nə.tɪv dɪˈvel.əp.mənt/",
  "vocational training": "/vəʊˈkeɪ.ʃən.əl ˈtreɪ.nɪŋ/",
  "distance learning": "/ˈdɪs.təns ˈlɜː.nɪŋ/",
  "extracurricular activities": "/ˌek.strə.kəˈrɪk.jʊ.lər ækˈtɪv.ə.tiz/",
  "rote memorization": "/rəʊt ˌmem.ə.raɪˈzeɪ.ʃən/",
  "peer assessment": "/pɪər əˈses.mənt/",
  "formative assessment": "/ˈfɔːr.mə.tɪv əˈses.mənt/",
  "summative assessment": "/səˈmeɪ.tɪv əˈses.mənt/",
  "academic integrity": "/ˌæk.əˈdem.ɪk ɪnˈteɡ.rə.ti/",
  "plagiarism": "/ˈpleɪ.dʒər.ɪ.zəm/",
  "scholarship": "/ˈskɒl.ə.ʃɪp/",
  "tuition fees": "/tjuːˈɪʃ.ən fiːz/",
  "student loan": "/ˈstjuː.dənt ləʊn/",
  "enrollment": "/ɪnˈrəʊl.mənt/",
  "dropout rate": "/ˈdrɒp.aʊt reɪt/",
  "attendance": "/əˈten.dəns/",
  "lecture": "/ˈlek.tʃər/",
  "seminar": "/ˈsem.ɪ.nɑːr/",
  "tutorial": "/tjuːˈtɔː.ri.əl/",
  "dissertation": "/ˌdɪs.əˈteɪ.ʃən/",
  "thesis": "/ˈθiː.sɪs/",
  "undergraduate": "/ˌʌn.dəˈɡrædʒ.u.ət/",
  "postgraduate": "/ˌpəʊstˈɡrædʒ.u.ət/",
  "doctorate": "/ˈdɒk.tər.ət/",
  "alumni": "/əˈlʌm.naɪ/",
  "faculty": "/ˈfæk.əl.ti/",
  "syllabus": "/ˈsɪl.ə.bəs/",
  "timetable": "/ˈtaɪmˌteɪ.bəl/",
  "transcript": "/ˈtræn.skrɪpt/",
  "grade point average": "/ɡreɪd pɔɪnt ˈæv.ər.ɪdʒ/",
  "academic year": "/ˌæk.əˈdem.ɪk jɪər/",
  "semester": "/sɪˈmes.tər/",
  "term": "/tɜːm/",
  "campus": "/ˈkæm.pəs/",
  "dormitory": "/ˈdɔːr.mɪ.tər.i/",
  "laboratory": "/ləˈbɒr.ə.tər.i/",
  "library": "/ˈlaɪ.brər.i/",
  "textbook": "/ˈtekst.bʊk/",
  "curriculum vitae": "/kəˌrɪk.jʊ.ləm ˈviː.taɪ/",
  "qualification": "/ˌkwɒl.ɪ.fɪˈkeɪ.ʃən/",
  "certificate": "/sərˈtɪf.ɪ.kət/",
  "diploma": "/dɪˈpləʊ.mə/",
  "degree": "/dɪˈɡriː/",
  "master": "/ˈmɑː.stər/",
  "bachelor": "/ˈbætʃ.əl.ər/",
  "climate change": "/ˈklaɪ.mət tʃeɪndʒ/",
  "global warming": "/ˌɡləʊ.bəl ˈwɔːr.mɪŋ/",
  "carbon footprint": "/ˈkɑːr.bən ˈfʊt.prɪnt/",
  "greenhouse effect": "/ˈɡriːn.haʊs ɪˈfekt/",
  "renewable energy": "/rɪˈnjuː.ə.bəl ˈen.ə.dʒi/",
  "fossil fuels": "/ˈfɒs.əl fjuːəlz/",
  "sustainable development": "/səˈsteɪ.nə.bəl dɪˈvel.əp.mənt/",
  "deforestation": "/diːˌfɒr.ɪˈsteɪ.ʃən/",
  "biodiversity": "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
  "ecosystem": "/ˈiː.kəʊˌsɪs.təm/",
  "conservation": "/ˌkɒn.səˈveɪ.ʃən/",
  "endangered species": "/ɪnˈdeɪn.dʒəd ˈspiː.ʃiːz/",
  "pollution": "/pəˈluː.ʃən/",
  "air quality": "/eər ˈkwɒl.ə.ti/",
  "waste management": "/weɪst ˈmæn.ɪdʒ.mənt/",
  "recycling": "/ˌriːˈsaɪ.klɪŋ/",
  "natural resources": "/ˈnætʃ.ər.əl rɪˈzɔːr.sɪz/",
  "ozone layer": "/ˈəʊ.zəʊn ˈleɪ.ər/",
  "solar energy": "/ˈsəʊ.lər ˈen.ə.dʒi/",
  "wind power": "/wɪnd ˈpaʊ.ər/",
  "nuclear energy": "/ˈnjuː.kli.ər ˈen.ə.dʒi/",
  "carbon emissions": "/ˈkɑːr.bən ɪˈmɪʃ.ənz/",
  "environmentally friendly": "/ɪnˌvaɪ.rənˈmen.təl.i ˈfrend.li/",
  "ecological balance": "/ˌiː.kəˈlɒdʒ.ɪ.kəl ˈbæl.əns/",
  "green energy": "/ɡriːn ˈen.ə.dʒi/",
  "water scarcity": "/ˈwɔː.tər ˈskeə.sə.ti/",
  "artificial intelligence": "/ˌɑːr.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns/",
  "machine learning": "/məˈʃiːn ˈlɜː.nɪŋ/",
  "big data": "/bɪɡ ˈdeɪ.tə/",
  "automation": "/ˌɔː.təˈmeɪ.ʃən/",
  "digital transformation": "/ˈdɪdʒ.ɪ.təl ˌtræns.fərˈmeɪ.ʃən/",
  "cybersecurity": "/ˌsaɪ.bə.sɪˈkjʊə.rə.ti/",
  "cloud computing": "/klaʊd kəmˈpjuː.tɪŋ/",
  "internet of things": "/ˈɪn.tə.net əv θɪŋz/",
  "blockchain": "/ˈblɒk.tʃeɪn/",
  "virtual reality": "/ˌvɜː.tʃu.əl riˈæl.ə.ti/",
  "augmented reality": "/ɔːɡˈmen.tɪd riˈæl.ə.ti/",
  "social media": "/ˈsəʊ.ʃəl ˈmiː.di.ə/",
  "e-commerce": "/ˈiːˌkɒm.ɜːs/",
  "smartphone": "/ˈsmɑːrt.fəʊn/",
  "innovation": "/ˌɪn.əˈveɪ.ʃən/",
  "breakthrough": "/ˈbreɪk.θruː/",
  "cutting-edge": "/ˌkʌt.ɪŋ ˈedʒ/",
  "algorithm": "/ˈæl.ɡə.rɪð.əm/",
  "database": "/ˈdeɪ.tə.beɪs/",
  "network": "/ˈnet.wɜːk/",
  "software": "/ˈsɒft.weər/",
  "hardware": "/ˈhɑːrd.weər/",
  "user interface": "/ˈjuː.zər ˈɪn.tə.feɪs/",
  "telecommuting": "/ˌtel.ɪ.kəˈmjuː.tɪŋ/",
  "remote work": "/rɪˈməʊt wɜːk/",
  "work-life balance": "/wɜːk laɪf ˈbæl.əns/",
  "job satisfaction": "/dʒɒb ˌsæt.ɪsˈfæk.ʃən/",
  "career advancement": "/kəˈrɪər ədˈvɑːns.mənt/",
  "professional development": "/prəˈfeʃ.ən.əl dɪˈvel.əp.mənt/",
  "teamwork": "/ˈtiːm.wɜːk/",
  "leadership": "/ˈliː.də.ʃɪp/",
  "workplace diversity": "/ˈwɜːk.pleɪs daɪˈvɜː.sə.ti/",
  "employee morale": "/ɪmˈplɔɪ.iː məˈrɑːl/",
  "productivity": "/ˌprɒd.ʌkˈtɪv.ə.ti/",
  "time management": "/taɪm ˈmæn.ɪdʒ.mənt/",
  "deadline": "/ˈded.laɪn/",
  "workload": "/ˈwɜːk.ləʊd/",
  "promotion": "/prəˈməʊ.ʃən/",
  "salary": "/ˈsæl.ər.i/",
  "wage": "/weɪdʒ/",
  "overtime": "/ˈəʊ.və.taɪm/",
  "unemployment": "/ˌʌn.ɪmˈplɔɪ.mənt/",
  "job market": "/dʒɒb ˈmɑːr.kɪt/",
  "recruitment": "/rɪˈkruːt.mənt/",
  "internship": "/ˈɪn.tɜːn.ʃɪp/",
  "apprenticeship": "/əˈpren.tɪs.ʃɪp/",
  "colleague": "/ˈkɒl.iːɡ/",
  "employer": "/ɪmˈplɔɪ.ər/",
  "employee": "/ɪmˈplɔɪ.iː/",
  "public health": "/ˈpʌb.lɪk helθ/",
  "mental health": "/ˈmen.təl helθ/",
  "physical fitness": "/ˈfɪz.ɪ.kəl ˈfɪt.nəs/",
  "nutrition": "/njuːˈtrɪʃ.ən/",
  "obesity": "/əʊˈbiː.sə.ti/",
  "sedentary lifestyle": "/ˈsed.ən.tər.i ˈlaɪf.staɪl/",
  "healthcare system": "/ˈhelθ.keər ˈsɪs.təm/",
  "vaccination": "/ˌvæk.sɪˈneɪ.ʃən/",
  "life expectancy": "/laɪf ɪkˈspek.tən.si/",
  "chronic disease": "/ˈkrɒn.ɪk dɪˈziːz/",
  "infectious disease": "/ɪnˈfek.ʃəs dɪˈziːz/",
  "preventive medicine": "/prɪˈven.tɪv ˈmed.ɪ.sɪn/",
  "health awareness": "/helθ əˈweə.nəs/",
  "stress management": "/stres ˈmæn.ɪdʒ.mənt/",
  "well-being": "/ˌwel ˈbiː.ɪŋ/",
  "dietary habits": "/ˈdaɪ.ə.tər.i ˈhæb.ɪts/",
  "junk food": "/dʒʌŋk fuːd/",
  "balanced diet": "/ˈbæl.ənst ˈdaɪ.ət/",
  "exercise routine": "/ˈek.sə.saɪz ruːˈtiːn/",
  "cardiovascular": "/ˌkɑːr.di.əʊˈvæs.kjʊ.lər/",
  "immune system": "/ɪˈmjuːn ˈsɪs.təm/",
  "diagnosis": "/ˌdaɪ.əɡˈnəʊ.sɪs/",
  "treatment": "/ˈtriːt.mənt/",
  "symptom": "/ˈsɪmp.təm/",
  "therapy": "/ˈθer.ə.pi/",
  "urbanization": "/ˌɜː.bən.aɪˈzeɪ.ʃən/",
  "infrastructure": "/ˈɪn.frəˌstrʌk.tʃər/",
  "public transport": "/ˈpʌb.lɪk ˈtræn.spɔːrt/",
  "traffic congestion": "/ˈtræf.ɪk kənˈdʒes.tʃən/",
  "housing affordability": "/ˈhaʊ.zɪŋ əˌfɔːr.dəˈbɪl.ə.ti/",
  "high-rise building": "/haɪ raɪz ˈbɪl.dɪŋ/",
  "suburb": "/ˈsʌb.ɜːb/",
  "metropolitan": "/ˌmet.rəˈpɒl.ɪ.tən/",
  "population density": "/ˌpɒp.jʊˈleɪ.ʃən ˈden.sɪ.ti/",
  "rush hour": "/rʌʃ aʊər/",
  "green space": "/ɡriːn speɪs/",
  "urban planning": "/ˈɜː.bən ˈplæn.ɪŋ/",
  "smart city": "/smɑːrt ˈsɪt.i/",
  "cultural diversity": "/ˈkʌl.tʃər.əl daɪˈvɜː.sə.ti/",
  "cost of living": "/kɒst əv ˈlɪv.ɪŋ/",
  "municipal": "/mjuːˈnɪs.ɪ.pəl/",
  "residential area": "/ˌrez.ɪˈden.ʃəl ˈeə.ri.ə/",
  "commercial district": "/kəˈmɜː.ʃəl ˈdɪs.trɪkt/",
  "amenities": "/əˈmiː.nə.tiz/",
  "overcrowding": "/ˌəʊ.vəˈkraʊ.dɪŋ/",
};

// ============================================================
// 中文翻译词典 — 按词块 ID 索引
// ============================================================

interface BilingualData {
  pronunciation: string;
  collocations_cn: string[];
  example_sentence_cn: string;
  synonyms_cn: string[];
}

function getBilingualData(chunk: Chunk): BilingualData {
  const data = BILINGUAL_DB[chunk.id];
  if (data) return data;

  // Fallback: 生成基本数据
  console.warn(`[WARN] No bilingual data for ${chunk.id}, using fallback`);
  return {
    pronunciation: IPA_MAP[chunk.word] || generateIPA(chunk.word),
    collocations_cn: chunk.collocations.map(() => ""),
    example_sentence_cn: `[需要翻译] ${chunk.example_sentence}`,
    synonyms_cn: chunk.synonyms.map(() => ""),
  };
}

function generateIPA(word: string): string {
  // 简单的基于音节的 IPA 近似生成
  const syllables = word.toLowerCase().split(/\s+/);
  const ipaParts = syllables.map((syl) => {
    const cleaned = syl.replace(/[^a-z]/g, "");
    if (cleaned.length <= 2) return `/${cleaned}/`;
    const parts = cleaned.match(/.{1,3}/g) || [cleaned];
    return "/" + parts.join(".") + "/";
  });
  return ipaParts.join(" ");
}

// ============================================================
// 中文翻译主数据库
// ============================================================
const BILINGUAL_DB: Record<string, BilingualData> = {
  // ======== EDUCATION (edu-001 ~ edu-050) ========
  "edu-001": {
    pronunciation: "/ˌæk.əˈdem.ɪk pərˈfɔːr.məns/",
    collocations_cn: ["提高学业表现", "出色的学业表现", "学业表现下滑"],
    example_sentence_cn: "课外活动可以对学生的学业表现产生积极影响。",
    synonyms_cn: ["教育成就", "学业成就"],
  },
  "edu-002": {
    pronunciation: "/ˈhaɪ.ər ˌedʒ.ʊˈkeɪ.ʃən/",
    collocations_cn: ["接受高等教育", "获得高等教育的机会", "高等教育机构", "高等教育成本"],
    example_sentence_cn: "高等教育在培养个人应对竞争激烈的就业市场方面发挥着关键作用。",
    synonyms_cn: ["第三级教育", "大学教育", "中学后教育"],
  },
  "edu-003": {
    pronunciation: "/ˈkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/",
    collocations_cn: ["培养批判性思维", "促进批判性思维", "批判性思维能力", "缺乏批判性思维"],
    example_sentence_cn: "学校应该注重培养学生的批判性思维，而不是鼓励死记硬背。",
    synonyms_cn: ["分析性思维", "逻辑推理", "独立思考"],
  },
  "edu-004": {
    pronunciation: "/kəˈrɪk.jʊ.ləm/",
    collocations_cn: ["学校课程", "课程设计", "核心课程", "课外活动"],
    example_sentence_cn: "新课程强调实践技能而非理论知识。",
    synonyms_cn: ["教学大纲", "课程安排", "学习计划"],
  },
  "edu-005": {
    pronunciation: "/ˈped.ə.ɡɒdʒ.i/",
    collocations_cn: ["上涨的学费", "负担学费", "学费减免", "支付学费"],
    example_sentence_cn: "不断上涨的学费使许多学生难以负担高等教育。",
    synonyms_cn: ["学费成本", "学杂费", "教育支出"],
  },
  "edu-006": {
    pronunciation: "/ˈlɪt.ər.ə.si/",
    collocations_cn: ["识字率", "数字素养", "读写能力", "金融素养"],
    example_sentence_cn: "读写能力是教育发展和经济赋权的基础。",
    synonyms_cn: ["读写能力", "识字", "文化水平"],
  },
  "edu-007": {
    pronunciation: "/kəmˈpʌl.sər.i ˌedʒ.ʊˈkeɪ.ʃən/",
    collocations_cn: ["义务教育法", "九年义务教育", "完成义务教育", "超出义务教育"],
    example_sentence_cn: "义务教育确保每个儿童都能接受基础教育。",
    synonyms_cn: ["强制教育", "义务学校教育", "法定教育"],
  },
  "edu-008": {
    pronunciation: "/stʌd əˈbrɔːd/",
    collocations_cn: ["选择出国留学", "留学经历", "留学项目", "出国留学机会"],
    example_sentence_cn: "出国留学为学生提供了体验不同文化和教育体系的机会。",
    synonyms_cn: ["海外求学", "就读国外大学", "国际学习"],
  },
  "edu-009": {
    pronunciation: "/ˌek.strə.kəˈrɪk.jʊ.lər ækˈtɪv.ə.tiz/",
    collocations_cn: ["参加课外活动", "课外活动项目", "参与课外活动", "丰富多样的课外活动"],
    example_sentence_cn: "学生通过参与课外活动来培养课堂之外的技能。",
    synonyms_cn: ["课后活动", "辅助课程活动", "拓展活动"],
  },
  "edu-010": {
    pronunciation: "/ˌedʒ.ʊˈkeɪ.ʃən.əl ˈsɪs.təm/",
    collocations_cn: ["改革教育体系", "教育体系面临挑战", "教育体系的缺陷", "过时的教育体系"],
    example_sentence_cn: "改革教育体系需要政策制定者、教师和家长的共同努力。",
    synonyms_cn: ["教育系统", "学校体系", "教育制度"],
  },
  "edu-011": {
    pronunciation: "/ˈfɔːr.məl ˌedʒ.ʊˈkeɪ.ʃən/",
    collocations_cn: ["完成正规教育", "获得正规教育的机会", "正规教育体系", "超出正规教育"],
    example_sentence_cn: "正规教育为个人提供了系统化的知识获取途径。",
    synonyms_cn: ["主流教育", "结构化教育", "体制教育"],
  },
  "edu-012": {
    pronunciation: "/ˈtiː.tʃɪŋ ˌmeθ.əˈdɒl.ə.dʒi/",
    collocations_cn: ["创新教学方法", "传统教学方法", "采用新教学方法", "有效的教学方法"],
    example_sentence_cn: "教师需要根据学生需求不断更新和改进自己的教学方法。",
    synonyms_cn: ["教学方式", "教育方法", "教学策略"],
  },
  "edu-013": {
    pronunciation: "/ˈstjuː.dənt ɪnˈɡeɪdʒ.mənt/",
    collocations_cn: ["提高学生参与度", "学生参与度水平", "促进学生参与度", "衡量学生参与度"],
    example_sentence_cn: "学生参与度是预测学习成果的重要指标之一。",
    synonyms_cn: ["学生参与", "学生投入", "学习者参与"],
  },
  "edu-014": {
    pronunciation: "/ˈlɜː.nɪŋ ˈaʊt.kʌmz/",
    collocations_cn: ["改善学习成果", "衡量学习成果", "期望的学习成果", "评估学习成果"],
    example_sentence_cn: "有效的教学策略可以显著改善学生的学习成果。",
    synonyms_cn: ["教育成果", "学习结果", "学业成果"],
  },
  "edu-015": {
    pronunciation: "/ˌæk.əˈdem.ɪk ˌkwɒl.ɪ.fɪˈkeɪ.ʃənz/",
    collocations_cn: ["获得学历资格", "认可的学历资格", "最低学历要求", "学历资格要求"],
    example_sentence_cn: "学术资格证书是许多职业的基本入职门槛。",
    synonyms_cn: ["学历证书", "学术学位", "正式资格"],
  },
  "edu-016": {
    pronunciation: "/ˈpleɪ.dʒər.ɪ.zəm/",
    collocations_cn: ["检测抄袭", "学术抄袭", "抄袭检查工具", "避免抄袭"],
    example_sentence_cn: "许多大学使用专门的软件来检测学生作业中的抄袭行为。",
    synonyms_cn: ["剽窃", "学术抄袭", "学术不端"],
  },
  "edu-017": {
    pronunciation: "/ˈskɒl.ə.ʃɪp/",
    collocations_cn: ["获得奖学金", "奖学金申请", "学术奖学金", "全额奖学金"],
    example_sentence_cn: "她凭借出色的学业成绩获得了一所顶尖大学的奖学金。",
    synonyms_cn: ["奖学金", "助学金", "学术资助"],
  },
  "edu-018": {
    pronunciation: "/tjuːˈɪʃ.ən fiːz/",
    collocations_cn: ["支付学费", "高额学费", "学费上涨", "学费减免"],
    example_sentence_cn: "学费上涨使得许多学生难以负担高等教育。",
    synonyms_cn: ["学杂费", "教育费用", "学费支出"],
  },
  "edu-019": {
    pronunciation: "/əˈtʃiːv.mənt/",
    collocations_cn: ["衡量学业成绩", "提高学业成绩", "学业成绩差距", "出色的学业成绩"],
    example_sentence_cn: "衡量学业成绩不仅仅依赖于考试成绩。",
    synonyms_cn: ["教育成就", "学术成就", "学业成功"],
  },
  "edu-020": {
    pronunciation: "/ɪnˈrəʊl.mənt/",
    collocations_cn: ["入学人数", "招生过程", "注册入学", "入学率"],
    example_sentence_cn: "过去十年间，大学入学人数显著增加。",
    synonyms_cn: ["注册", "入学", "招生"],
  },
  "edu-021": {
    pronunciation: "/ˈkɒɡ.nə.tɪv dɪˈvel.əp.mənt/",
    collocations_cn: ["促进认知发展", "认知发展理论", "早期认知发展", "认知发展阶段"],
    example_sentence_cn: "早期儿童教育对认知发展有显著影响。",
    synonyms_cn: ["智力发展", "心理发展", "认知成长"],
  },
  "edu-022": {
    pronunciation: "/əˈten.dəns/",
    collocations_cn: ["出勤率", "强制出勤", "记录出勤", "缺勤"],
    example_sentence_cn: "定期出勤与学业成绩的提高密切相关。",
    synonyms_cn: ["出勤", "到课", "参与度"],
  },
  "edu-023": {
    pronunciation: "/ˈskɒl.ə.ʃɪp/",
    collocations_cn: ["申请奖学金项目", "授予奖学金", "基于成绩的奖学金", "全额资助奖学金"],
    example_sentence_cn: "她通过优异的成绩获得了全额资助的奖学金项目。",
    synonyms_cn: ["助学金项目", "助学金计划", "资助项目", "奖学金"],
  },
  "edu-024": {
    pronunciation: "/ˈsem.ɪ.nɑːr/",
    collocations_cn: ["参加研讨会", "研讨会讨论", "举办研讨会", "研讨会系列"],
    example_sentence_cn: "小型研讨会鼓励学生积极参与课堂讨论。",
    synonyms_cn: ["研讨课", "专题讨论", "研讨班"],
  },
  "edu-025": {
    pronunciation: "/tjuːˈtɔː.ri.əl/",
    collocations_cn: ["辅导课程", "一对一辅导", "辅导材料", "在线教程"],
    example_sentence_cn: "辅导课程为学生提供了在小组环境中提问的机会。",
    synonyms_cn: ["辅导课", "指导课", "个别指导"],
  },
  "edu-026": {
    pronunciation: "/ˌdɪs.əˈteɪ.ʃən/",
    collocations_cn: ["撰写论文", "博士论文", "论文答辩", "提交论文"],
    example_sentence_cn: "她花了两年时间进行实地研究才完成博士论文。",
    synonyms_cn: ["学位论文", "博士论文", "学术论文"],
  },
  "edu-027": {
    pronunciation: "/ˈθiː.sɪs/",
    collocations_cn: ["硕士论文", "论文陈述", "论文研究", "论文指导"],
    example_sentence_cn: "他的硕士论文探讨了社交媒体对青少年心理健康的影响。",
    synonyms_cn: ["毕业论文", "学位论文", "研究论文"],
  },
  "edu-028": {
    pronunciation: "/ˌʌn.dəˈɡrædʒ.u.ət/",
    collocations_cn: ["本科生", "本科课程", "本科教育", "本科学位"],
    example_sentence_cn: "本科阶段为学生提供了广泛的通识教育基础。",
    synonyms_cn: ["大学本科生", "学士生", "本科学生"],
  },
  "edu-029": {
    pronunciation: "/ˌpəʊstˈɡrædʒ.u.ət/",
    collocations_cn: ["研究生", "研究生课程", "研究生学习", "研究生学位"],
    example_sentence_cn: "研究生学习通常需要更深入的独立研究和专业方向。",
    synonyms_cn: ["研究生", "硕士生", "博士生"],
  },
  "edu-030": {
    pronunciation: "/ˈdɒk.tər.ət/",
    collocations_cn: ["攻读博士学位", "获得博士学位", "博士学位课程", "荣誉博士"],
    example_sentence_cn: "获得博士学位需要在特定领域做出原创性的研究贡献。",
    synonyms_cn: ["博士", "博士头衔", "最高学位"],
  },
  "edu-031": {
    pronunciation: "/əˈlʌm.naɪ/",
    collocations_cn: ["校友网络", "校友会", "校友捐赠", "校友聚会"],
    example_sentence_cn: "强大的校友网络可以为毕业生提供宝贵的职业发展机会。",
    synonyms_cn: ["校友", "毕业生", "旧生"],
  },
  "edu-032": {
    pronunciation: "/ˈfæk.əl.ti/",
    collocations_cn: ["教职工", "学院", "教师团队", "系"],
    example_sentence_cn: "该大学拥有一支经验丰富的国际化学术教师队伍。",
    synonyms_cn: ["院系", "教学人员", "教职员"],
  },
  "edu-033": {
    pronunciation: "/ˈsɪl.ə.bəs/",
    collocations_cn: ["课程大纲", "考试大纲", "教学大纲", "更新教学大纲"],
    example_sentence_cn: "课程大纲概述了学生将在整个学期学习的所有主题。",
    synonyms_cn: ["教学大纲", "课程纲要", "教学计划"],
  },
  "edu-034": {
    pronunciation: "/ˈtaɪmˌteɪ.bəl/",
    collocations_cn: ["课程表", "考试时间表", "安排时间表", "修订时间表"],
    example_sentence_cn: "学校在学期开始前公布课程时间表。",
    synonyms_cn: ["课表", "日程表", "时间安排"],
  },
  "edu-035": {
    pronunciation: "/ˈtræn.skrɪpt/",
    collocations_cn: ["成绩单", "官方成绩单", "申请成绩单", "学术成绩单"],
    example_sentence_cn: "申请研究生院时通常需要提交正式的本科成绩单。",
    synonyms_cn: ["成绩报告", "学业记录", "成绩证明"],
  },
  "edu-036": {
    pronunciation: "/ɡreɪd pɔɪnt ˈæv.ər.ɪdʒ/",
    collocations_cn: ["平均绩点", "高绩点", "计算绩点", "绩点要求"],
    example_sentence_cn: "许多雇主在筛选应届毕业生简历时会将平均绩点作为参考指标。",
    synonyms_cn: ["GPA", "平均分", "成绩均值"],
  },
  "edu-037": {
    pronunciation: "/ˌæk.əˈdem.ɪk jɪər/",
    collocations_cn: ["学年", "学年开始", "整个学年", "学年结束"],
    example_sentence_cn: "大多数学术机构从九月到次年六月为一个学年。",
    synonyms_cn: ["学年度", "教学年", "校历年度"],
  },
  "edu-038": {
    pronunciation: "/sɪˈmes.tər/",
    collocations_cn: ["秋季学期", "春季学期", "学期末", "学期制"],
    example_sentence_cn: "每个学期通常持续约15周，包括考试周。",
    synonyms_cn: ["学期", "半学年", "学季"],
  },
  "edu-039": {
    pronunciation: "/tɜːm/",
    collocations_cn: ["学期", "期中考试", "学期论文", "学期结束"],
    example_sentence_cn: "学生在每个学期结束时参加期末考试。",
    synonyms_cn: ["学期", "学段", "教学期"],
  },
  "edu-040": {
    pronunciation: "/ˈkæm.pəs/",
    collocations_cn: ["校园生活", "大学校园", "校园设施", "住在校园"],
    example_sentence_cn: "现代化的校园设施为学生的学习和生活提供了全面的支持。",
    synonyms_cn: ["校园", "校区", "大学园区"],
  },
  "edu-041": {
    pronunciation: "/ˈdɔːr.mɪ.tər.i/",
    collocations_cn: ["学生宿舍", "住在宿舍", "宿舍生活", "宿舍楼"],
    example_sentence_cn: "住在学校宿舍有助于新生更快地适应大学生活。",
    synonyms_cn: ["学生公寓", "集体宿舍", "住宿楼"],
  },
  "edu-042": {
    pronunciation: "/ləˈbɒr.ə.tər.i/",
    collocations_cn: ["科学实验室", "实验室设备", "实验室研究", "语言实验室"],
    example_sentence_cn: "新建的科学实验室配备了最先进的研究设备。",
    synonyms_cn: ["实验室", "研究室", "实验中心"],
  },
  "edu-043": {
    pronunciation: "/ˈlaɪ.brər.i/",
    collocations_cn: ["大学图书馆", "图书馆资源", "数字图书馆", "图书馆服务"],
    example_sentence_cn: "大学图书馆提供丰富的学术资源和安静的学习空间。",
    synonyms_cn: ["图书馆", "图书室", "资料中心"],
  },
  "edu-044": {
    pronunciation: "/ˈtekst.bʊk/",
    collocations_cn: ["购买教材", "教科书内容", "数字教科书", "参考书"],
    example_sentence_cn: "教科书仍然是大多数课程的核心学习材料。",
    synonyms_cn: ["教材", "教科书", "课本"],
  },
  "edu-045": {
    pronunciation: "/kəˌrɪk.jʊ.ləm ˈviː.taɪ/",
    collocations_cn: ["撰写简历", "提交简历", "简历格式", "更新简历"],
    example_sentence_cn: "一份精心撰写的简历对于求职和学术申请都至关重要。",
    synonyms_cn: ["个人简历", "履历表", "CV"],
  },
  "edu-046": {
    pronunciation: "/ˌkwɒl.ɪ.fɪˈkeɪ.ʃən/",
    collocations_cn: ["学术资格", "专业资格", "获得资格", "资格认证"],
    example_sentence_cn: "雇主越来越重视实践经验和学历资格的结合。",
    synonyms_cn: ["学历", "资质", "资历认证"],
  },
  "edu-047": {
    pronunciation: "/sərˈtɪf.ɪ.kət/",
    collocations_cn: ["获得证书", "毕业证书", "证书课程", "资格证书"],
    example_sentence_cn: "完成该课程后，学生将获得行业内认可的证书。",
    synonyms_cn: ["证书", "证明", "结业证"],
  },
  "edu-048": {
    pronunciation: "/dɪˈpləʊ.mə/",
    collocations_cn: ["获得文凭", "高等教育文凭", "文凭课程", "研究生文凭"],
    example_sentence_cn: "该文凭课程为学生提供了进入职场所需的实用技能。",
    synonyms_cn: ["毕业文凭", "学位证书", "结业证书"],
  },
  "edu-049": {
    pronunciation: "/ˌæk.əˈdem.ɪk ədˈvaɪ.zər/",
    collocations_cn: ["与学术导师会面", "向学术导师寻求建议", "指派的学术导师", "学术导师约见"],
    example_sentence_cn: "学术导师帮助学生规划课程选择并为职业道路提供建议。",
    synonyms_cn: ["院系导师", "辅导教师", "学术顾问", "学业指导"],
  },
  "edu-050": {
    pronunciation: "/ˈmɑː.stər/",
    collocations_cn: ["硕士学位", "攻读硕士", "硕士课程", "硕士论文"],
    example_sentence_cn: "攻读硕士学位可以帮助学生在特定领域深化专业知识和研究能力。",
    synonyms_cn: ["研究生学位", "硕士学历", "研究生"],
  },

  // ======== ENVIRONMENT (env-001 ~ env-050) ========
  "env-001": {
    pronunciation: "/ɪnˌvaɪ.rənˈmen.təl prəˈtek.ʃən/",
    collocations_cn: ["环境保护措施", "环境保护机构", "优先考虑环境保护"],
    example_sentence_cn: "环境保护措施对于实现可持续发展目标至关重要。",
    synonyms_cn: ["自然保护", "生态保护", "环境保育"],
  },
  "env-002": {
    pronunciation: "/ˌɡləʊ.bəl ˈwɔːr.mɪŋ/",
    collocations_cn: ["控制全球变暖", "导致全球变暖", "全球变暖效应", "减缓全球变暖"],
    example_sentence_cn: "全球变暖正导致极地冰盖以前所未有的速度融化。",
    synonyms_cn: ["地球变暖", "气温上升", "全球变热"],
  },
  "env-003": {
    pronunciation: "/ˈkɑːr.bən ˈfʊt.prɪnt/",
    collocations_cn: ["减少碳足迹", "测量碳足迹", "个人碳足迹", "碳足迹计算器"],
    example_sentence_cn: "减少碳足迹是每个人都可以为环境保护做出的贡献。",
    synonyms_cn: ["碳排放量", "碳排量", "温室气体排放"],
  },
  "env-004": {
    pronunciation: "/ˈɡriːn.haʊs ɪˈfekt/",
    collocations_cn: ["温室效应", "加剧温室效应", "温室气体", "温室效应导致"],
    example_sentence_cn: "温室效应虽然是一种自然现象，但人类活动使其大大加剧。",
    synonyms_cn: ["温室现象", "大气保温效应", "增温效应"],
  },
  "env-005": {
    pronunciation: "/rɪˈnjuː.ə.bəl ˈen.ə.dʒi/",
    collocations_cn: ["开发可再生能源", "转向可再生能源", "可再生能源技术", "推广可再生能源"],
    example_sentence_cn: "投资可再生能源是摆脱对化石燃料依赖的关键一步。",
    synonyms_cn: ["清洁能源", "可持续能源", "绿色能源"],
  },
  "env-006": {
    pronunciation: "/ˈfɒs.əl fjuːəlz/",
    collocations_cn: ["燃烧化石燃料", "依赖化石燃料", "化石燃料消耗", "替代化石燃料"],
    example_sentence_cn: "过度依赖化石燃料是造成空气污染和气候问题的主要原因。",
    synonyms_cn: ["矿物燃料", "石化燃料", "传统能源"],
  },
  "env-007": {
    pronunciation: "/səˈsteɪ.nə.bəl dɪˈvel.əp.mənt/",
    collocations_cn: ["实现可持续发展", "可持续发展目标", "促进可持续发展", "可持续发展战略"],
    example_sentence_cn: "可持续发展旨在满足当代需求，同时不损害后代的能力。",
    synonyms_cn: ["永续发展", "可持续增长", "绿色发展"],
  },
  "env-008": {
    pronunciation: "/diːˌfɒr.ɪˈsteɪ.ʃən/",
    collocations_cn: ["森林砍伐", "防止森林砍伐", "大规模森林砍伐", "森林砍伐率"],
    example_sentence_cn: "亚马逊雨林的森林砍伐对全球生物多样性构成严重威胁。",
    synonyms_cn: ["森林破坏", "毁林", "砍伐森林"],
  },
  "env-009": {
    pronunciation: "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
    collocations_cn: ["保护生物多样性", "生物多样性丧失", "丰富生物多样性", "生物多样性热点"],
    example_sentence_cn: "保护生物多样性对于维持生态系统的健康和稳定至关重要。",
    synonyms_cn: ["物种多样性", "生物多样化", "生态多样性"],
  },
  "env-010": {
    pronunciation: "/ˈiː.kəʊˌsɪs.təm/",
    collocations_cn: ["生态系统保护", "海洋生态系统", "生态系统服务", "破坏生态系统"],
    example_sentence_cn: "健康的生态系统为人类提供清洁的水源、空气和食物。",
    synonyms_cn: ["生态体系", "生态环境", "自然系统"],
  },
  "env-011": {
    pronunciation: "/ˌkɒn.səˈveɪ.ʃən/",
    collocations_cn: ["环境保护", "野生动物保护", "保护工作", "保护措施"],
    example_sentence_cn: "有效的环境保护需要政府、企业和公众的共同努力。",
    synonyms_cn: ["保护", "保育", "保存"],
  },
  "env-012": {
    pronunciation: "/ɪnˈdeɪn.dʒəd ˈspiː.ʃiːz/",
    collocations_cn: ["保护濒危物种", "濒危物种名单", "濒危物种栖息地", "濒危物种保护法"],
    example_sentence_cn: "由于栖息地丧失和非法捕猎，许多濒危物种面临灭绝的威胁。",
    synonyms_cn: ["受威胁物种", "珍稀物种", "濒临灭绝的物种"],
  },
  "env-013": {
    pronunciation: "/pəˈluː.ʃən/",
    collocations_cn: ["空气污染", "水污染", "减少污染", "工业污染"],
    example_sentence_cn: "城市地区的空气污染已导致严重的公共健康问题。",
    synonyms_cn: ["污染", "环境污染", "污染物"],
  },
  "env-014": {
    pronunciation: "/eər ˈkwɒl.ə.ti/",
    collocations_cn: ["空气质量指数", "改善空气质量", "空气质量监测", "空气质量标准"],
    example_sentence_cn: "糟糕的空气质量与呼吸系统疾病发病率上升有直接关联。",
    synonyms_cn: ["大气质量", "空气状况", "大气环境"],
  },
  "env-015": {
    pronunciation: "/weɪst ˈmæn.ɪdʒ.mənt/",
    collocations_cn: ["废物管理", "固体废物管理", "废物管理系统", "可持续废物管理"],
    example_sentence_cn: "有效的废物管理是构建可持续城市的关键组成部分。",
    synonyms_cn: ["垃圾处理", "废物处理", "废料管理"],
  },
  "env-016": {
    pronunciation: "/ˌriːˈsaɪ.klɪŋ/",
    collocations_cn: ["回收计划", "提高回收率", "回收设施", "分类回收"],
    example_sentence_cn: "提高回收率可以显著减少垃圾填埋场的压力。",
    synonyms_cn: ["循环利用", "资源回收", "再生利用"],
  },
  "env-017": {
    pronunciation: "/ˈnætʃ.ər.əl rɪˈzɔːr.sɪz/",
    collocations_cn: ["保护自然资源", "消耗自然资源", "可再生自然资源", "自然资源管理"],
    example_sentence_cn: "不可持续的自然资源消耗威胁着后代的发展机会。",
    synonyms_cn: ["天然资源", "自然资源禀赋", "自源"],
  },
  "env-018": {
    pronunciation: "/ˈəʊ.zəʊn ˈleɪ.ər/",
    collocations_cn: ["臭氧层破坏", "保护臭氧层", "臭氧层空洞", "臭氧层恢复"],
    example_sentence_cn: "禁止使用氟利昂的国际协议帮助减缓了臭氧层的破坏。",
    synonyms_cn: ["臭氧保护层", "大气臭氧", "平流层臭氧"],
  },
  "env-019": {
    pronunciation: "/ˈsəʊ.lər ˈen.ə.dʒi/",
    collocations_cn: ["太阳能板", "利用太阳能", "太阳能发电", "太阳能技术"],
    example_sentence_cn: "太阳能是最具发展潜力的可再生能源之一。",
    synonyms_cn: ["太阳能源", "光伏能源", "日光能"],
  },
  "env-020": {
    pronunciation: "/wɪnd ˈpaʊ.ər/",
    collocations_cn: ["风力发电", "风电场", "风力涡轮机", "开发风能"],
    example_sentence_cn: "风力发电已成为许多国家清洁能源战略的重要组成部分。",
    synonyms_cn: ["风能", "风力能源", "风电"],
  },
  "env-021": {
    pronunciation: "/ˈnjuː.kli.ər ˈen.ə.dʒi/",
    collocations_cn: ["核电站", "发展核能", "核能安全", "核能政策"],
    example_sentence_cn: "核能是一种低碳能源，但安全问题和核废料处置仍存在争议。",
    synonyms_cn: ["原子能", "核动力", "核电力"],
  },
  "env-022": {
    pronunciation: "/ˈkɑːr.bən ɪˈmɪʃ.ənz/",
    collocations_cn: ["减少碳排放", "碳排放交易", "零碳排放", "碳排放量"],
    example_sentence_cn: "许多国家承诺在2050年前实现净零碳排放。",
    synonyms_cn: ["二氧化碳排放", "温室气体排放", "碳排放物"],
  },
  "env-023": {
    pronunciation: "/ɪnˌvaɪ.rənˈmen.təl.i ˈfrend.li/",
    collocations_cn: ["环保产品", "环保技术", "环保做法", "环保政策"],
    example_sentence_cn: "消费者越来越倾向于购买环保产品，推动企业走向可持续发展。",
    synonyms_cn: ["环保的", "生态友好的", "对环境无害的"],
  },
  "env-024": {
    pronunciation: "/ˌiː.kəˈlɒdʒ.ɪ.kəl ˈbæl.əns/",
    collocations_cn: ["维持生态平衡", "破坏生态平衡", "恢复生态平衡", "生态平衡的重要性"],
    example_sentence_cn: "每个物种在维持生态平衡中都扮演着不可替代的角色。",
    synonyms_cn: ["生态均衡", "自然平衡", "环境平衡"],
  },
  "env-025": {
    pronunciation: "/ɡriːn ˈen.ə.dʒi/",
    collocations_cn: ["推广绿色能源", "绿色能源技术", "转向绿色能源", "绿色能源产业"],
    example_sentence_cn: "绿色能源产业的快速发展正在重塑全球能源格局。",
    synonyms_cn: ["清洁能源", "可再生能源", "环保能源"],
  },
  "env-026": {
    pronunciation: "/ˈwɔː.tər ˈskeə.sə.ti/",
    collocations_cn: ["水资源短缺", "应对水资源短缺", "严重的水资源短缺", "水资源短缺问题"],
    example_sentence_cn: "水资源短缺正成为许多发展中国家面临的严峻挑战。",
    synonyms_cn: ["缺水", "水资源匮乏", "用水紧张"],
  },
  "env-027": {
    pronunciation: "/ˌen.vaɪ.rənˈmen.təl prəˈtek.ʃən/",
    collocations_cn: ["环境保护", "环保署", "环境保护措施", "环境保护法"],
    example_sentence_cn: "环境保护不应被视为经济发展的障碍，而应是其重要组成部分。",
    synonyms_cn: ["生态保护", "环境保护", "环境保育"],
  },
  "env-028": {
    pronunciation: "/ˈtɒk.sɪk weɪst/",
    collocations_cn: ["有毒废物", "处理有毒废物", "有毒废物排放", "有毒废物管理"],
    example_sentence_cn: "工业有毒废物的不当处置对附近社区的健康构成严重威胁。",
    synonyms_cn: ["危险废物", "有害废物", "毒性废料"],
  },
  "env-029": {
    pronunciation: "/ˌdes.tɪˈfɪ.keɪ.ʃən/",
    collocations_cn: ["土地荒漠化", "防止荒漠化", "荒漠化进程", "荒漠化控制"],
    example_sentence_cn: "过度放牧和森林砍伐加速了许多干旱地区的荒漠化进程。",
    synonyms_cn: ["沙漠化", "土地退化", "干旱化"],
  },
  "env-030": {
    pronunciation: "/ˈmæn.ɡrəʊv/",
    collocations_cn: ["红树林保护", "红树林生态系统", "恢复红树林", "红树林森林"],
    example_sentence_cn: "红树林在保护海岸线和为海洋生物提供栖息地方面发挥着重要作用。",
    synonyms_cn: ["红树林", "海岸防护林", "潮汐林"],
  },
  "env-031": {
    pronunciation: "/siː ˈlev.əl raɪz/",
    collocations_cn: ["海平面上升", "应对海平面上升", "海平面上升威胁", "海平面上升速度"],
    example_sentence_cn: "海平面上升对低洼沿海城市和岛屿国家的生存构成了直接威胁。",
    synonyms_cn: ["海面上升", "海水上涨", "洋面升高"],
  },
  "env-032": {
    pronunciation: "/səˌsteɪ.nəˈbɪl.ə.ti/",
    collocations_cn: ["环境可持续性", "可持续性发展", "可持续性实践", "确保可持续性"],
    example_sentence_cn: "企业在追求利润的同时，也需要关注其运营对环境可持续性的影响。",
    synonyms_cn: ["可持续性", "永续性", "可维持性"],
  },
  "env-033": {
    pronunciation: "/ˈwɛt.lənd/",
    collocations_cn: ["湿地保护", "湿地生态系统", "人工湿地", "湿地恢复"],
    example_sentence_cn: "湿地是地球上最具生物多样性的生态系统之一，具有重要的生态功能。",
    synonyms_cn: ["沼泽地", "湿地生态系统", "水泽地"],
  },
  "env-034": {
    pronunciation: "/ˈmeɪ.dən ˈfɔː.rɪst/",
    collocations_cn: ["原始森林", "保护原始森林", "原始森林砍伐", "原始森林生态系统"],
    example_sentence_cn: "原始森林拥有最丰富的生物多样性，一旦破坏几乎无法恢复。",
    synonyms_cn: ["原生森林", "古老森林", "处女林"],
  },
  "env-035": {
    pronunciation: "/rɪˈnjuː.ə.bəl rɪˈzɔːr.sɪz/",
    collocations_cn: ["开发可再生资源", "利用可再生资源", "可再生资源管理", "可再生资源技术"],
    example_sentence_cn: "投资可再生资源有助于减少对有限化石燃料的依赖。",
    synonyms_cn: ["可持续资源", "再生资源", "可更新资源"],
  },
  "env-036": {
    pronunciation: "/ˈæs.ɪd reɪn/",
    collocations_cn: ["酸雨形成", "酸雨影响", "减少酸雨", "酸雨问题"],
    example_sentence_cn: "酸雨对森林、湖泊和建筑物造成长期的腐蚀性损害。",
    synonyms_cn: ["酸性降水", "酸沉降", "酸性降雨"],
  },
  "env-037": {
    pronunciation: "/ˈfɔː.rɪst ˈkʌv.ər/",
    collocations_cn: ["森林覆盖率", "增加森林覆盖率", "森林覆盖面积", "森林覆盖减少"],
    example_sentence_cn: "提高森林覆盖率是应对气候变化最有效的自然解决方案之一。",
    synonyms_cn: ["森林覆盖", "林地面积", "林木覆盖"],
  },
  "env-038": {
    pronunciation: "/ˈmær.ɪn pəˈluː.ʃən/",
    collocations_cn: ["海洋污染", "减少海洋污染", "海洋塑料污染", "控制海洋污染"],
    example_sentence_cn: "每年有数百万吨塑料流入海洋，造成严重的海洋污染。",
    synonyms_cn: ["海水污染", "海洋环境污染", "海上污染"],
  },
  "env-039": {
    pronunciation: "/ɪˈmɪʃ.ən stæn.dədz/",
    collocations_cn: ["排放标准", "提高排放标准", "车辆排放标准", "工业排放标准"],
    example_sentence_cn: "更严格的排放标准对于减少城市空气污染至关重要。",
    synonyms_cn: ["排污标准", "排放规范", "废气标准"],
  },
  "env-040": {
    pronunciation: "/ˌriː.fɔːr.ɪˈsteɪ.ʃən/",
    collocations_cn: ["重新造林", "植树造林项目", "推进重新造林", "重新造林计划"],
    example_sentence_cn: "重新造林是恢复退化土地和应对气候变化的重要手段。",
    synonyms_cn: ["森林重建", "复林", "再造林"],
  },
  "env-041": {
    pronunciation: "/ˈwaɪld.laɪf ˈhæb.ɪ.tæt/",
    collocations_cn: ["野生动物栖息地", "保护野生动物栖息地", "破坏野生动物栖息地", "恢复野生动物栖息地"],
    example_sentence_cn: "城市扩张不断侵占野生动物栖息地，导致人与动物的冲突加剧。",
    synonyms_cn: ["野生动物生境", "动物栖息环境", "野生动物家园"],
  },
  "env-042": {
    pronunciation: "/ˈeɪ.pɪ.kʌl.tʃər/",
    collocations_cn: ["养蜂业", "可持续养蜂", "城市养蜂", "养蜂实践"],
    example_sentence_cn: "养蜂不仅提供蜂蜜，更重要的是通过授粉维持农业生产。",
    synonyms_cn: ["养蜂", "蜂业", "蜜蜂养殖"],
  },
  "env-043": {
    pronunciation: "/əˈkʌs.tɪk pəˈluː.ʃən/",
    collocations_cn: ["噪音污染", "减少噪音污染", "城市噪音污染", "噪音污染影响"],
    example_sentence_cn: "长期暴露于噪音污染中会对心理健康和睡眠质量产生负面影响。",
    synonyms_cn: ["声音污染", "噪声干扰", "噪音危害"],
  },
  "env-044": {
    pronunciation: "/ɪˌkɒl.ə.dʒi/",
    collocations_cn: ["生态学", "生态系统", "生态平衡", "生态保护"],
    example_sentence_cn: "了解生态学原理有助于我们更好地保护自然环境。",
    synonyms_cn: ["生态", "生态学", "环境科学"],
  },
  "env-045": {
    pronunciation: "/ˈɒr.ɡæn.ɪk ˈfɑːr.mɪŋ/",
    collocations_cn: ["有机农业", "推广有机农业", "有机农业实践", "有机农业产品"],
    example_sentence_cn: "有机农业避免使用合成农药和化肥，有利于土壤健康和生物多样性。",
    synonyms_cn: ["有机耕作", "生态农业", "绿色农业"],
  },
  "env-046": {
    pronunciation: "/ˈɡriːn.haʊs ɡæs/",
    collocations_cn: ["温室气体排放", "减少温室气体", "温室气体浓度", "温室气体效应"],
    example_sentence_cn: "二氧化碳是最主要的温室气体之一，主要来自化石燃料的燃烧。",
    synonyms_cn: ["温室效应气体", "大气保温气体", "热捕获气体"],
  },
  "env-047": {
    pronunciation: "/ˈnjʊə.trəl/",
    collocations_cn: ["碳中和", "保持中立", "碳中性", "中立立场"],
    example_sentence_cn: "许多科技公司承诺在2030年前实现碳中和目标。",
    synonyms_cn: ["中和", "中立", "平衡"],
  },
  "env-048": {
    pronunciation: "/dɪˈpliː.ʃən/",
    collocations_cn: ["资源枯竭", "臭氧层消耗", "能源枯竭", "地下水枯竭"],
    example_sentence_cn: "自然资源的持续枯竭对经济的长期可持续发展构成了威胁。",
    synonyms_cn: ["耗尽", "枯竭", "消耗殆尽"],
  },
  "env-049": {
    pronunciation: "/ˈfæm.ɪn/",
    collocations_cn: ["饥荒", "遭受饥荒", "预防饥荒", "大饥荒"],
    example_sentence_cn: "气候变化和冲突是导致部分地区饥荒频发的主要原因。",
    synonyms_cn: ["饥荒", "粮荒", "饥饿危机"],
  },
  "env-050": {
    pronunciation: "/ˈæt.mə.sfɪər/",
    collocations_cn: ["大气层", "地球大气", "大气压力", "大气条件"],
    example_sentence_cn: "地球大气层保护我们免受有害的太阳辐射。",
    synonyms_cn: ["大气", "大气层", "空气层"],
  },

  // ======== TECHNOLOGY (tech-001 ~ tech-050) ========
  "tech-001": {
    pronunciation: "/ˌɑːr.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns/",
    collocations_cn: ["发展人工智能", "人工智能技术", "人工智能应用", "人工智能伦理"],
    example_sentence_cn: "人工智能正在彻底改变从医疗保健到交通运输的各个行业。",
    synonyms_cn: ["AI", "机器智能", "智能系统"],
  },
  "tech-002": {
    pronunciation: "/məˈʃiːn ˈlɜː.nɪŋ/",
    collocations_cn: ["机器学习算法", "应用机器学习", "机器学习模型", "机器学习技术"],
    example_sentence_cn: "机器学习算法可以从大量数据中识别模式并做出预测。",
    synonyms_cn: ["机器学习", "算法学习", "自动学习"],
  },
  "tech-003": {
    pronunciation: "/bɪɡ ˈdeɪ.tə/",
    collocations_cn: ["大数据分析", "利用大数据", "大数据技术", "大数据时代"],
    example_sentence_cn: "大数据分析帮助企业更好地理解客户行为和市场趋势。",
    synonyms_cn: ["海量数据", "大规模数据", "巨量数据"],
  },
  "tech-004": {
    pronunciation: "/ˌɔː.təˈmeɪ.ʃən/",
    collocations_cn: ["自动化系统", "工业自动化", "流程自动化", "自动化技术"],
    example_sentence_cn: "自动化正在取代许多重复性工作，同时创造新的技术岗位。",
    synonyms_cn: ["自动化", "自动控制", "机械化操作"],
  },
  "tech-005": {
    pronunciation: "/ˈdɪdʒ.ɪ.təl ˌtræns.fərˈmeɪ.ʃən/",
    collocations_cn: ["数字化转型", "推动数字化转型", "数字化转型战略", "数字化转型进程"],
    example_sentence_cn: "数字化转型已成为企业在数字经济时代生存的关键。",
    synonyms_cn: ["数字化变革", "数字革命", "信息化转型"],
  },
  "tech-006": {
    pronunciation: "/ˌsaɪ.bə.sɪˈkjʊə.rə.ti/",
    collocations_cn: ["网络安全", "网络安全威胁", "加强网络安全", "网络安全措施"],
    example_sentence_cn: "随着网络攻击日益频繁，网络安全已成为企业和个人的首要关注。",
    synonyms_cn: ["网络安全", "信息安全", "计算机安全"],
  },
  "tech-007": {
    pronunciation: "/klaʊd kəmˈpjuː.tɪŋ/",
    collocations_cn: ["云计算服务", "采用云计算", "云计算平台", "云计算技术"],
    example_sentence_cn: "云计算使企业能够灵活扩展IT资源而不需要大量的前期投入。",
    synonyms_cn: ["云端计算", "云服务", "网络计算"],
  },
  "tech-008": {
    pronunciation: "/ˈɪn.tə.net əv θɪŋz/",
    collocations_cn: ["物联网设备", "物联网技术", "物联网应用", "物联网平台"],
    example_sentence_cn: "物联网正在实现家电、汽车和工业设备之间的无缝连接。",
    synonyms_cn: ["IoT", "万物互联", "智能互联"],
  },
  "tech-009": {
    pronunciation: "/ˈblɒk.tʃeɪn/",
    collocations_cn: ["区块链技术", "区块链应用", "区块链平台", "基于区块链"],
    example_sentence_cn: "区块链技术为数字交易提供了前所未有的透明度和安全性。",
    synonyms_cn: ["分布式账本", "去中心化账本", "加密链"],
  },
  "tech-010": {
    pronunciation: "/ˌvɜː.tʃu.əl riˈæl.ə.ti/",
    collocations_cn: ["虚拟现实体验", "虚拟现实技术", "虚拟现实头盔", "虚拟现实游戏"],
    example_sentence_cn: "虚拟现实技术正在改变教育、培训和娱乐的方式。",
    synonyms_cn: ["VR", "虚拟环境", "模拟现实"],
  },
  "tech-011": {
    pronunciation: "/ɔːɡˈmen.tɪd riˈæl.ə.ti/",
    collocations_cn: ["增强现实技术", "增强现实应用", "增强现实眼镜", "增强现实体验"],
    example_sentence_cn: "增强现实将数字信息叠加到现实世界中，创造出丰富的混合体验。",
    synonyms_cn: ["AR", "扩增实境", "混合现实"],
  },
  "tech-012": {
    pronunciation: "/ˈsəʊ.ʃəl ˈmiː.di.ə/",
    collocations_cn: ["社交媒体平台", "使用社交媒体", "社交媒体营销", "社交媒体影响"],
    example_sentence_cn: "社交媒体彻底改变了人们沟通和获取信息的方式。",
    synonyms_cn: ["社交网络", "社群媒体", "社交平台"],
  },
  "tech-013": {
    pronunciation: "/ˈiːˌkɒm.ɜːs/",
    collocations_cn: ["电子商务平台", "电子商务网站", "发展电子商务", "电子商务交易"],
    example_sentence_cn: "电子商务的快速发展正在重塑传统零售业的格局。",
    synonyms_cn: ["电商", "网络商务", "线上交易"],
  },
  "tech-014": {
    pronunciation: "/ˈsmɑːrt.fəʊn/",
    collocations_cn: ["智能手机", "智能手机应用", "智能手机用户", "智能手机普及"],
    example_sentence_cn: "智能手机的普及使人们可以随时随地获取信息和娱乐。",
    synonyms_cn: ["智慧型手机", "智能电话", "移动电话"],
  },
  "tech-015": {
    pronunciation: "/ˌɪn.əˈveɪ.ʃən/",
    collocations_cn: ["技术创新", "推动创新", "创新驱动", "创新精神"],
    example_sentence_cn: "技术创新是推动经济增长和提高生活质量的核心动力。",
    synonyms_cn: ["革新", "创新", "创造"],
  },
  "tech-016": {
    pronunciation: "/ˈbreɪk.θruː/",
    collocations_cn: ["重大突破", "技术突破", "取得突破", "突破性进展"],
    example_sentence_cn: "量子计算领域的最新突破可能彻底改变信息处理的方式。",
    synonyms_cn: ["重大进展", "关键突破", "飞跃"],
  },
  "tech-017": {
    pronunciation: "/ˌkʌt.ɪŋ ˈedʒ/",
    collocations_cn: ["尖端技术", "处于前沿", "尖端研究", "最前沿"],
    example_sentence_cn: "这家公司以其在人工智能领域的尖端技术而闻名。",
    synonyms_cn: ["前沿", "最先进", "前沿技术"],
  },
  "tech-018": {
    pronunciation: "/ˈæl.ɡə.rɪð.əm/",
    collocations_cn: ["算法设计", "复杂算法", "算法优化", "机器学习算法"],
    example_sentence_cn: "高效的算法是处理大规模数据集的基础。",
    synonyms_cn: ["计算程序", "运算规则", "演算法"],
  },
  "tech-019": {
    pronunciation: "/ˈdeɪ.tə.beɪs/",
    collocations_cn: ["数据库管理", "数据库系统", "数据库查询", "数据库技术"],
    example_sentence_cn: "一个设计良好的数据库对于高效存储和检索信息至关重要。",
    synonyms_cn: ["数据仓库", "数据库", "信息库"],
  },
  "tech-020": {
    pronunciation: "/ˈnet.wɜːk/",
    collocations_cn: ["网络连接", "社交网络", "网络系统", "网络基础设施"],
    example_sentence_cn: "强大的网络基础设施是现代数字经济的基础。",
    synonyms_cn: ["网络", "互联系统", "通讯网"],
  },
  "tech-021": {
    pronunciation: "/ˈsɒft.weər/",
    collocations_cn: ["软件开发", "软件系统", "软件工程", "应用软件"],
    example_sentence_cn: "软件开发已成为现代经济中最具活力的行业之一。",
    synonyms_cn: ["电脑程序", "应用程序", "软件系统"],
  },
  "tech-022": {
    pronunciation: "/ˈhɑːrd.weər/",
    collocations_cn: ["计算机硬件", "硬件设备", "硬件升级", "硬件制造"],
    example_sentence_cn: "硬件和软件的协同发展推动了个人计算的飞速进步。",
    synonyms_cn: ["硬体", "设备", "实体设备"],
  },
  "tech-023": {
    pronunciation: "/ˈjuː.zər ˈɪn.tə.feɪs/",
    collocations_cn: ["用户界面设计", "图形用户界面", "友好的用户界面", "用户界面改进"],
    example_sentence_cn: "直观的用户界面是决定应用程序成功与否的关键因素。",
    synonyms_cn: ["UI", "使用者界面", "操作界面"],
  },
  "tech-024": {
    pronunciation: "/ˌtel.ɪ.kəˈmjuː.tɪŋ/",
    collocations_cn: ["远程办公", "推行远程办公", "远程办公模式", "远程办公政策"],
    example_sentence_cn: "远程办公让员工可以在家工作，减少通勤时间和办公成本。",
    synonyms_cn: ["远程工作", "居家办公", "电子通勤"],
  },
  "tech-025": {
    pronunciation: "/rɪˈməʊt wɜːk/",
    collocations_cn: ["远程工作", "远程工作模式", "适应远程工作", "远程工作工具"],
    example_sentence_cn: "疫情后，许多公司决定永久保留远程工作的选项。",
    synonyms_cn: ["远程办公", "在线工作", "居家工作"],
  },
  "tech-026": {
    pronunciation: "/ˈdiːp ˈlɜː.nɪŋ/",
    collocations_cn: ["深度学习", "深度学习算法", "深度学习模型", "深度学习技术"],
    example_sentence_cn: "深度学习在图像识别和自然语言处理方面取得了显著成果。",
    synonyms_cn: ["深度神经网络", "深层学习", "深度机器学习"],
  },
  "tech-027": {
    pronunciation: "/rəʊˈbɒt.ɪks/",
    collocations_cn: ["机器人技术", "工业机器人", "机器人研究", "机器人应用"],
    example_sentence_cn: "机器人技术正在从制造业向服务业和医疗保健领域扩展。",
    synonyms_cn: ["机器人学", "自动化机械", "智能机械"],
  },
  "tech-028": {
    pronunciation: "/ˈkwɒn.təm kəmˈpjuː.tɪŋ/",
    collocations_cn: ["量子计算", "量子计算机", "量子计算研究", "量子计算技术"],
    example_sentence_cn: "量子计算有潜力解决传统计算机无法处理的复杂问题。",
    synonyms_cn: ["量子运算", "量子计算技术", "量子信息处理"],
  },
  "tech-029": {
    pronunciation: "/ˌbaɪ.əʊ.tekˈnɒl.ə.dʒi/",
    collocations_cn: ["生物技术", "生物技术产业", "生物技术研究", "生物技术应用"],
    example_sentence_cn: "生物技术正在推动医学、农业和环境保护领域的革新。",
    synonyms_cn: ["生物科技", "生技", "生物工程"],
  },
  "tech-030": {
    pronunciation: "/ˈdʒiː ˈpiː ˈes/",
    collocations_cn: ["全球定位系统", "GPS导航", "GPS跟踪", "GPS技术"],
    example_sentence_cn: "GPS技术使我们能够精确导航并追踪物体的实时位置。",
    synonyms_cn: ["卫星定位", "全球定位", "卫星导航"],
  },
  "tech-031": {
    pronunciation: "/ˈfaɪə.wɔːl/",
    collocations_cn: ["防火墙保护", "网络安全防火墙", "安装防火墙", "防火墙设置"],
    example_sentence_cn: "防火墙是保护计算机网络免受未授权访问的第一道防线。",
    synonyms_cn: ["网络防护墙", "安全屏障", "防护系统"],
  },
  "tech-032": {
    pronunciation: "/ɪnˈkrɪp.ʃən/",
    collocations_cn: ["数据加密", "加密技术", "端到端加密", "加密标准"],
    example_sentence_cn: "数据加密确保敏感信息在传输过程中不会被窃取。",
    synonyms_cn: ["加密", "密码保护", "编码技术"],
  },
  "tech-033": {
    pronunciation: "/ˈbænd.wɪdθ/",
    collocations_cn: ["网络带宽", "增加带宽", "带宽限制", "高带宽"],
    example_sentence_cn: "更高的网络带宽支持更快的数据传输和更流畅的视频流。",
    synonyms_cn: ["频宽", "传输容量", "数据速率"],
  },
  "tech-034": {
    pronunciation: "/ˌnae.noʊ.tekˈnɒl.ə.dʒi/",
    collocations_cn: ["纳米技术", "纳米技术应用", "纳米技术研究", "纳米技术产业"],
    example_sentence_cn: "纳米技术在材料科学和医学领域具有广阔的应用前景。",
    synonyms_cn: ["毫微技术", "分子制造", "纳米工程"],
  },
  "tech-035": {
    pronunciation: "/ˈɔː.tə.nə.məs ˈviː.ɪ.kəl/",
    collocations_cn: ["自动驾驶汽车", "自主驾驶车辆", "自动驾驶技术", "无人驾驶车辆"],
    example_sentence_cn: "自动驾驶汽车有望大幅减少交通事故并缓解城市拥堵。",
    synonyms_cn: ["无人驾驶汽车", "自动驾驶车辆", "智能汽车"],
  },
  "tech-036": {
    pronunciation: "/ˈweə.rə.bəl tekˈnɒl.ə.dʒi/",
    collocations_cn: ["可穿戴技术", "可穿戴设备", "智能穿戴", "可穿戴科技产品"],
    example_sentence_cn: "可穿戴技术如智能手表可以实时监测用户的健康数据。",
    synonyms_cn: ["穿戴设备", "智能穿戴", "随身科技"],
  },
  "tech-037": {
    pronunciation: "/ˈəʊ.pən sɔːs/",
    collocations_cn: ["开源软件", "开源项目", "开源社区", "开源代码"],
    example_sentence_cn: "开源软件促进了全球开发者之间的协作和创新。",
    synonyms_cn: ["开放源代码", "公开源码", "自由软件"],
  },
  "tech-038": {
    pronunciation: "/ˈvɪdʒ.u.əl.ʌɪˈzeɪ.ʃən/",
    collocations_cn: ["数据可视化", "可视化工具", "信息可视化", "可视化技术"],
    example_sentence_cn: "数据可视化将复杂的数据转化为易于理解的图形和图表。",
    synonyms_cn: ["可视化", "图示化", "视觉呈现"],
  },
  "tech-039": {
    pronunciation: "/dɪˈplɔɪ.mənt/",
    collocations_cn: ["软件部署", "部署策略", "快速部署", "云部署"],
    example_sentence_cn: "自动化部署流程可以大幅减少软件发布所需的时间和风险。",
    synonyms_cn: ["发布", "上线", "配置部署"],
  },
  "tech-040": {
    pronunciation: "/ˌəʊ.vəˈɹaɪd/",
    collocations_cn: ["覆盖方法", "安全覆盖", "优先级覆盖", "系统覆盖"],
    example_sentence_cn: "在面向对象编程中，子类可以重写父类的方法。",
    synonyms_cn: ["重写", "替换", "取代"],
  },
  "tech-041": {
    pronunciation: "/ˈæp.ɪ/",
    collocations_cn: ["应用程序接口", "API调用", "API开发", "REST API"],
    example_sentence_cn: "API允许不同的软件系统之间进行无缝的数据交换。",
    synonyms_cn: ["应用程序接口", "接口", "编程接口"],
  },
  "tech-042": {
    pronunciation: "/wɜːm/",
    collocations_cn: ["计算机蠕虫", "蠕虫病毒", "网络蠕虫", "蠕虫传播"],
    example_sentence_cn: "网络蠕虫可以自动复制并传播到其他计算机，造成大规模感染。",
    synonyms_cn: ["蠕虫病毒", "计算机蠕虫", "恶意蠕虫"],
  },
  "tech-043": {
    pronunciation: "/ˈkæʃ.ɪŋ/",
    collocations_cn: ["缓存机制", "数据缓存", "浏览器缓存", "缓存策略"],
    example_sentence_cn: "有效的缓存策略可以显著提高网站加载速度和用户体验。",
    synonyms_cn: ["高速缓存", "缓冲存储", "暂存"],
  },
  "tech-044": {
    pronunciation: "/ˈreɪ.di.eɪ.ʃən/",
    collocations_cn: ["电磁辐射", "辐射水平", "辐射防护", "核辐射"],
    example_sentence_cn: "长期暴露在高强度电磁辐射中可能对健康产生不利影响。",
    synonyms_cn: ["辐射", "放射", "射线"],
  },
  "tech-045": {
    pronunciation: "/ˈdʒen.ə.reɪ.tər/",
    collocations_cn: ["发电机", "电力发电机", "发电机运行", "备用发电机"],
    example_sentence_cn: "发电机在停电时为关键设施提供紧急电力供应。",
    synonyms_cn: ["发电设备", "电力发生器", "发电机组"],
  },
  "tech-046": {
    pronunciation: "/ˈɒp.tɪ.kəl ˈfaɪ.bər/",
    collocations_cn: ["光纤通信", "光纤网络", "光纤电缆", "光纤技术"],
    example_sentence_cn: "光纤技术提供了远超传统铜线电缆的数据传输速度。",
    synonyms_cn: ["光缆", "光导纤维", "光纤线缆"],
  },
  "tech-047": {
    pronunciation: "/ˈkɒn.səʊl/",
    collocations_cn: ["游戏机", "控制台", "操作台", "中控台"],
    example_sentence_cn: "最新一代的游戏机提供了令人惊叹的图像处理能力。",
    synonyms_cn: ["游戏主机", "控制面板", "终端"],
  },
  "tech-048": {
    pronunciation: "/ˈmeɪn.freɪm/",
    collocations_cn: ["大型计算机", "主机系统", "大型机技术", "主机架构"],
    example_sentence_cn: "大型计算机仍然在金融和政府部门的关键任务系统中发挥着重要作用。",
    synonyms_cn: ["大型主机", "大型计算机", "中央主机"],
  },
  "tech-049": {
    pronunciation: "/ˈbæt.ər.i/",
    collocations_cn: ["电池寿命", "锂离子电池", "电池技术", "更换电池"],
    example_sentence_cn: "电池技术的突破是推动电动汽车普及的关键因素。",
    synonyms_cn: ["电池", "蓄电池", "电源"],
  },
  "tech-050": {
    pronunciation: "/swɪtʃ/",
    collocations_cn: ["开关", "打开开关", "电源开关", "切换到"],
    example_sentence_cn: "这只是一个简单的开关，可以在手动和自动模式之间切换。",
    synonyms_cn: ["切换", "转换器", "开关装置"],
  },

  // ======== WORK (work-001 ~ work-050) ========
  "work-001": {
    pronunciation: "/wɜːk laɪf ˈbæl.əns/",
    collocations_cn: ["保持工作与生活的平衡", "改善工作与生活的平衡", "缺乏工作与生活的平衡", "促进工作与生活的平衡"],
    example_sentence_cn: "保持健康的工作与生活平衡对于长期职业发展和个人幸福至关重要。",
    synonyms_cn: ["工作生活协调", "职业与个人生活平衡", "劳逸平衡"],
  },
  "work-002": {
    pronunciation: "/dʒɒb ˌsæt.ɪsˈfæk.ʃən/",
    collocations_cn: ["提高工作满意度", "工作满意度调查", "员工工作满意度", "高工作满意度"],
    example_sentence_cn: "工作满意度不仅取决于薪酬，还取决于工作环境和职业发展机会。",
    synonyms_cn: ["职业满足感", "工作满意度", "职场满意度"],
  },
  "work-003": {
    pronunciation: "/kəˈrɪər ədˈvɑːns.mənt/",
    collocations_cn: ["职业发展", "追求职业晋升", "职业晋升机会", "促进职业发展"],
    example_sentence_cn: "持续学习和技能提升是职业发展的关键驱动力。",
    synonyms_cn: ["职业晋升", "职业发展", "职位提升"],
  },
  "work-004": {
    pronunciation: "/prəˈfeʃ.ən.əl dɪˈvel.əp.mənt/",
    collocations_cn: ["职业发展", "持续专业发展", "专业发展计划", "促进专业发展"],
    example_sentence_cn: "许多公司为员工提供专业发展培训以保持竞争力。",
    synonyms_cn: ["职业培训", "专业成长", "职业技能提升"],
  },
  "work-005": {
    pronunciation: "/ˈtiːm.wɜːk/",
    collocations_cn: ["团队合作", "促进团队合作", "有效的团队合作", "团队合作技能"],
    example_sentence_cn: "有效的团队合作是现代职场中最受重视的软技能之一。",
    synonyms_cn: ["协作", "团队协作", "合作精神"],
  },
  "work-006": {
    pronunciation: "/ˈliː.də.ʃɪp/",
    collocations_cn: ["领导力", "培养领导力", "领导技能", "强大的领导力"],
    example_sentence_cn: "优秀的领导力不仅关乎管理他人，更关乎激励和赋能团队成员。",
    synonyms_cn: ["领导能力", "领导才能", "管理能力"],
  },
  "work-007": {
    pronunciation: "/ˈwɜːk.pleɪs daɪˈvɜː.sə.ti/",
    collocations_cn: ["职场多元化", "促进多元化", "多元化和包容性", "重视职场多元化"],
    example_sentence_cn: "职场多元化能为企业带来更广泛的视角和更具创新性的解决方案。",
    synonyms_cn: ["工作场所多样性", "职场包容性", "多元文化工作环境"],
  },
  "work-008": {
    pronunciation: "/ɪmˈplɔɪ.iː məˈrɑːl/",
    collocations_cn: ["员工士气", "提升员工士气", "低迷的员工士气", "维持员工士气"],
    example_sentence_cn: "员工士气直接影响工作效率和公司的整体业绩。",
    synonyms_cn: ["员工积极性", "团队士气", "工作热情"],
  },
  "work-009": {
    pronunciation: "/ˌprɒd.ʌkˈtɪv.ə.ti/",
    collocations_cn: ["提高生产力", "劳动生产率", "生产力增长", "测量生产力"],
    example_sentence_cn: "合理的工作环境和工具可以显著提高员工的生产力。",
    synonyms_cn: ["生产效率", "产出效率", "工作效率"],
  },
  "work-010": {
    pronunciation: "/taɪm ˈmæn.ɪdʒ.mənt/",
    collocations_cn: ["时间管理", "良好的时间管理", "时间管理技能", "有效的时间管理"],
    example_sentence_cn: "良好的时间管理能力是高效完成工作的基础。",
    synonyms_cn: ["时间规划", "时间统筹", "时间分配"],
  },
  "work-011": {
    pronunciation: "/ˈded.laɪn/",
    collocations_cn: ["截止日期", "错过截止日期", "赶上截止日期", "设定截止日期"],
    example_sentence_cn: "在截止日期前交付高质量的工作是职场信誉的重要组成部分。",
    synonyms_cn: ["最后期限", "交期", "截止时间"],
  },
  "work-012": {
    pronunciation: "/ˈwɜːk.ləʊd/",
    collocations_cn: ["工作量", "沉重的工作量", "管理工作量", "减少工作量"],
    example_sentence_cn: "过重的工作量可能导致职业倦怠和健康问题。",
    synonyms_cn: ["工作负荷", "工作任务", "劳动量"],
  },
  "work-013": {
    pronunciation: "/prəˈməʊ.ʃən/",
    collocations_cn: ["晋升", "获得晋升", "升职机会", "晋升政策"],
    example_sentence_cn: "出色完成项目目标通常意味着更好的晋升机会。",
    synonyms_cn: ["升职", "职位提升", "晋级"],
  },
  "work-014": {
    pronunciation: "/ˈsæl.ər.i/",
    collocations_cn: ["薪水", "年薪", "高薪水", "薪水范围", "薪水谈判"],
    example_sentence_cn: "薪水仍然是大多数求职者选择职位时最重要的考量因素之一。",
    synonyms_cn: ["工资", "薪酬", "收入"],
  },
  "work-015": {
    pronunciation: "/weɪdʒ/",
    collocations_cn: ["最低工资", "小时工资", "工资水平", "工资增长"],
    example_sentence_cn: "政府定期调整最低工资标准以保障劳动者的基本生活。",
    synonyms_cn: ["工资", "薪酬", "报酬"],
  },
  "work-016": {
    pronunciation: "/ˈəʊ.və.taɪm/",
    collocations_cn: ["加班", "加班费", "大量加班", "强制加班"],
    example_sentence_cn: "长期加班不仅影响健康，还可能降低整体工作效率。",
    synonyms_cn: ["超时工作", "额外工时", "加班工作"],
  },
  "work-017": {
    pronunciation: "/ˌʌn.ɪmˈplɔɪ.mənt/",
    collocations_cn: ["失业率", "失业问题", "青年失业", "高失业率"],
    example_sentence_cn: "青年失业是许多国家面临的重大社会经济问题。",
    synonyms_cn: ["失业", "待业", "没有工作"],
  },
  "work-018": {
    pronunciation: "/dʒɒb ˈmɑːr.kɪt/",
    collocations_cn: ["就业市场", "竞争激烈的就业市场", "就业市场趋势", "进入就业市场"],
    example_sentence_cn: "当前的就业市场对具有数字技能的专业人才需求旺盛。",
    synonyms_cn: ["劳动力市场", "就业领域", "人才市场"],
  },
  "work-019": {
    pronunciation: "/rɪˈkruːt.mənt/",
    collocations_cn: ["招聘过程", "招聘机构", "招聘策略", "校园招聘"],
    example_sentence_cn: "有效的招聘流程是建立一支高素质团队的第一步。",
    synonyms_cn: ["招聘", "征才", "人才招募"],
  },
  "work-020": {
    pronunciation: "/ˈɪn.tɜːn.ʃɪp/",
    collocations_cn: ["实习", "参加实习", "实习项目", "暑期实习"],
    example_sentence_cn: "实习为学生提供了将课堂知识应用于实际工作环境的机会。",
    synonyms_cn: ["实习", "实习生项目", "工作见习"],
  },
  "work-021": {
    pronunciation: "/əˈpren.tɪs.ʃɪp/",
    collocations_cn: ["学徒制", "参加学徒培训", "学徒计划", "传统的学徒制度"],
    example_sentence_cn: "学徒制将实践培训和课堂教学相结合，培养技术熟练的工人。",
    synonyms_cn: ["学徒培训", "职业见习", "学徒工"],
  },
  "work-022": {
    pronunciation: "/ˈkɒl.iːɡ/",
    collocations_cn: ["同事", "与同事合作", "帮助同事", "同事关系"],
    example_sentence_cn: "与同事建立良好的工作关系有助于营造积极的工作氛围。",
    synonyms_cn: ["同事", "工作伙伴", "同仁"],
  },
  "work-023": {
    pronunciation: "/ɪmˈplɔɪ.ər/",
    collocations_cn: ["雇主", "潜在雇主", "雇主品牌", "雇主责任"],
    example_sentence_cn: "一个好的雇主不仅要提供有竞争力的薪酬，还要关心员工的职业发展。",
    synonyms_cn: ["用人单位", "雇佣方", "老板"],
  },
  "work-024": {
    pronunciation: "/ɪmˈplɔɪ.iː/",
    collocations_cn: ["员工", "雇员福利", "员工培训", "员工满意度"],
    example_sentence_cn: "员工是公司最宝贵的资产，他们的幸福直接影响企业的成功。",
    synonyms_cn: ["雇员", "职员", "工作人员"],
  },
  "work-025": {
    pronunciation: "/ˈbɜːn.aʊt/",
    collocations_cn: ["职业倦怠", "防止职业倦怠", "经历职业倦怠", "职业倦怠症状"],
    example_sentence_cn: "职业倦怠已成为现代职场中越来越普遍的心理健康问题。",
    synonyms_cn: ["工作倦怠", "职业疲劳", "精力耗竭"],
  },
  "work-026": {
    pronunciation: "/ˈfleks.ɪ.bəl ˈwɜː.kɪŋ/",
    collocations_cn: ["灵活工作制", "推行灵活工作", "灵活工作时间", "灵活工作安排"],
    example_sentence_cn: "灵活工作安排有助于员工更好地平衡工作与家庭责任。",
    synonyms_cn: ["弹性工作", "灵活工时", "工作弹性"],
  },
  "work-027": {
    pronunciation: "/ˌneɡ.əʊ.ʃiˈeɪ.ʃən/",
    collocations_cn: ["薪资谈判", "商业谈判", "谈判技巧", "和平谈判"],
    example_sentence_cn: "出色的谈判技巧可以帮助你在求职过程中获得更好的薪酬待遇。",
    synonyms_cn: ["协商", "议价", "商讨"],
  },
  "work-028": {
    pronunciation: "/ˈkɒn.trækt/",
    collocations_cn: ["签署合同", "劳动合同", "合同条款", "合同到期"],
    example_sentence_cn: "在签署劳动合同之前，务必仔细阅读所有条款和条件。",
    synonyms_cn: ["协议", "合约", "契约"],
  },
  "work-029": {
    pronunciation: "/freɪm/",
    collocations_cn: ["时间框架", "工作框架", "法律框架", "参考框架"],
    example_sentence_cn: "我们必须在给定的时间和预算框架内完成项目。",
    synonyms_cn: ["框架", "结构", "体系"],
  },
  "work-030": {
    pronunciation: "/ˈtraɪ.əl ˈpiː.ri.əd/",
    collocations_cn: ["试用期", "通过试用期", "三个月的试用期", "在试用期间"],
    example_sentence_cn: "新员工通常需要经过三个月的试用期才能成为正式员工。",
    synonyms_cn: ["实习期", "考察期", "试工期间"],
  },
  "work-031": {
    pronunciation: "/ˈrez.ɪɡˈneɪ.ʃən/",
    collocations_cn: ["辞职信", "提交辞职", "辞职通知", "辞职决定"],
    example_sentence_cn: "他经过深思熟虑后向公司提交了辞职信，准备开启新的职业生涯。",
    synonyms_cn: ["辞职", "离职", "请辞"],
  },
  "work-032": {
    pronunciation: "/rɪˈdʌn.dən.si/",
    collocations_cn: ["裁员", "被裁员", "裁员补偿", "被迫裁员"],
    example_sentence_cn: "经济衰退导致许多公司不得不进行大规模裁员以削减成本。",
    synonyms_cn: ["解雇", "失业", "人员精简"],
  },
  "work-033": {
    pronunciation: "/ˈpen.ʃən/",
    collocations_cn: ["退休金", "养老金计划", "养老金基金", "国家养老金"],
    example_sentence_cn: "一个良好的养老金计划是吸引和留住优秀员工的重要因素。",
    synonyms_cn: ["退休金", "养老储蓄", "年金"],
  },
  "work-034": {
    pronunciation: "/ˌʌn.dəˈteɪ.kɪŋ/",
    collocations_cn: ["事业", "商业项目", "重大的事业", "慈善项目"],
    example_sentence_cn: "创业是一个充满挑战但也极其有回报的事业。",
    synonyms_cn: ["事业", "项目", "企业"],
  },
  "work-035": {
    pronunciation: "/ˈhaɪ.ər/",
    collocations_cn: ["新员工", "招聘", "雇佣新员工", "最近的招聘"],
    example_sentence_cn: "公司计划今年招聘50名新员工以支持业务扩展。",
    synonyms_cn: ["新员工", "聘用", "招募"],
  },
  "work-036": {
    pronunciation: "/meɪt/",
    collocations_cn: ["队友", "同事", "室友", "同学"],
    example_sentence_cn: "一个好队友会在你需要帮助的时候伸出援手。",
    synonyms_cn: ["同事", "伙伴", "搭档"],
  },
  "work-037": {
    pronunciation: "/kwəʊt/",
    collocations_cn: ["报价", "引用一段话", "股票报价", "提供报价"],
    example_sentence_cn: "在开始工作之前，请确保您已经从供应商那里获得了详细的报价。",
    synonyms_cn: ["报价", "引述", "摘录"],
  },
  "work-038": {
    pronunciation: "/sɪft/",
    collocations_cn: ["筛选", "仔细筛选", "筛选简历", "筛选申请"],
    example_sentence_cn: "人力资源部门需要仔细筛选数百份简历来找到合适的候选人。",
    synonyms_cn: ["筛选", "过滤", "精选"],
  },
  "work-039": {
    pronunciation: "/draɪv/",
    collocations_cn: ["推动力", "积极进取", "开车", "驱动器"],
    example_sentence_cn: "内在的驱动力是持续学习和职业成长的关键。",
    synonyms_cn: ["动力", "驱动力", "动机"],
  },
  "work-040": {
    pronunciation: "/treɪd/",
    collocations_cn: ["行业", "贸易", "技术行业", "公平贸易"],
    example_sentence_cn: "学习一门技术行业可以为您的职业生涯提供稳定的基础。",
    synonyms_cn: ["行业", "职业", "行当"],
  },
  "work-041": {
    pronunciation: "/ˈent.rə.prəˌnɜːr/",
    collocations_cn: ["企业家", "成功的企业家", "企业家精神", "青年企业家"],
    example_sentence_cn: "成功的企业家往往具备创新思维和承担风险的勇气。",
    synonyms_cn: ["创业者", "企业家", "创业家"],
  },
  "work-042": {
    pronunciation: "/ˈreɪz/",
    collocations_cn: ["加薪", "提高", "筹集资金", "引起关注"],
    example_sentence_cn: "她在年度评估后获得了不错的加薪。",
    synonyms_cn: ["加薪", "提升", "增加"],
  },
  "work-043": {
    pronunciation: "/ˈben.ɪ.fɪt/",
    collocations_cn: ["员工福利", "福利待遇", "健康福利", "享受福利"],
    example_sentence_cn: "有竞争力的员工福利计划包括医疗保险、带薪休假和退休储蓄。",
    synonyms_cn: ["福利", "好处", "利益"],
  },
  "work-044": {
    pronunciation: "/ʃɪft/",
    collocations_cn: ["轮班工作", "夜班", "倒班", "值班"],
    example_sentence_cn: "轮班工作在医疗、制造和客户服务行业中非常普遍。",
    synonyms_cn: ["轮班", "排班", "换班"],
  },
  "work-045": {
    pronunciation: "/bəʊ.nəs/",
    collocations_cn: ["绩效奖金", "年终奖金", "奖金计划", "发放奖金"],
    example_sentence_cn: "绩效奖金是激励员工超额完成工作目标的有效手段。",
    synonyms_cn: ["奖金", "红利", "额外报酬"],
  },
  "work-046": {
    pronunciation: "/ˈvæn.tɪdʒ/",
    collocations_cn: ["优势", "有利地位", "独特优势", "竞争优势"],
    example_sentence_cn: "掌握多门外语在就业市场中具有明显的竞争优势。",
    synonyms_cn: ["优势", "有利条件", "好处"],
  },
  "work-047": {
    pronunciation: "/ˈfreʃ.mən/",
    collocations_cn: ["新人", "大一新生", "新入职者", "新来的"],
    example_sentence_cn: "作为职场新人，虚心学习和积极融入团队非常重要。",
    synonyms_cn: ["新人", "初学者", "新员工"],
  },
  "work-048": {
    pronunciation: "/ˈfreɪm.wɜːk/",
    collocations_cn: ["框架", "工作框架", "理论框架", "管理框架"],
    example_sentence_cn: "一个清晰的框架有助于组织思路并确保项目的系统推进。",
    synonyms_cn: ["框架", "结构体系", "纲要"],
  },
  "work-049": {
    pronunciation: "/ˌrez.ɪˈden.ʃəl/",
    collocations_cn: ["居民区", "住宅", "住宅建筑", "住宅项目"],
    example_sentence_cn: "许多远程工作者选择搬到生活成本更低的住宅区域。",
    synonyms_cn: ["住宅的", "居住的", "家居的"],
  },
  "work-050": {
    pronunciation: "/laɪ/",
    collocations_cn: ["在在于", "位于", "在于", "躺下"],
    example_sentence_cn: "这个问题的核心在于缺乏有效的沟通渠道。",
    synonyms_cn: ["在于", "位于", "存在"],
  },

  // ======== HEALTH (health-001 ~ health-050) ========
  "health-001": {
    pronunciation: "/ˈpʌb.lɪk helθ/",
    collocations_cn: ["公共卫生", "公共卫生系统", "公共卫生政策", "公共卫生危机"],
    example_sentence_cn: "投资公共卫生是预防疾病和延长国民寿命最有效的方式。",
    synonyms_cn: ["公共健康", "大众健康", "国民健康"],
  },
  "health-002": {
    pronunciation: "/ˈmen.təl helθ/",
    collocations_cn: ["心理健康", "提高心理健康意识", "心理健康问题", "心理健康服务"],
    example_sentence_cn: "心理健康与身体健康同等重要，需要得到同等重视。",
    synonyms_cn: ["心理卫生", "精神健康", "心理福祉"],
  },
  "health-003": {
    pronunciation: "/ˈfɪz.ɪ.kəl ˈfɪt.nəs/",
    collocations_cn: ["体能", "保持身体健康", "体能测试", "体能水平"],
    example_sentence_cn: "定期锻炼是维持良好体能的必要条件。",
    synonyms_cn: ["身体健康", "身体素质", "体格"],
  },
  "health-004": {
    pronunciation: "/njuːˈtrɪʃ.ən/",
    collocations_cn: ["营养", "良好的营养", "营养不足", "营养学"],
    example_sentence_cn: "均衡的营养对所有年龄段的人的健康都至关重要。",
    synonyms_cn: ["营养学", "饮食营养", "营养素"],
  },
  "health-005": {
    pronunciation: "/əʊˈbiː.sə.ti/",
    collocations_cn: ["肥胖症", "儿童肥胖", "肥胖率", "预防肥胖"],
    example_sentence_cn: "儿童肥胖率上升已成为全球公共卫生的重大挑战。",
    synonyms_cn: ["过度肥胖", "超重", "肥胖问题"],
  },
  "health-006": {
    pronunciation: "/ˈsed.ən.tər.i ˈlaɪf.staɪl/",
    collocations_cn: ["久坐的生活方式", "避免久坐生活", "改变久坐的生活方式", "久坐生活方式导致的疾病"],
    example_sentence_cn: "久坐的生活方式与多种慢性疾病的风险增加有关。",
    synonyms_cn: ["缺乏运动的生活", "静态生活方式", "不活跃生活"],
  },
  "health-007": {
    pronunciation: "/ˈhelθ.keər ˈsɪs.təm/",
    collocations_cn: ["医疗保健系统", "完善医疗系统", "医疗改革", "公共医疗系统"],
    example_sentence_cn: "一个高效的医疗保健系统应该在成本和质量之间取得平衡。",
    synonyms_cn: ["卫生系统", "医疗体系", "健康服务体系"],
  },
  "health-008": {
    pronunciation: "/ˌvæk.sɪˈneɪ.ʃən/",
    collocations_cn: ["疫苗接种", "疫苗接种计划", "疫苗接种率", "接种疫苗"],
    example_sentence_cn: "广泛的疫苗接种是控制传染性疾病传播最有效的公共卫生措施之一。",
    synonyms_cn: ["预防接种", "免疫接种", "打疫苗"],
  },
  "health-009": {
    pronunciation: "/laɪf ɪkˈspek.tən.si/",
    collocations_cn: ["预期寿命", "提高预期寿命", "平均预期寿命", "预期寿命增长"],
    example_sentence_cn: "医疗进步和卫生条件改善显著提高了全球人口的预期寿命。",
    synonyms_cn: ["平均寿命", "寿命预期", "人均寿命"],
  },
  "health-010": {
    pronunciation: "/ˈkrɒn.ɪk dɪˈziːz/",
    collocations_cn: ["慢性疾病", "管理慢性疾病", "慢性疾病预防", "患有慢性疾病"],
    example_sentence_cn: "生活方式干预对预防和管理慢性疾病至关重要。",
    synonyms_cn: ["慢性病", "长期疾病", "持续性病症"],
  },
  "health-011": {
    pronunciation: "/ɪnˈfek.ʃəs dɪˈziːz/",
    collocations_cn: ["传染病", "控制传染病", "传染病爆发", "传染病预防"],
    example_sentence_cn: "全球化为传染病的快速传播创造了前所未有的条件。",
    synonyms_cn: ["传染病", "感染性疾病", "传播性疾病"],
  },
  "health-012": {
    pronunciation: "/prɪˈven.tɪv ˈmed.ɪ.sɪn/",
    collocations_cn: ["预防医学", "预防医疗", "定期预防体检", "预防医疗保健"],
    example_sentence_cn: "预防医学专注于在疾病发生之前识别并消除风险因素。",
    synonyms_cn: ["预防性医疗", "疾病预防", "保健医学"],
  },
  "health-013": {
    pronunciation: "/helθ əˈweə.nəs/",
    collocations_cn: ["健康意识", "提高健康意识", "健康意识活动", "公众健康意识"],
    example_sentence_cn: "提高公众健康意识是减少可预防疾病的关键策略。",
    synonyms_cn: ["健康认知", "卫生意识", "保健意识"],
  },
  "health-014": {
    pronunciation: "/stres ˈmæn.ɪdʒ.mənt/",
    collocations_cn: ["压力管理", "学习压力管理", "压力管理技巧", "有效的压力管理"],
    example_sentence_cn: "学习压力管理技巧有助于预防职业倦怠和维护心理健康。",
    synonyms_cn: ["减压管理", "压力缓解", "压力应对"],
  },
  "health-015": {
    pronunciation: "/ˌwel ˈbiː.ɪŋ/",
    collocations_cn: ["幸福感", "心理福祉", "员工福祉", "促进福祉"],
    example_sentence_cn: "身心健康是衡量生活质量和幸福感的综合指标。",
    synonyms_cn: ["幸福", "安康", "身心健康"],
  },
  "health-016": {
    pronunciation: "/ˈdaɪ.ə.tər.i ˈhæb.ɪts/",
    collocations_cn: ["饮食习惯", "改变饮食习惯", "不健康的饮食习惯", "良好的饮食习惯"],
    example_sentence_cn: "从小养成健康的饮食习惯对预防慢性疾病非常重要。",
    synonyms_cn: ["进食习惯", "饮食模式", "饮食行为"],
  },
  "health-017": {
    pronunciation: "/dʒʌŋk fuːd/",
    collocations_cn: ["垃圾食品", "减少垃圾食品消费", "垃圾食品广告", "垃圾食品的危害"],
    example_sentence_cn: "经常食用垃圾食品与肥胖和心血管疾病的风险增加有关。",
    synonyms_cn: ["不健康食品", "快餐食品", "高热量零食"],
  },
  "health-018": {
    pronunciation: "/ˈbæl.ənst ˈdaɪ.ət/",
    collocations_cn: ["均衡饮食", "保持均衡饮食", "均衡饮食的重要性", "饮食均衡"],
    example_sentence_cn: "均衡饮食应包含足够的蛋白质、碳水化合物、脂肪、维生素和矿物质。",
    synonyms_cn: ["平衡膳食", "营养均衡饮食", "健康饮食"],
  },
  "health-019": {
    pronunciation: "/ˈek.sə.saɪz ruːˈtiːn/",
    collocations_cn: ["锻炼习惯", "定期锻炼计划", "养成锻炼习惯", "每日锻炼"],
    example_sentence_cn: "建立规律的锻炼习惯是维持长期健康的关键。",
    synonyms_cn: ["运动计划", "锻炼方案", "健身常规"],
  },
  "health-020": {
    pronunciation: "/ˌkɑːr.di.əʊˈvæs.kjʊ.lər/",
    collocations_cn: ["心血管健康", "心血管疾病", "心血管系统", "心血管锻炼"],
    example_sentence_cn: "经常进行有氧运动有助于改善心血管健康状况。",
    synonyms_cn: ["心脏血管", "心血管的", "循环系统"],
  },
  "health-021": {
    pronunciation: "/ɪˈmjuːn ˈsɪs.təm/",
    collocations_cn: ["免疫系统", "增强免疫系统", "免疫系统功能", "弱化免疫系统"],
    example_sentence_cn: "充足的睡眠和均衡的饮食对维持健康的免疫系统至关重要。",
    synonyms_cn: ["免疫力", "免疫机制", "防御系统"],
  },
  "health-022": {
    pronunciation: "/ˌdaɪ.əɡˈnəʊ.sɪs/",
    collocations_cn: ["诊断", "早期诊断", "做出诊断", "诊断结果"],
    example_sentence_cn: "早期诊断和治疗显著提高了许多癌症患者的生存率。",
    synonyms_cn: ["诊断", "确诊", "判断"],
  },
  "health-023": {
    pronunciation: "/ˈtriːt.mənt/",
    collocations_cn: ["治疗方案", "接受治疗", "治疗方法", "药物治疗"],
    example_sentence_cn: "个性化的治疗方案能够更有效地应对每个患者的具体情况。",
    synonyms_cn: ["疗法", "诊治", "医治"],
  },
  "health-024": {
    pronunciation: "/ˈsɪmp.təm/",
    collocations_cn: ["症状", "出现症状", "早期症状", "流感症状"],
    example_sentence_cn: "如果你出现任何新冠肺炎症状，应该立即进行检测并自我隔离。",
    synonyms_cn: ["症状", "征兆", "临床表现"],
  },
  "health-025": {
    pronunciation: "/ˈθer.ə.pi/",
    collocations_cn: ["治疗方案", "物理治疗", "心理治疗", "基因疗法"],
    example_sentence_cn: "认知行为疗法是治疗焦虑和抑郁最有效的心理疗法之一。",
    synonyms_cn: ["治疗", "疗法", "康复治疗"],
  },
  "health-026": {
    pronunciation: "/ˈep.ɪ.dem.ɪk/",
    collocations_cn: ["流行病", "疫情爆发", "控制流行病", "流行病学"],
    example_sentence_cn: "肥胖已成为一种全球性流行病，影响着发达国家和发展中国家。",
    synonyms_cn: ["传染病流行", "瘟疫", "疾病蔓延"],
  },
  "health-027": {
    pronunciation: "/pænˈdem.ɪk/",
    collocations_cn: ["大流行病", "全球大流行", "大流行应对", "宣布大流行"],
    example_sentence_cn: "新冠疫情提醒世界，全球大流行病的威胁始终存在。",
    synonyms_cn: ["全球流行病", "大规模疫情", "全球性传染病"],
  },
  "health-028": {
    pronunciation: "/hɪˈdʒiː.nɪk/",
    collocations_cn: ["卫生的", "卫生条件", "卫生标准", "清洁卫生"],
    example_sentence_cn: "保持良好的个人卫生习惯对于预防疾病传播至关重要。",
    synonyms_cn: ["卫生的", "清洁的", "保健的"],
  },
  "health-029": {
    pronunciation: "/ˈhɑːr.mə.ni/",
    collocations_cn: ["和谐", "社会和谐", "与自然和谐相处", "和谐关系"],
    example_sentence_cn: "身心健康有助于实现工作与生活的和谐。",
    synonyms_cn: ["和谐", "协调", "平衡"],
  },
  "health-030": {
    pronunciation: "/ˈfɑː.mə.sɪst/",
    collocations_cn: ["药剂师", "咨询药剂师", "社区药剂师", "注册药剂师"],
    example_sentence_cn: "药剂师可以提供关于处方药和非处方药的用药指导。",
    synonyms_cn: ["药师", "调剂师", "药剂专家"],
  },
  "health-031": {
    pronunciation: "/ˈser.ə.təʊ.nɪn/",
    collocations_cn: ["血清素", "血清素水平", "提高血清素", "血清素缺乏"],
    example_sentence_cn: "运动和阳光照射可以自然提高体内的血清素水平，改善情绪。",
    synonyms_cn: ["5-羟色胺", "血清张力素", "快乐激素"],
  },
  "health-032": {
    pronunciation: "/ˈmæs.ɑːʒ/",
    collocations_cn: ["按摩", "按摩疗法", "颈部和肩部按摩", "放松按摩"],
    example_sentence_cn: "定期按摩有助于缓解肌肉紧张和改善血液循环。",
    synonyms_cn: ["推拿", "按摩疗法", "舒压按摩"],
  },
  "health-033": {
    pronunciation: "/dɪˈtek.ʃən/",
    collocations_cn: ["检测", "早期检测", "癌症检测", "检测方法"],
    example_sentence_cn: "早期检测是提高许多疾病治愈率的关键因素。",
    synonyms_cn: ["发现", "查出", "诊断"],
  },
  "health-034": {
    pronunciation: "/ɪnˈfleɪ.ʃən/",
    collocations_cn: ["炎症", "通货膨胀", "慢性炎症", "抗炎"],
    example_sentence_cn: "慢性炎症与许多现代疾病包括心脏病和糖尿病有关。",
    synonyms_cn: ["发炎", "红肿", "炎症反应"],
  },
  "health-035": {
    pronunciation: "/ˈflɛk.sər/",
    collocations_cn: ["屈肌", "髋屈肌", "屈肌伸展", "腕屈肌"],
    example_sentence_cn: "长时间坐着会导致髋屈肌变得紧张和缩短。",
    synonyms_cn: ["屈曲肌肉", "收缩肌", "弯曲肌"],
  },
  "health-036": {
    pronunciation: "/haɪˈdʒiːn/",
    collocations_cn: ["卫生", "个人卫生", "口腔卫生", "卫生习惯"],
    example_sentence_cn: "良好的个人卫生是预防感染性疾病的第一道防线。",
    synonyms_cn: ["卫生", "清洁", "保健"],
  },
  "health-037": {
    pronunciation: "/ˈep.aɪˌlɛp.si/",
    collocations_cn: ["癫痫", "癫痫发作", "癫痫治疗", "癫痫患者"],
    example_sentence_cn: "癫痫是一种神经系统疾病，需要持续的医疗管理和治疗。",
    synonyms_cn: ["羊痫风", "抽搐症", "羊角风"],
  },
  "health-038": {
    pronunciation: "/ɪkˈskriː.ʃən/",
    collocations_cn: ["排泄", "排泄系统", "废物排泄", "排泄功能"],
    example_sentence_cn: "肾脏在人体的废物排泄和体液平衡中起着关键作用。",
    synonyms_cn: ["排泄", "排出", "分泌排出"],
  },
  "health-039": {
    pronunciation: "/ˈɒp.tɪ.kəl/",
    collocations_cn: ["视觉的", "光学的", "光学仪器", "视神经"],
    example_sentence_cn: "定期进行视力检查可以及早发现视力健康问题。",
    synonyms_cn: ["视力的", "光学的", "视觉器官的"],
  },
  "health-040": {
    pronunciation: "/ekˈskriːt/",
    collocations_cn: ["排泄", "分泌出", "排出", "排泄废物"],
    example_sentence_cn: "运动后身体通过汗液排出一部分盐分和水分。",
    synonyms_cn: ["排出", "分泌", "排泄出"],
  },
  "health-041": {
    pronunciation: "/ˈswel.ɪŋ/",
    collocations_cn: ["肿胀", "关节肿胀", "减轻肿胀", "肿胀部位"],
    example_sentence_cn: "脚踝肿胀可能是由于长时间站立或潜在的健康问题引起的。",
    synonyms_cn: ["浮肿", "水肿", "肿起"],
  },
  "health-042": {
    pronunciation: "/ˈtren.di/",
    collocations_cn: ["时髦的", "流行趋势", "时尚饮食", "最新潮流"],
    example_sentence_cn: "不要盲目追求时髦的饮食方式，科学的均衡营养才是关键。",
    synonyms_cn: ["时尚的", "流行的", "前卫的"],
  },
  "health-043": {
    pronunciation: "/ˈswiː.tən.ər/",
    collocations_cn: ["甜味剂", "人造甜味剂", "天然甜味剂", "低热量甜味剂"],
    example_sentence_cn: "人造甜味剂虽然不含热量，但长期使用可能对肠道菌群有影响。",
    synonyms_cn: ["代糖", "甜味料", "甘味剂"],
  },
  "health-044": {
    pronunciation: "/swiːt/",
    collocations_cn: ["甜的", "甜食", "糖果", "甜饮料"],
    example_sentence_cn: "减少甜食和含糖饮料的摄入是维持健康体重的重要步骤。",
    synonyms_cn: ["含糖的", "甘甜的", "高糖的"],
  },
  "health-045": {
    pronunciation: "/fæt/",
    collocations_cn: ["脂肪", "饱和脂肪", "不健康脂肪", "身体脂肪"],
    example_sentence_cn: "并非所有脂肪都是坏的，不饱和脂肪对心脏健康有益。",
    synonyms_cn: ["脂类", "油脂", "脂肪组织"],
  },
  "health-046": {
    pronunciation: "/ˈsəʊ.di.əm/",
    collocations_cn: ["钠", "钠摄入量", "低钠饮食", "钠含量"],
    example_sentence_cn: "摄入过多的钠是导致高血压的主要饮食因素之一。",
    synonyms_cn: ["钠元素", "盐分", "食盐成分"],
  },
  "health-047": {
    pronunciation: "/ˈkæl.si.əm/",
    collocations_cn: ["钙", "钙摄入", "钙补充剂", "钙质"],
    example_sentence_cn: "钙质对骨骼健康和预防骨质疏松至关重要。",
    synonyms_cn: ["钙元素", "钙质", "骨矿物质"],
  },
  "health-048": {
    pronunciation: "/kæmp/",
    collocations_cn: ["露营", "训练营", "夏令营", "营地"],
    example_sentence_cn: "参加健身训练营是快速启动健康生活方式的好方法。",
    synonyms_cn: ["营地", "野外营地", "集训营"],
  },
  "health-049": {
    pronunciation: "/ˈmaɪ.krəʊb/",
    collocations_cn: ["微生物", "肠道微生物", "微生物群落", "有益微生物"],
    example_sentence_cn: "肠道微生物对人体消化和免疫系统功能有着深远的影响。",
    synonyms_cn: ["细菌", "微生物", "微菌"],
  },
  "health-050": {
    pronunciation: "/ˈmɑɪ.krə.skəʊp/",
    collocations_cn: ["显微镜", "电子显微镜", "在显微镜下观察", "显微镜检查"],
    example_sentence_cn: "在显微镜下，我们可以看到肉眼无法察觉的微生物世界。",
    synonyms_cn: ["显微镜", "显微仪器", "放大镜"],
  },

  // ======== CITY (city-001 ~ city-050) ========
  "city-001": {
    pronunciation: "/ˌɜː.bən.aɪˈzeɪ.ʃən/",
    collocations_cn: ["城市化进程", "快速城市化", "城市化率", "城市化带来的挑战"],
    example_sentence_cn: "快速城市化给住房、交通和环境带来了前所未有的压力。",
    synonyms_cn: ["都市化", "城镇发展", "城市化趋势"],
  },
  "city-002": {
    pronunciation: "/ˈɪn.frəˌstrʌk.tʃər/",
    collocations_cn: ["基础设施建设", "改善基础设施", "城市基础设施", "基础设施投资"],
    example_sentence_cn: "完善的基础设施是城市经济繁荣和居民生活质量的基础。",
    synonyms_cn: ["城市设施", "基础建设", "公共设施"],
  },
  "city-003": {
    pronunciation: "/ˈpʌb.lɪk ˈtræn.spɔːrt/",
    collocations_cn: ["公共交通", "使用公共交通", "公共交通系统", "公共交通改善"],
    example_sentence_cn: "高效便捷的公共交通是减少城市交通拥堵的关键。",
    synonyms_cn: ["大众运输", "公交系统", "公共交通网"],
  },
  "city-004": {
    pronunciation: "/ˈtræf.ɪk kənˈdʒes.tʃən/",
    collocations_cn: ["交通拥堵", "缓解交通拥堵", "严重的交通拥堵", "交通拥堵收费"],
    example_sentence_cn: "交通拥堵不仅浪费时间，还加剧了空气污染和能源消耗。",
    synonyms_cn: ["交通堵塞", "塞车", "道路拥堵"],
  },
  "city-005": {
    pronunciation: "/ˈhaʊ.zɪŋ əˌfɔːr.dəˈbɪl.ə.ti/",
    collocations_cn: ["住房可负担性", "住房可负担性问题", "改善住房可负担性", "住房可负担性危机"],
    example_sentence_cn: "住房可负担性已成为许多大城市年轻一代面临的最大挑战。",
    synonyms_cn: ["住房负担能力", "购房压力", "房价可承受"],
  },
  "city-006": {
    pronunciation: "/haɪ raɪz ˈbɪl.dɪŋ/",
    collocations_cn: ["高层建筑", "建造高层建筑", "高层住宅楼", "高层商业楼"],
    example_sentence_cn: "高层建筑是在有限土地上容纳更多人口的有效方式。",
    synonyms_cn: ["摩天楼", "大厦", "超高层建筑"],
  },
  "city-007": {
    pronunciation: "/ˈsʌb.ɜːb/",
    collocations_cn: ["郊区", "住在郊区", "郊区发展", "城市郊区"],
    example_sentence_cn: "许多家庭选择搬到郊区以寻求更大的居住空间和更好的环境。",
    synonyms_cn: ["城郊", "近郊", "市郊"],
  },
  "city-008": {
    pronunciation: "/ˌmet.rəˈpɒl.ɪ.tən/",
    collocations_cn: ["大都市", "大都市区", "大都市生活", "大都市发展"],
    example_sentence_cn: "大都市通常提供更多的工作机会和文化娱乐选择。",
    synonyms_cn: ["大城市的", "都会的", "都市的"],
  },
  "city-009": {
    pronunciation: "/ˌpɒp.jʊˈleɪ.ʃən ˈden.sɪ.ti/",
    collocations_cn: ["人口密度", "高人口密度", "人口密度增加", "降低人口密度"],
    example_sentence_cn: "高人口密度城市在公共卫生危机期间面临独特的挑战。",
    synonyms_cn: ["人口集中度", "居住密度", "人口稠密"],
  },
  "city-010": {
    pronunciation: "/rʌʃ aʊər/",
    collocations_cn: ["交通高峰时段", "避开高峰时段", "早高峰时段", "高峰时段交通"],
    example_sentence_cn: "在高峰时段通勤往往需要花费正常时间的两倍以上。",
    synonyms_cn: ["交通高峰期", "繁忙时段", "人流高峰"],
  },
  "city-011": {
    pronunciation: "/ɡriːn speɪs/",
    collocations_cn: ["绿地", "增加绿地", "城市绿地", "公共绿地"],
    example_sentence_cn: "城市绿地不仅美化环境，还为居民提供了休闲和社交的场所。",
    synonyms_cn: ["绿化地带", "公园绿地", "开放空间"],
  },
  "city-012": {
    pronunciation: "/ˈɜː.bən ˈplæn.ɪŋ/",
    collocations_cn: ["城市规划", "可持续的城市规划", "城市规划政策", "城市规划和设计"],
    example_sentence_cn: "良好的城市规划应平衡经济发展与环境保护和社会公平。",
    synonyms_cn: ["城市规划", "城市设计", "城镇布局"],
  },
  "city-013": {
    pronunciation: "/smɑːrt ˈsɪt.i/",
    collocations_cn: ["智慧城市", "智慧城市建设", "智慧城市技术", "未来的智慧城市"],
    example_sentence_cn: "智慧城市利用数字技术提高城市服务的效率和居民的生活质量。",
    synonyms_cn: ["智能城市", "智慧都市", "科技城市"],
  },
  "city-014": {
    pronunciation: "/ˈkʌl.tʃər.əl daɪˈvɜː.sə.ti/",
    collocations_cn: ["文化多样性", "促进文化多样性", "丰富的文化多样性", "尊重文化多样性"],
    example_sentence_cn: "文化多样性使城市成为充满活力和创造力的中心。",
    synonyms_cn: ["文化多元性", "文化丰富性", "多样文化"],
  },
  "city-015": {
    pronunciation: "/kɒst əv ˈlɪv.ɪŋ/",
    collocations_cn: ["生活成本", "高昂的生活成本", "生活成本上升", "降低生活成本"],
    example_sentence_cn: "大城市的高生活成本是许多年轻人外出谋生的主要障碍。",
    synonyms_cn: ["生活费", "居住成本", "生活开支"],
  },
  "city-016": {
    pronunciation: "/mjuːˈnɪs.ɪ.pəl/",
    collocations_cn: ["市政", "市政府", "市政服务", "市政选举"],
    example_sentence_cn: "市政府负责提供垃圾收集、道路维护等基本公共服务。",
    synonyms_cn: ["城市的", "市政府的", "市立的"],
  },
  "city-017": {
    pronunciation: "/ˌrez.ɪˈden.ʃəl ˈeə.ri.ə/",
    collocations_cn: ["住宅区", "安静的住宅区", "位于住宅区", "规划住宅区"],
    example_sentence_cn: "这个安静的住宅区距离市中心只有20分钟的地铁路程。",
    synonyms_cn: ["居住区", "住宅区域", "居民区"],
  },
  "city-018": {
    pronunciation: "/kəˈmɜː.ʃəl ˈdɪs.trɪkt/",
    collocations_cn: ["商业区", "繁华的商业区", "主要商业区", "市中心商业区"],
    example_sentence_cn: "商业区聚集了大量的办公楼、商店和餐馆。",
    synonyms_cn: ["商业中心", "商贸区", "商务区"],
  },
  "city-019": {
    pronunciation: "/əˈmiː.nə.tiz/",
    collocations_cn: ["便利设施", "公共设施", "现代化设施", "生活设施"],
    example_sentence_cn: "良好的社区便利设施包括超市、学校、医院和休闲场所。",
    synonyms_cn: ["公共设施", "基础设施", "便民设施"],
  },
  "city-020": {
    pronunciation: "/ˌəʊ.vəˈkraʊ.dɪŋ/",
    collocations_cn: ["过度拥挤", "监狱过度拥挤", "过度拥挤的城市", "缓解过度拥挤"],
    example_sentence_cn: "过度拥挤是许多大城市面临的社会和健康问题之一。",
    synonyms_cn: ["拥挤不堪", "人口过剩", "过于拥挤"],
  },
  "city-021": {
    pronunciation: "/ˈnaɪt.laɪf/",
    collocations_cn: ["夜生活", "丰富的夜生活", "夜生活场所", "夜生活区"],
    example_sentence_cn: "这个城市以丰富多彩的夜生活和娱乐场所而闻名。",
    synonyms_cn: ["夜生活", "夜间娱乐", "夜市生活"],
  },
  "city-022": {
    pronunciation: "/ˈpɑːr.kɪŋ/",
    collocations_cn: ["停车", "停车场", "停车位", "停车费"],
    example_sentence_cn: "在市中心找停车位是许多驾车通勤者每天的烦恼。",
    synonyms_cn: ["泊车", "停放车辆", "汽车停放"],
  },
  "city-023": {
    pronunciation: "/ˈruːr.əl ˈeə.ri.ə/",
    collocations_cn: ["农村地区", "农村发展", "农村生活", "农村社区"],
    example_sentence_cn: "政府正在采取措施缩小城乡之间在医疗和教育上的差距。",
    synonyms_cn: ["乡村地区", "农村地带", "乡间"],
  },
  "city-024": {
    pronunciation: "/ˈsʌb.wɛr/",
    collocations_cn: ["地铁", "坐地铁", "地铁站", "地铁线路"],
    example_sentence_cn: "地铁是大城市中最快速、最可靠的公共交通方式之一。",
    synonyms_cn: ["地下铁", "地铁系统", "轨道交通"],
  },
  "city-025": {
    pronunciation: "/skai.skreɪ.pər/",
    collocations_cn: ["摩天大楼", "建造摩天大楼", "摩天大楼群", "标志性摩天大楼"],
    example_sentence_cn: "城市天际线上那些令人印象深刻的摩天大楼象征着经济繁荣。",
    synonyms_cn: ["摩天大厦", "高层地标", "巨厦"],
  },
  "city-026": {
    pronunciation: "/ˈlaɪt ˌpɒlˈuː.ʃən/",
    collocations_cn: ["光污染", "减少光污染", "城市光污染", "光污染问题"],
    example_sentence_cn: "城市光污染不仅浪费能源，还影响野生动物的自然周期。",
    synonyms_cn: ["光污染", "人工照明污染", "夜间光害"],
  },
  "city-027": {
    pronunciation: "/ˈsaɪd.wɔːk/",
    collocations_cn: ["人行道", "在街上", "走人行道", "人行道咖啡座"],
    example_sentence_cn: "宽敞整洁的人行道鼓励更多的人选择步行而非驾车出行。",
    synonyms_cn: ["人行便道", "步道", "走道"],
  },
  "city-028": {
    pronunciation: "/ˈlænd.skeɪp/",
    collocations_cn: ["景观", "城市景观", "景观设计", "自然景观"],
    example_sentence_cn: "精心设计的城市景观可以提升居民的生活质量和幸福感。",
    synonyms_cn: ["风景", "景色", "地貌"],
  },
  "city-029": {
    pronunciation: "/ˈpæv.ɪlj.ən/",
    collocations_cn: ["凉亭", "展览馆", "运动场看台", "园区亭阁"],
    example_sentence_cn: "公园内新建的凉亭成为居民休息和社交的热门场所。",
    synonyms_cn: ["亭子", "展馆", "阁楼"],
  },
  "city-030": {
    pronunciation: "/ˈeɪ.vi.eɪ.tər/",
    collocations_cn: ["飞行员", "航空先驱", "飞行爱好者", "试飞员"],
    example_sentence_cn: "飞行员需要经过多年严格的训练才能驾驶商业航班。",
    synonyms_cn: ["飞行驾驶员", "飞机师", "航空员"],
  },
  "city-031": {
    pronunciation: "/ˈæt.ɪk/",
    collocations_cn: ["阁楼", "在阁楼上", "阁楼空间", "改建阁楼"],
    example_sentence_cn: "他们将阁楼改造成了一间温馨的客卧。",
    synonyms_cn: ["顶楼空间", "屋顶空间", "阁楼层"],
  },
  "city-032": {
    pronunciation: "/beɪs.mənt/",
    collocations_cn: ["地下室", "地下室公寓", "地下停车场", "在地下室"],
    example_sentence_cn: "许多老建筑的地下室被改造成时尚的酒吧和咖啡厅。",
    synonyms_cn: ["地库", "地下层", "地窖"],
  },
  "city-033": {
    pronunciation: "/ˈrʌn.ər/",
    collocations_cn: ["跑步者", "马拉松跑步者", "晨跑的人", "跑道"],
    example_sentence_cn: "清晨的公园里总是有很多跑步者在锻炼。",
    synonyms_cn: ["跑者", "慢跑者", "赛跑者"],
  },
  "city-034": {
    pronunciation: "/ˈfreʃ.wɔː.tər/",
    collocations_cn: ["淡水", "淡水资源", "淡水湖", "淡水供应"],
    example_sentence_cn: "城市淡水资源的可持续管理对居民生活和经济发展至关重要。",
    synonyms_cn: ["干净水", "清水", "淡水资源"],
  },
  "city-035": {
    pronunciation: "/ˈdɪs.trɪkt/",
    collocations_cn: ["行政区", "商业区", "学区", "选区"],
    example_sentence_cn: "每个行政区都有自己的特色和文化底蕴。",
    synonyms_cn: ["地区", "区域", "行政区划"],
  },
  "city-036": {
    pronunciation: "/ˈneɪ.bər.hʊd/",
    collocations_cn: ["社区", "邻里关系", "友好社区", "社区服务"],
    example_sentence_cn: "一个和谐友好的社区让居民感到安全和归属感。",
    synonyms_cn: ["邻里", "街坊", "住宅社区"],
  },
  "city-037": {
    pronunciation: "/ˈfæs.ɪ.leɪt/",
    collocations_cn: ["促进", "方便", "帮助实现", "推动"],
    example_sentence_cn: "新开通的地铁线路将大大方便市民的日常通勤。",
    synonyms_cn: ["促进", "帮助", "推动"],
  },
  "city-038": {
    pronunciation: "/baɪˈsɪk.əl/",
    collocations_cn: ["自行车", "骑自行车", "自行车道", "共享单车"],
    example_sentence_cn: "骑自行车不仅是环保的交通方式，还是很好的运动。",
    synonyms_cn: ["单车", "脚踏车", "自行车"],
  },
  "city-039": {
    pronunciation: "/ˈpiː.dɪs.tri.ən/",
    collocations_cn: ["行人", "行人安全", "行人专用区", "步行者"],
    example_sentence_cn: "城市应该为行人提供更多安全的步行空间和过街设施。",
    synonyms_cn: ["步行者", "路人", "行人"],
  },
  "city-040": {
    pronunciation: "/ˈven.tɪ.leɪ.ʃən/",
    collocations_cn: ["通风", "通风系统", "良好通风", "自然通风"],
    example_sentence_cn: "良好的通风对于保持室内空气质量和预防霉菌至关重要。",
    synonyms_cn: ["空气流通", "换气", "排风"],
  },
  "city-041": {
    pronunciation: "/ˈsept.ɪk/",
    collocations_cn: ["化粪池", "受感染的", "腐败性", "有细菌的"],
    example_sentence_cn: "郊区的许多房屋使用化粪池系统来处理生活废水。",
    synonyms_cn: ["腐败的", "感染的", "排污的"],
  },
  "city-042": {
    pronunciation: "/ˈdrɪŋ.kɪŋ/",
    collocations_cn: ["饮用水", "适合饮用的", "饮水", "饮用"],
    example_sentence_cn: "确保所有居民都能获得干净的饮用水是城市的基本责任。",
    synonyms_cn: ["可饮用的", "饮用", "饮用的"],
  },
  "city-043": {
    pronunciation: "/stɔːl/",
    collocations_cn: ["摊位", "市场摊位", "小吃摊", "货摊"],
    example_sentence_cn: "这个夜市摊位卖着这座城市最好吃的街头小吃。",
    synonyms_cn: ["摊位", "摊贩", "档口"],
  },
  "city-044": {
    pronunciation: "/ˈbæk.drɒp/",
    collocations_cn: ["背景", "城市背景", "历史背景", "山景背景"],
    example_sentence_cn: "这座山为整个城市提供了壮丽的背景。",
    synonyms_cn: ["背景", "环境", "布景"],
  },
  "city-045": {
    pronunciation: "/dɪˈkeɪ/",
    collocations_cn: ["衰败", "城市衰败", "牙齿腐烂", "衰败过程"],
    example_sentence_cn: "一些老工业区经历了衰败，但正在通过城市更新项目重获新生。",
    synonyms_cn: ["衰退", "腐蚀", "老损"],
  },
  "city-046": {
    pronunciation: "/ˈɒr.ɪ.dʒɪn/",
    collocations_cn: ["起源", "来源", "原始", "起点"],
    example_sentence_cn: "了解一个城市的历史起源有助于理解其文化和建筑风格。",
    synonyms_cn: ["来源", "起点", "发祥地"],
  },
  "city-047": {
    pronunciation: "/ˈæv.ən.juː/",
    collocations_cn: ["大道", "林荫大道", "主要大道", "商业大道"],
    example_sentence_cn: "这条宽阔的大道两旁种满了梧桐树，是城市最具标志性的街道之一。",
    synonyms_cn: ["大街", "大道", "林荫道"],
  },
  "city-048": {
    pronunciation: "/ˈaʊt.kɜːts/",
    collocations_cn: ["郊区", "在城郊", "城市边缘", "郊区地带"],
    example_sentence_cn: "许多工厂和物流中心都设在城市郊区，那里地价更便宜。",
    synonyms_cn: ["市郊", "近郊", "城边"],
  },
  "city-049": {
    pronunciation: "/ˈrek.ri.eɪt/",
    collocations_cn: ["重建", "重新创造", "再现", "复原"],
    example_sentence_cn: "城市规划者正在努力重建这个历史街区昔日的辉煌。",
    synonyms_cn: ["重建", "复制", "再现"],
  },
  "city-050": {
    pronunciation: "/ˈhɑːr.bər/",
    collocations_cn: ["海港", "港口城市", "天然海港", "渔港"],
    example_sentence_cn: "这座海港城市因其便利的海上贸易条件而繁荣发展。",
    synonyms_cn: ["港口", "港湾", "码头"],
  },
};

// ============================================================
// 主流程
// ============================================================

function main() {
  console.log("[INFO] 正在读取 chunks.json...");
  const raw = fs.readFileSync(CHUNKS_PATH, "utf-8");
  const chunks: Chunk[] = JSON.parse(raw);

  console.log(`[INFO] 共 ${chunks.length} 个词块\n`);

  let enriched = 0;
  let missing = 0;

  for (const chunk of chunks) {
    const data = BILINGUAL_DB[chunk.id];

    if (!data) {
      console.warn(`[WARN] 缺少双语数据: ${chunk.id} (${chunk.word})`);
      missing++;
      continue;
    }

    // 自动调整数组长度：截断过长、用翻译填充过短
    if (data.collocations_cn.length !== chunk.collocations.length) {
      console.warn(
        `[FIX] ${chunk.id}: collocations_cn ${data.collocations_cn.length} → ${chunk.collocations.length}`
      );
      while (data.collocations_cn.length < chunk.collocations.length) {
        data.collocations_cn.push(chunk.translation + "相关搭配");
      }
      data.collocations_cn = data.collocations_cn.slice(0, chunk.collocations.length);
    }
    if (data.synonyms_cn.length !== chunk.synonyms.length) {
      console.warn(
        `[FIX] ${chunk.id}: synonyms_cn ${data.synonyms_cn.length} → ${chunk.synonyms.length}`
      );
      while (data.synonyms_cn.length < chunk.synonyms.length) {
        const idx = data.synonyms_cn.length;
        data.synonyms_cn.push(chunk.synonyms[idx] ? `「${chunk.synonyms[idx]}」的中文释义` : chunk.translation + "近义词");
      }
      data.synonyms_cn = data.synonyms_cn.slice(0, chunk.synonyms.length);
    }

    chunk.pronunciation = data.pronunciation;
    chunk.collocations_cn = data.collocations_cn;
    chunk.example_sentence_cn = data.example_sentence_cn;
    chunk.synonyms_cn = data.synonyms_cn;
    enriched++;
  }

  // 写入文件
  const output = JSON.stringify(chunks, null, 2) + "\n";
  fs.writeFileSync(CHUNKS_PATH, output, "utf-8");

  console.log(`\n[DONE] 富化完成: ${enriched}/${chunks.length} 个词块`);
  if (missing > 0) {
    console.log(`[WARN] ${missing} 个词块缺少数据，已跳过`);
  }
}

main();
