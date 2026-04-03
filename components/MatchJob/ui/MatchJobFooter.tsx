'use client';

import { BarChart3, ClipboardCheck, Wand2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { TPhase } from '../useMatchJobFlow';
import {
  MatchJobFooterContainer,
  MatchJobPrimaryAction,
  MatchJobSecondaryAction
} from '../styles/match-job-shell.styles';

type TMatchJobFooterProps = {
  phase: TPhase;
  hasEdits: boolean;
  jobDescription: string;
  canEnhance: boolean;
  enhancing: boolean;
  acceptedCount: number;
  isApplying: boolean;
  onAnalyze: () => void;
  onReview: () => void;
  onEnhance: () => void;
  onBackToMatching: () => void;
  onApply: () => void;
};

/** Renders phase-specific footer actions for the Match Job flow. */
export function MatchJobFooter({
  phase,
  hasEdits,
  jobDescription,
  canEnhance,
  enhancing,
  acceptedCount,
  isApplying,
  onAnalyze,
  onReview,
  onEnhance,
  onBackToMatching,
  onApply
}: TMatchJobFooterProps) {
  return (
    <MatchJobFooterContainer>
      {(phase === 'input' || phase === 'analyzing') && (
        <MatchJobPrimaryAction
          onClick={onAnalyze}
          disabled={!jobDescription.trim() || phase === 'analyzing'}
          className={cn(
            'px-8',
            (!jobDescription.trim() || phase === 'analyzing') &&
              'bg-muted text-muted-foreground cursor-not-allowed opacity-60 shadow-none'
          )}
        >
          <BarChart3 className="h-4 w-4" />
          Analyze Job Description
        </MatchJobPrimaryAction>
      )}

      {phase === 'matching' && (
        <>
          {hasEdits && (
            <MatchJobSecondaryAction onClick={onReview} className="mr-auto">
              <ClipboardCheck className="h-4 w-4" />
              Review Changes
            </MatchJobSecondaryAction>
          )}
          <MatchJobPrimaryAction
            onClick={onEnhance}
            disabled={!canEnhance}
            className={cn(
              'px-6',
              !canEnhance &&
                'bg-muted text-muted-foreground cursor-not-allowed opacity-60 shadow-none'
            )}
          >
            <Wand2 className="h-4 w-4" />
            {enhancing ? 'Enhancing...' : 'Enhance'}
          </MatchJobPrimaryAction>
        </>
      )}

      {phase === 'review' && (
        <>
          <MatchJobSecondaryAction onClick={onBackToMatching} className="mr-auto">
            Back to Matching
          </MatchJobSecondaryAction>
          <MatchJobPrimaryAction
            onClick={onApply}
            disabled={acceptedCount === 0 || isApplying}
          >
            {isApplying ? (
              <>
                <Spinner className="h-4 w-4" />
                Applying...
              </>
            ) : (
              'Apply Changes'
            )}
          </MatchJobPrimaryAction>
        </>
      )}
    </MatchJobFooterContainer>
  );
}
