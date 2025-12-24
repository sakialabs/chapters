/**
 * Between the Lines React Query Hooks
 * 
 * Custom hooks for BTL invites, threads, and messages
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  btlApi,
  CreateInviteRequest,
  SendMessageRequest,
  CreatePinRequest,
} from '@/services/api/btl';

/**
 * Hook to get pending invites
 */
export const useGetInvites = () => {
  return useQuery({
    queryKey: ['btl', 'invites'],
    queryFn: () => btlApi.getInvites(),
  });
};

/**
 * Hook to send BTL invite
 */
export const useSendInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInviteRequest) => btlApi.sendInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl', 'invites'] });
    },
  });
};

/**
 * Hook to accept invite
 */
export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => btlApi.acceptInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl', 'invites'] });
      queryClient.invalidateQueries({ queryKey: ['btl', 'threads'] });
    },
  });
};

/**
 * Hook to decline invite
 */
export const useDeclineInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => btlApi.declineInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl', 'invites'] });
    },
  });
};

/**
 * Hook to get threads
 */
export const useGetThreads = () => {
  return useQuery({
    queryKey: ['btl', 'threads'],
    queryFn: () => btlApi.getThreads(),
  });
};

/**
 * Hook to get messages in a thread
 */
export const useGetMessages = (threadId: string) => {
  return useQuery({
    queryKey: ['btl', 'threads', threadId, 'messages'],
    queryFn: () => btlApi.getMessages(threadId),
    enabled: !!threadId,
  });
};

/**
 * Hook to send message
 */
export const useSendMessage = (threadId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) => btlApi.sendMessage(threadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl', 'threads', threadId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['btl', 'threads'] });
    },
  });
};

/**
 * Hook to close thread
 */
export const useCloseThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (threadId: string) => btlApi.closeThread(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl', 'threads'] });
    },
  });
};

/**
 * Hook to get pins in a thread
 */
export const useGetPins = (threadId: string) => {
  return useQuery({
    queryKey: ['btl', 'threads', threadId, 'pins'],
    queryFn: () => btlApi.getPins(threadId),
    enabled: !!threadId,
  });
};

/**
 * Hook to create pin
 */
export const useCreatePin = (threadId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePinRequest) => btlApi.createPin(threadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl', 'threads', threadId, 'pins'] });
    },
  });
};
