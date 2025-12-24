/**
 * API Client for Chapters Web App
 * 
 * Uses fetch with cookie-based authentication
 */

import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private getAuthToken(): string | undefined {
    return Cookies.get('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options

    // Build URL with query params
    let url = `${this.baseURL}${endpoint}`
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
      url += `?${searchParams.toString()}`
    }

    // Set headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    }

    // Add auth token if available
    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Make request
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    // Handle response
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { detail: response.statusText }
      }

      throw new APIError(
        errorData.detail || 'An error occurred',
        response.status,
        errorData
      )
    }

    // Return JSON if response has content
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T
    }

    return response.json()
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new APIClient(API_URL)

// Auth helpers
export const auth = {
  setToken(token: string) {
    Cookies.set('auth_token', token, {
      expires: 7, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
  },

  getToken(): string | undefined {
    return Cookies.get('auth_token')
  },

  removeToken() {
    Cookies.remove('auth_token')
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
