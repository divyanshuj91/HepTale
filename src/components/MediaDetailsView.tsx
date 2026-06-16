import { getMediaDetails } from '@/lib/tmdb'
import { getCurrentUser } from '@/app/auth-actions'
import { getMovieReviews, getMovieRatingStats } from '@/app/actions/db-actions'
import ReviewSection from './ReviewSection'
import MediaActions from './MediaActions'
import { Calendar, Clock, Film, Star, Tv, Video } from 'lucide-react'

interface MediaDetailsViewProps {
  mediaId: number
  mediaType: 'movie' | 'tv'
}

export default async function MediaDetailsView({
  mediaId,
  mediaType,
}: MediaDetailsViewProps) {
  // 1. Fetch all details concurrently on the server
  const [currentUser, tmdbData, initialReviews, initialStats] = await Promise.all([
    getCurrentUser(),
    getMediaDetails(mediaId, mediaType),
    getMovieReviews(mediaId, mediaType),
    getMovieRatingStats(mediaId, mediaType),
  ])

  // 2. Parse TMDB Details
  const title = tmdbData.title || tmdbData.name || 'Untitled'
  const tagline = tmdbData.tagline
  const overview = tmdbData.overview
  const releaseDate = tmdbData.release_date || tmdbData.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null
  const posterPath = tmdbData.poster_path
  const backdropPath = tmdbData.backdrop_path
  const genres = tmdbData.genres || []
  const runtime = tmdbData.runtime // Movie runtime in minutes
  const seasons = tmdbData.number_of_seasons // TV seasons count
  const voteAverage = tmdbData.vote_average

  // Find trailer YouTube key
  const videosList = tmdbData.videos?.results || []
  const trailerVideo = videosList.find(
    (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  )
  const trailerKey = trailerVideo?.key

  // Get Top Cast
  const castList = tmdbData.credits?.cast?.slice(0, 8) || []

  // Extract Streaming Providers (JustWatch)
  const providersResults = tmdbData['watch/providers']?.results || {}
  
  // Try to check IN (India) and US streaming providers
  const regionUS = providersResults.US || {}
  const regionIN = providersResults.IN || {}
  const streamProviders = [
    ...(regionUS.flatrate || []),
    ...(regionIN.flatrate || []),
  ].filter(
    (provider, index, self) =>
      self.findIndex((p) => p.provider_id === provider.provider_id) === index
  ) // Deduplicate providers

  const backdropUrl = backdropPath
    ? `https://image.tmdb.org/t/p/original${backdropPath}`
    : null
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : null

  return (
    <div className="pb-16 flex flex-col">
      {/* 1. Backdrop Hero Section */}
      <div className="relative min-h-[40vh] md:min-h-[50vh] flex items-end overflow-hidden pt-24 pb-8">
        {backdropUrl ? (
          <div className="absolute inset-0 -z-10">
            <img
              src={backdropUrl}
              alt={title}
              className="h-full w-full object-cover object-center opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-900 to-zinc-950" />
        )}

        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            {/* Poster Card */}
            {posterUrl ? (
              <div className="w-[150px] md:w-[220px] flex-shrink-0 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                <img src={posterUrl} alt={title} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="w-[150px] md:w-[220px] aspect-[2/3] flex-shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-center p-4 text-center text-sm font-semibold text-zinc-500">
                No Poster Available
              </div>
            )}

            {/* Info details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                    {mediaType === 'movie' ? 'Movie' : 'TV Series'}
                  </span>
                  {voteAverage > 0 && (
                    <span className="flex items-center gap-1 rounded bg-zinc-900/80 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-zinc-800">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {voteAverage.toFixed(1)} TMDB
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-zinc-100">
                  {title} {year ? `(${year})` : ''}
                </h1>
                
                {tagline && (
                  <p className="text-sm italic text-zinc-400 md:text-base">
                    &ldquo;{tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Specs & Metadata */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-zinc-400">
                {releaseDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(releaseDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                )}
                {mediaType === 'movie' && runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {Math.floor(runtime / 60)}h {runtime % 60}m
                  </span>
                )}
                {mediaType === 'tv' && seasons && (
                  <span className="flex items-center gap-1">
                    <Tv className="h-3.5 w-3.5" />
                    {seasons} Season{seasons !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Genre Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {genres.map((g: any) => (
                  <span
                    key={g.id}
                    className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-medium text-zinc-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Watchlist & Custom Collections Actions */}
              <div className="pt-2">
                <MediaActions
                  currentUser={currentUser}
                  mediaId={mediaId}
                  mediaType={mediaType}
                  mediaTitle={title}
                  mediaPosterPath={posterPath}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Page Layout */}
      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Left Column: Synopsis, Trailer, Cast, Where to Watch */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Synopsis */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <Film className="h-5 w-5 text-emerald-400" />
                Synopsis
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {overview || 'No overview available for this title.'}
              </p>
            </div>

            {/* Where to Watch Streaming Availability */}
            <div className="space-y-3 border-t border-zinc-900 pt-6">
              <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                <Video className="h-5 w-5 text-emerald-400" />
                Where to Watch
              </h2>
              
              {streamProviders.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {streamProviders.map((provider: any) => (
                    <div
                      key={provider.provider_id}
                      className="flex items-center gap-2 rounded-xl bg-zinc-900/40 p-2 pr-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
                      title={provider.provider_name}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="h-8 w-8 rounded-lg"
                      />
                      <span className="text-xs font-bold text-zinc-300">{provider.provider_name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-center">
                  <p className="text-xs text-zinc-500 font-medium">
                    No streaming platforms detected in your region. Check JustWatch website for rent/buy options.
                  </p>
                </div>
              )}
            </div>

            {/* Cast & Crew Slider */}
            {castList.length > 0 && (
              <div className="space-y-3 border-t border-zinc-900 pt-6">
                <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-400" />
                  Key Cast
                </h2>
                
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {castList.map((actor: any) => {
                    const pic = actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : null
                    return (
                      <div key={actor.id} className="w-[110px] flex-shrink-0 flex flex-col items-center text-center">
                        <div className="h-20 w-20 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800 mb-2">
                          {pic ? (
                            <img src={pic} alt={actor.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs font-semibold text-zinc-600">
                              No Pic
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-bold text-zinc-200 line-clamp-1">{actor.name}</p>
                        <p className="text-[10px] text-zinc-500 line-clamp-1">{actor.character}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Embedded Trailer Section */}
            {trailerKey && (
              <div className="space-y-3 border-t border-zinc-900 pt-6">
                <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Video className="h-5 w-5 text-emerald-400" />
                  Watch Trailer
                </h2>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title={`${title} Official Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Moctale Meter stats, rating selector, and community reviews */}
          <div className="lg:col-span-1 space-y-8 border-t border-zinc-900 pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:border-zinc-900 lg:pl-8">
            <ReviewSection
              currentUser={currentUser}
              mediaId={mediaId}
              mediaType={mediaType}
              mediaTitle={title}
              mediaPosterPath={posterPath}
              initialReviews={initialReviews}
              initialStats={initialStats}
            />
          </div>

        </div>
      </div>

    </div>
  )
}
