// scripts/apply-bilingual.ts
// 将 bilingual-db.json 中的双语数据应用到 chunks.json（按 word 匹配）
// 用法: npx tsx scripts/apply-bilingual.ts
//
// 可复用：每次扩充词库后，先运行 build-bilingual-db.ts 更新索引，
//         再运行本脚本应用双语数据

import fs from "fs";
import path from "path";

const CHUNKS_PATH = path.resolve(__dirname, "../data/chunks.json");
const DB_PATH = path.resolve(__dirname, "../data/bilingual-db.json");

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

interface BilingualData {
  pronunciation: string;
  collocations_cn: string[];
  example_sentence_cn: string;
  synonyms_cn: string[];
}

const chunks: Chunk[] = JSON.parse(fs.readFileSync(CHUNKS_PATH, "utf-8"));
const db: Record<string, BilingualData> = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));

let applied = 0;
let missing = 0;

for (const chunk of chunks) {
  const data = db[chunk.word.toLowerCase()];

  if (data && data.pronunciation) {
    chunk.pronunciation = data.pronunciation;
    chunk.collocations_cn = data.collocations_cn;
    chunk.example_sentence_cn = data.example_sentence_cn;
    chunk.synonyms_cn = data.synonyms_cn;
    applied++;
  } else {
    // Keep existing if present, otherwise mark as missing
    const hasExisting =
      (chunk.pronunciation && chunk.pronunciation.length > 0) ||
      (chunk.collocations_cn && chunk.collocations_cn.length > 0 && chunk.collocations_cn.some((x) => x.length > 0));

    if (!hasExisting) {
      // Placeholder — will be filled by LLM step
      if (!chunk.pronunciation) chunk.pronunciation = "";
      if (!chunk.collocations_cn) chunk.collocations_cn = chunk.collocations.map(() => "");
      if (!chunk.example_sentence_cn) chunk.example_sentence_cn = "";
      if (!chunk.synonyms_cn) chunk.synonyms_cn = chunk.synonyms.map(() => "");
    }
    missing++;
  }
}

fs.writeFileSync(CHUNKS_PATH, JSON.stringify(chunks, null, 2), "utf-8");
console.log(`Applied: ${applied} chunks`);
console.log(`Missing (need LLM): ${missing} chunks`);

// List missing words
const missingWords = chunks
  .filter((c) => !db[c.word.toLowerCase()] || !db[c.word.toLowerCase()].pronunciation)
  .map((c) => `${c.id}: ${c.word}`);
if (missingWords.length > 0 && missingWords.length <= 20) {
  console.log("\nMissing:");
  missingWords.forEach((w) => console.log(`  ${w}`));
}
