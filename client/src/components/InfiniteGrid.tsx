"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Movie } from "@/types";
import MovieCard from "./MovieCard";
import GenreSelector from "./GenreSelector";

interface InfiniteGridProps {
  fetchData: (
    page: number,
    genreId?: number
  ) => Promise<{ results: Movie[]; total_pages: number }>;
  title: string;
  initialItems?: Movie[];
  initialPage?: number;
}

export default function InfiniteGrid({
  fetchData,
  title,
  initialItems = [],
  initialPage = 1,
}: InfiniteGridProps) {
  const [items, setItems] = useState<Movie[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const loadMore = useCallback(
    async (isReset = false) => {
      if ((loadingRef.current || !hasMore) && !isReset) return;

      if (isReset && initialItems.length > 0 && selectedGenre === null) {
        // Skip initial load if we already have items and no genre filter
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      const currentPage = isReset ? 1 : page;

      try {
        const data = await fetchData(currentPage, selectedGenre || undefined);
        if (data.results.length === 0) {
          setHasMore(false);
        } else {
          setItems((prev) => {
            if (isReset) return data.results;
            const newItems = [...prev];
            data.results.forEach((item) => {
              if (!newItems.find((i) => i.id === item.id)) {
                newItems.push(item);
              }
            });
            return newItems;
          });
          setPage(currentPage + 1);
          if (currentPage >= data.total_pages) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasMore(false);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [page, hasMore, fetchData, selectedGenre, initialItems.length]
  );

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setItems([]);
    setPage(1);
    setHasMore(true);
    // Trigger reset load
  };

  useEffect(() => {
    loadMore(true);
  }, [selectedGenre, fetchData, loadMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 500 >=
        document.documentElement.offsetHeight
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <main className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight capitalize mb-8">
          {title}
        </h1>
        <GenreSelector
          selectedGenreId={selectedGenre}
          onGenreChange={handleGenreChange}
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 sm:px-6 lg:px-8">
        {items.map((item) => (
          <div key={item.id} className="flex justify-center">
            <MovieCard movie={item} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="text-center py-10 text-zinc-500 text-sm font-medium">
          You&apos;ve reached the end of the line. 🎬
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-20 text-zinc-500">No content found.</div>
      )}
    </main>
  );
}
