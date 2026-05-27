export type Topic = "education" | "environment" | "technology" | "work" | "health" | "city" | "economy" | "culture" | "society" | "science";

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
  collocations_cn: string[];
  example_sentence: string;
  example_sentence_cn: string;
  synonyms: string[];
  synonyms_cn: string[];
  common_mistakes: string[];
  ielts_context: string;
  pronunciation: string;
}
