"use client"

import { motion } from "framer-motion"
import { Logo } from "@/components/Logo"

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Pulsing logo */}
      <div className="mb-6">
        <Logo size={80} animated />
      </div>

      {/* Loading text */}
      <motion.p
        className="text-sm text-muted-foreground"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {message}
      </motion.p>
    </div>
  )
}

// Compact version for inline use
export function LoadingSpinner() {
  return (
    <div className="inline-flex items-center gap-2">
      <motion.div
        className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}
