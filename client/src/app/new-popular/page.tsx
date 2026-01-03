import React from "react";
import NewPopularClient from "@/components/NewPopularClient";
import { movieApi } from "@/lib/api";

async function getData() {
  try {
    const trending = await movieApi.getTrending(1);
    return {
      initialTrending: trending.results || [],
    };
  } catch (error) {
    console.error("Failed to fetch new & popular data:", error);
    return {
      initialTrending: [],
    };
  }
}

export default async function NewPopularPage() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-black">
      <NewPopularClient initialItems={data.initialTrending} />
    </div>
  );
}
