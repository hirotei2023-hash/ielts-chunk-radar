// app/layout.tsx

import type { Metadata } from "next";
import { BottomNav } from "@/components/layout/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "雅思词块雷达",
  description: "扫出考试高频表达，只练用得上的。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <div className="mx-auto max-w-lg">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
