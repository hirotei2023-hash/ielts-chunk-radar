// app/layout.tsx

import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "雅思词块雷达",
  description: "扫出考试高频表达，只练用得上的。",
  manifest: "/ielts-chunk-radar/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "词块雷达",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#1c1917",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="apple-touch-icon" href="/ielts-chunk-radar/icon-192.png" />
        <meta name="theme-color" content="#1c1917" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <AuthGuard>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </AuthGuard>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/ielts-chunk-radar/sw.js')
                  .then(() => console.log('SW registered'))
                  .catch(() => console.log('SW registration failed'));
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
