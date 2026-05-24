// components/chunks/chunk-card.tsx

import Link from "next/link";
import type { Chunk } from "@/types/chunk";
import { FrequencyBadge } from "./frequency-badge";
import { FavoriteButton } from "./favorite-button";
import { TOPIC_META, MODULE_META } from "@/lib/constants";

interface ChunkCardProps {
  chunk: Chunk;
}

export function ChunkCard({ chunk }: ChunkCardProps) {
  return (
    <Link href={`/chunk/${chunk.id}`} className="block">
      <div
        className="rounded-lg p-3 transition-colors hover:brightness-110"
        style={{ backgroundColor: "#292524" }}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate" style={{ color: "#fafaf9" }}>
                {chunk.word}
              </span>
              <FrequencyBadge score={chunk.frequency_score} />
            </div>
            <div className="mt-1 text-xs" style={{ color: "#a8a29e" }}>
              {chunk.translation}
            </div>
            <div className="mt-2 flex items-center gap-1 flex-wrap">
              {chunk.topics.map((t) => (
                <span
                  key={t}
                  className="inline-block rounded px-1.5 py-0.5 text-xs"
                  style={{ backgroundColor: "#78350f", color: "#fbbf24" }}
                >
                  {TOPIC_META[t].icon} {TOPIC_META[t].label}
                </span>
              ))}
              {chunk.modules.slice(0, 2).map((m) => (
                <span
                  key={m}
                  className="inline-block rounded px-1.5 py-0.5 text-xs"
                  style={{ backgroundColor: "#1c1917", color: "#a8a29e" }}
                >
                  {MODULE_META[m].label}
                </span>
              ))}
            </div>
          </div>
          <FavoriteButton chunkId={chunk.id} />
        </div>
      </div>
    </Link>
  );
}
