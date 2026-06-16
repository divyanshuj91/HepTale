import { getThreadDetails, getThreadComments } from '@/app/actions/db-actions'
import { getCurrentUser } from '@/app/auth-actions'
import CommentSection from '@/components/CommentSection'
import Link from 'next/link'
import { Calendar, ChevronLeft, MessageSquare } from 'lucide-react'

interface ThreadPageProps {
  params: Promise<{
    id: string
  }>
}

export const revalidate = 0 // Dynamic content

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id } = await params

  const [currentUser, thread, comments] = await Promise.all([
    getCurrentUser(),
    getThreadDetails(id),
    getThreadComments(id),
  ])

  if (!thread) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-zinc-300">Thread not found</h1>
        <Link href="/forums" className="text-emerald-400 hover:underline flex items-center justify-center gap-1 text-sm font-semibold">
          <ChevronLeft className="h-4 w-4" /> Back to forums
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
      {/* Back button */}
      <div>
        <Link href="/forums" className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-400">
          <ChevronLeft className="h-4 w-4" />
          Back to forums
        </Link>
      </div>

      {/* 1. Main Thread Card */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 space-y-4 shadow-xl">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
              {thread.hub.replace('-', ' ')}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100 sm:text-3xl">
            {thread.title}
          </h1>

          {/* Author Meta */}
          <div className="flex items-center gap-3 border-y border-zinc-900/60 py-3 text-xs font-medium text-zinc-500">
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold uppercase text-zinc-300">
                {thread.profiles?.username?.[0] || 'U'}
              </div>
              <span className="text-zinc-300">@{thread.profiles?.username || 'user'}</span>
            </div>
            
            <span className="text-zinc-700">|</span>

            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Posted on {new Date(thread.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </span>
          </div>
        </div>

        {/* Content body */}
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {thread.content}
        </p>
      </div>

      {/* 2. Replies / Comment Section */}
      <CommentSection
        threadId={id}
        currentUser={currentUser}
        initialComments={comments}
      />

    </div>
  )
}
