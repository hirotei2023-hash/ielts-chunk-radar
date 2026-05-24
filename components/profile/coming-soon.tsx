// components/profile/coming-soon.tsx

interface FeatureCard {
  icon: string;
  label: string;
}

interface ComingSoonProps {
  title: string;
  description: string;
  features: FeatureCard[];
}

export function ComingSoon({ title, description, features }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 pt-16 text-center">
      <h2 className="text-xl font-bold" style={{ color: "#fafaf9" }}>
        {title}
      </h2>
      <p className="mt-2 text-sm" style={{ color: "#a8a29e" }}>
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {features.map((f) => (
          <span
            key={f.label}
            className="rounded-lg px-3 py-2 text-xs"
            style={{ backgroundColor: "#292524", color: "#a8a29e" }}
          >
            {f.icon} {f.label}
          </span>
        ))}
      </div>
      <button
        disabled
        className="mt-6 rounded-full px-6 py-2 text-sm font-medium cursor-not-allowed"
        style={{ backgroundColor: "#292524", color: "#78716c" }}
      >
        即将上线
      </button>
    </div>
  );
}
