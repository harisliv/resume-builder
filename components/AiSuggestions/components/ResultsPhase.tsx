'use client';

import type { Dispatch } from 'react';
import type { TModelResult } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, Copy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ErrorMessage } from '@/components/ui/error-message';
import {
  ResultsContainer,
  ModelSidebar,
  ModelLayout,
  ModelScrollArea
} from '../styles/ai-suggestions-dialog.styles';
import { AiSuggestionsView } from '../AiSuggestionsView';
import type { TDialogAction } from '../utils/dialogReducer';

type TResultsPhaseProps = {
  results: TModelResult[];
  activeModelIdx: number;
  currentData: TResumeForm;
  dispatch: Dispatch<TDialogAction>;
  isRegenerating: boolean;
  regenerateError: string | null;
  onBack: () => void;
  onRegenerate: () => void;
  onApply: () => void;
  onCreateVersion: () => void;
};

/**
 * Results phase of the suggestions dialog: model sidebar + comparison view + action footer.
 * Failed models show an error state in the sidebar and right panel.
 */
export function ResultsPhase({
  results,
  activeModelIdx,
  currentData,
  dispatch,
  isRegenerating,
  regenerateError,
  onBack,
  onRegenerate,
  onApply,
  onCreateVersion
}: TResultsPhaseProps) {
  const active = results[activeModelIdx];
  const activeHasError = !!active.error;

  return (
    <ResultsContainer>
      <ModelLayout>
        <ModelSidebar>
          {results.map((result, idx) => (
            <button
              key={result.modelId}
              onClick={() => dispatch({ type: 'SET_ACTIVE_MODEL', idx })}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors',
                idx === activeModelIdx
                  ? 'bg-primary text-primary-foreground'
                  : result.error
                    ? 'text-destructive hover:bg-muted'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {result.error && <AlertCircle className="size-3 shrink-0" />}
              {result.label}
            </button>
          ))}
        </ModelSidebar>
        <ModelScrollArea>
          {activeHasError ? (
            <div className="flex h-full items-center justify-center">
              <ErrorMessage>{active.error}</ErrorMessage>
            </div>
          ) : (
            <AiSuggestionsView
              suggestions={active.editedSuggestions!}
              currentData={currentData}
              selection={active.selection!}
              onToggleSummary={() => dispatch({ type: 'TOGGLE_SUMMARY' })}
              onToggleExperienceField={(expIdx, field, highlightIdx) =>
                dispatch({ type: 'TOGGLE_EXPERIENCE_FIELD', expIdx, field, highlightIdx })
              }
              onToggleSkill={(categoryIdx, skillIdx) =>
                dispatch({ type: 'TOGGLE_SKILL', categoryIdx, skillIdx })
              }
            />
          )}
        </ModelScrollArea>
      </ModelLayout>
      {regenerateError && <ErrorMessage>{regenerateError}</ErrorMessage>}
      <DialogFooter className="shrink-0">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="outline" onClick={onRegenerate} disabled={isRegenerating}>
          <RotateCcw className="size-3.5" />
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </Button>
        <Button variant="secondary" onClick={onCreateVersion} disabled={activeHasError}>
          <Copy className="size-3.5" />
          Create New Version
        </Button>
        <Button onClick={onApply} disabled={activeHasError}>Apply to Current</Button>
      </DialogFooter>
    </ResultsContainer>
  );
}
