// app/review/page.tsx

import { PageContainer } from "@/components/layout/page-container";
import { ComingSoon } from "@/components/profile/coming-soon";

export default function ReviewPage() {
  return (
    <PageContainer>
      <ComingSoon
        title="智能复习系统"
        description="间隔重复 · 拼写练习 · 场景应用训练"
        features={[
          { icon: "📝", label: "拼写练习" },
          { icon: "🎯", label: "语境填空" },
          { icon: "💬", label: "场景应用" },
        ]}
      />
    </PageContainer>
  );
}
