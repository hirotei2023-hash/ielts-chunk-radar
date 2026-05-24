// lib/chunks.ts

import type { Chunk, Topic, Module } from "@/types/chunk";
import type { SortKey } from "./constants";
import chunksData from "@/data/chunks.json";

const chunks = chunksData as Chunk[];

export function getAllChunks(): Chunk[] {
  return chunks;
}

export function getChunkById(id: string): Chunk | undefined {
  return chunks.find((c) => c.id === id);
}

export interface ChunkFilters {
  topic?: Topic | null;
  module?: Module | null;
  search?: string;
  sort?: SortKey;
}

export function filterChunks(filters: ChunkFilters): Chunk[] {
  let result = [...chunks];

  if (filters.topic) {
    result = result.filter((c) => c.topics.includes(filters.topic!));
  }

  if (filters.module) {
    result = result.filter((c) => c.modules.includes(filters.module!));
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.word.toLowerCase().includes(q) ||
        c.translation.includes(q) ||
        c.collocations.some((col) => col.toLowerCase().includes(q)) ||
        c.ielts_context.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case "alphabetical":
      result.sort((a, b) => a.word.localeCompare(b.word));
      break;
    case "recent":
      result.reverse();
      break;
    case "frequency":
    default:
      result.sort((a, b) => b.frequency_score - a.frequency_score);
      break;
  }

  return result;
}

export function getTopChunks(n: number = 10): Chunk[] {
  return [...chunks].sort((a, b) => b.frequency_score - a.frequency_score).slice(0, n);
}

export function getChunkIds(): string[] {
  return chunks.map((c) => c.id);
}
