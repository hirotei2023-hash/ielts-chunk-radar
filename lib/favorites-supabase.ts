// lib/favorites-supabase.ts

import { supabase } from "@/lib/supabase";

export async function getFavoriteIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("chunk_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("获取收藏列表失败:", error);
    return [];
  }

  return (data || []).map((r: { chunk_id: string }) => r.chunk_id);
}

export async function isFavorite(chunkId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("favorites")
    .select("chunk_id")
    .eq("user_id", user.id)
    .eq("chunk_id", chunkId)
    .maybeSingle();

  if (error) {
    console.error("查询收藏状态失败:", error);
    return false;
  }

  return !!data;
}

export async function toggleFavorite(chunkId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // 先尝试 INSERT，如果已存在则 DELETE
  const { error: insertError } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, chunk_id: chunkId });

  if (!insertError) {
    return true;
  }

  if (insertError.code === "23505") {
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("chunk_id", chunkId);

    if (deleteError) {
      console.error("取消收藏失败:", deleteError);
      throw deleteError;
    }
    return false;
  }

  console.error("收藏操作失败:", insertError);
  throw insertError;
}

export async function getFavoriteCount(): Promise<number> {
  const ids = await getFavoriteIds();
  return ids.length;
}
