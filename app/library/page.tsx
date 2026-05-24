// app/library/page.tsx

"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Topic, Module } from "@/types/chunk";
import type { SortKey } from "@/lib/constants";
import { filterChunks } from "@/lib/chunks";
import { PageContainer } from "@/components/layout/page-container";
import { FilterBar } from "@/components/chunks/filter-bar";
import { SortToggle } from "@/components/chunks/sort-toggle";
import { ChunkCard } from "@/components/chunks/chunk-card";

function LibraryContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") as Topic | null;

  const [topic, setTopic] = useState<Topic | null>(initialTopic);
  const [module, setModule] = useState<Module | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("frequency");

  const handleTopicChange = useCallback((t: Topic | null) => setTopic(t), []);
  const handleModuleChange = useCallback((m: Module | null) => setModule(m), []);

  const filtered = useMemo(
    () => filterChunks({ topic, module, search, sort }),
    [topic, module, search, sort]
  );

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
