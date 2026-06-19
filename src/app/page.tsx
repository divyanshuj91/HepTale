import Link from 'next/link'
import { getTrendingMovies, getTrendingTV, getTrendingAnime } from '@/lib/tmdb'
import MediaCard from '@/components/MediaCard'
import { MOODS } from '@/lib/tmdb'
import { Play, Flame, Heart, Smile, Brain, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const revalidate = 3600 // Revalidate page every hour

// Helper to get matching icons for moods
function getMoodIcon(moodId: string) {
  switch (moodId) {
    case 'feel-good':
      return <Smile className="h-6 w-6 text-emerald-400" />
    case 'gritty':
      return <Flame className="h-6 w-6 text-orange-400" />
    case 'tearjerker':
      return <Heart className="h-6 w-6 text-rose-400" />
    case 'mind-bending':
      return <Brain className="h-6 w-6 text-cyan-400" />
    default:
      return <Sparkles className="h-6 w-6 text-zinc-400" />
  }
}

function getMoodColorClass(moodId: string) {
  switch (moodId) {
    case 'feel-good':
      return 'from-emerald-500/10 to-yellow-500/5 hover:border-emerald-400/40 card-glow-emerald border-emerald-500/20'
    case 'gritty':
      return 'from-orange-500/10 to-red-500/5 hover:border-orange-400/40 card-glow-gold border-orange-500/20'
    case 'tearjerker':
      return 'from-rose-500/10 to-purple-500/5 hover:border-rose-400/40 card-glow-rose border-rose-500/20'
    case 'mind-bending':
      return 'from-cyan-500/10 to-blue-500/5 hover:border-cyan-400/40 card-glow-emerald border-cyan-500/20'
    default:
      return 'from-zinc-900 to-zinc-950 border-zinc-800'
  }
}

export default async function HomePage() {
  const [movies, tvShows, anime] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
    getTrendingAnime(),
  ])

  // Use the top trending movie for the Hero backdrop
  const heroMedia = movies[2] || movies[0]
  const heroBackdrop = heroMedia?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${heroMedia.backdrop_path}`
    : null

  return (
    <div className="flex flex-col pb-12">
      {/* 1. Cinematic Hero Banner */}
      {heroMedia && (
        <section className="relative flex min-h-[60vh] md:min-h-[70vh] w-full items-end justify-start overflow-hidden py-16">
          {/* Background backdrop image with dual dark gradient overlays */}
          {heroBackdrop ? (
            <div className="absolute inset-0 -z-10">
              <img
                src={heroBackdrop}
                alt={heroMedia.title || 'Hero Movie'}
                className="h-full w-full object-cover object-center opacity-45 scale-100 transition-transform duration-10000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-zinc-900 via-zinc-950 to-zinc-900" />
          )}

          <div className="container mx-auto px-4">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                <Sparkles className="h-3 w-3" />
                Featured Release
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-zinc-100">
                {heroMedia.title}
              </h1>
              <p className="line-clamp-3 text-base text-zinc-300 md:text-lg">
                {heroMedia.overview}
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={`/movie/${heroMedia.id}`}>
                  <Button className="bg-emerald-400 font-bold text-zinc-950 hover:bg-emerald-300 shadow-[0_0_20px_oklch(0.85_0.16_150/20%)] transition-all cursor-pointer">
                    <Play className="mr-2 h-4 w-4 fill-zinc-950" />
                    Review & Details
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" className="border-zinc-800 bg-zinc-900/20 text-zinc-100 hover:bg-zinc-900/60 hover:text-white transition-all cursor-pointer">
                    Explore More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 mt-8 space-y-12">
        {/* 2. Mood-Based Discovery Board */}
        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 md:text-2xl">
              How are you feeling today?
            </h2>
            <p className="text-sm text-zinc-500">
              Discover titles tailored to your emotional state or vibe.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {MOODS.map((mood) => (
              <Link
                key={mood.id}
                href={`/search?mood=${mood.id}`}
                className={`flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/40 hover:shadow-2xl ${getMoodColorClass(mood.id)}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950/60 ring-1 ring-zinc-800 mb-3">
                  {getMoodIcon(mood.id)}
                </div>
                <span className="text-base font-bold text-zinc-100">{mood.name}</span>
                <span className="mt-1 text-xs text-zinc-500">Explore mood</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Trending Movies Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 md:text-2xl">
              Trending Movies
            </h2>
            <Link href="/discover/movie" className="text-sm font-semibold text-emerald-400 hover:underline">
              See all
            </Link>
          </div>
          
          <div className="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {movies.map((movie: any) => (
              <div key={movie.id} className="w-[180px] flex-shrink-0 sm:w-[200px]">
                <MediaCard {...movie} media_type="movie" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Trending TV Shows Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 md:text-2xl">
              Hot TV Shows
            </h2>
            <Link href="/discover/tv" className="text-sm font-semibold text-emerald-400 hover:underline">
              See all
            </Link>
          </div>
          
          <div className="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {tvShows.map((show: any) => (
              <div key={show.id} className="w-[180px] flex-shrink-0 sm:w-[200px]">
                <MediaCard {...show} media_type="tv" />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Trending Anime Row */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 md:text-2xl">
              Hot Anime Series
            </h2>
            <Link href="/discover/anime" className="text-sm font-semibold text-emerald-400 hover:underline">
              See all
            </Link>
          </div>
          
          <div className="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {anime.map((show: any) => (
              <div key={show.id} className="w-[180px] flex-shrink-0 sm:w-[200px]">
                <MediaCard {...show} media_type="tv" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
