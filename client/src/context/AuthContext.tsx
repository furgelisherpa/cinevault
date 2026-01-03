"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { userApi } from "../lib/api";
import { useToast } from "./ToastContext";

import { Movie } from "../types";

interface User {
  id: string;
  username: string;
  email: string;
  watchlist?: Movie[];
  favorites?: Movie[];
  watched?: Movie[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: Record<string, string>) => Promise<void>;
  register: (userData: Record<string, string>) => Promise<void>;
  logout: () => void;
  loading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  refreshProfile: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  toggleFavorite: (movie: Movie) => Promise<void>;
  toggleWatchlist: (movie: Movie) => Promise<void>;
  updateProfile: (data: {
    username?: string;
    email?: string;
    password?: string;
    currentPassword: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Debounce utility
const debounceTimers: Record<string, NodeJS.Timeout> = {};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      userApi
        .getProfile()
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: Record<string, string>) => {
    const data = await userApi.login(credentials);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    showToast(`Welcome back, ${data.user.username}!`, "success");
  };

  const register = async (userData: Record<string, string>) => {
    await userApi.register(userData);
    showToast(
      `Account created successfully! Please sign in to continue.`,
      "success"
    );
  };

  const refreshProfile = async () => {
    try {
      const userData = await userApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    showToast("Successfully logged out", "info");
  };

  const updateProfile = async (data: {
    username?: string;
    email?: string;
    password?: string;
    currentPassword: string;
  }) => {
    try {
      const updatedUser = await userApi.updateProfile(data);
      setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
      showToast("Profile updated successfully!", "success");
    } catch (error: unknown) {
      const message =
        (error as any).response?.data?.error || "Failed to update profile";
      showToast(message, "error");
      throw error;
    }
  };

  // Optimistic toggle with debouncing
  const toggleFavorite = async (movie: Movie) => {
    if (!user) return;

    // Optimistically update UI
    const isInFavorites = user.favorites?.some((m) => m.id === movie.id);
    const updatedFavorites = isInFavorites
      ? user.favorites?.filter((m) => m.id !== movie.id) || []
      : [...(user.favorites || []), movie];

    setUser({ ...user, favorites: updatedFavorites });

    // Debounce API call
    const key = `favorites-${movie.id}`;
    if (debounceTimers[key]) clearTimeout(debounceTimers[key]);

    debounceTimers[key] = setTimeout(async () => {
      try {
        const updatedUser = await userApi.toggleList(
          "favorites",
          movie as unknown as Record<string, unknown>
        );
        setUser(updatedUser);
        showToast(
          isInFavorites ? "Removed from favorites" : "Added to favorites",
          "success"
        );
      } catch {
        // Revert on error
        setUser(user);
        showToast("Failed to update favorites", "error");
      }
      delete debounceTimers[key];
    }, 500);
  };

  const toggleWatchlist = async (movie: Movie) => {
    if (!user) return;

    // Optimistically update UI
    const isInWatchlist = user.watchlist?.some((m) => m.id === movie.id);
    const updatedWatchlist = isInWatchlist
      ? user.watchlist?.filter((m) => m.id !== movie.id) || []
      : [...(user.watchlist || []), movie];

    setUser({ ...user, watchlist: updatedWatchlist });

    // Debounce API call
    const key = `watchlist-${movie.id}`;
    if (debounceTimers[key]) clearTimeout(debounceTimers[key]);

    debounceTimers[key] = setTimeout(async () => {
      try {
        const updatedUser = await userApi.toggleList(
          "watchlist",
          movie as unknown as Record<string, unknown>
        );
        setUser(updatedUser);
        showToast(
          isInWatchlist ? "Removed from watchlist" : "Added to watchlist",
          "success"
        );
      } catch {
        // Revert on error
        setUser(user);
        showToast("Failed to update watchlist", "error");
      }
      delete debounceTimers[key];
    }, 500);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        showAuthModal,
        setShowAuthModal,
        refreshProfile,
        setUser,
        toggleFavorite,
        toggleWatchlist,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
