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
    // Perform OMDb search
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
    <div className="container mx-auto px-4 py-12 max-w-container-max bg-background text-foreground transition-colors duration-200">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        
        {/* 1. Left Sidebar: Search & Filters */}
        <div className="space-y-8 lg:col-span-1">
          {/* Search Form */}
          <form method="GET" action="/search" className="space-y-4">
            <h2 className="text-xl font-serif italic font-bold text-primary flex items-center gap-2 border-b border-primary pb-2">
              <SearchIcon className="h-4.5 w-4.5" />
              Search Archive
            </h2>
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search titles..."
                className="w-full rounded-xl border border-primary bg-card py-2.5 pl-4 pr-10 text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]"
              />
              <button type="submit" className="absolute right-3 top-3 text-primary hover:opacity-80 cursor-pointer">
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>
            {/* Persist mood if searching */}
            {selectedMood && <input type="hidden" name="mood" value={selectedMood} />}
          </form>

          {/* Type Filters */}
          <div className="space-y-3 border-t border-primary pt-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Media Type
            </h3>
            <div className="flex flex-col gap-3">
              <Link href={`/search?type=movie${query ? `&q=${query}` : ''}${selectedMood ? `&mood=${selectedMood}` : ''}`}>
                <Button
                  variant={selectedType === 'movie' ? 'default' : 'outline'}
                  className={`w-full justify-start rounded-xl uppercase tracking-widest text-xs font-bold ${selectedType === 'movie' ? 'bg-primary text-white border-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]' : 'border-primary text-primary hover:bg-muted'}`}
                >
                  <Film className="mr-2 h-4 w-4" />
                  Films
                </Button>
              </Link>
              <Link href={`/search?type=tv${query ? `&q=${query}` : ''}${selectedMood ? `&mood=${selectedMood}` : ''}`}>
                <Button
                  variant={selectedType === 'tv' ? 'default' : 'outline'}
                  className={`w-full justify-start rounded-xl uppercase tracking-widest text-xs font-bold ${selectedType === 'tv' ? 'bg-primary text-white border-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]' : 'border-primary text-primary hover:bg-muted'}`}
                >
                  <Tv className="mr-2 h-4 w-4" />
                  TV Broadcasts
                </Button>
              </Link>
            </div>
          </div>

          {/* Mood Filters */}
          <div className="space-y-3 border-t border-primary pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Thematic Vibe
              </h3>
              {selectedMood && (
                <Link href={`/search?type=${selectedType}${query ? `&q=${query}` : ''}`} className="text-xs font-bold uppercase tracking-widest text-destructive hover:underline">
                  Clear
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-3 lg:flex-col">
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
                      className={`w-full justify-start rounded-xl uppercase tracking-widest text-xs font-bold ${isSelected ? 'bg-primary text-white border-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]' : 'border-primary text-primary hover:bg-muted'}`}
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
        <div className="space-y-8 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-primary pb-4">
            <div>
              <h1 className="text-2xl font-serif italic font-bold text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {query ? `Search Results for "${query}"` : selectedMood ? `Atmosphere: ${MOODS.find(m=>m.id === selectedMood)?.name}` : 'Explore Curated Selection'}
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                Showing {results.length} archival items
              </p>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {results.map((item) => (
                <MediaCard
                  key={item.id}
                  {...item}
                  media_type={item.media_type || selectedType}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-primary">
              <p className="text-muted-foreground font-serif italic text-base">No titles matched your search.</p>
              <Link href="/search" className="mt-4 text-primary font-bold uppercase tracking-widest text-xs border border-primary px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-all shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                Reset Archive Filters
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
