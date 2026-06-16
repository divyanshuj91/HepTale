import { searchMedia, getDiscoverMedia, MOODS } from '@/lib/tmdb'
import MediaCard from '@/components/MediaCard'
import Link from 'next/link'
import { Search as SearchIcon, Filter, Film, Tv, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    mood?: string
    type?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const selectedMood = params.mood || ''
  const selectedType = (params.type === 'movie' || params.type === 'tv') ? params.type : 'movie'

  let results: any[] = []
  
  if (query) {
    // Perform standard keyword search
    results = await searchMedia(query)
    // Filter by type if specified
    if (params.type === 'movie' || params.type === 'tv') {
      results = results.filter((r) => r.media_type === params.type)
    }
  } else if (selectedMood) {
    // Perform mood-based discovery
    results = await getDiscoverMedia(selectedType, undefined, selectedMood)
  } else {
    // Fallback: discover trending items
    results = await getDiscoverMedia(selectedType)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* 1. Left Sidebar: Search & Filters */}
        <div className="space-y-6 lg:col-span-1">
          {/* Search Form */}
          <form method="GET" action="/search" className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-emerald-400" />
              Search
            </h2>
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search movies, tv..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 py-2.5 pl-4 pr-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
              <button type="submit" className="absolute right-3 top-3 text-zinc-400 hover:text-white">
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>
            {/* Persist mood if searching */}
            {selectedMood && <input type="hidden" name="mood" value={selectedMood} />}
          </form>

          {/* Type Filters */}
          <div className="space-y-2 border-t border-zinc-900 pt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Media Type
            </h3>
            <div className="flex flex-col gap-2">
              <Link href={`/search?type=movie${query ? `&q=${query}` : ''}${selectedMood ? `&mood=${selectedMood}` : ''}`}>
                <Button
                  variant={selectedType === 'movie' ? 'default' : 'outline'}
                  className={`w-full justify-start ${selectedType === 'movie' ? 'bg-emerald-500 text-zinc-950 font-semibold' : 'border-zinc-800 hover:bg-zinc-900/60'}`}
                >
                  <Film className="mr-2 h-4 w-4" />
                  Movies
                </Button>
              </Link>
              <Link href={`/search?type=tv${query ? `&q=${query}` : ''}${selectedMood ? `&mood=${selectedMood}` : ''}`}>
                <Button
                  variant={selectedType === 'tv' ? 'default' : 'outline'}
                  className={`w-full justify-start ${selectedType === 'tv' ? 'bg-emerald-500 text-zinc-950 font-semibold' : 'border-zinc-800 hover:bg-zinc-900/60'}`}
                >
                  <Tv className="mr-2 h-4 w-4" />
                  TV Shows
                </Button>
              </Link>
            </div>
          </div>

          {/* Mood Filters */}
          <div className="space-y-2 border-t border-zinc-900 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Filter by Mood
              </h3>
              {selectedMood && (
                <Link href={`/search?type=${selectedType}${query ? `&q=${query}` : ''}`} className="text-xs text-rose-400 hover:underline">
                  Clear
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id
                return (
                  <Link
                    key={mood.id}
                    href={`/search?mood=${mood.id}&type=${selectedType}${query ? `&q=${query}` : ''}`}
                    className="w-auto lg:w-full"
                  >
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      className={`w-full justify-start text-xs font-semibold ${isSelected ? 'bg-gradient-to-r from-emerald-500 to-yellow-400 text-zinc-950' : 'border-zinc-800 hover:bg-zinc-900/60 text-zinc-300'}`}
                    >
                      <Filter className="mr-2 h-3.5 w-3.5" />
                      {mood.name}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* 2. Right Grid: Results */}
        <div className="space-y-6 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                {query ? `Results for "${query}"` : selectedMood ? `Mood: ${MOODS.find(m=>m.id === selectedMood)?.name}` : 'Explore Featured'}
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Showing {results.length} titles
              </p>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {results.map((item) => (
                <MediaCard
                  key={item.id}
                  {...item}
                  media_type={item.media_type || selectedType}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-zinc-500 text-base">No titles matched your search.</p>
              <Link href="/search" className="mt-4 text-emerald-400 hover:underline text-sm font-semibold">
                Reset all filters
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
