export type Topic = "education" | "environment" | "technology" | "work" | "health" | "city";

export type Module = "listening" | "reading" | "writing" | "speaking";

export interface Chunk {
  id: string;
  word: string;
  translation: string;
  part_of_speech: string;
  band_level: string;
  frequency_score: number;
  topics: Topic[];
  modules: Module[];
  collocations: string[];
  example_sentence: string;
  synonyms: string[];
  common_mistakes: string[];
  ielts_context: string;
}
