'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { TImproveEdit, TImproveQuestion } from '@/types/aiImprove';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type TPhase = 'idle' | 'loading' | 'questions' | 'generating' | 'review';

type TWarningDialogOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'default' | 'destructive' | 'success';
};

type TUseImproveFlowProps = {
  open: boolean;
  resumeId?: string;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
  confirm: (options: TWarningDialogOptions) => Promise<boolean>;
};

/** Whether the process has started and closing should trigger a warning. */
const isProcessActive = (phase: TPhase) => phase !== 'idle';

/** Manages the local Improve Resume modal flow state. */
export function useImproveFlow({
  open,
  resumeId,
  onOpenChange,
  onDone,
  confirm
}: TUseImproveFlowProps) {
  const id = resumeId as Id<'resumes'> | undefined;
  const queryClient = useQueryClient();

  const [phase, setPhase] = useState<TPhase>('idle');
  const [threadId, setThreadId] = useState<Id<'aiThreads'> | null>(null);
  const [questions, setQuestions] = useState<TImproveQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [edits, setEdits] = useState<TImproveEdit[]>([]);
  const [selectedSet, setSelectedSet] = useState<Set<number>>(new Set());
  const [isApplying, setIsApplying] = useState(false);

  const createThread = useMutation(api.aiImprove.createThread);
  const sendUserMessage = useMutation(api.aiImprove.sendUserMessage);
  const generateQuestions = useAction(api.aiImproveActions.generateQuestions);
  const generateEdits = useAction(api.aiImproveActions.generateEdits);
  const applyEdits = useMutation(api.aiImprove.applyImproveEdits);

  /** Resets all state when modal closes. */
  const resetState = useCallback(() => {
    setPhase('idle');
    setThreadId(null);
    setQuestions([]);
    setAnswers([]);
    setEdits([]);
    setSelectedSet(new Set());
    setIsApplying(false);
  }, []);

  useEffect(() => {
    if (!open) resetState();
  }, [open, resetState]);

  /** Attempts to close the modal, warning when progress would be lost. */
  const handleClose = useCallback(async () => {
    if (isProcessActive(phase)) {
      const ok = await confirm({
        title: 'Discard progress?',
        description:
          'The AI improvement process is in progress. Closing now will discard all work.',
        confirmLabel: 'Discard',
        variant: 'destructive'
      });
      if (!ok) return;
    }
    resetState();
    onOpenChange(false);
  }, [phase, confirm, resetState, onOpenChange]);

  /** Intercepts dialog open/close to show warning on close. */
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        void handleClose();
        return;
      }
      onOpenChange(nextOpen);
    },
    [handleClose, onOpenChange]
  );

  /** Start flow: create thread → generate questions. */
  const handleStart = useCallback(async () => {
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
  }, [id, createThread, generateQuestions]);

  /** Submit answers → generate edits. */
  const handleAnalyzeAnswers = useCallback(async () => {
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

      const answersText = answeredQuestions
        .map((q) => `Q: ${q.question}\nA: ${q.answer}`)
        .join('\n\n');
      await sendUserMessage({ threadId, content: answersText });

      const result = await generateEdits({ threadId, answeredQuestions });
      const resultEdits = result.edits as TImproveEdit[];
      setEdits(resultEdits);
      setSelectedSet(new Set());
      setPhase('review');
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Failed to generate improvements'
      );
      setPhase('questions');
    }
  }, [threadId, questions, answers, sendUserMessage, generateEdits]);

  /** Toggles whether an edit should be included when applying changes. */
  const handleToggle = useCallback((index: number) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }, []);

  /** Applies selected edits via warning dialog confirmation. */
  const handleApply = useCallback(async () => {
    if (!threadId || selectedSet.size === 0) return;
    const ok = await confirm({
      title: 'Apply changes?',
      description: `This will modify your current resume with ${selectedSet.size} selected ${selectedSet.size === 1 ? 'edit' : 'edits'}. This action cannot be undone.`,
      confirmLabel: 'Apply',
      variant: 'default'
    });
    if (!ok) return;

    setIsApplying(true);
    try {
      const selectedEdits = edits.filter((_, i) => selectedSet.has(i));
      await applyEdits({
        threadId,
        edits: JSON.stringify(selectedEdits)
      });
      toast.success('AI improvements applied to your resume');
      void queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
      void queryClient.invalidateQueries({ queryKey: ['resume'] });
      onDone();
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to apply edits');
    } finally {
      setIsApplying(false);
    }
  }, [
    threadId,
    selectedSet,
    confirm,
    edits,
    applyEdits,
    queryClient,
    onDone,
    onOpenChange
  ]);

  /** Updates a single answer by index. */
  const updateAnswer = useCallback((index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const hasAnswers = answers.some((a) => a.trim().length > 0);

  return {
    phase,
    questions,
    answers,
    edits,
    selectedSet,
    isApplying,
    hasAnswers,
    handleOpenChange,
    handleClose,
    handleStart,
    handleAnalyzeAnswers,
    handleToggle,
    handleApply,
    updateAnswer
  };
}
