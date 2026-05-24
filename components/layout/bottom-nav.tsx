// components/layout/bottom-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, RotateCcw, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "首页", icon: Home },
  { href: "/library", label: "词块库", icon: Library },
  { href: "/review", label: "复习", icon: RotateCcw },
  { href: "/profile", label: "我的", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg border-t"
      style={{ backgroundColor: "#1c1917", borderColor: "#44403c" }}
    >
      <div className="flex justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5"
            >
              <Icon
                size={20}
                color={isActive ? "#f59e0b" : "#a8a29e"}
              />
              <span
                className="text-[10px]"
                style={{ color: isActive ? "#f59e0b" : "#a8a29e" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
