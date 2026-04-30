'use client';

import { Dialog } from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { useImproveFlow } from './useImproveFlow';
import { QuestionsList } from './QuestionsList';
import { EditReviewList } from './EditReviewList';
import { ImproveResumeHeader } from './ui/ImproveResumeHeader';
import { ImproveResumeFooter } from './ui/ImproveResumeFooter';
import {
  QuestionsListSkeleton,
  EditReviewSkeleton
} from './ui/ImproveSkeletons';
import {
  ImproveBody,
  ImproveCenteredContent,
  ImproveDialogContent,
  ImprovePrimaryAction
} from './styles/improve-resume-shell.styles';

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
  const confirm = useWarningDialog();
  const flow = useImproveFlow({ open, resumeId, onOpenChange, onDone, confirm });

  return (
    <Dialog open={open} onOpenChange={flow.handleOpenChange}>
      <ImproveDialogContent>
        <ImproveResumeHeader phase={flow.phase} onClose={flow.handleClose} />

        <ImproveBody>
          {flow.phase === 'idle' && (
            <ImproveCenteredContent className="flex-col gap-4 text-center">
              <p className="text-muted-foreground text-sm">
                The AI will analyze your resume and ask targeted questions to
                improve weak bullets with hard metrics.
              </p>
              <ImprovePrimaryAction onClick={flow.handleStart}>
                <Sparkles className="h-4 w-4" />
                Start Resume Review
              </ImprovePrimaryAction>
            </ImproveCenteredContent>
          )}

          {flow.phase === 'loading' && <QuestionsListSkeleton />}

          {flow.phase === 'questions' && (
            <QuestionsList
              questions={flow.questions}
              answers={flow.answers}
              onAnswerChange={flow.updateAnswer}
            />
          )}

          {flow.phase === 'generating' && <EditReviewSkeleton />}

          {flow.phase === 'review' && (
            <EditReviewList
              edits={flow.edits}
              selectedSet={flow.selectedSet}
              onToggle={flow.handleToggle}
            />
          )}
        </ImproveBody>

        <ImproveResumeFooter
          phase={flow.phase}
          hasAnswers={flow.hasAnswers}
          selectedCount={flow.selectedSet.size}
          isApplying={flow.isApplying}
          onClose={flow.handleClose}
          onAnalyzeAnswers={flow.handleAnalyzeAnswers}
          onApply={flow.handleApply}
        />
      </ImproveDialogContent>
    </Dialog>
  );
}
