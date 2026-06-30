import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t border-primary bg-background py-8 text-muted-foreground transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-container-max">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="font-serif text-lg font-black uppercase tracking-widest text-primary">
              HepTale
            </span>
            <p className="text-xs text-muted-foreground/80">
              The Mood-Based Movies, TV Shows & Anime Discovery & Reviewing Hub
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest">
            <Link href="/discover/movie" className="hover:text-primary transition-colors">Movies</Link>
            <Link href="/discover/tv" className="hover:text-primary transition-colors">TV Shows</Link>
            <Link href="/discover/anime" className="hover:text-primary transition-colors">Anime</Link>
            <Link href="/forums" className="hover:text-primary transition-colors">Forums</Link>
          </div>

          <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
            © {new Date().getFullYear()} HepTale. Powered by TMDB & JustWatch.
          </div>
        </div>
      </div>
    </footer>
  )
}
