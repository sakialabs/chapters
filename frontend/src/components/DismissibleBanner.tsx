"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DismissibleBannerProps {
  id: string
  title?: string
  message?: string
  children?: React.ReactNode
  className?: string
}

export function DismissibleBanner({ 
  id, 
  title, 
  message, 
  children, 
  className = "" 
}: DismissibleBannerProps) {
  const [isVisible, setIsVisible] = useState(() => {
    // Check if user has dismissed this banner before
    if (typeof window !== "undefined") {
      return localStorage.getItem(`banner-dismissed-${id}`) !== "true"
    }
    return true
  })

  const handleDismiss = () => {
    setIsVisible(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(`banner-dismissed-${id}`, "true")
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: "2rem" }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`relative overflow-hidden ${className || "bg-primary/10 border border-primary/30 rounded-lg p-4"}`}
        >
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="I Understand"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          {children || (
            <div className="pr-6">
              {title && <p className="text-sm font-medium text-foreground mb-1">{title}</p>}
              {message && <p className="text-sm text-muted-foreground">{message}</p>}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
