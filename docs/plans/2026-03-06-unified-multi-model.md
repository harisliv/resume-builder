# Unified Multi-Model AI Suggestions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the single-model action the only AI function; multi-model page calls it N times with independent per-model streaming results.

**Architecture:** The single Convex action accepts an optional model config (provider + modelId + pricing). The multi-model page fires N parallel action calls. A new reducer state tracks per-model `pending | done | error` status. Tabs render immediately; results appear as each resolves.

**Tech Stack:** Convex actions, AI SDK (anthropic/google/openai), React useReducer

---

### Task 1: Add shared types to `types/aiSuggestions.ts`

**Files:**
- Modify: `types/aiSuggestions.ts`

**Step 1: Add TModelProvider and TModelConfig types**

Add after the `TModelResult` type (after line 91):

```typescript
/** Supported AI provider identifiers. */
export type TModelProvider = 'anthropic' | 'google' | 'openai';

/** Model configuration for AI suggestions. */
export type TModelConfig = {
  provider: TModelProvider;
  modelId: string;
  label: string;
  pricing: { input: number; output: number };
};

/** Per-model slot in multi-model generation. */
export type TModelSlot = {
  config: TModelConfig;
  status: 'pending' | 'done' | 'error';
  result?: TModelResult;
};
```

**Step 2: Commit**

```bash
git add types/aiSuggestions.ts
git commit -m "feat: add TModelConfig and TModelSlot types for unified multi-model"
```

---

### Task 2: Create model config array

**Files:**
- Create: `components/AiMultiModel/utils/modelConfig.ts`

**Step 1: Create the config file**

```typescript
import type { TModelConfig } from '@/types/aiSuggestions';

/**
 * Model definitions with pricing ($/1M tokens).
 * @see https://ai.google.dev/gemini-api/docs/pricing
 * @see https://docs.anthropic.com/en/docs/about-claude/pricing
 * @see https://openai.com/api/pricing/
 */
export const MULTI_MODEL_CONFIGS: readonly TModelConfig[] = [
  {
    provider: 'google',
    modelId: 'gemini-pro-latest',
    label: 'Gemini Pro Latest',
    pricing: { input: 1.25, output: 10.0 }
  },
  {
    provider: 'anthropic',
    modelId: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    pricing: { input: 3.0, output: 15.0 }
  },
  {
    provider: 'anthropic',
    modelId: 'claude-opus-4-6',
    label: 'Claude Opus 4.6',
    pricing: { input: 5.0, output: 25.0 }
  },
  {
    provider: 'openai',
    modelId: 'gpt-5.2-chat-latest',
    label: 'GPT 5.2 Chat Latest',
    pricing: { input: 1.75, output: 14.0 }
  },
  {
    provider: 'openai',
    modelId: 'gpt-5.2',
    label: 'GPT 5.2',
    pricing: { input: 1.75, output: 14.0 }
  }
] as const;

/** Default model used in single-model dialog. */
export const DEFAULT_MODEL_CONFIG: TModelConfig = MULTI_MODEL_CONFIGS[1]; // Sonnet
```

**Step 2: Commit**

```bash
git add components/AiMultiModel/utils/modelConfig.ts
git commit -m "feat: add MULTI_MODEL_CONFIGS with typed model definitions"
```

---

### Task 3: Extend single-model action to accept any model

**Files:**
- Modify: `convex/aiSuggestions.ts`

**Step 1: Add provider imports**

Add these imports at top of file alongside existing anthropic import:

```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
```

**Step 2: Add model arg + createModel helper**

Add an optional `model` arg to the action args, plus `systemPromptOverride` and `systemRuleOverride`:

```typescript
args: {
  resumeId: v.id('resumes'),
  jobDescription: v.string(),
  model: v.optional(
    v.object({
      provider: v.union(v.literal('anthropic'), v.literal('google'), v.literal('openai')),
      modelId: v.string(),
      label: v.string(),
      pricing: v.object({ input: v.number(), output: v.number() })
    })
  ),
  systemPromptOverride: v.optional(v.string()),
  systemRuleOverride: v.optional(v.string())
},
```

Add `createModel` helper before the action export (absorb from `aiSuggestionsMultiModel.ts`):

