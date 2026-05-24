// app/profile/favorites/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFavoriteIds } from "@/lib/favorites";
import { getChunkById } from "@/lib/chunks";
import type { Chunk } from "@/types/chunk";
import { PageContainer } from "@/components/layout/page-container";
import { ChunkCard } from "@/components/chunks/chunk-card";
import { ChevronLeft } from "lucide-react";

export default function FavoritesPage() {
  const [chunks, setChunks] = useState<Chunk[]>([]);

  useEffect(() => {
    const ids = getFavoriteIds();
    const loaded = ids.map((id) => getChunkById(id)).filter(Boolean) as Chunk[];
    setChunks(loaded);
  }, []);

  return (
    <PageContainer title="我的收藏">
      <Link
        href="/profile"
        className="mb-4 inline-flex items-center gap-1 text-sm"
        style={{ color: "#a8a29e" }}
      >
        <ChevronLeft size={16} />
        返回
      </Link>

      {chunks.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p style={{ color: "#78716c" }}>
            还没有收藏任何词块
          </p>
          <Link
            href="/library"
            className="mt-3 rounded-full px-6 py-2 text-sm font-medium"
            style={{ backgroundColor: "#78350f", color: "#fbbf24" }}
          >
            去词块库浏览
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs" style={{ color: "#a8a29e" }}>
            已收藏 {chunks.length} 个
          </p>
          {chunks.map((chunk) => (
            <ChunkCard key={chunk.id} chunk={chunk} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
