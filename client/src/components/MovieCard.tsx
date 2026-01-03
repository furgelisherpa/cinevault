"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface MovieCardProps {
  movie: Movie;
  onAction?: (action: string, movie: Movie) => void;
}

const CONSTANT_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie, onAction }: MovieCardProps) {
  const { user } = useAuth();
  
  // Robust ID resolution: prefer movie.id, then tmdbId, fallback to a string 'undefined' to trigger backend guard
  const movieId = movie.id || (movie as { tmdbId?: number }).tmdbId;

  const isInWatchlist = user?.watchlist?.some(m => m.id === movieId);
  const isInFavorites = user?.favorites?.some(m => m.id === movieId);

  if (!movieId) {
    // If absolutely no ID, don't render a broken card or handle it gracefully
    console.warn('MovieCard received movie without ID:', movie.title);
  }

  return (
    <div className="group relative shrink-0 w-40 md:w-50 aspect-2/3 rounded-xl overflow-hidden bg-black shadow-2xl transition-all duration-400 ease-out hover:scale-[1.06] hover:z-50 hover:shadow-[0_20px_50_rgba(0,0,0,1)] border border-white/5 hover:border-white/10">
      {/* Detail Link - covers the whole card */}
      <Link href={movieId ? `/movie/${movieId}` : '#'} className="block w-full h-full relative z-0 no-underline">
        {movie.poster_path ? (
          <Image
            src={`${CONSTANT_IMAGE_URL}${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover transition-opacity duration-500 group-hover:opacity-60"
            sizes="(max-width: 768px) 192px, 240px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 p-4 text-center font-medium">
            {movie.title}
          </div>
        )}

        {/* Gradient Overlay (Sleeker and deeper) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Quick Actions - Top Right (Sleeker white/gray buttons) */}
      <div className="absolute top-3 right-3 flex flex-row gap-2 z-20 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAction?.('watchlist', movie); }}
          className={`p-2.5 rounded-full ${isInWatchlist ? 'bg-white/30 border-white/50' : 'bg-black/80 border-white/10'} backdrop-blur-md border hover:bg-white/20 transition-all shadow-xl text-white`}
          title={isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
        >
          {isInWatchlist ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          )}
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAction?.('favorites', movie); }}
          className={`p-2.5 rounded-full ${isInFavorites ? 'bg-white/30 border-white/50' : 'bg-black/80 border-white/10'} backdrop-blur-md border hover:bg-white/20 transition-all shadow-xl text-white`}
          title={isInFavorites ? "In Favorites" : "Add to Favorites"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill={isInFavorites ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      {/* Movie Info - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10 pointer-events-none transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-3">
           <span className="flex items-center gap-1 text-yellow-500 text-xs font-black">
            ★ {movie.vote_average?.toFixed(1) || 'N/A'}
           </span>
           <span className="text-zinc-400 text-[11px] font-bold tracking-wider">
             {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
           </span>
        </div>
      </div>
    </div>
  );
}
