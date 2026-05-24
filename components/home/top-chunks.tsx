// components/home/top-chunks.tsx

import { getTopChunks } from "@/lib/chunks";
import { ChunkCard } from "@/components/chunks/chunk-card";

export function TopChunks() {
  const topChunks = getTopChunks(10);

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold" style={{ color: "#fafaf9" }}>
        🔥 本月高频 Top 10
      </h2>
      <div className="flex flex-col gap-2">
        {topChunks.map((chunk) => (
          <ChunkCard key={chunk.id} chunk={chunk} />
        ))}
      </div>
    </div>
  );
}
