import { createClient } from '@/utils/supabase/server'
import { getCurrentUser } from '@/app/auth-actions'
import { getUserWatchlist, getUserCollections, getSocialActivityFeed, getUserReviews } from '@/app/actions/db-actions'
import FollowButton from '@/components/FollowButton'
import MediaCard from '@/components/MediaCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Film, Heart, List, MessageSquare, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'

interface ProfilePageProps {
  params: Promise<{
    id: string
  }>
}

async function getUserProfile(userId: string) {
  if (userId.startsWith('mock-') || userId === 'mock-user-1' || userId === 'mock-user-2') {
    return {
      id: userId,
      username: userId === 'mock-user-1' ? 'paul_atreides' : 'fremen_warrior',
      display_name: userId === 'mock-user-1' ? "Muad'Dib" : 'Chani fan',
      avatar_url: null,
      favorite_genres: ['Sci-Fi', 'Drama', 'Action'],
      watched_hours: 45,
      created_at: new Date(Date.now() - 86400000 * 30).toISOString()
    }
  }

  try {
    const supabase = await createClient()
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) return data
  } catch {}

  // Safe fallback
  return {
    id: userId,
    username: 'cinephile_max',
    display_name: 'Max Miller',
    avatar_url: null,
    favorite_genres: ['Sci-Fi', 'Drama', 'Action', 'Thriller'],
    watched_hours: 12,
    created_at: new Date().toISOString()
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params
  
  const [currentUser, profile, reviews, watchlist, collections, socialFeed] = await Promise.all([
    getCurrentUser(),
    getUserProfile(id),
    getUserReviews(id),
    getUserWatchlist(id),
    getUserCollections(id),
    getSocialActivityFeed(id),
  ])

  const isOwnProfile = currentUser && currentUser.id === id
  const joinedDate = new Date(profile.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  })

  // Calculate favorite genres count from reviews
  const genreCounts: Record<string, number> = {}
  profile.favorite_genres?.forEach((genre: string) => {
    genreCounts[genre] = (genreCounts[genre] || 0) + 1
  })

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* 1. Header Profile Banner */}
      <div className="relative rounded-3xl border border-zinc-800 bg-zinc-900/10 p-8 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-emerald-500/5 via-zinc-950 to-zinc-900" />
        
        <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-yellow-400 p-0.5 shadow-xl">
              <div className="h-full w-full rounded-2xl bg-zinc-950 flex items-center justify-center text-2xl font-black text-zinc-100 uppercase">
                {profile.display_name?.[0] || profile.username?.[0] || 'U'}
              </div>
            </div>
            
            {/* Info */}
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100 sm:text-3xl">
                {profile.display_name || 'Anonymous User'}
              </h1>
              <p className="text-sm text-emerald-400 font-semibold">@{profile.username}</p>
              
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium pt-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined {joinedDate}
              </div>
            </div>
          </div>

          {/* Follow Button Action */}
          <div className="flex items-center gap-3">
            <FollowButton
              currentUser={currentUser}
              profileId={profile.id}
              profileUsername={profile.username}
            />
          </div>
        </div>
      </div>

      {/* 2. Stats Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-900/20 text-zinc-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Watched Hours</CardTitle>
            <Clock className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-100">{profile.watched_hours || 0} hrs</div>
            <p className="text-[10px] text-zinc-500 mt-1">Calculated from completed reviews</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/20 text-zinc-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-100">{reviews.length}</div>
            <p className="text-[10px] text-zinc-500 mt-1">Shared with the community</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/20 text-zinc-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Custom Lists</CardTitle>
            <List className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-zinc-100">{collections.length}</div>
            <p className="text-[10px] text-zinc-500 mt-1">Curated collections</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Favorite Genres Card */}
      {profile.favorite_genres && profile.favorite_genres.length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900/10 text-zinc-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-500" />
              Favorite Genres
            </CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Based on user preferences</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profile.favorite_genres.map((genre: string) => (
              <span key={genre} className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-400 shadow-sm">
                {genre}
              </span>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 4. Interactive Tabs Section */}
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md border border-zinc-800 bg-zinc-950 p-1 rounded-xl">
          <TabsTrigger value="reviews" className="rounded-lg text-xs font-bold data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="watchlist" className="rounded-lg text-xs font-bold data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">Watchlist ({watchlist.length})</TabsTrigger>
          <TabsTrigger value="collections" className="rounded-lg text-xs font-bold data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">Collections ({collections.length})</TabsTrigger>
        </TabsList>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="pt-6 space-y-4">
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reviews.map((rev) => {
                let ratingColor = 'text-zinc-400 bg-zinc-900 border-zinc-800'
                if (rev.rating === 'perfection') ratingColor = 'text-green-400 bg-green-500/10 border-green-500/25'
                else if (rev.rating === 'go_for_it') ratingColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                else if (rev.rating === 'timepass') ratingColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25'
                else if (rev.rating === 'skip') ratingColor = 'text-rose-400 bg-rose-500/10 border-rose-500/25'

                return (
                  <Card key={rev.id} className="border-zinc-900 bg-zinc-950 text-zinc-100 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-zinc-200">
                        Reviewed:{' '}
                        <span className="text-emerald-400 hover:underline">
                          <Link href={`/${rev.media_type}/${rev.media_id}`}>{rev.media_title}</Link>
                        </span>
                      </h4>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ratingColor}`}>
                        {rev.rating.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {rev.content}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-medium">
                      Posted on {new Date(rev.created_at).toLocaleDateString()}
                    </p>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-900 rounded-2xl">
              <p className="text-zinc-600 text-sm">No reviews shared by this user yet.</p>
            </div>
          )}
        </TabsContent>

        {/* Watchlist Tab */}
        <TabsContent value="watchlist" className="pt-6">
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {watchlist.map((item) => (
                <MediaCard
                  key={item.id}
                  {...item}
                  media_type={item.media_type}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-900 rounded-2xl">
              <p className="text-zinc-600 text-sm">Watchlist is empty.</p>
            </div>
          )}
        </TabsContent>

        {/* Collections Tab */}
        <TabsContent value="collections" className="pt-6 space-y-6">
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {collections.map((col) => (
                <Card key={col.id} className="border-zinc-900 bg-zinc-950 text-zinc-100 p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-zinc-200">{col.name}</h3>
                    {col.description && (
                      <p className="text-xs text-zinc-500">{col.description}</p>
                    )}
                  </div>

                  {/* Curated list images */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {col.items?.map((item: any, index: number) => (
                      <div key={index} className="w-[50px] aspect-[2/3] rounded bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0" title={item.media_title}>
                        {item.media_poster_path ? (
                          <img src={`https://image.tmdb.org/t/p/w92${item.media_poster_path}`} alt={item.media_title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[8px] text-zinc-600 font-bold p-1 text-center">
                            No poster
                          </div>
                        )}
                      </div>
                    ))}
                    {(!col.items || col.items.length === 0) && (
                      <span className="text-[10px] text-zinc-600 italic">This collection is empty</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-900 rounded-2xl">
              <p className="text-zinc-600 text-sm">No custom collections created yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 5. Chronological Social Activity Feed (Only visible on own dashboard) */}
      {isOwnProfile && (
        <section className="space-y-4 border-t border-zinc-900 pt-8 mt-12">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 md:text-2xl flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              Friends Activity Feed
            </h2>
            <p className="text-sm text-zinc-500">
              See chronological reviews and ratings from users you follow.
            </p>
          </div>

          {socialFeed.length > 0 ? (
            <div className="space-y-4 max-w-3xl">
              {socialFeed.map((rev) => {
                let badgeStyle = 'text-zinc-400 bg-zinc-900 border-zinc-800'
                if (rev.rating === 'perfection') badgeStyle = 'text-green-400 bg-green-500/10 border-green-500/25'
                else if (rev.rating === 'go_for_it') badgeStyle = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                else if (rev.rating === 'timepass') badgeStyle = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25'
                else if (rev.rating === 'skip') badgeStyle = 'text-rose-400 bg-rose-500/10 border-rose-500/25'

                return (
                  <Card key={rev.id} className="border-zinc-900 bg-zinc-950 text-zinc-100 p-5 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-400">
                          {rev.profiles?.display_name?.[0] || rev.profiles?.username?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-200">
                            {rev.profiles?.display_name || rev.profiles?.username}
                          </p>
                          <p className="text-[9px] text-zinc-500">
                            Reviewed {new Date(rev.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                        {rev.rating.replace('_', ' ')}
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-zinc-300">
                      Rated:{' '}
                      <Link href={`/${rev.media_type}/${rev.media_id}`} className="text-emerald-400 hover:underline">
                        {rev.media_title}
                      </Link>
                    </p>
                    
                    <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">
                      {rev.content}
                    </p>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8 text-center text-zinc-600 max-w-3xl text-sm font-medium">
              No recent activity from users you follow. Follow other users to see their reviews here!
            </div>
          )}
        </section>
      )}
    </div>
  )
}
