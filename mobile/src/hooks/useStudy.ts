/**
 * Study React Query Hooks
 * 
 * Custom hooks for drafts and notes
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  studyApi,
  Draft,
  DraftsResponse,
  Note,
  NotesResponse,
  CreateDraftRequest,
  UpdateDraftRequest,
  CreateNoteRequest,
  UpdateNoteRequest,
} from '@/services/api/study';

/**
 * Hook to fetch all drafts
 */
export const useDrafts = (): UseQueryResult<DraftsResponse> => {
  return useQuery<DraftsResponse>({
    queryKey: ['drafts'],
    queryFn: studyApi.getDrafts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single draft
 */
export const useDraft = (draftId: string): UseQueryResult<Draft> => {
  return useQuery<Draft>({
    queryKey: ['draft', draftId],
    queryFn: () => studyApi.getDraft(draftId),
    enabled: !!draftId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to create a draft
 */
export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDraftRequest) => studyApi.createDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });
};

/**
 * Hook to update a draft
 */
export const useUpdateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ draftId, data }: { draftId: string; data: UpdateDraftRequest }) =>
      studyApi.updateDraft(draftId, data),
    onSuccess: (updatedDraft) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      queryClient.setQueryData(['draft', updatedDraft.id], updatedDraft);
    },
  });
};

/**
 * Hook to delete a draft
 */
export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftId: string) => studyApi.deleteDraft(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
  });
};

/**
 * Hook to promote draft to chapter
 */
export const usePromoteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftId: string) => studyApi.promoteDraft(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
};

/**
 * Hook to fetch all notes
 */
export const useNotes = (): UseQueryResult<NotesResponse> => {
  return useQuery<NotesResponse>({
    queryKey: ['notes'],
    queryFn: studyApi.getNotes,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to fetch a single note
 */
export const useNote = (noteId: string): UseQueryResult<Note> => {
  return useQuery<Note>({
    queryKey: ['note', noteId],
    queryFn: () => studyApi.getNote(noteId),
    enabled: !!noteId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to create a note
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteRequest) => studyApi.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

/**
 * Hook to update a note
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: UpdateNoteRequest }) =>
      studyApi.updateNote(noteId, data),
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.setQueryData(['note', updatedNote.id], updatedNote);
    },
  });
};

/**
 * Hook to delete a note
 */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => studyApi.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
