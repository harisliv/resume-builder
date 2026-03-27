'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import type { TResumeForm } from '@/types/schema';
import type { TPlacementTarget } from '@/types/aiKeywords';

type TDisplaySkillsTabProps = {
  skills: TResumeForm['skills'];
  selectedTargets: TPlacementTarget[];
  onToggleTarget: (target: TPlacementTarget) => void;
  disabled: boolean;
};

/** Skills accordion with checkboxes per category. */
export function DisplaySkillsTab({
  skills,
  selectedTargets,
  onToggleTarget,
  disabled
}: TDisplaySkillsTabProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(skills.map(s => s.id))
  );

  const isChecked = (catId: string) =>
    selectedTargets.some(t => t.type === 'skill' && t.categoryId === catId);

  const toggleOpen = (id: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="mb-8">
      <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Skill Category Alignment
      </h4>
      <div className="space-y-4">
        {skills.map(cat => {
          const isOpen = openCategories.has(cat.id);
          return (
            <div
              key={cat.id}
              className={cn(
                'overflow-hidden rounded-2xl border transition-all',
                isOpen ? 'border-primary/20' : 'border-border'
              )}
            >
              {/* Summary row */}
              <div
                className="flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-muted/50"
                onClick={() => toggleOpen(cat.id)}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    checked={isChecked(cat.id)}
                    disabled={disabled}
                    onChange={e => {
                      e.stopPropagation();
                      onToggleTarget({ type: 'skill', categoryId: cat.id });
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                  <span className="text-[15px] font-bold text-foreground">
                    {cat.name}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-muted-foreground transition-transform',
                    isOpen && 'rotate-180'
                  )}
                />
              </div>
              {/* Content */}
              {isOpen && (
                <div className="border-t border-border/50 px-5 pt-2 pb-5">
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
