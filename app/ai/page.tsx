'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';
import type { TAiSuggestions } from '@/types/aiSuggestions';
import { Button } from '@/components/ui/button';
import { AiSuggestionsDialog } from '@/components/AiSuggestions';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { useGetResumeById } from '@/hooks/useGetResumeById';

/** Private page to manually test real AI suggestions flow. */
export default function AiSuggestionsTestPage() {
  const [open, setOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<Id<'resumes'> | undefined>(
    undefined
  );
  const [lastActionResult, setLastActionResult] = useState<string>('');
  const { data: resumeTitles, isLoading: isLoadingTitles } = useGetUserResumeTitles();
  const effectiveResumeId = useMemo(() => {
    if (!resumeTitles?.length) return undefined;
    if (!selectedResumeId) return resumeTitles[0].id;
    return resumeTitles.some((resume) => resume.id === selectedResumeId)
      ? selectedResumeId
      : resumeTitles[0].id;
  }, [resumeTitles, selectedResumeId]);
  const { form: currentData, isLoading: isLoadingResume } =
    useGetResumeById(effectiveResumeId);

  const canOpenDialog = useMemo(
    () => Boolean(effectiveResumeId) && !isLoadingResume,
    [effectiveResumeId, isLoadingResume]
  );

  /** Captures selected suggestions payload without writing to DB. */
  const handleAction = (action: 'apply' | 'create-version', suggestions: TAiSuggestions) => {
    setLastActionResult(JSON.stringify({ action, suggestions }, null, 2));
    // eslint-disable-next-line no-console
    console.log(`[AI test] ${action}`, suggestions);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Sparkles className="size-6" />
          AI Suggestions (Manual Test)
        </h1>
        <Link href="/" className="text-muted-foreground text-sm hover:underline">
          ← Back to app
        </Link>
      </div>

      <p className="text-muted-foreground mb-6">
        Uses real Convex AI generation with the exact dialog flow. Apply/Create
        actions are non-persistent on this page.
      </p>

      <div className="mb-4">
        <label htmlFor="resume-select" className="mb-2 block text-sm font-medium">
          Resume
        </label>
        <select
          id="resume-select"
          className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
          value={effectiveResumeId ?? ''}
          onChange={(e) => setSelectedResumeId(e.target.value as Id<'resumes'>)}
          disabled={isLoadingTitles || !resumeTitles?.length}
        >
          {!resumeTitles?.length ? (
            <option value="">No resumes found</option>
          ) : (
            resumeTitles.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.title}
              </option>
            ))
          )}
        </select>
      </div>

      <Button onClick={() => setOpen(true)} disabled={!canOpenDialog}>
        <Sparkles className="size-4" />
        Open AI Suggestions
      </Button>

      {effectiveResumeId && (
        <AiSuggestionsDialog
          open={open}
          onOpenChange={setOpen}
          resumeId={effectiveResumeId}
          currentData={currentData}
          onApply={(suggestions) => handleAction('apply', suggestions)}
          onCreateNewVersion={(suggestions) =>
            handleAction('create-version', suggestions)
          }
        />
      )}

      {lastActionResult && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-medium">Last action payload</h2>
          <pre className="bg-muted max-h-80 overflow-auto rounded-md p-3 text-xs">
            {lastActionResult}
          </pre>
        </div>
      )}
    </div>
  );
}
