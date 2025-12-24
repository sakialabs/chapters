/**
 * Muse AI React Query Hooks
 * 
 * Custom hooks for AI writing assistance
 */

import { useMutation } from '@tanstack/react-query';
import {
  museApi,
  PromptRequest,
  TitleSuggestionsRequest,
  RewriteRequest,
} from '@/services/api/muse';

/**
 * Hook to get writing prompts
 */
export const useGetPrompts = () => {
  return useMutation({
    mutationFn: (data: PromptRequest) => museApi.getPrompts(data),
  });
};

/**
 * Hook to get title suggestions
 */
export const useGetTitleSuggestions = () => {
  return useMutation({
    mutationFn: (data: TitleSuggestionsRequest) => museApi.getTitleSuggestions(data),
  });
};

/**
 * Hook to rewrite text
 */
export const useRewriteText = () => {
  return useMutation({
    mutationFn: (data: RewriteRequest) => museApi.rewriteText(data),
  });
};
