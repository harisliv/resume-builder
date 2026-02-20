'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileText, Save } from '@hugeicons/core-free-icons';
import ResumeFormTabs from './components/ResumeFormTabs';
import { useFormContext } from 'react-hook-form';
import type { TResumeForm } from '@/types/schema';
import type { TAiSuggestions } from '@/types/aiSuggestions';
import type { Id } from '@/convex/_generated/dataModel';
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
  SectionCardActions,
  SectionCardContent
} from '@/components/ui/section-card';
import { ErrorMessage } from '@/components/ui/error-message';
import { Spinner } from '@/components/ui/spinner';
import { AiSuggestionsDialog } from '@/components/AiSuggestions';
import { Sparkles } from 'lucide-react';

export default function ResumeForm({
  onSubmit,
  isPending,
  isError,
  error,
  resumeId,
  onApplySuggestions,
  onCreateNewVersion
}: {
  onSubmit: (data: TResumeForm) => void;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  resumeId?: Id<'resumes'>;
  onApplySuggestions?: (suggestions: TAiSuggestions) => void;
  onCreateNewVersion?: (suggestions: TAiSuggestions) => void;
}) {
  const form = useFormContext<TResumeForm>();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

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
            {resumeId && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAiDialogOpen(true)}
              >
                <Sparkles className="size-4" />
                AI Suggestions
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner className="size-4" />
                  Saving...
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Save} strokeWidth={2} />
                  Save
                </>
              )}
            </Button>
          </SectionCardActions>
        </SectionCardHeader>
        <SectionCardContent>
          <ResumeFormTabs />
        </SectionCardContent>
      </SectionCard>

      {resumeId && (
        <AiSuggestionsDialog
          open={aiDialogOpen}
          onOpenChange={setAiDialogOpen}
          resumeId={resumeId}
          currentData={form.getValues()}
          onApply={onApplySuggestions ?? (() => {})}
          onCreateNewVersion={onCreateNewVersion ?? (() => {})}
        />
      )}
    </form>
  );
}
