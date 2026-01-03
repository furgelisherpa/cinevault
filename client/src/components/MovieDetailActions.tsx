"use client";

import { useAuth } from '@/context/AuthContext';
import { Movie } from '@/types';
import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { movieApi } from '@/lib/api';

interface MovieDetailActionsProps {
  movie: Movie;
}

export default function MovieDetailActions({ movie }: MovieDetailActionsProps) {
  const { user, setShowAuthModal, toggleFavorite, toggleWatchlist } = useAuth();
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const isInFavorites = user?.favorites?.some(m => m.id === movie.id);
  const isInWatchlist = user?.watchlist?.some(m => m.id === movie.id);

  useEffect(() => {
    const fetchSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const data = await movieApi.getRecommendations(movie.id);
        setSimilarMovies(data.results?.slice(0, 12) || []);
      } catch (error) {
        console.error('Failed to fetch similar movies:', error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilar();
  }, [movie.id]);

  const handleFavorite = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    toggleFavorite(movie);
  };

  const handleWatchlist = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    toggleWatchlist(movie);
  };

  const handleAction = async (action: string, selectedMovie: Movie) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (action === 'favorites') {
      await toggleFavorite(selectedMovie);
    } else if (action === 'watchlist') {
      await toggleWatchlist(selectedMovie);
    }
  };

  // Find Trailer
  const trailer = movie.videos?.results.find(
    v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  return (
    <>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-12">
        {trailer && (
          <a
            href={`https://www.youtube.com/watch?v=${trailer.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center gap-3 shadow-lg text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Play Trailer
          </a>
        )}
        <button
          onClick={handleFavorite}
          className={`px-6 py-4 ${isInFavorites ? 'bg-white/30 border-white/50' : 'bg-white/10 border-white/30'} border-2 text-white font-semibold rounded-lg hover:bg-white/20 transition-all flex items-center gap-2`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isInFavorites ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {isInFavorites ? 'In Favorites' : 'Add to Favorites'}
        </button>
        <button
          onClick={handleWatchlist}
          className={`px-6 py-4 ${isInWatchlist ? 'bg-white/30 border-white/50' : 'bg-white/10 border-white/30'} border-2 text-white font-semibold rounded-lg hover:bg-white/20 transition-all flex items-center gap-2`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isInWatchlist ? (
              <polyline points="20 6 9 17 4 12"></polyline>
            ) : (
              <>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </>
            )}
          </svg>
          {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </button>
      </div>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8 text-white">More Like This</h2>
          {loadingSimilar ? (
            <div className="text-gray-400">Loading similar movies...</div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth snap-x">
              {similarMovies.map((similarMovie) => (
                <div key={similarMovie.id} className="snap-start">
                  <MovieCard movie={similarMovie} onAction={handleAction} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
