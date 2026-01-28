import { api } from '@/convex/_generated/api';
import { convertConvexIdToId } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useConvex, useConvexAuth } from 'convex/react';

export function useGetUserResume() {
  const convex = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await convex.query(api.resumes.listResumes);
      return res.map(convertConvexIdToId);
    },
    enabled: isAuthenticated && !isLoading
  });
}
