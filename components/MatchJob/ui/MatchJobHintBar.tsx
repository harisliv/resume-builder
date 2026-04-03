'use client';

import { ClipboardCheck, Lightbulb } from 'lucide-react';
import { MatchJobHintBarContainer } from '../styles/match-job-shell.styles';

type TMatchJobHintBarProps = {
  phase: 'matching' | 'review';
};

/** Renders phase-specific guidance between header and content. */
export function MatchJobHintBar({ phase }: TMatchJobHintBarProps) {
  if (phase === 'matching') {
    return (
      <MatchJobHintBarContainer>
        <Lightbulb className="text-primary h-3.5 w-3.5" />
        <p className="text-primary/80 text-[11px] font-semibold tracking-wider uppercase">
          Select an orange keyword on the left, then click a highlight area on
          the right to enhance.
        </p>
      </MatchJobHintBarContainer>
    );
  }

  return (
    <MatchJobHintBarContainer>
      <ClipboardCheck className="text-primary h-3.5 w-3.5" />
      <p className="text-primary/80 text-[11px] font-semibold tracking-wider uppercase">
        Review all changes before applying. Uncheck any you want to skip.
      </p>
    </MatchJobHintBarContainer>
  );
}
