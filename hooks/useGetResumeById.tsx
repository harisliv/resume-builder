import { api } from '@/convex/_generated/api';
import { useQuery } from '@tanstack/react-query';
import { useConvex, useConvexAuth } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { convertConvexIdToId } from '@/lib/utils';
import {
  resumeFormDefaultValues,
  resumeInfoDefaultValues,
  type TResumeData
} from '@/types/schema';
import { useMemo } from 'react';

export function useGetResumeById(resumeId?: Id<'resumes'>) {
  const convex = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const res = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async (): Promise<TResumeData | null> => {
      if (!resumeId) return null;
      const res = await convex.query(api.resumes.getResumeById, {
        id: resumeId
      });
      return convertConvexIdToId(res);
    },
    enabled: Boolean(resumeId) && isAuthenticated && !isLoading
  });

  const { data: resumeData, ...rest } = res;

  const splitResumeData = useMemo(() => {
    if (!resumeData) {
      return {
        info: resumeInfoDefaultValues,
        form: resumeFormDefaultValues
      };
    }
    const {
      id,
      userId,
      title,
      documentStyle,
      personalInfo,
      experience,
      education,
      skills
    } = resumeData;
    return {
      info: {
        id,
        userId,
        title: title ?? '',
        documentStyle: documentStyle ?? resumeInfoDefaultValues.documentStyle
      },
      form: {
        personalInfo: personalInfo ?? resumeFormDefaultValues.personalInfo,
        experience: experience ?? resumeFormDefaultValues.experience,
        education: education ?? resumeFormDefaultValues.education,
        skills: skills ?? resumeFormDefaultValues.skills
      }
    };
  }, [resumeData]);

  return {
    ...splitResumeData,
    ...rest
  };
}
