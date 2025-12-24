/**
 * Library React Query Hooks
 * 
 * Custom hooks for library data fetching
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { 
  libraryApi, 
  SpinesResponse, 
  NewChaptersResponse, 
  QuietPicksResponse 
} from '@/services/api/library';

/**
 * Hook to fetch bookshelf spines
 * 
 * Fetches all followed Books with unread indicators
 */
export const useBookshelf = (): UseQueryResult<SpinesResponse> => {
  return useQuery({
    queryKey: ['library', 'spines'],
    queryFn: libraryApi.getSpines,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch new chapters feed
 * 
 * @param page - Page number (1-indexed)
 * @param limit - Chapters per page
 */
export const useNewChapters = (
  page: number = 1,
  limit: number = 20
): UseQueryResult<NewChaptersResponse> => {
  return useQuery<NewChaptersResponse>({
    queryKey: ['library', 'new', page, limit],
    queryFn: () => libraryApi.getNewChapters(page, limit),
    placeholderData: (previousData: NewChaptersResponse | undefined) => previousData, // Keep previous data while fetching new page
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to fetch Quiet Picks (daily recommendations)
 * 
 * Returns max 5 personalized chapters based on taste
 */
export const useQuietPicks = (): UseQueryResult<QuietPicksResponse> => {
  return useQuery({
    queryKey: ['library', 'quiet-picks'],
    queryFn: libraryApi.getQuietPicks,
    staleTime: 1000 * 60 * 60, // 1 hour (refreshes daily)
  });
};

/**
 * Hook to fetch chapters from a specific Book
 * 
 * @param bookId - Book ID
 * @param page - Page number
 * @param limit - Chapters per page
 */
export const useBookChapters = (
  bookId: string,
  page: number = 1,
  limit: number = 20
): UseQueryResult<NewChaptersResponse> => {
  return useQuery<NewChaptersResponse>({
    queryKey: ['library', 'book', bookId, 'chapters', page, limit],
    queryFn: () => libraryApi.getBookChapters(bookId, page, limit),
    placeholderData: (previousData: NewChaptersResponse | undefined) => previousData,
    enabled: !!bookId, // Only fetch if bookId is provided
  });
};
