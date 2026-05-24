// components/chunks/frequency-badge.tsx

interface FrequencyBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export function FrequencyBadge({ score, size = "sm" }: FrequencyBadgeProps) {
  const isHigh = score >= 90;
  const isMedium = score >= 70;
  const sizeClass = size === "md" ? "text-sm px-2 py-0.5" : "text-xs px-1.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded font-bold ${sizeClass}`}
      style={{
        color: isHigh ? "#ea580c" : isMedium ? "#f59e0b" : "#a8a29e",
        backgroundColor: isHigh ? "rgba(234,88,12,0.15)" : isMedium ? "rgba(245,158,11,0.15)" : "rgba(168,162,158,0.1)",
      }}
    >
      🔥 {score}
    </span>
  );
}
