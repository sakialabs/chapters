"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useSendInvite } from "@/hooks/useBTL"

interface BetweenTheLinesModalProps {
  isOpen: boolean
  onClose: () => void
  bookId: string
  bookTitle: string
}

export function BetweenTheLinesModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
}: BetweenTheLinesModalProps) {
  const [message, setMessage] = useState("")
  
  const sendInvite = useSendInvite()

  const handleSend = async () => {
    if (!message.trim()) return

    try {
      await sendInvite.mutateAsync({
        toBookId: bookId,
        message: message.trim(),
      })
      onClose()
      setMessage("")
    } catch (error) {
      console.error("Failed to send invite:", error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                      Between the Lines
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      with {bookTitle}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Explanation */}
                <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    This is a quiet space for two people whose Books resonate.
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    No feed. No audience. Just conversation.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    They can accept or decline. Nothing opens automatically.
                  </p>
                </div>

                {/* Message Input */}
                <div className="mb-6">
                  <Label htmlFor="btl-message" className="mb-2">
                    What moved you?
                  </Label>
                  <textarea
                    id="btl-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                    placeholder="Share what resonated with you..."
                    className="w-full min-h-[120px] px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.length}/500 characters
                  </p>
                </div>

                {/* Optional: Chapter Excerpt */}
                <div className="mb-6">
                  <Label className="mb-2">
                    Include a chapter excerpt? (Optional)
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Coming soon - you'll be able to quote specific lines
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim() || sendInvite.isPending}
                    className="flex-1"
                  >
                    {sendInvite.isPending ? "Sending..." : "Send Invitation"}
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
