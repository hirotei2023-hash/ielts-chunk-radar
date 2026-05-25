"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PATHS = ["/login", "/register"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // 没有配置 Supabase 时跳过认证，直接放行
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    if (!user && !PUBLIC_PATHS.includes(pathname)) {
      router.replace("/login");
    }

    if (user && PUBLIC_PATHS.includes(pathname)) {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#1c1917" }}>
        <div style={{ color: "#a8a29e" }}>加载中...</div>
      </div>
    );
  }

  if (!user && !PUBLIC_PATHS.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
