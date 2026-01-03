"use client";

import { movieApi } from "@/lib/api";
import { Movie } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import { useAuth } from "@/context/AuthContext";

export default function MovieDetails() {
  const params = useParams();
  const {
    user,
    setShowAuthModal,
    toggleFavorite,
    toggleWatchlist,
    loading: authLoading,
  } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const isInFavorites = user?.favorites?.some((m) => m.id === movie?.id);
  const isInWatchlist = user?.watchlist?.some((m) => m.id === movie?.id);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!params.id) return;

      setLoading(true);
      setError(null);

      try {
        const movieData = await movieApi.getDetails(params.id as string);
        setMovie(movieData);

        // Fetch similar and trending movies in parallel
        const [similarData, trendingData] = await Promise.all([
          movieApi.getRecommendations(params.id as string),
          movieApi.getTrending(1),
        ]);

        setSimilarMovies(similarData.results?.slice(0, 12) || []);
        setTrendingMovies(trendingData.results?.slice(0, 12) || []);
      } catch (e) {
        console.error("Error fetching movie:", e);
        setError(e instanceof Error ? e.message : "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id]);

  const handleAction = async (action: string, selectedMovie: Movie) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (action === "favorites") {
      await toggleFavorite(selectedMovie);
    } else if (action === "watchlist") {
      await toggleWatchlist(selectedMovie);
    }
  };

  const handleFavorite = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (movie) toggleFavorite(movie);
  };

  const handleWatchlist = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (movie) toggleWatchlist(movie);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-gray-400 mb-6">
            {error || "Unable to load movie details"}
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-all text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Get director and trailer
  const director = movie.credits?.crew.find(
    (person) => person.job === "Director"
  );
  const trailer = movie.videos?.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 pb-20">
      {/* Hero Banner with Full Details */}
      <div className="relative min-h-screen w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          {movie.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/80 to-black" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div>
            {/* Poster and Title Section */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Movie Poster */}
              {movie.poster_path && (
                <div className="flex-shrink-0">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-64 rounded-xl shadow-2xl border-2 border-white/20"
                  />
                </div>
              )}

              {/* Title and Info */}
              <div className="flex-1">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-6">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}

                {/* Key Info Bar */}
                <div className="flex items-center gap-6 text-lg mb-6 flex-wrap">
                  <span className="text-yellow-400 font-bold text-2xl flex items-center gap-2">
                    ★ {movie.vote_average.toFixed(1)}
                    <span className="text-sm text-gray-400">
                      ({movie.vote_count?.toLocaleString()})
                    </span>
                  </span>
                  {movie.release_date && (
                    <span className="text-white font-semibold">
                      {new Date(movie.release_date).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                  )}
                  {movie.runtime && (
                    <span className="bg-white/10 border border-white/30 px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex gap-3 mb-6 flex-wrap">
                    {movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium border border-white/30 hover:border-white/50 transition-all"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Director */}
                {director && (
                  <div className="mb-6">
                    <span className="text-gray-400">Directed by </span>
                    <span className="text-white font-semibold text-lg">
                      {director.name}
                    </span>
                  </div>
                )}

                {/* Action Buttons - Only show when auth is loaded */}
                {!authLoading && (
                  <div className="flex flex-wrap gap-4">
                    {trailer && (
                      <button
                        onClick={() => setShowPlayer(true)}
                        className="px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-black font-bold rounded-xl hover:from-gray-100 hover:to-white transition-all flex items-center gap-3 shadow-2xl hover:shadow-white/20 hover:scale-105 transform duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Play Trailer
                      </button>
                    )}
                    <button
                      onClick={handleFavorite}
                      className={`px-6 py-4 ${
                        isInFavorites
                          ? "bg-gradient-to-r from-red-500/30 to-pink-500/30 border-red-400/50"
                          : "bg-white/10 border-white/30"
                      } border-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-sm hover:scale-105 transform duration-200`}
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
                      {isInFavorites ? "Favorited" : "Favorite"}
                    </button>
                    <button
                      onClick={handleWatchlist}
                      className={`px-6 py-4 ${
                        isInWatchlist
                          ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border-blue-400/50"
                          : "bg-white/10 border-white/30"
                      } border-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-sm hover:scale-105 transform duration-200`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {isInWatchlist ? (
                          <polyline points="20 6 9 17 4 12"></polyline>
                        ) : (
                          <>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </>
                        )}
                      </svg>
                      {isInWatchlist ? "In Watchlist" : "Watchlist"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Overview */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
                {movie.overview}
              </p>
            </div>

            {/* Additional Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {movie.status && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Status</div>
                  <div className="text-white font-semibold">{movie.status}</div>
                </div>
              )}
              {movie.original_language && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Language</div>
                  <div className="text-white font-semibold uppercase">
                    {movie.original_language}
                  </div>
                </div>
              )}
              {movie.budget && movie.budget > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Budget</div>
                  <div className="text-white font-semibold">
                    {formatCurrency(movie.budget)}
                  </div>
                </div>
              )}
              {movie.revenue && movie.revenue > 0 && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Revenue</div>
                  <div className="text-white font-semibold">
                    {formatCurrency(movie.revenue)}
                  </div>
                </div>
              )}
            </div>

            {/* Production Companies */}
            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Production
                  </h3>
                  <div className="flex gap-6 flex-wrap items-center">
                    {movie.production_companies.slice(0, 4).map((company) => (
                      <div
                        key={company.id}
                        className="bg-white rounded-lg px-6 py-4 shadow-lg"
                      >
                        {company.logo_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                            alt={company.name}
                            className="h-8 object-contain"
                          />
                        ) : (
                          <span className="text-sm text-gray-800 font-medium">
                            {company.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Cast - Smaller Circular Avatars */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6">Cast</h3>
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {movie.credits.cast.slice(0, 12).map((actor) => (
                    <div
                      key={actor.id}
                      className="flex flex-col items-center min-w-25"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 border-2 border-white/20 mb-2 hover:border-white/50 transition-all">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                            👤
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-white text-sm font-medium truncate w-24">
                          {actor.name}
                        </div>
                        <div className="text-gray-400 text-xs truncate w-24">
                          {actor.character}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-8 text-white">More Like This</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth snap-x">
            {similarMovies.map((similarMovie) => (
              <div key={similarMovie.id} className="snap-start">
                <MovieCard movie={similarMovie} onAction={handleAction} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Movies Section */}
      {trendingMovies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-8 text-white">Trending Now</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-smooth snap-x">
            {trendingMovies.map((trendingMovie) => (
              <div key={trendingMovie.id} className="snap-start">
                <MovieCard movie={trendingMovie} onAction={handleAction} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showPlayer && trailer && (
        <VideoPlayerModal
          videoKey={trailer.key}
          title={movie.title}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </main>
  );
}
