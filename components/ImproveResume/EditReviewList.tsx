'use client';

import type { TImproveEdit } from '@/types/aiImprove';
import { EditReviewCard } from './EditReviewCard';

type TEditReviewListProps = {
  edits: TImproveEdit[];
  selectedSet: Set<number>;
  onToggle: (index: number) => void;
};

/** Scrollable list of atomic edit cards with checkbox selection state. */
export function EditReviewList({
  edits,
  selectedSet,
  onToggle
}: TEditReviewListProps) {
  const selectedCount = selectedSet.size;

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground text-xs font-medium">
        {selectedCount} of {edits.length} changes selected
      </div>
      {edits.map((edit, i) => (
        <EditReviewCard
          key={i}
          edit={edit}
          selected={selectedSet.has(i)}
          onToggle={() => onToggle(i)}
        />
      ))}
    </div>
  );
}
