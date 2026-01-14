import { api } from '@/convex/_generated/api';
import { useQuery } from '@tanstack/react-query';
import { ConvexHttpClient } from 'convex/browser';

const convexClient = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

const convertConvexIdToId = (data: any) =>
  data.map((item: any) => ({
    ...item,
    id: item._id
  }));

export function useGetUserResume(userId?: string) {
  return useQuery({
    queryKey: ['resumes', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await convexClient.query(api.resumes.listResumes, { userId });
      return convertConvexIdToId(res);
    },
    enabled: !!userId
  });
}
