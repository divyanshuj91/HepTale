'use client'

import { useState, useTransition } from 'react'
import { createThreadComment } from '@/app/actions/db-actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ShieldAlert, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface CommentSectionProps {
  threadId: string
  currentUser: any
  initialComments: any[]
}

export default function CommentSection({
  threadId,
  currentUser,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      toast.error('You must be logged in to post comments!')
      return
    }
    if (!content.trim()) {
      toast.error('Please write some comments first!')
      return
    }

    startTransition(async () => {
      const res = await createThreadComment(threadId, content)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('Comment posted successfully!')
        
        // Optimistically add comment to local state
        const newCommentObj = {
          id: 'temp-c-' + Date.now(),
          thread_id: threadId,
          user_id: currentUser.id,
          content: content,
          created_at: new Date().toISOString(),
          profiles: {
            username: currentUser.profile?.username || 'you',
            display_name: currentUser.profile?.display_name || 'You',
          }
        }
        setComments((prev) => [...prev, newCommentObj])
        setContent('')
      }
    })
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* List of comments */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-zinc-300 border-b border-zinc-900 pb-2 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Comments ({comments.length})
        </h3>

        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comm) => (
              <div key={comm.id} className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                      {comm.profiles?.display_name?.[0] || comm.profiles?.username?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-200">
                        {comm.profiles?.display_name || comm.profiles?.username}
                      </p>
                      <p className="text-[8px] text-zinc-500">
                        {new Date(comm.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {comm.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-zinc-900 rounded-xl">
            <p className="text-zinc-600 text-xs font-medium">No replies posted. Join the conversation!</p>
          </div>
        )}
      </div>

      {/* Reply Submission form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-zinc-900 pt-6">
          <div className="space-y-1">
            <Label htmlFor="reply-box" className="text-zinc-300 text-xs font-semibold">Post a Reply</Label>
            <Textarea
              id="reply-box"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts on this topic? Add your comments..."
              rows={3}
              required
              className="border-zinc-850 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500 text-xs"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 text-xs py-1.5 h-auto disabled:opacity-50"
          >
            {isPending ? 'Posting...' : 'Post Reply'}
          </Button>
        </form>
      ) : (
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-4 text-center space-y-2">
          <ShieldAlert className="h-6 w-6 text-yellow-400 mx-auto" />
          <p className="text-zinc-400 text-xs font-semibold">Want to reply?</p>
          <p className="text-zinc-500 text-[10px]">
            You must be logged in to participate in fandom discussions.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <a
              href="/login"
              className={buttonVariants({ variant: 'outline', size: 'xs', className: 'border-zinc-800 text-[10px] px-2.5 py-1 hover:bg-zinc-900' })}
            >
              Log In
            </a>
            <a
              href="/signup"
              className={buttonVariants({ variant: 'default', size: 'xs', className: 'bg-emerald-500 text-zinc-950 text-[10px] px-2.5 py-1 font-bold hover:bg-emerald-400' })}
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
