"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  content: string
  senderId: string
  senderUsername: string
  createdAt: string
}

interface ConversationViewProps {
  conversationId: string
  otherBookTitle: string
  messages: Message[]
  currentUserId: string
  onSendMessage: (content: string) => Promise<void>
  onClose: () => void
  onBlock: () => void
  onReport: () => void
}

export function ConversationView({
  conversationId,
  otherBookTitle,
  messages,
  currentUserId,
  onSendMessage,
  onClose,
  onBlock,
  onReport,
}: ConversationViewProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      await onSendMessage(newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-serif font-semibold text-foreground">
            Between the Lines
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReport}
            >
              Report
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBlock}
            >
              Block
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Close Space
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          You're between the lines with {otherBookTitle}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              This is the beginning of your conversation.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === currentUserId
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${
                    isOwn
                      ? "bg-primary/10 border-primary/30"
                      : "bg-card border-border"
                  } border rounded-lg p-4`}
                >
                  <p className="text-foreground whitespace-pre-wrap mb-2">
                    {message.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value.slice(0, 1000))}
            onKeyPress={handleKeyPress}
            placeholder="Write a reply..."
            className="flex-1 min-h-[80px] px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              size="sm"
            >
              {isSending ? "..." : "Send"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {newMessage.length}/1000
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
