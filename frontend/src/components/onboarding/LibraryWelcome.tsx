"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface LibraryWelcomeProps {
  onOpenMyBook: () => void
  onSeeQuietPicks: () => void
}

export function LibraryWelcome({ onOpenMyBook, onSeeQuietPicks }: LibraryWelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-lg p-8 max-w-md text-center space-y-6"
      >
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Welcome to your Library
        </h2>
        <p className="text-muted-foreground">
          These are the Books you'll keep on your shelf.<br />
          You can start by opening your own Book —<br />
          or wander quietly through others.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onOpenMyBook}>
            Open My Book
          </Button>
          <Button variant="outline" onClick={onSeeQuietPicks}>
            See Quiet Picks
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
