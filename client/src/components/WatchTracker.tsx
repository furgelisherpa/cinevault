"use client";

import { useEffect } from "react";
import { userApi } from "@/lib/api";
import { Movie } from "@/types";

export default function WatchTracker({ movie }: { movie: Movie }) {
  useEffect(() => {
    if (!movie) return;

    // Add to "watched" history
    userApi
      .addToList("watched", {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      })
      .catch((err) => console.error("Failed to track watch history", err));
  }, [movie]);

  return null; // Side-effect only component
}
