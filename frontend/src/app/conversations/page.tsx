"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { MuseDrawer } from "@/components/MuseDrawer"
import { useConversations } from "@/hooks/useBTL"

export default function ConversationsPage() {
  const [isMuseOpen, setIsMuseOpen] = useState(false)
  
  const { data: conversations = [], isLoading } = useConversations()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Between the Lines
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => setIsMuseOpen(true)}>
              Muse
            </Button>
            <Link href="/library">
              <Button variant="ghost">← Library</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Muse Drawer */}
      <MuseDrawer isOpen={isMuseOpen} onClose={() => setIsMuseOpen(false)} />

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Info Banner */}
          <div className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              These are your quiet spaces for deeper connection.
              <br />
              Each conversation is private and can be closed anytime.
            </p>
          </div>

          {/* Conversations List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">💞</div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                No conversations yet
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                When you connect with someone whose Book resonates,
                <br />
                you'll find them here.
              </p>
              <Link href="/library">
                <Button>Explore the Library</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conversation) => {
                // Determine which user is the "other" user
                const otherBookTitle = conversation.user1BookTitle // This will need proper logic based on current user
                
                return (
                  <Link
                    key={conversation.id}
                    href={`/conversations/${conversation.id}`}
                    className="block"
                  >
                    <div className="p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif font-semibold text-foreground">
                          {otherBookTitle}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conversation.lastMessageAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
