// lib/chunks-supabase.ts

import { supabase } from "@/lib/supabase";
import type { Chunk, Topic, Module } from "@/types/chunk";
import type { SortKey } from "./constants";

export async function getAllChunks(): Promise<Chunk[]> {
  const { data } = await supabase.from("chunks").select("*").order("frequency_score", { ascending: false });
  return (data as Chunk[]) || [];
}

export async function getChunkById(id: string): Promise<Chunk | undefined> {
  const { data } = await supabase.from("chunks").select("*").eq("id", id).single();
  return (data as Chunk) || undefined;
}

export interface ChunkFilters {
  topic?: Topic | null;
  module?: Module | null;
  search?: string;
  sort?: SortKey;
}

export async function filterChunks(filters: ChunkFilters): Promise<Chunk[]> {
  let query = supabase.from("chunks").select("*");

  if (filters.topic) {
    query = query.contains("topics", [filters.topic]);
  }

  if (filters.module) {
    query = query.contains("modules", [filters.module]);
  }

  if (filters.search) {
    query = query.or(
      `word.ilike.%${filters.search}%,translation.ilike.%${filters.search}%,ielts_context.ilike.%${filters.search}%`
    );
  }

  switch (filters.sort) {
    case "alphabetical":
      query = query.order("word", { ascending: true });
      break;
    case "recent":
      query = query.order("id", { ascending: false });
      break;
    case "frequency":
    default:
      query = query.order("frequency_score", { ascending: false });
      break;
  }

  const { data } = await query;
  return (data as Chunk[]) || [];
}

export async function getTopChunks(n: number = 10): Promise<Chunk[]> {
  const { data } = await supabase
    .from("chunks")
    .select("*")
    .order("frequency_score", { ascending: false })
    .limit(n);
  return (data as Chunk[]) || [];
}
