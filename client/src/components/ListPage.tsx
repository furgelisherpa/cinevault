"use client";

import { useEffect, useState } from "react";
import { userApi } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types";

interface ListPageProps {
  type: "watchlist" | "favorites" | "watched";
  title: string;
}

export default function ListPage({ type, title }: ListPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getProfile()
      .then((user) => {
        if (user && user[type]) {
          setMovies(user[type]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [type]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-black pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>

        {movies.length === 0 ? (
          <div className="text-gray-500">No movies in this list yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
