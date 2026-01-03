"use client";

import { Movie } from "@/types";
import MovieCard from "./MovieCard";
import { useAuth } from "@/context/AuthContext";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const { user, setShowAuthModal, toggleFavorite, toggleWatchlist } = useAuth();

  const handleAction = async (action: string, movie: Movie) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Use optimistic toggle functions from AuthContext
    if (action === "favorites") {
      await toggleFavorite(movie);
    } else if (action === "watchlist") {
      await toggleWatchlist(movie);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-4">
      <h2 className="text-xl font-bold text-gray-100 mb-4">{title}</h2>
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth snap-x">
          {movies.map((movie) => (
            <div key={movie.id} className="snap-start">
              <MovieCard movie={movie} onAction={handleAction} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
