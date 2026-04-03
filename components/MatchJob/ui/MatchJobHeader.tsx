'use client';

import { Sparkles, X } from 'lucide-react';
import {
  MatchJobCloseButton,
  MatchJobHeaderBadge,
  MatchJobHeaderRow
} from '../styles/match-job-shell.styles';

type TMatchJobHeaderProps = {
  jobTitle: string;
  onClose: () => void;
};

/** Renders the fixed Match Job modal header. */
export function MatchJobHeader({
  jobTitle,
  onClose
}: TMatchJobHeaderProps) {
  return (
    <MatchJobHeaderRow>
      <div className="flex items-center gap-3">
        <MatchJobHeaderBadge>
          <Sparkles className="h-5 w-5" />
        </MatchJobHeaderBadge>
        <div>
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            AI Matching Analysis
          </h2>
          {jobTitle && (
            <p className="text-muted-foreground text-xs font-medium">
              Optimizing your resume for the {jobTitle} role
            </p>
          )}
        </div>
      </div>
      <MatchJobCloseButton aria-label="Close Match Job" onClick={onClose}>
        <X className="h-5 w-5" />
      </MatchJobCloseButton>
    </MatchJobHeaderRow>
  );
}
