// components/chunks/chunk-detail.tsx

import type { Chunk } from "@/types/chunk";
import { FrequencyBadge } from "./frequency-badge";
import { FavoriteButton } from "./favorite-button";
import { MODULE_META } from "@/lib/constants";

interface ChunkDetailProps {
  chunk: Chunk;
}

export function ChunkDetail({ chunk }: ChunkDetailProps) {
  return (
    <div className="space-y-4">
      {/* 标题区 */}
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#fafaf9" }}>
              {chunk.word}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#a8a29e" }}>
              {chunk.translation} · {chunk.part_of_speech}
            </p>
          </div>
          <FavoriteButton chunkId={chunk.id} size={22} />
        </div>

        {/* 标签行 */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className="rounded px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: "#1c1917", color: "#f59e0b", border: "1px solid #44403c" }}
          >
            B2 {chunk.band_level}
          </span>
          <FrequencyBadge score={chunk.frequency_score} size="md" />
          {chunk.modules.map((m) => (
            <span
              key={m}
              className="rounded px-2 py-0.5 text-xs"
              style={{ backgroundColor: "#1c1917", color: "#a8a29e" }}
            >
              {MODULE_META[m].icon} {MODULE_META[m].label}
            </span>
          ))}
        </div>
      </div>

      {/* 高频搭配 */}
      <section>
        <h3 className="mb-2 text-sm font-semibold" style={{ color: "#fafaf9" }}>
          🔗 高频搭配
        </h3>
        <div className="space-y-1">
          {chunk.collocations.map((col, i) => (
            <div
              key={i}
              className="rounded p-2 text-sm"
              style={{ backgroundColor: "#292524", color: "#fafaf9" }}
            >
              {col}
            </div>
          ))}
        </div>
      </section>

      {/* 例句 */}
      <section>
        <h3 className="mb-2 text-sm font-semibold" style={{ color: "#fafaf9" }}>
          📝 例句
        </h3>
        <div
          className="rounded p-3 text-sm leading-relaxed"
          style={{ backgroundColor: "#292524", color: "#d6d3d1" }}
        >
          {chunk.example_sentence.split(chunk.word).map((part, i) =>
            i === 0 ? (
              <span key={i}>{part}</span>
            ) : (
              <span key={i}>
                <span style={{ color: "#f59e0b", fontWeight: 600 }}>{chunk.word}</span>
                {part}
              </span>
            )
          )}
        </div>
      </section>

      {/* 雅思场景 */}
      <section>
        <h3 className="mb-2 text-sm font-semibold" style={{ color: "#fafaf9" }}>
          🎯 雅思场景
        </h3>
        <div
          className="rounded p-2 text-xs"
          style={{ backgroundColor: "#292524", color: "#a8a29e" }}
        >
          {chunk.ielts_context}
        </div>
      </section>

      {/* 近义表达 */}
      <section>
        <h3 className="mb-2 text-sm font-semibold" style={{ color: "#fafaf9" }}>
          🔄 近义表达
        </h3>
        <div className="flex flex-wrap gap-1">
          {chunk.synonyms.map((s) => (
            <span
              key={s}
              className="rounded px-2 py-1 text-xs"
              style={{ backgroundColor: "#1c1917", color: "#a8a29e" }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* 常见错误 */}
      <section>
        <h3 className="mb-2 text-sm font-semibold" style={{ color: "#f59e0b" }}>
          ⚠️ 常见错误
        </h3>
        <div className="space-y-1">
          {chunk.common_mistakes.map((m, i) => (
            <div
              key={i}
              className="rounded p-2 text-xs"
              style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#fbbf24" }}
            >
              {m}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
