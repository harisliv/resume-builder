'use client';

import { Sparkles, X } from 'lucide-react';
import type { TPhase } from '../useImproveFlow';
import {
  ImproveCloseButton,
  ImproveHeaderBadge,
  ImproveHeaderRow
} from '../styles/improve-resume-shell.styles';

type TImproveResumeHeaderProps = {
  phase: TPhase;
  onClose: () => void;
};

/** Renders the fixed Improve Resume modal header with phase-aware copy. */
export function ImproveResumeHeader({
  phase,
  onClose
}: TImproveResumeHeaderProps) {
  const isReview = phase === 'review';

  return (
    <ImproveHeaderRow>
      <div>
        {/* <div className="mb-1 flex items-center gap-2">
          <ImproveHeaderBadge>
            <Sparkles className="h-4 w-4 text-white" />
          </ImproveHeaderBadge>
          <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {isReview ? 'Step 2: Review & Apply' : 'Optimization Phase 01'}
          </span>
        </div> */}
        <h2 className="text-foreground text-2xl font-extrabold tracking-tight">
          {isReview
            ? 'Atomic Edits'
            : 'AI Interview: Strengthening Your Impact'}
        </h2>
        {!isReview && (
          <p className="text-muted-foreground mt-1 text-sm">
            Answer targeted questions to surface missing metrics and strengthen
            your resume.
          </p>
        )}
      </div>
      <ImproveCloseButton
        aria-label="Close Improve Resume"
        onClick={() => void onClose()}
      >
        <X className="h-5 w-5" />
      </ImproveCloseButton>
    </ImproveHeaderRow>
  );
}
