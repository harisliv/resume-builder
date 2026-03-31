'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeForm } from '@/types/schema';
import type {
  TExtractedKeyword,
  TPlacementTarget,
  TPlacementResult,
  TAccumulatedEdits
} from '@/types/aiKeywords';
import { useGetResumeById } from '@/hooks/useGetResumeById';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { JdPanel } from './JdPanel';
import { DisplayTabs } from './DisplayTabs';
import { EnhanceResultModal } from './EnhanceResultModal';
import { KeywordReviewView } from './KeywordReviewView';
import {
  Sparkles,
  X,
  Lightbulb,
  Wand2,
  BarChart3,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TPhase = 'input' | 'analyzing' | 'matching' | 'review';

type TMatchJobModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId?: string;
  onDone: (newResumeId: Id<'resumes'>) => void;
};

/** Creates a stable client-side id for a review item. */
const createReviewId = () => crypto.randomUUID();

/** Collapses accepted highlight edits to the latest edit per highlight. */
const getLatestAcceptedHighlightEdits = (
  highlightEdits: TAccumulatedEdits['highlightEdits'],
  acceptedHighlights: Set<string>
) => {
  const latestByHighlight = new Map<string, TAccumulatedEdits['highlightEdits'][number]>();

  highlightEdits.forEach((edit) => {
    if (!acceptedHighlights.has(edit.reviewId)) return;
    latestByHighlight.set(`${edit.experienceId}:${edit.highlightId}`, edit);
  });

  return Array.from(latestByHighlight.values()).map((edit) => ({
    experienceId: edit.experienceId,
    highlightId: edit.highlightId,
    newText: edit.newText
  }));
};

/** Dedupes accepted skill additions before apply. */
const getAcceptedSkillAdditions = (
  skillAdditions: TAccumulatedEdits['skillAdditions'],
  acceptedSkills: Set<string>
) => {
  const uniqueSkills = new Map<string, TAccumulatedEdits['skillAdditions'][number]>();

  skillAdditions.forEach((addition) => {
    if (!acceptedSkills.has(addition.reviewId)) return;
    uniqueSkills.set(`${addition.categoryId}:${addition.value}`, addition);
  });

  return Array.from(uniqueSkills.values()).map((addition) => ({
    categoryId: addition.categoryId,
    value: addition.value
  }));
};

