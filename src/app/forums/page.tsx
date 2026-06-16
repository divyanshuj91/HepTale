import { getDiscussionThreads } from '@/app/actions/db-actions'
import { getCurrentUser } from '@/app/auth-actions'
import ThreadCreator from '@/components/ThreadCreator'
import Link from 'next/link'
import { MessageSquare, Users, Flame, Landmark, Compass, Calendar, ArrowRight } from 'lucide-react'

// Hub detail maps
const HUBS_DETAILS = [
  {
    id: 'general',
    name: 'General Chat',
    description: 'Talk about anything related to movies, TV, anime, or general pop culture.',
    icon: <Compass className="h-6 w-6 text-cyan-400" />,
    color: 'from-cyan-500/10 to-blue-500/5 hover:border-cyan-500/30'
  },
  {
    id: 'marvel',
    name: 'Marvel Cinematic Universe',
    description: 'MCU theories, reviews, rumors, and cinematic universe updates.',
    icon: <Flame className="h-6 w-6 text-rose-400" />,
    color: 'from-rose-500/10 to-red-500/5 hover:border-rose-500/30'
  },
  {
    id: 'anime-season',
    name: 'Anime Season Fall 2026',
    description: 'Discuss all current anime episodes, manga adaptions, and hot seasonal updates.',
    icon: <Users className="h-6 w-6 text-emerald-400" />,
    color: 'from-emerald-500/10 to-yellow-500/5 hover:border-emerald-500/30'
  },
  {
    id: 'classic',
    name: 'Classic Cinema',
    description: 'A sanctuary for vintage movies, black & white gold, and classic directors.',
    icon: <Landmark className="h-6 w-6 text-yellow-400" />,
    color: 'from-yellow-500/10 to-amber-500/5 hover:border-yellow-500/30'
  }
]

export const revalidate = 0 // Dynamic content

export default async function ForumsPage() {
  const [currentUser, threads] = await Promise.all([
    getCurrentUser(),
    getDiscussionThreads(),
  ])

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      
      {/* 1. Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-emerald-400" />
            Discussion Forums
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Join overarching debates, discuss specific seasonal anime, or chill in general chat.
          </p>
        </div>
        <div>
          <ThreadCreator currentUser={currentUser} />
        </div>
      </div>

      {/* 2. Fandom Hubs Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-300">Fandom Hubs</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HUBS_DETAILS.map((hub) => (
            <div
              key={hub.id}
              className={`flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-gradient-to-tr ${hub.color}`}
            >
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950/60 ring-1 ring-zinc-800">
                  {hub.icon}
                </div>
                <h3 className="text-base font-extrabold text-zinc-100">{hub.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{hub.description}</p>
              </div>
              
              <div className="pt-4 self-end">
                <Link href={`/forums?hub=${hub.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                  Enter Hub
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Threads List */}
      <div className="space-y-4 max-w-4xl">
        <h2 className="text-lg font-bold text-zinc-300">Recent Discussion Topics</h2>
        
        {threads.length > 0 ? (
          <div className="space-y-3">
            {threads.map((thread) => {
              const hubName = HUBS_DETAILS.find((h) => h.id === thread.hub)?.name || thread.hub
              return (
                <div
                  key={thread.id}
                  className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5 transition-all hover:border-zinc-800 hover:bg-zinc-900/10 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start justify-between">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                          {hubName}
                        </span>
                      </div>
                      
                      <Link href={`/forums/threads/${thread.id}`} className="block">
                        <h3 className="text-base font-extrabold text-zinc-100 hover:text-emerald-400 transition-colors">
                          {thread.title}
                        </h3>
                      </Link>
                      
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {thread.content}
                      </p>
                    </div>

                    {/* Thread Info Meta */}
                    <div className="flex sm:flex-col items-start sm:items-end justify-between border-t border-zinc-900/60 pt-3 sm:pt-0 sm:border-t-0 sm:pl-4 text-xs font-medium text-zinc-500 gap-1.5 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold uppercase text-zinc-300">
                          {thread.profiles?.username?.[0] || 'U'}
                        </div>
                        <span className="text-zinc-400">@{thread.profiles?.username || 'user'}</span>
                      </div>
                      
                      <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                        <Calendar className="h-3 w-3" />
                        {new Date(thread.created_at).toLocaleDateString(undefined, { dateStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-900 py-16 text-center">
            <p className="text-zinc-600 text-sm">No discussions started yet. Be the first to start a thread!</p>
          </div>
        )}
      </div>

    </div>
  )
}
