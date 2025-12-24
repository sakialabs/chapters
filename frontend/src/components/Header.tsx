"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Logo } from "@/components/Logo"

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Don't show header on authenticated pages (they have their own headers)
  const hideHeader = 
    pathname?.startsWith("/library") || 
    pathname?.startsWith("/study") ||
    pathname?.startsWith("/preferences") ||
    pathname?.startsWith("/books") ||
    pathname?.startsWith("/chapters") ||
    pathname?.startsWith("/conversations")

  if (hideHeader) return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background backdrop-blur-sm transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <Logo size={32} className="transition-transform duration-300 group-hover:scale-105" />
            <span className="text-2xl font-serif font-bold text-foreground transition-transform duration-300 group-hover:scale-105">
              Chapters
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/manifesto"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
            >
              Manifesto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Auth Buttons + Theme Toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className="transition-all duration-300 hover:scale-105"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="sm"
                className="transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                Start Your Book
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
