import Link from 'next/link'
import { getCurrentUser, logout } from '@/app/auth-actions'
import { Film, Tv, Flame, Search, LogOut, User, Compass } from 'lucide-react'
import { Button } from './ui/button'
import ThemeToggle from './ThemeToggle'

export default async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary bg-background shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-colors duration-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-container-max">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-black uppercase tracking-widest text-primary transition-opacity hover:opacity-90">
            HepTale
          </span>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:inline-block border-l border-border pl-2">
            Archive
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/discover/movie" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-foreground/80 transition-all hover:text-primary border-b-2 border-transparent hover:border-primary pb-0.5">
            <Film className="h-3.5 w-3.5" />
            Movies
          </Link>
          <Link href="/discover/tv" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-foreground/80 transition-all hover:text-primary border-b-2 border-transparent hover:border-primary pb-0.5">
            <Tv className="h-3.5 w-3.5" />
            TV Shows
          </Link>
          <Link href="/discover/anime" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-foreground/80 transition-all hover:text-primary border-b-2 border-transparent hover:border-primary pb-0.5">
            <Flame className="h-3.5 w-3.5" />
            Anime
          </Link>
          <Link href="/forums" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-foreground/80 transition-all hover:text-primary border-b-2 border-transparent hover:border-primary pb-0.5">
            <Compass className="h-3.5 w-3.5" />
            Forums
          </Link>
        </nav>

        {/* Actions / Search, Theme & Auth */}
        <div className="flex items-center gap-3">
          <Link href="/search">
            <Button variant="ghost" size="icon" className="text-primary hover:text-primary-foreground hover:bg-primary h-8 w-8 rounded-none border border-transparent hover:border-primary transition-all duration-200">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              <Link href={`/profile/${user.id}`}>
                <Button variant="outline" className="h-8 rounded-none border-primary text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground flex items-center gap-1.5 px-3 py-1 shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                  <User className="h-3.5 w-3.5" />
                  <span className="max-w-[80px] truncate">
                    {user.profile?.display_name || user.profile?.username || 'Profile'}
                  </span>
                </Button>
              </Link>
              <form action={logout} className="flex">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-none border border-transparent hover:border-destructive transition-all duration-200">
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="h-8 rounded-none text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary hover:bg-muted px-3 py-1">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="h-8 rounded-none bg-primary text-primary-foreground border border-primary font-bold text-xs uppercase tracking-widest px-3 py-1 shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:opacity-90 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--shadow-color)] transition-all">
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
