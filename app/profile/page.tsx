"use client";

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { ProfileStats } from "@/components/profile/profile-stats";
import { useAuth } from "@/lib/auth";
import { Star, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { signOut } = useAuth();

  return (
    <PageContainer title="个人中心">
      <div className="pt-4 space-y-4">
        <ProfileStats />

        <Link
          href="/profile/favorites"
          className="flex items-center justify-between rounded-lg p-4"
          style={{ backgroundColor: "#292524" }}
        >
          <div className="flex items-center gap-3">
            <Star size={20} color="#f59e0b" fill="#f59e0b" />
            <span className="font-medium" style={{ color: "#fafaf9" }}>我的收藏</span>
          </div>
          <span className="text-sm" style={{ color: "#a8a29e" }}>查看 &rarr;</span>
        </Link>

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
