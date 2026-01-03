"use client";

import React from "react";
import InfiniteGrid from "./InfiniteGrid";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types";

interface NewPopularClientProps {
  initialItems: Movie[];
}

export default function NewPopularClient({
  initialItems,
}: NewPopularClientProps) {
  const fetchData = React.useCallback(
    (page: number, genreId?: number) => movieApi.getTrending(page, genreId),
    []
  );

  return (
    <InfiniteGrid
      title="New & Popular"
      fetchData={fetchData}
      initialItems={initialItems}
      initialPage={1}
    />
  );
}
