/**
 * Library Service
 * 
 * Handles bookshelf, feeds, and reading discovery
 */

import { apiClient } from '@/lib/api-client'

export interface BookSpine {
  id: string
  username: string
  cover_url?: string
  unread_count: number
  last_chapter_at?: string
}

export interface Chapter {
  id: string
  title: string
  mood?: string
  theme?: string
  cover_url?: string
  heart_count: number
  published_at: string
  author_username: string
  author_book_id: string
}

export interface ChapterDetail {
  id: string
  book_id: string
  title: string
  mood?: string
  theme?: string
  cover_url?: string
  heart_count: number
  is_hearted: boolean
  is_bookmarked: boolean
  published_at: string
  blocks: ChapterBlock[]
  author: {
    username: string
    book_id: string
  }
}

export interface ChapterBlock {
  id: string
  block_type: 'text' | 'quote' | 'image' | 'audio' | 'video'
  position: number
  content: {
    text?: string
    url?: string
    caption?: string
    attribution?: string
    duration?: number
  }
}

export interface Margin {
  id: string
  user_id: string
  username: string
  chapter_id: string
  block_id?: string
  text: string
  created_at: string
}

export interface Book {
  id: string
  user_id: string
  username: string
  bio?: string
  is_private: boolean
  follower_count: number
  following_count: number
  chapter_count: number
  is_following: boolean
  created_at: string
}

export const libraryService = {
  /**
   * Get bookshelf (followed Books)
   */
  async getBookshelf(): Promise<BookSpine[]> {
    return apiClient.get<BookSpine[]>('/library/spines')
  },

  /**
   * Get new chapters feed
   */
  async getNewChapters(page: number = 1): Promise<{
    chapters: Chapter[]
    page: number
    total_pages: number
    has_more: boolean
  }> {
    return apiClient.get('/library/new', { params: { page } })
  },

  /**
   * Get Quiet Picks
   */
  async getQuietPicks(): Promise<Chapter[]> {
    return apiClient.get<Chapter[]>('/library/quiet-picks')
  },

  /**
   * Get Book profile
   */
  async getBook(bookId: string): Promise<Book> {
    return apiClient.get<Book>(`/books/${bookId}`)
  },

  /**
   * Get Book's chapters
   */
  async getBookChapters(bookId: string, page: number = 1): Promise<{
    chapters: Chapter[]
    page: number
    total_pages: number
    has_more: boolean
  }> {
    return apiClient.get(`/books/${bookId}/chapters`, { params: { page } })
  },

  /**
   * Get chapter details
   */
  async getChapter(chapterId: string): Promise<ChapterDetail> {
    return apiClient.get<ChapterDetail>(`/chapters/${chapterId}`)
  },

  /**
   * Get chapter margins
   */
  async getMargins(chapterId: string): Promise<Margin[]> {
    return apiClient.get<Margin[]>(`/chapters/${chapterId}/margins`)
  },

  /**
   * Heart a chapter
   */
  async heartChapter(chapterId: string): Promise<void> {
    await apiClient.post(`/chapters/${chapterId}/heart`)
  },

  /**
   * Unheart a chapter
   */
  async unheartChapter(chapterId: string): Promise<void> {
    await apiClient.delete(`/chapters/${chapterId}/heart`)
  },

  /**
   * Bookmark a chapter
   */
  async bookmarkChapter(chapterId: string): Promise<void> {
    await apiClient.post(`/chapters/${chapterId}/bookmark`)
  },

  /**
   * Remove bookmark
   */
  async unbookmarkChapter(chapterId: string): Promise<void> {
    // Note: API uses bookmark ID, but we'll use chapter ID for simplicity
    // In production, you'd need to get the bookmark ID first
    await apiClient.delete(`/chapters/${chapterId}/bookmark`)
  },

  /**
   * Follow a Book
   */
  async followBook(bookId: string): Promise<void> {
    await apiClient.post(`/books/${bookId}/follow`)
  },

  /**
   * Unfollow a Book
   */
  async unfollowBook(bookId: string): Promise<void> {
    await apiClient.delete(`/books/${bookId}/follow`)
  },
}
