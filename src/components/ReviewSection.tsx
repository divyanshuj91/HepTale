'use client'

import { useState, useTransition } from 'react'
import { submitReview } from '@/app/actions/db-actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { AlertTriangle, CheckCircle, EyeOff, ShieldAlert, Sparkles, XCircle } from 'lucide-react'
import { toast } from 'sonner'

type RatingTier = 'skip' | 'timepass' | 'go_for_it' | 'perfection'

interface ReviewSectionProps {
  currentUser: any
  mediaId: number
  mediaType: 'movie' | 'tv'
  mediaTitle: string
  mediaPosterPath: string | null
  initialReviews: any[]
  initialStats: {
    total: number
    percentages: {
      skip: number
      timepass: number
      go_for_it: number
      perfection: number
    }
  }
}

export default function ReviewSection({
  currentUser,
  mediaId,
  mediaType,
  mediaTitle,
  mediaPosterPath,
  initialReviews,
  initialStats,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [stats, setStats] = useState(initialStats)
  const [selectedRating, setSelectedRating] = useState<RatingTier | null>(null)
  const [content, setContent] = useState('')
  const [containsSpoilers, setContainsSpoilers] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Track which reviews have been clicked to reveal spoilers
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({})

  const toggleRevealSpoiler = (reviewId: string) => {
    setRevealedSpoilers((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      toast.error('You must be logged in to review!')
      return
    }
    if (!selectedRating) {
      toast.error('Please select a rating tier on the Moctale Meter!')
      return
    }
    if (!content.trim()) {
      toast.error('Please write some comments for your review!')
      return
    }

    const formData = new FormData()
    formData.append('mediaId', mediaId.toString())
    formData.append('mediaType', mediaType)
    formData.append('mediaTitle', mediaTitle)
    formData.append('mediaPosterPath', mediaPosterPath || '')
    formData.append('rating', selectedRating)
    formData.append('content', content)
    formData.append('containsSpoilers', containsSpoilers.toString())

    startTransition(async () => {
      const result = await submitReview(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.success || 'Review submitted!')
        
        // Optimistically add/update review in local state
        const existingIndex = reviews.findIndex(r => r.user_id === currentUser.id)
        const newReviewObj = {
          id: 'temp-' + Date.now(),
          user_id: currentUser.id,
          media_id: mediaId,
          media_type: mediaType,
          media_title: mediaTitle,
          rating: selectedRating,
          content: content,
          contains_spoilers: containsSpoilers,
          created_at: new Date().toISOString(),
          profiles: {
            username: currentUser.profile?.username || 'you',
            display_name: currentUser.profile?.display_name || 'You',
          }
        }

        let updatedReviews = [...reviews]
        if (existingIndex >= 0) {
          updatedReviews[existingIndex] = newReviewObj
        } else {
          updatedReviews.unshift(newReviewObj)
        }
        setReviews(updatedReviews)

        // Recalculate stats locally
        const total = updatedReviews.length
        const counts = { skip: 0, timepass: 0, go_for_it: 0, perfection: 0 }
        updatedReviews.forEach(r => {
          counts[r.rating as RatingTier]++
        })
        setStats({
          total,
          percentages: {
            skip: total ? Math.round((counts.skip / total) * 100) : 0,
            timepass: total ? Math.round((counts.timepass / total) * 100) : 0,
            go_for_it: total ? Math.round((counts.go_for_it / total) * 100) : 0,
            perfection: total ? Math.round((counts.perfection / total) * 100) : 0,
          }
        })

        // Clear form
        setContent('')
        setSelectedRating(null)
        setContainsSpoilers(false)
      }
    })
  }

  return (
    <div className="space-y-12">
      {/* 1. Aggregated Community Moctale Meter */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6">
        <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          Community Moctale Meter
        </h3>
        
        <div className="space-y-4">
          {/* Segmented Progress Bar */}
          <div className="flex h-6 overflow-hidden rounded-full bg-zinc-800">
            {stats.percentages.perfection > 0 && (
              <div
                style={{ width: `${stats.percentages.perfection}%` }}
                className="bg-emerald-600 transition-all"
                title={`Perfection: ${stats.percentages.perfection}%`}
              />
            )}
            {stats.percentages.go_for_it > 0 && (
              <div
                style={{ width: `${stats.percentages.go_for_it}%` }}
                className="bg-emerald-400 transition-all"
                title={`Go For It: ${stats.percentages.go_for_it}%`}
              />
            )}
            {stats.percentages.timepass > 0 && (
              <div
                style={{ width: `${stats.percentages.timepass}%` }}
                className="bg-yellow-400 transition-all"
                title={`Timepass: ${stats.percentages.timepass}%`}
              />
            )}
            {stats.percentages.skip > 0 && (
              <div
                style={{ width: `${stats.percentages.skip}%` }}
                className="bg-rose-500 transition-all"
                title={`Skip: ${stats.percentages.skip}%`}
              />
            )}
            {stats.total === 0 && (
              <div className="w-full flex items-center justify-center text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                No ratings submitted yet
              </div>
            )}
          </div>

          {/* Grid Indicators */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-3 border border-zinc-800">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" /> Skip
              </span>
              <span className="text-sm font-bold text-zinc-200">{stats.percentages.skip}%</span>
            </div>
            
            <div className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-3 border border-zinc-800">
              <span className="text-xs font-semibold text-yellow-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Timepass
              </span>
              <span className="text-sm font-bold text-zinc-200">{stats.percentages.timepass}%</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-3 border border-zinc-800">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Go For It
              </span>
              <span className="text-sm font-bold text-zinc-200">{stats.percentages.go_for_it}%</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-zinc-900/50 p-3 border border-zinc-800">
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Perfection
              </span>
              <span className="text-sm font-bold text-zinc-200">{stats.percentages.perfection}%</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 text-center font-medium">
            Based on {stats.total} total review{stats.total !== 1 ? 's' : ''} from the community.
          </p>
        </div>
      </div>

      {/* 2. Review Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-zinc-100">Leave Your Rating & Review</h3>
            <p className="text-xs text-zinc-500">Rate this title on our custom Moctale Meter and write a review.</p>
          </div>

          {/* Moctale Meter Interactive Selector */}
          <div className="space-y-3">
            <Label className="text-zinc-300 font-semibold text-sm">Select Moctale Rating</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => setSelectedRating('skip')}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-all cursor-pointer ${
                  selectedRating === 'skip'
                    ? 'border-rose-500 bg-rose-500/25 text-rose-450 scale-[1.02] shadow-[0_0_20px_oklch(0.6_0.22_25/25%)]'
                    : 'border-zinc-800 bg-zinc-950 hover:border-rose-500/40 hover:bg-rose-500/5 text-zinc-400'
                }`}
              >
                <XCircle className="h-6 w-6 text-rose-500 animate-pulse" />
                <span className="text-sm font-bold">Skip</span>
                <span className="text-[10px] text-zinc-500">Not worth it</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRating('timepass')}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-all cursor-pointer ${
                  selectedRating === 'timepass'
                    ? 'border-yellow-505 bg-yellow-500/20 text-yellow-300 scale-[1.02] shadow-[0_0_20px_oklch(0.8_0.15_80/20%)]'
                    : 'border-zinc-800 bg-zinc-950 hover:border-yellow-500/40 hover:bg-yellow-500/5 text-zinc-400'
                }`}
              >
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                <span className="text-sm font-bold">Timepass</span>
                <span className="text-[10px] text-zinc-500">Casual watch</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRating('go_for_it')}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-all cursor-pointer ${
                  selectedRating === 'go_for_it'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 scale-[1.02] shadow-[0_0_20px_oklch(0.85_0.16_150/20%)]'
                    : 'border-zinc-800 bg-zinc-950 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-zinc-400'
                }`}
              >
                <CheckCircle className="h-6 w-6 text-emerald-400" />
                <span className="text-sm font-bold">Go For It</span>
                <span className="text-[10px] text-zinc-500">Highly recommend</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRating('perfection')}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-all cursor-pointer ${
                  selectedRating === 'perfection'
                    ? 'border-green-500 bg-green-500/35 text-green-350 scale-[1.02] shadow-[0_0_20px_oklch(0.7_0.18_150/30%)]'
                    : 'border-zinc-800 bg-zinc-950 hover:border-green-500/40 hover:bg-green-500/5 text-zinc-400'
                }`}
              >
                <Sparkles className="h-6 w-6 text-green-400" />
                <span className="text-sm font-bold">Perfection</span>
                <span className="text-[10px] text-zinc-500">Masterpiece</span>
              </button>
            </div>
          </div>

          {/* Text Review */}
          <div className="space-y-2">
            <Label htmlFor="review-content" className="text-zinc-300 font-semibold text-sm">Review Comments</Label>
            <Textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you think? Detail your thoughts on characters, plot, and cinematography..."
              rows={4}
              required
              className="border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
            />
          </div>

          {/* Spoiler Control */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="spoilers"
              checked={containsSpoilers}
              onCheckedChange={(checked) => setContainsSpoilers(!!checked)}
              className="border-zinc-700 bg-zinc-950 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-zinc-950"
            />
            <Label htmlFor="spoilers" className="text-zinc-300 text-sm font-medium flex items-center gap-1 cursor-pointer">
              <EyeOff className="h-4 w-4 text-rose-400" />
              Contains Spoilers (This blurs your text until clicked)
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-emerald-500 font-bold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {isPending ? 'Submitting...' : 'Post Review'}
          </Button>
        </form>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6 text-center space-y-3">
          <ShieldAlert className="h-10 w-10 text-yellow-400 mx-auto" />
          <h4 className="text-zinc-200 font-bold">Want to leave a review?</h4>
          <p className="text-zinc-500 text-xs max-w-xs mx-auto">
            You must be logged in to vote on the Moctale Meter and share reviews with friends.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <a
              href="/login"
              className={buttonVariants({ variant: 'outline', size: 'sm', className: 'border-zinc-800 hover:bg-zinc-900' })}
            >
              Log In
            </a>
            <a
              href="/signup"
              className={buttonVariants({ variant: 'default', size: 'sm', className: 'bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400' })}
            >
              Sign Up
            </a>
          </div>
        </div>
      )}

      {/* 3. Community Reviews Feed */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-900 pb-3">
          Reviews Feed
        </h3>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => {
              const hasSpoilers = rev.contains_spoilers
              const isRevealed = revealedSpoilers[rev.id] || false
              
              // Helper style classes for rating categories
              let badgeColor = 'text-zinc-400 bg-zinc-900 border-zinc-800'
              if (rev.rating === 'perfection') badgeColor = 'text-green-400 bg-green-500/10 border-green-500/25'
              else if (rev.rating === 'go_for_it') badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
              else if (rev.rating === 'timepass') badgeColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25'
              else if (rev.rating === 'skip') badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/25'

              return (
                <div key={rev.id} className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5 space-y-3">
                  {/* User Profile Info & Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-400">
                        {rev.profiles?.display_name?.[0] || rev.profiles?.username?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-200">
                          {rev.profiles?.display_name || rev.profiles?.username || 'Anonymous User'}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {new Date(rev.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </p>
                      </div>
                    </div>

                    <div className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${badgeColor}`}>
                      {rev.rating.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Review Text Area */}
                  {hasSpoilers && !isRevealed ? (
                    <div
                      onClick={() => toggleRevealSpoiler(rev.id)}
                      className="group relative rounded-xl border border-rose-500/15 bg-rose-500/5 p-4 cursor-pointer overflow-hidden transition-all hover:bg-rose-500/10"
                    >
                      {/* Blurred mock content preview */}
                      <p className="text-zinc-600/30 blur-sm select-none pointer-events-none text-sm leading-relaxed">
                        This review contains heavy spoilers about the plot twists, ending, and character developments. Tap anywhere on this card to reveal the complete review details.
                      </p>
                      {/* Spoiler Overlay Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                        <EyeOff className="h-5 w-5 text-rose-400" />
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                          Review Contains Spoilers
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Click to reveal text
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {rev.content}
                      </p>
                      {hasSpoilers && isRevealed && (
                        <button
                          onClick={() => toggleRevealSpoiler(rev.id)}
                          className="mt-2 text-[10px] font-semibold text-rose-400 hover:underline flex items-center gap-1"
                        >
                          <EyeOff className="h-3 w-3" /> Hide Spoilers
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-zinc-900 rounded-2xl">
            <p className="text-zinc-600 text-sm">No reviews posted yet. Be the first to share your review!</p>
          </div>
        )}
      </div>
    </div>
  )
}
