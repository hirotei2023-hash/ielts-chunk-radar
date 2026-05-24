"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { isFavorite, toggleFavorite } from "@/lib/favorites-supabase";

interface FavoriteButtonProps {
  chunkId: string;
  size?: number;
}

export function FavoriteButton({ chunkId, size = 18 }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (!user) return;
    isFavorite(chunkId).then(setFav);
  }, [chunkId, user]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    const result = await toggleFavorite(chunkId);
    setFav(result);
  };

  return (
    <button onClick={handleClick} className="transition-colors hover:scale-110" aria-label="收藏">
      <Star
        size={size}
        fill={fav ? "#f59e0b" : "none"}
        color={fav ? "#f59e0b" : "#a8a29e"}
      />
    </button>
  );
}
