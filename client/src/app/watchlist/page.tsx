"use client";

import React from "react";
import { Movie } from "@/types";
import { userApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import MovieCard from "@/components/MovieCard";

export default function WatchlistPage() {
  const { user, loading, setUser } = useAuth();
  const { showToast } = useToast();
  const watchlist = user?.watchlist || [];
  const favorites = user?.favorites || [];

  const handleAction = async (action: string, movie: Movie) => {
    try {
      const updatedUser = await userApi.addToList(
        action as "watchlist" | "favorites" | "watched",
        movie as unknown as Record<string, unknown>
      );
      setUser(updatedUser);
      showToast(`Added to ${action}`, "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to update list", "error");
    }
  };

  return (
    <main className="min-h-screen bg-black pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
          My Collection
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {favorites.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-zinc-400 mb-6 uppercase tracking-widest text-xs font-semibold">
                Your Favorites
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {favorites.map((item: Movie) => (
                  <div key={item.id} className="flex justify-center">
                    <MovieCard movie={item} onAction={handleAction} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {watchlist.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-zinc-400 mb-6 uppercase tracking-widest text-xs font-semibold">
                Watchlist
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {watchlist.map((item: Movie) => (
                  <div key={item.id} className="flex justify-center">
                    <MovieCard movie={item} onAction={handleAction} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {favorites.length === 0 && watchlist.length === 0 && !loading && (
            <div className="text-center py-20 text-zinc-500 font-medium">
              Your collection is empty. Start adding some movies!
            </div>
          )}
        </div>
      )}
    </main>
  );
}
