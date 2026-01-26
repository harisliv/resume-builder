import { api } from '@/convex/_generated/api';
import { useQuery } from '@tanstack/react-query';
import { useConvex, useConvexAuth } from 'convex/react';

export function useGetUserResumeTitles() {
  const convex = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();
  return useQuery({
    queryKey: ['resumeTitles'],
    queryFn: async () => {
      const res = await convex.query(api.resumes.listResumeTitles);
      return res.map((item) => ({
        id: item._id,
        title: item.title
      }));
    },
    enabled: isAuthenticated && !isLoading
  });
}
