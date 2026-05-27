"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStudyStats } from "@/lib/progress";
import { getFavoriteCount } from "@/lib/favorites";
import { getSettings, saveSettings } from "@/lib/user-settings";
import type { UserSettings } from "@/lib/user-settings";
import { Target, TrendingUp, Star, Clock, Settings2 } from "lucide-react";

interface Stats {
  totalLearned: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  dueToday: number;
}

export function ProfileStats() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [favCount, setFavCount] = useState(0);
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [editing, setEditing] = useState(false);
  const [draftNickname, setDraftNickname] = useState(settings.nickname);
  const [draftBand, setDraftBand] = useState(settings.targetBand);

  useEffect(() => {
    getStudyStats().then(setStats);
    setFavCount(getFavoriteCount());
  }, []);

  const displayName = settings.nickname || "烤鸭选手";
  const displayInitial = displayName.charAt(0).toUpperCase();

  const handleStartEdit = () => {
    setDraftNickname(settings.nickname);
    setDraftBand(settings.targetBand);
    setEditing(true);
  };

  const handleSave = () => {
    const updated: UserSettings = {
      nickname: draftNickname.trim(),
      targetBand: draftBand || "6.0",
    };
    saveSettings(updated);
    setSettings(updated);
    setEditing(false);
  };

  const cards = [
    { icon: TrendingUp, label: "已学习", value: stats?.totalLearned ?? 0, color: "#f59e0b", href: "/library?status=learned" },
    { icon: Target, label: "已掌握", value: stats?.masteredCount ?? 0, color: "#84cc16", href: "/library?status=mastered" },
    { icon: Star, label: "收藏", value: favCount, color: "#f59e0b", href: "/profile/favorites" },
    { icon: Clock, label: "今日待复习", value: stats?.dueToday ?? 0, color: "#ea580c", href: "/review" },
  ];

  return (
    <div>
      {/* User info */}
      <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: "#292524" }}>
        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs" style={{ color: "#a8a29e" }}>昵称</label>
              <input
                type="text"
                value={draftNickname}
                onChange={(e) => setDraftNickname(e.target.value)}
                placeholder="给自己起个名字"
                maxLength={20}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#1c1917", color: "#fafaf9", border: "1px solid #44403c" }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs" style={{ color: "#a8a29e" }}>雅思目标分数</label>
              <select
                value={draftBand}
                onChange={(e) => setDraftBand(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#1c1917", color: "#fafaf9", border: "1px solid #44403c" }}
              >
                {["5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"].map((b) => (
                  <option key={b} value={b}>Band {b}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                style={{ backgroundColor: "#f59e0b", color: "#1c1917" }}
              >
                保存
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-full px-4 py-1.5 text-sm"
                style={{ backgroundColor: "#1c1917", color: "#a8a29e" }}
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold"
                style={{ backgroundColor: "#78350f", color: "#fbbf24" }}
              >
                {displayInitial}
              </div>
              <div>
                <p className="font-medium" style={{ color: "#fafaf9" }}>{displayName}</p>
                <p className="text-xs" style={{ color: "#a8a29e" }}>目标：Band {settings.targetBand}</p>
              </div>
            </div>
            <button
              onClick={handleStartEdit}
              className="rounded-lg p-2 transition-colors hover:brightness-110"
              style={{ backgroundColor: "#1c1917" }}
            >
              <Settings2 size={18} color="#a8a29e" />
            </button>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={() => router.push(card.href)}
              className="cursor-pointer rounded-lg p-4 transition-colors hover:brightness-110"
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
