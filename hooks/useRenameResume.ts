import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConvex, useConvexAuth } from 'convex/react';

/** Renames a resume title via Convex with optimistic cache update. */
export function useRenameResume() {
  const queryClient = useQueryClient();
  const convex = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return useMutation({
    mutationFn: async ({ id, title }: { id: Id<'resumes'>; title: string }) => {
      if (isLoading || !isAuthenticated) {
        throw new Error('User not authenticated');
      }
      await convex.mutation(api.resumes.renameResume, { id, title });
    },
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: ['resumeTitles'] });
      const previous = queryClient.getQueryData<{ id: string; title: string }[]>(['resumeTitles']);
      queryClient.setQueryData<{ id: string; title: string }[]>(
        ['resumeTitles'],
        (old) => old?.map((r) => (r.id === id ? { ...r, title } : r))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['resumeTitles'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    }
  });
}
