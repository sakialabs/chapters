"use client"

import { motion } from "framer-motion"

interface OnboardingLayoutProps {
  children: React.ReactNode
  step: number
  totalSteps: number
}

export function OnboardingLayout({ children, step, totalSteps }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-lg p-8 sm:p-12">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
