'use client';

import { AlertCircle } from 'lucide-react';
import type { TModelResult } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { AiSuggestionsView } from '@/components/AiSuggestions/AiSuggestionsView';
import {
  MultiModelScrollArea,
  ModelButton
} from './styles/ai-multi-model.styles';

type TAiMultiModelPanelProps = {
  results: TModelResult[];
  activeModelIdx: number;
  currentData: TResumeForm;
  onSetActiveModel: (idx: number) => void;
  onToggleSummary: () => void;
  onToggleExperienceField: (expIdx: number, field: 'description' | 'highlight', highlightIdx?: number) => void;
  onToggleSkill: (categoryIdx: number, skillIdx: number) => void;
  onRemoveSkill: (category: string, skillIdx: number) => void;
  onApply: () => void;
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
 * Right panel for multi-model comparison: model sidebar + active model results + footer actions.
 */
export function AiMultiModelPanel({
  results,
  activeModelIdx,
  currentData,
  onSetActiveModel,
  onToggleSummary,
  onToggleExperienceField,
  onToggleSkill,
  onRemoveSkill,
  onApply,
  onCreateVersion
}: TAiMultiModelPanelProps) {
  const active = results[activeModelIdx];

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Horizontal model tabs at the top */}
      <div className="mb-3 flex shrink-0 gap-1 border-b pb-2">
        {results.map((r, i) => (
          <ModelButton
            key={r.modelId}
            active={i === activeModelIdx}
            hasError={!!r.error}
            onClick={() => onSetActiveModel(i)}
          >
            <span className="flex items-center gap-1.5">
              {r.error && <AlertCircle className="size-3.5" />}
              {r.label}
            </span>
            <span className="text-muted-foreground text-xs">
              {[formatDuration(r.durationMs), formatCost(r.cost)].filter(Boolean).join(' · ')}
            </span>
          </ModelButton>
        ))}
      </div>

      {/* Scrollable results below */}
      <MultiModelScrollArea>
        {active?.error ? (
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
          <Button variant="outline" onClick={onCreateVersion}>Create Version</Button>
          <Button onClick={onApply}>Apply</Button>
        </div>
      )}
    </div>
  );
}
