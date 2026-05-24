// app/page.tsx

import { PageContainer } from "@/components/layout/page-container";
import { UpdateBanner } from "@/components/home/update-banner";
import { TopicGrid } from "@/components/home/topic-grid";
import { TopChunks } from "@/components/home/top-chunks";

export default function HomePage() {
  return (
    <PageContainer>
      <div className="space-y-6 pt-4">
        {/* 品牌栏 */}
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: "#f59e0b" }}>
            雅思词块雷达
          </h1>
          <span className="text-xs" style={{ color: "#a8a29e" }}>
            📡 2026年5月
          </span>
        </header>

        <UpdateBanner />
        <TopicGrid />
        <TopChunks />
      </div>
    </PageContainer>
  );
}
