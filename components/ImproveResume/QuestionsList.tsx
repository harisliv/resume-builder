'use client';

import { Quote } from 'lucide-react';
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
            <span className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
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
            {q.context ? (
              <div className="bg-muted/40 border-border/40 relative mb-3 overflow-hidden rounded-r-2xl border py-4 pr-5 pl-7">
                <div className="bg-primary absolute top-0 bottom-0 left-0 w-1.5" />
                <div className="flex gap-3">
                  <Quote
                    aria-hidden="true"
                    className="text-primary/45 mt-0.5 h-4 w-4 shrink-0"
                  />
                  <blockquote className="text-foreground/90 text-sm leading-relaxed font-medium italic">
                    {q.context}
                  </blockquote>
                </div>
              </div>
            ) : null}
            <input
              id={`q-${i}`}
              type="text"
              value={answers[i] ?? ''}
              onChange={(e) => onAnswerChange(i, e.target.value)}
              placeholder="Add the missing detail..."
              className="border-border focus:border-primary w-full border-0 border-b-2 bg-transparent px-0 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
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
