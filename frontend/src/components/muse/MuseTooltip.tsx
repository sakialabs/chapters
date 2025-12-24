"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface MuseTooltipProps {
  id: string // Unique ID for this tooltip (e.g., "first-study-visit")
  title: string
  message: string
  position?: "top" | "bottom" | "left" | "right"
  onDismiss?: () => void
}

export function MuseTooltip({
  id,
  title,
  message,
  position = "bottom",
  onDismiss,
}: MuseTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if this tooltip has been shown before
    const hasBeenShown = localStorage.getItem(`muse-tooltip-${id}`)
    
    if (!hasBeenShown) {
      // Show after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [id])

  const handleDismiss = () => {
    // Mark as shown
    localStorage.setItem(`muse-tooltip-${id}`, "true")
    setIsVisible(false)
    onDismiss?.()
  }

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`absolute ${positionClasses[position]} z-50 w-80`}
        >
          <div className="bg-card border-2 border-primary rounded-lg p-4 shadow-xl backdrop-blur-sm">
            {/* Muse indicator */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎭</span>
              <span className="text-sm font-medium text-foreground">{title}</span>
            </div>
            
            {/* Message */}
            <p className="text-sm text-muted-foreground mb-4">
              {message}
            </p>
            
            {/* Dismiss button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="w-full"
            >
              Got it
            </Button>
          </div>
          
          {/* Arrow pointer */}
          <div
            className={`absolute w-3 h-3 bg-card border-primary transform rotate-45 ${
              position === "bottom"
                ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-t-2 border-l-2"
                : position === "top"
                ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-b-2 border-r-2"
                : position === "right"
                ? "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-t-2 border-l-2"
                : "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-b-2 border-r-2"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
