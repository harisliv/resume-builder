import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeData } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import type { User } from '@workos-inc/node';
import { ConvexHttpClient } from 'convex/browser';

const convexClient = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

async function submitResume(data: TResumeData, user: User | null) {
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  const {
    id,
    title,
    personalInfo,
    experience,
    education,
    skills,
    documentStyle
  } = data;

  if (id) {
    await convexClient.mutation(api.resumes.updateResume, {
      id: id as Id<'resumes'>,
      userId: user.id,
      title,
      personalInfo,
      experience,
      education,
      skills,
      documentStyle
    });
    return { success: true, id: id as Id<'resumes'> };
  } else {
    const resumeId = await convexClient.mutation(api.resumes.createResume, {
      userId: user.id,
      title,
      personalInfo,
      experience,
      education,
      skills,
      documentStyle
    });
    return { success: true, id: resumeId };
  }
}

export function useResumeSubmit() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (data: TResumeData) => submitResume(data, user),
    onSuccess: (
      _data: { success: boolean; id: Id<'resumes'> },
      variables: TResumeData
    ) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: ['resumes', variables.userId]
        });
      }
    }
  });
}
