/**
 * Muse AI API Service
 * 
 * Handles AI-powered writing assistance
 */

import apiClient from './client';

export interface PromptRequest {
  context?: string;
  notes?: string[];
}

export interface PromptsResponse {
  prompts: string[];
}

export interface TitleSuggestionsRequest {
  content: string;
}

export interface TitleSuggestionsResponse {
  suggestions: string[];
}

export interface RewriteRequest {
  text: string;
  style?: 'formal' | 'casual' | 'poetic' | 'concise' | 'elaborate';
}

export interface RewriteResponse {
  rewritten_text: string;
}

export const museApi = {
  /**
   * Get writing prompts based on context
   */
  async getPrompts(data: PromptRequest): Promise<PromptsResponse> {
    const response = await apiClient.post<PromptsResponse>('/muse/prompts', data);
    return response.data;
  },

  /**
   * Get title suggestions for content
   */
  async getTitleSuggestions(data: TitleSuggestionsRequest): Promise<TitleSuggestionsResponse> {
    const response = await apiClient.post<TitleSuggestionsResponse>(
      '/muse/title-suggestions',
      data
    );
    return response.data;
  },

  /**
   * Rewrite text with specified style
   */
  async rewriteText(data: RewriteRequest): Promise<RewriteResponse> {
    const response = await apiClient.post<RewriteResponse>('/muse/rewrite', data);
    return response.data;
  },
};
