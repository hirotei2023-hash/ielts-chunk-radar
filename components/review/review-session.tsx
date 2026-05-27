// components/review/review-session.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ReviewCard } from "./review-card";
import { generateQuestions } from "@/lib/review-algorithm";
import { updateMastery, getReviewQueue, getAllProgress } from "@/lib/progress";
import { getChunkById, getAllChunks } from "@/lib/chunks";
import { saveTodayScore, getScoreHistory } from "@/lib/scores";
import type { Chunk } from "@/types/chunk";
import type { ReviewQuestion } from "@/lib/review-algorithm";
import type { ChunkProgress } from "@/lib/progress";
import type { ScoreRecord } from "@/lib/scores";

const QUESTIONS_PER_SESSION = 20;

function ScoreHistory({ records }: { records: ScoreRecord[] }) {
  if (records.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-sm font-semibold" style={{ color: "#fafaf9" }}>
        📊 历史记录
      </h3>
      <div className="rounded-lg p-4" style={{ backgroundColor: "#292524" }}>
        <div className="flex items-end gap-1.5" style={{ height: 80 }}>
          {records.map((r) => {
            const h = Math.max(4, (r.score / 100) * 76);
            return (
              <div key={r.date} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-medium" style={{ color: r.score >= 60 ? "#bef264" : "#fca5a5" }}>
                  {r.score}
                </span>
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: h,
                    backgroundColor: r.score >= 80 ? "#84cc16" : r.score >= 60 ? "#f59e0b" : "#ea580c",
                    opacity: 0.7,
                  }}
                />
                <span className="text-[9px]" style={{ color: "#78716c" }}>
                  {r.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ReviewSession() {
  const router = useRouter();
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [scoreHistory, setScoreHistory] = useState<ScoreRecord[]>([]);

  useEffect(() => {
    startSession();
  }, []);

  const startSession = useCallback(async () => {
    const queue = await getReviewQueue();
    const allChunks = getAllChunks();
    const allProgress = await getAllProgress();
    const learnedIds = new Set(allProgress.map((p: ChunkProgress) => p.chunk_id));

    const selectedIds = new Set<string>();
    const selected: Chunk[] = [];

    // 1) 待复习词块：掌握度越高出现概率越低
    const weighted = queue
      .filter((p) => getChunkById(p.chunk_id))
      .map((p) => ({ chunk: getChunkById(p.chunk_id)!, weight: Math.random() * (1 - p.mastery_score / 100) }))
      .sort((a, b) => b.weight - a.weight);

    for (const w of weighted) {
      if (selected.length >= QUESTIONS_PER_SESSION) break;
      if (!selectedIds.has(w.chunk.id)) {
        selected.push(w.chunk);
        selectedIds.add(w.chunk.id);
      }
    }

    // 2) 不够则从未学习词块中补足
    if (selected.length < QUESTIONS_PER_SESSION) {
      const unlearned = allChunks
        .filter((c) => !learnedIds.has(c.id) && !selectedIds.has(c.id))
        .sort(() => Math.random() - 0.5);

      for (const c of unlearned) {
        if (selected.length >= QUESTIONS_PER_SESSION) break;
        selected.push(c);
        selectedIds.add(c.id);
      }
    }

    // 3) 还不够则从全部词块随机补足
    if (selected.length < QUESTIONS_PER_SESSION) {
      const remaining = allChunks
        .filter((c) => !selectedIds.has(c.id))
        .sort(() => Math.random() - 0.5);

      for (const c of remaining) {
        if (selected.length >= QUESTIONS_PER_SESSION) break;
        selected.push(c);
        selectedIds.add(c.id);
      }
    }

    if (selected.length === 0) {
      setLoading(false);
      setFinished(true);
      return;
    }

    // 随机打乱顺序
    selected.sort(() => Math.random() - 0.5);
    const generated = generateQuestions(selected, allChunks);
    setQuestions(generated);
    setLoading(false);
  }, []);

  const handleAnswer = useCallback(async (chunkId: string, correct: boolean) => {
    setStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (!correct ? 1 : 0),
    }));
    await updateMastery(chunkId, correct);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length]);

  useEffect(() => {
    if (finished && stats.correct + stats.wrong > 0) {
      saveTodayScore(stats.correct, stats.correct + stats.wrong);
      setScoreHistory(getScoreHistory());
    }
  }, [finished, stats.correct, stats.wrong]);

  if (loading) {
    return (
      <div className="py-16 text-center" style={{ color: "#a8a29e" }}>准备题目中...</div>
    );
  }

  if (finished) {
    const total = stats.correct + stats.wrong;
    const score = total > 0 ? stats.correct * 5 : 0;

    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 text-5xl">{score >= 80 ? "🎉" : score >= 50 ? "💪" : "📚"}</div>
        <h2 className="text-lg font-bold" style={{ color: "#fafaf9" }}>复习完成！</h2>
        <div className="mt-3 space-y-1" style={{ color: "#a8a29e" }}>
          <p>正确：{stats.correct} 题</p>
          <p>错误：{stats.wrong} 题</p>
          <p className="text-lg font-semibold" style={{ color: "#f59e0b" }}>得分 {score} 分</p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setFinished(false);
              setStats({ correct: 0, wrong: 0 });
              startSession();
            }}
            className="rounded-full px-6 py-2 text-sm font-medium"
            style={{ backgroundColor: "#f59e0b", color: "#1c1917" }}
          >
            再来一轮
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-full px-6 py-2 text-sm font-medium"
            style={{ backgroundColor: "#292524", color: "#a8a29e" }}
          >
            返回首页
          </button>
        </div>
        <ScoreHistory records={scoreHistory} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <p className="mb-4 text-4xl">🌟</p>
        <h2 className="text-lg font-bold" style={{ color: "#fafaf9" }}>没有待复习的词块</h2>
        <p className="mt-2 text-sm" style={{ color: "#a8a29e" }}>
          去词块库浏览并学习新词块吧
        </p>
        <button
          onClick={() => router.push("/library")}
          className="mt-4 rounded-full px-6 py-2 text-sm font-medium"
          style={{ backgroundColor: "#f59e0b", color: "#1c1917" }}
        >
          去词块库
        </button>
        <ScoreHistory records={scoreHistory} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ReviewCard
        key={currentIndex}
        question={questions[currentIndex]}
        questionIndex={currentIndex}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
