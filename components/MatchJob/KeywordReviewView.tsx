'use client';

import type { TAccumulatedEdits } from '@/types/aiKeywords';
import { ReviewChangeList } from './ui/ReviewChangeList';

type TKeywordReviewViewProps = {
  edits: TAccumulatedEdits;
  /** Toggle a highlight edit on/off. Key: reviewId */
  acceptedHighlights: Set<string>;
  /** Toggle a skill addition on/off. Key: reviewId */
  acceptedSkills: Set<string>;
  onToggleHighlight: (reviewId: string) => void;
  onToggleSkill: (reviewId: string) => void;
};

/** Final review view showing all accumulated keyword edits before apply. */
export function KeywordReviewView({
  edits,
  acceptedHighlights,
  acceptedSkills,
  onToggleHighlight,
  onToggleSkill
}: TKeywordReviewViewProps) {
  const totalEdits = edits.highlightEdits.length + edits.skillAdditions.length;
  const acceptedCount = acceptedHighlights.size + acceptedSkills.size;

  return (
    <ReviewChangeList
      title="Review Changes"
      acceptedCount={acceptedCount}
      totalCount={totalEdits}
      highlights={edits.highlightEdits.map((edit) => ({
        id: edit.reviewId,
        current: edit.oldText,
        suggested: edit.newText,
        selected: acceptedHighlights.has(edit.reviewId)
      }))}
      skills={edits.skillAdditions.map((addition) => ({
        id: addition.reviewId,
        value: addition.value,
        selected: acceptedSkills.has(addition.reviewId)
      }))}
      onToggleHighlight={onToggleHighlight}
      onToggleSkill={onToggleSkill}
    />
  );
}
