'use client';

import { useState, useReducer } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeForm } from '@/types/schema';
import type { TAiSuggestions, TSuggestionSelection } from '@/types/aiSuggestions';
import { createDefaultSelection } from '@/types/aiSuggestions';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AiSuggestionsView } from '../AiSuggestionsView';
import { toast } from 'sonner';
import usePrivileges from '@/hooks/usePrivileges';

type TImproveTabProps = {
  resumeId: Id<'resumes'>;
  currentData: TResumeForm;
  onApplyImprovements: (newResumeId: Id<'resumes'>) => void;
};

type TPhase = 'idle' | 'loading' | 'roast' | 'questions' | 'generating' | 'ready';

type TSelectionAction =
  | { type: 'INIT'; payload: TSuggestionSelection }
  | { type: 'TOGGLE_SUMMARY' }
  | { type: 'TOGGLE_EXPERIENCE_FIELD'; expIdx: number; field: 'description' | 'highlight'; highlightIdx?: number }
  | { type: 'TOGGLE_SKILL'; categoryIdx: number; skillIdx: number };

/** Reducer for selection state in the ready phase. */
function selectionReducer(state: TSuggestionSelection, action: TSelectionAction): TSuggestionSelection {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'TOGGLE_SUMMARY':
      return { ...state, summary: !state.summary };
    case 'TOGGLE_EXPERIENCE_FIELD': {
      const experience = [...state.experience];
      const exp = { ...experience[action.expIdx] };
      if (action.field === 'description') {
        exp.description = !exp.description;
      } else if (action.highlightIdx !== undefined) {
        exp.highlights = [...exp.highlights];
        exp.highlights[action.highlightIdx] = !exp.highlights[action.highlightIdx];
      }
      experience[action.expIdx] = exp;
      return { ...state, experience };
    }
    case 'TOGGLE_SKILL': {
      const skills = [...state.skills];
      const cat = { ...skills[action.categoryIdx], selected: [...skills[action.categoryIdx].selected] };
      cat.selected[action.skillIdx] = !cat.selected[action.skillIdx];
      skills[action.categoryIdx] = cat;
      return { ...state, skills };
    }
    default:
      return state;
  }
}

const emptySelection: TSuggestionSelection = { summary: false, experience: [], skills: [] };

/**
 * Phased AI improvement tab.
 * Flow: Start → Roast → Questions (one by one) → Generate patch → Review & Apply.
 */
