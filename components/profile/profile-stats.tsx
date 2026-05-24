"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getStudyStats } from "@/lib/progress";
import { getFavoriteCount } from "@/lib/favorites-supabase";
import { Target, TrendingUp, Star, Clock } from "lucide-react";

interface Stats {
  totalLearned: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  dueToday: number;
}

export function ProfileStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    getStudyStats().then(setStats);
    getFavoriteCount().then(setFavCount);
  }, []);

  const cards = [
    { icon: TrendingUp, label: "已学习", value: stats?.totalLearned ?? 0, color: "#f59e0b" },
    { icon: Target, label: "已掌握", value: stats?.masteredCount ?? 0, color: "#84cc16" },
    { icon: Star, label: "收藏", value: favCount, color: "#f59e0b" },
    { icon: Clock, label: "今日待复习", value: stats?.dueToday ?? 0, color: "#ea580c" },
  ];

  return (
    <div>
      {/* User info */}
      <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: "#292524" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold"
            style={{ backgroundColor: "#78350f", color: "#fbbf24" }}
          >
            {user?.email?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-medium" style={{ color: "#fafaf9" }}>{user?.email ?? "未知"}</p>
            <p className="text-xs" style={{ color: "#a8a29e" }}>目标分数：Band {user?.user_metadata?.target_band ?? "6.0"}</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-lg p-4"
              style={{ backgroundColor: "#292524" }}
            >
              <Icon size={20} color={card.color} />
              <p className="mt-2 text-2xl font-bold" style={{ color: "#fafaf9" }}>
                {card.value}
              </p>
              <p className="text-xs" style={{ color: "#a8a29e" }}>{card.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
