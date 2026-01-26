import { api } from '@/convex/_generated/api';
import { useQuery } from '@tanstack/react-query';
import { useConvex, useConvexAuth } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { convertConvexIdToId } from '@/lib/utils';
import { resumeDefaultValues } from '@/types';

export function useGetResumeById(resumeId?: Id<'resumes'>) {
  const convex = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();
  return useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async () => {
      if (!resumeId) return resumeDefaultValues;
      const res = await convex.query(api.resumes.getResumeById, {
        id: resumeId
      });
      return convertConvexIdToId(res);
    },
    enabled: Boolean(resumeId) && isAuthenticated && !isLoading
  });
}
