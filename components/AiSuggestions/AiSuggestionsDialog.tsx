'use client';

import { useReducer } from 'react';
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
import { InputPhase } from './components/InputPhase';
import { ResultsPhase } from './components/ResultsPhase';

type TAiSuggestionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: Id<'resumes'>;
  currentData: TResumeForm;
  onApply: (suggestions: TAiSuggestions) => void;
  onCreateNewVersion: (suggestions: TAiSuggestions) => void;
};

/**
 * Dialog for generating AI resume suggestions with selective acceptance.
 * Delegates phase rendering to InputPhase and ResultsPhase components.
 */
export function AiSuggestionsDialog({
  open,
  onOpenChange,
  resumeId,
  currentData,
  onApply,
  onCreateNewVersion
}: TAiSuggestionsDialogProps) {
  const [state, dispatch] = useReducer(dialogReducer, initialDialogState);
  const { isAdmin } = usePrivileges();
  const confirm = useWarningDialog();
  const generateSuggestions = useAction(
    api.aiSuggestions.generateResumeSuggestions
  );

  const handleGenerate = async () => {
    if (state.phase !== 'idle' || !state.jobDescription.trim()) return;
    const jobDescription = state.jobDescription.trim();
    dispatch({ type: 'GENERATE_START' });
    try {
      const result = await generateSuggestions({
        resumeId,
        jobDescription
      });
      dispatch({
        type: 'GENERATE_SUCCESS',
        payload: { result, jobDescription }
      });
    } catch (e) {
      const msg = 'Failed to generate suggestions';
      toast.error(msg);
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

  /** Re-runs generation from results using the same job description prompt. */
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
      const result = await generateSuggestions({
        resumeId,
        jobDescription
      });
      dispatch({
        type: 'GENERATE_SUCCESS',
        payload: { result, jobDescription }
      });
    } catch (e) {
      const msg = 'Failed to generate suggestions';
      toast.error(msg);
      dispatch({ type: 'REGENERATE_ERROR', payload: msg });
    }
  };

  const handleApply = async () => {
    if (state.phase !== 'results') return;
    const { result } = state;
    if (!result.editedSuggestions || !result.selection) return;
    const filtered = buildFilteredSuggestions(
      result.editedSuggestions,
      result.selection
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
      result.selection
    );
    onCreateNewVersion(filtered);
    onOpenChange(false);
    dispatch({ type: 'RESET' });
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (state.phase === 'results') {
        void (async () => {
          const ok = await confirmLoseResults(
            'Close suggestions?',
            'You have unapplied AI suggestions. Closing now will discard them.',
            'Close'
          );
          if (!ok) return;
          dispatch({ type: 'RESET' });
          onOpenChange(false);
        })();
        return;
      }

      dispatch({ type: 'RESET' });
      onOpenChange(false);
      return;
    }

    onOpenChange(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContentWrapper>
        <DialogHeader>
          <DialogTitleRow>
            <Sparkles className="size-4" />
            AI Resume Suggestions
          </DialogTitleRow>
          <DialogDescription>
            Paste a job description to get tailored suggestions for your resume.
          </DialogDescription>
        </DialogHeader>
        {state.phase === 'results' ? (
          <ResultsPhase
            result={state.result}
            currentData={currentData}
            jobDescription={state.jobDescription}
            dispatch={dispatch}
            isAdmin={isAdmin}
            isRegenerating={state.isRegenerating}
            onBack={handleBack}
            onRegenerate={handleRegenerate}
            onApply={handleApply}
            onCreateVersion={handleCreateVersion}
          />
        ) : (
          <InputPhase
            jobDescription={state.jobDescription}
            isGenerating={state.phase === 'generating'}
            dispatch={dispatch}
            onGenerate={handleGenerate}
          />
        )}
      </DialogContentWrapper>
    </Dialog>
  );
}
