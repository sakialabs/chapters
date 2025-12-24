/**
 * API Types - TypeScript interfaces for API requests/responses
 */

// Auth
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  open_pages: number;
  created_at: string;
  book?: Book;
}

// Book
export interface Book {
  id: number;
  user_id: number;
  title?: string;
  bio?: string;
  cover_url?: string;
  is_private: boolean;
  follower_count: number;
  created_at: string;
}

// Chapter
export interface Chapter {
  id: number;
  author_id: number;
  title?: string;
  mood?: string;
  theme?: string;
  cover_url?: string;
  heart_count: number;
  published_at: string;
  edit_window_expires?: string;
  blocks: ChapterBlock[];
  author?: User;
}

export interface ChapterBlock {
  id: number;
  chapter_id: number;
  position: number;
  block_type: 'text' | 'image' | 'audio' | 'video' | 'quote';
  content: Record<string, any>;
}

export interface CreateChapterRequest {
  title?: string;
  mood?: string;
  theme?: string;
  blocks: Omit<ChapterBlock, 'id' | 'chapter_id'>[];
}

// Draft
export interface Draft {
  id: number;
  user_id: number;
  title?: string;
  created_at: string;
  updated_at: string;
  blocks: DraftBlock[];
}

export interface DraftBlock {
  id: number;
  draft_id: number;
  position: number;
  block_type: 'text' | 'image' | 'audio' | 'video' | 'quote';
  content: Record<string, any>;
}

// Note
export interface Note {
  id: number;
  user_id: number;
  title?: string;
  content: string;
  tags: string[];
  voice_memo_url?: string;
  created_at: string;
  updated_at: string;
}

// Engagement
export interface Follow {
  id: number;
  follower_id: number;
  followed_id: number;
  created_at: string;
}

export interface Heart {
  id: number;
  user_id: number;
  chapter_id: number;
  created_at: string;
}

export interface Bookmark {
  id: number;
  user_id: number;
  chapter_id: number;
  created_at: string;
  chapter?: Chapter;
}

// Margin (Comment)
export interface Margin {
  id: number;
  user_id: number;
  chapter_id: number;
  block_id?: number;
  content: string;
  created_at: string;
  user?: User;
}

// Library
export interface Spine {
  book: Book;
  unread_count: number;
  last_chapter_at?: string;
}

export interface FeedResponse {
  chapters: Chapter[];
  page: number;
  per_page: number;
  total: number;
  has_more: boolean;
}

// Between the Lines
export interface BTLThread {
  id: number;
  participant1_id: number;
  participant2_id: number;
  status: 'open' | 'closed';
  created_at: string;
  closed_at?: string;
  participant1?: User;
  participant2?: User;
}

export interface BTLInvite {
  id: number;
  sender_id: number;
  recipient_id: number;
  note?: string;
  quoted_line?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  sender?: User;
}

export interface BTLMessage {
  id: number;
  thread_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  sender?: User;
}

// Muse
export interface MusePromptResponse {
  prompts: string[];
}

export interface MuseTitleResponse {
  titles: string[];
}

export interface MuseRewriteResponse {
  rewritten_text: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

// Error
export interface APIError {
  detail: string;
  error_code?: string;
}
