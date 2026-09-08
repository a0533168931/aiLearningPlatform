import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { create, getById, getHistory } from '../api/prompts.api';
import { isPositiveId, queryKeys } from '../api/queryKeys';
import { useAuthStore } from '../store/authStore';
import type { CreatePromptRequest } from '../types/prompt';

export function usePromptHistory(userId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.promptHistory(userId),
    queryFn: () => {
      if (!isPositiveId(userId)) {
        return Promise.resolve([]);
      }

      return getHistory(userId);
    },
    enabled: isPositiveId(userId),
  });
}

export function usePrompt(promptId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.prompt(isPositiveId(promptId) ? promptId : 0),
    queryFn: () => {
      if (!isPositiveId(promptId)) {
        return Promise.reject(new Error('Invalid prompt id'));
      }

      return getById(promptId);
    },
    enabled: isPositiveId(promptId),
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: (input: CreatePromptRequest) => create(input),
    onSuccess: () => {
      if (isPositiveId(userId)) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.promptHistory(userId),
        });
      }
    },
  });
}
