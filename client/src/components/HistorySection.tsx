"use client";

import { useEffect, useState } from 'react';
import { userApi } from '@/lib/api';
import { Movie } from '@/types';
import MovieRow from './MovieRow';

import { useAuth } from '@/context/AuthContext';

export default function HistorySection() {
    const { user, loading: authLoading } = useAuth();
    const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                // profile is already in user object from AuthContext, 
                // but let's fetch fresh data if needed or just use current user
                if (user.watched) {
                    setWatchedMovies([...user.watched].reverse());
                }
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, authLoading]);

    if (loading || watchedMovies.length === 0) return null;

    return (
        <div className="mb-8">
            <MovieRow title="Recently Watched" movies={watchedMovies} />
        </div>
    );
}
