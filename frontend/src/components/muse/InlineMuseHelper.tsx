"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MuseTooltip } from "@/components/muse/MuseTooltip"
import { useGeneratePrompts, useSuggestTitles, useRewriteText } from "@/hooks/useMuse"

interface InlineMuseHelperProps {
  draftContent: string
  hasTitle: boolean
  onApplySuggestion: (suggestion: string, type: "content" | "title") => void
}

export function InlineMuseHelper({
  draftContent,
  hasTitle,
  onApplySuggestion,
}: InlineMuseHelperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const generatePrompts = useGeneratePrompts()
  const suggestTitles = useSuggestTitles()
  const rewriteText = useRewriteText()

  const isEmpty = !draftContent || draftContent.trim().length === 0
  const isLoading = generatePrompts.isPending || suggestTitles.isPending || rewriteText.isPending

  const handleAction = async (action: string) => {
    setActiveAction(action)
    setIsOpen(true)
    setSuggestions([])

    try {
      switch (action) {
        case "first-line":
          const promptResponse = await generatePrompts.mutateAsync({
            context: "first line for a new chapter"
          })
          setSuggestions(promptResponse.prompts.slice(0, 3))
          break

        case "title":
          const titleResponse = await suggestTitles.mutateAsync({
            content: draftContent
          })
          setSuggestions(titleResponse.titles.slice(0, 3))
          break

        case "tighten":
          const tightenResponse = await rewriteText.mutateAsync({
            text: draftContent,
            style: "concise",
            preserveVoice: true
          })
          setSuggestions([tightenResponse.rewritten])
          break

        case "tone":
          // Generate 3 different tone variations
          const toneVariations = await Promise.all([
            rewriteText.mutateAsync({ text: draftContent, style: "softer", preserveVoice: true }),
            rewriteText.mutateAsync({ text: draftContent, style: "sharper", preserveVoice: true }),
            rewriteText.mutateAsync({ text: draftContent, style: "surreal", preserveVoice: true }),
          ])
          setSuggestions(toneVariations.map(v => v.rewritten))
          break
      }
    } catch (error) {
      console.error("Muse error:", error)
      setSuggestions(["Something went wrong. Please try again."])
    }
  }

  const handleApply = (suggestion: string) => {
    const type = activeAction === "title" ? "title" : "content"
    onApplySuggestion(suggestion, type)
    setIsOpen(false)
    setActiveAction(null)
    setSuggestions([])
  }

  return (
    <div className="border-t border-border pt-4 mt-4">
      {/* Action Buttons */}
      {!isOpen && (
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <span className="text-sm text-muted-foreground mr-2">Need a hand?</span>
            {/* First-time tooltip for inline helper */}
            <MuseTooltip
              id="first-inline-muse"
              title="Inline Help"
              message="I can suggest first lines, titles, or help you tighten your writing. These actions appear based on what you're working on."
              position="top"
            />
          </div>
          
          {isEmpty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("first-line")}
            >
              Ask Muse for a first line
            </Button>
          )}

          {!isEmpty && !hasTitle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("title")}
            >
              Ask Muse for a title
            </Button>
          )}

          {!isEmpty && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction("tighten")}
              >
                Tighten this
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAction("tone")}
              >
                Explore a different tone
              </Button>
            </>
          )}
        </div>
      )}

      {/* Suggestions Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  {activeAction === "first-line" && "Let's start simple"}
                  {activeAction === "title" && "Titles don't need to be perfect"}
                  {activeAction === "tighten" && "I kept your meaning"}
                  {activeAction === "tone" && "Which way do you want this to lean?"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {activeAction === "first-line" && "You don't have to explain your whole life — just this moment."}
                  {activeAction === "title" && "Just honest."}
                  {activeAction === "tighten" && "Just made it leaner."}
                  {activeAction === "tone" && "Take what you like, ignore the rest."}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setActiveAction(null)
                  setSuggestions([])
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  Muse is thinking...
                </p>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-background rounded border border-border"
                    >
                      <p className="text-foreground mb-3 whitespace-pre-wrap">{suggestion}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApply(suggestion)}
                        >
                          Use this
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(suggestion)
                          }}
                        >
                          Copy only
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                      setActiveAction(null)
                      setSuggestions([])
                    }}
                  >
                    Keep mine
                  </Button>
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
