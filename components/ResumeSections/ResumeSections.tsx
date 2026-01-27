'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Save } from '@hugeicons/core-free-icons';
import ResumeSectionsTabs from './components/Tabs';
import { useFormContext } from 'react-hook-form';
import { TResumeForm } from '@/types';

export default function ResumeSections({
  onSubmit,
  isPending,
  isError,
  error
}: {
  onSubmit: (data: TResumeForm) => void;
  isPending: boolean;
  isError: boolean;
  error: unknown;
}) {
  const form = useFormContext<TResumeForm>();

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form noValidate onSubmit={handleSubmit} className="contents">
      <Card className="p-7 flex flex-col max-h-full overflow-hidden">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-3 tracking-tight">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/25">
              <HugeiconsIcon
                icon={FileText}
                strokeWidth={2.5}
                className="size-5"
              />
            </div>
            Resume Form
          </h3>
          <div className="flex items-center gap-3">
            {isError && (
              <p className="text-sm text-destructive font-medium">
                Error: {error instanceof Error ? error.message : 'An error occurred'}
              </p>
            )}
            <Button type="submit" disabled={isPending}>
              <HugeiconsIcon icon={Save} strokeWidth={2.5} />
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto min-h-0">
          <ResumeSectionsTabs />
        </div>
      </Card>
    </form>
  );
}
