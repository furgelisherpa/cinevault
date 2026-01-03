"use client";

import React from "react";
import InfiniteGrid from "./InfiniteGrid";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types";

interface TVShowsClientProps {
  initialItems: Movie[];
}

export default function TVShowsClient({ initialItems }: TVShowsClientProps) {
  const fetchData = React.useCallback(
    (page: number) => movieApi.getTVShows(page),
    []
  );

  return (
    <InfiniteGrid
      title="TV Shows"
      fetchData={fetchData}
      initialItems={initialItems}
      initialPage={1}
    />
  );
}
