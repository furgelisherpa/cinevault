"use client";

import React from "react";
import InfiniteGrid from "./InfiniteGrid";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types";

interface MoviesClientProps {
  initialItems: Movie[];
}

export default function MoviesClient({ initialItems }: MoviesClientProps) {
  const fetchData = React.useCallback(
    (page: number, genreId?: number) => movieApi.getMovies(page, genreId),
    []
  );

  return (
    <InfiniteGrid
      title="Movies"
      fetchData={fetchData}
      initialItems={initialItems}
      initialPage={1}
    />
  );
}
