// app/profile/page.tsx

import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { ComingSoon } from "@/components/profile/coming-soon";
import { Star } from "lucide-react";

export default function ProfilePage() {
  return (
    <PageContainer>
      <Link
        href="/profile/favorites"
        className="mb-6 mt-4 flex items-center justify-between rounded-lg p-4"
        style={{ backgroundColor: "#292524" }}
      >
        <div className="flex items-center gap-3">
          <Star size={20} color="#f59e0b" fill="#f59e0b" />
          <span className="font-medium" style={{ color: "#fafaf9" }}>
            我的收藏
          </span>
        </div>
        <span className="text-sm" style={{ color: "#a8a29e" }}>
          查看 &rarr;
        </span>
      </Link>

      <ComingSoon
        title="个人中心"
        description="学习统计 · 掌握词块 · 错题本 · 每日计划"
        features={[
          { icon: "📊", label: "学习统计" },
          { icon: "📋", label: "错题本" },
          { icon: "📅", label: "每日计划" },
        ]}
      />
    </PageContainer>
  );
}
