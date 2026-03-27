'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DiffHighlight } from '@/components/AiSuggestions/utils/diffHighlight';
import type { TPlacementResult } from '@/types/aiKeywords';

type TEnhanceResultModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: TPlacementResult;
  onConfirm: (acceptedHighlights: Set<string>, acceptedSkills: Set<string>) => void;
};

/** Modal showing before/after diffs for each enhanced item. */
export function EnhanceResultModal({
  open,
  onOpenChange,
  result,
  onConfirm
}: TEnhanceResultModalProps) {
  // Pre-accept all
  const [acceptedHighlights, setAcceptedHighlights] = useState<Set<string>>(
    () => new Set(result.updatedHighlights.map(e => `${e.experienceId}:${e.highlightId}`))
  );
  const [acceptedSkills, setAcceptedSkills] = useState<Set<string>>(
    () => new Set(result.addedSkills.map(a => `${a.categoryId}:${a.value}`))
  );

  /** Toggle highlight acceptance. */
  const toggleHighlight = (expId: string, hlId: string) => {
    const key = `${expId}:${hlId}`;
    setAcceptedHighlights(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  /** Toggle skill acceptance. */
  const toggleSkill = (catId: string, value: string) => {
    const key = `${catId}:${value}`;
    setAcceptedSkills(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Changes</DialogTitle>
        </DialogHeader>

        {result.updatedHighlights.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Highlight Changes</h4>
            {result.updatedHighlights.map(edit => {
              const key = `${edit.experienceId}:${edit.highlightId}`;
              return (
                <label key={key} className="flex items-start gap-2 rounded border p-3 cursor-pointer">
                  <Checkbox
                    className="mt-1"
                    checked={acceptedHighlights.has(key)}
                    onCheckedChange={() => toggleHighlight(edit.experienceId, edit.highlightId)}
                  />
                  <div className="flex-1">
                    <DiffHighlight current={edit.oldText} suggested={edit.newText} view="both" />
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {result.addedSkills.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Added Skills</h4>
            {result.addedSkills.map(skill => {
              const key = `${skill.categoryId}:${skill.value}`;
              return (
                <label key={key} className="flex items-center gap-2 rounded border p-3 cursor-pointer">
                  <Checkbox
                    checked={acceptedSkills.has(key)}
                    onCheckedChange={() => toggleSkill(skill.categoryId, skill.value)}
                  />
                  <span className="text-sm">
                    Add <strong>{skill.value}</strong> to category
                  </span>
                </label>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(acceptedHighlights, acceptedSkills)}>
            Accept Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
