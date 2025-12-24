"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BetweenTheLinesModal } from "./BetweenTheLinesModal"

interface BetweenTheLinesButtonProps {
  bookId: string
  bookTitle: string
  isEligible: boolean
}

export function BetweenTheLinesButton({
  bookId,
  bookTitle,
  isEligible,
}: BetweenTheLinesButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!isEligible) return null

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        className="text-sm"
      >
        Between the Lines
      </Button>

      <BetweenTheLinesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bookId={bookId}
        bookTitle={bookTitle}
      />
    </>
  )
}
