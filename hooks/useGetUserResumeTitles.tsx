import { api } from '@/convex/_generated/api';
import { useQuery } from '@tanstack/react-query';
import { ConvexHttpClient } from 'convex/browser';

const convexClient = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export function useGetUserResumeTitles(userId?: string) {
  return useQuery({
    queryKey: ['resumeTitles', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await convexClient.query(api.resumes.listResumeTitles, {
        userId
      });
      return res.map((item) => ({
        id: item._id,
        title: item.title
      }));
    },
    enabled: !!userId
  });
}
