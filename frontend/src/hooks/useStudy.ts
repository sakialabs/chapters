/**
 * Study React Query Hooks
 */

import { useQuery } from '@tanstack/react-query'
import { studyService } from '@/services/study'

export function useDrafts() {
  return useQuery({
    queryKey: ['drafts'],
    queryFn: () => studyService.getDrafts(),
  })
}

export function useNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: () => studyService.getNotes(),
  })
}
