"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LoadingState } from "@/components/LoadingState"
import { useChapter, useMargins, useHeartChapter, useBookmarkChapter } from "@/hooks/useLibrary"
import type { ChapterBlock } from "@/services/library"

function ChapterBlockComponent({ block }: { block: ChapterBlock }) {
  switch (block.block_type) {
    case 'text':
      return (
        <div className="prose prose-lg max-w-none">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {block.content.text}
          </p>
        </div>
      )

    case 'quote':
      return (
        <blockquote className="border-l-4 border-border pl-6 py-4 my-6 bg-muted/20">
          <p className="text-lg italic text-foreground leading-relaxed">
            {block.content.text}
          </p>
          {block.content.attribution && (
            <footer className="text-sm text-muted-foreground mt-2">
              — {block.content.attribution}
            </footer>
          )}
        </blockquote>
      )

    case 'image':
      return (
        <figure className="my-8">
          <img
            src={block.content.url}
            alt={block.content.caption || ''}
            className="w-full rounded-lg border border-warmGray"
          />
          {block.content.caption && (
            <figcaption className="text-sm text-muted-foreground text-center mt-2">
              {block.content.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'audio':
      return (
        <div className="my-8 bg-warmGray/10 border border-warmGray rounded-lg p-6">
          <audio controls className="w-full">
            <source src={block.content.url} />
            Your browser does not support audio playback.
          </audio>
          {block.content.caption && (
            <p className="text-sm text-muted-foreground mt-2">{block.content.caption}</p>
          )}
        </div>
      )

    case 'video':
      return (
        <div className="my-8">
          <video controls className="w-full rounded-lg border border-warmGray">
            <source src={block.content.url} />
            Your browser does not support video playback.
          </video>
          {block.content.caption && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              {block.content.caption}
            </p>
          )}
        </div>
      )

    default:
      return null
  }
}

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const chapterId = params.id as string
  const [showMargins, setShowMargins] = useState(false)

  const { data: chapter, isLoading: chapterLoading } = useChapter(chapterId)
  const { data: margins, isLoading: marginsLoading } = useMargins(chapterId)
  const heartMutation = useHeartChapter()
  const bookmarkMutation = useBookmarkChapter()

  const handleHeart = () => {
    if (!chapter) return
    heartMutation.mutate({ chapterId: chapter.id, isHearted: chapter.is_hearted })
  }

  const handleBookmark = () => {
    if (!chapter) return
    bookmarkMutation.mutate({ chapterId: chapter.id, isBookmarked: chapter.is_bookmarked })
  }

  if (chapterLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingState message="Loading chapter..." />
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-semibold text-foreground mb-4">Chapter not found</h1>
          <Button onClick={() => router.push('/library')}>Back to Library</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push('/library')}>
            ← Back
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant={chapter.is_hearted ? "secondary" : "ghost"}
              size="sm"
              onClick={handleHeart}
              disabled={heartMutation.isPending}
              className={`${chapter.is_hearted ? "bg-primary/10 text-foreground" : "text-foreground"}`}
            >
              💖 {chapter.heart_count}
            </Button>
            <Button
              variant={chapter.is_bookmarked ? "secondary" : "ghost"}
              size="sm"
              onClick={handleBookmark}
              disabled={bookmarkMutation.isPending}
              className={`${chapter.is_bookmarked ? "bg-primary/10 text-foreground" : "text-foreground"}`}
            >
              🔖 {chapter.is_bookmarked ? "Saved" : "Save"}
            </Button>
            <Button
              variant={showMargins ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowMargins(!showMargins)}
              className={`${showMargins ? "bg-primary/10 text-foreground" : "text-foreground"}`}
            >
              💬 Margins
            </Button>
          </div>
        </div>
      </header>

      {/* Chapter Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Chapter Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
              {chapter.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {chapter.author?.book_id ? (
                <Link
                  href={`/books/${chapter.author.book_id}`}
                  className="hover:text-primary transition-colors"
                >
                  by <span className="font-medium">{chapter.author.username}</span>
                </Link>
              ) : (
                <span>
                  by <span className="font-medium">{chapter.author?.username || 'Unknown'}</span>
                </span>
              )}
              <span>•</span>
              <span>{new Date(chapter.published_at).toLocaleDateString()}</span>
            </div>
            {chapter.mood && (
              <p className="text-muted-foreground italic">{chapter.mood}</p>
            )}
            {chapter.theme && (
              <p className="text-sm text-muted-foreground mt-2">Theme: {chapter.theme}</p>
            )}
          </header>

          {/* Chapter Blocks */}
          <div className="space-y-6 font-serif text-lg leading-relaxed">
            {chapter.blocks.map((block) => (
              <ChapterBlockComponent key={block.id} block={block} />
            ))}
          </div>
        </div>
      </article>

      {/* Margins Section */}
      {showMargins && (
        <aside className="border-t border-border bg-card">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
                Margins
              </h2>

              {marginsLoading ? (
                <div className="text-center py-12">
                  <LoadingState message="Loading margins..." />
                </div>
              ) : margins && margins.length > 0 ? (
                <div className="space-y-4">
                  {margins.map((margin) => (
                    <div
                      key={margin.id}
                      className="bg-background border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <span className="font-medium text-foreground">{margin.username}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(margin.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground leading-relaxed">{margin.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-lg text-muted-foreground mb-2">No margins yet</p>
                  <p className="text-sm text-muted-foreground">Be the first to leave a comment</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
