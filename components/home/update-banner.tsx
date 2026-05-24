// components/home/update-banner.tsx

export function UpdateBanner() {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "linear-gradient(135deg, #78350f, #1c1917)",
        border: "1px solid #44403c",
      }}
    >
      <div className="text-xs" style={{ color: "#fbbf24" }}>
        📡 2026年5月更新
      </div>
      <div className="mt-1 text-xl font-bold" style={{ color: "#fafaf9" }}>
        48 个新词块已入库
      </div>
      <div className="mt-1 text-xs" style={{ color: "#a8a29e" }}>
        Technology & AI · Education 专题上线
      </div>
    </div>
  );
}
