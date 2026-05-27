import type { Topic, Module } from "@/types/chunk";

export const TOPIC_META: Record<Topic, { label: string; icon: string }> = {
  education: { label: "Education", icon: "🎓" },
  environment: { label: "Environment", icon: "🌍" },
  technology: { label: "Technology", icon: "💻" },
  work: { label: "Work & Career", icon: "💼" },
  health: { label: "Health", icon: "🏥" },
  city: { label: "City & Transport", icon: "🚇" },
  economy: { label: "Economy", icon: "💰" },
  culture: { label: "Culture", icon: "🎨" },
  society: { label: "Society", icon: "👥" },
  science: { label: "Science", icon: "🔬" },
};

export const TOPICS: Topic[] = Object.keys(TOPIC_META) as Topic[];

export const MODULE_META: Record<Module, { label: string; icon: string }> = {
  listening: { label: "Listening", icon: "🎧" },
  reading: { label: "Reading", icon: "📖" },
  writing: { label: "Writing", icon: "📝" },
  speaking: { label: "Speaking", icon: "🗣" },
};

export const MODULES: Module[] = Object.keys(MODULE_META) as Module[];

export const SORT_OPTIONS = [
  { key: "frequency", label: "频次" },
  { key: "alphabetical", label: "A-Z" },
  { key: "recent", label: "最近" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["key"];
