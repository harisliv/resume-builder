'use client';

import type { TExtractedKeyword } from '@/types/aiKeywords';
import { HighlightedJd } from './HighlightedJd';

type TJdPanelProps = {
  phase: 'input' | 'analyzing' | 'matching' | 'review';
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  keywords: TExtractedKeyword[];
  selectedKeyword: string | null;
  onSelectKeyword: (canonicalName: string | null) => void;
  processedKeywords: Set<string>;
};

/** Left panel: JD textarea (input) or highlighted keywords (matching). */
export function JdPanel({
  phase,
  jobDescription,
  onJobDescriptionChange,
  keywords,
  selectedKeyword,
  onSelectKeyword,
  processedKeywords
}: TJdPanelProps) {
  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  if (phase === 'input' || phase === 'analyzing') {
    return (
      <div className="flex flex-1 flex-col p-8">
        <div className="mb-4 flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Input Details
          </label>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Please paste a job description on the left to begin the AI matching analysis.
          </p>
        </div>
        <div className="relative flex-1">
          <textarea
            className="h-full w-full resize-none rounded-xl border-none bg-muted p-6 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20"
            placeholder="Paste your job description here..."
            value={jobDescription}
            onChange={e => onJobDescriptionChange(e.target.value)}
            disabled={phase === 'analyzing'}
          />
          <div className="absolute right-4 bottom-4 text-[10px] font-medium uppercase tracking-tighter text-muted-foreground/50">
            {wordCount} Words
          </div>
        </div>
      </div>
    );
  }

  // matching or done
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border bg-muted/50 px-8 py-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Job Description
        </h3>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-8 py-6">
        <HighlightedJd
          text={jobDescription}
          keywords={keywords}
          selectedKeyword={selectedKeyword}
          onSelectKeyword={onSelectKeyword}
          processedKeywords={processedKeywords}
        />
      </div>
    </div>
  );
}
