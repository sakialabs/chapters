/**
 * Library React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { libraryService } from '@/services/library'

export function useBookshelf() {
  return useQuery({
    queryKey: ['bookshelf'],
    queryFn: () => libraryService.getBookshelf(),
  })
}

export function useNewChapters(page: number = 1) {
  return useQuery({
    queryKey: ['new-chapters', page],
    queryFn: () => libraryService.getNewChapters(page),
  })
}

export function useQuietPicks() {
  return useQuery({
    queryKey: ['quiet-picks'],
    queryFn: () => libraryService.getQuietPicks(),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useBook(bookId: string) {
  return useQuery({
    queryKey: ['books', bookId],
    queryFn: () => libraryService.getBook(bookId),
    enabled: !!bookId,
  })
}

export function useBookChapters(bookId: string, page: number = 1) {
  return useQuery({
    queryKey: ['books', bookId, 'chapters', page],
    queryFn: () => libraryService.getBookChapters(bookId, page),
    enabled: !!bookId,
  })
}

export function useChapter(chapterId: string) {
  return useQuery({
    queryKey: ['chapters', chapterId],
    queryFn: () => libraryService.getChapter(chapterId),
    enabled: !!chapterId,
  })
}

export function useMargins(chapterId: string) {
  return useQuery({
    queryKey: ['chapters', chapterId, 'margins'],
    queryFn: () => libraryService.getMargins(chapterId),
    enabled: !!chapterId,
  })
}

export function useHeartChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chapterId, isHearted }: { chapterId: string; isHearted: boolean }) =>
      isHearted
        ? libraryService.unheartChapter(chapterId)
        : libraryService.heartChapter(chapterId),
    onSuccess: (_data, { chapterId }) => {
      queryClient.invalidateQueries({ queryKey: ['chapters', chapterId] })
      queryClient.invalidateQueries({ queryKey: ['new-chapters'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

export function useBookmarkChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ chapterId, isBookmarked }: { chapterId: string; isBookmarked: boolean }) =>
      isBookmarked
        ? libraryService.unbookmarkChapter(chapterId)
        : libraryService.bookmarkChapter(chapterId),
    onSuccess: (_data, { chapterId }) => {
      queryClient.invalidateQueries({ queryKey: ['chapters', chapterId] })
    },
  })
}

export function useFollowBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookId, isFollowing }: { bookId: string; isFollowing: boolean }) =>
      isFollowing
        ? libraryService.unfollowBook(bookId)
        : libraryService.followBook(bookId),
    onSuccess: (_data, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ['books', bookId] })
      queryClient.invalidateQueries({ queryKey: ['bookshelf'] })
    },
  })
}
