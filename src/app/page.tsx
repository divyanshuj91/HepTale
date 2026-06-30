import Link from 'next/link'
import { getTrendingMovies, getTrendingTV, getTrendingAnime, getNewReleases } from '@/lib/tmdb'
import MediaCard from '@/components/MediaCard'
import { MOODS } from '@/lib/tmdb'
import { Play, Flame, Heart, Smile, Brain, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const revalidate = 3600 // Revalidate page every hour

// Helper to get matching icons for moods
function getMoodIcon(moodId: string) {
  switch (moodId) {
    case 'feel-good':
      return <Smile className="h-6 w-6 text-secondary" />
    case 'gritty':
      return <Flame className="h-6 w-6 text-primary" />
    case 'tearjerker':
      return <Heart className="h-6 w-6 text-destructive" />
    case 'mind-bending':
      return <Brain className="h-6 w-6 text-accent-foreground" />
    default:
      return <Sparkles className="h-6 w-6 text-muted-foreground" />
  }
}

export default async function HomePage() {
  const [movies, tvShows, anime, newReleases] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
    getTrendingAnime(),
    getNewReleases(),
  ])

  // Use the top trending movie for the Hero backdrop
  const heroMedia = movies[2] || movies[0]
  const heroBackdrop = heroMedia?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${heroMedia.backdrop_path}`
    : null

  return (
    <div className="flex flex-col pb-16 bg-background text-foreground transition-colors duration-200">
      {/* 1. Cinematic Hero Banner */}
      {heroMedia && (
        <section className="relative flex min-h-[65vh] md:min-h-[75vh] w-full items-end justify-start overflow-hidden py-16 border-b border-primary">
          {/* Background backdrop image with dual dark gradient overlays */}
          {heroBackdrop ? (
            <div className="absolute inset-0 -z-10">
              <img
                src={heroBackdrop}
                alt={heroMedia.title || 'Hero Movie'}
                className="h-full w-full object-cover object-center opacity-35"
              />
              <div className="absolute inset-0 marquee-gradient" />
            </div>
          ) : (
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-background via-primary/5 to-background" />
          )}

          <div className="container mx-auto px-4 max-w-container-max">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-1.5 border border-primary bg-background px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                <Sparkles className="h-3 w-3 fill-primary text-primary" />
                Feature Presentation
              </div>
              <h1 className="text-4xl font-serif italic font-bold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-lg leading-tight">
                {heroMedia.title}
              </h1>
              <p className="line-clamp-3 font-serif text-base text-white/90 md:text-lg max-w-xl leading-relaxed drop-shadow-md">
                {heroMedia.overview}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href={`/movie/${heroMedia.id}`}>
                  <Button className="rounded-none bg-primary text-white border border-primary px-8 py-3 h-auto font-sans font-bold uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:opacity-95 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--shadow-color)] transition-all cursor-pointer">
                    <Play className="mr-2 h-3.5 w-3.5 fill-white text-white" />
                    Review & Details
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" className="rounded-none border-white bg-transparent text-white px-8 py-3 h-auto font-sans font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-primary transition-all cursor-pointer">
                    Explore Archives
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 mt-12 max-w-container-max space-y-16">
        {/* 2. Mood-Based Discovery Board */}
        <section className="space-y-6">
          <div className="flex flex-col gap-1 border-b border-primary pb-3">
            <h2 className="text-2xl font-serif italic font-bold tracking-tight text-primary md:text-3xl">
              Curator's Atmosphere Select
            </h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Filter the cinematic library based on thematic resonance and mood.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {MOODS.map((mood) => (
              <Link
                key={mood.id}
                href={`/search?mood=${mood.id}`}
                className="flex flex-col items-center justify-center border border-primary bg-card p-6 text-center shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_0px_var(--shadow-color)] transition-all duration-200 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
              >
                <div className="flex h-12 w-12 items-center justify-center border border-primary bg-background mb-4 shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                  {getMoodIcon(mood.id)}
                </div>
                <span className="text-base font-serif italic font-bold text-primary">{mood.name}</span>
                <span className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Explore vibe</span>
              </Link>
            ))}
          </div>
        </section>

        {/* New Releases Row */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-primary pb-2">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-2xl font-serif italic font-bold text-primary">
                New Releases
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fresh from the Theaters</span>
            </div>
            <Link href="/discover/movie" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest border-b border-primary pb-0.5 hover:text-primary transition-all">
              Browse All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="flex w-full gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {newReleases.map((movie: any) => (
              <div key={movie.id} className="w-[180px] flex-shrink-0 sm:w-[220px]">
                <MediaCard {...movie} media_type="movie" />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Trending Movies Row */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-primary pb-2">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-2xl font-serif italic font-bold text-primary">
                Daily Selections
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trending Film Reel</span>
            </div>
            <Link href="/discover/movie" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest border-b border-primary pb-0.5 hover:text-primary transition-all">
              Browse All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="flex w-full gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {movies.map((movie: any) => (
              <div key={movie.id} className="w-[180px] flex-shrink-0 sm:w-[220px]">
                <MediaCard {...movie} media_type="movie" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Trending TV Shows Row */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-primary pb-2">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-2xl font-serif italic font-bold text-primary">
                Television Archive
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Highly Reviewed Broadcasts</span>
            </div>
            <Link href="/discover/tv" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest border-b border-primary pb-0.5 hover:text-primary transition-all">
              Browse All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="flex w-full gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {tvShows.map((show: any) => (
              <div key={show.id} className="w-[180px] flex-shrink-0 sm:w-[220px]">
                <MediaCard {...show} media_type="tv" />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Trending Anime Row */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-primary pb-2">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-2xl font-serif italic font-bold text-primary">
                Illustrated Works
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Featured Anime Series</span>
            </div>
            <Link href="/discover/anime" className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest border-b border-primary pb-0.5 hover:text-primary transition-all">
              Browse All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="flex w-full gap-6 overflow-x-auto pb-6 custom-scrollbar">
            {anime.map((show: any) => (
              <div key={show.id} className="w-[180px] flex-shrink-0 sm:w-[220px]">
                <MediaCard {...show} media_type="tv" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
