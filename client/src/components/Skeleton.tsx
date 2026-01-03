"use client";

import React from "react";

export const MovieCardSkeleton = () => {
  return (
    <div className="shrink-0 w-40 md:w-50 aspect-2/3 rounded-xl overflow-hidden bg-zinc-900/50 animate-pulse">
      <div className="w-full h-full bg-zinc-800/50" />
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-3 bg-zinc-800 rounded w-1/4" />
          <div className="h-3 bg-zinc-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex justify-center">
          <MovieCardSkeleton />
        </div>
      ))}
    </div>
  );
};
export const MovieRowSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="h-7 bg-zinc-800 rounded w-48 mb-6 animate-pulse" />
      <div className="flex gap-6 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
