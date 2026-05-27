"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { ProfileStats } from "@/components/profile/profile-stats";
import { useAuth } from "@/lib/auth";
import { getScoreHistory } from "@/lib/scores";
import type { ScoreRecord } from "@/lib/scores";
import { LogOut } from "lucide-react";

function ScoreHistory() {
  const [records, setRecords] = useState<ScoreRecord[]>([]);

  useEffect(() => {
    setRecords(getScoreHistory());
  }, []);

  if (records.length === 0) return null;

  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: "#292524" }}>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: "#fafaf9" }}>
        📊 复习成绩
      </h3>
      <div className="flex items-end gap-1" style={{ height: 64 }}>
        {records.slice(0, 14).reverse().map((r) => {
          const h = Math.max(4, (r.score / 100) * 60);
          return (
            <div key={r.date} className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-[9px] font-medium" style={{ color: r.score >= 60 ? "#bef264" : "#fca5a5" }}>
                {r.score}
              </span>
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: h,
                  backgroundColor: r.score >= 80 ? "#84cc16" : r.score >= 60 ? "#f59e0b" : "#ea580c",
                  opacity: 0.7,
                }}
              />
              <span className="text-[8px]" style={{ color: "#78716c" }}>
                {r.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { signOut } = useAuth();

  return (
    <PageContainer title="个人中心">
      <div className="pt-4 space-y-4">
        <ProfileStats />

        <ScoreHistory />

        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg p-4"
          style={{ backgroundColor: "#292524" }}
        >
          <LogOut size={20} color="#a8a29e" />
          <span style={{ color: "#a8a29e" }}>退出登录</span>
        </button>
      </div>
    </PageContainer>
  );
}
