'use client';

import { useAction, useMutation } from 'convex/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Dialog } from '@/components/ui/dialog';
import { useGetResumeById } from '@/hooks/useGetResumeById';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { DisplayTabs } from './DisplayTabs';
import { JdPanel } from './JdPanel';
import { KeywordReviewView } from './KeywordReviewView';
import {
  applyPlacementResultToResume,
  createReviewId,
  getAcceptedSkillAdditions,
  getLatestAcceptedHighlightEdits,
  getPlacementTargets,
  getTargetTab,
  getResumeId
} from './matchJob.utils';
import { MatchJobFooter } from './ui/MatchJobFooter';
import { MatchJobHeader } from './ui/MatchJobHeader';
import { MatchJobHintBar } from './ui/MatchJobHintBar';
import { useMatchJobFlow } from './useMatchJobFlow';
import {
  MatchJobBody,
  MatchJobDialogContent,
  MatchJobHeaderSection,
  MatchJobPanel,
  MatchJobReviewPanel
} from './styles/match-job-shell.styles';

type TMatchJobModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId?: string;
  onDone: (newResumeId: Id<'resumes'>) => void;
};

/** Modal for AI job description matching flow. */
export function MatchJobModal({
  open,
  onOpenChange,
  resumeId,
  onDone
}: TMatchJobModalProps) {
  const id = getResumeId(resumeId);
  const queryClient = useQueryClient();
  const { form } = useGetResumeById(id);
  const confirm = useWarningDialog();
  const extractAction = useAction(api.aiKeywords.extractKeywords);
  const placeAction = useAction(api.aiKeywords.placeKeyword);
  const applyMutation = useMutation(api.aiImprove.applyKeywordEdits);
  const {
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
  } = useMatchJobFlow({
    onOpenChange,
    confirm
  });

  /** Analyze JD and extract keywords. */
  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !id) return;
    startAnalyze();
    try {
      const result = await extractAction({
        resumeId: id,
        jobDescription: jobDescription.trim()
      });
      finishAnalyze(result, form);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Failed to extract keywords'
      );
      failAnalyze();
    }
  };

  /** Enhances the selected resume targets for the active keyword. */
  const handleEnhance = async () => {
    if (!selectedKeyword || selectedTargets.length === 0 || !id || !workingResume) return;
    setActiveTab(getTargetTab(selectedTargets));
    setEnhancing(true);
    try {
      const result = await placeAction({
        resumeId: id,
        keyword: selectedKeyword,
        targets: getPlacementTargets(selectedTargets)
      });
      finishKeywordPass(
        applyPlacementResultToResume(
          workingResume,
          result.updatedHighlights,
          result.addedSkills
        ),
        {
          highlightEdits: [
            ...accumulatedEdits.highlightEdits,
            ...result.updatedHighlights.map((edit) => ({
              ...edit,
              reviewId: createReviewId()
            }))
          ],
          skillAdditions: [
            ...accumulatedEdits.skillAdditions,
            ...result.addedSkills.map((addition) => ({
              ...addition,
              reviewId: createReviewId()
            }))
          ]
        },
        selectedKeyword
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to enhance');
    } finally {
      setEnhancing(false);
    }
  };

  /** Applies accepted review edits and creates a new tailored resume. */
  const handleApplyReview = async () => {
    if (!id) return;
    const nextResumeTitle = jobTitle || 'JD Tailored Resume';
    const ok = await confirm({
      title: 'Create new tailored version?',
      description: `You are about to create a new resume version for this job. New title: ${nextResumeTitle}.`,
      confirmLabel: 'Create version',
      variant: 'success'
    });
    if (!ok) return;

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
        title: nextResumeTitle,
        highlightEdits: filteredHighlights,
        skillAdditions: filteredSkills
      });
      toast.success('New tailored resume created');
      void queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
      void queryClient.invalidateQueries({ queryKey: ['resume'] });
      onDone(newResumeId);
      onOpenChange(false);
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
  const acceptedCount = acceptedHighlights.size + acceptedSkills.size;
  const resume = workingResume ?? form;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <MatchJobDialogContent>
        <MatchJobHeaderSection>
          <MatchJobHeader
            jobTitle={jobTitle}
            onClose={() => handleOpenChange(false)}
          />
          {(phase === 'matching' || phase === 'review') && (
            <MatchJobHintBar phase={phase} />
          )}
        </MatchJobHeaderSection>

        {phase === 'review' ? (
          <MatchJobReviewPanel>
            <KeywordReviewView
              edits={accumulatedEdits}
              acceptedHighlights={acceptedHighlights}
              acceptedSkills={acceptedSkills}
              onToggleHighlight={toggleAcceptedHighlight}
              onToggleSkill={toggleAcceptedSkill}
            />
          </MatchJobReviewPanel>
        ) : (
          <MatchJobBody>
            <MatchJobPanel className="border-border w-1/2 border-r">
              <JdPanel
                phase={phase}
                jobDescription={jobDescription}
                onJobDescriptionChange={setJobDescription}
                keywords={keywords}
                selectedKeyword={selectedKeyword}
                onSelectKeyword={setSelectedKeyword}
                processedKeywords={processedKeywords}
              />
            </MatchJobPanel>

            <MatchJobPanel className="dark:bg-card w-1/2 overflow-hidden bg-white">
              <DisplayTabs
                resume={resume}
                selectedTargets={selectedTargets}
                onToggleTarget={toggleTarget}
                activeTab={activeTab}
                onActiveTabChange={setActiveTab}
                disabled={phase !== 'matching'}
                enhancing={enhancing}
              />
            </MatchJobPanel>
          </MatchJobBody>
        )}

        <MatchJobFooter
          phase={phase}
          hasEdits={hasEdits}
          jobDescription={jobDescription}
          canEnhance={canEnhance}
          enhancing={enhancing}
          acceptedCount={acceptedCount}
          isApplying={isApplying}
          onAnalyze={handleAnalyze}
          onReview={goToReview}
          onEnhance={handleEnhance}
          onBackToMatching={goToMatching}
          onApply={handleApplyReview}
        />
      </MatchJobDialogContent>
    </Dialog>
  );
}
