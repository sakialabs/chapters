/**
 * Between the Lines React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { btlService } from '@/services/btl'

export function useBTLEligibility(bookId: string) {
  return useQuery({
    queryKey: ['btl-eligibility', bookId],
    queryFn: () => btlService.checkEligibility(bookId),
    enabled: !!bookId,
  })
}

export function usePendingInvites() {
  return useQuery({
    queryKey: ['btl-invites'],
    queryFn: () => btlService.getPendingInvites(),
  })
}

export function useSendInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      toBookId: string
      message: string
      chapterExcerpt?: string
    }) => btlService.sendInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl-invites'] })
    },
  })
}

export function useAcceptInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => btlService.acceptInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl-invites'] })
      queryClient.invalidateQueries({ queryKey: ['btl-conversations'] })
    },
  })
}

export function useDeclineInvite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => btlService.declineInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl-invites'] })
    },
  })
}

export function useConversations() {
  return useQuery({
    queryKey: ['btl-conversations'],
    queryFn: () => btlService.getConversations(),
  })
}

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: ['btl-messages', conversationId],
    queryFn: () => btlService.getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      btlService.sendMessage(conversationId, content),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['btl-messages', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['btl-conversations'] })
    },
  })
}

export function useCloseConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) => btlService.closeConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btl-conversations'] })
    },
  })
}
