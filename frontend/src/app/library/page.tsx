"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { DismissibleBanner } from "@/components/DismissibleBanner"
import { MuseDrawer } from "@/components/MuseDrawer"
import { MuseTooltip } from "@/components/muse/MuseTooltip"
import { PageTransition, TabTransition } from "@/components/PageTransition"
import { LoadingState } from "@/components/LoadingState"
import { authService } from "@/services/auth"
import { useBookshelf, useNewChapters, useQuietPicks } from "@/hooks/useLibrary"
import { AnimatePresence } from "framer-motion"

export default function LibraryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'bookshelf' | 'new' | 'picks'>('bookshelf')
  const [newChaptersPage, setNewChaptersPage] = useState(1)
  const [isMuseOpen, setIsMuseOpen] = useState(false)

  const { data: bookshelf, isLoading: bookshelfLoading } = useBookshelf()
  const { data: newChapters, isLoading: newChaptersLoading } = useNewChapters(newChaptersPage)
  const { data: quietPicks, isLoading: quietPicksLoading } = useQuietPicks()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Suppress logout errors - token cleanup happens regardless
      console.debug('Logout completed')
    } finally {
      router.push("/")
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Library
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="relative">
              <Button variant="ghost" onClick={() => setIsMuseOpen(true)}>
                Muse
              </Button>
              {/* First-time tooltip for Muse in Library */}
              <MuseTooltip
                id="first-library-muse"
                title="Muse"
                message="I can help you start writing, shape drafts, or find inspiration. Click anytime you need a creative companion."
                position="bottom"
              />
            </div>
            <Link href="/preferences">
              <Button variant="ghost">Preferences</Button>
            </Link>
            <Link href="/study">
              <Button variant="ghost">Study</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Muse Drawer */}
      <MuseDrawer isOpen={isMuseOpen} onClose={() => setIsMuseOpen(false)} />

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('bookshelf')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'bookshelf'
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Bookshelf
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'new'
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              New Chapters
            </button>
            <button
              onClick={() => setActiveTab('picks')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'picks'
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Quiet Picks
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
        {/* Bookshelf */}
        {activeTab === 'bookshelf' && (
          <TabTransition key="bookshelf">
          <div className="max-w-6xl mx-auto">
            {bookshelfLoading ? (
              <LoadingState message="Loading your bookshelf..." />
            ) : bookshelf && bookshelf.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {bookshelf.map((spine) => (
                  <Link
                    key={spine.id}
                    href={`/books/${spine.id}`}
                    className="group"
                  >
                    <div className="relative bg-card border-2 border-border rounded-lg p-4 h-48 flex flex-col justify-between hover:border-primary hover:shadow-md transition-all">
                      {/* Unread indicator */}
                      {spine.unread_count > 0 && (
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {spine.unread_count}
                        </div>
                      )}
                      
                      {/* Book name (vertical) */}
                      <div className="flex-1 flex items-center justify-center">
                        <h3 className="font-serif font-semibold text-foreground text-center group-hover:text-primary transition-colors">
                          {spine.username}
                        </h3>
                      </div>
                      
                      {/* Last chapter date */}
                      {spine.last_chapter_at && (
                        <p className="text-xs text-muted-foreground text-center">
                          {new Date(spine.last_chapter_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📚</div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  Your Bookshelf is Empty
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Follow some Books to see them appear here
                </p>
              </div>
            )}
          </div>
          </TabTransition>
        )}

        {/* New Chapters */}
        {activeTab === 'new' && (
          <TabTransition key="new">
          <div className="max-w-7xl mx-auto">
            {newChaptersLoading ? (
              <LoadingState message="Loading new chapters..." />
            ) : newChapters && newChapters.chapters.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newChapters.chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/chapters/${chapter.id}`}
                      className="block bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="text-lg font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
                            {chapter.title}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(chapter.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          by <span className="font-medium">{chapter.author_username}</span>
                        </p>
                        {chapter.mood && (
                          <p className="text-sm text-primary italic mt-auto">{chapter.mood}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {(newChaptersPage > 1 || newChapters.has_more) && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    {newChaptersPage > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => setNewChaptersPage(p => p - 1)}
                      >
                        ← Previous
                      </Button>
                    )}
                    <span className="text-sm text-muted-foreground">
                      Page {newChaptersPage} of {newChapters.total_pages}
                    </span>
                    {newChapters.has_more && (
                      <Button
                        variant="outline"
                        onClick={() => setNewChaptersPage(p => p + 1)}
                      >
                        Next →
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📖</div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  No New Chapters
                </h2>
                <p className="text-lg text-muted-foreground">
                  Check back later for new chapters from Books you follow
                </p>
              </div>
            )}
          </div>
          </TabTransition>
        )}

        {/* Quiet Picks */}
        {activeTab === 'picks' && (
          <TabTransition key="picks">
          <div className="max-w-7xl mx-auto">
            <DismissibleBanner
              id="quiet-picks-info"
              title="A Quiet Note"
              message="Quiet Picks are refreshed slowly. There's no rush — they'll be here when you're ready."
            />

            {quietPicksLoading ? (
              <LoadingState message="Finding your picks..." />
            ) : quietPicks && quietPicks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quietPicks.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/chapters/${chapter.id}`}
                    className="block bg-card border-2 border-primary/30 rounded-lg p-6 hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-lg font-serif font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
                          {chapter.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(chapter.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        by <span className="font-medium">{chapter.author_username}</span>
                      </p>
                      {chapter.mood && (
                        <p className="text-sm text-primary italic mt-auto">{chapter.mood}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🌙</div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  No Picks Yet
                </h2>
                <p className="text-lg text-muted-foreground">
                  Read and heart some chapters to build your taste profile
                </p>
              </div>
            )}
          </div>
          </TabTransition>
        )}
        </AnimatePresence>
      </main>
    </div>
    </PageTransition>
  )
}
