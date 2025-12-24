"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useBook, useBookChapters, useFollowBook } from "@/hooks/useLibrary"
import { BetweenTheLinesButton } from "@/components/btl/BetweenTheLinesButton"
import { useBTLEligibility } from "@/hooks/useBTL"

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string
  const [page, setPage] = useState(1)

  const { data: book, isLoading: bookLoading } = useBook(bookId)
  const { data: chaptersData, isLoading: chaptersLoading } = useBookChapters(bookId, page)
  const followMutation = useFollowBook()
  
  // Check BTL eligibility
  const { data: eligibility } = useBTLEligibility(bookId)

  const handleFollow = () => {
    if (!book) return
    followMutation.mutate({ bookId: book.id, isFollowing: book.is_following })
  }

  if (bookLoading) {
    return (
      <div className="min-h-screen bg-paperWhite flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-inkBlue"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-semibold text-foreground mb-4">Book not found</h1>
          <Button onClick={() => router.push('/library')}>Back to Library</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paperWhite">
      {/* Header */}
      <header className="border-b border-warmGray bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push('/library')}>
            ← Back
          </Button>
        </div>
      </header>

      {/* Book Profile */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white border border-warmGray rounded-lg p-8 mb-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                  {book.username}
                </h1>
                {book.bio && (
                  <p className="text-muted-foreground mb-4">{book.bio}</p>
                )}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{book.follower_count} followers</span>
                  <span>{book.chapter_count} chapters</span>
                  {book.is_private && (
                    <span className="text-muted-foreground">🔒 Private</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant={book.is_following ? "outline" : "default"}
                  onClick={handleFollow}
                  disabled={followMutation.isPending}
                >
                  {book.is_following ? "Following" : "Follow"}
                </Button>
                
                {/* Between the Lines Button */}
                <BetweenTheLinesButton
                  bookId={bookId}
                  bookTitle={book.username}
                  isEligible={eligibility?.isEligible ?? false}
                />
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div>
            <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
              Chapters
            </h2>

            {chaptersLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-inkBlue"></div>
              </div>
            ) : chaptersData && chaptersData.chapters.length > 0 ? (
              <>
                <div className="space-y-4">
                  {chaptersData.chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/chapters/${chapter.id}`}
                      className="block bg-white border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all"
                    >
                      <h3 className="text-xl font-serif font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                        {chapter.title}
                      </h3>
                      {chapter.mood && (
                        <p className="text-sm text-muted-foreground italic mb-2">
                          {chapter.mood}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(chapter.published_at).toLocaleDateString()}</span>
                        <span>♥ {chapter.heart_count}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {(page > 1 || chaptersData.has_more) && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    {page > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => setPage(p => p - 1)}
                      >
                        ← Previous
                      </Button>
                    )}
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {chaptersData.total_pages}
                    </span>
                    {chaptersData.has_more && (
                      <Button
                        variant="outline"
                        onClick={() => setPage(p => p + 1)}
                      >
                        Next →
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white border border-border rounded-lg">
                <p className="text-muted-foreground">No chapters yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
