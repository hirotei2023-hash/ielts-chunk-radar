// lib/scores.ts
// 本地存储每日复习分数，总分 100 分

const STORAGE_KEY = "ielts-chunk-radar-scores";

export interface ScoreRecord {
  date: string;  // YYYY-MM-DD
  score: number; // 0-100
  correct: number;
  total: number;
}

function getAll(): ScoreRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScoreRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveTodayScore(correct: number, total: number): ScoreRecord {
  const records = getAll();
  const today = new Date().toISOString().slice(0, 10);
  const score = correct * 5; // 20题 × 5分 = 100分

  const entry: ScoreRecord = { date: today, score, correct, total };
  const idx = records.findIndex((r) => r.date === today);

  if (idx >= 0) {
    records[idx] = entry;
  } else {
    records.push(entry);
  }

  records.sort((a, b) => b.date.localeCompare(a.date));

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  return entry;
}

export function getScoreHistory(): ScoreRecord[] {
  return getAll();
}
