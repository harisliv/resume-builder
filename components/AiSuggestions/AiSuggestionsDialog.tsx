'use client';

import { useState, useCallback } from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type {
  TAiSuggestions,
  TSuggestionSelection
} from '@/types/aiSuggestions';
import { createDefaultSelection } from '@/types/aiSuggestions';
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
import { buildFilteredSuggestions } from './utils/filterSuggestions';
import { MOCK_SUGGESTIONS } from './mockSuggestions';

type TAiSuggestionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: Id<'resumes'>;
  currentData: TResumeForm;
  onApply: (suggestions: TAiSuggestions) => void;
  onCreateNewVersion: (suggestions: TAiSuggestions) => void;
  /** When true, Generate uses mock data instead of API (for testing) */
  mockMode?: boolean;
};

/**
 * Dialog for generating AI resume suggestions with selective acceptance.
 * Manages selection toggles, skill removal, and filtered apply.
 */
export function AiSuggestionsDialog({
  open,
  onOpenChange,
  resumeId,
  currentData,
  onApply,
  onCreateNewVersion,
  mockMode = false
}: TAiSuggestionsDialogProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [suggestions, setSuggestions] = useState<TAiSuggestions | null>(null);
  const [selection, setSelection] = useState<TSuggestionSelection | null>(null);
  const [editedSuggestions, setEditedSuggestions] =
    useState<TAiSuggestions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useAction(
    api.aiSuggestions.generateResumeSuggestions
  );

  /** Initializes suggestions + selection state from API/mock result. */
  const initSuggestions = (result: TAiSuggestions) => {
    setSuggestions(result);
    setEditedSuggestions(structuredClone(result));
    setSelection(createDefaultSelection(result));
  };

  const handleGenerate = async () => {
    if (!mockMode && !jobDescription.trim()) return;
    setError(null);
    setIsGenerating(true);
    try {
      if (mockMode) {
        initSuggestions(MOCK_SUGGESTIONS);
      } else {
        const result = await generateSuggestions({
          resumeId,
          jobDescription: jobDescription.trim()
        });
        initSuggestions(result);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to generate suggestions'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  /** Builds filtered suggestions from current selection + edited skills. */
  const getFiltered = (): TAiSuggestions | null => {
    if (!editedSuggestions || !selection) return null;
    return buildFilteredSuggestions(editedSuggestions, selection);
  };

  const handleApply = () => {
    const filtered = getFiltered();
    if (!filtered) return;
    onApply(filtered);
    onOpenChange(false);
    reset();
  };

  const handleCreateVersion = () => {
    const filtered = getFiltered();
    if (!filtered) return;
    onCreateNewVersion(filtered);
    onOpenChange(false);
    reset();
  };

  const reset = () => {
    setSuggestions(null);
    setEditedSuggestions(null);
    setSelection(null);
    setJobDescription('');
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  /** Toggles summary selection. */
  const handleToggleSummary = useCallback(() => {
    setSelection((prev) => (prev ? { ...prev, summary: !prev.summary } : prev));
  }, []);

  /** Toggles an experience description or highlight selection. */
  const handleToggleExperienceField = useCallback(
    (
      expIdx: number,
      field: 'description' | 'highlight',
      highlightIdx?: number
    ) => {
      setSelection((prev) => {
        if (!prev) return prev;
        const next = { ...prev, experience: [...prev.experience] };
        const exp = { ...next.experience[expIdx] };
        if (field === 'description') {
          exp.description = !exp.description;
        } else if (highlightIdx !== undefined) {
          exp.highlights = [...exp.highlights];
          exp.highlights[highlightIdx] = !exp.highlights[highlightIdx];
        }
        next.experience[expIdx] = exp;
        return next;
      });
    },
    []
  );

  /** Removes a skill from editedSuggestions by index. */
  const handleRemoveSkill = useCallback((skillIdx: number) => {
    setEditedSuggestions((prev) => {
      if (!prev?.skills) return prev;
      return {
        ...prev,
        skills: prev.skills.filter((_, i) => i !== skillIdx)
      };
    });
  }, []);

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
          <div className="-mx-4 flex max-h-[50vh] flex-col gap-3 overflow-y-auto p-4">
            <Textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-36 leading-relaxed"
              disabled={isGenerating}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!mockMode && !jobDescription.trim())}
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
          <div className="flex flex-col gap-3">
            <div className="-mx-4 max-h-[50vh] overflow-y-auto px-4">
              {editedSuggestions && selection && (
                <AiSuggestionsView
                  suggestions={editedSuggestions}
                  currentData={currentData}
                  selection={selection}
                  onToggleSummary={handleToggleSummary}
                  onToggleExperienceField={handleToggleExperienceField}
                  onRemoveSkill={handleRemoveSkill}
                />
              )}
            </div>
            <DialogFooter className="shrink-0">
              <Button
                variant="outline"
                onClick={() => {
                  setSuggestions(null);
                  setEditedSuggestions(null);
                  setSelection(null);
                }}
              >
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
