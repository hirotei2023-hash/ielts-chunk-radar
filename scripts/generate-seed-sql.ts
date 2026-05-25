// scripts/generate-seed-sql.ts
// Purpose: Convert data/chunks.json to SQL INSERT statements
// Run: npx tsx scripts/generate-seed-sql.ts > supabase/migrations/002_seed.sql

import chunks from "../data/chunks.json";

const escape = (s: string) => s.replace(/'/g, "''");

for (const c of chunks as any[]) {
  const arr = (a: string[]) => `'{${a.map((x) => `"${escape(x)}"`).join(",")}}'`;

  console.log(
    `INSERT INTO public.chunks (id, word, translation, part_of_speech, band_level, frequency_score, topics, modules, collocations, example_sentence, synonyms, common_mistakes, ielts_context) VALUES (` +
      `'${escape(c.id)}', ` +
      `'${escape(c.word)}', ` +
      `'${escape(c.translation)}', ` +
      `'${escape(c.part_of_speech)}', ` +
      `'${escape(c.band_level)}', ` +
      `${c.frequency_score}, ` +
      `${arr(c.topics)}, ` +
      `${arr(c.modules)}, ` +
      `${arr(c.collocations)}, ` +
      `'${escape(c.example_sentence)}', ` +
      `${arr(c.synonyms)}, ` +
      `${arr(c.common_mistakes)}, ` +
      `'${escape(c.ielts_context)}'` +
      `);`
  );
}
