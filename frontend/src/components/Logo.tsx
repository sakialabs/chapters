"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface LogoProps {
  size?: number
  animated?: boolean
  className?: string
}

export function Logo({ size = 40, animated = false, className = "" }: LogoProps) {
  const logoElement = (
    <Image
      src="/logo.png"
      alt="Chapters"
      width={size}
      height={size}
      className={`${className}`}
      priority
    />
  )

  if (animated) {
    return (
      <motion.div
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [0.95, 1, 0.95],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {logoElement}
      </motion.div>
    )
  }

  return logoElement
}
