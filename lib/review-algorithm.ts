// lib/review-algorithm.ts

import type { Chunk } from "@/types/chunk";

export type QuestionType = "chinese-to-english" | "collocation-gap" | "topic-match";

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
  const sentence = chunk.example_sentence.replace(chunk.word, "_____");
  return {
    type: "collocation-gap",
    chunkId: chunk.id,
    prompt: sentence,
    correctAnswer: chunk.word,
    hint: `提示：${chunk.translation}（${chunk.part_of_speech}）`,
  };
}

function generateTopicMatch(chunk: Chunk, allChunks: Chunk[]): ReviewQuestion {
  const distractors = allChunks
    .filter((c) => c.id !== chunk.id && c.topics.some((t) => chunk.topics.includes(t)))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((c) => c.word);

  const options = [chunk.word, ...distractors].sort(() => Math.random() - 0.5);

  return {
    type: "topic-match",
    chunkId: chunk.id,
    prompt: `写作场景：「${chunk.ielts_context}」\n\n最适合使用的词块是？`,
    correctAnswer: chunk.word,
    options,
  };
}

export function generateQuestions(chunks: Chunk[], allChunks: Chunk[]): ReviewQuestion[] {
  return chunks.map((chunk, i) => {
    const typeIdx = i % 3;
    switch (typeIdx) {
      case 0:
        return generateChineseToEnglish(chunk);
      case 1:
        return generateCollocationGap(chunk);
      case 2:
      default:
        return generateTopicMatch(chunk, allChunks);
    }
  });
}
