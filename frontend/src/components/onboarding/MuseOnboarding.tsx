"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useSaveOnboardingPreferences } from "@/hooks/useMuse"

interface MuseOnboardingProps {
  onComplete: (preferences: OnboardingPreferences) => void
  onSkip: () => void
}

export interface OnboardingPreferences {
  museMode: "gentle" | "on-demand" | "quiet"
  expressionTypes: string[]
  tone: string[]
  completedAt: string
}

export function MuseOnboarding({ onComplete, onSkip }: MuseOnboardingProps) {
  const [step, setStep] = useState(1)
  const [museMode, setMuseMode] = useState<"gentle" | "on-demand" | "quiet">("gentle")
  const [expressionTypes, setExpressionTypes] = useState<string[]>([])
  const [tone, setTone] = useState<string[]>([])

  const savePreferences = useSaveOnboardingPreferences()

  const handleComplete = async () => {
    const preferences: OnboardingPreferences = {
      museMode,
      expressionTypes,
      tone,
      completedAt: new Date().toISOString(),
    }

    try {
      // Save to backend
      await savePreferences.mutateAsync(preferences)
      
      // Also save to localStorage as backup
      localStorage.setItem('muse-onboarding', JSON.stringify(preferences))
      
      onComplete(preferences)
    } catch (error) {
      console.error("Failed to save preferences:", error)
      // Still complete onboarding even if save fails
      localStorage.setItem('muse-onboarding', JSON.stringify(preferences))
      onComplete(preferences)
    }
  }

  const toggleExpression = (type: string) => {
    setExpressionTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleTone = (t: string) => {
    setTone(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  const goBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const goNext = () => {
    if (step < 5) setStep(step + 1)
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Theme Toggle - Fixed top right */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 py-20">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-serif font-bold text-foreground">
                      Welcome to Chapters
                    </h1>
                    <div className="text-lg text-muted-foreground space-y-2 max-w-xl mx-auto">
                      <p>Everyone's a book.</p>
                      <p>Each post is a chapter.</p>
                      <p className="pt-4">This isn't a feed.</p>
                      <p>It's a place to write, read, and take your time.</p>
                      <p className="pt-4">I'm Muse.</p>
                      <p>I can sit beside you while you explore — or stay quiet if you prefer.</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => setStep(2)}>
                    Meet Muse
                  </Button>
                  <Button size="lg" variant="outline" onClick={onSkip}>
                    Skip for now
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Who is Muse */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                  <div className="text-center space-y-4 mb-8">
                    <h2 className="text-3xl font-serif font-bold text-foreground">
                      A gentle companion
                    </h2>
                    <div className="text-muted-foreground space-y-2 max-w-xl mx-auto">
                      <p>I don't write for you.</p>
                      <p>I don't rush you.</p>
                      <p>I don't care about trends.</p>
                      <p className="pt-4">
                        I can offer prompts, titles, reflections, and cover ideas —<br />
                        only when you want them.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    <p className="text-center text-sm text-muted-foreground mb-4">
                      How would you like me to show up?
                    </p>
                    
                    <button
                      onClick={() => setMuseMode("gentle")}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        museMode === "gentle"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium text-foreground mb-1">
                        Gentle nudges now and then
                      </div>
                      <div className="text-sm text-muted-foreground">
                        I'll offer suggestions when it feels right
                      </div>
                    </button>

                    <button
                      onClick={() => setMuseMode("on-demand")}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        museMode === "on-demand"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium text-foreground mb-1">
                        Only when I ask
                      </div>
                      <div className="text-sm text-muted-foreground">
                        I'll wait for you to reach out
                      </div>
                    </button>

                    <button
                      onClick={() => setMuseMode("quiet")}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        museMode === "quiet"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium text-foreground mb-1">
                        Stay quiet for now
                      </div>
                      <div className="text-sm text-muted-foreground">
                        I'll be here if you change your mind
                      </div>
                    </button>

                    <p className="text-xs text-center text-muted-foreground pt-2">
                      You can change this anytime.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={goBack}>
                    ← Back
                  </Button>
                  <Button size="lg" onClick={goNext}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Expression Style */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                  <div className="text-center space-y-4 mb-8">
                    <h2 className="text-3xl font-serif font-bold text-foreground">
                      How do you usually express yourself?
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                      There's no right answer.<br />
                      This just helps me understand your rhythm.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "writing", label: "Writing & journaling", emoji: "📝" },
                      { id: "visual", label: "Visual art & photography", emoji: "🎨" },
                      { id: "audio", label: "Voice, sound, or music", emoji: "🎧" },
                      { id: "video", label: "Short films & video", emoji: "🎬" },
                      { id: "figuring", label: "I'm still figuring it out", emoji: "💭" },
                    ].map(({ id, label, emoji }) => (
                      <button
                        key={id}
                        onClick={() => toggleExpression(id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          expressionTypes.includes(id)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{emoji}</span>
                          <span className="font-medium text-foreground">{label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={goBack}>
                    ← Back
                  </Button>
                  <Button size="lg" onClick={goNext}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Tone */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                  <div className="text-center space-y-4 mb-8">
                    <h2 className="text-3xl font-serif font-bold text-foreground">
                      What's the usual tone?
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                      Choose what feels closest —<br />
                      you can always change.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Calm & reflective",
                      "Raw & honest",
                      "Dreamy & surreal",
                      "Playful & experimental",
                      "It really depends",
                    ].map((t) => (
                      <button
                        key={t}
                        onClick={() => toggleTone(t)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          tone.includes(t)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary/50"
                        }`}
                      >
                        <span className="font-medium text-foreground">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={goBack}>
                    ← Back
                  </Button>
                  <Button size="lg" onClick={goNext}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Language Tour */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
                  <div className="text-center space-y-4 mb-8">
                    <h2 className="text-3xl font-serif font-bold text-foreground">
                      Before we begin…
                    </h2>
                    <p className="text-muted-foreground">
                      A few things you'll hear around here:
                    </p>
                  </div>

                  <div className="space-y-4 max-w-xl mx-auto text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <p>Your profile is your <span className="text-foreground font-medium">Book</span></p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <p>Your posts are <span className="text-foreground font-medium">Chapters</span></p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <p>Home is your <span className="text-foreground font-medium">Library</span> — a bookshelf, not a feed</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <p>You write privately in your <span className="text-foreground font-medium">Study</span></p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <p>You get <span className="text-foreground font-medium">Open Pages</span> instead of unlimited posting</p>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground mb-6">
                      You'll learn the rest by using the app.<br />
                      No memorizing required.
                    </p>
                    <Button 
                      size="lg" 
                      onClick={handleComplete}
                      disabled={savePreferences.isPending}
                    >
                      {savePreferences.isPending ? "Saving..." : "Open the Library"}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-start">
                  <Button variant="ghost" onClick={goBack}>
                    ← Back
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Indicator */}
          {step > 1 && step < 6 && (
            <div className="flex justify-center gap-2 mt-8">
              {[2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  className={`h-1.5 w-12 rounded-full transition-all ${
                    s <= step ? "bg-primary" : "bg-border hover:bg-border/70"
                  }`}
                  aria-label={`Go to step ${s}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
