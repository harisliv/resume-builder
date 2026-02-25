'use client';

import type { Dispatch } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Sparkles } from 'lucide-react';
import { InputContainer } from '../styles/ai-suggestions-dialog.styles';
import type { TDialogAction } from '../utils/dialogReducer';

type TInputPhaseProps = {
  jobDescription: string;
  error: string | null;
  isGenerating: boolean;
  dispatch: Dispatch<TDialogAction>;
  onGenerate: () => void;
};

/**
 * Input phase of the suggestions dialog: textarea, generate button, error display.
 */
export function InputPhase({
  jobDescription,
  error,
  isGenerating,
  dispatch,
  onGenerate
}: TInputPhaseProps) {
  return (
    <InputContainer>
      <Textarea
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) => dispatch({ type: 'SET_JOB_DESCRIPTION', payload: e.target.value })}
        className="min-h-36 leading-relaxed"
        disabled={isGenerating}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button
        onClick={onGenerate}
        disabled={isGenerating || !jobDescription.trim()}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Spinner className="size-4" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Generate Suggestions
          </>
        )}
      </Button>
    </InputContainer>
  );
}
