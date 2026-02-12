import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConvex, useConvexAuth } from 'convex/react';

/** Deletes a resume via Convex and invalidates relevant queries. */
export function useDeleteResume() {
  const queryClient = useQueryClient();
  const convex = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return useMutation({
    mutationFn: async (id: Id<'resumes'>) => {
      if (isLoading || !isAuthenticated) {
        throw new Error('User not authenticated');
      }
      await convex.mutation(api.resumes.deleteResume, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    }
  });
}
