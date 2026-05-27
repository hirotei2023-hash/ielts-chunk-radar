// lib/user-settings.ts
// 本地用户设置：昵称 & 雅思目标分数

const KEY = "ielts-chunk-radar-user-settings";

export interface UserSettings {
  nickname: string;
  targetBand: string;
}

const DEFAULTS: UserSettings = {
  nickname: "",
  targetBand: "6.0",
};

function read(): UserSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function getSettings(): UserSettings {
  return read();
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(settings));
}
