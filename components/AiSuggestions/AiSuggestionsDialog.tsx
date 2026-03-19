'use client';

import { useCallback, useEffect, useReducer, useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { TAiSuggestions } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import {
  Dialog,
  DialogDescription,
  DialogHeader
} from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import usePrivileges from '@/hooks/usePrivileges';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import {
  DialogContentWrapper,
  DialogTitleRow
} from './styles/ai-suggestions-dialog.styles';
import { buildFilteredSuggestions } from './utils/filterSuggestions';
import { dialogReducer, initialDialogState } from './utils/dialogReducer';
import { ImproveTab } from './components/ImproveTab';
import { MatchJobTab } from './components/MatchJobTab';

/** Returns a user-friendly error message for AI generation failures. */
function getAiErrorMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/credit|balance|billing/i.test(msg)) {
    return 'AI service is temporarily unavailable. Please try again later.';
  }
  return 'Failed to generate suggestions';
}

type TAiSuggestionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: Id<'resumes'>;
  currentData: TResumeForm;
  isAiImproved: boolean;
  onApply: (suggestions: TAiSuggestions) => void;
  onCreateNewVersion: (suggestions: TAiSuggestions) => void;
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
  onApply,
  onCreateNewVersion,
  onImproveApplied
}: TAiSuggestionsDialogProps) {
  const [state, dispatch] = useReducer(dialogReducer, initialDialogState);
  const [improveHasTokens, setImproveHasTokens] = useState(false);
  const { isAdmin } = usePrivileges();
  const confirm = useWarningDialog();

  /** True when either flow has consumed AI tokens. */
  const hasConsumedTokens = isAiImproved
    ? state.phase === 'results'
    : improveHasTokens;

  /** Callback for ImproveTab to signal token consumption. */
  const handleImprovePhaseChange = useCallback((phase: string) => {
    setImproveHasTokens(phase !== 'idle');
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
  const generateSuggestions = useAction(
    api.aiSuggestions.generateResumeSuggestions
  );

  const handleGenerate = async () => {
    if (state.phase !== 'idle' || !state.jobDescription.trim()) return;
    const jobDescription = state.jobDescription.trim();
    dispatch({ type: 'GENERATE_START' });
    try {
      const result = await generateSuggestions({ resumeId, jobDescription });
      if (result.error) {
        toast.error(getAiErrorMessage(result.error));
        dispatch({ type: 'GENERATE_ERROR' });
        return;
      }
      dispatch({
        type: 'GENERATE_SUCCESS',
        payload: { result, jobDescription }
      });
    } catch (e) {
      toast.error(getAiErrorMessage(e));
      dispatch({ type: 'GENERATE_ERROR' });
    }
  };

  const confirmLoseResults = async (
    title: string,
    description: string,
    confirmLabel: string
  ) =>
    confirm({
      title,
      description,
      confirmLabel,
      variant: 'destructive'
    });

  const handleBack = async () => {
    if (state.phase !== 'results') return;
    const ok = await confirmLoseResults(
      'Go back and discard suggestions?',
      'This will discard current AI suggestions and your selection choices.',
      'Discard'
    );
    if (!ok) return;
    dispatch({ type: 'BACK' });
  };

  const handleRegenerate = async () => {
    if (state.phase !== 'results' || !state.jobDescription.trim()) return;
    const ok = await confirmLoseResults(
      'Regenerate suggestions?',
      'This will replace current suggestions and reset your current selection choices.',
      'Regenerate'
    );
    if (!ok) return;
    const jobDescription = state.jobDescription.trim();
    dispatch({ type: 'REGENERATE_START' });
    try {
      const result = await generateSuggestions({ resumeId, jobDescription });
      if (result.error) {
        const msg = getAiErrorMessage(result.error);
        toast.error(msg);
        dispatch({ type: 'REGENERATE_ERROR', payload: msg });
        return;
      }
      dispatch({
        type: 'GENERATE_SUCCESS',
        payload: { result, jobDescription }
      });
    } catch (e) {
      const msg = getAiErrorMessage(e);
      toast.error(msg);
      dispatch({
        type: 'REGENERATE_ERROR',
        payload: msg
      });
    }
  };

  const handleApply = async () => {
    if (state.phase !== 'results') return;
    const { result } = state;
    if (!result.editedSuggestions || !result.selection) return;
    const filtered = buildFilteredSuggestions(
      result.editedSuggestions,
      result.selection,
      currentData
    );
    const ok = await confirm({
      title: 'Apply suggestions?',
      description:
        'This will overwrite matching fields on your current resume.',
      confirmLabel: 'Apply'
    });
    if (!ok) return;
    onApply(filtered);
    onOpenChange(false);
    dispatch({ type: 'RESET' });
  };

  const handleCreateVersion = () => {
    if (state.phase !== 'results') return;
    const { result } = state;
    if (!result.editedSuggestions || !result.selection) return;
    const filtered = buildFilteredSuggestions(
      result.editedSuggestions,
      result.selection,
      currentData
    );
    onCreateNewVersion(filtered);
    onOpenChange(false);
    dispatch({ type: 'RESET' });
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (hasConsumedTokens) {
        void (async () => {
          const ok = await confirmLoseResults(
            'Close AI Assistant?',
            "AI tokens have already been used in this session. Closing now means those tokens are lost and you'll need to start over.",
            'Close anyway'
          );
          if (!ok) return;
          dispatch({ type: 'RESET' });
          setImproveHasTokens(false);
          onOpenChange(false);
        })();
        return;
      }
      dispatch({ type: 'RESET' });
      setImproveHasTokens(false);
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
            {isAiImproved
              ? 'Tailor your AI-improved resume to a specific job.'
              : 'Get a brutally honest review and improve your resume with AI.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          {isAiImproved ? (
            <MatchJobTab
              resumeId={resumeId}
              currentData={currentData}
              state={state}
              dispatch={dispatch}
              isAdmin={isAdmin}
              onGenerate={handleGenerate}
              onBack={handleBack}
              onRegenerate={handleRegenerate}
              onApply={handleApply}
              onCreateVersion={handleCreateVersion}
            />
          ) : (
            <ImproveTab
              resumeId={resumeId}
              currentData={currentData}
              onPhaseChange={handleImprovePhaseChange}
              onApplyImprovements={(newResumeId) => {
                setImproveHasTokens(false);
                onImproveApplied(newResumeId);
                onOpenChange(false);
              }}
            />
          )}
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
}
