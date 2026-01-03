"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import MovieRow from "./MovieRow";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

interface GenreRowData {
  id: number;
  name: string;
  movies: Movie[];
}

export default function HomeRows() {
  const [rows, setRows] = useState<GenreRowData[]>([]);
  const currentIndex = useRef(0);
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreRows = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    const genreToLoad = GENRES[currentIndex.current];
    if (!genreToLoad) {
      setHasMore(false);
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      const data = await movieApi.getByGenre(genreToLoad.id);

      if (data.results && data.results.length > 0) {
        setRows((prev) => {
          // Double check if we already have this genre ID to prevent race conditions
          if (prev.some((row) => row.id === genreToLoad.id)) {
            return prev;
          }
          return [
            ...prev,
            {
              id: genreToLoad.id,
              name: genreToLoad.name,
              movies: data.results,
            },
          ];
        });
        currentIndex.current += 1;
      } else {
        // Skip genres with no movies
        currentIndex.current += 1;
        // Optionally trigger next automatically if needed, but intersection observer will likely handle it
      }
    } catch (error) {
      console.error("Error loading genre row:", error);
      // Don't stop entirely on one error, maybe retry later or skip
      currentIndex.current += 1;
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  const lastRowRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreRows();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreRows]
  );

  useEffect(() => {
    // Load initial rows
    loadMoreRows();
  }, [loadMoreRows]);

  return (
    <div className="space-y-6">
      {rows.map((row, index) => (
        <div key={row.id} ref={index === rows.length - 1 ? lastRowRef : null}>
          <MovieRow title={row.name} movies={row.movies} />
        </div>
      ))}

      {loading && (
        <div className="py-10 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}
