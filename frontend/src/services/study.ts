/**
 * Study Service (Read-only for web)
 * 
 * Web app only displays drafts and notes, no editing
 */

import { apiClient } from '@/lib/api-client'

export interface Draft {
  id: string
  title: string
  created_at: string
  updated_at: string
  block_count: number
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export const studyService = {
  /**
   * Get user's drafts
   */
  async getDrafts(): Promise<Draft[]> {
    return apiClient.get<Draft[]>('/study/drafts')
  },

  /**
   * Get user's notes
   */
  async getNotes(): Promise<Note[]> {
    return apiClient.get<Note[]>('/study/notes')
  },
}
