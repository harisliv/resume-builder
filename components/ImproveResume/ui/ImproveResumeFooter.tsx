'use client';

import { Sparkles } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import type { TPhase } from '../useImproveFlow';
import {
  ImproveCancelButton,
  ImproveFooterContainer,
  ImprovePrimaryAction,
  ImproveDisabledAction
} from '../styles/improve-resume-shell.styles';

type TImproveResumeFooterProps = {
  phase: TPhase;
  hasAnswers: boolean;
  selectedCount: number;
  isApplying: boolean;
  onClose: () => void;
  onAnalyzeAnswers: () => void;
  onApply: () => void;
};

/** Renders phase-specific footer actions for the Improve Resume flow. */
export function ImproveResumeFooter({
  phase,
  hasAnswers,
  selectedCount,
  isApplying,
  onClose,
  onAnalyzeAnswers,
  onApply
}: TImproveResumeFooterProps) {
  return (
    <ImproveFooterContainer>
      <ImproveCancelButton onClick={() => void onClose()}>
        Cancel
      </ImproveCancelButton>

      {phase === 'questions' &&
        (hasAnswers ? (
          <ImprovePrimaryAction onClick={onAnalyzeAnswers}>
            <Sparkles className="h-4 w-4" />
            Analyze Answers
          </ImprovePrimaryAction>
        ) : (
          <ImproveDisabledAction>
            <Sparkles className="h-4 w-4" />
            Analyze Answers
          </ImproveDisabledAction>
        ))}

      {phase === 'review' &&
        (selectedCount > 0 && !isApplying ? (
          <ImprovePrimaryAction onClick={onApply}>
            Apply to Current
          </ImprovePrimaryAction>
        ) : (
          <ImproveDisabledAction>
            {isApplying ? (
              <>
                <Spinner className="h-4 w-4" /> Applying...
              </>
            ) : (
              'Apply to Current'
            )}
          </ImproveDisabledAction>
        ))}
    </ImproveFooterContainer>
  );
}
