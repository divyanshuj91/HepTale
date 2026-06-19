import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'

interface MediaCardProps {
  id: number
  title?: string
  name?: string
  poster_path?: string | null
  media_type: 'movie' | 'tv'
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

export default function MediaCard({
  id,
  title,
  name,
  poster_path,
  media_type,
  vote_average,
  release_date,
  first_air_date,
}: MediaCardProps) {
  const displayTitle = title || name || 'Untitled'
  const dateStr = release_date || first_air_date
  const year = dateStr ? new Date(dateStr).getFullYear() : null
  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : null

  const href = `/${media_type}/${id}`

  return (
    <Link href={href} className="group relative flex flex-col overflow-hidden rounded-xl glass-panel card-glow-emerald transition-all duration-300 hover:-translate-y-1">
      {/* Aspect Ratio container for Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 text-center">
            <span className="text-sm font-semibold text-zinc-400">{displayTitle}</span>
            <span className="mt-2 text-xs uppercase tracking-widest text-zinc-600">{media_type}</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          {vote_average !== undefined && vote_average > 0 && (
            <div className="flex items-center gap-1 rounded-md bg-zinc-950/80 px-2 py-1 text-xs font-semibold text-amber-400 backdrop-blur-sm shadow-[0_0_10px_oklch(0.8_0.15_80/15%)]">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {vote_average.toFixed(1)}
            </div>
          )}
          <div className="rounded-md bg-zinc-950/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-sm self-end shadow-[0_0_10px_oklch(0.85_0.16_150/15%)]">
            {media_type === 'movie' ? 'Movie' : 'Show'}
          </div>
        </div>

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Media Details */}
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-zinc-100 transition-colors group-hover:text-emerald-400">
          {displayTitle}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          {year ? year : 'Release Unknown'}
        </p>
      </div>
    </Link>
  )
}
