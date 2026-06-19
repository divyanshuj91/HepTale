import { getDiscoverMedia, getTrendingAnime } from '@/lib/tmdb'
import MediaCard from '@/components/MediaCard'
import { Sparkles } from 'lucide-react'

interface DiscoverPageProps {
  params: Promise<{
    type: string
  }>
}

export default async function DiscoverPage({ params }: DiscoverPageProps) {
  const { type } = await params

  let title = 'Discover'
  let description = 'Explore trending titles'
  let items: any[] = []

  if (type === 'movie') {
    title = 'Discover Movies'
    description = 'Browse the highest rated and most popular movies'
    items = await getDiscoverMedia('movie')
  } else if (type === 'tv') {
    title = 'Discover TV Shows'
    description = 'Browse the trending TV shows and series'
    items = await getDiscoverMedia('tv')
  } else if (type === 'anime') {
    title = 'Discover Anime'
    description = 'Explore top-rated Japanese animation series and films'
    // For anime, we use the trending anime helper which targets original language 'ja' and genre Animation (16)
    items = await getTrendingAnime()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Sparkles className="h-3 w-3" />
          HepTale Hub
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
          {title}
        </h1>
        <p className="text-zinc-500 text-sm max-w-xl">
          {description}
        </p>
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <MediaCard
              key={item.id}
              {...item}
              media_type={type === 'movie' ? 'movie' : 'tv'}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-zinc-500 text-base">No titles found. Please check your configuration.</p>
        </div>
      )}
    </div>
  )
}
