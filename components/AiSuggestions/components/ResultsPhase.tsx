'use client';

import type { Dispatch } from 'react';
import type { TModelResult } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Copy, RotateCcw } from 'lucide-react';
import {
  ResultsContainer,
  ResultsScrollArea
} from '../styles/ai-suggestions-dialog.styles';
import { AiSuggestionsView } from '../AiSuggestionsView';
import { JdKeywordHighlight } from '../utils/JdKeywordHighlight';
import type { TDialogAction } from '../utils/dialogReducer';

type TResultsPhaseProps = {
  result: TModelResult;
  currentData: TResumeForm;
  jobDescription: string;
  dispatch: Dispatch<TDialogAction>;
  isAdmin: boolean;
  isRegenerating: boolean;
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
  jobDescription,
  dispatch,
  isAdmin,
  isRegenerating,
  onBack,
  onRegenerate,
  onApply,
  onCreateVersion
}: TResultsPhaseProps) {
  const hasError = !!result.error;
  const jdKeywords = result.jdKeywords ?? [];

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
        {!hasError && (
          <>
            {jdKeywords.length > 0 && (
              <details className="mb-4">
                <summary className="text-muted-foreground cursor-pointer text-sm font-medium">
                  Job Description ({jdKeywords.length} keywords matched)
                </summary>
                <div className="bg-muted/50 mt-2 max-h-48 overflow-y-auto rounded-lg p-3">
                  <JdKeywordHighlight
                    text={jobDescription}
                    keywords={jdKeywords}
                    className="text-muted-foreground whitespace-pre-wrap text-sm"
                  />
                </div>
              </details>
            )}
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
          </>
        )}
      </ResultsScrollArea>
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
