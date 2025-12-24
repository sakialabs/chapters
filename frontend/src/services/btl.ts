/**
 * Between the Lines Service
 * 
 * Handles connection invites and conversations
 */

import { apiClient } from '@/lib/api-client'

export interface BTLEligibility {
  isEligible: boolean
  reason?: string
}

export interface BTLInvite {
  id: string
  fromUserId: string
  fromUsername: string
  fromBookTitle: string
  toUserId: string
  message: string
  chapterExcerpt?: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export interface BTLConversation {
  id: string
  user1Id: string
  user2Id: string
  user1BookTitle: string
  user2BookTitle: string
  lastMessageAt: string
  status: 'active' | 'closed'
}

export interface BTLMessage {
  id: string
  conversationId: string
  senderId: string
  senderUsername: string
  content: string
  createdAt: string
}

export const btlService = {
  /**
   * Check if BTL is available with a user
   */
  async checkEligibility(bookId: string): Promise<BTLEligibility> {
    return apiClient.get<BTLEligibility>(`/btl/eligibility/${bookId}`)
  },

  /**
   * Send BTL invite
   */
  async sendInvite(data: {
    toBookId: string
    message: string
    chapterExcerpt?: string
  }): Promise<BTLInvite> {
    return apiClient.post<BTLInvite>('/btl/invite', data)
  },

  /**
   * Get pending invites
   */
  async getPendingInvites(): Promise<BTLInvite[]> {
    return apiClient.get<BTLInvite[]>('/btl/invites')
  },

  /**
   * Accept invite
   */
  async acceptInvite(inviteId: string): Promise<BTLConversation> {
    return apiClient.post<BTLConversation>(`/btl/accept/${inviteId}`)
  },

  /**
   * Decline invite
   */
  async declineInvite(inviteId: string): Promise<void> {
    await apiClient.post(`/btl/decline/${inviteId}`)
  },

  /**
   * Get all conversations
   */
  async getConversations(): Promise<BTLConversation[]> {
    return apiClient.get<BTLConversation[]>('/btl/conversations')
  },

  /**
   * Get conversation messages
   */
  async getMessages(conversationId: string): Promise<BTLMessage[]> {
    return apiClient.get<BTLMessage[]>(`/btl/conversation/${conversationId}`)
  },

  /**
   * Send message
   */
  async sendMessage(conversationId: string, content: string): Promise<BTLMessage> {
    return apiClient.post<BTLMessage>('/btl/message', {
      conversationId,
      content,
    })
  },

  /**
   * Close conversation
   */
  async closeConversation(conversationId: string): Promise<void> {
    await apiClient.post(`/btl/close/${conversationId}`)
  },

  /**
   * Block user
   */
  async blockUser(userId: string): Promise<void> {
    await apiClient.post(`/moderation/blocks/${userId}`)
  },

  /**
   * Report conversation
   */
  async reportConversation(conversationId: string, reason: string): Promise<void> {
    await apiClient.post('/moderation/reports', {
      type: 'btl_conversation',
      targetId: conversationId,
      reason,
    })
  },
}
