"use client"

import { useRouter, useParams } from "next/navigation"
import { ConversationView } from "@/components/btl/ConversationView"
import { useConversationMessages, useSendMessage, useCloseConversation } from "@/hooks/useBTL"
import { btlService } from "@/services/btl"

export default function ConversationPage() {
  const router = useRouter()
  const params = useParams()
  const conversationId = params.id as string

  const { data: messages = [], isLoading } = useConversationMessages(conversationId)
  const sendMessage = useSendMessage()
  const closeConversation = useCloseConversation()

  // TODO: Get other book title and current user ID from conversation metadata
  const otherBookTitle = "Other Book"
  const currentUserId = "current-user" // Will be determined from messages

  const handleSendMessage = async (content: string) => {
    await sendMessage.mutateAsync({ conversationId, content })
  }

  const handleClose = async () => {
    if (confirm("Are you sure you want to close this space? This cannot be undone.")) {
      await closeConversation.mutateAsync(conversationId)
      router.push("/conversations")
    }
  }

  const handleBlock = async () => {
    if (confirm("Are you sure you want to block this user? They won't be able to contact you again.")) {
      // TODO: Get other user ID from conversation
      // await btlService.blockUser(otherUserId)
      router.push("/conversations")
    }
  }

  const handleReport = async () => {
    if (confirm("Report this conversation for violating community guidelines?")) {
      await btlService.reportConversation(conversationId, "User reported via UI")
      alert("Thank you for your report. We'll review it shortly.")
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background">
      <ConversationView
        conversationId={conversationId}
        otherBookTitle={otherBookTitle}
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        onClose={handleClose}
        onBlock={handleBlock}
        onReport={handleReport}
      />
    </div>
  )
}
