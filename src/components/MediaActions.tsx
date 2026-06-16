'use client'

import { useState, useTransition, useEffect } from 'react'
import { toggleWatchlist, getWatchlistStatus, getUserCollections, createCollection, addMediaToCollection } from '@/app/actions/db-actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bookmark, BookmarkCheck, ListPlus, FolderPlus, Plus, Check } from 'lucide-react'
import { toast } from 'sonner'

interface MediaActionsProps {
  currentUser: any
  mediaId: number
  mediaType: 'movie' | 'tv'
  mediaTitle: string
  mediaPosterPath: string | null
}

export default function MediaActions({
  currentUser,
  mediaId,
  mediaType,
  mediaTitle,
  mediaPosterPath,
}: MediaActionsProps) {
  const [inWatchlist, setInWatchlist] = useState(false)
  const [collections, setCollections] = useState<any[]>([])
  const [newListName, setNewListName] = useState('')
  const [newListDesc, setNewListDesc] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // 1. Load watchlist status and collections on mount
  useEffect(() => {
    if (currentUser) {
      getWatchlistStatus(mediaId, mediaType).then(setInWatchlist)
      getUserCollections(currentUser.id).then(setCollections)
    }
  }, [currentUser, mediaId, mediaType])

  // 2. Handle Watchlist Toggle
  const handleWatchlistToggle = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to modify your watchlist!')
      return
    }

    startTransition(async () => {
      const res = await toggleWatchlist(mediaId, mediaType, mediaTitle, mediaPosterPath || '')
      if (res.error) {
        toast.error(res.error)
      } else {
        setInWatchlist(res.active || false)
        toast.success(res.success)
      }
    })
  }

  // 3. Handle Create Collection
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) {
      toast.error('Please enter a list name')
      return
    }

    const formData = new FormData()
    formData.append('name', newListName)
    formData.append('description', newListDesc)
    formData.append('isPrivate', 'false')

    const res = await createCollection(formData)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(res.success || 'Collection created!')
      
      // Update collections locally
      const created = res.collection
      setCollections((prev) => [created, ...prev])
      setIsDialogOpen(false)
      setNewListName('')
      setNewListDesc('')

      // Automatically add this movie to the newly created collection
      if (created?.id) {
        handleAddToCollection(created.id, created.name)
      }
    }
  }

  // 4. Handle Add to Collection
  const handleAddToCollection = async (collectionId: string, collectionName: string) => {
    const res = await addMediaToCollection(collectionId, mediaId, mediaType, mediaTitle, mediaPosterPath || '')
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(`Added to "${collectionName}"!`)
      // Refresh user collections list
      if (currentUser) {
        getUserCollections(currentUser.id).then(setCollections)
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Watchlist Toggle Button */}
      <Button
        onClick={handleWatchlistToggle}
        variant={inWatchlist ? 'default' : 'outline'}
        className={`font-semibold border-zinc-800 ${
          inWatchlist
            ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
            : 'bg-zinc-950 text-zinc-100 hover:bg-zinc-900'
        }`}
        disabled={isPending}
      >
        {inWatchlist ? (
          <>
            <BookmarkCheck className="mr-2 h-4 w-4 fill-zinc-950" />
            In Watchlist
          </>
        ) : (
          <>
            <Bookmark className="mr-2 h-4 w-4" />
            Add to Watchlist
          </>
        )}
      </Button>

      {/* Add to Custom Collection Dropdown */}
      {currentUser && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: 'outline', className: 'border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-900 font-semibold cursor-pointer' })}>
              <ListPlus className="mr-2 h-4 w-4" />
              Add to List
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-zinc-800 bg-zinc-950 text-zinc-100">
              <DropdownMenuLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                Your Lists
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-900" />
              
              {collections.length > 0 ? (
                <div className="max-h-48 overflow-y-auto">
                  {collections.map((col) => {
                    const alreadyContains = col.collection_items?.some(
                      (item: any) => item.media_id === mediaId && item.media_type === mediaType
                    ) || col.items?.some(
                      (item: any) => item.media_id === mediaId && item.media_type === mediaType
                    )

                    return (
                      <DropdownMenuItem
                        key={col.id}
                        onClick={() => handleAddToCollection(col.id, col.name)}
                        disabled={alreadyContains}
                        className="flex items-center justify-between cursor-pointer hover:bg-zinc-900 text-zinc-200"
                      >
                        <span className="truncate max-w-[150px]">{col.name}</span>
                        {alreadyContains && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                      </DropdownMenuItem>
                    )
                  })}
                </div>
              ) : (
                <div className="px-2 py-3 text-center text-xs text-zinc-600 font-medium">
                  No lists created yet.
                </div>
              )}

              <DropdownMenuSeparator className="bg-zinc-900" />
              
              <DialogTrigger className="flex w-full items-center gap-2 cursor-pointer rounded-md px-1.5 py-1 text-sm outline-none font-semibold text-emerald-400 hover:bg-zinc-900 focus:bg-emerald-500/10 focus:text-emerald-300">
                <FolderPlus className="h-4 w-4" />
                Create New List
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog popup to create a new list */}
          <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 max-w-sm sm:max-w-md">
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-zinc-100 flex items-center gap-1.5 font-bold">
                  <FolderPlus className="h-5 w-5 text-emerald-400" />
                  Create Custom Collection
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs">
                  Create a custom shareable list and add this title to it.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label htmlFor="list-name" className="text-zinc-300 text-xs">Collection Name</Label>
                  <Input
                    id="list-name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="e.g., Best Mind-Bending Sci-Fi"
                    required
                    className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="list-desc" className="text-zinc-300 text-xs">Description (Optional)</Label>
                  <Input
                    id="list-desc"
                    value={newListDesc}
                    onChange={(e) => setNewListDesc(e.target.value)}
                    placeholder="e.g., Movies that leave you thinking for days..."
                    className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 w-full sm:w-auto">
                  Create & Add
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
