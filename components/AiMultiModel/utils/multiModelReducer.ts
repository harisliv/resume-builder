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
        m.config.id === action.payload.modelId
          ? { ...m, status: 'done' as const, result: toModelResult(action.payload.raw) }
          : m
      );
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
        m.config.id === action.payload.modelId
          ? {
              ...m,
              status: 'error' as const,
              result: { modelId: m.config.id, label: m.config.label, error: action.payload.error } as TModelResult
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
