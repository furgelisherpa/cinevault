import { movieApi } from "@/lib/api";
import MovieRow from "@/components/MovieRow";
import Hero from "@/components/Hero";
import HomeRows from "@/components/HomeRows";
import HistorySection from "@/components/HistorySection";
import PersonalSections from "@/components/PersonalSections";

// Fetch data on the server
async function getData() {
  try {
    const [trending, popular] = await Promise.all([
      movieApi.getTrending(),
      movieApi.getPopular(),
    ]);
    return {
      trending: trending.results || [],
      popular: popular.results || [],
    };
  } catch (error) {
    console.error("Failed to fetch home data", error);
    return {
      trending: [],
      popular: [],
    };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-black pb-20 pt-12">
      {/* Hero Section */}
      <Hero trendingMovies={data.trending} />

      <div className="mt-4 relative z-10 space-y-6">
        <HistorySection />
        <PersonalSections />
        <MovieRow title="Trending Now" movies={data.trending} />
        <MovieRow title="Popular on CineVault" movies={data.popular} />
        <HomeRows />
      </div>
    </main>
  );
}
