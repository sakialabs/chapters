/**
 * Auth API - Authentication endpoints
 */
import apiClient, { storeTokens, clearTokens } from './client';
import { RegisterRequest, LoginRequest, AuthResponse, User } from './types';

export const authAPI = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Store tokens
    await storeTokens(response.data.access_token, response.data.refresh_token);
    
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    // Store tokens
    await storeTokens(response.data.access_token, response.data.refresh_token);
    
    return response.data;
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Logout - clear tokens
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear tokens, even if API call fails
      await clearTokens();
    }
  },
};
