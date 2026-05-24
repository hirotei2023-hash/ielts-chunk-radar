// components/chunks/favorite-button.tsx

"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

interface FavoriteButtonProps {
  chunkId: string;
  size?: number;
}

export function FavoriteButton({ chunkId, size = 18 }: FavoriteButtonProps) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(chunkId));
  }, [chunkId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(chunkId);
    setFav(!fav);
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
