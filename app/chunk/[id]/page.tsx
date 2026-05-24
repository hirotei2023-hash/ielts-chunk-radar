// app/chunk/[id]/page.tsx (server component for static generation)
import { getAllChunks } from "@/lib/chunks";
import { ChunkPageClient } from "./chunk-page-client";

export function generateStaticParams() {
  return getAllChunks().map((c) => ({ id: c.id }));
}

export default function ChunkPage({
  params,
}: {
  params: { id: string };
}) {
  return <ChunkPageClient id={params.id} />;
}
