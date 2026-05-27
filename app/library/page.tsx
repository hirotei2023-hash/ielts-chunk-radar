// app/library/page.tsx

"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Topic, Module } from "@/types/chunk";
import type { SortKey } from "@/lib/constants";
import { filterChunks } from "@/lib/chunks";
import { getAllProgress } from "@/lib/progress";
import type { ChunkProgress } from "@/lib/progress";
import { PageContainer } from "@/components/layout/page-container";
import { FilterBar } from "@/components/chunks/filter-bar";
import { SortToggle } from "@/components/chunks/sort-toggle";
import { ChunkCard } from "@/components/chunks/chunk-card";

type StatusFilter = "learned" | "mastered" | null;

function LibraryContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") as Topic | null;
  const initialStatus = searchParams.get("status") as StatusFilter;

  const [topic, setTopic] = useState<Topic | null>(initialTopic);
  const [module, setModule] = useState<Module | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("frequency");
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [progressMap, setProgressMap] = useState<Map<string, ChunkProgress>>(new Map());

  useEffect(() => {
    if (initialStatus) {
      getAllProgress().then((records) => {
        const map = new Map<string, ChunkProgress>();
        for (const r of records) map.set(r.chunk_id, r);
        setProgressMap(map);
      });
    }
  }, [initialStatus]);

  const handleTopicChange = useCallback((t: Topic | null) => setTopic(t), []);
  const handleModuleChange = useCallback((m: Module | null) => setModule(m), []);

  const handleStatusClear = useCallback(() => setStatus(null), []);

  const filtered = useMemo(() => {
    let result = filterChunks({ topic, module, search, sort });

    if (status === "learned") {
      result = result.filter((c) => {
        const p = progressMap.get(c.id);
        return p && p.mastery_score >= 1;
      });
    } else if (status === "mastered") {
      result = result.filter((c) => {
        const p = progressMap.get(c.id);
        return p && p.mastery_score >= 85;
      });
    }

    return result;
  }, [topic, module, search, sort, status, progressMap]);

  return (
    <PageContainer title="词块库">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="搜索词块..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: "#292524",
            color: "#fafaf9",
            border: "1px solid #44403c",
          }}
        />

        <SortToggle value={sort} onChange={setSort} />

        <FilterBar
          selectedTopic={topic}
          selectedModule={module}
          onTopicChange={handleTopicChange}
          onModuleChange={handleModuleChange}
        />

        {status && (
          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: "#78350f", color: "#fbbf24" }}>
              {status === "learned" ? "已学习" : "已掌握"}
            </span>
            <button
              onClick={handleStatusClear}
              className="text-xs underline"
              style={{ color: "#a8a29e" }}
            >
              清除筛选
            </button>
          </div>
        )}

        <p className="text-xs" style={{ color: "#a8a29e" }}>
          共 {filtered.length} 个词块
        </p>

        <div className="flex flex-col gap-2">
          {filtered.map((chunk) => (
            <ChunkCard key={chunk.id} chunk={chunk} />
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm" style={{ color: "#78716c" }}>
              没有匹配的词块，试试其他筛选条件
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center" style={{ color: "#a8a29e" }}>加载中...</div>}>
      <LibraryContent />
    </Suspense>
  );
}
