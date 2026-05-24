// app/review/page.tsx
"use client";

import { PageContainer } from "@/components/layout/page-container";
import { ReviewSession } from "@/components/review/review-session";

export default function ReviewPage() {
  return (
    <PageContainer title="智能复习">
      <ReviewSession />
    </PageContainer>
  );
}
