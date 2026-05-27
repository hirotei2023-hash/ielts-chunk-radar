// lib/review-algorithm.ts

import type { Chunk } from "@/types/chunk";

export type QuestionType = "chinese-to-english" | "collocation-gap" | "english-to-chinese";

export interface ReviewQuestion {
  type: QuestionType;
  chunkId: string;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  hint?: string;
}

function generateChineseToEnglish(chunk: Chunk): ReviewQuestion {
  return {
    type: "chinese-to-english",
    chunkId: chunk.id,
    prompt: `「${chunk.translation}」对应的英文词块是？`,
    correctAnswer: chunk.word,
  };
}

function generateCollocationGap(chunk: Chunk): ReviewQuestion {
  const escaped = chunk.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sentence = chunk.example_sentence.replace(new RegExp(escaped, "i"), "_____");

  const parts: string[] = [`提示：${chunk.translation}（${chunk.part_of_speech}）`];
  if (chunk.example_sentence_cn) {
    parts.push(`例句翻译：${chunk.example_sentence_cn}`);
  }

  return {
    type: "collocation-gap",
    chunkId: chunk.id,
    prompt: sentence,
    correctAnswer: chunk.word,
    hint: parts.join("\n"),
  };
}

function generateEnglishToChinese(chunk: Chunk, allChunks: Chunk[]): ReviewQuestion {
  const distractors = allChunks
    .filter((c) => c.id !== chunk.id && c.translation !== chunk.translation)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((c) => c.translation);

  const options = [chunk.translation, ...distractors].sort(() => Math.random() - 0.5);

  return {
    type: "english-to-chinese",
    chunkId: chunk.id,
    prompt: `「${chunk.word}」的中文意思是？`,
    correctAnswer: chunk.translation,
    options,
  };
}

export function generateQuestions(chunks: Chunk[], allChunks: Chunk[]): ReviewQuestion[] {
  return chunks.map((chunk) => {
    const typeIdx = Math.floor(Math.random() * 3);
    switch (typeIdx) {
      case 0:
        return generateChineseToEnglish(chunk);
      case 1:
        return generateCollocationGap(chunk);
      case 2:
      default:
        return generateEnglishToChinese(chunk, allChunks);
    }
  });
}
