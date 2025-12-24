/**
 * Study API Service
 * 
 * Handles drafts, notes, and footnotes
 */

import apiClient from './client';

export interface DraftBlock {
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

export interface Draft {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  blocks: DraftBlock[];
}

export interface DraftsResponse {
  drafts: Draft[];
  total: number;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  voice_memo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
}

export interface CreateDraftRequest {
  title?: string;
  blocks?: DraftBlock[];
}

export interface UpdateDraftRequest {
  title?: string;
  blocks?: DraftBlock[];
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
  voice_memo_url?: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  tags?: string[];
  voice_memo_url?: string;
}

export const studyApi = {
  /**
   * Get all user's drafts
   */
  async getDrafts(): Promise<DraftsResponse> {
    const response = await apiClient.get<DraftsResponse>('/study/drafts');
    return response.data;
  },

  /**
   * Get a single draft
   */
  async getDraft(draftId: string): Promise<Draft> {
    const response = await apiClient.get<Draft>(`/study/drafts/${draftId}`);
    return response.data;
  },

  /**
   * Create a new draft
   */
  async createDraft(data: CreateDraftRequest): Promise<Draft> {
    const response = await apiClient.post<Draft>('/study/drafts', data);
    return response.data;
  },

  /**
   * Update a draft
   */
  async updateDraft(draftId: string, data: UpdateDraftRequest): Promise<Draft> {
    const response = await apiClient.patch<Draft>(`/study/drafts/${draftId}`, data);
    return response.data;
  },

  /**
   * Delete a draft
   */
  async deleteDraft(draftId: string): Promise<void> {
    await apiClient.delete(`/study/drafts/${draftId}`);
  },

  /**
   * Promote draft to published chapter
   */
  async promoteDraft(draftId: string): Promise<{ chapter_id: string }> {
    const response = await apiClient.post<{ chapter_id: string }>(
      `/study/drafts/${draftId}/promote`
    );
    return response.data;
  },

  /**
   * Get all user's notes
   */
  async getNotes(): Promise<NotesResponse> {
    const response = await apiClient.get<NotesResponse>('/study/notes');
    return response.data;
  },

  /**
   * Get a single note
   */
  async getNote(noteId: string): Promise<Note> {
    const response = await apiClient.get<Note>(`/study/notes/${noteId}`);
    return response.data;
  },

  /**
   * Create a new note
   */
  async createNote(data: CreateNoteRequest): Promise<Note> {
    const response = await apiClient.post<Note>('/study/notes', data);
    return response.data;
  },

  /**
   * Update a note
   */
  async updateNote(noteId: string, data: UpdateNoteRequest): Promise<Note> {
    const response = await apiClient.patch<Note>(`/study/notes/${noteId}`, data);
    return response.data;
  },

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<void> {
    await apiClient.delete(`/study/notes/${noteId}`);
  },
};
