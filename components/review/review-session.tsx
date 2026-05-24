// components/review/review-session.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ReviewCard } from "./review-card";
import { generateQuestions } from "@/lib/review-algorithm";
import { updateMastery, getReviewQueue, getAllProgress } from "@/lib/progress";
import { getChunkById, getAllChunks } from "@/lib/chunks";
import type { Chunk } from "@/types/chunk";
import type { ReviewQuestion } from "@/lib/review-algorithm";
import type { ChunkProgress } from "@/lib/progress";

export function ReviewSession() {
  const router = useRouter();
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    startSession();
  }, []);

  const startSession = useCallback(async () => {
    const queue = await getReviewQueue();
    const allChunks = getAllChunks();

    let reviewChunks: Chunk[];

    if (queue.length === 0) {
      const allProgress = await getAllProgress();
      const learnedIds = new Set(allProgress.map((p: ChunkProgress) => p.chunk_id));
      reviewChunks = allChunks
        .filter((c) => !learnedIds.has(c.id))
        .sort((a, b) => b.frequency_score - a.frequency_score)
        .slice(0, 10);
    } else {
      reviewChunks = queue
        .map((p) => getChunkById(p.chunk_id))
        .filter(Boolean) as Chunk[];
    }

    if (reviewChunks.length === 0) {
      setLoading(false);
      setFinished(true);
      return;
    }

    const generated = generateQuestions(reviewChunks, allChunks);
    setQuestions(generated);
    setLoading(false);
  }, []);

  const handleAnswer = useCallback(async (chunkId: string, correct: boolean) => {
    setStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (!correct ? 1 : 0),
    }));
    await updateMastery(chunkId, correct);

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 800);
  }, [currentIndex, questions.length]);

  if (loading) {
    return (
      <div className="py-16 text-center" style={{ color: "#a8a29e" }}>准备题目中...</div>
    );
  }

  if (finished) {
    const total = stats.correct + stats.wrong;
    const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 text-5xl">{pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "📚"}</div>
        <h2 className="text-lg font-bold" style={{ color: "#fafaf9" }}>复习完成！</h2>
        <div className="mt-3 space-y-1" style={{ color: "#a8a29e" }}>
          <p>正确：{stats.correct} 题</p>
          <p>错误：{stats.wrong} 题</p>
          <p className="text-lg font-semibold" style={{ color: "#f59e0b" }}>正确率 {pct}%</p>
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
      />
    </div>
  );
}
