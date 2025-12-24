/**
 * Muse React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { museService, PromptRequest, TitleSuggestionRequest, RewriteRequest, OnboardingPreferences } from '@/services/muse'

export function useGeneratePrompts() {
  return useMutation({
    mutationFn: (request: PromptRequest) => museService.generatePrompts(request),
  })
}

export function useSuggestTitles() {
  return useMutation({
    mutationFn: (request: TitleSuggestionRequest) => museService.suggestTitles(request),
  })
}

export function useRewriteText() {
  return useMutation({
    mutationFn: (request: RewriteRequest) => museService.rewriteText(request),
  })
}

export function useSaveOnboardingPreferences() {
  return useMutation({
    mutationFn: (preferences: OnboardingPreferences) => museService.saveOnboardingPreferences(preferences),
  })
}

export function useQuietPicks() {
  return useQuery({
    queryKey: ['quiet-picks'],
    queryFn: () => museService.getQuietPicks(),
    staleTime: 1000 * 60 * 60, // 1 hour - picks refresh slowly
  })
}

export function useResonance(userId: number) {
  return useQuery({
    queryKey: ['resonance', userId],
    queryFn: () => museService.getResonance(userId),
    enabled: !!userId,
  })
}
