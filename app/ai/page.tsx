'use client';

import { useReducer, useMemo, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useAction, useQuery } from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import type { TAiSuggestions } from '@/types/aiSuggestions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { JdKeywordHighlight } from '@/components/AiSuggestions/utils/JdKeywordHighlight';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { useGetResumeById } from '@/hooks/useGetResumeById';
import { useResumeSubmit } from '@/hooks/useResumeSubmit';
import { buildFilteredSuggestions } from '@/components/AiSuggestions/utils/filterSuggestions';
import { AiMultiModelPanel } from '@/components/AiMultiModel';
import { MultiModelLayout } from '@/components/AiMultiModel/styles/ai-multi-model.styles';
import { MULTI_MODEL_CONFIGS } from '@/components/AiMultiModel/utils/modelConfig';
import {
  multiModelReducer,
  initialMultiModelState
} from '@/components/AiMultiModel/utils/multiModelReducer';

/** Multi-model AI comparison page at /ai. */
export default function AiMultiModelPage() {
  const [state, dispatch] = useReducer(
    multiModelReducer,
    initialMultiModelState
  );
  const [selectedResumeId, setSelectedResumeId] = useReducer(
    (_: Id<'resumes'> | undefined, v: Id<'resumes'> | undefined) => v,
    undefined
  );
  const { data: resumeTitles, isLoading: isLoadingTitles } =
    useGetUserResumeTitles();
  const systemPrompts = useQuery(api.systemPrompts.list, { type: 'prompt' });
  const systemRules = useQuery(api.systemPrompts.list, { type: 'rule' });
  const generateSingle = useAction(api.aiSuggestions.generateResumeSuggestions);
  const { mutate: submitResume } = useResumeSubmit();
  const [confirmOpen, setConfirmOpen] = useState(false);

  /** Auto-select first system prompt when loaded. */
  useEffect(() => {
    if (systemPrompts?.length && !state.systemPrompt) {
      dispatch({
        type: 'SET_SYSTEM_PROMPT',
        payload: systemPrompts[0].content
      });
    }
  }, [systemPrompts, state.systemPrompt]);

  /** Auto-select first rule when loaded. */
  useEffect(() => {
    if (systemRules?.length && !state.systemRule) {
      dispatch({ type: 'SET_SYSTEM_RULE', payload: systemRules[0].content });
    }
  }, [systemRules, state.systemRule]);

  const effectiveResumeId = useMemo(() => {
    if (!resumeTitles?.length) return undefined;
    if (!selectedResumeId) return resumeTitles[0].id;
    return resumeTitles.some((r) => r.id === selectedResumeId)
      ? selectedResumeId
      : resumeTitles[0].id;
  }, [resumeTitles, selectedResumeId]);

  const {
    form: currentData,
    info: currentInfo,
    isLoading: isLoadingResume
  } = useGetResumeById(effectiveResumeId);

  const handleGenerate = useCallback(async () => {
    if (
      !effectiveResumeId ||
      state.phase !== 'idle' ||
      !state.jobDescription.trim()
    )
      return;
    dispatch({
      type: 'GENERATE_START',
      payload: { configs: MULTI_MODEL_CONFIGS }
    });

    MULTI_MODEL_CONFIGS.forEach((config) => {
      generateSingle({
        resumeId: effectiveResumeId,
        jobDescription: state.jobDescription,
        model: {
          provider: config.provider,
          modelId: config.id,
          label: config.label,
          pricing: config.pricing
        },
        systemPromptOverride: state.systemPrompt || undefined,
        systemRuleOverride: state.systemRule || undefined
      })
        .then((raw) => {
          dispatch({
            type: 'MODEL_RESULT',
            payload: { modelId: config.id, raw }
          });
        })
        .catch((e) => {
          dispatch({
            type: 'MODEL_ERROR',
            payload: {
              modelId: config.id,
              error: e instanceof Error ? e.message : String(e)
            }
          });
        });
    });
  }, [effectiveResumeId, state, generateSingle]);

  /** Merges AI suggestions into the current resume form shape. */
  const mergeSuggestions = useCallback(
    (suggestions: TAiSuggestions) => ({
      ...currentData,
      personalInfo: {
        ...currentData.personalInfo,
        ...(suggestions.summary && { summary: suggestions.summary })
      },
      experience: currentData.experience.map((exp, idx) => ({
        ...exp,
        ...(suggestions.experience?.[idx]?.description && {
          description: suggestions.experience[idx].description
        }),
        ...(suggestions.experience?.[idx]?.highlights && {
          highlights: suggestions.experience[idx].highlights!.map((h) => ({
            value: h
          }))
        })
      })),
      skills: suggestions.skills
        ? suggestions.skills.map((cat) => ({
            name: cat.name,
            values: cat.values.map((v) => ({ value: v }))
          }))
        : currentData.skills
    }),
    [currentData]
  );

  /** Creates a new resume version from the active model's filtered suggestions. */
  const handleCreateVersion = useCallback(() => {
    if (state.phase !== 'generating' && state.phase !== 'results') return;
    const active = state.models[state.activeModelIdx]?.result;
    if (!active?.editedSuggestions || !active.selection) return;
    const filtered = buildFilteredSuggestions(
      active.editedSuggestions,
      active.selection
    );
    const mergedForm = mergeSuggestions(filtered);
    submitResume({
      ...mergedForm,
      id: undefined,
      title: filtered.title ?? `${currentInfo.title} (${active.label})`,
      documentStyle: currentInfo.documentStyle
    });
    setConfirmOpen(false);
  }, [state, mergeSuggestions, submitResume, currentInfo]);

  const activeJdKeywords =
    state.phase === 'generating' || state.phase === 'results'
      ? (state.models[state.activeModelIdx]?.result?.jdKeywords ?? [])
      : [];

  return (
    <div className="h-dvh overflow-hidden p-12">
      <MultiModelLayout>
        {/* Left panel — input */}
        <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden px-2">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-xl font-semibold">
              <Sparkles className="size-5" />
              Multi-Model AI
            </h1>
            <Link
              href="/"
              className="text-muted-foreground text-sm hover:underline"
            >
              ← Back
            </Link>
          </div>

          {/* Resume — label + dropdown in one row */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="resume-select"
              className="w-28 shrink-0 text-sm font-medium"
            >
              Resume
            </label>
            <select
              id="resume-select"
              className="border-input bg-background h-9 flex-1 rounded-md border px-3 text-sm"
              value={effectiveResumeId ?? ''}
              onChange={(e) =>
                setSelectedResumeId(e.target.value as Id<'resumes'>)
              }
              disabled={isLoadingTitles || !resumeTitles?.length}
            >
              {!resumeTitles?.length ? (
                <option value="">No resumes found</option>
              ) : (
                resumeTitles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* System Prompt — label + dropdown row, then accordion */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="prompt-select"
              className="w-28 shrink-0 text-sm font-medium"
            >
              System Prompt
            </label>
            <select
              id="prompt-select"
              className="border-input bg-background h-9 flex-1 rounded-md border px-3 text-sm"
              value={
                systemPrompts?.find((p) => p.content === state.systemPrompt)
                  ?._id ?? ''
              }
              onChange={(e) => {
                const selected = systemPrompts?.find(
                  (p) => p._id === e.target.value
                );
                if (selected)
                  dispatch({
                    type: 'SET_SYSTEM_PROMPT',
                    payload: selected.content
                  });
              }}
              disabled={state.phase !== 'idle' || !systemPrompts?.length}
            >
              {!systemPrompts?.length ? (
                <option value="">No prompts</option>
              ) : (
                systemPrompts.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="system-prompt" className="border-b-0">
              <AccordionTrigger className="py-1.5 text-xs">
                View / Edit Prompt
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  id="prompt-input"
                  className="max-h-[33vh] min-h-[120px] resize-none text-xs"
                  value={state.systemPrompt}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_SYSTEM_PROMPT',
                      payload: e.target.value
                    })
                  }
                  disabled={state.phase !== 'idle'}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Rules — label + dropdown row, then accordion */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="rule-select"
              className="w-28 shrink-0 text-sm font-medium"
            >
              Rules
            </label>
            <select
              id="rule-select"
              className="border-input bg-background h-9 flex-1 rounded-md border px-3 text-sm"
              value={
                systemRules?.find((r) => r.content === state.systemRule)?._id ??
                ''
              }
              onChange={(e) => {
                const selected = systemRules?.find(
                  (r) => r._id === e.target.value
                );
                if (selected)
                  dispatch({
                    type: 'SET_SYSTEM_RULE',
                    payload: selected.content
                  });
              }}
              disabled={state.phase !== 'idle' || !systemRules?.length}
            >
              {!systemRules?.length ? (
                <option value="">No rules</option>
              ) : (
                systemRules.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="rules" className="border-b-0">
              <AccordionTrigger className="py-1.5 text-xs">
                View / Edit Rules
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  id="rule-input"
                  className="max-h-[33vh] min-h-[120px] resize-none text-xs"
                  value={state.systemRule}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_SYSTEM_RULE',
                      payload: e.target.value
                    })
                  }
                  disabled={state.phase !== 'idle'}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Job Description — label then textarea fills remaining space */}
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
            <label htmlFor="jd-input" className="text-sm font-medium">
              Job Description
              {activeJdKeywords.length > 0 && (
                <span className="text-muted-foreground ml-2 text-xs font-normal">
                  ({activeJdKeywords.length} keywords matched)
                </span>
              )}
            </label>
            {state.phase !== 'idle' ? (
              <div className="border-input bg-muted/30 min-h-0 flex-1 overflow-y-auto rounded-md border p-3">
                <JdKeywordHighlight
                  text={state.jobDescription}
                  keywords={activeJdKeywords}
                  className="text-sm whitespace-pre-wrap"
                />
              </div>
            ) : (
              <Textarea
                id="jd-input"
                className="min-h-0 flex-1 resize-none overflow-y-auto"
                placeholder="Paste job description here…"
                value={state.jobDescription}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_JOB_DESCRIPTION',
                    payload: e.target.value
                  })
                }
                disabled={state.phase !== 'idle'}
              />
            )}
          </div>

          {state.phase === 'idle' && state.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}

          {/* Sticky bottom button */}
          <div className="bg-background flex shrink-0 gap-2 border-t pt-3">
            {state.phase === 'idle' ? (
              <Button
                onClick={handleGenerate}
                disabled={
                  isLoadingResume ||
                  !effectiveResumeId ||
                  !state.jobDescription.trim()
                }
                className="flex-1"
              >
                Generate
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => dispatch({ type: 'RESET' })}
                className="flex-1"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Right panel — results */}
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          {state.phase === 'generating' || state.phase === 'results' ? (
            <AiMultiModelPanel
              models={state.models}
              activeModelIdx={state.activeModelIdx}
              currentData={currentData}
              onSetActiveModel={(idx) =>
                dispatch({ type: 'SET_ACTIVE_MODEL', payload: idx })
              }
              onToggleSummary={() => dispatch({ type: 'TOGGLE_SUMMARY' })}
              onToggleExperienceField={(expIdx, field, highlightIdx) =>
                dispatch({
                  type: 'TOGGLE_EXPERIENCE_FIELD',
                  expIdx,
                  field,
                  highlightIdx
                })
              }
              onToggleSkill={(categoryIdx, skillIdx) =>
                dispatch({ type: 'TOGGLE_SKILL', categoryIdx, skillIdx })
              }
              onRemoveSkill={(category, skillIdx) =>
                dispatch({ type: 'REMOVE_SKILL', category, skillIdx })
              }
              onCreateVersion={() => setConfirmOpen(true)}
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              Results will appear here
            </div>
          )}
        </div>
      </MultiModelLayout>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create new version?</AlertDialogTitle>
            <AlertDialogDescription>
              You will create the{' '}
              <strong>
                {state.phase === 'generating' || state.phase === 'results'
                  ? state.models[state.activeModelIdx]?.config.label
                  : ''}
              </strong>{' '}
              version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateVersion}>
              Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
