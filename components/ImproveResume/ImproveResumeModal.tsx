'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { TImproveEdit, TImproveQuestion } from '@/types/aiImprove';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { QuestionsList } from './QuestionsList';
import { EditReviewList } from './EditReviewList';
import { Sparkles, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type TPhase = 'idle' | 'loading' | 'questions' | 'generating' | 'review';

type TImproveResumeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId?: string;
  onDone: () => void;
};

/** Modal for AI resume improvement flow: questions → edits → review → apply. */
export function ImproveResumeModal({
  open,
  onOpenChange,
  resumeId,
  onDone
}: TImproveResumeModalProps) {
  const id = resumeId as Id<'resumes'> | undefined;
  const queryClient = useQueryClient();

  const [phase, setPhase] = useState<TPhase>('idle');
  const [threadId, setThreadId] = useState<Id<'aiThreads'> | null>(null);
  const [questions, setQuestions] = useState<TImproveQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [edits, setEdits] = useState<TImproveEdit[]>([]);
  const [acceptedSet, setAcceptedSet] = useState<Set<number>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const createThread = useMutation(api.aiImprove.createThread);
  const sendUserMessage = useMutation(api.aiImprove.sendUserMessage);
  const generateQuestions = useAction(api.aiImproveActions.generateQuestions);
  const generateEdits = useAction(api.aiImproveActions.generateEdits);
  const applyEdits = useMutation(api.aiImprove.applyImproveEdits);

  /** Reset all state when modal closes. */
  const resetState = useCallback(() => {
    setPhase('idle');
    setThreadId(null);
    setQuestions([]);
    setAnswers([]);
    setEdits([]);
    setAcceptedSet(new Set());
    setIsApplying(false);
    setShowConfirm(false);
  }, []);

  useEffect(() => {
    if (!open) resetState();
  }, [open, resetState]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) resetState();
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetState]
  );

  /** Start flow: create thread → generate questions. */
  const handleStart = async () => {
    if (!id) return;
    setPhase('loading');
    try {
      const newThreadId = await createThread({ resumeId: id });
      setThreadId(newThreadId);
      const result = await generateQuestions({ threadId: newThreadId });
      setQuestions(result.questions);
      setAnswers(new Array(result.questions.length).fill(''));
      setPhase('questions');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to analyze resume');
      setPhase('idle');
    }
  };

  /** Submit answers → generate edits. */
  const handleAnalyzeAnswers = async () => {
    if (!threadId) return;
    setPhase('generating');
    try {
      const answeredQuestions = questions
        .map((q, i) => ({ ...q, answer: answers[i]?.trim() ?? '' }))
        .filter((q) => q.answer.length > 0);

      if (answeredQuestions.length === 0) {
        toast.error('Answer at least one question before submitting.');
        setPhase('questions');
        return;
      }

      /** Save answers as text for audit trail. */
      const answersText = answeredQuestions
        .map((q) => `Q: ${q.question}\nA: ${q.answer}`)
        .join('\n\n');
      await sendUserMessage({ threadId, content: answersText });

      const result = await generateEdits({ threadId, answeredQuestions });
      const resultEdits = result.edits as TImproveEdit[];
      setEdits(resultEdits);
      setAcceptedSet(new Set(resultEdits.map((_, i) => i)));
      setPhase('review');
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Failed to generate improvements'
      );
      setPhase('questions');
    }
  };

  /** Toggle accept/reject for an edit. */
  const handleToggle = (index: number) => {
    setAcceptedSet((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  /** Apply accepted edits to the current resume in-place. */
  const handleApply = async () => {
    if (!threadId || acceptedSet.size === 0) return;
    setIsApplying(true);
    try {
      const acceptedEdits = edits.filter((_, i) => acceptedSet.has(i));
      await applyEdits({
        threadId,
        edits: JSON.stringify(acceptedEdits)
      });
      toast.success('AI improvements applied to your resume');
      void queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
      void queryClient.invalidateQueries({ queryKey: ['resume'] });
      onDone();
      handleOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to apply edits');
    } finally {
      setIsApplying(false);
      setShowConfirm(false);
    }
  };

  const hasAnswers = answers.some((a) => a.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="dark:bg-card flex !h-[70vh] !max-h-none !w-[50vw] !max-w-none flex-col !gap-0 overflow-hidden rounded-3xl border border-white/20 bg-white/80 !p-0 shadow-[0_12px_40px_rgba(45,51,55,0.06)] backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="bg-primary flex h-7 w-7 items-center justify-center rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                {phase === 'review'
                  ? 'Step 2: Review & Apply'
                  : 'Optimization Phase 01'}
              </span>
            </div>
            <h2 className="text-foreground text-2xl font-extrabold tracking-tight">
              {phase === 'review'
                ? 'Atomic Edits'
                : 'AI Interview: Strengthening Your Impact'}
            </h2>
            {phase !== 'review' && (
              <p className="text-muted-foreground mt-1 text-sm">
                Answer targeted questions to surface missing metrics and
                strengthen your resume.
              </p>
            )}
          </div>
          <button
            onClick={() => handleOpenChange(false)}
            className="text-muted-foreground hover:bg-muted rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {phase === 'idle' && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground text-sm">
                The AI will analyze your resume and ask targeted questions to
                improve weak bullets with hard metrics.
              </p>
              <button
                onClick={handleStart}
                className="from-primary to-primary/80 shadow-primary/20 flex items-center gap-2 rounded-xl bg-gradient-to-br px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                Start Resume Review
              </button>
            </div>
          )}

          {phase === 'loading' && (
            <div className="text-muted-foreground flex h-full items-center justify-center gap-2 text-sm">
              <Spinner className="h-4 w-4" /> Analyzing your resume...
            </div>
          )}

          {phase === 'questions' && (
            <QuestionsList
              questions={questions}
              answers={answers}
              onAnswerChange={(i, val) => {
                setAnswers((prev) => {
                  const next = [...prev];
                  next[i] = val;
                  return next;
                });
              }}
            />
          )}

          {phase === 'generating' && (
            <div className="text-muted-foreground flex h-full items-center justify-center gap-2 text-sm">
              <Spinner className="h-4 w-4" /> Generating improvements...
            </div>
          )}

          {phase === 'review' && (
            <EditReviewList
              edits={edits}
              acceptedSet={acceptedSet}
              onToggle={handleToggle}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-border/30 flex items-center justify-between border-t px-8 py-5">
          <button
            onClick={() => handleOpenChange(false)}
            className="text-muted-foreground text-sm font-semibold transition-colors hover:text-foreground"
          >
            Cancel
          </button>

          {phase === 'questions' && (
            <button
              onClick={handleAnalyzeAnswers}
              disabled={!hasAnswers}
              className={cn(
                'flex items-center gap-2 rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-all',
                hasAnswers
                  ? 'from-primary to-primary/80 shadow-primary/20 bg-gradient-to-br hover:scale-[1.02] active:scale-95'
                  : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
              )}
            >
              <Sparkles className="h-4 w-4" />
              Analyze Answers
            </button>
          )}

          {phase === 'review' && (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={acceptedSet.size === 0 || isApplying}
              className={cn(
                'flex items-center gap-2 rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-all',
                acceptedSet.size > 0 && !isApplying
                  ? 'from-primary to-primary/80 shadow-primary/20 bg-gradient-to-br hover:scale-[1.02] active:scale-95'
                  : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
              )}
            >
              Apply to Current
            </button>
          )}
        </div>
      </DialogContent>

      {/* Confirmation dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="dark:bg-card rounded-2xl border border-white/20 bg-white/90 backdrop-blur-xl sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-foreground text-lg font-bold">Apply changes?</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                This will modify your current resume with the {acceptedSet.size} accepted{' '}
                {acceptedSet.size === 1 ? 'edit' : 'edits'}. This action cannot be undone.
              </p>
            </div>
            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="text-muted-foreground hover:bg-muted flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="from-primary to-primary/80 flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br px-4 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
              >
                {isApplying ? (
                  <>
                    <Spinner className="h-4 w-4" /> Applying...
                  </>
                ) : (
                  'Apply'
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
