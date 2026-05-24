// components/chunks/filter-bar.tsx

import type { Topic, Module } from "@/types/chunk";
import { TOPICS, TOPIC_META, MODULES, MODULE_META } from "@/lib/constants";

interface FilterBarProps {
  selectedTopic: Topic | null;
  selectedModule: Module | null;
  onTopicChange: (topic: Topic | null) => void;
  onModuleChange: (module: Module | null) => void;
}

export function FilterBar({
  selectedTopic,
  selectedModule,
  onTopicChange,
  onModuleChange,
}: FilterBarProps) {
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onTopicChange(null)}
          className="shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: selectedTopic === null ? "#78350f" : "#292524",
            color: selectedTopic === null ? "#fbbf24" : "#a8a29e",
          }}
        >
          全部
        </button>
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => onTopicChange(t === selectedTopic ? null : t)}
            className="shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors"
            style={{
              backgroundColor: t === selectedTopic ? "#78350f" : "#292524",
              color: t === selectedTopic ? "#fbbf24" : "#a8a29e",
            }}
          >
            {TOPIC_META[t].icon} {TOPIC_META[t].label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        {MODULES.map((m) => (
          <button
            key={m}
            onClick={() => onModuleChange(m === selectedModule ? null : m)}
            className="rounded px-2 py-1 text-xs transition-colors"
            style={{
              backgroundColor: m === selectedModule ? "#292524" : "#1c1917",
              color: m === selectedModule ? "#fafaf9" : "#a8a29e",
              border: `1px solid ${m === selectedModule ? "#f59e0b" : "#44403c"}`,
            }}
          >
            {MODULE_META[m].icon} {MODULE_META[m].label}
          </button>
        ))}
      </div>
    </div>
  );
}
