import { api } from '@/convex/_generated/api';
import { useQuery } from '@tanstack/react-query';
import { ConvexHttpClient } from 'convex/browser';
import type { Id } from '@/convex/_generated/dataModel';

const convexClient = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

const convertConvexIdToId = (data: any) =>
  data
    ? {
        ...data,
        id: data._id
      }
    : null;

export function useGetResumeById(resumeId?: Id<'resumes'>, userId?: string) {
  return useQuery({
    queryKey: ['resume', resumeId, userId],
    queryFn: async () => {
      if (!resumeId || !userId) return null;
      const res = await convexClient.query(api.resumes.getResumeById, {
        id: resumeId,
        userId
      });
      return convertConvexIdToId(res);
    },
    enabled: !!resumeId && !!userId
  });
}
