// lib/progress.ts

import { supabase } from "@/lib/supabase";

export interface ChunkProgress {
  user_id: string;
  chunk_id: string;
  mastery_score: number;
  correct_count: number;
  wrong_count: number;
  last_reviewed_at: string | null;
  next_review_at: string | null;
}

export async function getProgress(chunkId: string): Promise<ChunkProgress | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_chunk_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("chunk_id", chunkId)
    .maybeSingle();

  return data as ChunkProgress | null;
}

export async function getAllProgress(): Promise<ChunkProgress[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("user_chunk_progress")
    .select("*")
    .eq("user_id", user.id);

  return (data as ChunkProgress[]) || [];
}

export async function getReviewQueue(): Promise<ChunkProgress[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const now = new Date().toISOString();

  const { data } = await supabase
    .from("user_chunk_progress")
    .select("*")
    .eq("user_id", user.id)
    .lte("next_review_at", now)
    .order("mastery_score", { ascending: true })
    .limit(20);

  return (data as ChunkProgress[]) || [];
}

export async function updateMastery(
  chunkId: string,
  correct: boolean
): Promise<ChunkProgress> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const existing = await getProgress(chunkId);

  const now = new Date();
  let masteryScore = existing?.mastery_score ?? 0;
  let correctCount = existing?.correct_count ?? 0;
  let wrongCount = existing?.wrong_count ?? 0;

  if (correct) {
    masteryScore = Math.min(100, masteryScore + 15);
    correctCount++;
  } else {
    masteryScore = Math.max(0, masteryScore - 20);
    wrongCount++;
  }

  const intervalDays = Math.pow(masteryScore / 20, 2);
  const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  const record: ChunkProgress = {
    user_id: user.id,
    chunk_id: chunkId,
    mastery_score: masteryScore,
    correct_count: correctCount,
    wrong_count: wrongCount,
    last_reviewed_at: now.toISOString(),
    next_review_at: nextReviewAt.toISOString(),
  };

  await supabase
    .from("user_chunk_progress")
    .upsert(record, { onConflict: "user_id,chunk_id" });

  return record;
}

export async function getStudyStats() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_chunk_progress")
    .select("mastery_score, last_reviewed_at, next_review_at")
    .eq("user_id", user.id);

  const progress = data || [];
  const now = new Date();

  return {
    totalLearned: progress.length,
    masteredCount: progress.filter((p) => p.mastery_score >= 85).length,
    learningCount: progress.filter((p) => p.mastery_score >= 1 && p.mastery_score < 85).length,
    newCount: progress.filter((p) => p.mastery_score === 0).length,
    dueToday: progress.filter((p) => p.next_review_at && new Date(p.next_review_at) <= now).length,
  };
}
