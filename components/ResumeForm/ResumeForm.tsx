'use client';

import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileText, Save } from '@hugeicons/core-free-icons';
import ResumeFormTabs from './components/ResumeFormTabs';
import { useFormContext } from 'react-hook-form';
import type { TResumeForm } from '@/types';
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  SectionCardActions,
  SectionCardContent
} from '@/components/ui/section-card';
import { ErrorMessage } from '@/components/ui/error-message';

export default function ResumeForm({
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
    <form noValidate onSubmit={handleSubmit}>
      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle icon={FileText}>Resume Form</SectionCardTitle>
          <SectionCardActions>
            {isError && (
              <ErrorMessage>
                Error:{' '}
                {error instanceof Error ? error.message : 'An error occurred'}
              </ErrorMessage>
            )}
            <Button type="submit" disabled={isPending}>
              <HugeiconsIcon icon={Save} strokeWidth={2.5} />
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </SectionCardActions>
        </SectionCardHeader>
        <SectionCardContent>
          <ResumeFormTabs />
        </SectionCardContent>
      </SectionCard>
    </form>
  );
}
