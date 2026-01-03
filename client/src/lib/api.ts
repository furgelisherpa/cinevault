const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchValues = {
  trending: 'movies/trending',
  popular: 'movies/popular',
  topRated: 'movies/top-rated',
  upcoming: 'movies/upcoming',
};

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-auth-token': token } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `API call failed: ${res.statusText}`);
  }

  return res.json();
}

export const movieApi = {
  getTrending: (page: number = 1, genreId?: number) => 
    fetchAPI(`movies/trending?page=${page}${genreId ? `&with_genres=${genreId}` : ''}`),
  getPopular: (page: number = 1) => fetchAPI(`${fetchValues.popular}?page=${page}`),
  getTopRated: (page: number = 1) => fetchAPI(`${fetchValues.topRated}?page=${page}`),
  getUpcoming: (page: number = 1) => fetchAPI(`${fetchValues.upcoming}?page=${page}`),
  getTVShows: (page: number = 1, genreId?: number) => 
    fetchAPI(`movies/tv-shows?page=${page}${genreId ? `&with_genres=${genreId}` : ''}`),
  getMovies: (page: number = 1, genreId?: number) => 
    fetchAPI(`movies/movies?page=${page}${genreId ? `&with_genres=${genreId}` : ''}`),
  getDetails: (id: string | number) => fetchAPI(`movies/${id}`),
  getRecommendations: (id: string | number) => fetchAPI(`movies/${id}/recommendations`),
  search: (query: string, filters: Record<string, string | number> = {}) => {
      const paramsValues: Record<string, string> = { q: query };
      Object.entries(filters).forEach(([key, value]) => {
          paramsValues[key] = String(value);
      });
      const params = new URLSearchParams(paramsValues);
      return fetchAPI(`movies?${params.toString()}`);
  },
  getByGenre: (genreId: number, page: number = 1) => 
    fetchAPI(`movies?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`)
};

export const userApi = {
    register: (userData: Record<string, string>) => fetchAPI('user/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    login: (credentials: Record<string, string>) => fetchAPI('user/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    getProfile: () => fetchAPI(`user/profile`),
    updateProfile: (data: { username?: string; email?: string; password?: string; currentPassword: string }) =>
        fetchAPI('user/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    getRecommendations: () => fetchAPI(`recommendations`),
    addToList: (listType: 'watchlist' | 'favorites' | 'watched', movie: Record<string, unknown>) =>
        fetchAPI(`user/${listType}`, {
            method: 'POST',
            body: JSON.stringify(movie)
        }),
    removeFromList: (listType: 'watchlist' | 'favorites' | 'watched', movieId: number) =>
        fetchAPI(`user/${listType}/${movieId}`, {
            method: 'DELETE'
        }),
    toggleList: (listType: 'watchlist' | 'favorites' | 'watched', movie: Record<string, unknown>) =>
        fetchAPI(`user/${listType}/toggle`, {
            method: 'PUT',
            body: JSON.stringify(movie)
        })
};