```typescript
/** Creates a provider-specific model instance. */
function createModel(provider: string, modelId: string) {
  switch (provider) {
    case 'google': {
      const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (!key) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not set');
      return createGoogleGenerativeAI({ apiKey: key })(modelId);
    }
    case 'anthropic': {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) throw new Error('ANTHROPIC_API_KEY not set');
      return createAnthropic({ apiKey: key })(modelId);
    }
    case 'openai': {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error('OPENAI_API_KEY not set');
      return createOpenAI({ apiKey: key })(modelId);
    }
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
```

**Step 3: Update handler to use model arg**

Replace the hardcoded anthropic model creation and cost calculation in the handler:

```typescript
handler: async (ctx, args) => {
  const userId = await getAuthenticatedUser(ctx);

  const role = await getUserRole(ctx);
  if (role !== 'admin') {
    await ctx.runMutation(internal.aiAttempts.consumeDailyAttempt, { userId });
  }

  const resume = await ctx.runQuery(internal.resumes.getResumeInternal, {
    resumeId: args.resumeId,
    userId
  });

  if (!resume) {
    throw new Error('Resume not found');
  }

  // Resolve model config — default to Sonnet
  const modelConfig = args.model ?? {
    provider: 'anthropic' as const,
    modelId: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    pricing: { input: 3.0, output: 15.0 }
  };

  const inputSkillCategoryNames = (resume.skills ?? []).map((category) =>
    category.name.trim()
  );

  const prompt = buildUserPrompt(
    {
      summary: resume.personalInfo?.summary,
      experience: resume.experience?.map((exp) => ({
        company: exp.company,
        position: exp.position,
        description: exp.description,
        highlights: exp.highlights
      })),
      skills: resume.skills
    },
    args.jobDescription
  );

  const basePrompt = args.systemPromptOverride ?? SYSTEM_PROMPT_5;
  const rules = args.systemRuleOverride ?? SYSTEM_SCHEMA_RULES;
  const systemPrompt = `${basePrompt}\n\n${rules}`;

  const start = Date.now();
  try {
    const aiModel = createModel(modelConfig.provider, modelConfig.modelId);
    const { output, usage } = await generateText({
      model: aiModel,
      system: systemPrompt,
      prompt,
      output: Output.object({ schema: suggestionsOutputSchema })
    });
    const durationMs = Date.now() - start;
    const suggestions = normalizeSuggestionsOutput(output);
    assertSkillCategoriesMatchInput(inputSkillCategoryNames, suggestions);
    const cost = (
      (usage.inputTokens ?? 0) * modelConfig.pricing.input +
      (usage.outputTokens ?? 0) * modelConfig.pricing.output
    ) / 1_000_000;

    return {
      modelId: modelConfig.modelId,
      label: modelConfig.label,
      suggestions,
      cost,
      durationMs,
      jdKeywords: suggestions.jdKeywords
    };
  } catch (e) {
    const durationMs = Date.now() - start;
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error('[generateResumeSuggestions] failed:', errorMsg);
    return {
      modelId: modelConfig.modelId,
      label: modelConfig.label,
      error: errorMsg,
      durationMs
    };
  }
}
```

**Step 4: Remove old hardcoded SONNET_PRICING and calculateCost**

Delete `SONNET_PRICING` const and `calculateCost` function — cost is now calculated inline using `modelConfig.pricing`.

