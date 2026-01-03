"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, setShowAuthModal, loading } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 bg-black border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="shrink-0 text-xl font-bold bg-linear-to-r from-zinc-300 to-white bg-clip-text text-transparent transition-opacity hover:opacity-80"
            >
              CineVault
            </Link>
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`${
                    pathname === "/"
                      ? "text-white font-bold"
                      : "text-gray-400 hover:text-white transition-colors"
                  } text-sm`}
                >
                  Home
                </Link>
                <Link
                  href="/movies"
                  className={`${
                    pathname === "/movies"
                      ? "text-white font-bold"
                      : "text-gray-400 hover:text-white transition-colors"
                  } text-sm`}
                >
                  Movies
                </Link>
                <Link
                  href="/new-popular"
                  className={`${
                    pathname === "/new-popular"
                      ? "text-white font-bold"
                      : "text-gray-400 hover:text-white transition-colors"
                  } text-sm`}
                >
                  New & Popular
                </Link>
                <button
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      setShowAuthModal(true);
                    } else {
                      router.push("/watchlist");
                    }
                  }}
                  className={`${
                    pathname === "/watchlist"
                      ? "text-white font-bold"
                      : "text-gray-400 hover:text-white transition-colors"
                  } text-sm cursor-pointer`}
                >
                  My List
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-1 justify-end">
            <div className="relative group max-w-50 md:max-w-md w-full">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center"
              >
                <svg
                  className="absolute left-3 w-4 h-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  className="w-full bg-black border border-white/20 rounded-sm py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-white transition-all text-white placeholder-gray-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
            </div>

            <div className="flex items-center gap-4">
              {loading ? (
                // Skeleton loader while auth is loading
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
                  <div className="hidden md:block w-20 h-4 bg-gray-800 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-white text-xs font-bold group-hover:border-white/30 transition-all">
                      {user.username ? user.username[0].toUpperCase() : "U"}
                    </div>
                    <span className="hidden md:block text-sm text-gray-300 group-hover:text-white transition-colors">
                      {user.username}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 group-hover:text-white transition-all duration-300 ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-sm shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-white truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            Your Profile
                          </Link>
                          <Link
                            href="/watchlist"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            My List
                          </Link>
                        </div>
                        <div className="py-1 border-t border-white/5">
                          <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-black px-5 py-1.5 rounded-sm text-sm font-bold transition-all hover:bg-zinc-200 active:scale-95"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
