'use client';

import type { Dispatch } from 'react';
import type { TModelResult } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Copy, RotateCcw } from 'lucide-react';
import { ErrorMessage } from '@/components/ui/error-message';
import {
  ResultsContainer,
  ResultsScrollArea
} from '../styles/ai-suggestions-dialog.styles';
import { AiSuggestionsView } from '../AiSuggestionsView';
import type { TDialogAction } from '../utils/dialogReducer';

type TResultsPhaseProps = {
  result: TModelResult;
  currentData: TResumeForm;
  dispatch: Dispatch<TDialogAction>;
  isAdmin: boolean;
  isRegenerating: boolean;
  regenerateError: string | null;
  onBack: () => void;
  onRegenerate: () => void;
  onApply: () => void;
  onCreateVersion: () => void;
};

/**
 * Results phase of the suggestions dialog: scrollable suggestions view + action footer.
 */
export function ResultsPhase({
  result,
  currentData,
  dispatch,
  isAdmin,
  isRegenerating,
  regenerateError,
  onBack,
  onRegenerate,
  onApply,
  onCreateVersion
}: TResultsPhaseProps) {
  const hasError = !!result.error;

  return (
    <ResultsContainer>
      {isAdmin && (result.cost != null || result.durationMs != null) && (
        <p className="text-muted-foreground text-xs">
          {result.cost != null && `Cost: $${result.cost.toFixed(4)}`}
          {result.cost != null && result.durationMs != null && ' · '}
          {result.durationMs != null && `${(result.durationMs / 1000).toFixed(1)}s`}
        </p>
      )}
      <ResultsScrollArea>
        {hasError ? (
          <div className="flex h-full items-center justify-center">
            <ErrorMessage>{result.error}</ErrorMessage>
          </div>
        ) : (
          <AiSuggestionsView
            suggestions={result.editedSuggestions!}
            currentData={currentData}
            selection={result.selection!}
            onToggleSummary={() => dispatch({ type: 'TOGGLE_SUMMARY' })}
            onToggleExperienceField={(expIdx, field, highlightIdx) =>
              dispatch({ type: 'TOGGLE_EXPERIENCE_FIELD', expIdx, field, highlightIdx })
            }
            onToggleSkill={(categoryIdx, skillIdx) =>
              dispatch({ type: 'TOGGLE_SKILL', categoryIdx, skillIdx })
            }
          />
        )}
      </ResultsScrollArea>
      {regenerateError && <ErrorMessage>{regenerateError}</ErrorMessage>}
      <DialogFooter className="shrink-0">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="outline" onClick={onRegenerate} disabled={isRegenerating}>
          <RotateCcw className="size-3.5" />
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </Button>
        <Button variant="secondary" onClick={onCreateVersion} disabled={hasError}>
          <Copy className="size-3.5" />
          Create New Version
        </Button>
        <Button onClick={onApply} disabled={hasError}>Apply to Current</Button>
      </DialogFooter>
    </ResultsContainer>
  );
}
