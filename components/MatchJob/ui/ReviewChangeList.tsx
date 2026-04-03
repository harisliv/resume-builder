'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { DiffHighlight } from '@/components/ui/diff-highlight';
import {
  ReviewChangeListContainer,
  ReviewHighlightRow,
  ReviewSkillRow
} from '../styles/review-change-list.styles';

type TReviewHighlightItem = {
  id: string;
  current: string;
  suggested: string;
  selected: boolean;
};

type TReviewSkillItem = {
  id: string;
  value: string;
  selected: boolean;
};

type TReviewChangeListProps = {
  highlights: TReviewHighlightItem[];
  skills: TReviewSkillItem[];
  onToggleHighlight: (id: string) => void;
  onToggleSkill: (id: string) => void;
  title?: string;
  acceptedCount?: number;
  totalCount?: number;
};

/** Renders selectable highlight and skill review items. */
export function ReviewChangeList({
  highlights,
  skills,
  onToggleHighlight,
  onToggleSkill,
  title,
  acceptedCount,
  totalCount
}: TReviewChangeListProps) {
  return (
    <ReviewChangeListContainer>
      {title && typeof acceptedCount === 'number' && typeof totalCount === 'number' && (
        <div>
          <h4 className="text-sm font-semibold">
            {title} ({acceptedCount} of {totalCount} accepted)
          </h4>
        </div>
      )}

      {highlights.length > 0 && (
        <div>
          <h5 className="mb-2 text-xs font-medium text-muted-foreground">
            Highlight Changes
          </h5>
          <div className="flex flex-col gap-2">
            {highlights.map((highlight) => (
              <ReviewHighlightRow key={highlight.id}>
                <Checkbox
                  className="mt-0.5 cursor-pointer"
                  checked={highlight.selected}
                  onCheckedChange={() => onToggleHighlight(highlight.id)}
                />
                <div className="min-w-0 flex-1">
                  <DiffHighlight
                    current={highlight.current}
                    suggested={highlight.suggested}
                    view="both"
                  />
                </div>
              </ReviewHighlightRow>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h5 className="mb-2 text-xs font-medium text-muted-foreground">
            Skills Added
          </h5>
          <div className="flex flex-col gap-1">
            {skills.map((skill) => (
              <ReviewSkillRow key={skill.id}>
                <Checkbox
                  className="cursor-pointer"
                  checked={skill.selected}
                  onCheckedChange={() => onToggleSkill(skill.id)}
                />
                <span className="text-sm">+ {skill.value}</span>
              </ReviewSkillRow>
            ))}
          </div>
        </div>
      )}
    </ReviewChangeListContainer>
  );
}
