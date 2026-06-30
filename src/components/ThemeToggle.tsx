"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-8 w-24 border border-border/40 bg-transparent opacity-30" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-1.5 border border-primary px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer active:scale-95 shadow-[2px_2px_0px_0px_var(--shadow-color)]"
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
    >
      {isDark ? (
        <>
          <Sun className="h-3 w-3" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-3 w-3 fill-current" />
          <span>Dark</span>
        </>
      )}
    </button>
  )
}
