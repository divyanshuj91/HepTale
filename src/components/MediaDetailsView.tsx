import { getMediaDetails } from '@/lib/tmdb'
import { getCurrentUser } from '@/app/auth-actions'
import { getMovieReviews, getMovieRatingStats } from '@/app/actions/db-actions'
import ReviewSection from './ReviewSection'
import MediaActions from './MediaActions'
import { Calendar, Clock, Film, Star, Tv, Video, Heart } from 'lucide-react'

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
  const omdbRatings = tmdbData.omdbRatings || {}

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
    <div className="pb-16 flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* 1. Backdrop Hero Section */}
      <div className="relative min-h-[45vh] md:min-h-[55vh] flex items-end overflow-hidden pt-24 pb-8 border-b border-primary">
        {backdropUrl ? (
          <div className="absolute inset-0 -z-10">
            <img
              src={backdropUrl}
              alt={title}
              className="h-full w-full object-cover object-center opacity-25"
            />
            <div className="absolute inset-0 marquee-gradient" />
          </div>
        ) : (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-primary/5 to-background" />
        )}

        <div className="container mx-auto px-4 max-w-container-max">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            {/* Poster Card */}
            {posterUrl ? (
              <div className="w-[150px] md:w-[220px] flex-shrink-0 border border-primary p-1 bg-background shadow-[4px_4px_0px_0px_var(--shadow-color)]">
                <img src={posterUrl} alt={title} className="w-full aspect-[2/3] object-cover" />
              </div>
            ) : (
              <div className="w-[150px] md:w-[220px] aspect-[2/3] flex-shrink-0 border border-primary bg-muted/20 flex items-center justify-center p-4 text-center text-sm font-serif italic text-muted-foreground shadow-[4px_4px_0px_0px_var(--shadow-color)]">
                No Poster Available
              </div>
            )}

            {/* Info details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border border-primary bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                    {mediaType === 'movie' ? 'Film' : 'TV Broadcast'}
                  </span>
                  {voteAverage > 0 && (
                    <span className="flex items-center gap-1 border border-primary bg-background px-2 py-0.5 text-[10px] font-bold text-primary shadow-[2px_2px_0px_0px_var(--shadow-color)]" title="TMDB Vote Average">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {voteAverage.toFixed(1)} TMDB
                    </span>
                  )}
                  {omdbRatings.imdb && (
                    <span className="flex items-center border border-primary bg-[#f5c518] text-zinc-950 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--shadow-color)]" title="IMDb Rating">
                      IMDb {omdbRatings.imdb}
                    </span>
                  )}
                  {omdbRatings.rottenTomatoes && (
                    <span className="flex items-center border border-primary bg-[#e53935] text-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--shadow-color)]" title="Rotten Tomatoes Score">
                      🍅 {omdbRatings.rottenTomatoes}
                    </span>
                  )}
                  {omdbRatings.metacritic && (
                    <span className="flex items-center border border-primary bg-[#00fc87] text-zinc-950 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--shadow-color)]" title="Metacritic Score">
                      MC {omdbRatings.metacritic}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-serif italic font-bold tracking-tight sm:text-4xl md:text-5xl text-white drop-shadow-md">
                  {title} {year ? `(${year})` : ''}
                </h1>
                
                {tagline && (
                  <p className="text-sm font-serif italic text-muted-foreground/90 md:text-base drop-shadow-sm">
                    &ldquo;{tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Specs & Metadata */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
              <div className="flex flex-wrap gap-2 pt-1">
                {genres.map((g: any) => (
                  <span
                    key={g.id}
                    className="border border-primary bg-card/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary shadow-[1px_1px_0px_0px_var(--shadow-color)]"
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
      <div className="container mx-auto px-4 mt-12 max-w-container-max">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Left Column: Synopsis, Trailer, Cast, Where to Watch */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Synopsis */}
            <div className="space-y-3">
              <h2 className="text-xl font-serif italic font-bold text-primary flex items-center gap-2 border-b border-primary pb-2">
                <Film className="h-4.5 w-4.5 text-primary" />
                Synopsis
              </h2>
              <p className="text-sm font-serif text-foreground leading-relaxed whitespace-pre-line">
                {overview || 'No overview available for this title.'}
              </p>
            </div>

            {/* Where to Watch Streaming Availability */}
            <div className="space-y-3 border-t border-primary pt-6">
              <h2 className="text-xl font-serif italic font-bold text-primary flex items-center gap-2 border-b border-primary pb-2">
                <Video className="h-4.5 w-4.5 text-primary" />
                Where to Watch
              </h2>
              
              {streamProviders.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {streamProviders.map((provider: any) => (
                    <div
                      key={provider.provider_id}
                      className="flex items-center gap-2 border border-primary bg-card p-2 pr-4 shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:border-ring transition-colors"
                      title={provider.provider_name}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="h-8 w-8"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">{provider.provider_name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-primary bg-muted/10 p-4 text-center">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    No streaming platforms detected in your region. Check JustWatch website for rent/buy options.
                  </p>
                </div>
              )}
            </div>

            {/* Cast & Crew Slider */}
            {castList.length > 0 && (
              <div className="space-y-3 border-t border-primary pt-6">
                <h2 className="text-xl font-serif italic font-bold text-primary flex items-center gap-2 border-b border-primary pb-2">
                  <Heart className="h-4.5 w-4.5 text-primary" />
                  Key Cast
                </h2>
                
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {castList.map((actor: any) => {
                    const pic = actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : null
                    return (
                      <div key={actor.id} className="w-[110px] flex-shrink-0 flex flex-col items-center text-center">
                        <div className="h-20 w-20 bg-background border border-primary overflow-hidden mb-2 shadow-[2px_2px_0px_0px_var(--shadow-color)] transition-transform duration-200 hover:scale-105">
                          {pic ? (
                            <img src={pic} alt={actor.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              No Pic
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-bold text-foreground line-clamp-1">{actor.name}</p>
                        <p className="text-[10px] text-muted-foreground italic line-clamp-1">{actor.character}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Embedded Trailer Section */}
            {trailerKey && (
              <div className="space-y-3 border-t border-primary pt-6">
                <h2 className="text-xl font-serif italic font-bold text-primary flex items-center gap-2 border-b border-primary pb-2">
                  <Video className="h-4.5 w-4.5 text-primary" />
                  Watch Trailer
                </h2>
                <div className="relative aspect-video w-full overflow-hidden border border-primary bg-background shadow-[4px_4px_0px_0px_var(--shadow-color)]">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title={`${title} Official Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-none"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Moctale Meter stats, rating selector, and community reviews */}
          <div className="lg:col-span-1 space-y-8 border-t border-primary pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:border-primary lg:pl-8">
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
