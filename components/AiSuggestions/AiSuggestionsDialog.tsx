'use client';

import { useReducer, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
 * Two-mode AI dialog: "General Improve" (chat) and "Match Job" (JD-based).
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
  const [activeTab, setActiveTab] = useState<'improve' | 'match'>('improve');
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
      const result = await generateSuggestions({ resumeId, jobDescription });
      dispatch({
        type: 'GENERATE_SUCCESS',
        payload: { result, jobDescription }
      });
    } catch {
      toast.error('Failed to generate suggestions');
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
      dispatch({
        type: 'GENERATE_SUCCESS',
        payload: { result, jobDescription }
      });
    } catch {
      toast.error('Failed to generate suggestions');
      dispatch({
        type: 'REGENERATE_ERROR',
        payload: 'Failed to generate suggestions'
      });
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
            AI Resume Assistant
          </DialogTitleRow>
          <DialogDescription>
            Improve your resume or tailor it to a specific job.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'improve' | 'match')}
          className="flex min-h-0 flex-1 flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="improve">General Improve</TabsTrigger>
            <TabsTrigger value="match">Match Job</TabsTrigger>
          </TabsList>
          <TabsContent
            value="improve"
            className="mt-3 flex-1 overflow-hidden"
          >
            <ImproveTab
              resumeId={resumeId}
              currentData={currentData}
              onApplyImprovements={(newResumeId) => {
                onImproveApplied(newResumeId);
                onOpenChange(false);
              }}
            />
          </TabsContent>
          <TabsContent value="match" className="mt-3 flex-1 overflow-hidden">
            <MatchJobTab
              resumeId={resumeId}
              currentData={currentData}
              isAiImproved={isAiImproved}
              state={state}
              dispatch={dispatch}
              isAdmin={isAdmin}
              onGenerate={handleGenerate}
              onBack={handleBack}
              onRegenerate={handleRegenerate}
              onApply={handleApply}
              onCreateVersion={handleCreateVersion}
            />
          </TabsContent>
        </Tabs>
      </DialogContentWrapper>
    </Dialog>
  );
}
