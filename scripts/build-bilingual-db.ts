// scripts/build-bilingual-db.ts
// 从 enrich-chunks.ts 提取所有双语数据，按 word 重新索引
// 输出: data/bilingual-db.json（word → 双语数据）
// 用法: npx tsx scripts/build-bilingual-db.ts
//
// 可复用：每次扩充词库后运行此脚本重新索引即可

import fs from "fs";
import path from "path";

const ENRICH_PATH = path.resolve(__dirname, "enrich-chunks.ts");
const CHUNKS_PATH = path.resolve(__dirname, "../data/chunks.json");
const OUT_PATH = path.resolve(__dirname, "../data/bilingual-db.json");

interface BilingualData {
  pronunciation: string;
  collocations_cn: string[];
  example_sentence_cn: string;
  synonyms_cn: string[];
}

// ── Step 1: Extract BILINGUAL_DB object from TypeScript source ──
const src = fs.readFileSync(ENRICH_PATH, "utf-8");

// Find the BILINGUAL_DB constant start
const dbStart = src.indexOf("const BILINGUAL_DB: Record<string, BilingualData> = {");
if (dbStart === -1) {
  console.error("Cannot find BILINGUAL_DB declaration");
  process.exit(1);
}

// Find the matching closing }; by counting braces
const blockStart = src.indexOf("{", dbStart);
let depth = 0;
let blockEnd = blockStart;
for (let i = blockStart; i < src.length; i++) {
  if (src[i] === "{") depth++;
  else if (src[i] === "}") depth--;
  if (depth === 0) {
    blockEnd = i + 1; // include the closing }
    // Check if followed by ;
    if (src[i + 1] === ";") blockEnd = i + 2;
    break;
  }
}

const dbSrc = src.substring(blockStart, blockEnd);
console.log(`[1] Extracted BILINGUAL_DB block: ${dbSrc.length} chars`);

// Parse the object using eval (safe since it's our own generated code)
// First extract IPA_MAP for reverse word lookup
const ipaMap = new Map<string, string>();
const ipaStart = src.indexOf("const IPA_MAP: Record<string, string> = {");
const ipaBlockStart = src.indexOf("{", ipaStart);
let ipaDepth = 0;
let ipaBlockEnd = ipaBlockStart;
for (let i = ipaBlockStart; i < src.length; i++) {
  if (src[i] === "{") ipaDepth++;
  else if (src[i] === "}") ipaDepth--;
  if (ipaDepth === 0) { ipaBlockEnd = i + 1; break; }
}

const ipaSrc = src.substring(ipaBlockStart, ipaBlockEnd);
// Parse safely using Function
const ipaObj = new Function(`return ${ipaSrc}`)() as Record<string, string>;
for (const [word, pron] of Object.entries(ipaObj)) {
  ipaMap.set(word.toLowerCase(), pron);
}
console.log(`[2] Extracted ${ipaMap.size} IPA entries`);

// ── Step 2: Parse BILINGUAL_DB and extract each entry ──
// We'll find all key-value pairs by looking for "xxx-###": { ... }
const entries: Array<{ id: string; data: BilingualData }> = [];

// Match each ID and its value block
const entryPattern = /"((?:edu|env|tech|work|health|city)-\d{3})"\s*:\s*\{/g;
let match: RegExpExecArray | null;

while ((match = entryPattern.exec(dbSrc)) !== null) {
  const fullId = match[1];
  const valStart = match.index + match[0].length - 1; // position of {

  // Find matching }
  let d = 1;
  let valEnd = valStart;
  for (let i = valStart + 1; i < dbSrc.length && d > 0; i++) {
    if (dbSrc[i] === "{") d++;
    else if (dbSrc[i] === "}") d--;
    valEnd = i;
  }

  const valBlock = dbSrc.substring(valStart, valEnd + 1);

  // Extract fields from TypeScript object literal
  const pronMatch = valBlock.match(/pronunciation:\s*"([^"]*)"/);
  const collCnMatch = valBlock.match(/collocations_cn:\s*\[([\s\S]*?)\]/);
  const exSentCnMatch = valBlock.match(/example_sentence_cn:\s*"([^"]*)"/);
  const synCnMatch = valBlock.match(/synonyms_cn:\s*\[([\s\S]*?)\]/);

  const pronunciation = pronMatch?.[1] || "";

  const collocations_cn: string[] = [];
  if (collCnMatch) {
    const items = collCnMatch[1].match(/"([^"]*)"/g);
    if (items) collocations_cn.push(...items.map(c => c.replace(/"/g, "")));
  }

  const example_sentence_cn = exSentCnMatch?.[1] || "";

  const synonyms_cn: string[] = [];
  if (synCnMatch) {
    const items = synCnMatch[1].match(/"([^"]*)"/g);
    if (items) synonyms_cn.push(...items.map(s => s.replace(/"/g, "")));
  }

  entries.push({ id: fullId, data: { pronunciation, collocations_cn, example_sentence_cn, synonyms_cn } });
}
console.log(`[3] Extracted ${entries.length} BILINGUAL_DB entries`);

// ── Step 3: Match entries to words via pronunciation ──
const pronToWord = new Map<string, string>();
for (const [word, pron] of ipaMap) {
  pronToWord.set(pron, word);
}

// Also read chunks for ID→word mapping
const chunks = JSON.parse(fs.readFileSync(CHUNKS_PATH, "utf-8")) as Array<{ id: string; word: string }>;
const idToWord = new Map<string, string>();
for (const c of chunks) {
  idToWord.set(c.id, c.word);
}

const wordBilingual = new Map<string, BilingualData>();
let matchedPron = 0;
let matchedID = 0;

for (const entry of entries) {
  let word = pronToWord.get(entry.data.pronunciation);
  if (word) {
    matchedPron++;
  } else {
    // fallback: use the word at this ID in current chunks.json
    word = idToWord.get(entry.id);
    if (word) matchedID++;
  }

  if (word) {
    wordBilingual.set(word.toLowerCase(), entry.data);
  }
}

console.log(`[4] Word-indexed: ${wordBilingual.size} entries (via pron: ${matchedPron}, via ID: ${matchedID})`);

// ── Step 4: Write bilingual-db.json ──
const out: Record<string, BilingualData> = {};
for (const [word, data] of wordBilingual) {
  out[word] = data;
}

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), "utf-8");
console.log(`[5] Written ${Object.keys(out).length} entries to ${OUT_PATH}`);

// ── Step 5: Coverage stats ──
const chunkWords = chunks.map(c => c.word.toLowerCase());
const found = chunkWords.filter(w => wordBilingual.has(w));
const missing = chunkWords.filter(w => !wordBilingual.has(w));
console.log(`[6] Coverage: ${found.length}/${chunks.length} chunks matched`);
console.log(`    Missing: ${missing.length} chunks (${missing.slice(0, 5).join(", ")}...)`);
