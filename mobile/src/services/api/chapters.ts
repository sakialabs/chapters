/**
 * Chapters API Service
 * 
 * Handles chapter reading, engagement, and margins
 */

import apiClient from './client';

export interface ChapterBlock {
  id: string;
  block_type: 'text' | 'image' | 'audio' | 'video' | 'quote';
  position: number;
  content: {
    text?: string;
    url?: string;
    caption?: string;
    attribution?: string;
    duration?: number;
  };
}

export interface Chapter {
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
  is_hearted: boolean;
  is_bookmarked: boolean;
  blocks: ChapterBlock[];
}

export interface Margin {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  chapter_id: string;
  block_id: string | null;
  text: string;
  created_at: string;
}

export interface MarginsResponse {
  margins: Margin[];
  total: number;
}

export const chaptersApi = {
  /**
   * Get a single chapter with all blocks
   */
  async getChapter(chapterId: string): Promise<Chapter> {
    const response = await apiClient.get<Chapter>(`/chapters/${chapterId}`);
    return response.data;
  },

  /**
   * Get margins for a chapter
   */
  async getMargins(chapterId: string): Promise<MarginsResponse> {
    const response = await apiClient.get<MarginsResponse>(
      `/chapters/${chapterId}/margins`
    );
    return response.data;
  },

  /**
   * Heart a chapter
   */
  async heartChapter(chapterId: string): Promise<void> {
    await apiClient.post(`/chapters/${chapterId}/heart`);
  },

  /**
   * Unheart a chapter
   */
  async unheartChapter(chapterId: string): Promise<void> {
    await apiClient.delete(`/chapters/${chapterId}/heart`);
  },

  /**
   * Bookmark a chapter
   */
  async bookmarkChapter(chapterId: string): Promise<void> {
    await apiClient.post(`/chapters/${chapterId}/bookmark`);
  },

  /**
   * Remove bookmark from a chapter
   */
  async unbookmarkChapter(bookmarkId: string): Promise<void> {
    await apiClient.delete(`/bookmarks/${bookmarkId}`);
  },

  /**
   * Create a margin (comment)
   */
  async createMargin(
    chapterId: string,
    text: string,
    blockId?: string
  ): Promise<Margin> {
    const response = await apiClient.post<Margin>(
      `/chapters/${chapterId}/margins`,
      { text, block_id: blockId }
    );
    return response.data;
  },

  /**
   * Delete a margin
   */
  async deleteMargin(marginId: string): Promise<void> {
    await apiClient.delete(`/margins/${marginId}`);
  },
};
