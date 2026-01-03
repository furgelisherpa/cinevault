"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Movie } from "@/types";

interface HeroProps {
  trendingMovies: Movie[];
}

export default function Hero({ trendingMovies }: HeroProps) {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const randomMovie =
        trendingMovies[
          Math.floor(Math.random() * Math.min(trendingMovies.length, 10))
        ];
      setHeroMovie(randomMovie);
    }
  }, [trendingMovies]);

  if (!heroMovie) return <div className="h-[65vh] w-full bg-black" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="relative h-[65vh] w-full bg-linear-to-b from-transparent to-black rounded-xl overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${
              heroMovie.backdrop_path || heroMovie.poster_path
            }`}
            alt={heroMovie.title}
            className="w-full h-full object-cover object-top opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/20" />
        </div>
        <div className="absolute bottom-16 left-0 w-full z-10">
          <div className="px-8 sm:px-12">
            <div className="md:w-2/3 lg:w-1/2">
              <h1 className="text-4xl md:text-6xl font-semibold mb-4 drop-shadow-2xl">
                {heroMovie.title}
              </h1>
              <p className="text-lg text-gray-200 line-clamp-3 mb-10 max-w-xl drop-shadow-lg">
                {heroMovie.overview}
              </p>

              <div className="flex items-center gap-4">
                <Link
                  href={`/movie/${heroMovie.id}`}
                  className="flex items-center gap-2 bg-white text-black px-8 py-2.5 rounded hover:bg-white/90 transition-all font-bold"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M7 6v12l10-6z" />
                  </svg>
                  Play
                </Link>
                <Link
                  href={`/movie/${heroMovie.id}`}
                  className="flex items-center gap-2 bg-white/20 text-white px-8 py-2.5 rounded hover:bg-white/30 transition-all font-bold backdrop-blur-sm"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
