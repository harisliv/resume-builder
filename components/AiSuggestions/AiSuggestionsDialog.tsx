'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeForm } from '@/types/schema';
import {
  Dialog,
  DialogDescription,
  DialogHeader
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import {
  DialogContentWrapper,
  DialogTitleRow
} from './styles/ai-suggestions-dialog.styles';
import { MatchJobTab } from './components/MatchJobTab';

type TAiSuggestionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: Id<'resumes'>;
  currentData: TResumeForm;
  isAiImproved: boolean;
  onImproveApplied: (newResumeId: Id<'resumes'>) => void;
};

/**
 * AI dialog that auto-selects flow based on resume type.
 * Not AI-improved → Improve flow. AI-improved → Match Job flow.
 */
export function AiSuggestionsDialog({
  open,
  onOpenChange,
  resumeId,
  currentData,
  isAiImproved,
  onImproveApplied
}: TAiSuggestionsDialogProps) {
  const [hasConsumedTokens, setHasConsumedTokens] = useState(false);
  const confirm = useWarningDialog();

  /** Callback for child tabs to signal token consumption. */
  const handlePhaseChange = useCallback((consumed: boolean) => {
    setHasConsumedTokens(consumed);
  }, []);

  /** Warn on page leave/refresh when tokens consumed. */
  useEffect(() => {
    if (!open || !hasConsumedTokens) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [open, hasConsumedTokens]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (hasConsumedTokens) {
        void (async () => {
          const ok = await confirm({
            title: 'Close AI Assistant?',
            description: "AI tokens have already been used in this session. Closing now means those tokens are lost and you'll need to start over.",
            confirmLabel: 'Close anyway',
            variant: 'destructive'
          });
          if (!ok) return;
          setHasConsumedTokens(false);
          onOpenChange(false);
        })();
        return;
      }
      setHasConsumedTokens(false);
      onOpenChange(false);
      return;
    }
    onOpenChange(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContentWrapper preventClose={hasConsumedTokens}>
        <DialogHeader>
          <DialogTitleRow>
            <Sparkles className="size-4" />
            AI Resume Assistant
          </DialogTitleRow>
          <DialogDescription>
            Tailor your AI-improved resume to a specific job.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <MatchJobTab
            resumeId={resumeId}
            currentData={currentData}
            onPhaseChange={handlePhaseChange}
            onNewVersionCreated={(newResumeId) => {
              setHasConsumedTokens(false);
              onImproveApplied(newResumeId as Id<'resumes'>);
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
}
