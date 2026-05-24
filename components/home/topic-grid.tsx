// components/home/topic-grid.tsx

import Link from "next/link";
import { TOPICS, TOPIC_META } from "@/lib/constants";

export function TopicGrid() {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold" style={{ color: "#fafaf9" }}>
        📚 按主题学习
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {TOPICS.map((t) => (
          <Link
            key={t}
            href={`/library?topic=${t}`}
            className="flex flex-col items-center gap-1 rounded-lg p-3 transition-colors hover:brightness-110"
            style={{ backgroundColor: "#292524" }}
          >
            <span className="text-xl">{TOPIC_META[t].icon}</span>
            <span className="text-xs font-medium text-center" style={{ color: "#fafaf9" }}>
              {TOPIC_META[t].label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
