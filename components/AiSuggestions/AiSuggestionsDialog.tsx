'use client';

import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { TAiSuggestions } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Sparkles, Copy } from 'lucide-react';
import {
  DialogContentWrapper,
  DialogTitleRow
} from './styles/ai-suggestions-dialog.styles';
import { AiSuggestionsView } from './AiSuggestionsView';

type TAiSuggestionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: Id<'resumes'>;
  currentData: TResumeForm;
  onApply: (suggestions: TAiSuggestions) => void;
  onCreateNewVersion: (suggestions: TAiSuggestions) => void;
};

export function AiSuggestionsDialog({
  open,
  onOpenChange,
  resumeId,
  currentData,
  onApply,
  onCreateNewVersion
}: TAiSuggestionsDialogProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [suggestions, setSuggestions] = useState<TAiSuggestions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useAction(
    api.aiSuggestions.generateResumeSuggestions
  );

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    setError(null);
    setIsGenerating(true);
    try {
      const result = await generateSuggestions({
        resumeId,
        jobDescription: jobDescription.trim()
      });
      setSuggestions(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to generate suggestions'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!suggestions) return;
    onApply(suggestions);
    onOpenChange(false);
    reset();
  };

  const handleCreateVersion = () => {
    if (!suggestions) return;
    onCreateNewVersion(suggestions);
    onOpenChange(false);
    reset();
  };

  const reset = () => {
    setSuggestions(null);
    setJobDescription('');
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContentWrapper>
        <DialogHeader>
          <DialogTitleRow>
            <Sparkles className="size-4" />
            AI Resume Suggestions
          </DialogTitleRow>
          <DialogDescription>
            Paste a job description to get tailored suggestions for your resume.
          </DialogDescription>
        </DialogHeader>

        {!suggestions ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-36"
              disabled={isGenerating}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Button
              onClick={handleGenerate}
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
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 gap-3">
            <div className="flex-1 min-h-0 overflow-hidden">
              <AiSuggestionsView
                suggestions={suggestions}
                currentData={currentData}
              />
            </div>
            <DialogFooter className="shrink-0">
              <Button variant="outline" onClick={() => setSuggestions(null)}>
                Back
              </Button>
              <Button variant="secondary" onClick={handleCreateVersion}>
                <Copy className="size-3.5" />
                Create New Version
              </Button>
              <Button onClick={handleApply}>Apply to Current</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContentWrapper>
    </Dialog>
  );
}
