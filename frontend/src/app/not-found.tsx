"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={32} className="transition-transform duration-300 group-hover:scale-105" />
            <span className="text-2xl font-serif font-bold text-foreground transition-transform duration-300 group-hover:scale-105">
              Chapters
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <Logo size={120} />
          </div>

          {/* Title */}
          <div className="space-y-4 animate-fade-in-delay-1">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground">
              This page seems to have wandered off the shelf.
            </p>
            <p className="text-sm text-muted-foreground">
              Let's get you back on track.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in-delay-2">
            <Link href="/library">
              <Button size="lg" className="w-full sm:w-auto">
                Return to Library
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Go Home
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="pt-12 border-t border-border animate-fade-in-delay-3">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link
                href="/about"
                className="text-primary hover:underline transition-colors"
              >
                About Us
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/manifesto"
                className="text-primary hover:underline transition-colors"
              >
                Our Manifesto
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/contact"
                className="text-primary hover:underline transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
