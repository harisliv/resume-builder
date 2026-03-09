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
import { Spinner } from '@/components/ui/spinner';
import { AiSuggestionsDialog } from '@/components/AiSuggestions';
import { Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import usePrivileges from '@/hooks/usePrivileges';
import { toast } from 'sonner';
import { getInvalidSubmitDescription } from './getInvalidSubmitDescription';

export default function ResumeForm({
  onSubmit,
  isPending,
  resumeId,
  onApplySuggestions,
  onCreateNewVersion
}: {
  onSubmit: (data: TResumeForm) => void;
  isPending: boolean;
  resumeId?: Id<'resumes'>;
  onApplySuggestions?: (suggestions: TAiSuggestions) => void;
  onCreateNewVersion?: (suggestions: TAiSuggestions) => void;
}) {
  const form = useFormContext<TResumeForm>();
  const {
    formState: { isDirty }
  } = form;
  const { isMember, getDisabledTooltip } = usePrivileges();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const saveTooltip = getDisabledTooltip(!!resumeId);
  const aiTooltip = getDisabledTooltip(true);

  /** Surfaces invalid submit state instead of failing silently. */
  const handleSubmit = form.handleSubmit(onSubmit, (errors) => {
    toast.error('Fix form errors before saving', {
      description: getInvalidSubmitDescription(errors)
    });
  });

  return (
    <form noValidate onSubmit={handleSubmit}>
      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle icon={FileText}>Resume Form</SectionCardTitle>
          <SectionCardActions>
            {resumeId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex shrink-0">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isMember}
                      onClick={() => setAiDialogOpen(true)}
                    >
                      <Sparkles className="size-4" />
                      AI Suggestions
                    </Button>
                  </span>
                </TooltipTrigger>
                {aiTooltip && <TooltipContent>{aiTooltip}</TooltipContent>}
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex shrink-0">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isPending || isMember || !resumeId || !isDirty}
                  >
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
                </span>
              </TooltipTrigger>
              {saveTooltip && <TooltipContent>{saveTooltip}</TooltipContent>}
            </Tooltip>
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
