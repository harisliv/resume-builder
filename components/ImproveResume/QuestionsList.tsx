'use client';

import type { TImproveQuestion } from '@/types/aiImprove';

type TQuestionsListProps = {
  questions: TImproveQuestion[];
  answers: string[];
  onAnswerChange: (index: number, value: string) => void;
};

/** Scrollable list of all AI-generated questions with inline text inputs. */
export function QuestionsList({
  questions,
  answers,
  onAnswerChange
}: TQuestionsListProps) {
  return (
    <div className="space-y-8">
      {questions.map((q, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-start gap-4">
            <span className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {i + 1}
            </span>
            <label
              htmlFor={`q-${i}`}
              className="text-foreground text-sm leading-snug font-semibold"
            >
              {q.question}
            </label>
          </div>
          <div className="ml-10">
            <input
              id={`q-${i}`}
              type="text"
              value={answers[i] ?? ''}
              onChange={(e) => onAnswerChange(i, e.target.value)}
              placeholder={q.context ? `Re: "${q.context}"` : 'Your answer...'}
              className="border-border focus:border-primary bg-transparent w-full border-0 border-b-2 px-0 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
            />
          </div>
        </div>
      ))}
      {/* Pro Tip card */}
      <div className="bg-muted/50 border-border/30 ml-10 flex items-start gap-4 rounded-xl border p-5">
        <span className="text-primary text-lg">💡</span>
        <div>
          <h4 className="text-foreground text-sm font-bold">Pro Tip</h4>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Hiring managers prioritize candidates who can prove their impact
            with hard numbers. Even approximations are better than generic
            descriptions.
          </p>
        </div>
      </div>
    </div>
  );
}
