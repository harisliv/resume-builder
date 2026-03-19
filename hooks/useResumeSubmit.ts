import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeData } from '@/types/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConvex, useConvexAuth } from 'convex/react';
import { toast } from 'sonner';

async function submitResume(
  convex: ReturnType<typeof useConvex>,
  data: TResumeData
): Promise<{ success: boolean; id: Id<'resumes'> }> {
  const {
    id,
    title,
    personalInfo,
    experience,
    education,
    skills,
    documentStyle,
    isAiImproved
  } = data;

  if (id) {
    await convex.mutation(api.resumes.updateResume, {
      id,
      title,
      personalInfo,
      experience,
      education,
      skills,
      documentStyle
    });
    return { success: true, id };
  } else {
    const resumeId = await convex.mutation(api.resumes.createResume, {
      title,
      personalInfo,
      experience,
      education,
      skills,
      documentStyle,
      isAiImproved
    });
    return { success: true, id: resumeId };
  }
}

export function useResumeSubmit() {
  const queryClient = useQueryClient();
  const convex = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();
  return useMutation({
    mutationFn: async (data: TResumeData) => {
      if (isLoading || !isAuthenticated) {
        throw new Error('User not authenticated');
      }
      return submitResume(convex, data);
    },
    onSuccess: (_result, data) => {
      toast.success(data.id ? 'Resume saved' : 'Resume created');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
    },
    /** Show toast on resume limit errors. */
    onError: () => {
      toast.error('Failed to save resume');
    }
  });
}
