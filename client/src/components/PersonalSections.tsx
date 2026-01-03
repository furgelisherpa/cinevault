'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MovieRow from './MovieRow';

export default function PersonalSections() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {user.favorites && user.favorites.length > 0 && (
        <MovieRow title="Your Favorites" movies={user.favorites} />
      )}
      {user.watchlist && user.watchlist.length > 0 && (
        <MovieRow title="My List" movies={user.watchlist} />
      )}
    </>
  );
}
