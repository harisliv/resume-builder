'use client';

import type { TImproveEdit } from '@/types/aiImprove';
import { Checkbox } from '@/components/ui/checkbox';
import { DiffHighlight } from '@/components/ui/diff-highlight';
import { cn } from '@/lib/utils';

type TEditReviewCardProps = {
  edit: TImproveEdit;
  selected: boolean;
  onToggle: () => void;
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

/** Single atomic edit card with before/after diff and include checkbox. */
export function EditReviewCard({
  edit,
  selected,
  onToggle
}: TEditReviewCardProps) {
  const label = getEditLabel(edit);
  const { oldText, newText } = getEditTexts(edit);

  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition-all duration-300',
        selected
          ? 'border-primary/30 bg-primary/5'
          : 'border-border/40 bg-muted/40'
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
          {label}
        </span>
        <label className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-xs font-semibold transition-colors">
          <Checkbox
            aria-label={`Include ${label.toLowerCase()} edit`}
            checked={selected}
            className="cursor-pointer"
            onCheckedChange={() => onToggle()}
          />
          Include
        </label>
      </div>

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
    </div>
  );
}
