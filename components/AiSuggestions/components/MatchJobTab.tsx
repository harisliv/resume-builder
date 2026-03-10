'use client';

import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeForm } from '@/types/schema';
import { InputPhase } from './InputPhase';
import { ResultsPhase } from './ResultsPhase';
import type { TDialogAction, TDialogState } from '../utils/dialogReducer';

type TMatchJobTabProps = {
  resumeId: Id<'resumes'>;
  currentData: TResumeForm;
  state: TDialogState;
  dispatch: React.Dispatch<TDialogAction>;
  isAdmin: boolean;
  onGenerate: () => void;
  onBack: () => void;
  onRegenerate: () => void;
  onApply: () => void;
  onCreateVersion: () => void;
};

/** Match Job flow — paste JD, get tailored suggestions for AI-improved resumes. */
export function MatchJobTab({
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
