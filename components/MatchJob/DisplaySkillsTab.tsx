'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { TResumeForm } from '@/types/schema';
import type { TPlacementTarget } from '@/types/aiKeywords';
import { getNewSkillCategoryId } from './matchJob.utils';

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
  const [newCategoryName, setNewCategoryName] = useState('');

  const isChecked = (catId: string) =>
    selectedTargets.some((t) => t.type === 'skill' && t.categoryId === catId);
  /** Returns whether the skill category is the active enhance target. */
  const isEnhancingCategory = (catId: string) => enhancing && isChecked(catId);
  const trimmedNewCategoryName = newCategoryName.trim();
  const existingCategory = skills.find(
    (category) =>
      category.name.toLowerCase() === trimmedNewCategoryName.toLowerCase()
  );
  const selectedNewCategory = selectedTargets.find(
    (target) => target.type === 'skill' && target.isNewCategory
  );
  const canUseNewCategory =
    !disabled && trimmedNewCategoryName.length > 0 && !existingCategory;
  const canToggleNewCategory =
    !disabled && (Boolean(selectedNewCategory) || canUseNewCategory);

  /** Toggles the ad-hoc new category target for the current keyword. */
  const handleToggleNewCategory = () => {
    if (selectedNewCategory) {
      onToggleTarget(selectedNewCategory);
    }

    if (!canUseNewCategory) return;

    setNewCategoryName(trimmedNewCategoryName);

    const nextTarget = {
      type: 'skill' as const,
      categoryId: getNewSkillCategoryId(trimmedNewCategoryName),
      categoryName: trimmedNewCategoryName,
      isNewCategory: true
    };

    if (
      selectedNewCategory?.type === 'skill' &&
      selectedNewCategory.categoryId === nextTarget.categoryId &&
      selectedNewCategory.categoryName === nextTarget.categoryName
    ) {
      return;
    }

    onToggleTarget(nextTarget);
  };

  return (
    <div className="mb-8">
      <h4 className="text-muted-foreground mb-4 text-xs font-bold tracking-wider uppercase">
        Skill Category Alignment
      </h4>
      <div className="space-y-4">
        {skills.map((cat) => (
          <div
            key={cat.id}
            className="border-primary/20 overflow-hidden rounded-2xl border transition-all"
            data-enhancing={isEnhancingCategory(cat.id) || undefined}
          >
            {/* Header row */}
            <div className="hover:bg-muted/50 flex items-center justify-between px-5 py-4 transition-colors">
              <div className="flex items-center gap-4">
                <Checkbox
                  className="size-5 cursor-pointer"
                  checked={isChecked(cat.id)}
                  disabled={disabled}
                  onCheckedChange={() =>
                    onToggleTarget({
                      type: 'skill',
                      categoryId: cat.id,
                      categoryName: cat.name
                    })
                  }
                />
                <span className="text-foreground text-[15px] font-bold">
                  {cat.name}
                </span>
              </div>
            </div>
            {/* Skills */}
            <div className="border-border/50 border-t px-5 pt-2 pb-5">
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
                  {cat.values.map((v) => (
                    <span
                      key={v.id}
                      className="bg-accent/50 text-muted-foreground rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold"
                    >
                      {v.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="border-primary/30 bg-muted/20 rounded-2xl border border-dashed p-5">
          <div className="mb-3">
            <h5 className="text-foreground text-sm font-semibold">
              Add New Category
            </h5>
            <p className="text-muted-foreground text-xs">
              Use this keyword in a brand new skill category.
            </p>
          </div>
          <div className="flex gap-3">
            <Input
              value={newCategoryName}
              disabled={disabled}
              placeholder="e.g. Testing"
              aria-label="New skill category name"
              onChange={(event) => setNewCategoryName(event.target.value)}
            />
            <Button
              type="button"
              variant={selectedNewCategory ? 'default' : 'outline'}
              disabled={!canToggleNewCategory}
              onClick={handleToggleNewCategory}
            >
              {selectedNewCategory ? 'Selected' : 'Use Category'}
            </Button>
          </div>
          {existingCategory && trimmedNewCategoryName ? (
            <p className="text-muted-foreground mt-2 text-xs">
              Category already exists. Select "{existingCategory.name}" above.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
