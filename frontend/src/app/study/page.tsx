"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { MuseDrawer } from "@/components/MuseDrawer"
import { MuseTooltip } from "@/components/muse/MuseTooltip"
import { DismissibleBanner } from "@/components/DismissibleBanner"
import { PageTransition, TabTransition } from "@/components/PageTransition"
import { LoadingState } from "@/components/LoadingState"
import { useDrafts, useNotes } from "@/hooks/useStudy"
import { AnimatePresence } from "framer-motion"

export default function StudyPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'drafts' | 'notes'>('drafts')
  const [isMuseOpen, setIsMuseOpen] = useState(false)

  const { data: drafts, isLoading: draftsLoading } = useDrafts()
  const { data: notes, isLoading: notesLoading } = useNotes()

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              Study
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="relative">
                <Button variant="ghost" onClick={() => setIsMuseOpen(true)}>
                  Muse
                </Button>
                {/* First-time tooltip for Muse */}
                <MuseTooltip
                  id="first-study-muse"
                  title="Muse"
                  message="I'm here if you need a prompt, a title, or help shaping your thoughts. Just click when you're ready."
                  position="bottom"
                />
              </div>
              <Button variant="ghost" onClick={() => router.push('/preferences')}>
                Preferences
              </Button>
              <Button variant="ghost" onClick={() => router.push('/library')}>
                ← Library
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
              onClick={() => setActiveTab('drafts')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'drafts'
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Note Nook
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <DismissibleBanner
          id="study-mobile-editing"
          title="Mobile Editing"
          message="Editing is available on mobile. Use the web to view your drafts and notes."
        />

        <AnimatePresence mode="wait">
          {/* Drafts */}
          {activeTab === 'drafts' && (
            <TabTransition key="drafts">
              <div className="max-w-3xl mx-auto">
                {draftsLoading ? (
                  <LoadingState message="Loading drafts..." />
                ) : drafts && drafts.length > 0 ? (
                  <div className="space-y-4">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="bg-card border border-border rounded-lg p-6"
                      >
                        <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                          {draft.title || 'Untitled Draft'}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{draft.block_count} blocks</span>
                          <span>•</span>
                          <span>Updated {new Date(draft.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">✍️</div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                      No Drafts Yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Create drafts on the mobile app
                    </p>
                  </div>
                )}
              </div>
            </TabTransition>
          )}

          {/* Notes */}
          {activeTab === 'notes' && (
            <TabTransition key="notes">
              <div className="max-w-3xl mx-auto">
                {notesLoading ? (
                  <LoadingState message="Loading notes..." />
                ) : notes && notes.length > 0 ? (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-card border border-border rounded-lg p-6"
                      >
                        <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                          {note.title || 'Untitled Note'}
                        </h3>
                        <p className="text-muted-foreground mb-3 line-clamp-3">
                          {note.content}
                        </p>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {note.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-primary/20 text-foreground px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                      No Notes Yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Create notes on the mobile app
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
