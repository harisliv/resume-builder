'use client';

import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeForm } from '@/types/schema';
import { InputPhase } from './InputPhase';
import { ResultsPhase } from './ResultsPhase';
import type { TDialogAction, TDialogState } from '../utils/dialogReducer';

type TMatchJobTabProps = {
  resumeId: Id<'resumes'>;
  currentData: TResumeForm;
  isAiImproved: boolean;
  state: TDialogState;
  dispatch: React.Dispatch<TDialogAction>;
  isAdmin: boolean;
  onGenerate: () => void;
  onBack: () => void;
  onRegenerate: () => void;
  onApply: () => void;
  onCreateVersion: () => void;
};

/**
 * "Match Job" tab — existing JD flow, gated on isAiImproved.
 */
export function MatchJobTab({
  isAiImproved,
  state,
  dispatch,
  isAdmin,
  onGenerate,
  onBack,
  onRegenerate,
  onApply,
  onCreateVersion,
  currentData
}: TMatchJobTabProps) {
  if (!isAiImproved) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
        <p className="font-medium">Resume not yet AI-improved</p>
        <p>
          Use the &quot;General Improve&quot; tab first to enhance your resume
          before matching it to a job description.
        </p>
      </div>
    );
  }

  if (state.phase === 'results') {
    return (
      <ResultsPhase
        result={state.result}
        currentData={currentData}
        jobDescription={state.jobDescription}
        dispatch={dispatch}
        isAdmin={isAdmin}
        isRegenerating={state.isRegenerating}
        onBack={onBack}
        onRegenerate={onRegenerate}
        onApply={onApply}
        onCreateVersion={onCreateVersion}
      />
    );
  }

  return (
    <InputPhase
      jobDescription={state.jobDescription}
      isGenerating={state.phase === 'generating'}
      dispatch={dispatch}
      onGenerate={onGenerate}
    />
  );
}
