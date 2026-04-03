'use client';

import { Skeleton } from '@/components/ui/skeleton';

/** Skeleton mimicking the QuestionsList layout during resume analysis. */
export function QuestionsListSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-start gap-4">
            <Skeleton className="mt-0.5 h-6 w-6 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="ml-10">
            <Skeleton className="h-8 w-full rounded-none border-b-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton mimicking the EditReviewList layout during edit generation. */
export function EditReviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-3 w-36" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="rounded-2xl bg-muted/40 p-6">
          <Skeleton className="mb-3 h-2.5 w-16" />
          <div className="mb-4 space-y-2">
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
          <div className="mt-5 flex justify-end">
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
