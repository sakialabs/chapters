"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface FirstChapterInviteProps {
  onStartChapter: (prompt?: string) => void
  onWriteAlone: () => void
}

const PROMPTS = [
  "Something I've been carrying lately…",
  "A moment I keep returning to…",
  "Lately, the world feels like…",
  "This chapter is about a feeling I don't have a name for yet.",
]

export function FirstChapterInvite({ onStartChapter, onWriteAlone }: FirstChapterInviteProps) {
  const [showPrompts, setShowPrompts] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!showPrompts ? (
          <motion.div
            key="invite"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-lg p-8 max-w-md text-center space-y-6"
          >
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Your first Open Page
            </h2>
            <p className="text-muted-foreground">
              You don't have to publish anything today.<br />
              This space is for drafts, fragments, and half-formed thoughts.
            </p>
            <p className="text-muted-foreground">
              If you'd like, I can help you start a first chapter —<br />
              just to feel the shape of things.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setShowPrompts(true)}>
                Help me start a chapter
              </Button>
              <Button variant="outline" onClick={onWriteAlone}>
                I'll write on my own
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="prompts"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-lg p-8 max-w-lg space-y-6"
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Let's begin gently
              </h2>
              <p className="text-muted-foreground">
                Your first chapter doesn't need to be important.<br />
                It just needs to be yours.
              </p>
              <p className="text-sm text-muted-foreground">
                Here are a few places we could start:
              </p>
            </div>

            <div className="space-y-3">
              {PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onStartChapter(prompt)}
                  className="w-full text-left p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <p className="text-foreground italic">"{prompt}"</p>
                </button>
              ))}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              You can ignore these and write anything.
            </p>

            <div className="flex justify-center">
              <Button variant="ghost" onClick={onWriteAlone}>
                Start with a blank page
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
