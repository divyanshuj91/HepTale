'use client'

import { useState, useTransition } from 'react'
import { createDiscussionThread } from '@/app/actions/db-actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FolderPlus, PenTool, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ThreadCreatorProps {
  currentUser: any
  defaultHub?: string
}

const HUBS = [
  { id: 'general', name: 'General Chat' },
  { id: 'marvel', name: 'Marvel Cinematic Universe' },
  { id: 'anime-season', name: 'Anime Season Fall 2026' },
  { id: 'classic', name: 'Classic Cinema' },
]

export default function ThreadCreator({ currentUser, defaultHub }: ThreadCreatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHub, setSelectedHub] = useState(defaultHub || 'general')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !selectedHub) {
      toast.error('Please fill in all fields')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('hub', selectedHub)

    startTransition(async () => {
      const res = await createDiscussionThread(formData)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(res.success || 'Thread created!')
        setIsOpen(false)
        setTitle('')
        setContent('')
        if (res.threadId) {
          router.push(`/forums/threads/${res.threadId}`)
        }
      }
    })
  }

  if (!currentUser) {
    return (
      <Dialog>
        <DialogTrigger className={buttonVariants({ variant: 'default', className: 'bg-emerald-500 font-bold text-zinc-950 hover:bg-emerald-400 cursor-pointer' })}>
          <PenTool className="mr-2 h-4 w-4" />
          New Thread
        </DialogTrigger>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 max-w-sm">
          <div className="text-center py-4 space-y-3">
            <ShieldAlert className="h-10 w-10 text-yellow-400 mx-auto" />
            <h4 className="text-zinc-200 font-bold">Sign In Required</h4>
            <p className="text-zinc-500 text-xs">
              You must be logged in to create discussion threads in OMDb hubs.
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
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'default', className: 'bg-emerald-500 font-bold text-zinc-950 hover:bg-emerald-400 cursor-pointer' })}>
        <PenTool className="mr-2 h-4 w-4" />
        New Thread
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 max-w-sm sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-zinc-100 flex items-center gap-1.5 font-bold">
              <FolderPlus className="h-5 w-5 text-emerald-400" />
              Create Thread
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs">
              Post a topic in one of our fandom communities.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-zinc-300 text-xs">Fandom Hub</Label>
              <Select value={selectedHub} onValueChange={(val) => setSelectedHub(val || 'general')}>
                <SelectTrigger className="border-zinc-800 bg-zinc-900/50 text-zinc-100 focus:ring-emerald-500">
                  <SelectValue placeholder="Select a hub" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                  {HUBS.map(hub => (
                    <SelectItem key={hub.id} value={hub.id} className="cursor-pointer hover:bg-zinc-900 focus:bg-zinc-900 focus:text-zinc-100">
                      {hub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="thread-title" className="text-zinc-300 text-xs">Topic Title</Label>
              <Input
                id="thread-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is on your mind?"
                required
                className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="thread-content" className="text-zinc-300 text-xs">Details / Body</Label>
              <Textarea
                id="thread-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide context, links, or opinions..."
                rows={5}
                required
                className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 w-full">
              {isPending ? 'Posting...' : 'Create Thread'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
