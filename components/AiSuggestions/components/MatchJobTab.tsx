'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeForm } from '@/types/schema';
import type {
  TExtractedKeyword,
  TKeywordExtractionResult,
  TPlacementTarget,
  TAccumulatedEdits
} from '@/types/aiKeywords';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { KeywordSelectionView } from './KeywordSelectionView';
import { KeywordPlacementStep } from './KeywordPlacementStep';
import { KeywordReviewView } from './KeywordReviewView';

type TPhase = 'idle' | 'extracting' | 'selecting' | 'placing' | 'review' | 'done';

type TMatchJobTabProps = {
  resumeId: Id<'resumes'>;
  currentData: TResumeForm;
  /** Reports phase changes so dialog can track token consumption. */
  onPhaseChange?: (hasConsumedTokens: boolean) => void;
  /** Called when a new resume version is created. */
  onNewVersionCreated?: (newResumeId: string) => void;
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

/** Iterative JD keyword matching flow. */
export function MatchJobTab({
  resumeId,
  currentData,
  onPhaseChange,
  onNewVersionCreated
}: TMatchJobTabProps) {
  const [phase, setPhase] = useState<TPhase>('idle');
  const [jobDescription, setJobDescription] = useState('');
  const [keywords, setKeywords] = useState<TKeywordExtractionResult | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [keywordQueue, setKeywordQueue] = useState<TExtractedKeyword[]>([]);
  const [currentKeywordIdx, setCurrentKeywordIdx] = useState(0);
  const [accumulatedEdits, setAccumulatedEdits] = useState<TAccumulatedEdits>({ highlightEdits: [], skillAdditions: [] });
  const [workingResume, setWorkingResume] = useState<TResumeForm>(currentData);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [jdTitle, setJdTitle] = useState('');

  // Review toggles
  const [acceptedHighlights, setAcceptedHighlights] = useState<Set<string>>(new Set());
  const [acceptedSkills, setAcceptedSkills] = useState<Set<string>>(new Set());

  const extractAction = useAction(api.aiKeywords.extractKeywords);
  const placeAction = useAction(api.aiKeywords.placeKeyword);
  const applyMutation = useMutation(api.aiImprove.applyKeywordEdits);

  /** Notify parent of token consumption. */
  useEffect(() => {
    onPhaseChange?.(phase !== 'idle');
  }, [phase, onPhaseChange]);

  /** Phase 1: Extract keywords from JD. */
  const handleExtract = useCallback(async () => {
    if (!jobDescription.trim()) return;
    setPhase('extracting');
    try {
      const result = await extractAction({ resumeId, jobDescription: jobDescription.trim() });
      if (result.cost) {
        console.log(`[extractKeywords] cost: $${result.cost.toFixed(6)}`);
        setTotalCost(prev => prev + result.cost!);
      }
      setJdTitle(result.title);
      setKeywords(result);
      // Pre-select all keywords
      const preselected = new Set<string>();
      result.keywords.forEach((kw: { canonicalName: string }) => preselected.add(kw.canonicalName));
      setSelectedKeywords(preselected);
      setPhase('selecting');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to extract keywords');
      setPhase('idle');
    }
  }, [jobDescription, resumeId, extractAction]);

  /** Phase 2: Build keyword queue and start placement. */
  const handleContinueToPlacement = useCallback(() => {
    if (!keywords) return;
    const queue = keywords.keywords
      .filter(kw => selectedKeywords.has(kw.canonicalName));

    setKeywordQueue(queue);
    setCurrentKeywordIdx(0);
    setAccumulatedEdits({ highlightEdits: [], skillAdditions: [] });
    setWorkingResume(currentData);
    setPhase('placing');
  }, [keywords, selectedKeywords, currentData]);

  /** Place a single keyword. */
  const handlePlace = useCallback(async (targets: TPlacementTarget[]) => {
    const kw = keywordQueue[currentKeywordIdx];
    if (!kw) return;
    setIsPlacing(true);
    try {
      const result = await placeAction({
        resumeId,
        keyword: kw.canonicalName,
        targets: targets.map(t => {
          if (t.type === 'skill') return { type: 'skill' as const, categoryId: t.categoryId };
          return { type: 'highlight' as const, experienceId: t.experienceId, highlightId: t.highlightId, currentText: t.currentText };
        })
      });

      if (result.cost) {
        console.log(`[placeKeyword] keyword="${kw.keyword}" cost: $${result.cost.toFixed(6)}`);
        setTotalCost(prev => prev + result.cost!);
      }

      // Accumulate edits
      setAccumulatedEdits(prev => ({
        highlightEdits: [
          ...prev.highlightEdits,
          ...result.updatedHighlights.map((edit: { experienceId: string; highlightId: string; newText: string; oldText: string }) => ({
            ...edit,
            reviewId: createReviewId()
          }))
        ],
        skillAdditions: [
          ...prev.skillAdditions,
          ...result.addedSkills.map((addition: { categoryId: string; value: string }) => ({
            ...addition,
            reviewId: createReviewId()
          }))
        ]
      }));

      // Update working resume with new highlight texts
      setWorkingResume(prev => {
        const updated = { ...prev };
        if (result.updatedHighlights.length && updated.experience) {
          updated.experience = updated.experience.map(exp => {
            const edits = result.updatedHighlights.filter((e: { experienceId: string }) => e.experienceId === exp.id);
            if (!edits.length) return exp;
            return {
              ...exp,
              highlights: (exp.highlights ?? []).map(h => {
                const edit = edits.find((e: { highlightId: string }) => e.highlightId === h.id);
                return edit ? { ...h, value: edit.newText } : h;
              })
            };
          });
        }
        return updated;
      });

      advanceToNext();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to place keyword');
    } finally {
      setIsPlacing(false);
    }
  }, [keywordQueue, currentKeywordIdx, resumeId, placeAction]);

  /** Advance to next keyword or review. */
  const advanceToNext = useCallback(() => {
    const nextIdx = currentKeywordIdx + 1;
    if (nextIdx >= keywordQueue.length) {
      // Move to review — pre-accept all edits
      setAcceptedHighlights(prev => {
        const next = new Set(prev);
        accumulatedEdits.highlightEdits.forEach(edit => next.add(edit.reviewId));
        return next;
      });
      setAcceptedSkills(prev => {
        const next = new Set(prev);
        accumulatedEdits.skillAdditions.forEach(addition => next.add(addition.reviewId));
        return next;
      });
      setPhase('review');
    } else {
      setCurrentKeywordIdx(nextIdx);
    }
  }, [currentKeywordIdx, keywordQueue.length, accumulatedEdits]);

  /** Pre-accept all edits when entering review phase. */
  useEffect(() => {
    if (phase === 'review') {
      setAcceptedHighlights(new Set(
        accumulatedEdits.highlightEdits.map(edit => edit.reviewId)
      ));
      setAcceptedSkills(new Set(
        accumulatedEdits.skillAdditions.map(addition => addition.reviewId)
      ));
    }
  }, [phase, accumulatedEdits]);

  /** Apply accepted edits to DB. */
  const handleApply = useCallback(async () => {
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
        resumeId,
        title: jdTitle || 'JD Tailored Resume',
        highlightEdits: filteredHighlights,
        skillAdditions: filteredSkills
      });

      console.log(`[applyKeywordEdits] total session cost: $${totalCost.toFixed(4)}`);
      toast.success('New tailored resume version created');
      setPhase('done');
      onNewVersionCreated?.(newResumeId);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to apply changes');
    } finally {
      setIsApplying(false);
    }
  }, [accumulatedEdits, acceptedHighlights, acceptedSkills, resumeId, applyMutation, onNewVersionCreated, totalCost, jdTitle]);

  // --- Render by phase ---

  if (phase === 'idle') {
    return (
      <div className="flex flex-col gap-3">
        <Textarea
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          rows={6}
        />
        <Button onClick={handleExtract} disabled={!jobDescription.trim()}>
          Extract Keywords
        </Button>
      </div>
    );
  }

  if (phase === 'extracting') {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <Spinner className="h-6 w-6" />
        <p className="text-sm text-muted-foreground">Analyzing job description...</p>
      </div>
    );
  }

  if (phase === 'selecting' && keywords) {
    return (
      <KeywordSelectionView
        keywords={keywords.keywords}
        selected={selectedKeywords}
        onToggle={kw => {
          setSelectedKeywords(prev => {
            const next = new Set(prev);
            if (next.has(kw)) next.delete(kw);
            else next.add(kw);
            return next;
          });
        }}
        onContinue={handleContinueToPlacement}
      />
    );
  }

  if (phase === 'placing' && keywordQueue[currentKeywordIdx]) {
    const kw = keywordQueue[currentKeywordIdx];
    return (
      <KeywordPlacementStep
        key={kw.canonicalName}
        keyword={kw}
        currentResume={workingResume}
        progress={{ current: currentKeywordIdx + 1, total: keywordQueue.length }}
        isPlacing={isPlacing}
        onPlace={handlePlace}
        onSkip={advanceToNext}
      />
    );
  }

  if (phase === 'review') {
    return (
      <>
      <KeywordReviewView
        edits={accumulatedEdits}
        acceptedHighlights={acceptedHighlights}
        acceptedSkills={acceptedSkills}
        onToggleHighlight={(reviewId) => {
          setAcceptedHighlights(prev => {
            const next = new Set(prev);
            if (next.has(reviewId)) next.delete(reviewId);
            else next.add(reviewId);
            return next;
          });
        }}
        onToggleSkill={(reviewId) => {
          setAcceptedSkills(prev => {
            const next = new Set(prev);
            if (next.has(reviewId)) next.delete(reviewId);
            else next.add(reviewId);
            return next;
          });
        }}
        onApply={handleApply}
        isApplying={isApplying}
      />
      {totalCost > 0 && (
        <p className="text-xs text-muted-foreground text-right pt-1">
          Session cost: ${totalCost.toFixed(4)}
        </p>
      )}
      </>
    );
  }

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8">
        <p className="text-sm font-medium">Keywords applied successfully!</p>
        {totalCost > 0 && (
          <p className="text-xs text-muted-foreground">
            Total session cost: ${totalCost.toFixed(4)}
          </p>
        )}
      </div>
    );
  }

  return null;
}
