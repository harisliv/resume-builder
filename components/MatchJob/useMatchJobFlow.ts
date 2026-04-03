'use client';

import type {
  TAccumulatedEdits,
  TExtractedKeyword,
  TPlacementTarget
} from '@/types/aiKeywords';
import type { TResumeForm } from '@/types/schema';
import { useCallback, useState } from 'react';
import type { TMatchJobTab } from './matchJob.utils';

export type TPhase = 'input' | 'analyzing' | 'matching' | 'review';

type TWarningDialogOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'default' | 'destructive' | 'success';
};

type TUseMatchJobFlowProps = {
  onOpenChange: (open: boolean) => void;
  confirm: (options: TWarningDialogOptions) => Promise<boolean>;
};

/** Builds a stable key for a selected target. */
function getTargetKey(target: TPlacementTarget) {
  return target.type === 'skill'
    ? `skill:${target.categoryId}`
    : `highlight:${target.experienceId}:${target.highlightId}`;
}

/** Toggles a string value in a set without mutating previous state. */
function toggleSetValue(values: Set<string>, value: string) {
  const next = new Set(values);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/** Builds pre-accepted review ids from accumulated edits. */
function getAcceptedReviewState(edits: TAccumulatedEdits) {
  return {
    acceptedHighlights: new Set(edits.highlightEdits.map((edit) => edit.reviewId)),
    acceptedSkills: new Set(edits.skillAdditions.map((addition) => addition.reviewId))
  };
}

/** Manages the local Match Job modal flow state. */
export function useMatchJobFlow({
  onOpenChange,
  confirm
}: TUseMatchJobFlowProps) {
  const [phase, setPhase] = useState<TPhase>('input');
  const [jobDescription, setJobDescription] = useState('');
  const [keywords, setKeywords] = useState<TExtractedKeyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [processedKeywords, setProcessedKeywords] = useState<Set<string>>(
    new Set()
  );
  const [selectedTargets, setSelectedTargets] = useState<TPlacementTarget[]>(
    []
  );
  const [workingResume, setWorkingResume] = useState<TResumeForm | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [accumulatedEdits, setAccumulatedEdits] = useState<TAccumulatedEdits>({
    highlightEdits: [],
    skillAdditions: []
  });
  const [acceptedHighlights, setAcceptedHighlights] = useState<Set<string>>(
    new Set()
  );
  const [acceptedSkills, setAcceptedSkills] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<TMatchJobTab>('Personal Info');

  const hasEdits =
    accumulatedEdits.highlightEdits.length > 0 ||
    accumulatedEdits.skillAdditions.length > 0;

  /** Resets the full modal flow back to its initial state. */
  const resetFlowState = useCallback(() => {
    setPhase('input');
    setJobDescription('');
    setKeywords([]);
    setSelectedKeyword(null);
    setProcessedKeywords(new Set());
    setSelectedTargets([]);
    setWorkingResume(null);
    setJobTitle('');
    setEnhancing(false);
    setAccumulatedEdits({
      highlightEdits: [],
      skillAdditions: []
    });
    setAcceptedHighlights(new Set());
    setAcceptedSkills(new Set());
    setIsApplying(false);
    setActiveTab('Personal Info');
  }, []);

  /** Attempts to close the modal, warning when progress would be lost. */
  const handleOpenChange = useCallback(
    async (nextOpen: boolean) => {
      if (!nextOpen && (phase !== 'input' || jobDescription.trim())) {
        const ok = await confirm({
          title: 'Discard progress?',
          description:
            'You have unsaved changes. Closing will discard all your matching progress.',
          confirmLabel: 'Discard',
          variant: 'destructive'
        });
        if (!ok) return;
      }

      if (!nextOpen) resetFlowState();
      onOpenChange(nextOpen);
    },
    [confirm, jobDescription, onOpenChange, phase, resetFlowState]
  );

  /** Moves the modal into analyzing state before keyword extraction. */
  const startAnalyze = useCallback(() => {
    setPhase('analyzing');
  }, []);

  /** Stores extracted keyword results and enters matching state. */
  const finishAnalyze = useCallback(
    (result: { title: string; keywords: TExtractedKeyword[] }, resume: TResumeForm) => {
      setJobTitle(result.title);
      setKeywords(result.keywords);
      setWorkingResume(resume);
      setPhase('matching');
    },
    []
  );

  /** Returns the flow to input after analyze failure. */
  const failAnalyze = useCallback(() => {
    setPhase('input');
  }, []);

  /** Toggles a placement target on the resume panel. */
  const toggleTarget = useCallback((target: TPlacementTarget) => {
    setSelectedTargets((prev) => {
      const key = getTargetKey(target);
      const exists = prev.some((item) => getTargetKey(item) === key);
      return exists
        ? prev.filter((item) => getTargetKey(item) !== key)
        : [...prev, target];
    });
  }, []);

  /** Finalizes a keyword pass and resets matching selections. */
  const finishKeywordPass = useCallback(
    (nextResume: TResumeForm, nextEdits: TAccumulatedEdits, keyword: string | null) => {
      setWorkingResume(nextResume);
      setAccumulatedEdits(nextEdits);
      if (keyword) {
        setProcessedKeywords((prev) => new Set(prev).add(keyword));
      }
      setSelectedKeyword(null);
      setSelectedTargets([]);
    },
    []
  );

  /** Moves to review phase with all current edits pre-accepted. */
  const goToReview = useCallback(() => {
    const next = getAcceptedReviewState(accumulatedEdits);
    setAcceptedHighlights(next.acceptedHighlights);
    setAcceptedSkills(next.acceptedSkills);
    setPhase('review');
  }, [accumulatedEdits]);

  /** Returns from review to matching. */
  const goToMatching = useCallback(() => {
    setPhase('matching');
  }, []);

  /** Toggles a reviewed highlight edit. */
  const toggleAcceptedHighlight = useCallback((reviewId: string) => {
    setAcceptedHighlights((prev) => toggleSetValue(prev, reviewId));
  }, []);

  /** Toggles a reviewed skill addition. */
  const toggleAcceptedSkill = useCallback((reviewId: string) => {
    setAcceptedSkills((prev) => toggleSetValue(prev, reviewId));
  }, []);

  return {
    phase,
    jobDescription,
    setJobDescription,
    keywords,
    selectedKeyword,
    setSelectedKeyword,
    processedKeywords,
    selectedTargets,
    workingResume,
    jobTitle,
    enhancing,
    setEnhancing,
    accumulatedEdits,
    acceptedHighlights,
    acceptedSkills,
    isApplying,
    setIsApplying,
    activeTab,
    setActiveTab,
    hasEdits,
    handleOpenChange,
    startAnalyze,
    finishAnalyze,
    failAnalyze,
    toggleTarget,
    finishKeywordPass,
    goToReview,
    goToMatching,
    toggleAcceptedHighlight,
    toggleAcceptedSkill
  };
}
