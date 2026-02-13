'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { AiSuggestionsDialog } from '@/components/AiSuggestions';
import { MOCK_CURRENT_DATA } from '@/components/AiSuggestions/mockSuggestions';
import type { TAiSuggestions } from '@/types/aiSuggestions';
import type { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';

/**
 * Mock route for testing AI suggestions UI workflow.
 * Uses AiSuggestionsDialog with mockMode: Generate shows mock data; Apply/Create Version log only.
 */
export default function MockAiSuggestionsPage() {
  const [open, setOpen] = useState(false);

  const handleApply = (suggestions: TAiSuggestions) => {
    // eslint-disable-next-line no-console
    console.log('Apply to Current (mock):', JSON.stringify(suggestions, null, 2));
  };

  const handleCreateVersion = (suggestions: TAiSuggestions) => {
    const title = suggestions.title ?? 'Untitled (AI Tailored)';
    // eslint-disable-next-line no-console
    console.log(`Create New Version (mock) — title: "${title}"`, JSON.stringify(suggestions, null, 2));
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Sparkles className="size-6" />
          AI Resume Suggestions (Mock)
        </h1>
        <Link
          href="/"
          className="text-muted-foreground text-sm hover:underline"
        >
          ← Back to app
        </Link>
      </div>

      <p className="text-muted-foreground mb-6">
        Opens the same AiSuggestionsDialog used in the app. Mock mode shows
        sample data on Generate.
      </p>

      <Button onClick={() => setOpen(true)}>
        <Sparkles className="size-4" />
        Open AI Suggestions
      </Button>

      <AiSuggestionsDialog
        open={open}
        onOpenChange={setOpen}
        resumeId={'mock_resume_id' as Id<'resumes'>}
        currentData={MOCK_CURRENT_DATA}
        onApply={handleApply}
        onCreateNewVersion={handleCreateVersion}
        mockMode
      />
    </div>
  );
}
