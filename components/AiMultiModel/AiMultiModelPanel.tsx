'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import type { TModelSlot } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { AiSuggestionsView } from '@/components/AiSuggestions/AiSuggestionsView';
import {
  MultiModelScrollArea,
  ModelButton
} from './styles/ai-multi-model.styles';

type TAiMultiModelPanelProps = {
  models: TModelSlot[];
  activeModelIdx: number;
  currentData: TResumeForm;
  onSetActiveModel: (idx: number) => void;
  onToggleSummary: () => void;
  onToggleExperienceField: (expIdx: number, field: 'description' | 'highlight', highlightIdx?: number) => void;
  onToggleSkill: (categoryIdx: number, skillIdx: number) => void;
  onRemoveSkill: (category: string, skillIdx: number) => void;
  onCreateVersion: () => void;
};

/** Formats cost in dollars to 4 decimal places. */
function formatCost(cost?: number): string {
  if (cost == null) return '';
  return `$${cost.toFixed(4)}`;
}

/** Formats duration in ms to seconds. */
function formatDuration(ms?: number): string {
  if (ms == null) return '';
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Right panel for multi-model comparison: model tabs + active model results + footer actions.
 */
export function AiMultiModelPanel({
  models,
  activeModelIdx,
  currentData,
  onSetActiveModel,
  onToggleSummary,
  onToggleExperienceField,
  onToggleSkill,
  onRemoveSkill,
  onCreateVersion
}: TAiMultiModelPanelProps) {
  const activeSlot = models[activeModelIdx];
  const active = activeSlot?.result;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Horizontal model tabs */}
      <div className="mb-3 flex shrink-0 gap-1 border-b pb-2">
        {models.map((slot, i) => (
          <ModelButton
            key={slot.config.id}
            active={i === activeModelIdx}
            hasError={slot.status === 'error'}
            onClick={() => onSetActiveModel(i)}
          >
            <span className="flex items-center gap-1.5">
              {slot.status === 'pending' && <Loader2 className="size-3.5 animate-spin" />}
              {slot.status === 'error' && <AlertCircle className="size-3.5" />}
              {slot.config.label}
            </span>
            {slot.result && (
              <span className="text-muted-foreground text-xs">
                {[formatDuration(slot.result.durationMs), formatCost(slot.result.cost)].filter(Boolean).join(' · ')}
              </span>
            )}
          </ModelButton>
        ))}
      </div>

      {/* Active model content */}
      <MultiModelScrollArea>
        {activeSlot?.status === 'pending' ? (
          <div className="text-muted-foreground flex items-center gap-2 p-4 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Generating…
          </div>
        ) : active?.error ? (
          <div className="text-destructive p-4 text-sm">{active.error}</div>
        ) : active?.editedSuggestions && active.selection ? (
          <AiSuggestionsView
            suggestions={active.editedSuggestions}
            currentData={currentData}
            selection={active.selection}
            onToggleSummary={onToggleSummary}
            onToggleExperienceField={onToggleExperienceField}
            onToggleSkill={onToggleSkill}
            onRemoveSkill={onRemoveSkill}
          />
        ) : (
          <div className="text-muted-foreground p-4 text-sm">No results</div>
        )}
      </MultiModelScrollArea>

      {active && !active.error && (
        <div className="flex shrink-0 justify-end gap-2 border-t pt-3">
          <Button onClick={onCreateVersion}>Create Version</Button>
        </div>
      )}
    </div>
  );
}
