export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  credits?: {
      cast: { id: number; name: string; character: string; profile_path: string }[];
      crew: { id: number; name: string; job: string }[];
  };
  videos?: {
      results: { key: string; site: string; type: string }[];
  };
  tagline?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  original_language?: string;
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
  production_companies?: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  homepage?: string;
}

export interface User {
    _id: string;
    username: string;
    watchlist: Movie[];
    favorites: Movie[];
    watched: Movie[];
}
