/**
 * Chapter React Query Hooks
 * 
 * Custom hooks for chapter data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { chaptersApi, Chapter, MarginsResponse } from '@/services/api/chapters';

/**
 * Hook to fetch a single chapter
 */
export const useChapter = (chapterId: string): UseQueryResult<Chapter> => {
  return useQuery<Chapter>({
    queryKey: ['chapter', chapterId],
    queryFn: () => chaptersApi.getChapter(chapterId),
    enabled: !!chapterId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch chapter margins
 */
export const useMargins = (chapterId: string): UseQueryResult<MarginsResponse> => {
  return useQuery<MarginsResponse>({
    queryKey: ['margins', chapterId],
    queryFn: () => chaptersApi.getMargins(chapterId),
    enabled: !!chapterId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to heart/unheart a chapter
 */
export const useHeartChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chapterId, isHearted }: { chapterId: string; isHearted: boolean }) => {
      if (isHearted) {
        await chaptersApi.unheartChapter(chapterId);
      } else {
        await chaptersApi.heartChapter(chapterId);
      }
    },
    onMutate: async ({ chapterId, isHearted }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['chapter', chapterId] });
      
      const previousChapter = queryClient.getQueryData<Chapter>(['chapter', chapterId]);
      
      if (previousChapter) {
        queryClient.setQueryData<Chapter>(['chapter', chapterId], {
          ...previousChapter,
          is_hearted: !isHearted,
          heart_count: isHearted ? previousChapter.heart_count - 1 : previousChapter.heart_count + 1,
        });
      }
      
      return { previousChapter };
    },
    onError: (err, { chapterId }, context) => {
      // Rollback on error
      if (context?.previousChapter) {
        queryClient.setQueryData(['chapter', chapterId], context.previousChapter);
      }
    },
    onSettled: (data, error, { chapterId }) => {
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] });
    },
  });
};

/**
 * Hook to bookmark/unbookmark a chapter
 */
export const useBookmarkChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      chapterId, 
      isBookmarked, 
      bookmarkId 
    }: { 
      chapterId: string; 
      isBookmarked: boolean;
      bookmarkId?: string;
    }) => {
      if (isBookmarked && bookmarkId) {
        await chaptersApi.unbookmarkChapter(bookmarkId);
      } else {
        await chaptersApi.bookmarkChapter(chapterId);
      }
    },
    onMutate: async ({ chapterId, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: ['chapter', chapterId] });
      
      const previousChapter = queryClient.getQueryData<Chapter>(['chapter', chapterId]);
      
      if (previousChapter) {
        queryClient.setQueryData<Chapter>(['chapter', chapterId], {
          ...previousChapter,
          is_bookmarked: !isBookmarked,
        });
      }
      
      return { previousChapter };
    },
    onError: (err, { chapterId }, context) => {
      if (context?.previousChapter) {
        queryClient.setQueryData(['chapter', chapterId], context.previousChapter);
      }
    },
    onSettled: (data, error, { chapterId }) => {
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] });
      queryClient.invalidateQueries({ queryKey: ['library', 'bookmarks'] });
    },
  });
};

/**
 * Hook to create a margin
 */
export const useCreateMargin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      chapterId, 
      text, 
      blockId 
    }: { 
      chapterId: string; 
      text: string; 
      blockId?: string;
    }) => chaptersApi.createMargin(chapterId, text, blockId),
    onSuccess: (data, { chapterId }) => {
      queryClient.invalidateQueries({ queryKey: ['margins', chapterId] });
      queryClient.invalidateQueries({ queryKey: ['chapter', chapterId] });
    },
  });
};

/**
 * Hook to delete a margin
 */
export const useDeleteMargin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (marginId: string) => chaptersApi.deleteMargin(marginId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['margins'] });
    },
  });
};
