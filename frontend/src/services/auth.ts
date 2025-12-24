/**
 * Authentication Service
 * 
 * Handles user authentication and registration
 */

import { apiClient, auth } from '@/lib/api-client'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: {
    id: string
    email: string
    username: string
    book_id: string
  }
}

export const authService = {
  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    
    // Store token in cookies
    auth.setToken(response.access_token)
    
    return response
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    
    // Store token in cookies
    auth.setToken(response.access_token)
    
    return response
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Try to call logout endpoint, but don't throw if it fails
      // (token might already be invalid)
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Silently handle logout errors - we're removing the token anyway
      console.debug('Logout API call failed, but continuing with local cleanup')
    } finally {
      // Always remove token, even if API call fails
      auth.removeToken()
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return auth.isAuthenticated()
  },
}
