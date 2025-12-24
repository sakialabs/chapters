"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useGeneratePrompts } from "@/hooks/useMuse"

interface MuseDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MuseDrawer({ isOpen, onClose }: MuseDrawerProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<string[]>([])
  
  const generatePrompts = useGeneratePrompts()

  const handlePrompt = async () => {
    setSelectedAction("prompt")
    try {
      const response = await generatePrompts.mutateAsync({})
      setPrompts(response.prompts)
    } catch (error) {
      console.error("Failed to generate prompts:", error)
      setPrompts(["Something went wrong. Please try again."])
    }
  }

  const handleShapeDraft = () => {
    setSelectedAction("shape")
    setPrompts([
      "Draft shaping is coming soon.",
      "For now, try the inline Muse helper in your Study."
    ])
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

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-card border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                    Muse
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    A quiet place for prompts, reflections, and revisiting drafts.
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

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handlePrompt}
                  className="w-full text-left p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✍️</span>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">
                        Give me a writing prompt
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Start with a gentle nudge
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleShapeDraft}
                  className="w-full text-left p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📖</span>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">
                        Help me shape a draft
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Turn fragments into chapters
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  disabled
                  className="w-full text-left p-4 bg-background border border-border rounded-lg opacity-50 cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎭</span>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">
                        Reflect on my recent chapters
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Coming soon
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Response Area */}
              {selectedAction && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  {generatePrompts.isPending ? (
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                      <p className="text-sm text-muted-foreground">
                        Muse is thinking...
                      </p>
                    </div>
                  ) : prompts.length > 0 ? (
                    <>
                      <div className="space-y-3">
                        {prompts.map((prompt, index) => (
                          <div
                            key={index}
                            className="p-4 bg-background border border-border rounded-lg"
                          >
                            <p className="text-foreground mb-3">{prompt}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(prompt)
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAction(null)
                            setPrompts([])
                          }}
                        >
                          Close
                        </Button>
                      </div>
                    </>
                  ) : null}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
