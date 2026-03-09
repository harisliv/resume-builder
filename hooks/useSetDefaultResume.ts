import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConvex, useConvexAuth } from 'convex/react';
import { toast } from 'sonner';

/** Sets a resume as the user's default via Convex and invalidates title cache. */
export function useSetDefaultResume() {
  const queryClient = useQueryClient();
  const convex = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return useMutation({
    mutationFn: async (id: Id<'resumes'>) => {
      if (isLoading || !isAuthenticated) {
        throw new Error('User not authenticated');
      }
      await convex.mutation(api.resumes.setDefaultResume, { id });
    },
    onError: () => {
      toast.error('Failed to set default resume');
    },
    onSuccess: () => {
      toast.success('Default resume updated');
      queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
    }
  });
}
