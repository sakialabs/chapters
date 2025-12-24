/**
 * User Settings Service
 * 
 * Handles user account and profile settings
 */

import { apiClient } from '@/lib/api-client'

export interface BookProfile {
  id: number
  user_id: number
  display_name: string | null
  bio: string | null
  cover_image_url: string | null
  is_private: boolean
}

export interface PasswordUpdateData {
  current_password: string
  new_password: string
}

export interface BookProfileUpdateData {
  display_name?: string
  bio?: string
  is_private?: boolean
}

export const userService = {
  /**
   * Update user password
   */
  async updatePassword(data: PasswordUpdateData): Promise<void> {
    await apiClient.put('/users/password', data)
  },

  /**
   * Get Book profile
   */
  async getBookProfile(): Promise<BookProfile> {
    return apiClient.get<BookProfile>('/users/book-profile')
  },

  /**
   * Update Book profile
   */
  async updateBookProfile(data: BookProfileUpdateData): Promise<BookProfile> {
    return apiClient.put<BookProfile>('/users/book-profile', data)
  },

  /**
   * Update avatar (preset)
   */
  async updateAvatar(avatarPath: string): Promise<{ message: string; avatar_url: string }> {
    return apiClient.post('/users/book-profile/avatar', {
      avatar_type: 'preset',
      avatar_path: avatarPath,
    })
  },

  /**
   * Upload custom avatar
   */
  async uploadCustomAvatar(file: File): Promise<{ message: string; avatar_url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('avatar_type', 'custom')

    return apiClient.post('/users/book-profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * Upload cover image
   */
  async uploadCoverImage(file: File): Promise<{ message: string; cover_url: string }> {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post('/users/book-profile/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
