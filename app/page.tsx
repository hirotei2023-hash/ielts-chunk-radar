// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { UpdateBanner } from "@/components/home/update-banner";
import { TopicGrid } from "@/components/home/topic-grid";
import { TopChunks } from "@/components/home/top-chunks";
import { getStudyStats } from "@/lib/progress";
import Link from "next/link";
import { TrendingUp, Clock } from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState<{ totalLearned: number; dueToday: number } | null>(null);

  useEffect(() => {
    getStudyStats().then((s) => {
      if (s) setStats({ totalLearned: s.totalLearned, dueToday: s.dueToday });
    });
  }, []);

  return (
    <PageContainer>
      <div className="space-y-6 pt-4">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: "#f59e0b" }}>
            雅思词块雷达
          </h1>
          <span className="text-xs" style={{ color: "#a8a29e" }}>
            📡 2026年5月
          </span>
        </header>

        {/* Learning overview cards */}
        {stats && (
          <div className="flex gap-3">
            <Link
              href="/review"
              className="flex-1 rounded-lg p-3"
              style={{ backgroundColor: "#292524" }}
            >
              <div className="flex items-center gap-2">
                <Clock size={18} color="#ea580c" />
                <span className="text-sm" style={{ color: "#a8a29e" }}>今日待复习</span>
              </div>
              <p className="mt-1 text-2xl font-bold" style={{ color: "#ea580c" }}>
                {stats.dueToday}
              </p>
            </Link>
            <Link
              href="/profile"
              className="flex-1 rounded-lg p-3"
              style={{ backgroundColor: "#292524" }}
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={18} color="#f59e0b" />
                <span className="text-sm" style={{ color: "#a8a29e" }}>已学习</span>
              </div>
              <p className="mt-1 text-2xl font-bold" style={{ color: "#f59e0b" }}>
                {stats.totalLearned}
              </p>
            </Link>
          </div>
        )}

        <UpdateBanner />
        <TopicGrid />
        <TopChunks />
      </div>
    </PageContainer>
  );
}
