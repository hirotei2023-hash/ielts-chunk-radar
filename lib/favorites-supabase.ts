// lib/favorites-supabase.ts

import { supabase } from "@/lib/supabase";

export async function getFavoriteIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("favorites")
    .select("chunk_id")
    .eq("user_id", user.id);

  return (data || []).map((r) => r.chunk_id);
}

export async function isFavorite(chunkId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("favorites")
    .select("chunk_id")
    .eq("user_id", user.id)
    .eq("chunk_id", chunkId)
    .maybeSingle();

  return !!data;
}

export async function toggleFavorite(chunkId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const fav = await isFavorite(chunkId);

  if (fav) {
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("chunk_id", chunkId);
    return false;
  } else {
    await supabase
      .from("favorites")
      .insert({ user_id: user.id, chunk_id: chunkId });
    return true;
  }
}

export async function getFavoriteCount(): Promise<number> {
  const ids = await getFavoriteIds();
  return ids.length;
}
