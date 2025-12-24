/**
 * Library API Service
 * 
 * Handles bookshelf, new chapters feed, and quiet picks
 */

import apiClient from './client';

export interface BookSpine {
  book_id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  unread_count: number;
  last_chapter_at: string;
}

export interface SpinesResponse {
  spines: BookSpine[];
  total: number;
}

export interface ChapterPreview {
  id: string;
  book_id: string;
  author_name: string;
  author_avatar: string | null;
  title: string;
  mood: string | null;
  theme: string | null;
  cover_url: string | null;
  published_at: string;
  heart_count: number;
  margin_count: number;
}

export interface NewChaptersResponse {
  chapters: ChapterPreview[];
  page: number;
  total_pages: number;
  has_more: boolean;
  total: number;
}

export interface QuietPicksResponse {
  picks: ChapterPreview[];
  refreshes_at: string;
}

export const libraryApi = {
  /**
   * Get bookshelf spines (followed Books with unread indicators)
   */
  async getSpines(): Promise<SpinesResponse> {
    const response = await apiClient.get<SpinesResponse>('/library/spines');
    return response.data;
  },

  /**
   * Get new chapters from followed Books
   * 
   * @param page - Page number (1-indexed)
   * @param limit - Chapters per page (default 20, max 100 total)
   */
  async getNewChapters(page: number = 1, limit: number = 20): Promise<NewChaptersResponse> {
    const response = await apiClient.get<NewChaptersResponse>('/library/new', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get daily personalized recommendations (Quiet Picks)
   * 
   * Returns max 5 chapters based on taste, not popularity
   */
  async getQuietPicks(): Promise<QuietPicksResponse> {
    const response = await apiClient.get<QuietPicksResponse>('/library/quiet-picks');
    return response.data;
  },

  /**
   * Get chapters from a specific Book
   * 
   * @param bookId - Book ID
   * @param page - Page number
   * @param limit - Chapters per page
   */
  async getBookChapters(
    bookId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<NewChaptersResponse> {
    const response = await apiClient.get<NewChaptersResponse>(
      `/library/books/${bookId}/chapters`,
      { params: { page, limit } }
    );
    return response.data;
  },
};
