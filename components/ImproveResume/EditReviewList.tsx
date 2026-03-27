'use client';

import type { TImproveEdit } from '@/types/aiImprove';
import { EditReviewCard } from './EditReviewCard';

type TEditReviewListProps = {
  edits: TImproveEdit[];
  acceptedSet: Set<number>;
  onToggle: (index: number) => void;
};

/** Scrollable list of atomic edit cards with accept/reject state. */
export function EditReviewList({
  edits,
  acceptedSet,
  onToggle
}: TEditReviewListProps) {
  const acceptedCount = acceptedSet.size;

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground text-xs font-medium">
        {acceptedCount} of {edits.length} changes accepted
      </div>
      {edits.map((edit, i) => (
        <EditReviewCard
          key={i}
          edit={edit}
          accepted={acceptedSet.has(i)}
          onAccept={() => onToggle(i)}
          onReject={() => onToggle(i)}
        />
      ))}
    </div>
  );
}
