'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import type { TResumeForm } from '@/types/schema';
import type { TPlacementTarget } from '@/types/aiKeywords';

type TDisplaySkillsTabProps = {
  skills: TResumeForm['skills'];
  selectedTargets: TPlacementTarget[];
  onToggleTarget: (target: TPlacementTarget) => void;
  disabled: boolean;
  enhancing: boolean;
};

/** Skills categories with checkboxes per category. */
export function DisplaySkillsTab({
  skills,
  selectedTargets,
  onToggleTarget,
  disabled,
  enhancing
}: TDisplaySkillsTabProps) {
  const isChecked = (catId: string) =>
    selectedTargets.some(t => t.type === 'skill' && t.categoryId === catId);
  /** Returns whether the skill category is the active enhance target. */
  const isEnhancingCategory = (catId: string) => enhancing && isChecked(catId);

  return (
    <div className="mb-8">
      <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Skill Category Alignment
      </h4>
      <div className="space-y-4">
        {skills.map(cat => (
          <div
            key={cat.id}
            className="overflow-hidden rounded-2xl border border-primary/20 transition-all"
            data-enhancing={isEnhancingCategory(cat.id) || undefined}
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-4">
                <Checkbox
                  className="size-5 cursor-pointer"
                  checked={isChecked(cat.id)}
                  disabled={disabled}
                  onCheckedChange={() =>
                    onToggleTarget({ type: 'skill', categoryId: cat.id })
                  }
                />
                <span className="text-[15px] font-bold text-foreground">
                  {cat.name}
                </span>
              </div>
            </div>
            {/* Skills */}
            <div className="border-t border-border/50 px-5 pt-2 pb-5">
              {isEnhancingCategory(cat.id) ? (
                <div className="space-y-2" aria-label={`${cat.name} loading`}>
                  <Skeleton className="h-4 w-32" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-7 w-20 rounded-lg" />
                    <Skeleton className="h-7 w-24 rounded-lg" />
                    <Skeleton className="h-7 w-16 rounded-lg" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {cat.values.map(v => (
                    <span
                      key={v.id}
                      className="rounded-lg border border-transparent bg-accent/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                    >
                      {v.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
