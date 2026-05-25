// app/chunk/[id]/page.tsx (server component for static generation)
import { getAllChunks } from "@/lib/chunks";
import { ChunkPageClient } from "./chunk-page-client";

export function generateStaticParams() {
  return getAllChunks().map((c) => ({ id: c.id }));
}

export default async function ChunkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChunkPageClient id={id} />;
}
