'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DiffHighlight } from '@/components/ui/diff-highlight';
import type { TAccumulatedEdits } from '@/types/aiKeywords';

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
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-sm font-semibold">
          Review Changes ({acceptedCount} of {totalEdits} accepted)
        </h4>
      </div>

      {/* Highlight changes */}
      {edits.highlightEdits.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Highlight Changes</h5>
          <div className="flex flex-col gap-2">
            {edits.highlightEdits.map(edit => {
              return (
                <label
                  key={edit.reviewId}
                  className="flex items-start gap-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    className="mt-0.5 cursor-pointer"
                    checked={acceptedHighlights.has(edit.reviewId)}
                    onCheckedChange={() => onToggleHighlight(edit.reviewId)}
                  />
                  <div className="flex-1 min-w-0">
                    <DiffHighlight
                      current={edit.oldText}
                      suggested={edit.newText}
                      view="both"
                    />
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Skill additions */}
      {edits.skillAdditions.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-muted-foreground mb-2">Skills Added</h5>
          <div className="flex flex-col gap-1">
            {edits.skillAdditions.map(addition => {
              return (
                <label
                  key={addition.reviewId}
                  className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    className="cursor-pointer"
                    checked={acceptedSkills.has(addition.reviewId)}
                    onCheckedChange={() => onToggleSkill(addition.reviewId)}
                  />
                  <span className="text-sm">+ {addition.value}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
