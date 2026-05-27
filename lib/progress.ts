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

const LOCAL_KEY = "ielts-chunk-radar-progress";

// ====== localStorage fallback ======

function readLocal(): ChunkProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as ChunkProgress[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(records: ChunkProgress[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(records));
}

function getLocal(chunkId: string): ChunkProgress | null {
  return readLocal().find((p) => p.chunk_id === chunkId) || null;
}

function upsertLocal(record: ChunkProgress) {
  const all = readLocal();
  const idx = all.findIndex((p) => p.chunk_id === record.chunk_id);
  if (idx >= 0) all[idx] = record;
  else all.push(record);
  writeLocal(all);
}

// ====== public API ======

async function hasSupabaseUser(): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return false;
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

export async function getProgress(chunkId: string): Promise<ChunkProgress | null> {
  const hasUser = await hasSupabaseUser();
  if (!hasUser) return getLocal(chunkId);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getLocal(chunkId);

  const { data } = await supabase
    .from("user_chunk_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("chunk_id", chunkId)
    .maybeSingle();

  return (data as ChunkProgress) || getLocal(chunkId);
}

export async function getAllProgress(): Promise<ChunkProgress[]> {
  const hasUser = await hasSupabaseUser();
  if (!hasUser) return readLocal();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return readLocal();

  const { data } = await supabase
    .from("user_chunk_progress")
    .select("*")
    .eq("user_id", user.id);

  return (data as ChunkProgress[]) || readLocal();
}

export async function getReviewQueue(): Promise<ChunkProgress[]> {
  const hasUser = await hasSupabaseUser();
  if (!hasUser) {
    const now = new Date();
    return readLocal().filter((p) => !p.next_review_at || new Date(p.next_review_at) <= now);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return readLocal();

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
    user_id: "local",
    chunk_id: chunkId,
    mastery_score: masteryScore,
    correct_count: correctCount,
    wrong_count: wrongCount,
    last_reviewed_at: now.toISOString(),
    next_review_at: nextReviewAt.toISOString(),
  };

  const hasUser = await hasSupabaseUser();
  if (hasUser) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("user_chunk_progress")
        .upsert({ ...record, user_id: user.id }, { onConflict: "user_id,chunk_id" });
      return record;
    }
  }

  // localStorage fallback
  upsertLocal(record);
  return record;
}

export async function getStudyStats() {
  const hasUser = await hasSupabaseUser();
  if (!hasUser) {
    const all = readLocal();
    const now = new Date();
    return {
      totalLearned: all.length,
      masteredCount: all.filter((p) => p.mastery_score >= 85).length,
      learningCount: all.filter((p) => p.mastery_score >= 1 && p.mastery_score < 85).length,
      newCount: all.filter((p) => p.mastery_score === 0).length,
      dueToday: all.filter((p) => p.next_review_at && new Date(p.next_review_at) <= now).length,
    };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const all = readLocal();
    const now = new Date();
    return {
      totalLearned: all.length,
      masteredCount: all.filter((p) => p.mastery_score >= 85).length,
      learningCount: all.filter((p) => p.mastery_score >= 1 && p.mastery_score < 85).length,
      newCount: all.filter((p) => p.mastery_score === 0).length,
      dueToday: all.filter((p) => p.next_review_at && new Date(p.next_review_at) <= now).length,
    };
  }

  const { data } = await supabase
    .from("user_chunk_progress")
    .select("mastery_score, last_reviewed_at, next_review_at")
    .eq("user_id", user.id);

  const progress = data || [];
  const now = new Date();

  return {
    totalLearned: progress.length,
    masteredCount: progress.filter((p: any) => p.mastery_score >= 85).length,
    learningCount: progress.filter((p: any) => p.mastery_score >= 1 && p.mastery_score < 85).length,
    newCount: progress.filter((p: any) => p.mastery_score === 0).length,
    dueToday: progress.filter((p: any) => p.next_review_at && new Date(p.next_review_at) <= now).length,
  };
}
