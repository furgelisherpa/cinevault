import React from "react";
import MoviesClient from "@/components/MoviesClient";
import { movieApi } from "@/lib/api";

async function getData() {
  try {
    const movies = await movieApi.getMovies(1);
    return {
      initialMovies: movies.results || [],
    };
  } catch (error) {
    console.error("Failed to fetch movies data:", error);
    return {
      initialMovies: [],
    };
  }
}

export default async function MoviesPage() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-black">
      <MoviesClient initialItems={data.initialMovies} />
    </div>
  );
}