/** Modal for AI job description matching flow. */
export function MatchJobModal({
  open,
  onOpenChange,
  resumeId,
  onDone
}: TMatchJobModalProps) {
  const id = resumeId as Id<'resumes'> | undefined;
  const queryClient = useQueryClient();
  const { form, isLoading } = useGetResumeById(id);

  // State machine
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

  // Review phase state
  const [acceptedHighlights, setAcceptedHighlights] = useState<Set<string>>(
    new Set()
  );
  const [acceptedSkills, setAcceptedSkills] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);

  // Nested modal state
  const [modalResult, setModalResult] = useState<TPlacementResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const confirm = useWarningDialog();
  const extractAction = useAction(api.aiKeywords.extractKeywords);
  const placeAction = useAction(api.aiKeywords.placeKeyword);
  const applyMutation = useMutation(api.aiImprove.applyKeywordEdits);

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
    setModalResult(null);
    setModalOpen(false);
  }, []);

  /** Clears local state whenever the modal closes. */
  useEffect(() => {
    if (!open) {
      resetFlowState();
    }
  }, [open, resetFlowState]);

  /** Attempt to close — show warning if work in progress. */
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
    [onOpenChange, resetFlowState, phase, jobDescription, confirm]
  );

  /** Analyze JD and extract keywords. */
  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !id) return;
    setPhase('analyzing');
    try {
      const result = await extractAction({
        resumeId: id,
        jobDescription: jobDescription.trim()
      });
      setJobTitle(result.title);
      setKeywords(result.keywords);
      setWorkingResume(form);
      setPhase('matching');
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Failed to extract keywords'
      );
      setPhase('input');
    }
  };

  /** Toggle a placement target on the right panel. */
  const handleToggleTarget = (target: TPlacementTarget) => {
    setSelectedTargets((prev) => {
      const key =
        target.type === 'skill'
          ? `skill:${target.categoryId}`
          : `highlight:${target.experienceId}:${target.highlightId}`;
      const exists = prev.some((t) => {
        const tKey =
          t.type === 'skill'
            ? `skill:${t.categoryId}`
            : `highlight:${t.experienceId}:${t.highlightId}`;
        return tKey === key;
      });
      return exists
        ? prev.filter((t) => {
            const tKey =
              t.type === 'skill'
                ? `skill:${t.categoryId}`
                : `highlight:${t.experienceId}:${t.highlightId}`;
            return tKey !== key;
          })
        : [...prev, target];
    });
  };

  /** Enhance: call placeKeyword with selected targets. */
  const handleEnhance = async () => {
    if (!selectedKeyword || selectedTargets.length === 0 || !id) return;
    setEnhancing(true);
    try {
      const result = await placeAction({
        resumeId: id,
        keyword: selectedKeyword,
        targets: selectedTargets.map((t) => {
          if (t.type === 'skill')
            return { type: 'skill' as const, categoryId: t.categoryId };
          return {
            type: 'highlight' as const,
            experienceId: t.experienceId,
            highlightId: t.highlightId,
            currentText: t.currentText
          };
        })
      });
      setModalResult(result);
      setModalOpen(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to enhance');
    } finally {
      setEnhancing(false);
    }
  };

  /** Apply accepted edits from nested modal. */
  const handleModalConfirm = (
    acceptedHighlights: Set<string>,
    acceptedSkills: Set<string>
  ) => {
    if (!modalResult || !workingResume) return;

    const newHighlightEdits = modalResult.updatedHighlights.filter((e) =>
      acceptedHighlights.has(`${e.experienceId}:${e.highlightId}`)
    );
    const newSkillAdds = modalResult.addedSkills.filter((a) =>
      acceptedSkills.has(`${a.categoryId}:${a.value}`)
    );

    const updated = { ...workingResume };
    if (newHighlightEdits.length && updated.experience) {
      updated.experience = updated.experience.map((exp) => {
        const edits = newHighlightEdits.filter(
          (e) => e.experienceId === exp.id
        );
        if (!edits.length) return exp;
        return {
          ...exp,
          highlights: (exp.highlights ?? []).map((h) => {
            const edit = edits.find((e) => e.highlightId === h.id);
            return edit ? { ...h, value: edit.newText } : h;
          })
        };
      });
    }
    if (newSkillAdds.length && updated.skills) {
      updated.skills = updated.skills.map((cat) => {
        const adds = newSkillAdds.filter((a) => a.categoryId === cat.id);
        if (!adds.length) return cat;
        return {
          ...cat,
          values: [
            ...cat.values,
            ...adds.map((a) => ({ id: crypto.randomUUID(), value: a.value }))
          ]
        };
      });
    }
    setWorkingResume(updated);

    setAccumulatedEdits((prev) => ({
      highlightEdits: [
        ...prev.highlightEdits,
        ...newHighlightEdits.map((edit) => ({
          ...edit,
          reviewId: createReviewId()
        }))
      ],
      skillAdditions: [
        ...prev.skillAdditions,
        ...newSkillAdds.map((addition) => ({
          ...addition,
          reviewId: createReviewId()
        }))
      ]
    }));

    if (selectedKeyword) {
      setProcessedKeywords((prev) => new Set(prev).add(selectedKeyword));
    }
    setSelectedKeyword(null);
    setSelectedTargets([]);
    setModalOpen(false);
    setModalResult(null);
  };

  /** Transition to review phase with all edits pre-accepted. */
  const handleGoToReview = () => {
    setAcceptedHighlights(
      new Set(accumulatedEdits.highlightEdits.map((edit) => edit.reviewId))
    );
    setAcceptedSkills(
      new Set(accumulatedEdits.skillAdditions.map((addition) => addition.reviewId))
    );
    setPhase('review');
  };

  /** Apply accepted edits from review and create new resume. */
  const handleApplyReview = async () => {
    if (!id) return;
    setIsApplying(true);
    try {
      const filteredHighlights = getLatestAcceptedHighlightEdits(
        accumulatedEdits.highlightEdits,
        acceptedHighlights
      );
      const filteredSkills = getAcceptedSkillAdditions(
        accumulatedEdits.skillAdditions,
        acceptedSkills
      );

      const newResumeId = await applyMutation({
        resumeId: id,
        title: jobTitle || 'JD Tailored Resume',
        highlightEdits: filteredHighlights,
        skillAdditions: filteredSkills
      });
      toast.success('New tailored resume created');
      void queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
      void queryClient.invalidateQueries({ queryKey: ['resume'] });
      onDone(newResumeId);
      handleOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to apply edits');
    } finally {
      setIsApplying(false);
    }
  };

  const canEnhance =
    phase === 'matching' &&
    !!selectedKeyword &&
    selectedTargets.length > 0 &&
    !enhancing;
  const resume = workingResume ?? form;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="dark:bg-card flex !h-[70vh] !max-h-none !w-[70vw] !max-w-none flex-col !gap-0 overflow-hidden rounded-3xl border border-white/20 bg-white !p-0 shadow-[0_12px_40px_rgba(45,51,55,0.06)]"
      >
        {/* Header */}
        <div className="border-border flex flex-col border-b">
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-foreground text-xl font-bold tracking-tight">
                  AI Matching Analysis
                </h2>
                {jobTitle && (
                  <p className="text-muted-foreground text-xs font-medium">
                    Optimizing your resume for the {jobTitle} role
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleOpenChange(false)}
              className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-full border border-border p-2 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Hint bar */}
          {phase === 'matching' && (
            <div className="border-primary/10 bg-primary/5 flex items-center gap-2 border-t px-8 py-2">
              <Lightbulb className="text-primary h-3.5 w-3.5" />
              <p className="text-primary/80 text-[11px] font-semibold tracking-wider uppercase">
                Select an orange keyword on the left, then click a highlight
                area on the right to enhance.
              </p>
            </div>
          )}
          {phase === 'review' && (
            <div className="border-primary/10 bg-primary/5 flex items-center gap-2 border-t px-8 py-2">
              <ClipboardCheck className="text-primary h-3.5 w-3.5" />
              <p className="text-primary/80 text-[11px] font-semibold tracking-wider uppercase">
                Review all changes before applying. Uncheck any you want to
                skip.
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        {phase === 'review' ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
            <KeywordReviewView
              edits={accumulatedEdits}
              acceptedHighlights={acceptedHighlights}
              acceptedSkills={acceptedSkills}
              onToggleHighlight={(reviewId) => {
                setAcceptedHighlights((prev) => {
                  const next = new Set(prev);
                  next.has(reviewId)
                    ? next.delete(reviewId)
                    : next.add(reviewId);
                  return next;
                });
              }}
              onToggleSkill={(reviewId) => {
                setAcceptedSkills((prev) => {
                  const next = new Set(prev);
                  next.has(reviewId) ? next.delete(reviewId) : next.add(reviewId);
                  return next;
                });
              }}
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Left column */}
            <div className="border-border flex min-h-0 w-1/2 flex-col border-r">
              {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : (
                <JdPanel
                  phase={phase}
                  jobDescription={jobDescription}
                  onJobDescriptionChange={setJobDescription}
                  keywords={keywords}
                  selectedKeyword={selectedKeyword}
                  onSelectKeyword={setSelectedKeyword}
                  processedKeywords={processedKeywords}
                />
              )}
            </div>

            {/* Right column */}
            <div className="dark:bg-card flex w-1/2 flex-col overflow-hidden bg-white">
              <DisplayTabs
                resume={resume}
                selectedTargets={selectedTargets}
                onToggleTarget={handleToggleTarget}
                disabled={phase !== 'matching'}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-border bg-muted/20 flex items-center justify-end gap-4 border-t px-8 py-5">
          {phase === 'input' && (
            <button
              onClick={handleAnalyze}
              disabled={!jobDescription.trim()}
              className={cn(
                'flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-white shadow-lg transition-all',
                jobDescription.trim()
                  ? 'from-primary to-primary/80 shadow-primary/20 bg-gradient-to-br cursor-pointer hover:brightness-110'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60 shadow-none'
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Analyze Job Description
            </button>
          )}

          {phase === 'analyzing' && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Spinner className="h-4 w-4" />
              Analyzing...
            </div>
          )}

          {phase === 'matching' && (
            <>
              {hasEdits && (
                <button
                  onClick={handleGoToReview}
                  className="mr-auto flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-bold text-muted-foreground transition-colors cursor-pointer hover:bg-accent hover:text-foreground dark:bg-card"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Review Changes
                </button>
              )}
              <button
                onClick={handleEnhance}
                disabled={!canEnhance}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-colors',
                  canEnhance
                    ? 'from-primary to-primary/80 shadow-primary/20 bg-gradient-to-br text-white shadow-lg cursor-pointer hover:brightness-110'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60 shadow-none'
                )}
              >
                <Wand2 className="h-4 w-4" />
                {enhancing ? 'Enhancing...' : 'Enhance'}
              </button>
            </>
          )}

          {phase === 'review' && (
            <>
              <button
                onClick={() => setPhase('matching')}
                className="mr-auto border-border text-muted-foreground hover:bg-accent hover:text-foreground dark:bg-card flex items-center gap-2 rounded-full border bg-white px-6 py-3 text-sm font-bold transition-colors cursor-pointer"
              >
                Back to Matching
              </button>
              <button
                onClick={handleApplyReview}
                disabled={
                  (acceptedHighlights.size + acceptedSkills.size) === 0 || isApplying
                }
                className="from-primary to-primary/80 shadow-primary/20 flex items-center gap-2 rounded-full bg-gradient-to-br px-8 py-3 text-sm font-bold text-white shadow-lg transition-all cursor-pointer hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplying ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Applying...
                  </>
                ) : (
                  'Apply Changes'
                )}
              </button>
            </>
          )}
        </div>

        {/* Nested enhance review modal */}
        {modalResult && (
          <EnhanceResultModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            result={modalResult}
            onConfirm={handleModalConfirm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