Also remove the single `ANTHROPIC_API_KEY` check at the top of the handler (it's now in `createModel`).

**Step 5: Commit**

```bash
git add convex/aiSuggestions.ts
git commit -m "feat: extend generateResumeSuggestions to accept any model config"
```

---

### Task 4: Rewrite multi-model reducer with per-model status

**Files:**
- Modify: `components/AiMultiModel/utils/multiModelReducer.ts`

**Step 1: Rewrite the entire reducer**

```typescript
import { createDefaultSelection } from '@/types/aiSuggestions';
import type { TRawModelResult, TModelResult, TModelSlot, TModelConfig } from '@/types/aiSuggestions';

/** State for the multi-model comparison page. */
export type TMultiModelState =
  | { phase: 'idle'; jobDescription: string; systemPrompt: string; systemRule: string; error: string | null }
  | {
      phase: 'generating';
      jobDescription: string;
      systemPrompt: string;
      systemRule: string;
      models: TModelSlot[];
      activeModelIdx: number;
    }
  | {
      phase: 'results';
      jobDescription: string;
      systemPrompt: string;
      systemRule: string;
      models: TModelSlot[];
      activeModelIdx: number;
    };

export type TMultiModelAction =
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'SET_SYSTEM_PROMPT'; payload: string }
  | { type: 'SET_SYSTEM_RULE'; payload: string }
  | { type: 'GENERATE_START'; payload: { configs: readonly TModelConfig[] } }
  | { type: 'MODEL_RESULT'; payload: { modelId: string; raw: TRawModelResult } }
  | { type: 'MODEL_ERROR'; payload: { modelId: string; error: string } }
  | { type: 'SET_ACTIVE_MODEL'; payload: number }
  | { type: 'RESET' }
  | { type: 'TOGGLE_SUMMARY' }
  | { type: 'TOGGLE_EXPERIENCE_FIELD'; expIdx: number; field: 'description' | 'highlight'; highlightIdx?: number }
  | { type: 'TOGGLE_SKILL'; categoryIdx: number; skillIdx: number }
  | { type: 'REMOVE_SKILL'; category: string; skillIdx: number };

export const initialMultiModelState: TMultiModelState = {
  phase: 'idle',
  jobDescription: '',
  systemPrompt: '',
  systemRule: '',
  error: null
};

/** Converts raw backend result into UI-ready TModelResult with default selection. */
function toModelResult(raw: TRawModelResult): TModelResult {
  if (raw.error || !raw.suggestions) {
    return { modelId: raw.modelId, label: raw.label, error: raw.error ?? 'Unknown error', cost: raw.cost, durationMs: raw.durationMs };
  }
  return {
    modelId: raw.modelId,
    label: raw.label,
    editedSuggestions: structuredClone(raw.suggestions),
    selection: createDefaultSelection(raw.suggestions),
    cost: raw.cost,
    durationMs: raw.durationMs,
    jdKeywords: raw.jdKeywords ?? raw.suggestions.jdKeywords
  };
}

/** Checks if all model slots are done or errored. */
function allModelsSettled(models: TModelSlot[]): boolean {
  return models.every((m) => m.status === 'done' || m.status === 'error');
}

/** Gets the active model's result from the models array. */
function getActiveResult(state: { models: TModelSlot[]; activeModelIdx: number }): TModelResult | undefined {
  return state.models[state.activeModelIdx]?.result;
}

/** Updates the active model's result immutably. */
function updateActiveResult(
  models: TModelSlot[],
  idx: number,
  updater: (r: TModelResult) => TModelResult
): TModelSlot[] {
  return models.map((m, i) => {
    if (i !== idx || !m.result) return m;
    return { ...m, result: updater(m.result) };
  });
}

/** Reducer for multi-model AI comparison page state. */
export function multiModelReducer(state: TMultiModelState, action: TMultiModelAction): TMultiModelState {
  switch (action.type) {
    case 'SET_JOB_DESCRIPTION':
      if (state.phase !== 'idle') return state;
      return { ...state, jobDescription: action.payload };

    case 'SET_SYSTEM_PROMPT':
      if (state.phase !== 'idle') return state;
      return { ...state, systemPrompt: action.payload };

    case 'SET_SYSTEM_RULE':
      if (state.phase !== 'idle') return state;
      return { ...state, systemRule: action.payload };

    case 'GENERATE_START': {
      if (state.phase !== 'idle') return state;
      const models: TModelSlot[] = action.payload.configs.map((config) => ({
        config,
        status: 'pending'
      }));
      return {
        phase: 'generating',
        jobDescription: state.jobDescription,
        systemPrompt: state.systemPrompt,
        systemRule: state.systemRule,
        models,
        activeModelIdx: 0
      };
    }

    case 'MODEL_RESULT': {
      if (state.phase !== 'generating' && state.phase !== 'results') return state;
      const models = state.models.map((m) =>
        m.config.modelId === action.payload.modelId
          ? { ...m, status: 'done' as const, result: toModelResult(action.payload.raw) }
          : m
      );
      // Auto-select first successful model if current active is still pending
      let { activeModelIdx } = state;
      const currentActive = models[activeModelIdx];
      if (!currentActive?.result || currentActive.status === 'pending') {
        const firstDone = models.findIndex((m) => m.status === 'done' && m.result && !m.result.error);
        if (firstDone >= 0) activeModelIdx = firstDone;
      }
      const phase = allModelsSettled(models) ? 'results' : 'generating';
      return { ...state, phase, models, activeModelIdx };
    }

    case 'MODEL_ERROR': {
      if (state.phase !== 'generating' && state.phase !== 'results') return state;
      const models = state.models.map((m) =>
        m.config.modelId === action.payload.modelId
          ? {
              ...m,
              status: 'error' as const,
              result: { modelId: m.config.modelId, label: m.config.label, error: action.payload.error } as TModelResult
            }
          : m
      );
      const phase = allModelsSettled(models) ? 'results' : 'generating';
      return { ...state, phase, models, activeModelIdx: state.activeModelIdx };
    }

    case 'SET_ACTIVE_MODEL':
      if (state.phase !== 'generating' && state.phase !== 'results') return state;
      return { ...state, activeModelIdx: action.payload };

    case 'RESET':
      return initialMultiModelState;

    case 'TOGGLE_SUMMARY': {
      if (state.phase !== 'generating' && state.phase !== 'results') return state;
      const r = getActiveResult(state);
      if (!r?.selection) return state;
      return {
        ...state,
        models: updateActiveResult(state.models, state.activeModelIdx, (m) => ({
          ...m,
          selection: { ...m.selection!, summary: !m.selection!.summary }
        }))
      };
    }

    case 'TOGGLE_EXPERIENCE_FIELD': {
      if (state.phase !== 'generating' && state.phase !== 'results') return state;
      const r = getActiveResult(state);
      if (!r?.selection) return state;
      const { expIdx, field, highlightIdx } = action;
      const experience = [...r.selection.experience];
      const exp = { ...experience[expIdx] };
      if (field === 'description') {
        exp.description = !exp.description;
      } else if (highlightIdx !== undefined) {
        exp.highlights = [...exp.highlights];
        exp.highlights[highlightIdx] = !exp.highlights[highlightIdx];
      }
      experience[expIdx] = exp;
      return {
        ...state,
        models: updateActiveResult(state.models, state.activeModelIdx, (m) => ({
          ...m,
          selection: { ...m.selection!, experience }
        }))
      };
    }

    case 'TOGGLE_SKILL': {
      if (state.phase !== 'generating' && state.phase !== 'results') return state;
      const r = getActiveResult(state);
      if (!r?.selection) return state;
      const { categoryIdx, skillIdx } = action;
      const skills = [...r.selection.skills];
      if (categoryIdx < 0 || categoryIdx >= skills.length) return state;
      const cat = { ...skills[categoryIdx] };
      const sel = [...cat.selected];
      if (skillIdx >= 0 && skillIdx < sel.length) sel[skillIdx] = !sel[skillIdx];
      cat.selected = sel;
      skills[categoryIdx] = cat;
      return {
        ...state,
        models: updateActiveResult(state.models, state.activeModelIdx, (m) => ({
          ...m,
          selection: { ...m.selection!, skills }
        }))
      };
    }

    case 'REMOVE_SKILL': {
      if (state.phase !== 'generating' && state.phase !== 'results') return state;
      const r = getActiveResult(state);
      if (!r?.editedSuggestions?.skills || !r.selection) return state;
      const catIdx = r.selection.skills.findIndex((s) => s.name === action.category);
      if (catIdx === -1) return state;
      const nextSkills = r.editedSuggestions.skills.map((cat, i) =>
        i === catIdx
          ? { ...cat, values: cat.values.filter((_, si) => si !== action.skillIdx) }
          : cat
      );
      const nextSelSkills = r.selection.skills.map((cat, i) =>
        i === catIdx
          ? { ...cat, selected: cat.selected.filter((_, si) => si !== action.skillIdx) }
          : cat
      );
      return {
        ...state,
        models: updateActiveResult(state.models, state.activeModelIdx, (m) => ({
          ...m,
          editedSuggestions: { ...m.editedSuggestions!, skills: nextSkills },
          selection: { ...m.selection!, skills: nextSelSkills }
        }))
      };
    }

    default:
      return state;
  }
}
```

**Step 2: Commit**

```bash
git add components/AiMultiModel/utils/multiModelReducer.ts
git commit -m "feat: rewrite multi-model reducer with per-model status tracking"
```

---

### Task 5: Update AiMultiModelPanel for per-model status

**Files:**
- Modify: `components/AiMultiModel/AiMultiModelPanel.tsx`

**Step 1: Update props to use TModelSlot**

Change props from `results: TModelResult[]` to `models: TModelSlot[]`. Update the component to read from slots:

```typescript
import { AlertCircle, Loader2 } from 'lucide-react';
import type { TModelSlot } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { AiSuggestionsView } from '@/components/AiSuggestions/AiSuggestionsView';
import {
  MultiModelScrollArea,
  ModelButton
} from './styles/ai-multi-model.styles';

type TAiMultiModelPanelProps = {
  models: TModelSlot[];
  activeModelIdx: number;
  currentData: TResumeForm;
  onSetActiveModel: (idx: number) => void;
  onToggleSummary: () => void;
  onToggleExperienceField: (expIdx: number, field: 'description' | 'highlight', highlightIdx?: number) => void;
  onToggleSkill: (categoryIdx: number, skillIdx: number) => void;
  onRemoveSkill: (category: string, skillIdx: number) => void;
  onApply: () => void;
  onCreateVersion: () => void;
};

/** Formats cost in dollars to 4 decimal places. */
function formatCost(cost?: number): string {
  if (cost == null) return '';
  return `$${cost.toFixed(4)}`;
}

/** Formats duration in ms to seconds. */
function formatDuration(ms?: number): string {
  if (ms == null) return '';
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Right panel for multi-model comparison: model tabs + active model results + footer actions.
 */
export function AiMultiModelPanel({
  models,
  activeModelIdx,
  currentData,
  onSetActiveModel,
  onToggleSummary,
  onToggleExperienceField,
  onToggleSkill,
  onRemoveSkill,
  onApply,
  onCreateVersion
}: TAiMultiModelPanelProps) {
  const activeSlot = models[activeModelIdx];
  const active = activeSlot?.result;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Horizontal model tabs */}
      <div className="mb-3 flex shrink-0 gap-1 border-b pb-2">
        {models.map((slot, i) => (
          <ModelButton
            key={slot.config.modelId}
            active={i === activeModelIdx}
            hasError={slot.status === 'error'}
            onClick={() => onSetActiveModel(i)}
          >
            <span className="flex items-center gap-1.5">
              {slot.status === 'pending' && <Loader2 className="size-3.5 animate-spin" />}
              {slot.status === 'error' && <AlertCircle className="size-3.5" />}
              {slot.config.label}
            </span>
            {slot.result && (
              <span className="text-muted-foreground text-xs">
                {[formatDuration(slot.result.durationMs), formatCost(slot.result.cost)].filter(Boolean).join(' · ')}
              </span>
            )}
          </ModelButton>
        ))}
      </div>

      {/* Active model content */}
      <MultiModelScrollArea>
        {activeSlot?.status === 'pending' ? (
          <div className="text-muted-foreground flex items-center gap-2 p-4 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Generating…
          </div>
        ) : active?.error ? (
          <div className="text-destructive p-4 text-sm">{active.error}</div>
        ) : active?.editedSuggestions && active.selection ? (
          <AiSuggestionsView
            suggestions={active.editedSuggestions}
            currentData={currentData}
            selection={active.selection}
            onToggleSummary={onToggleSummary}
            onToggleExperienceField={onToggleExperienceField}
            onToggleSkill={onToggleSkill}
            onRemoveSkill={onRemoveSkill}
          />
        ) : (
          <div className="text-muted-foreground p-4 text-sm">No results</div>
        )}
      </MultiModelScrollArea>

      {active && !active.error && (
        <div className="flex shrink-0 justify-end gap-2 border-t pt-3">
          <Button variant="outline" onClick={onCreateVersion}>Create Version</Button>
          <Button onClick={onApply}>Apply</Button>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/AiMultiModel/AiMultiModelPanel.tsx
git commit -m "feat: update AiMultiModelPanel to use TModelSlot with per-model status"
```

---

### Task 6: Update AI page to fire N independent action calls

**Files:**
- Modify: `app/ai/page.tsx`

**Step 1: Update imports**

Replace the multi-model action import with the single-model one. Add model config import:

```typescript
// Remove:
import { api } from '@/convex/_generated/api';
// (keep api import but change what's referenced)

// Add:
import { MULTI_MODEL_CONFIGS } from '@/components/AiMultiModel/utils/modelConfig';
```

**Step 2: Update action hook**

Replace:
```typescript
const generateMultiModel = useAction(
  api.aiSuggestionsMultiModel.generateResumeSuggestionsMultiModel
);
```
With:
```typescript
const generateSingle = useAction(api.aiSuggestions.generateResumeSuggestions);
```

**Step 3: Rewrite handleGenerate**

```typescript
const handleGenerate = useCallback(async () => {
  if (!effectiveResumeId || state.phase !== 'idle' || !state.jobDescription.trim()) return;
  dispatch({ type: 'GENERATE_START', payload: { configs: MULTI_MODEL_CONFIGS } });

  MULTI_MODEL_CONFIGS.forEach((config) => {
    generateSingle({
      resumeId: effectiveResumeId,
      jobDescription: state.jobDescription,
      model: { ...config },
      systemPromptOverride: state.systemPrompt || undefined,
      systemRuleOverride: state.systemRule || undefined
    })
      .then((raw) => {
        dispatch({ type: 'MODEL_RESULT', payload: { modelId: config.modelId, raw } });
      })
      .catch((e) => {
        dispatch({
          type: 'MODEL_ERROR',
          payload: { modelId: config.modelId, error: e instanceof Error ? e.message : String(e) }
        });
      });
  });
}, [effectiveResumeId, state, generateSingle]);
```

**Step 4: Update activeJdKeywords**

Replace:
```typescript
const activeJdKeywords =
  state.phase === 'results'
    ? (state.results[state.activeModelIdx]?.jdKeywords ?? [])
    : [];
```
With:
```typescript
const activeJdKeywords =
  (state.phase === 'generating' || state.phase === 'results')
    ? (state.models[state.activeModelIdx]?.result?.jdKeywords ?? [])
    : [];
```

**Step 5: Update handleAction**

Replace:
```typescript
const handleAction = useCallback(
  (action: 'apply' | 'create-version') => {
    if (state.phase !== 'results') return;
    const active = state.results[state.activeModelIdx];
    ...
```
With:
```typescript
const handleAction = useCallback(
  (action: 'apply' | 'create-version') => {
    if (state.phase !== 'generating' && state.phase !== 'results') return;
    const active = state.models[state.activeModelIdx]?.result;
    ...
```

**Step 6: Update JSX — pass `models` instead of `results`**

In the right panel JSX, change the condition and props:

Replace:
```tsx
{state.phase === 'results' ? (
  <AiMultiModelPanel
    results={state.results}
    activeModelIdx={state.activeModelIdx}
```
With:
```tsx
{(state.phase === 'generating' || state.phase === 'results') ? (
  <AiMultiModelPanel
    models={state.models}
    activeModelIdx={state.activeModelIdx}
```

Update the "not generating" fallback — since tabs now show during generating, the else branch is only for idle:
```tsx
) : (
  <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
    Results will appear here
  </div>
)}
```

**Step 7: Update the generating message in the button area**

The `isGenerating` logic and generate button text remain the same. But remove the "Querying 3 models in parallel…" loader from the right panel (it's now handled by per-tab spinners).

**Step 8: Commit**

```bash
git add app/ai/page.tsx
git commit -m "feat: fire N independent action calls from multi-model page"
```

---

### Task 7: Delete `convex/aiSuggestionsMultiModel.ts`

**Files:**
- Delete: `convex/aiSuggestionsMultiModel.ts`

**Step 1: Delete the file**

```bash
git rm convex/aiSuggestionsMultiModel.ts
```

**Step 2: Verify no remaining imports**

Search for any references to `aiSuggestionsMultiModel` in the codebase. There should be none after Task 6.

**Step 3: Commit**

```bash
git commit -m "chore: delete aiSuggestionsMultiModel (replaced by unified single action)"
```

---

### Task 8: Build verification

**Step 1: Run build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

**Step 2: Fix any type errors or import issues**

Check for:
- Missing imports of `TModelSlot` or `TModelConfig`
- Stale references to `aiSuggestionsMultiModel`
- Reducer action type mismatches

**Step 3: Final commit if needed**

```bash
git add -A
git commit -m "fix: resolve build errors from multi-model unification"
```
