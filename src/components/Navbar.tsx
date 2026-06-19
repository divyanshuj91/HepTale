import Link from 'next/link'
import { getCurrentUser, logout } from '@/app/auth-actions'
import { Film, Tv, Flame, Search, LogOut, User, Compass, Bookmark } from 'lucide-react'
import { Button } from './ui/button'

export default async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900/50 bg-zinc-950/40 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-emerald-400 via-yellow-300 to-rose-500 bg-clip-text text-2xl font-black tracking-wider text-transparent transition-opacity hover:opacity-90 text-glow-emerald">
            HepTale
          </span>
          <span className="hidden text-xs font-semibold uppercase tracking-widest text-zinc-500 sm:inline-block">
            Hub
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/discover/movie" className="flex items-center gap-1 text-sm font-semibold text-zinc-400 transition-all hover:text-emerald-400 hover:text-glow-emerald">
            <Film className="h-4 w-4" />
            Movies
          </Link>
          <Link href="/discover/tv" className="flex items-center gap-1 text-sm font-semibold text-zinc-400 transition-all hover:text-emerald-400 hover:text-glow-emerald">
            <Tv className="h-4 w-4" />
            TV Shows
          </Link>
          <Link href="/discover/anime" className="flex items-center gap-1 text-sm font-semibold text-zinc-400 transition-all hover:text-emerald-400 hover:text-glow-emerald">
            <Flame className="h-4 w-4" />
            Anime
          </Link>
          <Link href="/forums" className="flex items-center gap-1 text-sm font-semibold text-zinc-400 transition-all hover:text-emerald-400 hover:text-glow-emerald">
            <Compass className="h-4 w-4" />
            Forums
          </Link>
        </nav>

        {/* Actions / Search & Auth */}
        <div className="flex items-center gap-4">
          <Link href="/search">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href={`/profile/${user.id}`} className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
                <Button variant="ghost" className="flex items-center gap-2 bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/40">
                  <User className="h-4 w-4 text-emerald-400" />
                  <span className="max-w-[120px] truncate">
                    {user.profile?.display_name || user.profile?.username || 'Profile'}
                  </span>
                </Button>
              </Link>
              <form action={logout}>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-rose-400">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-emerald-400 font-bold text-zinc-950 hover:bg-emerald-300 shadow-[0_0_15px_oklch(0.85_0.16_150/20%)]">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
