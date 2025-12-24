/**
 * Between the Lines API Service
 * 
 * Handles intimate reading connections between mutual followers
 */

import apiClient from './client';

// Types
export interface BTLInvite {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender_username: string;
  sender_book_id: string;
  note?: string;
  quoted_line?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface BTLThread {
  id: string;
  participant_ids: string[];
  participants: Array<{
    id: string;
    username: string;
    book_id: string;
  }>;
  status: 'open' | 'closed';
  created_at: string;
  closed_at?: string;
  last_message_at?: string;
}

export interface BTLMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_username: string;
  content: string;
  created_at: string;
}

export interface BTLPin {
  id: string;
  thread_id: string;
  chapter_id: string;
  chapter_title: string;
  excerpt: string;
  pinned_by_id: string;
  created_at: string;
}

export interface CreateInviteRequest {
  recipient_id: string;
  note?: string;
  quoted_line?: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface CreatePinRequest {
  chapter_id: string;
  excerpt: string;
}

export const btlApi = {
  /**
   * Get pending invites for current user
   */
  async getInvites(): Promise<BTLInvite[]> {
    const response = await apiClient.get<BTLInvite[]>('/between-the-lines/invites');
    return response.data;
  },

  /**
   * Send BTL invite to another user
   */
  async sendInvite(data: CreateInviteRequest): Promise<BTLInvite> {
    const response = await apiClient.post<BTLInvite>('/between-the-lines/invites', data);
    return response.data;
  },

  /**
   * Accept BTL invite
   */
  async acceptInvite(inviteId: string): Promise<BTLThread> {
    const response = await apiClient.post<BTLThread>(
      `/between-the-lines/invites/${inviteId}/accept`
    );
    return response.data;
  },

  /**
   * Decline BTL invite
   */
  async declineInvite(inviteId: string): Promise<void> {
    await apiClient.post(`/between-the-lines/invites/${inviteId}/decline`);
  },

  /**
   * Get all threads for current user
   */
  async getThreads(): Promise<BTLThread[]> {
    const response = await apiClient.get<BTLThread[]>('/between-the-lines/threads');
    return response.data;
  },

  /**
   * Get messages in a thread
   */
  async getMessages(threadId: string): Promise<BTLMessage[]> {
    const response = await apiClient.get<BTLMessage[]>(
      `/between-the-lines/threads/${threadId}/messages`
    );
    return response.data;
  },

  /**
   * Send message in thread
   */
  async sendMessage(threadId: string, data: SendMessageRequest): Promise<BTLMessage> {
    const response = await apiClient.post<BTLMessage>(
      `/between-the-lines/threads/${threadId}/messages`,
      data
    );
    return response.data;
  },

  /**
   * Close a thread
   */
  async closeThread(threadId: string): Promise<void> {
    await apiClient.post(`/between-the-lines/threads/${threadId}/close`);
  },

  /**
   * Get pins in a thread
   */
  async getPins(threadId: string): Promise<BTLPin[]> {
    const response = await apiClient.get<BTLPin[]>(
      `/between-the-lines/threads/${threadId}/pins`
    );
    return response.data;
  },

  /**
   * Create pin in thread
   */
  async createPin(threadId: string, data: CreatePinRequest): Promise<BTLPin> {
    const response = await apiClient.post<BTLPin>(
      `/between-the-lines/threads/${threadId}/pins`,
      data
    );
    return response.data;
  },
};
