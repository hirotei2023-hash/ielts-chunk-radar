// app/chunk/[id]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { getChunkById, getChunkIds } from "@/lib/chunks";
import { PageContainer } from "@/components/layout/page-container";
import { ChunkDetail } from "@/components/chunks/chunk-detail";
import { ChevronLeft } from "lucide-react";

export function generateStaticParams() {
  return getChunkIds().map((id) => ({ id }));
}

export default async function ChunkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chunk = getChunkById(id);

  if (!chunk) {
    notFound();
  }

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
        <ChunkDetail chunk={chunk} />
      </div>
    </PageContainer>
  );
}
