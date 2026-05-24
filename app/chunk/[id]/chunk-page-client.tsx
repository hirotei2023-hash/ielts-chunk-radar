"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getChunkById } from "@/lib/chunks";
import { getProgress } from "@/lib/progress";
import type { Chunk } from "@/types/chunk";
import type { ChunkProgress } from "@/lib/progress";
import { PageContainer } from "@/components/layout/page-container";
import { ChunkDetail } from "@/components/chunks/chunk-detail";
import { MasteryBadge } from "@/components/chunks/mastery-badge";
import { ChevronLeft } from "lucide-react";

export function ChunkPageClient({ id }: { id: string }) {
  const [chunk, setChunk] = useState<Chunk | null>(null);
  const [progress, setProgress] = useState<ChunkProgress | null>(null);

  useEffect(() => {
    const c = getChunkById(id);
    if (c) {
      setChunk(c);
      getProgress(id).then(setProgress);
    }
  }, [id]);

  if (!chunk) {
    return (
      <PageContainer>
        <div className="py-16 text-center" style={{ color: "#a8a29e" }}>未找到该词块</div>
      </PageContainer>
    );
  }

  const masteryScore = progress?.mastery_score ?? 0;

  return (
    <PageContainer>
      <div className="pt-4">
        <Link
          href="/library"
          className="mb-4 inline-flex items-center gap-1 text-sm"
          style={{ color: "#a8a29e" }}
        >
          <ChevronLeft size={16} />
          返回词块库
        </Link>

        {/* Mastery bar */}
        <div className="mb-4 rounded-lg p-3" style={{ backgroundColor: "#292524" }}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs" style={{ color: "#a8a29e" }}>掌握度</span>
            <MasteryBadge score={masteryScore} size="sm" />
          </div>
          <div className="h-1.5 rounded-full" style={{ backgroundColor: "#44403c" }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${masteryScore}%`,
                backgroundColor: masteryScore >= 85 ? "#84cc16" : masteryScore >= 60 ? "#f59e0b" : "#ea580c",
              }}
            />
          </div>
          {progress && (
            <div className="mt-2 flex gap-4 text-[10px]" style={{ color: "#78716c" }}>
              <span>正确 {progress.correct_count} 次</span>
              <span>错误 {progress.wrong_count} 次</span>
              {progress.next_review_at && (
                <span>下次复习：{new Date(progress.next_review_at).toLocaleDateString("zh-CN")}</span>
              )}
            </div>
          )}
        </div>

        <ChunkDetail chunk={chunk} />
      </div>
    </PageContainer>
  );
}
