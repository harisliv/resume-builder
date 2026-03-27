'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import type { TExtractedKeyword, TPlacementTarget } from '@/types/aiKeywords';
import type { TResumeForm } from '@/types/schema';

type TKeywordPlacementStepProps = {
  keyword: TExtractedKeyword;
  /** Current resume state (may include edits from prior iterations). */
  currentResume: TResumeForm;
  /** Progress indicator (e.g., "3 of 7"). */
  progress: { current: number; total: number };
  isPlacing: boolean;
  onPlace: (targets: TPlacementTarget[]) => void;
  onSkip: () => void;
};

/** Single keyword placement step — lets user pick where to add a keyword. */
export function KeywordPlacementStep({
  keyword,
  currentResume,
  progress,
  isPlacing,
  onPlace,
  onSkip
}: TKeywordPlacementStepProps) {
  const [selectedTargets, setSelectedTargets] = useState<Map<string, TPlacementTarget>>(new Map());

  /** Toggle a target on/off. */
  const toggle = (key: string, target: TPlacementTarget) => {
    setSelectedTargets(prev => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.set(key, target);
      }
      return next;
    });
  };

  const handlePlace = () => {
    onPlace([...selectedTargets.values()]);
  };

  const skillCategories = currentResume.skills ?? [];
  const experiences = currentResume.experience ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Keyword {progress.current} of {progress.total}
        </span>
      </div>

      <div>
        <p className="text-base font-semibold">&ldquo;{keyword.canonicalName}&rdquo;</p>
        <p className="text-sm text-muted-foreground mt-1">{keyword.context}</p>
      </div>

      {/* Skill categories */}
      {skillCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Add to skills</h4>
          <div className="flex flex-col gap-1">
            {skillCategories.map(cat => {
              const key = `skill:${cat.id}`;
              return (
                <label key={key} className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-muted/50">
                  <Checkbox
                    checked={selectedTargets.has(key)}
                    onCheckedChange={() => toggle(key, { type: 'skill', categoryId: cat.id })}
                  />
                  <span className="text-sm">{cat.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Experience highlights */}
      {experiences.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Weave into highlights</h4>
          <div className="flex flex-col gap-1">
            {experiences.map(exp =>
              (exp.highlights ?? []).map(h => {
                const key = `highlight:${exp.id}:${h.id}`;
                return (
                  <label key={key} className="flex items-start gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-muted/50">
                    <Checkbox
                      className="mt-0.5"
                      checked={selectedTargets.has(key)}
                      onCheckedChange={() => toggle(key, {
                        type: 'highlight',
                        experienceId: exp.id,
                        highlightId: h.id,
                        currentText: h.value
                      })}
                    />
                    <div className="text-sm">
                      <span className="font-medium">{exp.company}</span>
                      <span className="text-muted-foreground"> &mdash; </span>
                      <span>{h.value}</span>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onSkip} disabled={isPlacing}>
          Skip
        </Button>
        <Button onClick={handlePlace} disabled={selectedTargets.size === 0 || isPlacing}>
          {isPlacing ? <><Spinner className="mr-2 h-4 w-4" /> Placing...</> : 'Place Keyword'}
        </Button>
      </div>
    </div>
  );
}
