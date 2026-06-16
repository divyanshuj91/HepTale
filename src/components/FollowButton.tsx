'use client'

import { useState, useTransition, useEffect } from 'react'
import { toggleFollow, getFollowStatus } from '@/app/actions/db-actions'
import { Button } from '@/components/ui/button'
import { UserPlus, UserMinus } from 'lucide-react'
import { toast } from 'sonner'

interface FollowButtonProps {
  currentUser: any
  profileId: string
  profileUsername: string
}

export default function FollowButton({
  currentUser,
  profileId,
  profileUsername,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (currentUser && currentUser.id !== profileId) {
      getFollowStatus(profileId).then(setIsFollowing)
    }
  }, [currentUser, profileId])

  if (!currentUser || currentUser.id === profileId) {
    return null
  }

  const handleFollowToggle = () => {
    startTransition(async () => {
      const res = await toggleFollow(profileId)
      if (res.error) {
        toast.error(res.error)
      } else {
        setIsFollowing(res.active || false)
        toast.success(res.active ? `Following ${profileUsername}!` : `Unfollowed ${profileUsername}`)
      }
    })
  }

  return (
    <Button
      onClick={handleFollowToggle}
      variant={isFollowing ? 'outline' : 'default'}
      className={`font-semibold border-zinc-800 ${
        isFollowing
          ? 'bg-zinc-950 text-zinc-100 hover:bg-zinc-900'
          : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
      }`}
      disabled={isPending}
    >
      {isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  )
}
