'use client';

import type { TImproveEdit } from '@/types/aiImprove';
import { DiffHighlight } from '@/components/AiSuggestions/utils/diffHighlight';
import { cn } from '@/lib/utils';

type TEditReviewCardProps = {
  edit: TImproveEdit;
  accepted: boolean;
  onAccept: () => void;
  onReject: () => void;
};

/** Returns a human-readable label for an edit type. */
function getEditLabel(edit: TImproveEdit): string {
  switch (edit.type) {
    case 'updateHighlight':
      return 'Highlight';
    case 'updateDescription':
      return 'Description';
    case 'updateSummary':
      return 'Summary';
  }
}

/** Returns old and new text for diffing. */
function getEditTexts(edit: TImproveEdit): { oldText: string; newText: string } {
  return { oldText: edit.oldValue, newText: edit.newValue };
}

/** Single atomic edit card with before/after diff and accept/reject buttons. */
export function EditReviewCard({
  edit,
  accepted,
  onAccept,
  onReject
}: TEditReviewCardProps) {
  const label = getEditLabel(edit);
  const { oldText, newText } = getEditTexts(edit);

  return (
    <div
      className={cn(
        'bg-muted/40 rounded-2xl p-6 transition-all duration-300',
        accepted ? 'opacity-100' : 'opacity-50'
      )}
    >
      <span className="text-muted-foreground mb-3 block text-[10px] font-bold tracking-wider uppercase">
        {label}
      </span>

      {/* Original */}
      {oldText && (
        <div className="mb-4">
          <span className="text-muted-foreground/60 mb-1 block text-[10px] font-bold tracking-wider uppercase">
            Original
          </span>
          <p className="text-muted-foreground text-sm leading-relaxed italic line-through opacity-60">
            {oldText}
          </p>
        </div>
      )}

      {/* AI Improved */}
      <div className="bg-primary/5 border-primary/10 rounded-xl border p-4">
        <span className="text-primary mb-1 block text-[10px] font-bold tracking-wider uppercase">
          AI Improved
        </span>
        {oldText ? (
          <DiffHighlight
            current={oldText}
            suggested={newText}
            className="text-foreground text-sm font-medium leading-relaxed"
          />
        ) : (
          <p className="text-foreground text-sm font-medium leading-relaxed">
            {newText}
          </p>
        )}
      </div>

      {/* Accept / Reject buttons */}
      <div className="mt-5 flex justify-end gap-3">
        {accepted ? (
          <button
            onClick={onReject}
            className="text-muted-foreground hover:bg-muted rounded-xl px-5 py-2 text-sm font-bold transition-colors"
          >
            Reject
          </button>
        ) : (
          <button
            onClick={onAccept}
            className="from-primary to-primary/80 flex items-center gap-2 rounded-xl bg-gradient-to-br px-6 py-2 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        )}
      </div>
    </div>
  );
}
