"use client";

import { useAuth } from "@/lib/auth";
import { BottomNav } from "./bottom-nav";

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-lg">
      {children}
      {(user || !process.env.NEXT_PUBLIC_SUPABASE_URL) && <BottomNav />}
    </div>
  );
}
