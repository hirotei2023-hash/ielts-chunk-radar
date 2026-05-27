// 将话题扩展数据合并到 chunks.json 和 bilingual-db.json
// 用法: npx tsx scripts/merge-expansion.ts <module-name>
// 例如: npx tsx scripts/merge-expansion.ts expand-education

import { fileURLToPath, pathToFileURL } from "url";
import * as fs from "fs";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = process.argv[2];
if (!moduleName) {
  console.error("用法: npx tsx scripts/merge-expansion.ts <module-name>");
  process.exit(1);
}

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
  pronunciation: string;
  collocations_cn: string[];
  example_sentence_cn: string;
  synonyms_cn: string[];
}

interface BilingualData {
  pronunciation: string;
  collocations_cn: string[];
  example_sentence_cn: string;
  synonyms_cn: string[];
}

const ROOT = path.resolve(__dirname, "..");

// 动态导入扩展模块
async function main() {
  const mod = await import(pathToFileURL(path.join(ROOT, "scripts", moduleName + ".ts")).href);
  // 查找导出的数组（约定：模块导出一个以 _EXPANSION 结尾的数组）
  const exportKey = Object.keys(mod).find(k => k.endsWith("_EXPANSION") || k.endsWith("_CHUNKS") || k === "default");
  if (!exportKey) {
    console.error("找不到导出数组");
    process.exit(1);
  }
  const newChunks: Chunk[] = mod[exportKey];
  console.log(`读取到 ${newChunks.length} 个新词块`);

  // 1. 合并到 chunks.json
  const chunksPath = path.join(ROOT, "data", "chunks.json");
  const existingChunks: Chunk[] = JSON.parse(fs.readFileSync(chunksPath, "utf-8"));

  // 检查重复 ID
  const existingIds = new Set(existingChunks.map(c => c.id));
  const duplicates = newChunks.filter(c => existingIds.has(c.id));
  if (duplicates.length > 0) {
    console.error("重复 ID:", duplicates.map(c => c.id).join(", "));
    process.exit(1);
  }

  const merged = [...existingChunks, ...newChunks];
  fs.writeFileSync(chunksPath, JSON.stringify(merged, null, 2) + "\n");
  console.log(`chunks.json: ${existingChunks.length} → ${merged.length} 个词块`);

  // 2. 合并到 bilingual-db.json
  const dbPath = path.join(ROOT, "data", "bilingual-db.json");
  const db: Record<string, BilingualData> = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  let added = 0;
  for (const c of newChunks) {
    if (!db[c.word]) {
      db[c.word] = {
        pronunciation: c.pronunciation,
        collocations_cn: c.collocations_cn,
        example_sentence_cn: c.example_sentence_cn,
        synonyms_cn: c.synonyms_cn,
      };
      added++;
    }
  }
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + "\n");
  console.log(`bilingual-db.json: 新增 ${added} 条，共 ${Object.keys(db).length} 条`);

  // 3. 验证
  const final: Chunk[] = JSON.parse(fs.readFileSync(chunksPath, "utf-8"));
  let ok = 0, bad = 0;
  for (const ch of final) {
    const p = ch.pronunciation && ch.pronunciation.length > 0;
    const cc = ch.collocations_cn && ch.collocations_cn.filter((x: string) => x).length === ch.collocations.length;
    const sc = ch.example_sentence_cn && ch.example_sentence_cn.length > 0 && !ch.example_sentence_cn.startsWith("[需要翻译]");
    const sy = ch.synonyms_cn && ch.synonyms_cn.filter((x: string) => x).length === ch.synonyms.length;
    if (p && cc && sc && sy) ok++;
    else { bad++; console.log("BAD:", ch.id, ch.word); }
  }
  console.log(`验证: OK=${ok} BAD=${bad}`);
}

main().catch(console.error);
