/**
 * Books (Profile) API Service
 * 
 * Handles user profiles and Book management
 */

import apiClient from './client';

export interface Book {
  id: string;
  user_id: string;
  username: string;
  bio?: string;
  is_private: boolean;
  follower_count: number;
  following_count: number;
  chapter_count: number;
  created_at: string;
}

export interface BookChapter {
  id: string;
  title: string;
  mood?: string;
  theme?: string;
  cover_url?: string;
  heart_count: number;
  published_at: string;
}

export interface UpdateBookRequest {
  bio?: string;
  is_private?: boolean;
}

export interface BlockedUser {
  id: string;
  blocked_user_id: string;
  blocked_username: string;
  created_at: string;
}

export const booksApi = {
  /**
   * Get Book profile
   */
  async getBook(bookId: string): Promise<Book> {
    const response = await apiClient.get<Book>(`/books/${bookId}`);
    return response.data;
  },

  /**
   * Get current user's Book
   */
  async getMyBook(): Promise<Book> {
    const response = await apiClient.get<Book>('/books/me');
    return response.data;
  },

  /**
   * Update Book profile
   */
  async updateBook(bookId: string, data: UpdateBookRequest): Promise<Book> {
    const response = await apiClient.patch<Book>(`/books/${bookId}`, data);
    return response.data;
  },

  /**
   * Get Book's chapters
   */
  async getBookChapters(bookId: string, page: number = 1): Promise<{
    chapters: BookChapter[];
    page: number;
    total_pages: number;
    has_more: boolean;
  }> {
    const response = await apiClient.get(`/books/${bookId}/chapters`, {
      params: { page },
    });
    return response.data;
  },

  /**
   * Get blocked users
   */
  async getBlockedUsers(): Promise<BlockedUser[]> {
    const response = await apiClient.get<BlockedUser[]>('/moderation/blocks');
    return response.data;
  },

  /**
   * Block a user
   */
  async blockUser(userId: string): Promise<void> {
    await apiClient.post('/moderation/blocks', { blocked_user_id: userId });
  },

  /**
   * Unblock a user
   */
  async unblockUser(userId: string): Promise<void> {
    await apiClient.delete(`/moderation/blocks/${userId}`);
  },
};
