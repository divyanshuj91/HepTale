import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-8 text-zinc-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="bg-gradient-to-r from-emerald-400 via-yellow-300 to-rose-500 bg-clip-text text-lg font-black tracking-wider text-transparent">
              HepTale
            </span>
            <p className="text-xs text-zinc-600">
              The Mood-Based Movies, TV Shows & Anime Discovery & Reviewing Hub
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/discover/movie" className="hover:text-zinc-300">Movies</Link>
            <Link href="/discover/tv" className="hover:text-zinc-300">TV Shows</Link>
            <Link href="/discover/anime" className="hover:text-zinc-300">Anime</Link>
            <Link href="/forums" className="hover:text-zinc-300">Forums</Link>
          </div>

          <div className="text-xs text-zinc-600">
            © {new Date().getFullYear()} HepTale. Powered by TMDB & JustWatch.
          </div>
        </div>
      </div>
    </footer>
  )
}