export function ImproveTab({
  resumeId,
  currentData,
  onApplyImprovements
}: TImproveTabProps) {
  const [threadId, setThreadId] = useState<Id<'aiThreads'> | null>(null);
  const [phase, setPhase] = useState<TPhase>('idle');
  const [roastItems, setRoastItems] = useState<string[]>([]);
  const [questions, setQuestions] = useState<{ question: string; context: string }[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [suggestions, setSuggestions] = useState<TAiSuggestions | null>(null);
  const [rawPatch, setRawPatch] = useState<string | null>(null);
  const [selection, dispatchSelection] = useReducer(selectionReducer, emptySelection);
  const [newTitle, setNewTitle] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const { isAdmin } = usePrivileges();

  const createThread = useMutation(api.aiImprove.createThread);
  const sendUserMessage = useMutation(api.aiImprove.sendUserMessage);
  const generateTurn = useAction(api.aiImproveActions.generateAssistantTurn);
  const applyImprovements = useMutation(api.aiImprove.applyImprovements);

  /** Parse resumePatch JSON string into TAiSuggestions. */
  const parsePatch = (patchStr: string): TAiSuggestions | null => {
    try {
      const patch = JSON.parse(patchStr);
      return {
        summary: patch.summary,
        experience: patch.experience,
        skills: patch.skills
      };
    } catch {
      return null;
    }
  };

  /** Start: create fresh thread and generate roast. */
  const handleStart = async () => {
    setPhase('loading');
    try {
      const newThreadId = await createThread({ resumeId });
      setThreadId(newThreadId);
      const result = await generateTurn({ threadId: newThreadId });
      setTotalCost(result.cost ?? 0);
      if (result.structuredPayload) {
        setRoastItems(result.structuredPayload.roastItems ?? []);
        setQuestions(result.structuredPayload.questions ?? []);
        setAnswers(new Array(result.structuredPayload.questions?.length ?? 0).fill(''));
      }
      setPhase('roast');
    } catch {
      toast.error('Failed to generate roast');
      setPhase('idle');
    }
  };

  /** Move from roast to first question. */
  const handleGoToQuestions = () => {
    setCurrentQuestionIdx(0);
    setPhase('questions');
  };

  /** Advance to next question or generate patch if all answered. */
  const advanceOrGenerate = async (updatedAnswers: string[]) => {
    setCurrentAnswer('');
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      if (!threadId) return;
      setPhase('generating');
      try {
        const answersText = questions
          .map((q, i) => `Q: ${q.question}\nA: ${updatedAnswers[i] || 'No changes needed, leave as is.'}`)
          .join('\n\n');
        await sendUserMessage({ threadId, content: answersText });
        const result = await generateTurn({ threadId });
        setTotalCost((prev) => prev + (result.cost ?? 0));
        if (result.structuredPayload?.resumePatch) {
          setRawPatch(result.structuredPayload.resumePatch);
          const parsed = parsePatch(result.structuredPayload.resumePatch);
          if (parsed) {
            setSuggestions(parsed);
            dispatchSelection({ type: 'INIT', payload: createDefaultSelection(parsed) });
          }
        }
        setPhase('ready');
      } catch {
        toast.error('Failed to generate improvements');
        setPhase('questions');
      }
    }
  };

  /** Submit current answer and advance. */
  const handleNextQuestion = async () => {
    if (!currentAnswer.trim()) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = currentAnswer.trim();
    setAnswers(newAnswers);
    await advanceOrGenerate(newAnswers);
  };

  /** Skip question — leave section unchanged. */
  const handleSkipQuestion = async () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = '';
    setAnswers(newAnswers);
    await advanceOrGenerate(newAnswers);
  };

  /** Create new AI-improved resume with selected improvements. */
  const handleApply = async () => {
    if (!threadId || !suggestions || !rawPatch || !newTitle.trim()) return;
    try {
      const newResumeId = await applyImprovements({
        threadId,
        resumePatch: rawPatch,
        title: newTitle.trim()
      });
      onApplyImprovements(newResumeId);
      toast.success('AI resume created!');
    } catch {
      toast.error('Failed to create AI resume');
    }
  };

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Idle */}
      {phase === 'idle' && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            Get a brutally honest review of your resume, then answer targeted
            questions to improve it.
          </p>
          <Button onClick={handleStart}>
            Start Resume Review
          </Button>
        </div>
      )}

      {/* Loading */}
      {phase === 'loading' && (
        <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" /> Roasting your resume...
        </div>
      )}

      {/* Roast */}
      {phase === 'roast' && (
        <>
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-3">
              {roastItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-muted/50 p-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </ScrollArea>
          {questions.length > 0 && (
            <Button onClick={handleGoToQuestions}>
              Go to Questions ({questions.length})
            </Button>
          )}
        </>
      )}

      {/* Questions — one at a time */}
      {phase === 'questions' && (
        <div className="flex flex-1 flex-col gap-3">
          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`size-2 rounded-full ${
                  i === currentQuestionIdx
                    ? 'bg-primary'
                    : i < currentQuestionIdx
                      ? 'bg-primary/40'
                      : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground">
            {currentQuestionIdx + 1} of {questions.length}
          </div>
          {questions[currentQuestionIdx].context && (
            <blockquote className="border-l-2 border-muted-foreground/30 pl-3 text-xs text-muted-foreground italic">
              {questions[currentQuestionIdx].context}
            </blockquote>
          )}
          <div className="rounded-lg bg-muted p-3 text-sm">
            {questions[currentQuestionIdx].question}
          </div>
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Your answer..."
            className="min-h-[80px] flex-1 resize-none"
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleNextQuestion();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentAnswer.length}/500
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSkipQuestion}
              >
                Leave as is
              </Button>
              <Button
                size="sm"
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
              >
                {currentQuestionIdx < questions.length - 1
                  ? 'Next'
                  : 'Get Improvements'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Generating */}
      {phase === 'generating' && (
        <div className="flex flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" /> Generating improvements...
        </div>
      )}

      {/* Ready — show diff view like Match Job flow */}
      {phase === 'ready' && suggestions && (
        <>
          <div className="-mx-4 max-h-[50vh] overflow-y-auto px-4">
            <AiSuggestionsView
              suggestions={suggestions}
              currentData={currentData}
              selection={selection}
              onToggleSummary={() => dispatchSelection({ type: 'TOGGLE_SUMMARY' })}
              onToggleExperienceField={(expIdx, field, highlightIdx) =>
                dispatchSelection({ type: 'TOGGLE_EXPERIENCE_FIELD', expIdx, field, highlightIdx })
              }
              onToggleSkill={(categoryIdx, skillIdx) =>
                dispatchSelection({ type: 'TOGGLE_SKILL', categoryIdx, skillIdx })
              }
            />
          </div>
          {isAdmin && totalCost > 0 && (
            <p className="text-xs text-muted-foreground text-right">
              Cost: ${totalCost.toFixed(4)}
            </p>
          )}
          <div className="flex items-center gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New resume title..."
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleApply();
                }
              }}
            />
            <Button onClick={handleApply} disabled={!newTitle.trim()}>
              Create AI Resume
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
