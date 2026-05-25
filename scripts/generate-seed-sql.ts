// scripts/generate-seed-sql.ts
// Purpose: Convert data/chunks.json to SQL INSERT statements
// Run: npx tsx scripts/generate-seed-sql.ts > supabase/migrations/002_seed.sql

import chunks from "../data/chunks.json";

const escape = (s: string) => s.replace(/'/g, "''");

for (const c of chunks as any[]) {
  const arr = (a: string[]) => `'{${a.map((x) => `"${escape(x)}"`).join(",")}}'`;

  console.log(
    `INSERT INTO public.chunks (id, word, translation, part_of_speech, band_level, frequency_score, topics, modules, collocations, collocations_cn, example_sentence, example_sentence_cn, synonyms, synonyms_cn, common_mistakes, ielts_context, pronunciation) VALUES (` +
      `'${escape(c.id)}', ` +
      `'${escape(c.word)}', ` +
      `'${escape(c.translation)}', ` +
      `'${escape(c.part_of_speech)}', ` +
      `'${escape(c.band_level)}', ` +
      `${c.frequency_score}, ` +
      `${arr(c.topics)}, ` +
      `${arr(c.modules)}, ` +
      `${arr(c.collocations)}, ` +
      `${arr(c.collocations_cn || [])}, ` +
      `'${escape(c.example_sentence)}', ` +
      `'${escape(c.example_sentence_cn || "")}', ` +
      `${arr(c.synonyms)}, ` +
      `${arr(c.synonyms_cn || [])}, ` +
      `${arr(c.common_mistakes)}, ` +
      `'${escape(c.ielts_context)}', ` +
      `'${escape(c.pronunciation || "")}'` +
      `);`
  );
}
