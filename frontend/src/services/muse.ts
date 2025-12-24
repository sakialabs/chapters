/**
 * Muse Service
 * 
 * Handles AI-powered writing assistance
 */

import { apiClient } from '@/lib/api-client'

export interface PromptRequest {
  context?: string
  notes?: string[]
}

export interface PromptResponse {
  prompts: string[]
}

export interface TitleSuggestionRequest {
  content: string
  mood?: string
  theme?: string
}

export interface TitleSuggestionResponse {
  titles: string[]
}

export interface RewriteRequest {
  text: string
  style?: string
  preserveVoice?: boolean
}

export interface RewriteResponse {
  original: string
  rewritten: string
}

export interface OnboardingPreferences {
  museMode: 'gentle' | 'on-demand' | 'quiet'
  expressionTypes: string[]
  tone: string[]
  completedAt: string
}

export const museService = {
  /**
   * Generate writing prompts
   */
  async generatePrompts(request: PromptRequest): Promise<PromptResponse> {
    return apiClient.post<PromptResponse>('/muse/prompts', request)
  },

  /**
   * Get title suggestions
   */
  async suggestTitles(request: TitleSuggestionRequest): Promise<TitleSuggestionResponse> {
    return apiClient.post<TitleSuggestionResponse>('/muse/title-suggestions', request)
  },

  /**
   * Rewrite text (tighten or change tone)
   */
  async rewriteText(request: RewriteRequest): Promise<RewriteResponse> {
    return apiClient.post<RewriteResponse>('/muse/rewrite', {
      text: request.text,
      style: request.style,
      preserve_voice: request.preserveVoice ?? true,
    })
  },

  /**
   * Save onboarding preferences
   */
  async saveOnboardingPreferences(preferences: OnboardingPreferences): Promise<void> {
    // Convert preferences to text format for backend
    const preferencesText = `
Interaction mode: ${preferences.museMode}
Expression types: ${preferences.expressionTypes.join(', ')}
Tone preferences: ${preferences.tone.join(', ')}
    `.trim()

    await apiClient.post('/muse/onboarding', null, {
      params: { preferences: preferencesText }
    })
  },

  /**
   * Get quiet picks (personalized recommendations)
   */
  async getQuietPicks(): Promise<any[]> {
    return apiClient.get<any[]>('/muse/quiet-picks')
  },

  /**
   * Get resonance score with another user
   */
  async getResonance(userId: number): Promise<{ userId: number; username: string; resonance: number }> {
    return apiClient.get(`/muse/resonance/${userId}`)
  },
}
