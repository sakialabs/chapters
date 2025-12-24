/**
 * Books React Query Hooks
 * 
 * Custom hooks for Book profiles and settings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi, UpdateBookRequest } from '@/services/api/books';

/**
 * Hook to get a Book profile
 */
export const useGetBook = (bookId: string) => {
  return useQuery({
    queryKey: ['books', bookId],
    queryFn: () => booksApi.getBook(bookId),
    enabled: !!bookId,
  });
};

/**
 * Hook to get current user's Book
 */
export const useGetMyBook = () => {
  return useQuery({
    queryKey: ['books', 'me'],
    queryFn: () => booksApi.getMyBook(),
  });
};

/**
 * Hook to update Book profile
 */
export const useUpdateBook = (bookId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBookRequest) => booksApi.updateBook(bookId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books', 'me'] });
    },
  });
};

/**
 * Hook to get Book's chapters
 */
export const useGetBookChapters = (bookId: string, page: number = 1) => {
  return useQuery({
    queryKey: ['books', bookId, 'chapters', page],
    queryFn: () => booksApi.getBookChapters(bookId, page),
    enabled: !!bookId,
  });
};

/**
 * Hook to get blocked users
 */
export const useGetBlockedUsers = () => {
  return useQuery({
    queryKey: ['moderation', 'blocks'],
    queryFn: () => booksApi.getBlockedUsers(),
  });
};

/**
 * Hook to block a user
 */
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => booksApi.blockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation', 'blocks'] });
    },
  });
};

/**
 * Hook to unblock a user
 */
export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => booksApi.unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation', 'blocks'] });
    },
  });
};
