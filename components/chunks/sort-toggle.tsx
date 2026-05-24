// components/chunks/sort-toggle.tsx

import { SORT_OPTIONS, type SortKey } from "@/lib/constants";

interface SortToggleProps {
  value: SortKey;
  onChange: (key: SortKey) => void;
}

export function SortToggle({ value, onChange }: SortToggleProps) {
  return (
    <div className="flex gap-1">
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
          style={{
            backgroundColor: value === opt.key ? "#78350f" : "#292524",
            color: value === opt.key ? "#fbbf24" : "#a8a29e",
          }}
        >
          {opt.key === "frequency" ? "🔥 " : ""}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
