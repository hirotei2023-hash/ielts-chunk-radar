// lib/favorites.ts

const STORAGE_KEY = "ielts-chunk-radar-favorites";

export function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const ids = getFavoriteIds();
  const index = ids.indexOf(id);
  if (index > -1) {
    ids.splice(index, 1);
  } else {
    ids.push(id);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  return index === -1;
}

export function getFavoriteCount(): number {
  return getFavoriteIds().length;
}
