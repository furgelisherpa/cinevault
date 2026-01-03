import React from "react";
import TVShowsClient from "@/components/TVShowsClient";
import { movieApi } from "@/lib/api";

async function getData() {
  try {
    const tvShows = await movieApi.getTVShows(1);
    return {
      initialTVShows: tvShows.results || [],
    };
  } catch (error) {
    console.error("Failed to fetch TV shows data:", error);
    return {
      initialTVShows: [],
    };
  }
}

export default async function TVShowsPage() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-black">
      <TVShowsClient initialItems={data.initialTVShows} />
    </div>
  );
}
