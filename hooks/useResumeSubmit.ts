import type { TResumeData } from '@/types';
import { useMutation } from '@tanstack/react-query';

async function submitResume(data: TResumeData) {
  return Promise.resolve({ success: true, data });
}

export function useResumeSubmit() {
  return useMutation({
    mutationFn: submitResume,
    onSuccess: (data) => {
      console.log('Resume saved successfully:', data);
    },
    onError: (error: Error) => {
      console.error('Failed to save resume:', error.message);
    }
  });
}
