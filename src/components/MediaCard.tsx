import Link from 'next/link'
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
    <Link href={href} className="group relative flex flex-col border border-primary bg-card text-foreground shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_0px_var(--shadow-color)] transition-all duration-200 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_var(--shadow-color)]">
      {/* Aspect Ratio container for Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-background border-b border-primary">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-muted/20 p-4 text-center">
            <span className="text-xs font-serif italic text-muted-foreground">{displayTitle}</span>
            <span className="mt-2 text-[9px] font-bold uppercase tracking-widest text-primary border border-primary px-1.5 py-0.5 bg-background">{media_type}</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
          {vote_average !== undefined && vote_average > 0 && (
            <div className="flex items-center gap-1 border border-primary bg-background px-2 py-0.5 text-[10px] font-bold text-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {vote_average.toFixed(1)}
            </div>
          )}
          <div className="border border-primary bg-primary text-primary-foreground px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--shadow-color)]">
            {media_type === 'movie' ? 'Film' : 'Series'}
          </div>
        </div>

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Media Details */}
      <div className="p-3.5 flex flex-col gap-1">
        <h3 className="line-clamp-1 font-serif italic text-base font-bold text-primary group-hover:underline transition-colors">
          {displayTitle}
        </h3>
        <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
          {year ? year : 'Release Unknown'}
        </p>
      </div>
    </Link>
  )
}
