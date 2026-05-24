// components/chunks/mastery-badge.tsx

interface MasteryBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export function MasteryBadge({ score, size = "sm" }: MasteryBadgeProps) {
  const sizeClass = size === "md" ? "px-2 py-0.5 text-xs" : "px-1.5 py-0.5 text-[10px]";

  if (score === 0) {
    return (
      <span className={`rounded ${sizeClass}`} style={{ backgroundColor: "#292524", color: "#78716c" }}>
        未学习
      </span>
    );
  }

  if (score >= 85) {
    return (
      <span className={`rounded ${sizeClass}`} style={{ backgroundColor: "rgba(132,204,22,0.15)", color: "#bef264" }}>
        已掌握 {score}%
      </span>
    );
  }

  if (score >= 60) {
    return (
      <span className={`rounded ${sizeClass}`} style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>
        学习中 {score}%
      </span>
    );
  }

  return (
    <span className={`rounded ${sizeClass}`} style={{ backgroundColor: "rgba(234,88,12,0.15)", color: "#fdba74" }}>
      重点复习 {score}%
    </span>
  );
}
