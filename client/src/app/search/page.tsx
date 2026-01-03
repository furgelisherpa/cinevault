"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { movieApi } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Movie[]>([]);

  // Filters
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");

  const fetchResults = useCallback(
    async (q: string) => {
      try {
        const filters: Record<string, string> = {};
        if (genre) filters.with_genres = genre;
        if (year) filters.primary_release_year = year;

        const res = await movieApi.search(q, filters);
        setResults(res.results || []);
      } catch (e) {
        console.error(e);
      }
    },
    [genre, year]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(initialQuery);
      void fetchResults(initialQuery);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialQuery, fetchResults]);

  const handleFilterChange = () => {
    fetchResults(query);
  };

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <h1 className="text-3xl font-bold">
          Search Results: &quot;{query}&quot;
        </h1>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              handleFilterChange();
            }}
          >
            <option value="">All Genres</option>
            {GENRES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              handleFilterChange();
            }}
          >
            <option value="">All Years</option>
            {Array.from(
              { length: 30 },
              (_, i) => new Date().getFullYear() - i
            ).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchResults(query)}
            className="bg-blue-600 px-4 py-2 rounded text-sm font-medium"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {results.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-gray-500 text-center mt-20">
          No results found. Try adjusting your filters.
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SearchResults />
    </Suspense>
  );
}
