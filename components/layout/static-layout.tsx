"use client";

import { BottomNav } from "./bottom-nav";

export function StaticLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg">
      {children}
      <BottomNav />
    </div>
  );
}
